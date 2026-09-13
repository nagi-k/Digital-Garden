import { Link } from 'react-router-dom';
import type { Project } from '../types';
import SmartImage from './SmartImage';

/** 作品卡片：配置了外链跳外链（新标签页），否则进入站内详情页 */
export default function ProjectCard({ project }: { project: Project }) {
  const inner = (
    <article className="card group h-full overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover">
      <div className="relative overflow-hidden">
        <SmartImage
          src={project.cover}
          alt={project.title}
          wrapperClassName="aspect-[16/9] md:aspect-[21/9]"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold tracking-tight transition-colors duration-200 group-hover:text-accent">
            {project.title}
          </h3>
          <span className="shrink-0 text-xs text-muted">{project.year}</span>
        </div>
        <p className="mt-1.5 text-sm text-sub">{project.subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag-gray">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );

  if (project.link) {
    return (
      <a href={project.link} target="_blank" rel="noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return (
    <Link to={`/works/${project.id}`} className="block h-full">
      {inner}
    </Link>
  );
}
