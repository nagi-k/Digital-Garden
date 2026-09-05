import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { projects } from '@/data/projects';

const Portfolio = () => {
  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto">
          <SectionTitle en="SELECTED WORKS" zh="作品">
            <p className="text-text-secondary">
              精选的 UI/UX 设计项目，记录从概念到落地的完整思考过程。
            </p>
          </SectionTitle>

          <div className="space-y-24 md:space-y-32">
            {projects.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1}>
                <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Image */}
                  <div
                    className={`lg:col-span-7 ${
                      index % 2 === 1 ? 'lg:order-2' : ''
                    }`}
                  >
                    <Link
                      to={`/ui/${project.slug}`}
                      className="block group"
                      data-cursor-text="查看"
                    >
                      <div className="img-container aspect-[4/3]">
                        <img
                          src={project.cover}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out-expo"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Info */}
                  <div
                    className={`lg:col-span-5 space-y-6 ${
                      index % 2 === 1 ? 'lg:order-1' : ''
                    }`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-display-en text-sm text-text-muted">
                        {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                      </span>
                      <span className="text-sm text-text-muted">{project.year}</span>
                    </div>

                    <div>
                      <h3 className="font-display-zh text-h2 mb-2">{project.title}</h3>
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
                          className="text-xs px-3 py-1 border border-border rounded-full text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      to={`/ui/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm text-accent-terracotta group"
                    >
                      <span>查看项目</span>
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Portfolio;
