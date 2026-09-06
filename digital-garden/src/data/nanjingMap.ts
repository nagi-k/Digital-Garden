// 南京主要区域轮廓（近似地理形状）
export const nanjingDistricts = [
  {
    id: 'xuanwu',
    name: '玄武区',
    path: 'M 280 200 L 320 180 L 360 190 L 380 220 L 370 260 L 340 280 L 300 270 L 275 240 Z',
    color: '#e8e8e8',
  },
  {
    id: 'qinhuai',
    name: '秦淮区',
    path: 'M 280 280 L 340 280 L 370 300 L 380 340 L 360 380 L 320 400 L 280 390 L 260 350 L 265 310 Z',
    color: '#e5e5e5',
  },
  {
    id: 'jianye',
    name: '建邺区',
    path: 'M 200 260 L 260 250 L 280 280 L 265 310 L 240 340 L 200 330 L 180 300 Z',
    color: '#e8e8e8',
  },
  {
    id: 'gulou',
    name: '鼓楼区',
    path: 'M 220 180 L 280 200 L 275 240 L 260 250 L 220 260 L 190 240 L 185 210 Z',
    color: '#e5e5e5',
  },
  {
    id: 'qixia',
    name: '栖霞区',
    path: 'M 360 120 L 420 100 L 460 140 L 450 200 L 420 240 L 380 220 L 360 190 Z',
    color: '#e8e8e8',
  },
  {
    id: 'yuhuatai',
    name: '雨花台区',
    path: 'M 260 390 L 320 400 L 360 380 L 390 410 L 380 450 L 340 470 L 300 460 L 270 430 Z',
    color: '#e5e5e5',
  },
  {
    id: 'jiangning',
    name: '江宁区',
    path: 'M 380 450 L 420 470 L 450 520 L 430 560 L 390 570 L 360 540 L 340 470 Z',
    color: '#e8e8e8',
  },
  {
    id: 'pukou',
    name: '浦口区',
    path: 'M 120 150 L 190 160 L 185 210 L 180 300 L 150 320 L 110 300 L 100 220 Z',
    color: '#e5e5e5',
  },
  {
    id: 'luhe',
    name: '六合区',
    path: 'M 100 80 L 180 90 L 220 180 L 190 160 L 120 150 L 90 120 Z',
    color: '#e8e8e8',
  },
];

// 长江
export const yangtzeRiver = 'M 0 150 Q 50 140 100 160 T 200 180 T 300 170 T 400 190 T 500 180 T 600 200 L 600 250 Q 500 230 400 240 T 300 230 T 200 240 T 100 220 T 0 200 Z';

// 秦淮河
export const qinhuaiRiver = 'M 280 280 Q 300 320 320 350 T 340 400 T 360 440';

// 主要道路
export const mainRoads = [
  { id: 'zhongshan', name: '中山路', path: 'M 300 200 L 300 280', width: 3 },
  { id: 'hanzhong', name: '汉中路', path: 'M 220 260 L 300 280', width: 2.5 },
  { id: 'taiping', name: '太平路', path: 'M 280 200 L 280 280', width: 2 },
  { id: 'zhujiang', name: '珠江路', path: 'M 320 220 L 360 230', width: 2 },
  { id: 'beijing', name: '北京东路', path: 'M 280 180 L 360 190', width: 2.5 },
  { id: 'shanghai', name: '上海路', path: 'M 240 240 L 240 300', width: 2 },
  { id: 'mengdu', name: '梦都大街', path: 'M 200 280 L 280 300', width: 2 },
  { id: 'longpan', name: '龙蟠路', path: 'M 360 200 L 380 280', width: 2.5 },
  { id: 'yincheng', name: '应天大街', path: 'M 260 350 L 360 380', width: 2 },
  { id: 'fengtai', name: '凤台南路', path: 'M 300 400 L 340 470', width: 2 },
];

// 地标
export const landmarks = [
  { id: 'zijin', name: '紫金山', x: 420, y: 160, type: 'mountain' },
  { id: 'xuanwu-lake', name: '玄武湖', x: 320, y: 230, type: 'lake' },
  { id: 'qinhuai-river', name: '秦淮河', x: 320, y: 350, type: 'river' },
  { id: 'zhongshan-ling', name: '中山陵', x: 400, y: 140, type: 'scenic' },
  { id: 'laomendong', name: '老门东', x: 300, y: 380, type: 'historic' },
  { id: 'nanjing-south', name: '南京南站', x: 380, y: 500, type: 'transport' },
  { id: 'xinjiekou', name: '新街口', x: 300, y: 280, type: 'cbd' },
];

// 骑行路线（更真实的道路路径）
export const ridingRoutesDetailed = [
  {
    id: 'zhongshan-loop',
    name: '中山陵环线',
    nameEn: 'Sun Yat-sen Mausoleum Loop',
    path: 'M 400 140 Q 430 120 450 150 T 460 200 T 440 250 T 410 220 T 395 170 Z',
    length: '约 15km',
    ridden: true,
    date: '2026-08-15',
    notes: '清晨的中山陵，梧桐树荫下骑行，风都是凉的。',
    color: '#0a0a0a',
  },
  {
    id: 'xuanwu-lake',
    name: '玄武湖环湖',
    nameEn: 'Xuanwu Lake Loop',
    path: 'M 290 210 Q 320 190 350 210 T 370 250 T 350 290 T 310 300 T 280 270 T 275 230 Z',
    length: '约 10km',
    ridden: true,
    date: '2026-07-20',
    notes: '夏天的玄武湖，荷花盛开，但人也很多。',
    color: '#0a0a0a',
  },
  {
    id: 'riverside',
    name: '滨江大道',
    nameEn: 'Riverside Avenue',
    path: 'M 80 170 Q 120 150 160 170 T 220 190 T 280 180 T 340 200 T 400 190',
    length: '约 20km',
    ridden: false,
    color: '#737373',
  },
  {
    id: 'qinhuai-path',
    name: '秦淮河畔',
    nameEn: 'Qinhuai River Path',
    path: 'M 280 280 Q 300 320 320 350 T 340 400 T 320 430 T 290 420 T 270 380 T 275 320 Z',
    length: '约 8km',
    ridden: true,
    date: '2026-06-10',
    notes: '夜骑秦淮河，灯影摇曳，像穿越回古代。',
    color: '#0a0a0a',
  },
  {
    id: 'purple-mountain',
    name: '紫金山绿道',
    nameEn: 'Purple Mountain Greenway',
    path: 'M 380 140 Q 410 110 440 140 T 460 190 T 440 240 T 410 220 T 390 170 Z',
    length: '约 12km',
    ridden: false,
    color: '#737373',
  },
  {
    id: 'laomendong',
    name: '老门东-中华门',
    nameEn: 'Laomendong to Zhonghua Gate',
    path: 'M 280 370 Q 300 360 320 380 T 330 410 T 310 430',
    length: '约 5km',
    ridden: false,
    color: '#737373',
  },
  {
    id: 'jiangxinzhou',
    name: '江心洲环岛',
    nameEn: 'Jiangxinzhou Island Loop',
    path: 'M 60 280 Q 80 260 110 270 T 140 300 T 130 340 T 100 350 T 70 330 T 55 300 Z',
    length: '约 18km',
    ridden: false,
    color: '#737373',
  },
  {
    id: 'yuhuatai',
    name: '雨花台-南站',
    nameEn: 'Yuhuatai to South Station',
    path: 'M 320 420 Q 350 410 380 430 T 400 480 T 380 520 T 350 510 T 330 470 Z',
    length: '约 7km',
    ridden: false,
    color: '#737373',
  },
];
