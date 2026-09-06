/**
 * 南京市地图数据
 * 边界数据来源：阿里云 DataV GeoAtlas（高德行政区划数据）
 * 坐标范围：经度 118.363-119.242，纬度 31.228-32.614（全市 11 区）
 * 投影：等距圆柱 + cos(31.92°) 校正，SVG 画布 801x1449
 */

// ==================== 投影（与 scripts/convert.cjs 一致） ====================
const LON0 = 118.363373;
const LAT1 = 32.614363;
const SCALE = 1010;
const COS_LAT = 0.84872;
const PAD = 24;

const lon2x = (lon: number) => PAD + (lon - LON0) * SCALE * COS_LAT;
const lat2y = (lat: number) => PAD + (LAT1 - lat) * SCALE;

// 经纬度点串 -> SVG path
const pts = (coords: [number, number][], close = false) =>
  coords
    .map(([lon, lat], i) => `${i === 0 ? 'M' : 'L'} ${lon2x(lon).toFixed(1)} ${lat2y(lat).toFixed(1)}`)
    .join(' ') + (close ? ' Z' : '');

// ==================== 水系 ====================
export interface WaterBody {
  id: string;
  name: string;
  path: string;
  type: 'river' | 'lake' | 'island';
}

export const waterBodies: WaterBody[] = [
  {
    id: 'yangtze',
    name: '长江',
    // 长江南京段真实走向：自西南（马鞍山方向）入境，向北经大胜关、江心洲，
    // 至下关折向东北，过燕子矶、八卦洲、栖霞山，向仪征方向出境
    path: pts([
      // 西北岸（上游 -> 下游）
      [118.442, 31.733],
      [118.505, 31.788],
      [118.565, 31.852],
      [118.602, 31.918],
      [118.632, 31.978],
      [118.665, 32.038],
      [118.690, 32.085],
      [118.712, 32.118],
      [118.745, 32.142],
      [118.800, 32.158],
      [118.860, 32.170],
      [118.925, 32.170],
      [118.995, 32.180],
      [119.055, 32.205],
      [119.130, 32.232],
      [119.200, 32.255],
      // 东南岸（下游 -> 上游）
      [119.195, 32.225],
      [119.125, 32.198],
      [119.045, 32.168],
      [118.985, 32.148],
      [118.918, 32.138],
      [118.855, 32.138],
      [118.800, 32.122],
      [118.772, 32.096],
      [118.748, 32.062],
      [118.728, 32.012],
      [118.700, 31.958],
      [118.668, 31.900],
      [118.630, 31.845],
      [118.575, 31.782],
      [118.510, 31.728],
      [118.452, 31.695],
    ], true),
    type: 'river',
  },
  {
    id: 'jiangxinzhou',
    name: '江心洲',
    // 江心洲（江中岛屿，南北狭长）
    path: pts([
      [118.682, 32.032],
      [118.692, 32.012],
      [118.694, 31.990],
      [118.688, 31.968],
      [118.678, 31.962],
      [118.672, 31.985],
      [118.670, 32.010],
      [118.674, 32.028],
    ], true),
    type: 'island',
  },
  {
    id: 'baguazhou',
    name: '八卦洲',
    // 八卦洲（江中岛屿，近圆形）
    path: pts([
      [118.815, 32.175],
      [118.835, 32.185],
      [118.862, 32.185],
      [118.885, 32.175],
      [118.892, 32.160],
      [118.880, 32.146],
      [118.855, 32.140],
      [118.828, 32.144],
      [118.812, 32.158],
    ], true),
    type: 'island',
  },
  {
    id: 'xuanwu-lake',
    name: '玄武湖',
    // 玄武湖真实轮廓（近南京站，五洲形状简化）
    path: pts([
      [118.789, 32.068],
      [118.795, 32.078],
      [118.804, 32.082],
      [118.812, 32.078],
      [118.815, 32.068],
      [118.810, 32.060],
      [118.800, 32.058],
      [118.791, 32.061],
    ], true),
    type: 'lake',
  },
  {
    id: 'mochou-lake',
    name: '莫愁湖',
    path: pts([
      [118.751, 32.033],
      [118.756, 32.037],
      [118.762, 32.035],
      [118.761, 32.030],
      [118.755, 32.028],
    ], true),
    type: 'lake',
  },
  {
    id: 'shijiu-lake',
    name: '石臼湖',
    // 石臼湖（溧水/高淳交界，大型湖泊，东西向）
    path: pts([
      [118.885, 31.460],
      [118.915, 31.485],
      [118.955, 31.492],
      [118.995, 31.488],
      [119.020, 31.470],
      [119.022, 31.448],
      [119.000, 31.428],
      [118.960, 31.420],
      [118.920, 31.425],
      [118.892, 31.440],
    ], true),
    type: 'lake',
  },
  {
    id: 'gucheng-lake',
    name: '固城湖',
    // 固城湖（高淳城区北侧）
    path: pts([
      [118.872, 31.295],
      [118.895, 31.308],
      [118.925, 31.310],
      [118.948, 31.298],
      [118.945, 31.280],
      [118.920, 31.270],
      [118.892, 31.275],
    ], true),
    type: 'lake',
  },
  {
    id: 'qinhuai-river',
    name: '秦淮河',
    // 真实流向：源于溧水/句容，自东南向西北穿江宁、雨花台，
    // 过中华门、夫子庙，折向西经水西门，于三汊河汇入长江
    path: pts([
      [118.905, 31.725],
      [118.885, 31.780],
      [118.868, 31.835],
      [118.855, 31.890],
      [118.838, 31.935],
      [118.818, 31.968],
      [118.798, 31.990],
      [118.785, 32.008],
      [118.778, 32.022],
      [118.768, 32.038],
      [118.752, 32.052],
      [118.735, 32.062],
      [118.718, 32.070],
    ]),
    type: 'river',
  },
];

