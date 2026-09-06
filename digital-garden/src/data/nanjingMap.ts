/**
 * 南京市区地图数据
 * 基于真实地理坐标投影，经度 118.70-118.90，纬度 31.95-32.15
 * SVG 画布 1200x1200，x = (lon - 118.70) / 0.20 * 1200, y = 1200 - (lat - 31.95) / 0.20 * 1200
 */

// 坐标转换辅助
const lon2x = (lon: number) => ((lon - 118.7) / 0.2) * 1200;
const lat2y = (lat: number) => 1200 - ((lat - 31.95) / 0.2) * 1200;

// ==================== 行政区划 ====================
export interface District {
  id: string;
  name: string;
  path: string;
  fill: string;
  labelX: number;
  labelY: number;
}

export const districts: District[] = [
  {
    id: 'gulou',
    name: '鼓楼区',
    // 西北沿江，含原下关
    path: `M ${lon2x(118.72)} ${lat2y(32.10)} L ${lon2x(118.74)} ${lat2y(32.12)} L ${lon2x(118.76)} ${lat2y(32.10)} L ${lon2x(118.78)} ${lat2y(32.08)} L ${lon2x(118.77)} ${lat2y(32.06)} L ${lon2x(118.76)} ${lat2y(32.04)} L ${lon2x(118.74)} ${lat2y(32.05)} L ${lon2x(118.72)} ${lat2y(32.06)} Z`,
    fill: '#e8e8e8',
    labelX: lon2x(118.75),
    labelY: lat2y(32.07),
  },
  {
    id: 'xuanwu',
    name: '玄武区',
    // 中心偏东北，含玄武湖、紫金山北麓
    path: `M ${lon2x(118.76)} ${lat2y(32.06)} L ${lon2x(118.77)} ${lat2y(32.08)} L ${lon2x(118.80)} ${lat2y(32.09)} L ${lon2x(118.83)} ${lat2y(32.08)} L ${lon2x(118.85)} ${lat2y(32.06)} L ${lon2x(118.84)} ${lat2y(32.03)} L ${lon2x(118.82)} ${lat2y(32.02)} L ${lon2x(118.80)} ${lat2y(32.03)} L ${lon2x(118.78)} ${lat2y(32.04)} L ${lon2x(118.77)} ${lat2y(32.06)} Z`,
    fill: '#e5e5e5',
    labelX: lon2x(118.80),
    labelY: lat2y(32.05),
  },
  {
    id: 'qinhuai',
    name: '秦淮区',
    // 主城东南
    path: `M ${lon2x(118.78)} ${lat2y(32.04)} L ${lon2x(118.80)} ${lat2y(32.03)} L ${lon2x(118.82)} ${lat2y(32.02)} L ${lon2x(118.83)} ${lat2y(32.00)} L ${lon2x(118.82)} ${lat2y(31.98)} L ${lon2x(118.80)} ${lat2y(31.97)} L ${lon2x(118.78)} ${lat2y(31.98)} L ${lon2x(118.77)} ${lat2y(32.00)} L ${lon2x(118.78)} ${lat2y(32.02)} Z`,
    fill: '#e8e8e8',
    labelX: lon2x(118.80),
    labelY: lat2y(32.00),
  },
  {
    id: 'jianye',
    name: '建邺区',
    // 西南滨江
    path: `M ${lon2x(118.72)} ${lat2y(32.04)} L ${lon2x(118.74)} ${lat2y(32.05)} L ${lon2x(118.76)} ${lat2y(32.04)} L ${lon2x(118.78)} ${lat2y(32.02)} L ${lon2x(118.77)} ${lat2y(32.00)} L ${lon2x(118.75)} ${lat2y(31.98)} L ${lon2x(118.73)} ${lat2y(31.99)} L ${lon2x(118.72)} ${lat2y(32.01)} Z`,
    fill: '#e5e5e5',
    labelX: lon2x(118.75),
    labelY: lat2y(32.01),
  },
  {
    id: 'qixia',
    name: '栖霞区',
    // 东北沿江
    path: `M ${lon2x(118.83)} ${lat2y(32.08)} L ${lon2x(118.86)} ${lat2y(32.10)} L ${lon2x(118.89)} ${lat2y(32.12)} L ${lon2x(118.90)} ${lat2y(32.09)} L ${lon2x(118.88)} ${lat2y(32.05)} L ${lon2x(118.85)} ${lat2y(32.04)} L ${lon2x(118.83)} ${lat2y(32.06)} Z`,
    fill: '#e8e8e8',
    labelX: lon2x(118.86),
    labelY: lat2y(32.07),
  },
  {
    id: 'yuhuatai',
    name: '雨花台区',
    // 城南
    path: `M ${lon2x(118.77)} ${lat2y(32.00)} L ${lon2x(118.78)} ${lat2y(31.98)} L ${lon2x(118.80)} ${lat2y(31.97)} L ${lon2x(118.82)} ${lat2y(31.96)} L ${lon2x(118.81)} ${lat2y(31.94)} L ${lon2x(118.79)} ${lat2y(31.93)} L ${lon2x(118.77)} ${lat2y(31.95)} L ${lon2x(118.76)} ${lat2y(31.97)} Z`,
    fill: '#e5e5e5',
    labelX: lon2x(118.79),
    labelY: lat2y(31.96),
  },
  {
    id: 'jiangning',
    name: '江宁区',
    // 环抱城南，面积最大
    path: `M ${lon2x(118.82)} ${lat2y(31.96)} L ${lon2x(118.85)} ${lat2y(31.95)} L ${lon2x(118.88)} ${lat2y(31.93)} L ${lon2x(118.89)} ${lat2y(31.90)} L ${lon2x(118.86)} ${lat2y(31.88)} L ${lon2x(118.83)} ${lat2y(31.89)} L ${lon2x(118.81)} ${lat2y(31.91)} L ${lon2x(118.82)} ${lat2y(31.94)} Z`,
    fill: '#e8e8e8',
    labelX: lon2x(118.85),
    labelY: lat2y(31.91),
  },
  {
    id: 'pukou',
    name: '浦口区',
    // 江北西北
    path: `M ${lon2x(118.68)} ${lat2y(32.10)} L ${lon2x(118.70)} ${lat2y(32.12)} L ${lon2x(118.72)} ${lat2y(32.10)} L ${lon2x(118.71)} ${lat2y(32.07)} L ${lon2x(118.69)} ${lat2y(32.05)} L ${lon2x(118.68)} ${lat2y(32.08)} Z`,
    fill: '#e5e5e5',
    labelX: lon2x(118.70),
    labelY: lat2y(32.08),
  },
  {
    id: 'luhe',
    name: '六合区',
    // 江北东北
    path: `M ${lon2x(118.72)} ${lat2y(32.12)} L ${lon2x(118.75)} ${lat2y(32.14)} L ${lon2x(118.78)} ${lat2y(32.13)} L ${lon2x(118.76)} ${lat2y(32.10)} L ${lon2x(118.73)} ${lat2y(32.11)} Z`,
    fill: '#e8e8e8',
    labelX: lon2x(118.75),
    labelY: lat2y(32.12),
  },
];

