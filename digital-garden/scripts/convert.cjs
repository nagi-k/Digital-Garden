const fs = require('fs');

const geojson = JSON.parse(fs.readFileSync('/tmp/nanjing_full.json', 'utf-8'));

// ==================== 投影参数（与 src/data/nanjingMap.ts 保持一致） ====================
// 南京全市 bbox: lon 118.363373~119.241663, lat 31.228097~32.614363
// 等距圆柱投影 + 纬度余弦校正（cos(31.92°)=0.84872），保证物理形状不变形
const LON0 = 118.363373;
const LAT1 = 32.614363;
const SCALE = 1010;              // 每度纬度对应的像素
const COS_LAT = 0.84872;         // cos(31.92°)
const PAD = 24;

const lon2x = (lon) => PAD + (lon - LON0) * SCALE * COS_LAT;
const lat2y = (lat) => PAD + (LAT1 - lat) * SCALE;

const VIEW_W = Math.ceil(PAD * 2 + (119.241663 - LON0) * SCALE * COS_LAT);
const VIEW_H = Math.ceil(PAD * 2 + (LAT1 - 31.228097) * SCALE);

// ==================== Douglas-Peucker 简化 ====================
function simplifyRing(ring, tolerance = 0.0008) {
  if (ring.length <= 4) return ring;

  const sqTolerance = tolerance * tolerance;

  function getSqSegDist(p, p1, p2) {
    let x = p1[0], y = p1[1];
    let dx = p2[0] - x, dy = p2[1] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = p2[0]; y = p2[1]; }
      else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p[0] - x; dy = p[1] - y;
    return dx * dx + dy * dy;
  }

  function simplifyDPStep(points, first, last, sqTol, simplified) {
    let maxSqDist = sqTol, index;
    for (let i = first + 1; i < last; i++) {
      const sqDist = getSqSegDist(points[i], points[first], points[last]);
      if (sqDist > maxSqDist) { index = i; maxSqDist = sqDist; }
    }
    if (maxSqDist > sqTol) {
      if (index - first > 1) simplifyDPStep(points, first, index, sqTol, simplified);
      simplified.push(points[index]);
      if (last - index > 1) simplifyDPStep(points, index, last, sqTol, simplified);
    }
  }

  const simplified = [ring[0]];
  simplifyDPStep(ring, 0, ring.length - 1, sqTolerance, simplified);
  simplified.push(ring[ring.length - 1]);
  return simplified;
}

function ringToPath(ring) {
  return ring.map((pt, i) => {
    const x = lon2x(pt[0]).toFixed(1);
    const y = lat2y(pt[1]).toFixed(1);
    return (i === 0 ? 'M' : 'L') + x + ' ' + y;
  }).join(' ') + ' Z';
}

// 个别区标签位置手动微调（避免压在长江或边界上）
const labelOverrides = {
  '320113': [118.93, 32.11], // 栖霞区：质心偏北靠江，南移
  '320102': [118.81, 32.06], // 玄武区：质心偏东，移到城区中心
};

const result = [];

for (const feature of geojson.features) {
  const name = feature.properties.name;
  const adcode = feature.properties.adcode;
  const coords = feature.geometry.coordinates; // MultiPolygon

  let path = '';
  for (const polygon of coords) {
    for (const ring of polygon) {
      const simplified = simplifyRing(ring);
      path += ringToPath(simplified) + ' ';
    }
  }

  const override = labelOverrides[String(adcode)];
  const centroid = override || feature.properties.centroid || feature.properties.center;

  result.push({
    name,
    adcode,
    path: path.trim(),
    pointCount: path.split(/[ML]/).length - 1,
    labelX: centroid ? lon2x(centroid[0]).toFixed(1) : '0',
    labelY: centroid ? lat2y(centroid[1]).toFixed(1) : '0',
  });
}

// 按 adcode 排序，主城在前
result.sort((a, b) => a.adcode - b.adcode);

for (const r of result) {
  console.log(`${r.name} (${r.adcode}): ${r.pointCount} points, label=(${r.labelX}, ${r.labelY})`);
}

const tsContent = `// 自动生成的南京市真实行政区划边界数据（全市 11 区）
// 来源: 阿里云 DataV GeoAtlas (高德行政区划数据) 320100_full.json
// 投影: 等距圆柱 + cos(31.92°) 校正, 画布 ${VIEW_W}x${VIEW_H}

export interface RealDistrict {
  id: string;
  name: string;
  adcode: number;
  path: string;
  labelX: number;
  labelY: number;
}

export const MAP_VIEW_W = ${VIEW_W};
export const MAP_VIEW_H = ${VIEW_H};

export const realDistricts: RealDistrict[] = [
${result.map(r => `  {
    id: '${r.adcode}',
    name: '${r.name}',
    adcode: ${r.adcode},
    path: \`${r.path}\`,
    labelX: ${r.labelX},
    labelY: ${r.labelY},
  }`).join(',\n')}
];
`;

fs.writeFileSync('/workspace/digital-garden/src/data/realDistricts.ts', tsContent);
console.log('\n生成成功: src/data/realDistricts.ts');
console.log('viewBox:', VIEW_W, 'x', VIEW_H);
console.log('文件大小:', fs.statSync('/workspace/digital-garden/src/data/realDistricts.ts').size, 'bytes');
