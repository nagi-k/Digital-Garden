// ============================================================================
// Web3D 智能滚筒洗衣机
// 模型: Blender 程序化建模 (../blender/build_washer.py) 导出的 GLB
// 渲染: Three.js (WebGL)  ·  交互: 状态机 + 射线拾取 + 控制面板
// ============================================================================
import * as THREE from 'three';
import { OrbitControls } from './lib/controls/OrbitControls.js';
import { GLTFLoader } from './lib/loaders/GLTFLoader.js';
import { RoomEnvironment } from './lib/environments/RoomEnvironment.js';

// ---------------------------------------------------------------- 基础场景
const canvas = document.getElementById('scene');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
} catch (e) {
  document.getElementById('load-text').textContent =
    '当前浏览器不支持 WebGL, 请使用带硬件加速的 Chrome / Edge / Safari 打开';
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.06;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e13);
scene.fog = new THREE.Fog(0x0b0e13, 4.5, 10);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.05, 30);
camera.position.set(1.05, 0.98, 1.6);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.42, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 0.5;
controls.maxDistance = 4;
controls.maxPolarAngle = Math.PI * 0.55;

// 灯光
scene.add(new THREE.HemisphereLight(0xdfeaff, 0x1a2027, 0.55));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
keyLight.position.set(1.6, 2.6, 1.8);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.left = keyLight.shadow.camera.bottom = -1.2;
keyLight.shadow.camera.right = keyLight.shadow.camera.top = 1.2;
keyLight.shadow.camera.far = 8;
keyLight.shadow.bias = -0.0004;
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x88bbff, 0.7);
rimLight.position.set(-2, 1.4, -1.6);
scene.add(rimLight);

// 地面
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(4, 64),
  new THREE.MeshStandardMaterial({ color: 0x11151d, roughness: 0.92, metalness: 0.05 }));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);
const ring = new THREE.Mesh(
  new THREE.RingGeometry(0.52, 0.53, 64),
  new THREE.MeshBasicMaterial({ color: 0x35c4ff, transparent: true, opacity: 0.25 }));
ring.rotation.x = -Math.PI / 2;
ring.position.y = 0.001;
scene.add(ring);

// ---------------------------------------------------------------- 全局状态
const S = {
  state: 'IDLE',        // IDLE FILL WASH DRAIN RINSE SPIN DONE
  paused: false,
  running: false,
  program: 'cotton',
  temp: 40,
  rpm: 1000,
  doorOpen: false,
  doorLocked: false,
  clothesLoaded: false,
  drawerOpen: false,
  xray: false,
  timeScale: 1,
  demo: false,
  stageIndex: -1,
  stageTime: 0,
  stages: [],
  waterLevel: 0,        // 0..1
  foamAmount: 0,
  drumSpeed: 0,         // 当前角速度 rad/s
  washDir: 1,
  washTimer: 0,
};

const PROGRAMS = {
  cotton: { name: '棉麻洗', gentle: false, stages: [
    ['FILL', 8], ['WASH', 30], ['DRAIN', 6], ['RINSE', 18], ['DRAIN', 5], ['SPIN', 14]] },
  quick:  { name: '快洗',   gentle: false, stages: [
    ['FILL', 6], ['WASH', 14], ['DRAIN', 5], ['RINSE', 9],  ['DRAIN', 4], ['SPIN', 8]] },
  wool:   { name: '羊毛洗', gentle: true,  stages: [
    ['FILL', 8], ['WASH', 22], ['DRAIN', 6], ['RINSE', 14], ['DRAIN', 5], ['SPIN', 9]] },
};
const STATE_NAME = { IDLE: '待机', FILL: '注水', WASH: '洗涤', DRAIN: '排水',
                     RINSE: '漂洗', SPIN: '脱水', DONE: '完成' };
const STAGE_ORDER = ['IDLE', 'FILL', 'WASH', 'DRAIN', 'RINSE', 'SPIN', 'DONE'];

// ---------------------------------------------------------------- 模型节点
let washerRoot, N = {};   // N: 命名节点表
const clock = new THREE.Clock();
const clothes = [];