// ==================== 主要道路 ====================
export interface Road {
  id: string;
  name: string;
  path: string;
  width: number;
  type: 'arterial' | 'secondary';
}

export const roads: Road[] = [
  // 中山大道轴线（中山北路-中山路-中山南路，南京最重要南北轴）
  { id: 'zhongshan-north', name: '中山北路', path: pts([[118.742, 32.088], [118.770, 32.055]]), width: 4, type: 'arterial' },
  { id: 'zhongshan', name: '中山路', path: pts([[118.770, 32.055], [118.784, 32.041]]), width: 4, type: 'arterial' },
  { id: 'zhongshan-south', name: '中山南路', path: pts([[118.784, 32.041], [118.783, 31.995]]), width: 4, type: 'arterial' },
  // 东西向轴线
  { id: 'hanzhong-zhongshan-east', name: '汉中-中山东路', path: pts([[118.750, 32.041], [118.784, 32.041], [118.852, 32.043]]), width: 4, type: 'arterial' },
  { id: 'beijing-east-west', name: '北京东/西路', path: pts([[118.735, 32.058], [118.770, 32.055], [118.830, 32.062]]), width: 3, type: 'arterial' },
  { id: 'yingtian', name: '应天大街', path: pts([[118.730, 31.995], [118.783, 31.995], [118.835, 31.998]]), width: 3, type: 'arterial' },
  // 南北向
  { id: 'zhongyang', name: '中央路', path: pts([[118.775, 32.092], [118.770, 32.055]]), width: 3, type: 'arterial' },
  { id: 'longpan', name: '龙蟠路', path: pts([[118.802, 32.088], [118.812, 32.040], [118.818, 31.985]]), width: 3, type: 'arterial' },
  { id: 'jiangdong', name: '江东中路', path: pts([[118.738, 32.045], [118.732, 31.985]]), width: 3, type: 'arterial' },
  { id: 'yangzijiang', name: '扬子江大道', path: pts([[118.712, 32.055], [118.700, 31.965], [118.682, 31.930]]), width: 2.5, type: 'arterial' },
  // 快速路
  { id: 'raocheng', name: '绕城公路', path: pts([[118.845, 32.095], [118.875, 32.030], [118.870, 31.955], [118.845, 31.905]]), width: 2.5, type: 'secondary' },
  { id: 'jiangning-ave', name: '双龙大道', path: pts([[118.820, 31.975], [118.830, 31.920], [118.835, 31.860]]), width: 2.5, type: 'secondary' },
];

