import * as THREE from 'three'

/** 激光雷达扫描特效（旋转点环 + 地面扩散扫描圈） */
export class LidarFX {
  constructor(robotScene, scene) {
    this.group = new THREE.Group()

    const neck = robotScene.getObjectByName('joint_neck')
    // 头顶旋转点环（Blender 局部 (0,0.01,0.262) -> glTF (0,0.262,-0.01)）
    const N = 90
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      pos[i * 3] = Math.cos(a) * 0.09
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = Math.sin(a) * 0.09
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.ring = new THREE.Points(g, new THREE.PointsMaterial({
      color: 0x38e1ff, size: 0.014, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    // 扫描扇叶（水平面）
    const bladeGeo = new THREE.PlaneGeometry(1.3, 0.5)
    bladeGeo.rotateX(-Math.PI / 2)      // 放平到 XZ 面
    bladeGeo.translate(0.65, 0, 0)
    this.blade = new THREE.Mesh(bladeGeo, new THREE.MeshBasicMaterial({
      color: 0x38e1ff, transparent: true, opacity: 0.18,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }))
    this.spinner = new THREE.Group()
    this.spinner.add(this.ring, this.blade)
    this.spinner.position.set(0, 0.27, -0.01)
    neck.add(this.spinner)

    // 地面扩散扫描圈
    this.groundRings = []
    for (let i = 0; i < 3; i++) {
      const rg = new THREE.RingGeometry(0.98, 1.0, 64)
      rg.rotateX(-Math.PI / 2)
      const m = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({
        color: 0x38e1ff, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      }))
      m.position.y = 0.02
      scene.add(m)
      this.groundRings.push(m)
    }
    this.visible = false
    this.group.visible = false
    this.spinner.visible = false
    this.t = 0
    this.robotGroup = null
  }

  setVisible(v) {
    this.visible = v
    this.spinner.visible = v
    this.groundRings.forEach((r) => (r.visible = v))
  }

  update(dt, robotPos) {
    if (!this.visible) return
    this.t += dt
    this.spinner.rotation.y -= dt * 5
    this.groundRings.forEach((r, i) => {
      const ph = (this.t * 0.45 + i / 3) % 1
      const s = 0.6 + ph * 6
      r.scale.setScalar(s)
      r.material.opacity = 0.5 * (1 - ph)
      r.position.x = robotPos.x
      r.position.z = robotPos.z
    })
  }
}

/** 视觉视锥（摄像头视野可视化） */
export class FrustumFX {
  constructor(robotScene) {
    const neck = robotScene.getObjectByName('joint_neck')
    const geo = new THREE.ConeGeometry(0.42, 1.25, 24, 1, true)
    geo.rotateX(-Math.PI / 2)           // 顶点朝 -Z，开口朝 +Z
    geo.translate(0, 0, 0.625)          // 顶点对齐头部
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color: 0x38e1ff, transparent: true, opacity: 0.06,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    }))
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(geo, 18),
      new THREE.LineBasicMaterial({ color: 0x38e1ff, transparent: true, opacity: 0.35 })
    )
    this.mesh.add(edges)
    // 头部中心（Blender 局部 (0,-0.06,0.135) -> glTF (0,0.135,0.06)）
    this.mesh.position.set(0, 0.145, 0.06)
    this.mesh.visible = false
    neck.add(this.mesh)
  }
  setVisible(v) { this.mesh.visible = v }
}

/** 简易音效（WebAudio 合成，无需音频资源） */
export class SoundFX {
  constructor() { this.ctx = null; this.servoOsc = null; this.servoGain = null }

  _ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume()
  }

  beep(freq = 880, dur = 0.08, vol = 0.05) {
    try {
      this._ensure()
      const o = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      o.type = 'sine'; o.frequency.value = freq
      g.gain.setValueAtTime(vol, this.ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + dur)
      o.connect(g).connect(this.ctx.destination)
      o.start(); o.stop(this.ctx.currentTime + dur)
    } catch (e) { /* 忽略音频错误 */ }
  }

  chime() { this.beep(660, 0.12); setTimeout(() => this.beep(990, 0.16), 120) }

  setServo(on, speed = 1) {
    try {
      this._ensure()
      if (on && !this.servoOsc) {
        this.servoOsc = this.ctx.createOscillator()
        this.servoGain = this.ctx.createGain()
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'; filter.frequency.value = 300
        this.servoOsc.type = 'sawtooth'
        this.servoGain.gain.value = 0.0
        this.servoOsc.connect(filter).connect(this.servoGain).connect(this.ctx.destination)
        this.servoOsc.start()
      }
      if (this.servoOsc) {
        this.servoOsc.frequency.value = 45 + speed * 30
        this.servoGain.gain.setTargetAtTime(on ? 0.018 : 0, this.ctx.currentTime, 0.15)
      }
    } catch (e) { /* 忽略 */ }
  }
}
