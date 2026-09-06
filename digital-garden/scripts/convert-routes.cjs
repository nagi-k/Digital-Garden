/**
 * 南京热门骑行路线生成脚本
 * 数据源: OpenStreetMap 真实道路/湖岸几何（WGS84 -> GCJ-02 -> SVG path）
 * 输出: src/data/realRoutes.ts
 *
 * 数据文件:
 *  /tmp/nj_roads.json       按路名查询的骑行道路
 *  /tmp/nj_zijin_area.json  紫金山区域全量命名道路（蒋王庙街/资金山东路等连接段）
 *  /tmp/nj_lines.json       水系中心线（秦淮河等）
 *  /tmp/nj_rel_2138994.json 玄武湖 relation
 *  /tmp/nj_rel_18018554.json 固城湖 relation
 */
const fs = require('fs');

// ==================== 投影（与其他数据一致） ====================
const LON0 = 118.363373;
const LAT1 = 32.614363;
const SCALE = 1010;
const COS_LAT = 0.84872;
const PAD = 24;
const lon2x = (lon) => PAD + (lon - LON0) * SCALE * COS_LAT;
const lat2y = (lat) => PAD + (LAT1 - lat) * SCALE;

// ==================== WGS84 -> GCJ-02 ====================
const AXIS = 6378245.0;
const EE = 0.00669342162296594323;
function tLat(x, y) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}
function tLon(x, y) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0;
  return ret;
}
function wgs2gcj(lon, lat) {
  let dLat = tLat(lon - 105.0, lat - 35.0);
  let dLon = tLon(lon - 105.0, lat - 35.0);
  const radLat = (lat / 180.0) * Math.PI;
  let magic = Math.sin(radLat);
  magic = 1 - EE * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / (((AXIS * (1 - EE)) / (magic * sqrtMagic)) * Math.PI);
  dLon = (dLon * 180.0) / ((AXIS / sqrtMagic) * Math.cos(radLat) * Math.PI);
  return [lon + dLon, lat + dLat];
}

