/** 站点全部可配置内容的类型定义（管理后台编辑的就是这份数据结构） */

export type ProjectCategory = 'APP 设计' | '小程序' | '设计系统' | '动效';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  tags: string[];
  description: string;
  /** 封面图 URL */
  cover: string;
  /** 详情外链：你为每个作品单独制作好的页面地址 */
  link: string;
  /** 是否在首页“精选案例入口”中展示 */
  featured: boolean;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  /** 轮播图点击跳转链接（如 /cases/case-1/index.html） */
  link: string;
}

export interface TimelineItem {
  id: string;
  period: string;
  title: string;
  org: string;
  description: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface SiteContent {
  site: {
    name: string;
    logoText: string;
    footerText: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    slides: HeroSlide[];
  };
  home: {
    featuredEyebrow: string;
    featuredTitle: string;
    featuredDesc: string;
    introTitle: string;
    introText: string;
    introCta: string;
  };
  worksPage: {
    title: string;
    description: string;
  };
  about: {
    name: string;
    role: string;
    avatar: string;
    bio: string[];
    skills: string[];
    timeline: TimelineItem[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    wechat: string;
    socials: SocialLink[];
  };
  projects: Project[];
}

export const ALL_CATEGORIES: Array<'全部' | ProjectCategory> = [
  '全部',
  'APP 设计',
  '小程序',
  '设计系统',
  '动效',
];
