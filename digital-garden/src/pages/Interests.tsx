import { Star, Film, Music, BookOpen, Camera, Palette, MapPin, Sparkles } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import RidingMap from '@/components/sections/RidingMap';
import { recentLoves } from '@/data/interests';

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
  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-lavender/5  blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-clay/5  blur-3xl" />

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
                        className="absolute top-0 right-0 w-32 h-32  blur-2xl opacity-50"
                        style={{ backgroundColor: `${categoryColors[item.category]}15` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                          <div
                            className="w-8 h-8  flex items-center justify-center"
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

                        <div className="img-container aspect-square mb-4  overflow-hidden">
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

          {/* 骑行日志 */}
          <RidingMap />
        </div>
      </section>
    </PageTransition>
  );
};

export default Interests;