// ==================== 几何工具 ====================
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// 真实里程（haversine, km）
function haversine(coords) {
  let km = 0;
  for (let i = 1; i < coords.length; i++) {
    const [lon1, lat1] = coords[i - 1];
    const [lon2, lat2] = coords[i];
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    km += 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return km;
}

// Douglas-Peucker 简化
function simplifyDP(ring, tolerance = 0.0002) {
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

// 端点拼接（乱序 way -> 长链）
function stitch(segs, eps = 0.004) {
  segs = segs.map((s) => s.slice());
  const chains = [];
  while (segs.length) {
    let c = segs.shift();
    let ext = true;
    while (ext) {
      ext = false;
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        const h = c[0], t = c[c.length - 1], sh = s[0], st = s[s.length - 1];
        if (dist(t, sh) < eps) c = c.concat(s.slice(1));
        else if (dist(t, st) < eps) c = c.concat(s.slice(0, -1).reverse());
        else if (dist(h, st) < eps) c = s.slice(0, -1).concat(c);
        else if (dist(h, sh) < eps) c = s.slice(1).reverse().concat(c);
        else continue;
        segs.splice(i, 1);
        ext = true;
        break;
      }
    }
    chains.push(c);
  }
  return chains.sort((a, b) => b.length - a.length);
}

/**
 * 去折返（A->B->A 尖刺/死胡同支路）：
 * 在 window 点范围内，若 chain[j] 回到 chain[i] 附近（< eps），
 * 且中间绕行长度明显大于直线距离，则判定为折返段并删除。
 */
function despike(chain, eps = 0.0012, window = 80) {
  let pts = chain.slice();
  let changed = true;
  let guard = 0;
  while (changed && guard++ < 200) {
    changed = false;
    outer: for (let i = 0; i < pts.length - 2; i++) {
      const jMax = Math.min(pts.length - 1, i + window);
      for (let j = i + 2; j <= jMax; j++) {
        const d = dist(pts[i], pts[j]);
        if (d < eps) {
          let midLen = 0;
          for (let k = i + 1; k <= j; k++) midLen += dist(pts[k - 1], pts[k]);
          if (midLen > d * 3 + 1e-6) {
            pts = pts.slice(0, i + 1).concat(pts.slice(j));
            changed = true;
            break outer;
          }
        }
      }
    }
  }
  return pts;
}

/**
 * 双向分幅道路单向化：
 * 以 axis（'lon'/'lat'）为主轴，按各段沿主轴的净位移方向投票（按段长度加权），
 * 只保留多数方向的车道段。
 */
function keepOneDirection(segs, axis) {
  const ai = axis === 'lon' ? 0 : 1;
  const scored = segs.map((s) => {
    const dMain = s[s.length - 1][ai] - s[0][ai];
    return { s, dMain, len: haversine(s) };
  });
  let pos = 0, neg = 0;
  for (const { dMain, len } of scored) {
    if (dMain > 0) pos += len; else if (dMain < 0) neg += len;
  }
  const keepSign = pos >= neg ? 1 : -1;
  return scored.filter(({ dMain }) => Math.sign(dMain) === keepSign).map(({ s }) => s);
}

/**
 * 有序桥接：按给定顺序连接多条链。
 * 每条链自动定向（使其起点靠近上一条链的终点），缝隙用直线桥接。
 */
function bridge(legs) {
  const out = [];
  for (let leg of legs) {
    if (!leg || leg.length < 2) continue;
    if (out.length) {
      const tail = out[out.length - 1];
      if (dist(tail, leg[leg.length - 1]) < dist(tail, leg[0])) leg = leg.slice().reverse();
      out.push(leg[0]); // 桥接点（直线跨缝）
    }
    for (let i = out.length && dist(out[out.length - 1], leg[0]) < 1e-9 ? 1 : 0; i < leg.length; i++) out.push(leg[i]);
  }
  return out;
}

// 裁剪：取满足条件的最长连续点列
function cropRun(chain, keep) {
  const runs = [];
  let cur = [];
  for (const p of chain) {
    if (keep(p)) cur.push(p);
    else if (cur.length) { runs.push(cur); cur = []; }
  }
  if (cur.length) runs.push(cur);
  return runs.sort((a, b) => b.length - a.length)[0] || [];
}

function toPath(coords, close = false, tol = 0.0002) {
  const s = simplifyDP(coords, tol);
  return (
    s
      .map(([lon, lat], i) => {
        const [glon, glat] = wgs2gcj(lon, lat);
        return `${i === 0 ? 'M' : 'L'} ${lon2x(glon).toFixed(1)} ${lat2y(glat).toFixed(1)}`;
      })
      .join(' ') + (close ? ' Z' : '')
  );
}

const lenOf = (coords, tol = 0.0002) => haversine(simplifyDP(coords, tol));

// ==================== 读取数据 ====================
const ways = [
  ...require('/tmp/nj_roads.json').elements,
  ...require('/tmp/nj_zijin_area.json').elements,
].filter((e) => e.type === 'way' && e.geometry && e.tags && e.tags.name);

// 两个数据文件可能包含相同的 way，按 名称+端点+点数 去重
const seenWay = new Set();
const byName = (name) =>
  ways
    .filter((e) => e.tags.name === name)
    .map((e) => e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]))
    .filter((g) => {
      if (g.length < 2) return false;
      const k = `${name}|${g[0]}|${g[g.length - 1]}|${g.length}`;
      if (seenWay.has(k)) return false;
      seenWay.add(k);
      return true;
    });

const routes = [];

// ---------- 1. 环陵路·紫金山线（板仓街-蒋王庙街-环陵路-紫金山东路-灵谷寺） ----------
{
  const bancang = stitch(byName('板仓街'), 0.005)[0];
  const jwm = stitch(byName('蒋王庙街'), 0.001)[0]; // 最长链即主线（secondary）
  // 环陵路：双向分幅，取净向东的长车道段（62 pts 主车道）
  const huanling = byName('环陵路').filter((s) => s.length > 40 && s[s.length - 1][0] > s[0][0])[0];
  // 紫金山东路 + 资金山东路（OSM 错别字名，实为同一条路缺口段）
  const zjd = stitch([...byName('紫金山东路'), ...byName('资金山东路')], 0.005)[0];
  // 灵谷寺路：去掉退化闭环段（灵谷寺门前小环岛）
  const lgs = stitch(byName('灵谷寺路').filter((s) => haversine(s) > 0.05), 0.005)[0];

  let chain = bridge([bancang, jwm, huanling, zjd, lgs]);
  chain = despike(chain, 0.0012, 80);
  routes.push({
    id: 'huanling-loop',
    name: '环陵路·紫金山线',
    nameEn: 'Purple Mountain via Huanling',
    path: toPath(chain, false, 0.0003),
    length: `约 ${Math.round(lenOf(chain, 0.0003))}km`,
    ridden: false,
    notes: '板仓街-蒋王庙街-环陵路-紫金山东路-灵谷寺，南京最经典的爬坡线，一路梧桐与竹海。',
  });
  console.log('环陵路·紫金山线:', chain.length, 'pts,', haversine(chain).toFixed(1) + 'km');
}

