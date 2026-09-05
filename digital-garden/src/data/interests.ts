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
    title: '完美的日子',
    titleEn: 'Perfect Days',
    category: 'movie',
    description: '维姆·文德斯执导，役所广司主演。一部关于日常、光影和存在主义的电影，每一帧都像一幅摄影作品。',
    cover: '/images/interests/perfect-days.jpg',
    rating: 5,
  },
  {
    id: 2,
    title: '眩晕',
    titleEn: 'Vertigo',
    category: 'book',
    description: '塞巴尔德的散文小说，文字与图像的交织，记忆与历史的迷宫。',
    cover: '/images/interests/vertigo-book.jpg',
    rating: 4,
  },
  {
    id: 3,
    title: 'Blue',
    titleEn: 'Blue',
    category: 'music',
    description: 'Joni Mitchell 的专辑，脆弱而勇敢的声音，影响了我对"真诚"的理解。',
    cover: '/images/interests/blue-album.jpg',
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
