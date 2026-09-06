/**
 * 南京水系数据转换脚本
 * 数据源: OpenStreetMap (Overpass API) — WGS84 坐标
 * 处理: WGS84 -> GCJ-02（对齐高德行政区划边界） -> 投影 -> SVG path
 * 输出: src/data/realWater.ts
 */
const fs = require('fs');

// ==================== 投影（与 realDistricts.ts / nanjingMap.ts 一致） ====================
const LON0 = 118.363373;
const LAT1 = 32.614363;
const SCALE = 1010;
const COS_LAT = 0.84872;
const PAD = 24;
const lon2x = (lon) => PAD + (lon - LON0) * SCALE * COS_LAT;
const lat2y = (lat) => PAD + (LAT1 - lat) * SCALE;

// ==================== WGS84 -> GCJ-02 ====================
const PI = Math.PI;
const AXIS = 6378245.0;
const EE = 0.00669342162296594323;
function tLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}
function tLon(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
  return ret;
}
function wgs2gcj(lon, lat) {
  let dLat = tLat(lon - 105.0, lat - 35.0);
  let dLon = tLon(lon - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((AXIS * (1 - EE)) / (magic * sqrtMagic)) * PI);
  dLon = (dLon * 180.0) / ((AXIS / sqrtMagic) * Math.cos(radLat) * PI);
  return [lon + dLon, lat + dLat];
}

// ==================== 工具 ====================
function simplifyDP(ring, tolerance = 0.0003) {
  if (ring.length <= 4) return ring;
  const sqT = tolerance * tolerance;
  function d2(p, a, b) {
    let x = a[0], y = a[1];
    const dx = b[0] - x, dy = b[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    const ddx = p[0] - x, ddy = p[1] - y;
    return ddx * ddx + ddy * ddy;
  }
  function step(pts, first, last, out) {
    let maxD = sqT, idx;
    for (let i = first + 1; i < last; i++) {
      const dd = d2(pts[i], pts[first], pts[last]);
      if (dd > maxD) { idx = i; maxD = dd; }
    }
    if (maxD > sqT) {
      if (idx - first > 1) step(pts, first, idx, out);
      out.push(pts[idx]);
      if (last - idx > 1) step(pts, idx, last, out);
    }
  }
  const out = [ring[0]];
  step(ring, 0, ring.length - 1, out);
  out.push(ring[ring.length - 1]);
  return out;
}

// 点串(wgs84 [[lon,lat],...]) -> SVG path 片段
function ptsToPath(pts, close) {
  if (pts.length < 2) return '';
  const s = simplifyDP(pts);
  return (
    s
      .map(([lon, lat], i) => {
        const [glon, glat] = wgs2gcj(lon, lat);
        return `${i === 0 ? 'M' : 'L'} ${lon2x(glon).toFixed(1)} ${lat2y(glat).toFixed(1)}`;
      })
      .join(' ') + (close ? ' Z' : '')
  );
}

// 贪心拼接多条线段为连续折线（端点距离 < eps 视为相连）
function stitchLines(segments, eps = 0.004) {
  const segs = segments.map((s) => s.slice());
  const chains = [];
  while (segs.length) {
    let chain = segs.shift();
    let extended = true;
    while (extended) {
      extended = false;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        const head = chain[0], tail = chain[chain.length - 1];
        const sh = s[0], st = s[s.length - 1];
        const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
        if (dist(tail, sh) < eps) { chain = chain.concat(s.slice(1)); }
        else if (dist(tail, st) < eps) { chain = chain.concat(s.slice(0, -1).reverse()); }
        else if (dist(head, st) < eps) { chain = s.slice(0, -1).concat(chain); }
        else if (dist(head, sh) < eps) { chain = s.slice(1).reverse().concat(chain); }
        else continue;
        segs.splice(i, 1);
        extended = true;
        break;
      }
    }
    chains.push(chain);
  }
  return chains;
}

// relation 外/内环拼接为闭合环
function stitchRings(ways) {
  const segs = ways.map((w) => w.geometry.filter(Boolean).map((p) => [p.lon, p.lat]));
  return stitchLines(segs, 1e-5).filter((r) => r.length > 3);
}

// ==================== 读取数据 ====================
const areas = require('/tmp/nj_areas_merged.json').elements;
const lines = require('/tmp/nj_lines.json').elements.filter((e) => e.tags && e.tags.waterway && e.geometry);

const byName = (name) =>
  lines
    .filter((e) => e.tags.name === name)
    .map((e) => e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]));

const byNameContains = (name) =>
  lines
    .filter((e) => e.tags.name && e.tags.name.includes(name))
    .map((e) => e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]));

// ==================== 1. 长江（中心线 -> 宽带状河流） ====================
const yangtzeChains = stitchLines(byName('长江'));
const yangtze = {
  id: 'yangtze',
  name: '长江',
  paths: yangtzeChains.map((c) => ptsToPath(c, false)).filter(Boolean),
  width: 20,
};
console.log(`长江: ${yangtzeChains.length} 条链, ${yangtzeChains.reduce((a, c) => a + c.length, 0)} 点`);

