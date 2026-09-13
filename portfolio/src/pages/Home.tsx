import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { useContent } from '../context/ContentContext';

export default function Home() {
  const { content } = useContent();
  const featured = content.projects.filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        {/* 背景光斑 */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent/[0.07] blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-[-8%] top-40 h-[300px] w-[300px] rounded-full bg-[#e0e9ff] blur-3xl"
        />
        <div className="container-site relative">
          <Reveal>
            <p className="eyebrow">{content.hero.eyebrow}</p>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-5 max-w-3xl whitespace-pre-line text-4xl font-extrabold leading-[1.2] tracking-tight md:text-[56px] md:leading-[1.15]">
              {content.hero.title}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-sub md:text-lg">
              {content.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to="/works" className="btn-primary">
                {content.hero.ctaPrimary}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link to="/about" className="btn-secondary">
                {content.hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {false && (
        <>
          {/* 精选轮播（已隐藏，需要时打开外层 {false && ...} 即可） */}
          <section className="pb-4">
            <div className="container-site">
              <Reveal>
                <Carousel slides={content.hero.slides} />
              </Reveal>
            </div>
          </section>
        </>
      )}

      {/* 四个案例入口（从上到下依次排列，带微交互） */}
      <section className="section-gap">
        <div className="container-site">
          <Reveal>
            <p className="eyebrow">{content.home.featuredEyebrow}</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
                {content.home.featuredTitle}
              </h2>
              <p className="max-w-md text-sm text-sub">{content.home.featuredDesc}</p>
            </div>
          </Reveal>

          <div className="mt-12 flex flex-col gap-6">
            {featured.map((project, i) => {
              const inner = (
                <div className="card group grid items-stretch gap-0 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover md:grid-cols-[1.2fr_1fr]">
                  {/* 图片侧：序号大的偶数项在桌面端镜像排布 */}
                  <div
                    className={`relative h-full min-h-[240px] overflow-hidden md:min-h-[320px] ${i % 2 === 1 ? 'md:order-2' : ''}`}
                  >
                    <SmartImage
                      src={project.cover}
                      alt={project.title}
                      wrapperClassName="aspect-[16/9] md:h-full md:aspect-auto"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  {/* 文字侧 */}
                  <div className="flex flex-col justify-center p-7 md:p-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-semibold tracking-[0.18em] text-muted">
                        {String(i + 1).padStart(2, '0')} · {project.year}
                      </span>
                      <span className="tag">{project.category}</span>
                    </div>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight transition-colors duration-200 group-hover:text-accent md:text-[28px]">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-sub">{project.subtitle}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="tag-gray">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-200 group-hover:text-accent">
                      查看案例
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              );

              return (
                <Reveal key={project.id} delay={i * 60}>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer" className="block">
                      {inner}
                    </a>
                  ) : (
                    <Link to={`/works/${project.id}`} className="block">
                      {inner}
                    </Link>
                  )}
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 简短介绍 / CTA */}
      <section className="border-t border-line bg-white">
        <div className="container-site section-gap">
          <div className="grid items-center gap-10 md:grid-cols-[1fr_auto]">
            <Reveal>
              <p className="eyebrow">ABOUT</p>
              <h2 className="mt-3 max-w-xl text-3xl font-extrabold tracking-tight md:text-4xl">
                {content.home.introTitle}
              </h2>
              <p className="mt-5 max-w-2xl leading-relaxed text-sub">{content.home.introText}</p>
            </Reveal>
            <Reveal delay={120} className="md:justify-self-end">
              <Link to="/about" className="btn-secondary">
                {content.home.introCta}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
