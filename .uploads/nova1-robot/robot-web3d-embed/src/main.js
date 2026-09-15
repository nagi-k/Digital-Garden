import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RobotController, STATES, STATE_LABEL } from './robot.js'
import { ChestScreen } from './face.js'
import { LidarFX, FrustumFX, SoundFX } from './effects.js'
import { UI } from './ui.js'

// ============================================================
// 渲染器 / 场景 / 相机
// ============================================================
const canvas = document.getElementById('scene')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(innerWidth, innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.0

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x070b12)
scene.fog = new THREE.Fog(0x070b12, 12, 30)

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(2.6, 1.7, 3.2)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target.set(0, 0.95, 0)
controls.enableDamping = true
controls.dampingFactor = 0.06
controls.maxPolarAngle = Math.PI * 0.52
controls.minDistance = 1.2
controls.maxDistance = 12
controls.update()

// 环境反射（让白色外壳与金属关节有质感）
const pmrem = new THREE.PMREMGenerator(renderer)
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
scene.environmentIntensity = 0.45

// ============================================================
// 灯光
// ============================================================
scene.add(new THREE.HemisphereLight(0x8fb8d8, 0x0a0e14, 0.3))

const keyLight = new THREE.DirectionalLight(0xfff4e8, 1.6)
keyLight.position.set(3.5, 5.5, 3)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.camera.left = -4
keyLight.shadow.camera.right = 4
keyLight.shadow.camera.top = 5
keyLight.shadow.camera.bottom = -3
keyLight.shadow.bias = -0.0004
scene.add(keyLight)

const rimLight = new THREE.SpotLight(0x38bfff, 30, 20, Math.PI / 5, 0.5)
rimLight.position.set(-3.5, 4, -4)
scene.add(rimLight)

const fillLight = new THREE.PointLight(0x8899ff, 4, 12)
fillLight.position.set(-2.5, 1.5, 2.5)
scene.add(fillLight)

// ============================================================
// 地面：科技展台
// ============================================================
{
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(9, 72),
    new THREE.MeshStandardMaterial({ color: 0x0c1220, metalness: 0.55, roughness: 0.42 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)

  // 同心光环
  for (const [r, op] of [[1.4, 0.5], [2.6, 0.28], [4.2, 0.15], [6.4, 0.07]]) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r - 0.015, r, 96),
      new THREE.MeshBasicMaterial({
        color: 0x38e1ff, transparent: true, opacity: op,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
      })
    )
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.005
    scene.add(ring)
  }

  // 网格
  const grid = new THREE.PolarGridHelper(9, 12, 8, 64, 0x1b3a4d, 0x12222f)
  grid.position.y = 0.002
  grid.material.transparent = true
  grid.material.opacity = 0.35
  scene.add(grid)
}

// ============================================================
// 加载机器人模型
// ============================================================
let robot = null
let chest = null
let lidarFX = null
let frustumFX = null
let ui = null
const sound = new SoundFX()

const loader = new GLTFLoader()
loader.load('./public/models/robot.glb', (gltf) => {
  const model = gltf.scene
  scene.add(model)

  robot = new RobotController(model)
  scene.add(robot.group)
  window.__robot = robot   // 调试/验收接口

  chest = new ChestScreen(model)
  lidarFX = new LidarFX(model, scene)
  frustumFX = new FrustumFX(model)
  ui = new UI(robot, { lidar: lidarFX, frustum: frustumFX, sound }, chest, controls)
  ui.bindJoystick()

  document.getElementById('loading').classList.add('done')
}, undefined, (err) => {
  document.querySelector('#loading p').textContent = '模型加载失败：' + err.message
})

// ============================================================
// 注视跟随：指针位置 → 3D 目标点
// ============================================================
const raycaster = new THREE.Raycaster()
const pointer = new THREE.Vector2()
window.addEventListener('pointermove', (e) => {
  if (!robot) return
  pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
  raycaster.setFromCamera(pointer, camera)
  // 目标点取射线上距离 2.2m 处
  robot.gazeTarget.copy(raycaster.ray.origin).addScaledVector(raycaster.ray.direction, 2.2)
})

// ============================================================
// 后期：Bloom 让发光元素更有质感
// ============================================================
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.4, 0.5, 1.0)
composer.addPass(bloom)
composer.addPass(new OutputPass())

// ============================================================
// 主循环
// ============================================================
const clock = new THREE.Clock()
let hudTimer = 0

function animate() {
  requestAnimationFrame(animate)
  const dt = Math.min(clock.getDelta(), 0.25)
  const t = clock.elapsedTime

  if (robot) {
    robot.update(dt, t)
    sound.setServo(robot.state === STATES.WALK, robot.speed * robot.gait)

    hudTimer += dt
    if (hudTimer > 0.25) {
      hudTimer = 0
      ui.updateHUD()
      chest.update(0.25, {
        state: STATE_LABEL[robot.state],
        battery: Math.round(robot.battery * 100),
        clock: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      })
    } else if (chest.mode !== 'status') {
      chest.update(dt, {})
    }

    lidarFX.update(dt, robot.group.position)
  }

  controls.update()
  composer.render()
}
animate()

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  composer.setSize(innerWidth, innerHeight)
})
