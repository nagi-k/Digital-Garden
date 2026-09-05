export interface Project {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionLong: string;
  tags: string[];
  year: string;
  role: string;
  tools: string[];
  cover: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'dream-island',
    title: '梦屿',
    titleEn: 'Dream Island',
    description: '一款关于梦境记录的 App 设计，探索情感化界面与沉浸式体验。',
    descriptionLong:
      '「梦屿」是一款专注于梦境记录与解读的应用。我们希望用温柔的界面和沉浸式的交互，帮助用户留住那些稍纵即逝的梦境片段。从情绪曲线到符号联想，每一处设计都试图回应梦境的朦胧与诗意。',
    tags: ['UI/UX', 'App Design', '情感化设计'],
    year: '2026',
    role: 'UI/UX 设计师',
    tools: ['Figma', 'Principle', 'After Effects'],
    cover: '/images/projects/dream-island-cover.jpg',
    color: 'var(--accent-lavender)',
  },
  {
    id: 2,
    slug: 'habitat',
    title: '栖居',
    titleEn: 'Habitat',
    description: '智能家居控制面板，平衡功能密度与视觉简洁。',
    descriptionLong:
      '「栖居」是一个智能家居中控屏设计项目。我们面对的挑战是在有限的屏幕空间内整合数十种设备控制，同时保持界面的呼吸感和易用性。通过层级化的信息架构和克制的视觉语言，让科技真正融入生活。',
    tags: ['UI/UX', 'IoT', 'Design System'],
    year: '2025',
    role: 'UI/UX 设计师',
    tools: ['Figma', 'Sketch', 'ProtoPie'],
    cover: '/images/projects/habitat-cover.jpg',
    color: 'var(--accent-sage)',
  },
  {
    id: 3,
    slug: 'prologue',
    title: '序章',
    titleEn: 'Prologue',
    description: '品牌官网重设计，强调信息层级与转化路径。',
    descriptionLong:
      '「序章」是一次品牌官网的完整重构。我们从用户旅程出发，重新梳理了信息架构和视觉层级，用编辑式的设计语言讲述品牌故事。最终实现了停留时长提升 40%，转化率提升 25% 的成果。',
    tags: ['Branding', 'Web Design', 'Editorial'],
    year: '2025',
    role: '视觉设计师',
    tools: ['Figma', 'Webflow', 'Adobe CC'],
    cover: '/images/projects/prologue-cover.jpg',
    color: 'var(--accent-terracotta)',
  },
  {
    id: 4,
    slug: 'glow',
    title: '流光',
    titleEn: 'Glow',
    description: '电商小程序体验优化，提升用户购买决策效率。',
    descriptionLong:
      '「流光」是一个电商小程序的体验优化项目。我们通过用户访谈和行为数据分析，识别出购买路径中的关键摩擦点，用更清晰的视觉引导和更流畅的交互反馈，帮助用户更快做出购买决策。',
    tags: ['UI/UX', 'E-commerce', 'Interaction'],
    year: '2024',
    role: 'UI/UX 设计师',
    tools: ['Figma', 'Sketch', 'Axure'],
    cover: '/images/projects/glow-cover.jpg',
    color: 'var(--accent-clay)',
  },
];