// ==================== 2. 主要河流（线状） ====================
const riverDefs = [
  { names: ['秦淮河', '外秦淮河', '内秦淮河'], id: 'qinhuai', name: '秦淮河', width: 3.5 },
  { names: ['夹江'], id: 'jiajiang', name: '夹江', width: 6 },
  { names: ['滁河'], id: 'chuhe', name: '滁河', width: 4 },
  { names: ['金川河'], id: 'jinchuan', name: '金川河', width: 2 },
  { names: ['胭脂河'], id: 'yanzhi', name: '胭脂河', width: 2 },
  { names: ['胥河'], id: 'xuhe', name: '胥河', width: 2.5 },
  { names: ['溧水河'], id: 'lishui', name: '溧水河', width: 2 },
  { names: ['南河'], id: 'nanhe', name: '南河', width: 2 },
  { contains: '北河', id: 'beihe', name: '北河', width: 2 },
  { names: ['九乡河'], id: 'jiuxiang', name: '九乡河', width: 1.8 },
  { names: ['七乡河'], id: 'qixiang', name: '七乡河', width: 1.8 },
  { names: ['运粮河'], id: 'yunliang', name: '运粮河', width: 1.5 },
  { names: ['板桥河'], id: 'banqiao', name: '板桥河', width: 1.8 },
  { names: ['牛首山河'], id: 'niushou', name: '牛首山河', width: 1.5 },
  { names: ['便民河'], id: 'bianmin', name: '便民河', width: 1.8 },
  { names: ['马汊河'], id: 'macha', name: '马汊河', width: 2.5 },
  { names: ['明御河'], id: 'mingyu', name: '明御河', width: 1.5 },
  { names: ['护城河'], id: 'hucheng', name: '护城河', width: 1.8 },
];

const riverLines = [];
for (const def of riverDefs) {
  const segs = def.contains ? byNameContains(def.contains) : def.names.flatMap((n) => byName(n));
  if (!segs.length) { console.log(`${def.name}: 无数据`); continue; }
  const chains = stitchLines(segs);
  const paths = chains.map((c) => ptsToPath(c, false)).filter(Boolean);
  riverLines.push({ id: def.id, name: def.name, paths, width: def.width });
  console.log(`${def.name}: ${chains.length} 条链, ${chains.reduce((a, c) => a + c.length, 0)} 点`);
}

// ==================== 3. 湖泊（relation 面片，含湖心岛洞） ====================
const relLakes = [
  { rid: '2138994', id: 'xuanwu-lake', name: '玄武湖' },
  { rid: '18231223', id: 'mochou-lake', name: '莫愁湖' },
  { rid: '14305804', id: 'shijiu-lake', name: '石臼湖' },
  { rid: '18018554', id: 'gucheng-lake', name: '固城湖' },
];

const lakeAreas = [];
for (const lake of relLakes) {
  const rel = require(`/tmp/nj_rel_${lake.rid}.json`).elements[0];
  const outerWays = (rel.members || []).filter((m) => m.type === 'way' && m.role === 'outer' && Array.isArray(m.geometry));
  const innerWays = (rel.members || []).filter((m) => m.type === 'way' && m.role === 'inner' && Array.isArray(m.geometry));
  const outers = stitchRings(outerWays);
  const inners = stitchRings(innerWays);
  const path = [...outers, ...inners].map((r) => ptsToPath(r, true)).filter(Boolean).join(' ');
  lakeAreas.push({ id: lake.id, name: lake.name, path });
  console.log(`${lake.name}: 外环 ${outers.length}, 内环 ${inners.length}`);
}

// ==================== 4. 其他命名湖泊（way 面片） ====================
const excludeRe = /水库|塘|池|喷|鱼|尾矿|沟|坝|井|坑|unknown/i;
const relLakeNames = new Set(['玄武湖', '莫愁湖', '石臼湖', '固城湖']);
const seen = new Set();
const seenIds = new Set();
for (const e of areas) {
  const name = e.tags && e.tags.name;
  if (!name || relLakeNames.has(name) || excludeRe.test(name)) continue;
  if (e.tags.water && !['lake', 'oxbow'].includes(e.tags.water)) continue;
  if (!e.geometry || e.geometry.length < 25) continue;
  if (seen.has(name)) continue;
  seen.add(name);
  seenIds.add(e.id);
  const ring = e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]);
  const path = ptsToPath(ring, true);
  if (path) {
    lakeAreas.push({ id: 'lake-' + e.id, name, path });
    console.log(`湖泊: ${name} (${ring.length} 点)`);
  }
}

// 夹江其余面片（汊道真实水面 way，跳过湖泊 pass 已收录的那一段）
for (const e of areas) {
  if (e.tags && e.tags.name === '夹江' && e.geometry && e.geometry.length >= 10 && !seenIds.has(e.id)) {
    const ring = e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]);
    const path = ptsToPath(ring, true);
    if (path) lakeAreas.push({ id: 'jiajiang-area-' + e.id, name: '夹江', path });
  }
}

// ==================== 输出 ====================
const ts = `// 自动生成的南京水系数据（OpenStreetMap, WGS84->GCJ-02 对齐高德区界）
// 生成: scripts/convert-water.cjs

export interface WaterLine {
  id: string;
  name: string;
  paths: string[];
  width: number;
}

export interface WaterArea {
  id: string;
  name: string;
  path: string; // 含湖心岛内环，配合 fill-rule="evenodd"
}

// 长江（真实中心线，宽带状描边渲染）
export const yangtze: WaterLine = ${JSON.stringify(yangtze, null, 2)};

// 主要河流
export const riverLines: WaterLine[] = ${JSON.stringify(riverLines, null, 2)};

// 湖泊水面
export const lakeAreas: WaterArea[] = ${JSON.stringify(lakeAreas, null, 2)};
`;

fs.writeFileSync('/workspace/digital-garden/src/data/realWater.ts', ts);
console.log('\n生成成功: src/data/realWater.ts,', fs.statSync('/workspace/digital-garden/src/data/realWater.ts').size, 'bytes');
