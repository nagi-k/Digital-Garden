import { STATES, STATE_LABEL } from './robot.js'

/**
 * UI 绑定：面板、摇杆、键盘、HUD、对话逻辑
 */
export class UI {
  constructor(robot, fx, screen, controls) {
    this.robot = robot
    this.fx = fx            // { lidar, frustum, sound }
    this.screen = screen    // ChestScreen
    this.controls = controls
    this.keys = new Set()
    this.demoMode = false
    this.demoTimers = []
    this._bind()
  }

  subtitle(t) { document.getElementById('subtitle').textContent = t }

  _bind() {
    const r = this.robot
    const $ = (id) => document.getElementById(id)

    // ---- Tab 切换 ----
    document.querySelectorAll('.tab').forEach((b) => {
      b.onclick = () => {
        document.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'))
        document.querySelectorAll('.tab-page').forEach((x) => x.classList.remove('active'))
        b.classList.add('active')
        $('tab-' + b.dataset.tab).classList.add('active')
      }
    })

    // ---- 方向键按钮（按住生效） ----
    document.querySelectorAll('.dbtn[data-move]').forEach((b) => {
      const dir = b.dataset.move
      const on = (e) => { e.preventDefault(); b.classList.add('on'); this._setDir(dir, 1) }
      const off = () => { b.classList.remove('on'); this._setDir(dir, 0) }
      b.addEventListener('pointerdown', on)
      b.addEventListener('pointerup', off)
      b.addEventListener('pointerleave', off)
    })
    $('btnStop').onclick = () => { r.moveInput.forward = 0; r.moveInput.turn = 0 }

    // ---- 键盘 ----
    const keymap = {
      w: 'forward', arrowup: 'forward', s: 'back', arrowdown: 'back',
      a: 'left', arrowleft: 'left', d: 'right', arrowright: 'right',
    }
    window.addEventListener('keydown', (e) => {
      const dir = keymap[e.key.toLowerCase()]
      if (dir && !e.repeat) { this.keys.add(dir); this._syncKeys() }
    })
    window.addEventListener('keyup', (e) => {
      const dir = keymap[e.key.toLowerCase()]
      if (dir) { this.keys.delete(dir); this._syncKeys() }
    })

    // ---- 速度 / 步态 ----
    $('speed').oninput = (e) => {
      r.speed = parseFloat(e.target.value)
      $('speedVal').textContent = r.speed.toFixed(1) + ' m/s'
    }
    document.querySelectorAll('.gait').forEach((b) => {
      b.onclick = () => {
        document.querySelectorAll('.gait').forEach((x) => x.classList.remove('active'))
        b.classList.add('active')
        r.gait = parseFloat(b.dataset.gait)
        this.fx.sound.beep(720)
      }
    })

    // ---- 充电 / 休眠 ----
    $('btnCharge').onclick = () => {
      if (r.state === STATES.CHARGE) {
        r.doPose('reset')
        this.subtitle('充电完成，NOVA-1 恢复待机。')
      } else if (r.startCharge()) {
        this.screen.showText('进入充电模式\n电量恢复中…')
        this.subtitle('NOVA-1 进入充电姿态，运动与姿态功能已锁定。')
        this.fx.sound.chime()
      }
      this._refreshLock()
    }
    $('btnSleep').onclick = () => {
      const res = r.toggleSleep()
      if (res === 'sleep') {
        this.screen.showText('系统休眠\nZzz…')
        this.subtitle('NOVA-1 已进入休眠，再次点击唤醒。')
      } else if (res === 'wake') {
        this.screen.showText('系统启动\n自检完成，一切正常')
        this.subtitle('NOVA-1 已唤醒，传感器与关节自检通过。')
        this.fx.sound.chime()
        setTimeout(() => this.screen.showStatus(), 2600)
      }
      this._refreshLock()
    }

    // ---- 姿态动作 ----
    document.querySelectorAll('[data-pose]').forEach((b) => {
      b.onclick = () => {
        const ok = r.doPose(b.dataset.pose)
        if (ok && b.dataset.pose !== 'reset') {
          this.fx.sound.beep(880)
          const label = { wave: '你好！我是 NOVA-1。', bow: '很高兴见到你。', handshake: '合作愉快。', dance: '音乐响起，来一段舞蹈！' }[b.dataset.pose]
          if (label) this.subtitle(label)
        }
        this._refreshLock()
      }
    })

    // ---- 表情 ----
    document.querySelectorAll('.expr').forEach((b) => {
      b.onclick = () => {
        document.querySelectorAll('.expr').forEach((x) => x.classList.remove('active'))
        b.classList.add('active')
        r.setExpression(b.dataset.expr)
        this.fx.sound.beep(640)
      }
    })
    $('gazeToggle').onchange = (e) => { r.gazeEnabled = e.target.checked }

    // ---- 对话 ----
    const send = () => {
      const input = $('chatInput')
      const text = input.value.trim()
      if (!text || !r.enterTalk()) return
      input.value = ''
      input.disabled = true
      $('chatSend').disabled = true

      r.setExpression('listening')
      this.screen.showText(`收到："${text}"`)
      this.subtitle(`你：${text}`)
      this.fx.sound.beep(520)

      setTimeout(() => {
        r.setExpression('thinking')
        this.screen.showDots()
      }, 1100)

      setTimeout(() => {
        const reply = this._reply(text)
        r.setExpression('happy')
        this.screen.showText(reply)
        this.subtitle(`NOVA-1：${reply}`)
        this.fx.sound.chime()
      }, 2400)

      setTimeout(() => {
        r.setExpression('normal')
        this.screen.showStatus()
        r.exitTalk()
        input.disabled = false
        $('chatSend').disabled = false
        this._refreshLock()
      }, 7000)
      this._refreshLock()
    }
    $('chatSend').onclick = send
    $('chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') send() })

    // ---- 视图 ----
    $('explode').oninput = (e) => {
      const v = parseInt(e.target.value)
      $('explodeVal').textContent = v + '%'
      r.setExplode(v / 100)
    }
    $('xrayToggle').onchange = (e) => r.setXray(e.target.checked)
    $('lidarToggle').onchange = (e) => this.fx.lidar.setVisible(e.target.checked)
    $('frustumToggle').onchange = (e) => this.fx.frustum.setVisible(e.target.checked)
    $('btnCamReset').onclick = () => {
      this.controls.reset()
      this.controls.target.set(0, 0.95, 0)
      this.controls.object.position.set(2.6, 1.7, 3.2)
    }
    $('btnDemo').onclick = () => this._toggleDemo()

    // 状态变化 → HUD
    r.onStateChange(() => this._refreshLock())
    this._refreshLock()
  }

  _setDir(dir, v) {
    const r = this.robot
    if (!r.canWalk()) return
    if (dir === 'forward') r.moveInput.forward = v
    if (dir === 'back') r.moveInput.forward = -v * 0.6
    if (dir === 'left') r.moveInput.turn = v
    if (dir === 'right') r.moveInput.turn = -v
  }

  _syncKeys() {
    const r = this.robot
    if (!r.canWalk()) { this.keys.clear(); return }
    r.moveInput.forward = (this.keys.has('forward') ? 1 : 0) + (this.keys.has('back') ? -0.6 : 0)
    r.moveInput.turn = (this.keys.has('left') ? 1 : 0) + (this.keys.has('right') ? -1 : 0)
  }

  _reply(text) {
    const t = text.toLowerCase()
    if (/你好|hi|hello|嗨/.test(t)) return '你好，我是 NOVA-1，你的智能伙伴。可以通过左侧面板让我行走、表演或展示内部结构。'
    if (/会什么|功能|能干吗|做什么/.test(t)) return '我具备双足行走、姿态表演、语音交流与结构透视展示能力。试试「运动」页的摇杆，或「视图」页的爆炸拆解。'
    if (/名字|你是谁/.test(t)) return '我叫 NOVA-1，由 Blender 建模、Three.js 驱动的 Web3D 数字孪生机器人。'
    if (/跳舞|舞蹈/.test(t)) { setTimeout(() => this.robot.doPose('dance'), 400); return '好的，请欣赏我的舞蹈。' }
    if (/走|前进/.test(t)) return '请使用「运动」页的方向键或右下角摇杆控制我行走，WASD 也可以。'
    if (/充电|电量/.test(t)) return `当前电量 ${Math.round(this.robot.battery * 100)}%，需要时可在「运动」页让我返回充电。`
    if (/再见|拜拜/.test(t)) return '再见，期待下次与你互动。'
    return '我理解了你的意思。作为演示机型，我擅长行走、挥手、鞠躬、舞蹈与结构展示，欢迎逐项体验。'
  }

  /** 状态互斥：按钮可用性 */
  _refreshLock() {
    const r = this.robot
    const busy = ![STATES.IDLE, STATES.WALK].includes(r.state)
    document.querySelectorAll('[data-pose]').forEach((b) => {
      b.disabled = b.dataset.pose === 'reset' ? false : !r.canAct()
    })
    document.getElementById('chatSend').disabled = !r.canAct()
    document.getElementById('btnCharge').disabled = !(r.canAct() || r.state === STATES.CHARGE)
    document.getElementById('btnSleep').disabled = !(r.canAct() || r.state === STATES.SLEEP)

    const badge = document.getElementById('stateBadge')
    const label = STATE_LABEL[r.state] || r.state
    document.getElementById('stateText').textContent = label
    badge.className = 'state-badge ' + (
      r.state === STATES.WALK ? 'walking'
      : r.state === STATES.SLEEP ? 'sleep'
      : r.state === STATES.CHARGE ? 'charge'
      : busy ? 'busy' : ''
    )
  }

  // ---- 虚拟摇杆 ----
  bindJoystick() {
    const joy = document.getElementById('joystick')
    const stick = document.getElementById('stick')
    let active = false
    const setStick = (dx, dy) => {
      stick.style.transform = `translate(calc(-50% + ${dx * 34}px), calc(-50% + ${dy * 34}px))`
    }
    const handle = (e) => {
      const rect = joy.getBoundingClientRect()
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
      let dx = (e.clientX - cx) / (rect.width / 2), dy = (e.clientY - cy) / (rect.height / 2)
      const len = Math.hypot(dx, dy)
      if (len > 1) { dx /= len; dy /= len }
      setStick(dx, dy)
      if (this.robot.canWalk()) {
        this.robot.moveInput.forward = -dy
        this.robot.moveInput.turn = -dx
      }
    }
    joy.addEventListener('pointerdown', (e) => { active = true; joy.setPointerCapture(e.pointerId); handle(e) })
    joy.addEventListener('pointermove', (e) => { if (active) handle(e) })
    const end = () => {
      active = false; setStick(0, 0)
      this.robot.moveInput.forward = 0; this.robot.moveInput.turn = 0
    }
    joy.addEventListener('pointerup', end)
    joy.addEventListener('pointercancel', end)
  }

  // ---- 自动演示 ----
  _toggleDemo() {
    const btn = document.getElementById('btnDemo')
    if (this.demoMode) {
      this.demoMode = false
      btn.classList.remove('active')
      this.demoTimers.forEach(clearTimeout)
      this.demoTimers = []
      this.robot.doPose('reset')
      this.controls.autoRotate = false
      this.subtitle('自动演示已结束。')
      return
    }
    this.demoMode = true
    btn.classList.add('active')
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 1.2
    const r = this.robot
    const seq = [
      [300, () => { this.subtitle('自动演示开始：NOVA-1 唤醒自检。'); this.screen.showText('系统自检\n全部通过 ✓') }],
      [2200, () => { r.doPose('wave'); this.subtitle('你好！我是 NOVA-1，欢迎来到我的展示空间。') }],
      [6200, () => { r.moveInput.forward = 0.8; this.subtitle('演示行走能力。') }],
      [10200, () => { r.moveInput.forward = 0; r.moveInput.turn = 1 }],
      [11800, () => { r.moveInput.turn = 0; r.moveInput.forward = 0.8 }],
      [15200, () => { r.moveInput.forward = 0 }],
      [16500, () => { r.doPose('bow') }],
      [20500, () => { r.doPose('dance'); this.subtitle('表演一段舞蹈。') }],
      [29500, () => { this.screen.showStatus(); this.subtitle('演示结束，可自由交互。') }],
      [30000, () => this._toggleDemo()],
    ]
    this.demoTimers = seq.map(([delay, fn]) => setTimeout(() => { if (this.demoMode) fn() }, delay))
  }

  /** 每帧刷新 HUD */
  updateHUD() {
    const r = this.robot
    const pct = Math.round(r.battery * 100)
    document.getElementById('batteryBar').style.width = pct + '%'
    document.getElementById('batteryText').textContent = pct + '%'
    document.getElementById('batteryBar').style.background =
      pct < 15 ? 'linear-gradient(90deg,#b0741b,#ffb454)' : ''
    document.getElementById('tempText').textContent = r.temp.toFixed(1) + '°C'
    document.getElementById('clockText').textContent = new Date().toLocaleTimeString('zh-CN', { hour12: false })
  }
}
