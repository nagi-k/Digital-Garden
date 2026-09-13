import { Link, Navigate, useParams } from 'react-router-dom';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { useContent } from '../context/ContentContext';

/**
 * 站内兜底详情页：
 * 正常情况下作品卡片直接跳转你在后台配置的外部页面；
 * 未配置外链时才进入本页展示概要。
 */
export default function WorkDetail() {
  const { id } = useParams();
  const { content } = useContent();
  const project = content.projects.find((p) => p.id === id);

  if (!project) return <Navigate to="/works" replace />;

  return (
    <section className="section-gap pt-36 md:pt-44">
      <div className="container-site max-w-4xl">
        <Reveal>
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-sm font-medium text-sub transition-colors duration-200 hover:text-accent"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            返回作品列表
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="tag">{project.category}</span>
            <span className="text-sm text-muted">{project.year}</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 text-lg text-sub">{project.subtitle}</p>
        </Reveal>

        <Reveal delay={120}>
          <SmartImage
            src={project.cover}
            alt={project.title}
            wrapperClassName="mt-10 rounded-card border border-line shadow-card"
            className="aspect-[16/9] w-full object-cover"
          />
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_220px]">
            <div>
              <h2 className="eyebrow">OVERVIEW</h2>
              <p className="mt-4 leading-relaxed text-sub">{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-8"
                >
                  查看完整案例
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              )}
            </div>
            <aside className="card h-fit p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                项目信息
              </h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">分类</dt>
                  <dd className="mt-0.5 font-medium">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-muted">年份</dt>
                  <dd className="mt-0.5 font-medium">{project.year}</dd>
                </div>
                <div>
                  <dt className="text-muted">关键词</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((t) => (
                      <span key={t} className="tag-gray">
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
