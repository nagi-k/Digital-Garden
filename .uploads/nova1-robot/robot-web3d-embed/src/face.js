import * as THREE from 'three'

/**
 * 胸口屏幕：CanvasTexture 动态显示状态 / 对话文本
 */
export class ChestScreen {
  constructor(robotScene) {
    const spine = robotScene.getObjectByName('joint_spine')
    this.canvas = document.createElement('canvas')
    this.canvas.width = 256
    this.canvas.height = 176
    this.ctx = this.canvas.getContext('2d')
    this.tex = new THREE.CanvasTexture(this.canvas)
    this.tex.colorSpace = THREE.SRGBColorSpace

    const geo = new THREE.PlaneGeometry(0.125, 0.086)
    const mat = new THREE.MeshBasicMaterial({ map: this.tex, toneMapped: false })
    this.mesh = new THREE.Mesh(geo, mat)
    // Blender 局部坐标 (0, -0.117, 0.26) -> glTF (0, 0.26, 0.117)
    this.mesh.position.set(0, 0.26, 0.1185)
    spine.add(this.mesh)

    this.mode = 'status'       // status | dots | text
    this.text = ''
    this.displayed = ''
    this.dotT = 0
  }

  showStatus() { this.mode = 'status' }
  showDots() { this.mode = 'dots'; this.dotT = 0 }
  showText(t) { this.mode = 'text'; this.text = t; this.displayed = '' }

  update(dt, info) {
    const c = this.ctx
    c.fillStyle = '#020d14'
    c.fillRect(0, 0, 256, 176)

    if (this.mode === 'status') {
      c.strokeStyle = 'rgba(56,225,255,0.25)'
      c.lineWidth = 2
      c.strokeRect(6, 6, 244, 164)
      c.fillStyle = '#38e1ff'
      c.font = 'bold 22px monospace'
      c.fillText('NOVA-1', 16, 38)
      c.font = '15px monospace'
      c.fillStyle = '#9fdcef'
      c.fillText(`状态  ${info.state}`, 16, 74)
      c.fillText(`电量  ${info.battery}%`, 16, 102)
      // 电量条
      c.strokeStyle = 'rgba(56,225,255,0.4)'
      c.strokeRect(16, 118, 160, 12)
      c.fillStyle = info.battery < 15 ? '#ffb454' : '#38e1ff'
      c.fillRect(18, 120, 156 * info.battery / 100, 8)
      c.fillStyle = '#5a7a8c'
      c.font = '12px monospace'
      c.fillText(info.clock, 16, 156)
    } else if (this.mode === 'dots') {
      this.dotT += dt
      c.fillStyle = '#38e1ff'
      c.font = 'bold 30px monospace'
      const n = 1 + Math.floor(this.dotT * 2.4) % 3
      c.fillText('思考中' + '.'.repeat(n), 58, 96)
    } else if (this.mode === 'text') {
      // 打字机
      if (this.displayed.length < this.text.length) {
        this.displayed = this.text.slice(0, this.displayed.length + 1)
      }
      c.fillStyle = '#c9f3ff'
      c.font = '15px sans-serif'
      this._wrap(this.displayed, 16, 36, 224, 24)
    }
    this.tex.needsUpdate = true
  }

  _wrap(text, x, y, maxW, lh) {
    const c = this.ctx
    let line = '', yy = y
    for (const ch of text) {
      if (c.measureText(line + ch).width > maxW || ch === '\n') {
        c.fillText(line, x, yy); line = ch === '\n' ? '' : ch; yy += lh
        if (yy > 168) break
      } else line += ch
    }
    c.fillText(line, x, yy)
  }
}
