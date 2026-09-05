import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { notes } from '@/data/notes';
import { recentLoves } from '@/data/interests';

const LatestUpdates = () => {
  const latestNote = notes[0];
  const recentLove = recentLoves[0];

  return (
    <section className="py-section px-container">
      <div className="max-w-container mx-auto">
        <SectionTitle en="GROWING" zh="最近在生长什么" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Latest Note */}
          <FadeIn className="lg:col-span-7">
            <Link to={`/notes/${latestNote.slug}`} className="group block">
              <article className="card p-8 md:p-10 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-display-en text-accent-sage">
                    LATEST NOTE
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={12} />
                    {latestNote.readTime} min read
                  </span>
                </div>
                <h3 className="font-display-zh text-h3 mb-4 group-hover:text-accent-terracotta transition-colors">
                  {latestNote.title}
                </h3>
                <p className="text-text-secondary mb-6 line-clamp-3">
                  {latestNote.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {latestNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 border border-border rounded-full text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-accent-terracotta">
                  <span>阅读全文</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </article>
            </Link>
          </FadeIn>

          {/* Recent Love & Now */}
          <div className="lg:col-span-5 space-y-8">
            <FadeIn delay={0.1}>
              <article className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-accent-lavender" />
                  <span className="text-xs font-display-en text-accent-lavender">
                    RECENTLY ENJOYING
                  </span>
                </div>
                <div className="flex gap-4">
                  <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded">
                    <img
                      src={recentLove.cover}
                      alt={recentLove.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-display-zh font-medium mb-1">
                      {recentLove.title}
                    </h4>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {recentLove.description}
                    </p>
                  </div>
                </div>
              </article>
            </FadeIn>

            <FadeIn delay={0.2}>
              <Link to="/now" className="block group">
                <article className="card p-6 border-l-2 border-l-accent-terracotta">
                  <span className="text-xs font-display-en text-accent-terracotta">
                    NOW
                  </span>
                  <h4 className="font-display-zh text-lg mt-2 mb-2 group-hover:text-accent-terracotta transition-colors">
                    现在在做什么
                  </h4>
                  <p className="text-sm text-text-secondary">
                    正在学习 Figma 高级原型技巧，同时筹备个人网站的视觉升级。
                  </p>
                </article>
              </Link>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex gap-4 text-sm text-text-muted">
                <span>已运行 365 天</span>
                <span>·</span>
                <span>4 个作品</span>
                <span>·</span>
                <span>4 篇笔记</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestUpdates;
