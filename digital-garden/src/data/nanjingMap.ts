/**
 * 南京市地图数据（地标 + 骑行路线）
 * 区界: realDistricts.ts (高德, GCJ-02) | 水系: realWater.ts (OSM, 已转 GCJ-02)
 * 坐标范围：经度 118.363-119.242，纬度 31.228-32.614（全市 11 区）
 * 投影：等距圆柱 + cos(31.92°) 校正，SVG 画布 801x1449
 * 注：本文件中的经纬度为 WGS84，渲染前统一转 GCJ-02 与区界对齐
 */

// ==================== 投影（与 scripts/convert.cjs 一致） ====================
const LON0 = 118.363373;
const LAT1 = 32.614363;
const SCALE = 1010;
const COS_LAT = 0.84872;
const PAD = 24;

const lon2x = (lon: number) => PAD + (lon - LON0) * SCALE * COS_LAT;
const lat2y = (lat: number) => PAD + (LAT1 - lat) * SCALE;

// ==================== WGS84 -> GCJ-02（对齐高德区界） ====================
const AXIS = 6378245.0;
const EE = 0.00669342162296594323;

function tLat(x: number, y: number) {
  let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin((y / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((160.0 * Math.sin((y / 12.0) * Math.PI) + 320 * Math.sin((y * Math.PI) / 30.0)) * 2.0) / 3.0;
  return ret;
}
function tLon(x: number, y: number) {
  let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  ret += ((20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0) / 3.0;
  ret += ((20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin((x / 3.0) * Math.PI)) * 2.0) / 3.0;
  ret += ((150.0 * Math.sin((x / 12.0) * Math.PI) + 300.0 * Math.sin((x / 30.0) * Math.PI)) * 2.0) / 3.0;
  return ret;
}
function wgs2gcj(lon: number, lat: number): [number, number] {
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

// WGS84 经纬度 -> SVG 坐标
const proj = (lon: number, lat: number): [number, number] => {
  const [glon, glat] = wgs2gcj(lon, lat);
  return [lon2x(glon), lat2y(glat)];
};
const pt = (lon: number, lat: number) => {
  const [x, y] = proj(lon, lat);
  return { x, y };
};

// 经纬度点串 -> SVG path
const pts = (coords: [number, number][], close = false) =>
  coords
    .map(([lon, lat], i) => {
      const [x, y] = proj(lon, lat);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ') + (close ? ' Z' : '');

// ==================== 地标 ====================
export interface Landmark {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'mountain' | 'lake' | 'river' | 'scenic' | 'historic' | 'transport' | 'cbd';
}

export const landmarks: Landmark[] = [
  { id: 'zijin', name: '紫金山', ...pt(118.853, 32.072), type: 'mountain' },
  { id: 'xuanwu-lake', name: '玄武湖', ...pt(118.802, 32.092), type: 'lake' },
  { id: 'zhongshan-ling', name: '中山陵', ...pt(118.864, 32.054), type: 'scenic' },
  { id: 'xinjiekou', name: '新街口', ...pt(118.784, 32.041), type: 'cbd' },
  { id: 'nanjing-south', name: '南京南站', ...pt(118.799, 31.968), type: 'transport' },
  { id: 'nanjing-station', name: '南京站', ...pt(118.796, 32.086), type: 'transport' },
  { id: 'laomendong', name: '老门东', ...pt(118.785, 32.013), type: 'historic' },
  { id: 'fuzimiao', name: '夫子庙', ...pt(118.792, 32.022), type: 'historic' },
  { id: 'jiangxinzhou', name: '江心洲', ...pt(118.655, 32.000), type: 'scenic' },
  { id: 'mochou', name: '莫愁湖', ...pt(118.757, 32.024), type: 'lake' },
];

// ==================== 骑行路线 ====================
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

export const ridingRoutes: RidingRoute[] = [
  {
    id: 'zhongshan-loop',
    name: '中山陵环线',
    nameEn: 'Sun Yat-sen Mausoleum Loop',
    // 紫金山南麓：苜蓿园 -> 陵园路 -> 中山陵 -> 灵谷寺 -> 紫金山东路
    path: pts([
      [118.838, 32.043],
      [118.850, 32.050],
      [118.862, 32.053],
      [118.872, 32.048],
      [118.870, 32.040],
      [118.858, 32.035],
      [118.845, 32.036],
    ], true),
    length: '约 15km',
    ridden: true,
    date: '2026-08-15',
    notes: '清晨的中山陵，梧桐树荫下骑行，风都是凉的。',
  },
  {
    id: 'xuanwu-lake',
    name: '玄武湖环湖',
    nameEn: 'Xuanwu Lake Loop',
    // 贴真实玄武湖岸线的环湖路（湖体 WGS84 范围 118.782-118.809, 32.061-32.088）
    path: pts([
      [118.784, 32.063],
      [118.781, 32.072],
      [118.785, 32.083],
      [118.793, 32.089],
      [118.803, 32.090],
      [118.810, 32.084],
      [118.811, 32.073],
      [118.806, 32.064],
      [118.797, 32.060],
      [118.789, 32.060],
    ], true),
    length: '约 10km',
    ridden: true,
    date: '2026-07-20',
    notes: '夏天的玄武湖，荷花盛开，但人也很多。',
  },
  {
    id: 'riverside',
    name: '滨江大道',
    nameEn: 'Riverside Avenue',
    // 沿夹江东岸（河西滨江）：鱼嘴 -> 绿博园 -> 三汊河，贴 OSM 夹江真实河道
    path: pts([
      [118.649, 31.973],
      [118.676, 31.982],
      [118.708, 31.998],
      [118.708, 32.015],
      [118.720, 32.042],
      [118.729, 32.059],
      [118.732, 32.074],
      [118.736, 32.098],
    ]),
    length: '约 20km',
    ridden: false,
  },
  {
    id: 'qinhuai-path',
    name: '秦淮河畔',
    nameEn: 'Qinhuai River Path',
    // 贴 OSM 秦淮河真实河道：江宁段 -> 七桥瓮 -> 中华门 -> 夫子庙
    path: pts([
      [118.823, 31.953],
      [118.830, 31.976],
      [118.834, 31.998],
      [118.824, 32.012],
      [118.811, 32.015],
      [118.800, 32.018],
      [118.793, 32.022],
    ]),
    length: '约 8km',
    ridden: true,
    date: '2026-06-10',
    notes: '夜骑秦淮河，灯影摇曳，像穿越回古代。',
  },
  {
    id: 'purple-mountain',
    name: '紫金山绿道',
    nameEn: 'Purple Mountain Greenway',
    // 环陵路：玄武湖东 -> 板仓街 -> 蒋王庙 -> 紫金山北 -> 钟山体育公园
    path: pts([
      [118.812, 32.068],
      [118.826, 32.076],
      [118.843, 32.080],
      [118.859, 32.080],
      [118.872, 32.072],
      [118.870, 32.062],
      [118.858, 32.057],
      [118.842, 32.058],
      [118.826, 32.062],
    ], true),
    length: '约 12km',
    ridden: false,
  },
  {
    id: 'laomendong',
    name: '老门东-中华门',
    nameEn: 'Laomendong to Zhonghua Gate',
    path: pts([
      [118.785, 32.013],
      [118.779, 32.006],
      [118.775, 31.998],
      [118.770, 31.993],
    ]),
    length: '约 5km',
    ridden: false,
  },
  {
    id: 'jiangxinzhou',
    name: '江心洲环岛',
    nameEn: 'Jiangxinzhou Island Loop',
    // 江心洲位于长江主航道与夹江之间（OSM 实测：主航道西侧 ~118.65，夹江东侧 ~118.70）
    path: pts([
      [118.672, 32.025],
      [118.688, 32.022],
      [118.695, 32.005],
      [118.693, 31.985],
      [118.682, 31.975],
      [118.670, 31.980],
      [118.666, 32.000],
    ], true),
    length: '约 18km',
    ridden: false,
  },
  {
    id: 'yuhuatai',
    name: '雨花台-南站',
    nameEn: 'Yuhuatai to South Station',
    path: pts([
      [118.776, 31.989],
      [118.788, 31.979],
      [118.798, 31.969],
      [118.806, 31.961],
    ]),
    length: '约 7km',
    ridden: false,
  },
];

export { lon2x, lat2y };
