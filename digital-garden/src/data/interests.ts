export interface InterestItem {
  id: number;
  title: string;
  titleEn?: string;
  category: 'movie' | 'music' | 'book' | 'travel' | 'photography' | 'art' | 'design';
  description: string;
  cover: string;
  rating?: number;
}

export const recentLoves: InterestItem[] = [
  {
    id: 1,
    title: 'つぼみ',
    titleEn: 'Tsubomi',
    category: 'music',
    description: '達見恵 / 佐野宏晃 · jubeat saucer ORIGINAL SOUNDTRACK-Sho&Hoshiko-',
    cover: '/images/interests/tsubomi.jpg',
    rating: 5,
  },
  {
    id: 2,
    title: '恋は臆病',
    titleEn: 'Koi wa Okubyou',
    category: 'music',
    description: '達見恵 · Delicious love',
    cover: '/images/interests/koiwaokubyou.jpg',
    rating: 5,
  },
  {
    id: 3,
    title: 'キセキはじまり☆',
    titleEn: 'Kiseki Hajimari☆',
    category: 'music',
    description: '達見恵 / 佐野宏晃 · pop\'n music 20th Anniversary Disc Long ver. & Brand New Tracks',
    cover: '/images/interests/kisekihajimari.jpg',
    rating: 5,
  },
  {
    id: 4,
    title: '今夜はパジャマパーティ',
    titleEn: 'Konya wa Pajama Party',
    category: 'music',
    description: '日向美ビタースイーツ♪ · Home Sweet Home',
    cover: '/images/interests/pajamaparty.jpg',
    rating: 5,
  },
  {
    id: 5,
    title: '10,000,000,000',
    titleEn: 'Ten Billion',
    category: 'music',
    description: 'TAG / 96 · jubeat saucer ORIGINAL SOUNDTRACK -7 Bros.-',
    cover: '/images/interests/10000000000.jpg',
    rating: 5,
  },
  {
    id: 6,
    title: 'In My Heart',
    titleEn: 'In My Heart',
    category: 'music',
    description: '矢鴇つかさ · DJ MAX TECHNIKA O.S.T & Special Track',
    cover: '/images/interests/inmyheart.jpg',
    rating: 5,
  },
];

export const tenThingsILove = [
  '清晨第一杯咖啡的香气',
  '老电影里的胶片颗粒感',
  '雨天窗户上的水珠轨迹',
  '书店里偶然发现一本绝版书',
  '黄昏时分城市天际线的渐变',
  '手写笔记时纸笔的摩擦声',
  '博物馆里一幅画前的长久驻足',
  '深夜台灯下改设计稿的专注',
  '旅途中陌生人善意的微笑',
  '完成一个项目后长舒一口气的瞬间',
];

export const moodBoardItems = [
  {
    id: 1,
    image: '/images/moodboard/color-1.jpg',
    category: 'color',
    note: '低饱和的大地色系，像被阳光晒过的亚麻布',
  },
  {
    id: 2,
    image: '/images/moodboard/photo-1.jpg',
    category: 'photography',
    note: '光影的切割，让平凡的场景有了戏剧性',
  },
  {
    id: 3,
    image: '/images/moodboard/arch-1.jpg',
    category: 'architecture',
    note: '混凝土的温柔，结构与光影的对话',
  },
  {
    id: 4,
    image: '/images/moodboard/art-1.jpg',
    category: 'art',
    note: '留白的力量，东方美学中的呼吸感',
  },
];