// ---------------- 内筒孔洞贴图 (Canvas 程序化生成) ----------------
function makeDrumTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#878e99';
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = '#33383f';
  for (let y = 14; y < 256; y += 26)
    for (let x = 14 + (y % 52 ? 13 : 0); x < 512; x += 26) {
      g.beginPath(); g.arc(x, y, 5.2, 0, 7); g.fill();
    }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(4, 2);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------- 机身 3D 显示屏贴图 ----------------
const dispCanvas = document.createElement('canvas');
dispCanvas.width = 256; dispCanvas.height = 112;
const dispCtx = dispCanvas.getContext('2d');
const dispTex = new THREE.CanvasTexture(dispCanvas);
dispTex.colorSpace = THREE.SRGBColorSpace;

function drawDisplay() {
  const g = dispCtx;
  g.fillStyle = '#03131d';
  g.fillRect(0, 0, 256, 112);
  g.fillStyle = '#35c4ff';
  g.font = 'bold 26px monospace';
  g.textBaseline = 'top';
  const label = S.paused ? '已暂停' : STATE_NAME[S.state];
  g.fillText(label, 14, 12);
  g.textAlign = 'right';
  g.font = 'bold 34px monospace';
  g.fillText(fmtTime(remainingSeconds()), 242, 40);
  g.textAlign = 'left';
  g.font = '16px monospace';
  g.fillStyle = 'rgba(53,196,255,0.65)';
  g.fillText(`${S.temp}°C  ${S.rpm}rpm`, 14, 82);
  dispTex.needsUpdate = true;
}

// ---------------------------------------------------------------- 水面与泡沫
let waterMesh, foamPoints, foamMat;

function buildWaterAndFoam(drumCenter) {
  // 水面: 轴向与内筒一致(Z 轴)的圆柱, 通过 Y 缩放模拟水位升降
  const geo = new THREE.CylinderGeometry(0.228, 0.228, 0.30, 48, 1, false);
  geo.rotateX(Math.PI / 2);
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x1a7fc0, transparent: true, opacity: 0.55,
    roughness: 0.08, metalness: 0, depthWrite: false,
  });
  waterMesh = new THREE.Mesh(geo, mat);
  waterMesh.position.copy(drumCenter);
  waterMesh.scale.y = 0.001;
  waterMesh.renderOrder = 5;
  scene.add(waterMesh);

  // 泡沫粒子
  const COUNT = 260;
  const pos = new Float32Array(COUNT * 3);
  for (let i = 0; i < COUNT; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.19;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.sin(a) * r * 0.7 - 0.05;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.26;
  }
  const fg = new THREE.BufferGeometry();
  fg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  foamMat = new THREE.PointsMaterial({
    color: 0xf4fbff, size: 0.026, transparent: true, opacity: 0,
    depthWrite: false, sizeAttenuation: true,
  });
  foamPoints = new THREE.Points(fg, foamMat);
  foamPoints.position.copy(drumCenter);
  foamPoints.renderOrder = 6;
  scene.add(foamPoints);
}

