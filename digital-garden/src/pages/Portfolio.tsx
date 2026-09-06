import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { projects } from '@/data/projects';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const Portfolio = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <PageTransition>
      <div ref={containerRef} className="relative overflow-hidden">
        {/* 背景装饰 */}
        <motion.div
          style={{ y: backgroundY }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-lavender/5  blur-3xl"
        />

        <section className="pt-32 pb-section px-container relative z-10">
          <div className="max-w-container mx-auto">
            <SectionTitle en="SELECTED WORKS" zh="作品">
              <p className="text-text-secondary">
                精选的 UI/UX 设计项目，记录从概念到落地的完整思考过程。
              </p>
            </SectionTitle>

            <div className="space-y-32 md:space-y-40">
              {projects.map((project, index) => {
                const isEven = index % 2 === 0;
                return (
                  <FadeIn key={project.id} delay={0.1}>
                    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center group">
                      {/* Image */}
                      <div
                        className={`lg:col-span-7 ${
                          isEven ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <Link
                          to={`/ui/${project.slug}`}
                          className="block relative"
                          data-cursor-text="查看"
                        >
                          <div className="img-container aspect-[4/3] relative overflow-hidden">
                            <img
                              src={project.cover}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out-expo"
                              loading="lazy"
                            />
                            {/* 覆盖层 */}
                            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                              <span className="text-text-inverse font-display-en text-sm tracking-wider">
                                VIEW CASE
                              </span>
                            </div>
                          </div>

                          {/* 悬浮装饰 */}
                          <div
                            className="absolute -bottom-4 -right-4 w-20 h-20  border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{ borderColor: project.color }}
                          />
                        </Link>
                      </div>

                      {/* Info */}
                      <div
                        className={`lg:col-span-5 space-y-6 ${
                          isEven ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div className="flex items-baseline gap-4">
                          <span className="font-display-en text-sm text-text-muted">
                            {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                          </span>
                          <span className="text-sm text-text-muted">{project.year}</span>
                        </div>

                        <div>
                          <h3 className="font-display-zh text-h2 mb-2 group-hover:text-accent-terracotta transition-colors duration-300">
                            {project.title}
                          </h3>
                          <p className="font-display-en text-sm text-text-muted">
                            {project.titleEn}
                          </p>
                        </div>

                        <p className="text-text-secondary leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1.5 border border-border  text-text-secondary hover:border-accent-terracotta hover:text-accent-terracotta transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/ui/${project.slug}`}
                          className="inline-flex items-center gap-2 text-sm text-accent-terracotta group/link"
                        >
                          <span>查看项目</span>
                          <ArrowRight
                            size={16}
                            className="group-hover/link:translate-x-1 transition-transform"
                          />
                        </Link>
                      </div>
                    </article>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Portfolio;