// ==================== 地标 ====================
export interface Landmark {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'mountain' | 'lake' | 'river' | 'scenic' | 'historic' | 'transport' | 'cbd';
}

export const landmarks: Landmark[] = [
  { id: 'zijin', name: '紫金山', x: lon2x(118.853), y: lat2y(32.072), type: 'mountain' },
  { id: 'xuanwu-lake', name: '玄武湖', x: lon2x(118.802), y: lat2y(32.090), type: 'lake' },
  { id: 'zhongshan-ling', name: '中山陵', x: lon2x(118.864), y: lat2y(32.054), type: 'scenic' },
  { id: 'xinjiekou', name: '新街口', x: lon2x(118.784), y: lat2y(32.041), type: 'cbd' },
  { id: 'nanjing-south', name: '南京南站', x: lon2x(118.799), y: lat2y(31.968), type: 'transport' },
  { id: 'nanjing-station', name: '南京站', x: lon2x(118.796), y: lat2y(32.086), type: 'transport' },
  { id: 'laomendong', name: '老门东', x: lon2x(118.785), y: lat2y(32.013), type: 'historic' },
  { id: 'fuzimiao', name: '夫子庙', x: lon2x(118.792), y: lat2y(32.022), type: 'historic' },
  { id: 'jiangxinzhou', name: '江心洲', x: lon2x(118.660), y: lat2y(32.000), type: 'scenic' },
  { id: 'mochou', name: '莫愁湖', x: lon2x(118.757), y: lat2y(32.024), type: 'lake' },
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
    path: pts([
      [118.845, 32.048],
      [118.858, 32.058],
      [118.870, 32.054],
      [118.872, 32.044],
      [118.860, 32.038],
      [118.848, 32.040],
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
    path: pts([
      [118.788, 32.068],
      [118.795, 32.079],
      [118.805, 32.083],
      [118.813, 32.077],
      [118.816, 32.067],
      [118.809, 32.059],
      [118.798, 32.057],
      [118.790, 32.061],
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
    path: pts([
      [118.728, 32.062],
      [118.714, 32.020],
      [118.700, 31.970],
      [118.682, 31.925],
      [118.662, 31.890],
    ]),
    length: '约 20km',
    ridden: false,
  },
  {
    id: 'qinhuai-path',
    name: '秦淮河畔',
    nameEn: 'Qinhuai River Path',
    path: pts([
      [118.798, 31.990],
      [118.785, 32.008],
      [118.778, 32.022],
      [118.768, 32.038],
      [118.752, 32.052],
      [118.735, 32.062],
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
    path: pts([
      [118.830, 32.062],
      [118.845, 32.070],
      [118.858, 32.066],
      [118.862, 32.055],
      [118.850, 32.050],
      [118.835, 32.054],
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
      [118.778, 32.005],
      [118.775, 31.997],
      [118.770, 31.990],
    ]),
    length: '约 5km',
    ridden: false,
  },
  {
    id: 'jiangxinzhou',
    name: '江心洲环岛',
    nameEn: 'Jiangxinzhou Island Loop',
    path: pts([
      [118.676, 32.030],
      [118.688, 32.028],
      [118.694, 32.008],
      [118.692, 31.985],
      [118.686, 31.965],
      [118.676, 31.968],
      [118.671, 31.990],
      [118.672, 32.012],
    ], true),
    length: '约 18km',
    ridden: false,
  },
  {
    id: 'yuhuatai',
    name: '雨花台-南站',
    nameEn: 'Yuhuatai to South Station',
    path: pts([
      [118.779, 31.990],
      [118.790, 31.978],
      [118.800, 31.968],
      [118.808, 31.960],
    ]),
    length: '约 7km',
    ridden: false,
  },
];

export { lon2x, lat2y };