// ---------------------------------------------------------------- 加载模型
const loader = new GLTFLoader();
loader.load('./model/washer.glb', (gltf) => {
  washerRoot = new THREE.Group();
  washerRoot.add(gltf.scene);
  scene.add(washerRoot);

  ['DoorPivot', 'DrumPivot', 'KnobPivot', 'ClothesGroup', 'DetergentDrawer',
   'Display', 'Drum', 'Body', 'OuterTub', 'TubBack', 'TopPanel', 'BaseKick',
   'ControlPanel'].forEach(n => N[n] = washerRoot.getObjectByName(n));

  const drumTex = makeDrumTexture();
  washerRoot.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = true;
    o.receiveShadow = false;
    const m = o.material;
    if (m.name === 'MAT_DrumSteel') {
      m.map = drumTex;
      m.bumpMap = drumTex;
      m.bumpScale = 0.6;
      m.metalness = 0.85; m.roughness = 0.35;
      m.side = THREE.DoubleSide;
    }
    if (m.name === 'MAT_DoorGlass') {
      // 关掉 transmission, 改为弱着色透明玻璃, 避免亮环境反射导致"白镜子"
      m.transmission = 0;
      m.transparent = true;
      m.opacity = 0.16;
      m.color.set(0x8fb4c9);
      m.roughness = 0.06;
      m.metalness = 0;
      m.envMapIntensity = 0.35;
      m.depthWrite = false;
      o.castShadow = false;
      o.renderOrder = 8;
    }
    if (m.name === 'MAT_TopPanel') m.side = THREE.DoubleSide;
    if (o.name === 'Display') o.material = new THREE.MeshBasicMaterial({ map: dispTex });
  });

  // 记录衣物初始姿态 (ClothesGroup 局部坐标: XY 为翻滚面, Z 为筒深)
  N.ClothesGroup.children.forEach((c, i) => {
    c.userData = {
      angle: Math.atan2(c.position.y, c.position.x),
      radius: Math.hypot(c.position.x, c.position.y),
      z: c.position.z,
      phase: i * 2.13,
    };
    clothes.push(c);
  });
  N.ClothesGroup.visible = false;

  N.drawerBaseZ = N.DetergentDrawer.position.z;
  buildWaterAndFoam(new THREE.Vector3(0, 0.42, 0.05));

  // 内筒照明灯 (类似真实机型的筒灯), 让衣物和水位透过玻璃可见
  const drumLight = new THREE.PointLight(0xbfd8ec, 1.6, 1.4, 1.2);
  drumLight.position.set(0, 0.42, 0.42);
  scene.add(drumLight);

  document.getElementById('loading').classList.add('hide');
  refreshUI();
  drawDisplay();
}, (e) => {
  const pct = e.total ? Math.round(e.loaded / e.total * 100) : '';
  document.getElementById('load-text').textContent = `正在加载洗衣机模型… ${pct}%`;
}, () => {
  document.getElementById('load-text').textContent =
    '模型加载失败: 请确认 web/model/washer.glb 存在 (先运行 Blender 脚本)';
});

// ---------------------------------------------------------------- 音效
let AC = null;
function beep(freq = 880, dur = 0.09, gap = 0) {
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    const t = AC.currentTime + gap;
    const o = AC.createOscillator(), g = AC.createGain();
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(AC.destination);
    o.start(t); o.stop(t + dur + 0.02);
  } catch (e) { /* 无声环境下静默 */ }
}

// ---------------------------------------------------------------- Toast
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

// ---------------------------------------------------------------- 状态机
function buildStages() {
  return PROGRAMS[S.program].stages.map(([key, dur], i, arr) => {
    let wFrom = 0, wTo = 0;
    if (key === 'FILL') { wFrom = 0; wTo = 0.6; }
    else if (key === 'WASH') { wFrom = 0.6; wTo = 0.6; }
    else if (key === 'RINSE') { wFrom = 0; wTo = 0.5; }
    else if (key === 'DRAIN') { wFrom = S.waterLevel; wTo = 0; }
    return { key, dur, wFrom, wTo };
  });
}

function startCycle() {
  if (!S.clothesLoaded) { toast('请先放入衣物'); return; }
  if (S.doorOpen) { toast('请先关闭舱门'); return; }
  S.stages = buildStages();
  S.stageIndex = -1;
  S.running = true;
  S.paused = false;
  S.doorLocked = true;
  S.demo = false;
  nextStage();
  beep(980, 0.1);
  refreshUI();
}

function nextStage() {
  S.stageIndex++;
  S.stageTime = 0;
  if (S.stageIndex >= S.stages.length) { finishCycle(); return; }
  const st = S.stages[S.stageIndex];
  if (st.key === 'DRAIN') st.wFrom = S.waterLevel;
  S.state = st.key;
  refreshUI();
}

function finishCycle() {
  S.running = false;
  S.paused = false;
  S.state = 'DONE';
  S.doorLocked = false;
  S.waterTarget = 0;
  beep(880, 0.12); beep(660, 0.12, 0.15); beep(880, 0.18, 0.3);
  toast('洗涤完成, 可以开门取衣了');
  refreshUI();
}

function togglePause() {
  if (!S.running) return;
  S.paused = !S.paused;
  beep(S.paused ? 440 : 980, 0.08);
  refreshUI();
}

