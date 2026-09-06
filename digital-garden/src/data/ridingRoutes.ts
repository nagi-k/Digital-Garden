export interface RidingRoute {
  id: string;
  name: string;
  nameEn: string;
  points: string; // SVG path points
  length: string; // 大概长度
  ridden: boolean; // 是否已骑行
  date?: string; // 骑行日期
  notes?: string; // 骑行感受
}

export const ridingRoutes: RidingRoute[] = [
  {
    id: 'zhongshan',
    name: '中山陵环线',
    nameEn: 'Sun Yat-sen Mausoleum Loop',
    points: 'M 300 80 Q 350 60 400 90 T 450 150 T 420 220 T 350 250 T 300 200 T 280 120 Z',
    length: '约 15km',
    ridden: true,
    date: '2026-08-15',
    notes: '清晨的中山陵，梧桐树荫下骑行，风都是凉的。',
  },
  {
    id: 'xuanwu',
    name: '玄武湖环湖',
    nameEn: 'Xuanwu Lake Loop',
    points: 'M 280 200 Q 320 180 360 200 T 400 250 T 380 320 T 320 340 T 260 300 T 250 240 Z',
    length: '约 10km',
    ridden: true,
    date: '2026-07-20',
    notes: '夏天的玄武湖，荷花盛开，但人也很多。',
  },
  {
    id: 'yangtze',
    name: '滨江大道',
    nameEn: 'Riverside Avenue',
    points: 'M 100 150 Q 150 140 200 160 T 280 180 T 350 170 T 400 190',
    length: '约 20km',
    ridden: false,
  },
  {
    id: 'qinhuai',
    name: '秦淮河畔',
    nameEn: 'Qinhuai River Path',
    points: 'M 200 350 Q 250 330 300 350 T 360 380 T 340 420 T 280 430 T 220 400 Z',
    length: '约 8km',
    ridden: true,
    date: '2026-06-10',
    notes: '夜骑秦淮河，灯影摇曳，像穿越回古代。',
  },
  {
    id: 'zijin',
    name: '紫金山绿道',
    nameEn: 'Purple Mountain Greenway',
    points: 'M 350 100 Q 400 80 440 120 T 460 180 T 430 240 T 380 220 T 360 160 Z',
    length: '约 12km',
    ridden: false,
  },
  {
    id: 'laomendong',
    name: '老门东-中华门',
    nameEn: 'Laomendong to Zhonghua Gate',
    points: 'M 250 380 Q 280 360 310 380 T 340 400 T 320 420',
    length: '约 5km',
    ridden: false,
  },
  {
    id: 'jiangxinzhou',
    name: '江心洲环岛',
    nameEn: 'Jiangxinzhou Island Loop',
    points: 'M 80 280 Q 100 260 130 270 T 160 300 T 150 340 T 120 350 T 90 330 T 75 300 Z',
    length: '约 18km',
    ridden: false,
  },
  {
    id: 'yuhuatai',
    name: '雨花台-南站',
    nameEn: 'Yuhuatai to South Station',
    points: 'M 280 450 Q 320 430 360 450 T 400 480 T 380 520 T 340 510 T 300 490 Z',
    length: '约 7km',
    ridden: false,
  },
];

export const cityCenter = { x: 300, y: 280 };
