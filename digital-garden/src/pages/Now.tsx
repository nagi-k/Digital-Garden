import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';

const nowItems = [
  {
    title: '正在学习',
    items: ['Figma 高级原型技巧', 'React 动画库 GSAP', '数字花园的构建方法'],
  },
  {
    title: '正在做',
    items: ['个人网站视觉升级', '梦屿 App 设计迭代', '设计系统文档整理'],
  },
  {
    title: '最近在思考',
    items: ['AI 时代设计师的核心竞争力', '如何平衡商业目标与用户体验', '慢设计与可持续创作'],
  },
  {
    title: '当前工具',
    items: ['Figma / FigJam', 'Notion / Obsidian', 'React + Vite + Tailwind'],
  },
];

const Now = () => {
  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto max-w-3xl">
          <SectionTitle en="NOW" zh="现在在做什么">
            <p className="text-text-secondary">
              本页最后更新于 2026 年 9 月 5 日
            </p>
          </SectionTitle>

          <div className="space-y-16">
            {nowItems.map((section, index) => (
              <FadeIn key={section.title} delay={index * 0.1}>
                <div>
                  <h3 className="font-display-zh text-h3 mb-6 flex items-center gap-3">
                    <span className="w-8 h-px bg-accent-terracotta" />
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-text-secondary"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-border" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}

            <FadeIn delay={0.4}>
              <div className="p-8 bg-bg-secondary rounded-lg">
                <h3 className="font-display-zh text-lg mb-4">本月学习进度</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Figma 高级技巧</span>
                      <span className="text-text-muted">75%</span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-sage rounded-full"
                        style={{ width: '75%' }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>React 动画</span>
                      <span className="text-text-muted">40%</span>
                    </div>
                    <div className="h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-terracotta rounded-full"
                        style={{ width: '40%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Now;