// ==================== 水系 ====================
export const waterBodies = [
  {
    id: 'yangtze',
    name: '长江',
    path: `M 0 ${lat2y(32.08)} Q ${lon2x(118.71)} ${lat2y(32.06)} ${lon2x(118.73)} ${lat2y(32.08)} T ${lon2x(118.76)} ${lat2y(32.10)} T ${lon2x(118.80)} ${lat2y(32.12)} T ${lon2x(118.85)} ${lat2y(32.11)} T ${lon2x(118.90)} ${lat2y(32.09)} L ${lon2x(118.90)} ${lat2y(32.05)} Q ${lon2x(118.85)} ${lat2y(32.07)} ${lon2x(118.80)} ${lat2y(32.06)} T ${lon2x(118.76)} ${lat2y(32.04)} T ${lon2x(118.73)} ${lat2y(32.02)} T ${lon2x(118.71)} ${lat2y(32.00)} T 0 ${lat2y(31.98)} Z`,
    type: 'river' as const,
  },
  {
    id: 'xuanwu-lake',
    name: '玄武湖',
    path: `M ${lon2x(118.78)} ${lat2y(32.07)} Q ${lon2x(118.80)} ${lat2y(32.06)} ${lon2x(118.82)} ${lat2y(32.07)} T ${lon2x(118.83)} ${lat2y(32.09)} T ${lon2x(118.81)} ${lat2y(32.11)} T ${lon2x(118.79)} ${lat2y(32.10)} T ${lon2x(118.77)} ${lat2y(32.09)} Z`,
    type: 'lake' as const,
  },
  {
    id: 'mochou-lake',
    name: '莫愁湖',
    path: `M ${lon2x(118.75)} ${lat2y(32.03)} Q ${lon2x(118.76)} ${lat2y(32.02)} ${lon2x(118.77)} ${lat2y(32.03)} T ${lon2x(118.76)} ${lat2y(32.04)} Z`,
    type: 'lake' as const,
  },
  {
    id: 'qinhuai-river',
    name: '秦淮河',
    path: `M ${lon2x(118.83)} ${lat2y(31.95)} Q ${lon2x(118.82)} ${lat2y(31.97)} ${lon2x(118.81)} ${lat2y(31.99)} T ${lon2x(118.80)} ${lat2y(32.01)} T ${lon2x(118.79)} ${lat2y(32.00)} T ${lon2x(118.78)} ${lat2y(32.02)} T ${lon2x(118.77)} ${lat2y(32.03)} T ${lon2x(118.76)} ${lat2y(32.05)}`,
    type: 'river' as const,
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
  // 中山大道轴线
  { id: 'zhongshan-north', name: '中山北路', path: `M ${lon2x(118.73)} ${lat2y(32.09)} L ${lon2x(118.76)} ${lat2y(32.06)}`, width: 4, type: 'arterial' },
  { id: 'zhongshan', name: '中山路', path: `M ${lon2x(118.76)} ${lat2y(32.06)} L ${lon2x(118.78)} ${lat2y(32.04)}`, width: 4, type: 'arterial' },
  { id: 'zhongshan-east', name: '中山东路', path: `M ${lon2x(118.78)} ${lat2y(32.04)} L ${lon2x(118.84)} ${lat2y(32.04)}`, width: 4, type: 'arterial' },
  { id: 'zhongshan-south', name: '中山南路', path: `M ${lon2x(118.78)} ${lat2y(32.04)} L ${lon2x(118.78)} ${lat2y(31.99)}`, width: 3.5, type: 'arterial' },
  // 东西向
  { id: 'hanzhong', name: '汉中路', path: `M ${lon2x(118.76)} ${lat2y(32.04)} L ${lon2x(118.78)} ${lat2y(32.04)}`, width: 3.5, type: 'arterial' },
  { id: 'beijing-east', name: '北京东路', path: `M ${lon2x(118.76)} ${lat2y(32.06)} L ${lon2x(118.82)} ${lat2y(32.06)}`, width: 3, type: 'arterial' },
  { id: 'beijing-west', name: '北京西路', path: `M ${lon2x(118.76)} ${lat2y(32.06)} L ${lon2x(118.74)} ${lat2y(32.06)}`, width: 3, type: 'arterial' },
  { id: 'yingtian', name: '应天大街', path: `M ${lon2x(118.74)} ${lat2y(31.99)} L ${lon2x(118.82)} ${lat2y(31.99)}`, width: 3, type: 'arterial' },
  // 南北向
  { id: 'zhongyang', name: '中央路', path: `M ${lon2x(118.76)} ${lat2y(32.06)} L ${lon2x(118.76)} ${lat2y(32.10)}`, width: 3, type: 'arterial' },
  { id: 'longpan', name: '龙蟠路', path: `M ${lon2x(118.80)} ${lat2y(32.10)} L ${lon2x(118.80)} ${lat2y(31.97)}`, width: 3, type: 'arterial' },
  { id: 'jiangdong', name: '江东中路', path: `M ${lon2x(118.73)} ${lat2y(32.04)} L ${lon2x(118.73)} ${lat2y(31.98)}`, width: 3, type: 'arterial' },
  { id: 'yangzijiang', name: '扬子江大道', path: `M ${lon2x(118.71)} ${lat2y(32.05)} L ${lon2x(118.71)} ${lat2y(31.97)}`, width: 2.5, type: 'arterial' },
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
  { id: 'zijin', name: '紫金山', x: lon2x(118.85), y: lat2y(32.06), type: 'mountain' },
  { id: 'xuanwu-lake', name: '玄武湖', x: lon2x(118.80), y: lat2y(32.08), type: 'lake' },
  { id: 'zhongshan-ling', name: '中山陵', x: lon2x(118.84), y: lat2y(32.05), type: 'scenic' },
  { id: 'xinjiekou', name: '新街口', x: lon2x(118.78), y: lat2y(32.04), type: 'cbd' },
  { id: 'nanjing-south', name: '南京南站', x: lon2x(118.80), y: lat2y(31.97), type: 'transport' },
  { id: 'nanjing-station', name: '南京站', x: lon2x(118.80), y: lat2y(32.09), type: 'transport' },
  { id: 'laomendong', name: '老门东', x: lon2x(118.78), y: lat2y(32.02), type: 'historic' },
  { id: 'fuzimiao', name: '夫子庙', x: lon2x(118.79), y: lat2y(32.03), type: 'historic' },
  { id: 'jiangxinzhou', name: '江心洲', x: lon2x(118.72), y: lat2y(32.01), type: 'scenic' },
  { id: 'mochou', name: '莫愁湖', x: lon2x(118.76), y: lat2y(32.03), type: 'lake' },
];

// ==================== 骑行路线（基于真实道路） ====================
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
    path: `M ${lon2x(118.84)} ${lat2y(32.05)} L ${lon2x(118.85)} ${lat2y(32.06)} L ${lon2x(118.86)} ${lat2y(32.05)} L ${lon2x(118.85)} ${lat2y(32.04)} L ${lon2x(118.84)} ${lat2y(32.04)} Z`,
    length: '约 15km',
    ridden: true,
    date: '2026-08-15',
    notes: '清晨的中山陵，梧桐树荫下骑行，风都是凉的。',
  },
  {
    id: 'xuanwu-lake',
    name: '玄武湖环湖',
    nameEn: 'Xuanwu Lake Loop',
    path: `M ${lon2x(118.78)} ${lat2y(32.07)} L ${lon2x(118.79)} ${lat2y(32.08)} L ${lon2x(118.80)} ${lat2y(32.09)} L ${lon2x(118.81)} ${lat2y(32.08)} L ${lon2x(118.82)} ${lat2y(32.07)} L ${lon2x(118.81)} ${lat2y(32.06)} L ${lon2x(118.80)} ${lat2y(32.06)} L ${lon2x(118.79)} ${lat2y(32.06)} Z`,
    length: '约 10km',
    ridden: true,
    date: '2026-07-20',
    notes: '夏天的玄武湖，荷花盛开，但人也很多。',
  },
  {
    id: 'riverside',
    name: '滨江大道',
    nameEn: 'Riverside Avenue',
    path: `M ${lon2x(118.71)} ${lat2y(32.05)} L ${lon2x(118.71)} ${lat2y(32.03)} L ${lon2x(118.71)} ${lat2y(32.01)} L ${lon2x(118.71)} ${lat2y(31.99)} L ${lon2x(118.71)} ${lat2y(31.97)}`,
    length: '约 20km',
    ridden: false,
  },
  {
    id: 'qinhuai-path',
    name: '秦淮河畔',
    nameEn: 'Qinhuai River Path',
    path: `M ${lon2x(118.78)} ${lat2y(32.02)} L ${lon2x(118.79)} ${lat2y(32.01)} L ${lon2x(118.80)} ${lat2y(32.00)} L ${lon2x(118.81)} ${lat2y(31.99)} L ${lon2x(118.80)} ${lat2y(31.98)} L ${lon2x(118.79)} ${lat2y(31.99)} L ${lon2x(118.78)} ${lat2y(32.00)} Z`,
    length: '约 8km',
    ridden: true,
    date: '2026-06-10',
    notes: '夜骑秦淮河，灯影摇曳，像穿越回古代。',
  },
  {
    id: 'purple-mountain',
    name: '紫金山绿道',
    nameEn: 'Purple Mountain Greenway',
    path: `M ${lon2x(118.83)} ${lat2y(32.06)} L ${lon2x(118.84)} ${lat2y(32.07)} L ${lon2x(118.85)} ${lat2y(32.06)} L ${lon2x(118.86)} ${lat2y(32.05)} L ${lon2x(118.85)} ${lat2y(32.04)} L ${lon2x(118.84)} ${lat2y(32.05)} Z`,
    length: '约 12km',
    ridden: false,
  },
  {
    id: 'laomendong',
    name: '老门东-中华门',
    nameEn: 'Laomendong to Zhonghua Gate',
    path: `M ${lon2x(118.78)} ${lat2y(32.02)} L ${lon2x(118.78)} ${lat2y(32.01)} L ${lon2x(118.79)} ${lat2y(32.00)} L ${lon2x(118.79)} ${lat2y(31.99)}`,
    length: '约 5km',
    ridden: false,
  },
  {
    id: 'jiangxinzhou',
    name: '江心洲环岛',
    nameEn: 'Jiangxinzhou Island Loop',
    path: `M ${lon2x(118.72)} ${lat2y(32.02)} L ${lon2x(118.72)} ${lat2y(32.00)} L ${lon2x(118.73)} ${lat2y(31.99)} L ${lon2x(118.73)} ${lat2y(32.01)} Z`,
    length: '约 18km',
    ridden: false,
  },
  {
    id: 'yuhuatai',
    name: '雨花台-南站',
    nameEn: 'Yuhuatai to South Station',
    path: `M ${lon2x(118.79)} ${lat2y(31.98)} L ${lon2x(118.80)} ${lat2y(31.97)} L ${lon2x(118.81)} ${lat2y(31.96)} L ${lon2x(118.80)} ${lat2y(31.95)} L ${lon2x(118.79)} ${lat2y(31.96)} Z`,
    length: '约 7km',
    ridden: false,
  },
];

export { lon2x, lat2y };
