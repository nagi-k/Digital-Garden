import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Link2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/effects/FadeIn';

// 素材类型：image（图片素材）/ link（设计网站）
// 图片分类固定四类：产品、摄影、版式、绘画
type ImageCategory = '产品' | '摄影' | '版式' | '绘画';

type LibraryItem =
  | {
      id: string;
      type: 'image';
      src: string;
      category: ImageCategory;
      createdAt: string; // ISO 日期字符串，用于排序
    }
  | {
      id: string;
      type: 'link';
      title: string;
      url: string;
      description: string;
      tags: string[];
    };

const IMAGE_CATEGORIES: ImageCategory[] = ['产品', '摄影', '版式', '绘画'];

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

const libraryItems: LibraryItem[] = [
  // 示例图片素材（按上传时间倒序排列，越新越靠前）
  {
    id: 'img-1',
    type: 'image',
    src: 'images/library-1.jpg',
    category: '摄影',
    createdAt: '2026-09-06T10:00:00.000Z',
  },
  {
    id: 'img-2',
    type: 'image',
    src: 'images/library-2.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:50:00.000Z',
  },
  {
    id: 'img-3',
    type: 'image',
    src: 'images/library-3.jpg',
    category: '绘画',
    createdAt: '2026-09-06T09:40:00.000Z',
  },
  {
    id: 'img-4',
    type: 'image',
    src: 'images/library-4.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:30:00.000Z',
  },
  {
    id: 'img-5',
    type: 'image',
    src: 'images/library-5.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:20:00.000Z',
  },
  {
    id: 'img-6',
    type: 'image',
    src: 'images/library-6.jpg',
    category: '摄影',
    createdAt: '2026-09-06T09:10:00.000Z',
  },
  {
    id: 'img-7',
    type: 'image',
    src: 'images/library-7.jpg',
    category: '版式',
    createdAt: '2026-09-06T09:00:00.000Z',
  },
  {
    id: 'img-8',
    type: 'image',
    src: 'images/library-8.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:50:00.000Z',
  },
  {
    id: 'img-9',
    type: 'image',
    src: 'images/library-9.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:40:00.000Z',
  },
  {
    id: 'img-10',
    type: 'image',
    src: 'images/library-10.jpg',
    category: '产品',
    createdAt: '2026-09-06T08:30:00.000Z',
  },
  {
    id: 'img-11',
    type: 'image',
    src: 'images/library-11.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:20:00.000Z',
  },
  {
    id: 'img-12',
    type: 'image',
    src: 'images/library-12.jpg',
    category: '摄影',
    createdAt: '2026-09-06T08:10:00.000Z',
  },
  // 新增产品类素材
  {
    id: 'img-13',
    type: 'image',
    src: 'images/library-13.jpg',
    category: '产品',
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'img-14',
    type: 'image',
    src: 'images/library-14.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:50:00.000Z',
  },
  {
    id: 'img-15',
    type: 'image',
    src: 'images/library-15.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:40:00.000Z',
  },
  {
    id: 'img-16',
    type: 'image',
    src: 'images/library-16.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:30:00.000Z',
  },
  {
    id: 'img-17',
    type: 'image',
    src: 'images/library-17.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:20:00.000Z',
  },
  {
    id: 'img-18',
    type: 'image',
    src: 'images/library-18.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:10:00.000Z',
  },
  {
    id: 'img-19',
    type: 'image',
    src: 'images/library-19.jpg',
    category: '产品',
    createdAt: '2026-09-20T09:00:00.000Z',
  },
  {
    id: 'img-20',
    type: 'image',
    src: 'images/library-20.jpg',
    category: '产品',
    createdAt: '2026-09-20T08:50:00.000Z',
  },
  // 新增摄影类素材
  {
    id: 'img-21',
    type: 'image',
    src: 'images/library-21.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:40:00.000Z',
  },
  {
    id: 'img-22',
    type: 'image',
    src: 'images/library-22.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:30:00.000Z',
  },
  {
    id: 'img-23',
    type: 'image',
    src: 'images/library-23.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:20:00.000Z',
  },
  {
    id: 'img-24',
    type: 'image',
    src: 'images/library-24.jpg',
    category: '摄影',
    createdAt: '2026-09-20T08:10:00.000Z',
  },
  // 新增版式类素材
  {
    id: 'img-25',
    type: 'image',
    src: 'images/library-25.jpg',
    category: '版式',
    createdAt: '2026-09-20T08:00:00.000Z',
  },
  {
    id: 'img-26',
    type: 'image',
    src: 'images/library-26.jpg',
    category: '版式',
    createdAt: '2026-09-20T07:50:00.000Z',
  },
  {
    id: 'img-27',
    type: 'image',
    src: 'images/library-27.jpg',
    category: '版式',
    createdAt: '2026-09-20T07:40:00.000Z',
  },
  {
    id: 'img-28',
    type: 'image',
    src: 'images/library-28.jpg',
    category: '版式',
    createdAt: '2026-09-20T07:30:00.000Z',
  },
  // 新增绘画类素材
  {
    id: 'img-29',
    type: 'image',
    src: 'images/library-29.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:20:00.000Z',
  },
  {
    id: 'img-30',
    type: 'image',
    src: 'images/library-30.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:10:00.000Z',
  },
  {
    id: 'img-31',
    type: 'image',
    src: 'images/library-31.jpg',
    category: '绘画',
    createdAt: '2026-09-20T07:00:00.000Z',
  },
  {
    id: 'img-32',
    type: 'image',
    src: 'images/library-32.jpg',
    category: '绘画',
    createdAt: '2026-09-20T06:50:00.000Z',
  },
  {
    id: 'img-33',
    type: 'image',
    src: 'images/library-33.jpg',
    category: '绘画',
    createdAt: '2026-09-20T06:40:00.000Z',
  },
  {
    id: 'img-34',
    type: 'image',
    src: 'images/library-34.jpg',
    category: '绘画',
    createdAt: '2026-09-20T06:30:00.000Z',
  },
  // 示例设计网站
  {
    id: 'link-1',
    type: 'link',
    title: 'Awwwards',
    url: 'https://www.awwwards.com',
    description: '全球最佳网站设计灵感与趋势',
    tags: ['灵感', '网站'],
  },
  {
    id: 'link-2',
    type: 'link',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: '设计师作品社区与配色参考',
    tags: ['配色', '插画'],
  },
  {
    id: 'link-3',
    type: 'link',
    title: 'Mobbin',
    url: 'https://mobbin.com',
    description: '真实 App 界面设计模式库',
    tags: ['移动端', 'UI'],
  },
  {
    id: 'link-4',
    type: 'link',
    title: 'Godly',
    url: 'https://godly.website',
    description: '精选落地页与交互设计灵感',
    tags: ['落地页', '动效'],
  },
  {
    id: 'link-5',
    type: 'link',
    title: 'Behance',
    url: 'https://www.behance.net',
    description: 'Adobe 旗下全球最大的创意作品与设计师交流平台',
    tags: ['作品集', '灵感'],
  },
  {
    id: 'link-6',
    type: 'link',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: '设计师作品社区，适合找配色、插画与 UI 细节',
    tags: ['配色', '插画'],
  },
  {
    id: 'link-7',
    type: 'link',
    title: 'Pinterest',
    url: 'https://www.pinterest.com',
    description: '图像分享与情绪板工具，适合主题搜集与风格探索',
    tags: ['情绪板', '灵感'],
  },
  {
    id: 'link-8',
    type: 'link',
    title: 'Muzli',
    url: 'https://muz.li',
    description: '聚合 150+ 设计网站最新作品，每日设计早餐',
    tags: ['趋势', '聚合'],
  },
  {
    id: 'link-9',
    type: 'link',
    title: 'Collect UI',
    url: 'https://collectui.com',
    description: '按页面类型分类的 UI 灵感库，登录、支付、设置等',
    tags: ['移动端', 'UI'],
  },
  {
    id: 'link-10',
    type: 'link',
    title: 'Land-book',
    url: 'https://land-book.com',
    description: '专注落地页与营销站点设计参考',
    tags: ['落地页', '营销'],
  },
  {
    id: 'link-11',
    type: 'link',
    title: 'SiteInspire',
    url: 'https://www.siteinspire.com',
    description: '按风格与类型筛选的网站设计灵感库',
    tags: ['网页', '排版'],
  },
  {
    id: 'link-12',
    type: 'link',
    title: 'Lapa Ninja',
    url: 'https://www.lapa.ninja',
    description: '精选落地页设计案例与首屏结构参考',
    tags: ['落地页', '首屏'],
  },
  {
    id: 'link-13',
    type: 'link',
    title: 'One Page Love',
    url: 'https://onepagelove.com',
    description: '单页网站与模板集合，研究信息密度控制',
    tags: ['单页', '模板'],
  },
  {
    id: 'link-14',
    type: 'link',
    title: 'Designspiration',
    url: 'https://www.designspiration.com',
    description: '图像与颜色搜索引擎，适合建立情绪版',
    tags: ['颜色', '灵感'],
  },
  {
    id: 'link-15',
    type: 'link',
    title: 'Niice',
    url: 'https://niice.co',
    description: '聚合 Behance、Dribbble 等平台的高质量灵感库',
    tags: ['灵感', '搜索'],
  },
  {
    id: 'link-16',
    type: 'link',
    title: 'UI Design Daily',
    url: 'https://www.uidesigndaily.com',
    description: '每日更新的 UI 设计灵感与组件参考',
    tags: ['UI', '组件'],
  },
  {
    id: 'link-17',
    type: 'link',
    title: 'Bestfolio',
    url: 'https://www.bestfolios.com',
    description: '设计师作品集与简历模板参考',
    tags: ['作品集', '简历'],
  },
  {
    id: 'link-18',
    type: 'link',
    title: 'motionsites',
    url: 'https://motionsites.ai',
    description: '精选网站动效与交互设计作品集',
    tags: ['动效', '交互'],
  },
  {
    id: 'link-19',
    type: 'link',
    title: 'Dark Design',
    url: 'https://www.dark.design',
    description: '深色主题设计灵感，适合科技、AI、硬件视觉',
    tags: ['深色模式', '科技'],
  },
  {
    id: 'link-20',
    type: 'link',
    title: '花瓣网',
    url: 'https://huaban.com',
    description: '中国最大的设计师灵感采集与素材分享平台',
    tags: ['灵感', '国内'],
  },
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ImageCategory | null>(null);
  const [activeType, setActiveType] = useState<'image' | 'link'>('image');

  const allLinkTags = Array.from(
    new Set(libraryItems.filter((i): i is Extract<LibraryItem, { type: 'link' }> => i.type === 'link').flatMap((i) => i.tags))
  );

  const filteredItems = libraryItems
    .filter((item) => {
      const matchesType = item.type === activeType;
      if (item.type === 'image') {
        const matchesCategory = !activeCategory || item.category === activeCategory;
        const matchesSearch = !searchQuery || item.category.includes(searchQuery);
        return matchesType && matchesCategory && matchesSearch;
      }
      const matchesTag = !activeCategory || item.tags.includes(activeCategory);
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      if (a.type === 'image' && b.type === 'image') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

  const imageCount = libraryItems.filter((i) => i.type === 'image').length;
  const linkCount = libraryItems.filter((i) => i.type === 'link').length;

  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-lavender/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-sage/5 blur-3xl" />

        <div className="max-w-container mx-auto relative z-10">
          <SectionTitle en="LIBRARY" zh="素材库">
            <p className="text-text-secondary">
              收集设计灵感、视觉参考和优秀网站。持续更新，随手取用。
            </p>
          </SectionTitle>

          {/* Stats */}
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="card p-6 text-center">
                <div className="font-display-zh text-3xl text-text-primary">{libraryItems.length}</div>
                <div className="text-xs text-text-muted mt-1">总素材</div>
              </div>
              <div className="card p-6 text-center">
                <div className="font-display-zh text-3xl text-text-primary">{imageCount}</div>
                <div className="text-xs text-text-muted mt-1">图片素材</div>
              </div>
              <div className="card p-6 text-center">
                <div className="font-display-zh text-3xl text-text-primary">{linkCount}</div>
                <div className="text-xs text-text-muted mt-1">设计网站</div>
              </div>
            </div>
          </FadeIn>

          {/* Search & Filter */}
          <FadeIn delay={0.15}>
            <div className="mb-12 space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="搜索素材..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-card border border-border text-sm focus:outline-none focus:border-accent-terracotta transition-colors"
                />
              </div>

              {/* Type Filter */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  label="图片"
                  active={activeType === 'image'}
                  onClick={() => setActiveType('image')}
                />
                <Tag
                  label="网站"
                  active={activeType === 'link'}
                  onClick={() => setActiveType('link')}
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  label="全部"
                  active={!activeCategory}
                  onClick={() => setActiveCategory(null)}
                />
                {(activeType === 'image' ? IMAGE_CATEGORIES : allLinkTags).map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    active={activeCategory === tag}
                    onClick={() => setActiveCategory(tag as ImageCategory)}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Items Masonry */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.08}>
                {item.type === 'image' ? (
                  <article className="card p-0 group overflow-hidden break-inside-avoid">
                    <div className="overflow-hidden relative">
                      <img
                        src={item.src}
                        alt={item.category}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-text-secondary">
                        {item.category}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatDate(new Date(item.createdAt))}
                      </span>
                    </div>
                  </article>
                ) : (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-5 group break-inside-avoid block hover:border-accent-terracotta transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-accent-clay/10 flex items-center justify-center">
                        <Link2 size={14} className="text-accent-clay" />
                      </div>
                      <span className="text-xs font-medium text-accent-clay">网站</span>
                    </div>
                    <h3 className="font-display-zh text-lg mb-2 group-hover:text-accent-terracotta transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-xs text-text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      />
                    </div>
                  </a>
                )}
              </FadeIn>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <FadeIn>
              <div className="text-center py-24 text-text-muted">
                <p>没有找到相关素材</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Library;