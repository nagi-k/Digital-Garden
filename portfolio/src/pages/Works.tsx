import { useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import Reveal from '../components/Reveal';
import { useContent } from '../context/ContentContext';
import { ALL_CATEGORIES, type ProjectCategory } from '../types';

type Filter = '全部' | ProjectCategory;

export default function Works() {
  const { content } = useContent();
  const [filter, setFilter] = useState<Filter>('全部');

  const list = useMemo(
    () =>
      filter === '全部'
        ? content.projects
        : content.projects.filter((p) => p.category === filter),
    [content.projects, filter],
  );

  return (
    <section className="section-gap pt-36 md:pt-44">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">WORKS</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {content.worksPage.title}
          </h1>
          <p className="mt-4 max-w-xl text-sub">{content.worksPage.description}</p>
        </Reveal>

        {/* 分类筛选 */}
        <Reveal delay={100}>
          <div className="mt-10 flex flex-wrap gap-3">
            {ALL_CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`h-10 rounded-full px-5 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                    active
                      ? 'bg-accent text-white shadow-[0_4px_14px_rgba(37,99,235,0.3)]'
                      : 'bg-[#eef0f3] text-sub hover:bg-line hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* 作品网格 */}
        {list.length > 0 ? (
          <div
            key={filter}
            className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {list.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-16 rounded-card border border-dashed border-line bg-white py-20 text-center">
            <p className="text-sub">该分类下暂无作品</p>
            <button
              onClick={() => setFilter('全部')}
              className="mt-4 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              查看全部作品 →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
