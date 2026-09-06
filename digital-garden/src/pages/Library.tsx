import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Image, Link2, Palette, Sparkles } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/effects/FadeIn';

// 素材类型：image（图片素材）/ link（设计网站）
type LibraryItem =
  | {
      id: string;
      type: 'image';
      title: string;
      src: string;
      note?: string;
      tags: string[];
    }
  | {
      id: string;
      type: 'link';
      title: string;
      url: string;
      description: string;
      tags: string[];
    };

const libraryItems: LibraryItem[] = [
  // 示例图片素材（可以后续替换为你自己的上传）
  {
    id: 'img-1',
    type: 'image',
    title: '晨间光影',
    src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=800&fit=crop',
    note: '阳光透过百叶窗的层次感',
    tags: ['摄影', '光影'],
  },
  {
    id: 'img-2',
    type: 'image',
    title: '极简排版',
    src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=800&fit=crop',
    note: '文字留白的呼吸感',
    tags: ['排版', '极简'],
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
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'image' | 'link'>('image');

  const allTags = Array.from(new Set(libraryItems.flatMap((i) => i.tags)));

  const filteredItems = libraryItems.filter((item) => {
    const matchesType = item.type === activeType;
    const matchesTag = !activeTag || item.tags.includes(activeTag);
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ('description' in item &&
        item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesTag && matchesSearch;
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

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  label="全部标签"
                  active={!activeTag}
                  onClick={() => setActiveTag(null)}
                />
                {allTags.map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    active={activeTag === tag}
                    onClick={() => setActiveTag(tag)}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Items Masonry */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.08}>
                {item.type === 'image' ? (
                  <article className="card p-0 group overflow-hidden break-inside-avoid">
                    <div className="overflow-hidden relative">
                      <img
                        src={item.src}
                        alt={item.title}
                        className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-bg-primary/80 backdrop-blur-sm px-2 py-1 text-xs text-text-secondary">
                        <Image size={12} className="inline mr-1" />
                        图片
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-display-zh text-lg mb-1 group-hover:text-accent-terracotta transition-colors">
                        {item.title}
                      </h3>
                      {item.note && (
                        <p className="text-sm text-text-secondary mb-3">{item.note}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-xs text-text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
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