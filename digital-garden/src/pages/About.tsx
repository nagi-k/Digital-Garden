import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import { siteData } from '@/data/site';

const About = () => {
  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-24">
            {/* Portrait */}
            <FadeIn className="lg:col-span-5">
              <div className="img-container aspect-[3/4]">
                <img
                  src="/images/about-portrait.jpg"
                  alt="王颖"
                  className="w-full h-full object-cover"
                />
              </div>
            </FadeIn>

            {/* Content */}
            <div className="lg:col-span-7 space-y-12">
              <FadeIn delay={0.1}>
                <SectionTitle en="ABOUT" zh="关于我" />
                <p className="text-lg text-text-secondary leading-relaxed">
                  {siteData.bioLong}
                </p>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {siteData.keywords.map((keyword, index) => (
                    <div
                      key={keyword}
                      className="p-6 border border-border rounded-lg text-center"
                    >
                      <span className="font-display-en text-xs text-text-muted block mb-2">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <p className="font-display-zh">{keyword}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="space-y-6">
                  <h3 className="font-display-zh text-h3">设计理念</h3>
                  <p className="text-text-secondary leading-relaxed">
                    我相信好的设计是"不可见的"——它不应该炫耀技巧，而应该让信息自然流动，让操作变得直觉。
                    设计不是装饰，而是对话。每一个像素、每一毫秒的动效，都应该服务于用户的目标和感受。
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Timeline */}
          <FadeIn delay={0.4}>
            <div className="border-t border-border pt-12">
              <h3 className="font-display-zh text-h3 mb-12">职业旅程</h3>
              <div className="space-y-8">
                {[
                  {
                    year: '2026 - 至今',
                    title: '独立 UI/UX 设计师',
                    description: '专注于数字产品体验设计，探索设计与技术的边界。',
                  },
                  {
                    year: '2024 - 2026',
                    title: '高级视觉设计师',
                    description: '负责品牌视觉系统与电商产品体验设计。',
                  },
                  {
                    year: '2022 - 2024',
                    title: 'UI 设计师',
                    description: '从平面设计转向数字产品，开始系统学习交互设计。',
                  },
                  {
                    year: '2020 - 2022',
                    title: '平面设计师',
                    description: '品牌视觉与印刷品设计，建立扎实的设计基础。',
                  },
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <span className="md:col-span-2 text-sm font-display-en text-text-muted">
                      {item.year}
                    </span>
                    <div className="md:col-span-10">
                      <h4 className="font-display-zh text-lg mb-1">{item.title}</h4>
                      <p className="text-text-secondary text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Contact */}
          <FadeIn delay={0.5}>
            <div className="mt-24 p-8 md:p-12 bg-bg-secondary rounded-lg text-center">
              <h3 className="font-display-zh text-h3 mb-4">想聊聊？</h3>
              <p className="text-text-secondary mb-6">
                无论是项目合作、设计交流，还是单纯打个招呼，都欢迎写信给我。
              </p>
              <a
                href={`mailto:${siteData.email}`}
                className="magnetic-btn inline-flex items-center gap-2"
              >
                <span>发送邮件</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
};

export default About;
