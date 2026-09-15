import * as THREE from 'three'

/**
 * RobotController —— NOVA-1 机器人控制核心
 * 负责：关节映射、状态机、程序化行走动画、姿态动作、表情、注视跟随
 *
 * 模型坐标约定：glTF 导入后机器人面向 +Z，robot_root 位于髋部 y=0.94
 * 关节命名来自 Blender：joint_spine / joint_neck / joint_shoulder_l|r /
 * joint_elbow_l|r / joint_wrist_l|r / joint_hip_l|r / joint_knee_l|r / joint_ankle_l|r
 */

const HIP_HEIGHT = 0.94

export const STATES = {
  IDLE: 'idle', WALK: 'walk', WAVE: 'wave', BOW: 'bow',
  DANCE: 'dance', HANDSHAKE: 'handshake', TALK: 'talk',
  CHARGE: 'charge', SLEEP: 'sleep',
}

export const STATE_LABEL = {
  idle: '待机', walk: '行走', wave: '挥手', bow: '鞠躬',
  dance: '舞蹈', handshake: '握手', talk: '交流中',
  charge: '充电中', sleep: '休眠',
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const damp = (cur, target, lambda, dt) => THREE.MathUtils.damp(cur, target, lambda, dt)

export class RobotController {
  constructor(gltfScene) {
    this.group = new THREE.Group()          // 世界位移/朝向
    this.group.add(gltfScene)
    this.root = gltfScene.getObjectByName('robot_root')
    this.baseRootY = HIP_HEIGHT

    // ---- 关节映射 ----
    this.j = {}
    const names = [
      'joint_spine', 'joint_neck',
      'joint_shoulder_l', 'joint_elbow_l', 'joint_wrist_l',
      'joint_shoulder_r', 'joint_elbow_r', 'joint_wrist_r',
      'joint_hip_l', 'joint_knee_l', 'joint_ankle_l',
      'joint_hip_r', 'joint_knee_r', 'joint_ankle_r',
    ]
    for (const n of names) this.j[n] = gltfScene.getObjectByName(n)

    // 记录每个关节的静止姿态
    this.rest = {}
    for (const n of names) {
      const o = this.j[n]
      this.rest[n] = { pos: o.position.clone(), rot: o.rotation.clone() }
    }

    // ---- 眼睛（表情动画） ----
    this.eyeL = gltfScene.getObjectByName('eye_l')
    this.eyeR = gltfScene.getObjectByName('eye_r')
    const eyeMat = this.eyeL.material.clone()
    this.eyeL.material = eyeMat
    this.eyeR.material = eyeMat
    this.eyeMat = eyeMat
    this.eyeBaseColor = eyeMat.emissive.clone()
    this.eyeBaseIntensity = eyeMat.emissiveIntensity
    this.eyeBaseScaleL = this.eyeL.scale.clone()
    this.eyeBaseScaleR = this.eyeR.scale.clone()
    this.eyeBasePosL = this.eyeL.position.clone()
    this.eyeBasePosR = this.eyeR.position.clone()

    this.neckRing = gltfScene.getObjectByName('neck_ring')
    this.lidarHead = gltfScene.getObjectByName('lidar_head')

    // ---- 材质收集（透视用） ----
    this.shellMats = new Set()
    gltfScene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true
        const m = o.material
        if (m && (m.name === 'mat_shell' || m.name === 'mat_shell_dark')) this.shellMats.add(m)
      }
    })

    // ---- 爆炸拆解数据 ----
    this.explodeItems = []
    const center = new THREE.Vector3(0, 0.95, 0)
    const wp = new THREE.Vector3()
    gltfScene.updateWorldMatrix(true, true)
    gltfScene.traverse((o) => {
      if (o.isMesh && o.name !== 'chest_screen') {
        o.getWorldPosition(wp)
        const dir = wp.clone().sub(center)
        const len = dir.length() || 1
        dir.divideScalar(len)
        const q = new THREE.Quaternion()
        o.parent.getWorldQuaternion(q)
        dir.applyQuaternion(q.invert())
        const isShell = this.shellMats.has(o.material)
        this.explodeItems.push({
          mesh: o, base: o.position.clone(),
          dir, weight: isShell ? 0.42 : 0.16,
        })
      }
    })

    // ---- 运行状态 ----
    this.state = STATES.IDLE
    this.stateTime = 0
    this.poseTarget = null        // {jointName: {x,y,z}}
    this.poseOverlay = null       // fn(t) 叠加振荡
    this.poseTimer = 0
    this.poseDuration = 0

    this.walkPhase = 0
    this.moveInput = { forward: 0, turn: 0 }   // -1..1
    this.speed = 1.0
    this.gait = 1.0
    this.heading = 0

    this.gazeEnabled = true
    this.gazeTarget = new THREE.Vector3(0, 1.5, 4)
    this.expression = 'normal'
    this.blinkTimer = 2.5
    this.blinking = 0

    this.battery = 0.87
    this.temp = 36.5
    this.explodeAmount = 0

    this.stateListeners = []
    this._tmpV = new THREE.Vector3()
  }

  onStateChange(fn) { this.stateListeners.push(fn) }

  setState(s) {
    if (this.state === s) return
    this.state = s
    this.stateTime = 0
    this.stateListeners.forEach((f) => f(s))
  }

  /** 是否允许姿态/交流动作 */
  canAct() { return this.state === STATES.IDLE }

  /** 是否接受行走输入 */
  canWalk() { return this.state === STATES.IDLE || this.state === STATES.WALK }

  // ----------------------------------------------------------
  // 姿态动作
  // ----------------------------------------------------------
  doPose(name) {
    if (name === 'reset') {
      this.poseTarget = null
      this.poseOverlay = null
      this.setState(STATES.IDLE)
      return true
    }
    if (!this.canAct()) return false

    switch (name) {
      case 'wave':
        this.poseTarget = {
          joint_shoulder_r: { z: -2.25, x: 0 },
          joint_elbow_r: { z: -0.35 },
          joint_neck: { x: -0.08 },
          joint_shoulder_l: { z: 0.12 },
        }
        this.poseOverlay = (t) => {
          this.j.joint_wrist_r.rotation.z = Math.sin(t * 9) * 0.55
          this.j.joint_elbow_r.rotation.z = -0.35 + Math.sin(t * 9) * 0.18
        }
        this.poseDuration = 3.2
        this.setState(STATES.WAVE)
        break
      case 'bow':
        this.poseTarget = {
          joint_spine: { x: 0.72 },
          joint_neck: { x: 0.42 },
          joint_shoulder_l: { x: -0.28 }, joint_shoulder_r: { x: -0.28 },
          joint_hip_l: { x: -0.1 }, joint_hip_r: { x: -0.1 },
          joint_knee_l: { x: 0.14 }, joint_knee_r: { x: 0.14 },
        }
        this.poseDuration = 3.0
        this.setState(STATES.BOW)
        break
      case 'handshake':
        this.poseTarget = {
          joint_shoulder_r: { x: -1.45 },
          joint_elbow_r: { x: -0.25 },
          joint_spine: { x: 0.16 },
          joint_neck: { x: 0.06 },
        }
        this.poseOverlay = (t) => {
          this.j.joint_elbow_r.rotation.x = -0.25 + Math.sin(t * 5.5) * 0.12
        }
        this.poseDuration = 3.4
        this.setState(STATES.HANDSHAKE)
        break
      case 'dance':
        this.poseTarget = {
          joint_shoulder_l: { z: 1.9 }, joint_shoulder_r: { z: -1.9 },
          joint_elbow_l: { z: 0.5 }, joint_elbow_r: { z: -0.5 },
        }
        this.poseOverlay = (t) => {
          const b = t * 5.2
          this.j.joint_spine.rotation.y = Math.sin(b * 0.5) * 0.3
          this.j.joint_spine.rotation.x = 0.08 + Math.sin(b) * 0.06
          this.j.joint_neck.rotation.y = Math.sin(b * 0.5 + 1.2) * 0.35
          this.j.joint_shoulder_l.rotation.x = Math.sin(b) * 0.5
          this.j.joint_shoulder_r.rotation.x = Math.sin(b + Math.PI) * 0.5
          this.root.position.y = this.baseRootY - 0.03 + Math.abs(Math.sin(b * 0.5)) * 0.05
          this.j.joint_hip_l.rotation.x = -0.1 + Math.sin(b * 0.5) * 0.12
          this.j.joint_hip_r.rotation.x = -0.1 + Math.sin(b * 0.5 + Math.PI) * 0.12
        }
        this.poseDuration = 8.0
        this.setState(STATES.DANCE)
        break
    }
    this.poseTimer = 0
    return true
  }

  /** 进入充电 */
  startCharge() {
    if (!this.canAct()) return false
    this.poseTarget = {
      joint_hip_l: { x: -0.5 }, joint_hip_r: { x: -0.5 },
      joint_knee_l: { x: 0.85 }, joint_knee_r: { x: 0.85 },
      joint_ankle_l: { x: -0.32 }, joint_ankle_r: { x: -0.32 },
      joint_spine: { x: 0.28 },
      joint_neck: { x: 0.34 },
      joint_shoulder_l: { x: -0.15 }, joint_shoulder_r: { x: -0.15 },
    }
    this.poseOverlay = null
    this.poseDuration = Infinity
    this.setState(STATES.CHARGE)
    return true
  }

  toggleSleep() {
    if (this.state === STATES.SLEEP) {
      this.poseTarget = null
      this.setState(STATES.IDLE)
      return 'wake'
    }
    if (!this.canAct()) return false
    this.poseTarget = {
      joint_neck: { x: 0.5 },
      joint_spine: { x: 0.12 },
      joint_shoulder_l: { z: 0.06 }, joint_shoulder_r: { z: -0.06 },
    }
    this.poseDuration = Infinity
    this.setState(STATES.SLEEP)
    return 'sleep'
  }

  /** 对话状态由外部驱动（listening/thinking/answer），此处仅进入/退出 */
  enterTalk() {
    if (!this.canAct()) return false
    this.setState(STATES.TALK)
    return true
  }
  exitTalk() { if (this.state === STATES.TALK) this.setState(STATES.IDLE) }

  setExpression(e) {
    this.expression = e
  }

  // ----------------------------------------------------------
  // 主更新
  // ----------------------------------------------------------
  update(dt, t) {
    this.stateTime += dt

    // 电量与温度
    const walking = this.state === STATES.WALK
    if (this.state === STATES.CHARGE) {
      this.battery = Math.min(1, this.battery + dt * 0.06)
    } else {
      this.battery = Math.max(0.05, this.battery - dt * (walking ? 0.004 : 0.0008))
    }
    const tempTarget = 36.5 + (walking ? 6 : this.state === STATES.DANCE ? 8 : 0.5)
    this.temp = damp(this.temp, tempTarget, 0.5, dt)

    // 眨眼
    this.blinkTimer -= dt
    if (this.blinkTimer <= 0 && this.state !== STATES.SLEEP) {
      this.blinking = 0.14
      this.blinkTimer = 2 + Math.random() * 3
    }
    if (this.blinking > 0) this.blinking -= dt

    // 状态分支
    if (this.state === STATES.WALK || (this.canWalk() && this._hasMoveInput())) {
      this._updateWalk(dt)
    } else if (this.state === STATES.WALK) {
      this.setState(STATES.IDLE)
    }

    if (this.state === STATES.IDLE) this._updateIdle(t, dt)
    if (this.state === STATES.SLEEP) this._applyPose(dt, 3.2)
    if (this.state === STATES.CHARGE) this._applyPose(dt, 3.2)

    // 姿态动作
    if ([STATES.WAVE, STATES.BOW, STATES.DANCE, STATES.HANDSHAKE].includes(this.state)) {
      this._applyPose(dt, 5.5)
      this.poseTimer += dt
      if (this.poseOverlay) this.poseOverlay(t)
      if (this.poseTimer >= this.poseDuration) {
        this.poseTarget = null
        this.poseOverlay = null
        this.setState(STATES.IDLE)
      }
    }

    // 无姿态目标时关节回弹
    if (this.state === STATES.IDLE) this._relaxJoints(dt)

    // 表情与注视
    this._updateFace(dt, t)
    if (this.gazeEnabled && [STATES.IDLE, STATES.TALK].includes(this.state)) {
      this._updateGaze(dt)
    } else if (this.state !== STATES.TALK) {
      this._neutralHead(dt)
    }

    // 爆炸拆解
    this._applyExplode()
  }

  _hasMoveInput() {
    return Math.abs(this.moveInput.forward) > 0.02 || Math.abs(this.moveInput.turn) > 0.02
  }

  // ----------------------------------------------------------
  _updateWalk(dt) {
    if (!this.canWalk()) return
    const inp = this.moveInput
    if (this.state !== STATES.WALK) this.setState(STATES.WALK)

    // 转向与前进（坦克式）
    const lowPower = this.battery < 0.15
    const spd = this.speed * this.gait * (lowPower ? 0.5 : 1)
    this.heading += inp.turn * 2.2 * dt
    this.group.rotation.y = this.heading
    const move = inp.forward * spd * dt
    this.group.position.x += Math.sin(this.heading) * move
    this.group.position.z += Math.cos(this.heading) * move
    // 活动范围限制
    const r = Math.hypot(this.group.position.x, this.group.position.z)
    if (r > 7) {
      this.group.position.x *= 7 / r
      this.group.position.z *= 7 / r
    }

    // 步态相位
    const intensity = clamp(Math.abs(inp.forward) + Math.abs(inp.turn) * 0.6, 0, 1)
    this.walkPhase += dt * 7.2 * this.gait * clamp(spd, 0.4, 2)
    const p = this.walkPhase
    const A = 0.55 * intensity                 // 摆腿幅度
    const B = 0.9 * intensity                  // 屈膝幅度
    const armA = 0.42 * intensity

    const jl = this.j
    jl.joint_hip_l.rotation.x = -A * Math.sin(p)
    jl.joint_hip_r.rotation.x = A * Math.sin(p)
    jl.joint_knee_l.rotation.x = B * Math.max(0, Math.sin(p + 0.6))
    jl.joint_knee_r.rotation.x = B * Math.max(0, Math.sin(p + Math.PI + 0.6))
    jl.joint_ankle_l.rotation.x = -(jl.joint_hip_l.rotation.x + jl.joint_knee_l.rotation.x) * 0.38
    jl.joint_ankle_r.rotation.x = -(jl.joint_hip_r.rotation.x + jl.joint_knee_r.rotation.x) * 0.38

    jl.joint_shoulder_l.rotation.x = armA * Math.sin(p)
    jl.joint_shoulder_r.rotation.x = -armA * Math.sin(p)
    jl.joint_shoulder_l.rotation.z = 0.06
    jl.joint_shoulder_r.rotation.z = -0.06
    jl.joint_elbow_l.rotation.x = -0.3 - 0.18 * Math.max(0, Math.sin(p))
    jl.joint_elbow_r.rotation.x = -0.3 - 0.18 * Math.max(0, Math.sin(p + Math.PI))

    jl.joint_spine.rotation.y = 0.08 * Math.sin(p) * intensity
    jl.joint_spine.rotation.x = 0.05 * intensity

    // 上下起伏
    this.root.position.y = this.baseRootY - 0.028 * intensity * (0.5 - 0.5 * Math.cos(2 * p))

    if (!this._hasMoveInput()) {
      this.setState(STATES.IDLE)
      this.root.position.y = this.baseRootY
    }
  }

  _updateIdle(t, dt) {
    // 呼吸与细微晃动
    this.j.joint_spine.rotation.x = 0.02 * Math.sin(t * 1.3)
    this.j.joint_shoulder_l.rotation.z = 0.04 + 0.012 * Math.sin(t * 1.3)
    this.j.joint_shoulder_r.rotation.z = -0.04 - 0.012 * Math.sin(t * 1.3)
    this.root.position.y = damp(this.root.position.y, this.baseRootY, 6, dt)
  }

  _relaxJoints(dt) {
    // 回到静止姿态
    for (const n in this.j) {
      if (n === 'joint_neck') continue   // 颈部由注视/表情管理
      const o = this.j[n], r = this.rest[n].rot
      o.rotation.x = damp(o.rotation.x, r.x, 8, dt)
      o.rotation.y = damp(o.rotation.y, r.y, 8, dt)
      o.rotation.z = damp(o.rotation.z, r.z, 8, dt)
    }
  }

  _applyPose(dt, speed) {
    if (!this.poseTarget) return
    for (const n in this.poseTarget) {
      const o = this.j[n], tgt = this.poseTarget[n]
      if (!o) continue
      if (tgt.x !== undefined) o.rotation.x = damp(o.rotation.x, tgt.x, speed, dt)
      if (tgt.y !== undefined) o.rotation.y = damp(o.rotation.y, tgt.y, speed, dt)
      if (tgt.z !== undefined) o.rotation.z = damp(o.rotation.z, tgt.z, speed, dt)
    }
  }

  _updateFace(dt, t) {
    const sleeping = this.state === STATES.SLEEP
    const charging = this.state === STATES.CHARGE
    const low = this.battery < 0.15 && !charging

    // 目标眼形
    let sx = 1, sy = 1, dy = 0, intensity = this.eyeBaseIntensity
    const color = this.eyeBaseColor.clone()

    if (this.blinking > 0) sy = 0.1
    if (this.expression === 'happy') { sy *= 0.5; dy = 0.004; }
    if (this.expression === 'thinking') { sy *= 0.75; dy = 0.012; }
    if (this.expression === 'listening') { sx = 1.12; sy *= 1.28; }
    if (sleeping) { sy = 0.05; intensity = 0.15 }
    if (charging) { intensity = 2 + Math.sin(t * 2.5) * 1.2; color.setHex(0xffb454) }
    if (low) { color.setHex(0xffb454) }

    this.eyeMat.emissive.copy(color)
    this.eyeMat.emissiveIntensity = intensity

    // 用 damp（内部 1-exp(-λdt)）保证任意 dt 下稳定，不会 overshoot
    for (const [eye, bs, bp] of [
      [this.eyeL, this.eyeBaseScaleL, this.eyeBasePosL],
      [this.eyeR, this.eyeBaseScaleR, this.eyeBasePosR],
    ]) {
      eye.scale.x = damp(eye.scale.x, bs.x * sx, 14, dt)
      eye.scale.y = damp(eye.scale.y, bs.y * sy, 14, dt)
      eye.position.y = damp(eye.position.y, bp.y + dy, 14, dt)
    }

    // 颈环呼吸灯
    if (this.neckRing) {
      const m = this.neckRing.material
      m.emissiveIntensity = sleeping ? 0.2 : 2.2 + Math.sin(t * 2) * 1.2
    }
  }

  _updateGaze(dt) {
    // 计算头部指向目标的偏航/俯仰
    const head = this._tmpV
    this.j.joint_neck.getWorldPosition(head)
    const v = this.gazeTarget.clone().sub(head)
    const yawWorld = Math.atan2(v.x, v.z)
    let yaw = yawWorld - this.group.rotation.y
    while (yaw > Math.PI) yaw -= Math.PI * 2
    while (yaw < -Math.PI) yaw += Math.PI * 2
    const horiz = Math.hypot(v.x, v.z)
    const pitch = -Math.atan2(v.y - 0.0, horiz)

    const n = this.j.joint_neck
    n.rotation.y = damp(n.rotation.y, clamp(yaw, -0.85, 0.85), 6, dt)
    n.rotation.x = damp(n.rotation.x, clamp(pitch, -0.3, 0.42), 6, dt)
  }

  _neutralHead(dt) {
    const n = this.j.joint_neck
    if ([STATES.WAVE, STATES.BOW, STATES.DANCE, STATES.HANDSHAKE,
          STATES.CHARGE, STATES.SLEEP].includes(this.state)) return
    n.rotation.y = damp(n.rotation.y, 0, 5, dt)
    n.rotation.x = damp(n.rotation.x, 0, 5, dt)
  }

  _applyExplode() {
    const a = this.explodeAmount
    for (const it of this.explodeItems) {
      it.mesh.position.copy(it.base).addScaledVector(it.dir, a * it.weight)
    }
  }

  setExplode(v) { this.explodeAmount = v }

  setXray(on) {
    for (const m of this.shellMats) {
      m.transparent = on
      m.opacity = on ? 0.22 : 1
      m.depthWrite = !on
      m.needsUpdate = true
    }
  }
}