function totalSeconds() { return S.stages.reduce((s, x) => s + x.dur, 0); }
function remainingSeconds() {
  if (!S.running && S.state !== 'DONE') return 0;
  let r = 0;
  for (let i = S.stageIndex; i < S.stages.length; i++)
    r += S.stages[i].dur - (i === S.stageIndex ? S.stageTime : 0);
  return Math.max(0, Math.ceil(r));
}
function elapsedFraction() {
  const t = totalSeconds();
  return t > 0 ? 1 - remainingSeconds() / t : 0;
}
function fmtTime(s) {
  if (!S.running && S.state !== 'DONE') return '--:--';
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ---------------------------------------------------------------- 舱门/衣物/抽屉
function toggleDoor() {
  if (S.doorLocked && !S.doorOpen) { toast('运行中, 舱门已锁定'); beep(220, 0.12); return; }
  if (S.doorLocked && S.doorOpen) { toast('请先暂停程序'); return; }
  S.doorOpen = !S.doorOpen;
  beep(520, 0.06);
  refreshUI();
}

function toggleClothes() {
  if (S.doorLocked) { toast('运行中无法操作衣物'); return; }
  if (!S.doorOpen) { toast('请先打开舱门'); return; }
  S.clothesLoaded = !S.clothesLoaded;
  N.ClothesGroup.visible = true;
  const target = S.clothesLoaded ? 1 : 0.001;
  clothes.forEach((c, i) => {
    c.userData.scaleFrom = c.scale.x;
    c.userData.scaleTo = target;
    c.userData.scaleDelay = i * 0.12;
    c.userData.scaleT = -c.userData.scaleDelay;
  });
  if (!S.clothesLoaded) setTimeout(() => { if (!S.clothesLoaded) N.ClothesGroup.visible = false; }, 900);
  beep(700, 0.07);
  refreshUI();
}

function toggleDrawer() {
  if (S.doorLocked) { toast('运行中, 洗涤剂盒已锁定'); return; }
  S.drawerOpen = !S.drawerOpen;
  beep(600, 0.05);
  refreshUI();
}

function toggleXray() {
  S.xray = !S.xray;
  const names = ['Body', 'TopPanel', 'BaseKick', 'ControlPanel'];
  names.forEach(n => {
    const o = N[n];
    if (!o) return;
    if (!o.userData.origMat) o.userData.origMat = o.material;
    if (S.xray) {
      const m = o.userData.origMat.clone();
      m.transparent = true; m.opacity = 0.1; m.depthWrite = false;
      o.material = m;
    } else o.material = o.userData.origMat;
  });
  [['OuterTub', 0.18], ['TubBack', 0.18]].forEach(([n, op]) => {
    const o = N[n];
    if (!o) return;
    if (!o.userData.origMat) o.userData.origMat = o.material;
    if (S.xray) {
      const m = o.userData.origMat.clone();
      m.transparent = true; m.opacity = op; m.depthWrite = false;
      m.side = THREE.DoubleSide;
      o.material = m;
    } else o.material = o.userData.origMat;
  });
  toast(S.xray ? '透明剖视: 可看到外筒 / 内筒 / 衣物' : '已恢复外观');
  refreshUI();
}

// ---------------------------------------------------------------- 自动演示
function startDemo() {
  S.timeScale = 5;
  S.demo = true;
  toast('自动演示中 (5 倍速): 全程展示洗涤流程');
  if (!S.doorOpen) toggleDoor();
  setTimeout(() => { if (!S.clothesLoaded) toggleClothes(); }, 700);
  setTimeout(() => { if (S.doorOpen) toggleDoor(); }, 1800);
  setTimeout(() => { selectProgram('quick'); startCycle(); S.timeScale = 5; S.demo = true; }, 2600);
  refreshUI();
}
function stopDemo() {
  S.demo = false;
  S.timeScale = 1;
  toast('已退出自动演示');
  refreshUI();
}

// ---------------------------------------------------------------- UI 绑定
function selectProgram(p) {
  if (S.running) { toast('运行中无法切换程序'); return; }
  S.program = p;
  document.querySelectorAll('#prog-row .opt').forEach(b =>
    b.classList.toggle('active', b.dataset.prog === p));
  refreshUI();
}

document.querySelectorAll('#prog-row .opt').forEach(b =>
  b.onclick = () => { selectProgram(b.dataset.prog); beep(760, 0.05); });
document.querySelectorAll('#temp-row .opt').forEach(b =>
  b.onclick = () => {
    if (S.running) { toast('运行中无法修改水温'); return; }
    S.temp = +b.dataset.temp;
    document.querySelectorAll('#temp-row .opt').forEach(x =>
      x.classList.toggle('active', x === b));
    beep(760, 0.05); refreshUI();
  });
document.querySelectorAll('#rpm-row .opt').forEach(b =>
  b.onclick = () => {
    if (S.running) { toast('运行中无法修改转速'); return; }
    S.rpm = +b.dataset.rpm;
    document.querySelectorAll('#rpm-row .opt').forEach(x =>
      x.classList.toggle('active', x === b));
    beep(760, 0.05); refreshUI();
  });

document.getElementById('btn-start').onclick = () => {
  if (S.running) togglePause(); else startCycle();
};
document.getElementById('btn-door').onclick = toggleDoor;
document.getElementById('btn-clothes').onclick = toggleClothes;
document.getElementById('btn-drawer').onclick = toggleDrawer;
document.getElementById('btn-xray').onclick = toggleXray;
document.getElementById('btn-demo').onclick = () => S.demo ? stopDemo() : startDemo();

function refreshUI() {
  const label = S.paused ? '已暂停' : STATE_NAME[S.state];
  document.getElementById('scr-state').textContent = label;
  document.getElementById('scr-prog').textContent = `程序:${PROGRAMS[S.program].name}`;
  document.getElementById('scr-temp').textContent = `${S.temp}°C`;
  document.getElementById('scr-rpm').textContent = `${S.rpm} 转`;

  const chip = document.getElementById('state-chip');
  chip.textContent = label + (S.doorLocked ? ' · 门锁' : '');
  chip.className = 'chip ' + (S.paused ? 'paused' :
    S.state === 'DONE' ? 'done' : S.running ? 'running' : 'standby');

  document.querySelectorAll('#stage-bar .stage').forEach(el => {
    const i = STAGE_ORDER.indexOf(el.dataset.stage);
    const cur = STAGE_ORDER.indexOf(S.state);
    el.classList.toggle('active', el.dataset.stage === S.state);
    el.classList.toggle('passed', S.running && i < cur && el.dataset.stage !== 'IDLE');
  });

  const startBtn = document.getElementById('btn-start');
  startBtn.textContent = S.running ? (S.paused ? '继续' : '暂停') : '启动';
  startBtn.classList.toggle('pause', S.running && !S.paused);
  startBtn.disabled = !S.running && (!S.clothesLoaded || S.doorOpen);

  document.getElementById('btn-door').textContent = S.doorOpen ? '关门' : '开门';
  document.getElementById('btn-clothes').textContent = S.clothesLoaded ? '取出衣物' : '放入衣物';
  document.getElementById('btn-drawer').classList.toggle('on', S.drawerOpen);
  document.getElementById('btn-xray').classList.toggle('on', S.xray);
  document.getElementById('btn-demo').classList.toggle('on', S.demo);
}

// ---------------------------------------------------------------- 3D 拾取交互
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPos = null;

canvas.addEventListener('pointerdown', e => { downPos = [e.clientX, e.clientY]; });
canvas.addEventListener('pointerup', e => {
  if (!downPos) return;
  const dx = e.clientX - downPos[0], dy = e.clientY - downPos[1];
  downPos = null;
  if (dx * dx + dy * dy > 25 || !washerRoot) return;   // 拖拽视角则不触发
  pointer.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(washerRoot.children, true);
  if (!hits.length) return;
  let o = hits[0].object;
  while (o) {
    const n = o.name || '';
    if (n.startsWith('Door')) { toggleDoor(); return; }
    if (n.startsWith('Knob')) {
      const keys = Object.keys(PROGRAMS);
      selectProgram(keys[(keys.indexOf(S.program) + 1) % keys.length]);
      beep(760, 0.05); return;
    }
    if (n === 'Button_0') { S.running ? togglePause() : startCycle(); return; }
    if (n === 'Button_1') { toggleDoor(); return; }
    if (n === 'Button_2') { toggleXray(); return; }
    if (n.startsWith('DetergentDrawer') || n.startsWith('DrawerHandle')) { toggleDrawer(); return; }
    o = o.parent;
  }
});

// ---------------------------------------------------------------- 动画更新
function updateCycle(dt) {
  if (!S.running || S.paused) return;
  const st = S.stages[S.stageIndex];
  S.stageTime += dt;
  if (S.stageTime >= st.dur) { nextStage(); return; }
  const f = S.stageTime / st.dur;
  S.waterLevel = THREE.MathUtils.lerp(st.wFrom, st.wTo, Math.min(1, f * 1.15));
  // 泡沫量: 洗涤最多, 漂洗次之
  const agit = st.key === 'WASH' ? 1 : st.key === 'RINSE' ? 0.5 : 0.15;
  S.foamAmount += (S.waterLevel * agit - S.foamAmount) * Math.min(1, dt * 0.8);
}

function drumTargetSpeed() {
  if (!S.running || S.paused) return 0;
  const gentle = PROGRAMS[S.program].gentle;
  switch (S.state) {
    case 'WASH': return (gentle ? 2.6 : 5.2);
    case 'RINSE': return 4.2;
    case 'SPIN': {
      const rpm = PROGRAMS[S.program].gentle ? Math.min(S.rpm, 800) : S.rpm;
      return (8 + rpm / 1200 * 14);            // 视觉化转速 8~22 rad/s
    }
    case 'FILL': case 'DRAIN': return 1.2;
    default: return 0;
  }
}

function updateDrum(dt, t) {
  const target = drumTargetSpeed();
  // 正反转逻辑: 洗涤/漂洗/注排水时周期换向
  if (['WASH', 'RINSE', 'FILL', 'DRAIN'].includes(S.state) && S.running && !S.paused) {
    S.washTimer += dt;
    const period = PROGRAMS[S.program].gentle ? 2.2 : 1.4;
    if (S.washTimer > period) { S.washTimer = 0; S.washDir *= -1; }
  }
  if (S.state === 'SPIN') S.washDir = 1;
  const ramp = S.state === 'SPIN' ? 0.55 : 2.2;      // 脱水缓慢升速
  S.drumSpeed += (target * S.washDir - S.drumSpeed) * Math.min(1, dt * ramp);
  N.DrumPivot.rotation.z += S.drumSpeed * dt;

  // 衣物翻滚
  const spinning = S.state === 'SPIN' && S.running && !S.paused;
  const agitation = (S.state === 'WASH' && S.running) ? 1 : (S.state === 'RINSE' && S.running) ? 0.6 : 0;
  clothes.forEach((c, i) => {
    const u = c.userData;
    if (spinning) {
      u.radius += (0.168 - u.radius) * Math.min(1, dt * 2.5);   // 贴壁
      u.angle += S.drumSpeed * dt;                               // 随筒同步
    } else if (S.running && !S.paused && S.drumSpeed * S.washDir !== 0) {
      u.radius += ((0.10 + (i % 3) * 0.022) - u.radius) * Math.min(1, dt);
      u.angle += S.drumSpeed * dt * 0.85;
      // 翻到顶部附近打滑下落
      const slip = Math.max(0, Math.sin(u.angle)) * agitation;
      u.angle -= slip * dt * 2.2;
    } else {
      // 静置: 缓慢沉底
      const targetAngle = -Math.PI / 2 + (i - 2) * 0.35;
      let d = targetAngle - u.angle;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      u.angle += d * Math.min(1, dt * 1.5);
      u.radius += (0.085 - u.radius) * Math.min(1, dt * 1.5);
    }
    const bob = Math.sin(t * 3 + u.phase) * 0.012 * agitation;
    c.position.set(Math.cos(u.angle) * u.radius,
                   Math.sin(u.angle) * u.radius + bob, u.z);
  });

  // 衣物装卸缩放动画
  clothes.forEach(c => {
    const u = c.userData;
    if (u.scaleTo === undefined) return;
    u.scaleT += dt;
    if (u.scaleT < 0) return;
    const f = Math.min(1, u.scaleT / 0.45);
    const s = THREE.MathUtils.lerp(u.scaleFrom, u.scaleTo, f * f * (3 - 2 * f));
    c.scale.setScalar(Math.max(0.001, s));
  });
}

function updateWaterFoam(dt, t) {
  if (waterMesh) {
    const lv = Math.max(0.001, S.waterLevel);
    waterMesh.scale.y += (lv - waterMesh.scale.y) * Math.min(1, dt * 2);
    waterMesh.position.y = 0.42 - 0.228 * (1 - waterMesh.scale.y);
    waterMesh.material.opacity = 0.25 + 0.3 * Math.min(1, S.waterLevel * 2);
    waterMesh.visible = waterMesh.scale.y > 0.01;
  }
  if (foamPoints) {
    foamMat.opacity += (S.foamAmount * 0.9 - foamMat.opacity) * Math.min(1, dt * 1.5);
    foamPoints.rotation.z += S.drumSpeed * dt * 0.35;
    foamPoints.visible = foamMat.opacity > 0.02;
  }
}

function updateBody(dt, t) {
  // 舱门 / 抽屉 缓动
  const doorTarget = S.doorOpen ? -1.92 : 0;
  N.DoorPivot.rotation.y += (doorTarget - N.DoorPivot.rotation.y) * Math.min(1, dt * 5);
  const drawerTarget = N.drawerBaseZ + (S.drawerOpen ? 0.16 : 0);
  N.DetergentDrawer.position.z += (drawerTarget - N.DetergentDrawer.position.z) * Math.min(1, dt * 5);

  // 旋钮指示当前程序
  const keys = Object.keys(PROGRAMS);
  const knobTarget = -keys.indexOf(S.program) * 0.7;
  N.KnobPivot.rotation.z += (knobTarget - N.KnobPivot.rotation.z) * Math.min(1, dt * 6);

  // 脱水震动
  const spinF = S.state === 'SPIN' && S.running && !S.paused
    ? Math.min(1, Math.abs(S.drumSpeed) / 20) : 0;
  const amp = spinF * 0.0022;
  washerRoot.position.x = Math.sin(t * 47) * amp + Math.sin(t * 31) * amp * 0.6;
  washerRoot.position.z = Math.cos(t * 43) * amp;
  washerRoot.rotation.z = Math.sin(t * 39) * amp * 0.12;

  // 待机呼吸灯环
  ring.material.opacity = S.running ? 0.35 + 0.15 * Math.sin(t * 4) : 0.18;
}

// ---------------------------------------------------------------- 主循环
let dispTimer = 0;
let simTime = 0;
function tick(rawDt, doRender = true) {
  const dt = rawDt * S.timeScale;
  simTime += rawDt;
  const t = simTime;

  updateCycle(dt);
  if (N.DrumPivot) {
    updateDrum(rawDt, t);       // 衣物动画用真实 dt, 视觉更平滑
    updateWaterFoam(rawDt, t);
    updateBody(rawDt, t);
  }

  dispTimer += rawDt;
  if (dispTimer > 0.25) {
    dispTimer = 0;
    document.getElementById('scr-time').textContent = fmtTime(remainingSeconds());
    document.getElementById('scr-progress').style.width = `${elapsedFraction() * 100}%`;
    if (S.running && S.stageTime >= S.stages[S.stageIndex]?.dur - 0.02) refreshUI();
    drawDisplay();
  }

  controls.update();
  if (doRender) renderer.render(scene, camera);
}
function animate() {
  requestAnimationFrame(animate);
  tick(Math.min(clock.getDelta(), 0.05));
}
animate();
// 测试钩子: 无头环境下手动步进, 只在最后一帧渲染 (不影响正常使用)
window.__step = (sec) => {
  const n = Math.max(1, Math.round(sec * 60));
  for (let i = 0; i < n; i++) tick(1 / 60, i === n - 1);
};
// 测试钩子: 从相机向 NDC 坐标发射线, 返回依次命中的物体名
window.__raycastAt = (nx, ny) => {
  const rc = new THREE.Raycaster();
  rc.setFromCamera(new THREE.Vector2(nx, ny), camera);
  return rc.intersectObjects(scene.children, true)
    .filter(h => h.object.isMesh)
    .map(h => `${h.object.name || h.object.type}@${h.distance.toFixed(2)}`)
    .slice(0, 10);
};

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