// ---------- 2. 陵园路（梧桐大道） ----------
{
  // 排除江宁另一条同名陵园路（lon > 118.88）
  const segs = byName('陵园路').filter((s) => s.every((p) => p[0] < 118.88));
  const chain = despike(stitch(segs, 0.005)[0], 0.0008, 40);
  routes.push({
    id: 'lingyuan-road',
    name: '陵园路·梧桐大道',
    nameEn: 'Lingyuan Road Wutong Avenue',
    path: toPath(chain, false, 0.0001),
    length: `约 ${Math.round(lenOf(chain, 0.0001))}km`,
    ridden: true,
    date: '2026-08-15',
    notes: '苜蓿园到中山陵的梧桐隧道，清晨光影斑驳，南京骑行天花板。',
  });
  console.log('陵园路:', chain.length, 'pts,', haversine(chain).toFixed(1) + 'km');
}

// ---------- 3. 玄武湖环湖线（湖岸真实轮廓） ----------
{
  const rel = require('/tmp/nj_rel_2138994.json').elements[0];
  const outerWays = (rel.members || []).filter((m) => m.type === 'way' && m.role === 'outer' && Array.isArray(m.geometry));
  const ring = stitch(outerWays.map((w) => w.geometry.filter(Boolean).map((p) => [p.lon, p.lat])), 1e-5)[0];
  routes.push({
    id: 'xuanwu-lake',
    name: '玄武湖环湖线',
    nameEn: 'Xuanwu Lake Loop',
    path: toPath(ring, true),
    length: `约 ${Math.round(lenOf(ring))}km`,
    ridden: true,
    date: '2026-07-20',
    notes: '夏天的玄武湖，荷花盛开，湖风穿过五洲，但人也很多。',
  });
  console.log('玄武湖环湖:', ring.length, 'pts,', haversine(ring).toFixed(1) + 'km');
}

// ---------- 4. 秦淮河畔线（外秦淮河真实河道，江宁->夫子庙） ----------
{
  const qSegs = require('/tmp/nj_lines.json')
    .elements.filter((e) => e.type === 'way' && e.tags && e.tags.name === '秦淮河' && e.geometry)
    .map((e) => e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]));
  // 主链：江宁(31.87) -> 夫子庙(32.025) 天然终止，不到三汊河；去汊道/岛屿折返
  const chain = despike(
    cropRun(stitch(qSegs, 0.001)[0], (p) => p[1] >= 31.95 && p[1] <= 32.026),
    0.0008, 80
  );
  routes.push({
    id: 'qinhuai-path',
    name: '秦淮河畔线',
    nameEn: 'Qinhuai River Path',
    path: toPath(chain, false, 0.0003),
    length: `约 ${Math.round(lenOf(chain, 0.0003))}km`,
    ridden: true,
    date: '2026-06-10',
    notes: '夜骑秦淮河，从江宁进中华门，灯影摇曳，像穿越回古代。',
  });
  console.log('秦淮河畔:', chain.length, 'pts,', haversine(chain).toFixed(1) + 'km');
}

// ---------- 5. 河西滨江绿道（夹江中心线，绿道沿江而走） ----------
{
  const jjSegs = require('/tmp/nj_lines.json')
    .elements.filter((e) => e.type === 'way' && e.tags && e.tags.name === '夹江' && e.geometry)
    .map((e) => e.geometry.filter(Boolean).map((p) => [p.lon, p.lat]))
    // 只要江心洲与河西之间的夹江（排除八卦洲北侧同名水道）
    .filter((g) => g.some((p) => p[1] < 32.11));
  // 取鱼嘴 -> 三汊河段（万景园-绿博园-南京眼沿线）
  const chain = cropRun(stitch(jjSegs, 0.001)[0], (p) => p[1] > 31.945 && p[1] < 32.075);
  routes.push({
    id: 'hex-riverside',
    name: '河西滨江绿道',
    nameEn: 'Hexi Riverside Greenway',
    path: toPath(chain, false, 0.0003),
    length: `约 ${Math.round(lenOf(chain, 0.0003))}km`,
    ridden: false,
    notes: '万景园-绿博园-南京眼-鱼嘴湿地公园，全程塑胶骑行道，看江豚和落日。',
  });
  console.log('河西滨江:', chain.length, 'pts,', haversine(chain).toFixed(1) + 'km');
}

