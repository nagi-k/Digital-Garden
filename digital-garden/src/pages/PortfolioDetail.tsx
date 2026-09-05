import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import FadeIn from '@/components/effects/FadeIn';
import { projects } from '@/data/projects';

const PortfolioDetail = () => {
  const { slug } = useParams();
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const project = projects[projectIndex];

  if (!project) {
    return (
      <PageTransition>
        <div className="pt-32 px-container text-center">
          <h1 className="text-h2">项目未找到</h1>
          <Link to="/ui" className="text-accent-terracotta mt-4 inline-block">
            返回作品集
          </Link>
        </div>
      </PageTransition>
    );
  }

  const prevProject = projects[projectIndex - 1];
  const nextProject = projects[projectIndex + 1];

  return (
    <PageTransition>
      <article className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto">
          <FadeIn>
            <Link
              to="/ui"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>返回作品集</span>
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mb-12">
              <span className="font-display-en text-sm text-text-muted">
                PROJECT {String(projectIndex + 1).padStart(2, '0')}
              </span>
              <h1 className="font-display-zh text-h1 mt-2 mb-2">{project.title}</h1>
              <p className="font-display-en text-lg text-text-muted">{project.titleEn}</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="img-container aspect-video mb-12">
              <img
                src={project.cover}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 py-8 border-y border-border">
              <div>
                <span className="text-xs font-display-en text-text-muted block mb-1">
                  ROLE
                </span>
                <span className="text-sm">{project.role}</span>
              </div>
              <div>
                <span className="text-xs font-display-en text-text-muted block mb-1">
                  YEAR
                </span>
                <span className="text-sm">{project.year}</span>
              </div>
              <div>
                <span className="text-xs font-display-en text-text-muted block mb-1">
                  TOOLS
                </span>
                <span className="text-sm">{project.tools.join(', ')}</span>
              </div>
              <div>
                <span className="text-xs font-display-en text-text-muted block mb-1">
                  TAGS
                </span>
                <span className="text-sm">{project.tags.join(', ')}</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="max-w-3xl space-y-8 mb-24">
              <p className="text-lg leading-relaxed text-text-secondary">
                {project.descriptionLong}
              </p>

              <div className="space-y-6">
                <h2 className="font-display-zh text-h3">项目背景</h2>
                <p className="text-text-secondary leading-relaxed">
                  每个项目都从理解用户和业务目标开始。我们通过访谈、竞品分析和数据洞察，构建出清晰的问题定义和设计方向。
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="font-display-zh text-h3">设计过程</h2>
                <p className="text-text-secondary leading-relaxed">
                  从信息架构到视觉语言，从低保真原型到高保真交付，每一步都经过反复验证和迭代。我们特别关注细节处的交互反馈，确保用户在每个触点都能感受到设计的温度。
                </p>
              </div>

              <div className="space-y-6">
                <h2 className="font-display-zh text-h3">学习收获</h2>
                <p className="text-text-secondary leading-relaxed">
                  这个项目让我更深入地理解了如何在复杂约束下做出优雅的设计决策，也让我意识到设计系统的重要性——它不仅是效率工具，更是设计思维的体现。
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Prev / Next Navigation */}
          <FadeIn delay={0.5}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-12">
              {prevProject ? (
                <Link
                  to={`/ui/${prevProject.slug}`}
                  className="group flex items-center gap-4 p-6 border border-border rounded-lg hover:border-accent-terracotta transition-colors"
                >
                  <ArrowLeft size={20} className="text-text-muted group-hover:text-accent-terracotta" />
                  <div>
                    <span className="text-xs font-display-en text-text-muted">PREVIOUS</span>
                    <p className="font-display-zh">{prevProject.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextProject ? (
                <Link
                  to={`/ui/${nextProject.slug}`}
                  className="group flex items-center justify-end gap-4 p-6 border border-border rounded-lg hover:border-accent-terracotta transition-colors text-right"
                >
                  <div>
                    <span className="text-xs font-display-en text-text-muted">NEXT</span>
                    <p className="font-display-zh">{nextProject.title}</p>
                  </div>
                  <ArrowRight size={20} className="text-text-muted group-hover:text-accent-terracotta" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </FadeIn>
        </div>
      </article>
    </PageTransition>
  );
};

export default PortfolioDetail;
