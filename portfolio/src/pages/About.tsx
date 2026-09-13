import Reveal from '../components/Reveal';
import SmartImage from '../components/SmartImage';
import { useContent } from '../context/ContentContext';

export default function About() {
  const { content } = useContent();
  const { about } = content;

  return (
    <section className="section-gap pt-36 md:pt-44">
      <div className="container-site">
        {/* 个人介绍 */}
        <div className="grid items-start gap-12 md:grid-cols-[320px_1fr]">
          <Reveal>
            <SmartImage
              src={about.avatar}
              alt={about.name}
              wrapperClassName="rounded-card border border-line shadow-card"
              className="aspect-square w-full object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="eyebrow">ABOUT ME</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                {about.name}
              </h1>
              <p className="mt-2 text-base font-medium text-accent">{about.role}</p>
            </Reveal>
            <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-sub">
              {about.bio.map((para, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p>{para}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={200}>
              <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                技能与工具
              </h2>
              <div className="mt-4 flex max-w-2xl flex-wrap gap-2">
                {about.skills.map((skill) => (
                  <span
                    key={skill}
                    className="tag transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* 时间轴 */}
        <div className="mt-24 max-w-2xl">
          <Reveal>
            <p className="eyebrow">EXPERIENCE</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight md:text-3xl">
              经历
            </h2>
          </Reveal>
          <div className="mt-10 space-y-0">
            {about.timeline.map((item, i) => (
              <Reveal key={item.id} delay={i * 80}>
                <div className="relative border-l-2 border-line pb-10 pl-8 last:pb-0">
                  <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-white" />
                  <p className="text-xs font-semibold tracking-[0.12em] text-muted">
                    {item.period}
                  </p>
                  <h3 className="mt-2 text-lg font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-0.5 text-sm font-medium text-accent">{item.org}</p>
                  <p className="mt-2 text-sm leading-relaxed text-sub">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