// ---------- 6. 幕燕滨江线（永济大道，双向分幅取单向） ----------
{
  const oneWay = keepOneDirection(byName('永济大道'), 'lon');
  let chain = despike(stitch(oneWay, 0.005)[0], 0.0008, 40);
  routes.push({
    id: 'muyan-riverside',
    name: '幕燕滨江线',
    nameEn: 'Mufu-Yanzi Riverside',
    path: toPath(chain, false, 0.0002),
    length: `约 ${Math.round(lenOf(chain, 0.0002))}km`,
    ridden: false,
    notes: '上元门-幕府山-五马渡-燕子矶，一侧长江一侧山。',
  });
  console.log('幕燕滨江:', chain.length, 'pts,', haversine(chain).toFixed(1) + 'km');
}

// ---------- 7. 江心洲环岛线（江堤路 5 段即完整环岛路） ----------
{
  const chain = despike(stitch(byName('江堤路'), 0.001)[0], 0.0008, 60);
  const h = chain[0], t = chain[chain.length - 1];
  const gap = dist(h, t);
  routes.push({
    id: 'jiangxinzhou',
    name: '江心洲环岛线',
    nameEn: 'Jiangxinzhou Island Loop',
    path: toPath(chain, gap < 0.02, 0.0003),
    length: `约 ${Math.round(lenOf(chain, 0.0003))}km`,
    ridden: false,
    notes: '环岛江堤路一圈，网红灯塔、青奥森林公园，江风很大。',
  });
  console.log('江心洲环岛:', chain.length, 'pts, gap=', gap.toFixed(4), haversine(chain).toFixed(1) + 'km');
}

// ---------- 8. 老山沿山大道线 ----------
{
  // 沿山大道为双向分幅道路，只取净向东的车道段，避免往返穿线
  const eastbound = byName('沿山大道').filter((s) => s[s.length - 1][0] - s[0][0] > 0);
  const full = stitch(eastbound, 0.003)[0];
  // 裁剪到南京老山段（浦口，lon 118.50-118.68）
  const chain = despike(
    full.filter((p) => p[0] > 118.50 && p[0] < 118.68 && p[1] > 31.98 && p[1] < 32.20),
    0.001, 60
  );
  routes.push({
    id: 'laoshan',
    name: '老山沿山大道线',
    nameEn: 'Laoshan Foothill Ride',
    path: toPath(chain, false, 0.001),
    length: `约 ${Math.round(lenOf(chain, 0.001))}km`,
    ridden: false,
    notes: '老山南麓，森林覆盖率极高，洗肺路线，可接珍珠泉、水墨大埝。',
  });
  console.log('老山沿山大道:', chain.length, 'pts,', haversine(chain).toFixed(1) + 'km');
}

// ---------- 9. 固城湖湖滨线（湖岸北岸真实轮廓，去折返） ----------
{
  const rel = require('/tmp/nj_rel_18018554.json').elements[0];
  const outerWays = (rel.members || []).filter((m) => m.type === 'way' && m.role === 'outer' && Array.isArray(m.geometry));
  const ring = stitch(outerWays.map((w) => w.geometry.filter(Boolean).map((p) => [p.lon, p.lat])), 1e-5)[0];
  // 北岸弧段：高淳老街 -> 红砂咀（lon<=118.946 截断，东侧半岛绕行属湖东岸）
  const arc = despike(
    cropRun(ring, (p) => p[1] >= 31.285 && p[0] <= 118.946),
    0.0008, 60
  );
  routes.push({
    id: 'gucheng-lake',
    name: '固城湖湖滨线',
    nameEn: 'Gucheng Lake Shore',
    path: toPath(arc, false, 0.0005),
    length: `约 ${Math.round(lenOf(arc, 0.0005))}km`,
    ridden: false,
    notes: '高淳老街出发，沿固城湖北岸，水慢城芦苇荡，秋天看候鸟。',
  });
  console.log('固城湖湖滨:', arc.length, 'pts,', haversine(arc).toFixed(1) + 'km');
}

// ==================== 输出 ====================
const ts = `// 自动生成的南京热门骑行路线（OSM 真实道路/湖岸几何，WGS84->GCJ-02）
// 生成: scripts/convert-routes.cjs

export interface RidingRoute {
  id: string;
  name: string;
  nameEn: string;
  path: string;
  length: string;
  ridden: boolean;
  date?: string;
  notes?: string;
}

export const ridingRoutes: RidingRoute[] = ${JSON.stringify(routes, null, 2)};
`;

fs.writeFileSync('/workspace/digital-garden/src/data/realRoutes.ts', ts);
console.log('\n生成成功: src/data/realRoutes.ts,', fs.statSync('/workspace/digital-garden/src/data/realRoutes.ts').size, 'bytes,', routes.length, '条路线');
