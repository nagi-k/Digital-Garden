import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Calendar, Sparkles, TrendingUp } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { notes } from '@/data/notes';
import { recentLoves } from '@/data/interests';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

const LatestUpdates = () => {
  const latestNote = notes[0];
  const recentLove = recentLoves[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 30]);

  return (
    <section ref={containerRef} className="py-section px-container relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent-terracotta/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-lavender/5 rounded-full blur-3xl" />

      <div className="max-w-container mx-auto relative z-10">
        <SectionTitle en="GROWING" zh="最近在生长什么" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Latest Note - 大卡片 */}
          <motion.div style={{ y: y1 }} className="lg:col-span-7">
            <FadeIn>
              <Link to={`/notes/${latestNote.slug}`} className="group block h-full">
                <article className="card p-8 md:p-10 h-full relative overflow-hidden">
                  {/* 内部渐变装饰 */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-sage/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-accent-sage/20 flex items-center justify-center">
                        <Sparkles size={14} className="text-accent-sage" />
                      </div>
                      <span className="text-xs font-display-en text-accent-sage tracking-wider">
                        LATEST NOTE
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={12} />
                        {latestNote.readTime} min read
                      </span>
                    </div>

                    <h3 className="font-display-zh text-h2 mb-4 group-hover:text-accent-terracotta transition-colors duration-300">
                      {latestNote.title}
                    </h3>

                    <p className="text-text-secondary mb-6 line-clamp-3 leading-relaxed">
                      {latestNote.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {latestNote.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-3 py-1 border border-border rounded-full text-text-muted hover:border-accent-terracotta hover:text-accent-terracotta transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-accent-terracotta group-hover:gap-3 transition-all">
                      <span>阅读全文</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            </FadeIn>
          </motion.div>

          {/* Right Column */}
          <motion.div style={{ y: y2 }} className="lg:col-span-5 space-y-6">
            {/* Recent Love */}
            <FadeIn delay={0.1}>
              <article className="card p-6 group" data-cursor-text="查看">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-accent-lavender/20 flex items-center justify-center">
                    <BookOpen size={14} className="text-accent-lavender" />
                  </div>
                  <span className="text-xs font-display-en text-accent-lavender tracking-wider">
                    RECENTLY ENJOYING
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-lg img-container">
                    <img
                      src={recentLove.cover}
                      alt={recentLove.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display-zh font-medium mb-1 group-hover:text-accent-lavender transition-colors">
                      {recentLove.title}
                    </h4>
                    <p className="text-sm text-text-secondary line-clamp-3">
                      {recentLove.description}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>

            {/* Now Preview */}
            <FadeIn delay={0.2}>
              <Link to="/now" className="block group">
                <article className="card p-6 border-l-4 border-l-accent-terracotta relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-terracotta/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={14} className="text-accent-terracotta" />
                      <span className="text-xs font-display-en text-accent-terracotta tracking-wider">
                        NOW
                      </span>
                    </div>
                    <h4 className="font-display-zh text-lg mb-2 group-hover:text-accent-terracotta transition-colors">
                      现在在做什么
                    </h4>
                    <p className="text-sm text-text-secondary mb-3">
                      正在学习 Figma 高级原型技巧，同时筹备个人网站的视觉升级。
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Calendar size={12} />
                      <span>更新于 2026-09-05</span>
                    </div>
                  </div>
                </article>
              </Link>
            </FadeIn>

            {/* Stats */}
            <FadeIn delay={0.3}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: '运行天数', value: '365' },
                  { label: '作品', value: '4' },
                  { label: '笔记', value: '4' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-4 border border-border rounded-xl hover:border-accent-terracotta transition-colors group"
                  >
                    <div className="text-2xl font-display-zh text-accent-terracotta group-hover:scale-110 transition-transform">
                      {stat.value}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;
