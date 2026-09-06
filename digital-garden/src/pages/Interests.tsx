import { useState } from 'react';
import { Star, Heart, Film, Music, BookOpen, Camera, Palette, MapPin, Sparkles } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/effects/FadeIn';
import { recentLoves, tenThingsILove, moodBoardItems } from '@/data/interests';

const categoryIcons = {
  movie: Film,
  music: Music,
  book: BookOpen,
  travel: MapPin,
  photography: Camera,
  art: Palette,
  design: Palette,
};

const categoryColors = {
  movie: 'var(--accent-lavender)',
  music: 'var(--accent-clay)',
  book: 'var(--accent-terracotta)',
  travel: 'var(--accent-sage)',
  photography: 'var(--accent-lavender)',
  art: 'var(--accent-clay)',
  design: 'var(--accent-terracotta)',
};

const Interests = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const categories = Array.from(new Set(moodBoardItems.map((i) => i.category)));
  const filteredMoodBoard = activeCategory
    ? moodBoardItems.filter((i) => i.category === activeCategory)
    : moodBoardItems;

  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-lavender/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-clay/5 rounded-full blur-3xl" />

        <div className="max-w-container mx-auto relative z-10">
          <SectionTitle en="LIFE & INTERESTS" zh="兴趣爱好">
            <p className="text-text-secondary">
              设计之外，生活之内。这里是我收集灵感、感受世界的方式。
            </p>
          </SectionTitle>

          {/* Recent Loves */}
          <FadeIn delay={0.1}>
            <div className="mb-24">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles size={20} className="text-accent-terracotta" />
                <h3 className="font-display-zh text-h3">最近在迷</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentLoves.map((item) => {
                  const Icon = categoryIcons[item.category];
                  return (
                    <article
                      key={item.id}
                      className="card p-6 group relative overflow-hidden"
                      data-cursor-text="查看"
                    >
                      {/* 内部装饰 */}
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-50"
                        style={{ backgroundColor: `${categoryColors[item.category]}15` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${categoryColors[item.category]}20` }}
                          >
                            <Icon size={14} style={{ color: categoryColors[item.category] }} />
                          </div>
                          <span
                            className="text-xs font-display-en tracking-wider"
                            style={{ color: categoryColors[item.category] }}
                          >
                            {item.category.toUpperCase()}
                          </span>
                        </div>

                        <div className="img-container aspect-[2/3] mb-4 rounded-xl overflow-hidden">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>

                        <h4 className="font-display-zh text-lg mb-1 group-hover:text-accent-terracotta transition-colors">
                          {item.title}
                        </h4>
                        {item.titleEn && (
                          <p className="font-display-en text-xs text-text-muted mb-2">
                            {item.titleEn}
                          </p>
                        )}
                        <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                          {item.description}
                        </p>
                        {item.rating && (
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={
                                  i < (item.rating ?? 0)
                                    ? 'fill-accent-terracotta text-accent-terracotta'
                                    : 'text-border'
                                }
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </FadeIn>

          {/* Mood Board */}
          <FadeIn delay={0.2}>
            <div className="mb-24">
              <div className="flex items-center gap-3 mb-8">
                <Heart size={20} className="text-accent-lavender" />
                <h3 className="font-display-zh text-h3">视觉灵感板</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                <Tag
                  label="全部"
                  active={!activeCategory}
                  onClick={() => setActiveCategory(null)}
                />
                {categories.map((cat) => (
                  <Tag
                    key={cat}
                    label={cat}
                    active={activeCategory === cat}
                    onClick={() => setActiveCategory(cat)}
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {filteredMoodBoard.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl aspect-square"
                    data-cursor-text="喜欢"
                  >
                    <img
                      src={item.image}
                      alt={item.category}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-text-primary/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-text-inverse text-sm">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* 10 Things I Love */}
          <FadeIn delay={0.3}>
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Heart size={20} className="text-accent-clay" />
                <h3 className="font-display-zh text-h3">10 things I love</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tenThingsILove.map((thing, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 border-b border-border group hover:border-accent-terracotta transition-colors"
                  >
                    <span className="font-display-en text-xs text-text-muted mt-1 group-hover:text-accent-terracotta transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-text-secondary group-hover:text-text-primary transition-colors">
                      {thing}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
};

export default Interests;
