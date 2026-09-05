import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';

const toolCategories = [
  {
    title: '设计软件',
    en: 'DESIGN TOOLS',
    tools: [
      { name: 'Figma', reason: '主力设计工具，协作和原型都很顺手' },
      { name: 'Sketch', reason: '早期项目遗留，偶尔打开看看' },
      { name: 'Principle', reason: '高保真交互动效原型' },
      { name: 'ProtoPie', reason: '传感器交互和复杂逻辑原型' },
    ],
  },
  {
    title: '效率工具',
    en: 'PRODUCTIVITY',
    tools: [
      { name: 'Notion', reason: '项目管理和知识库' },
      { name: 'Obsidian', reason: '双向链接笔记，构建第二大脑' },
      { name: 'Raycast', reason: '启动器和自动化工作流' },
      { name: 'Arc', reason: '浏览器，标签管理很优雅' },
    ],
  },
  {
    title: '硬件设备',
    en: 'HARDWARE',
    tools: [
      { name: 'MacBook Pro 14"', reason: '主力工作机' },
      { name: 'iPad Pro', reason: '手绘草图和阅读' },
      { name: 'Keychron K2', reason: '机械键盘，手感舒适' },
      { name: 'Sony WH-1000XM5', reason: '降噪耳机，专注必备' },
    ],
  },
  {
    title: '灵感来源',
    en: 'INSPIRATION',
    tools: [
      { name: 'Awwwards', reason: '网页设计趋势' },
      { name: 'Mindsparkle', reason: '品牌与视觉设计' },
      { name: 'SiteInspire', reason: '极简网页灵感' },
      { name: 'Pinterest', reason: ' mood board 收集' },
    ],
  },
];

const Uses = () => {
  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto">
          <SectionTitle en="TOOLBOX" zh="工具箱">
            <p className="text-text-secondary">
              我使用什么工具并不重要，重要的是它们如何帮助我更好地思考和创作。
            </p>
          </SectionTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {toolCategories.map((category, index) => (
              <FadeIn key={category.title} delay={index * 0.1}>
                <div>
                  <span className="font-display-en text-xs text-text-muted block mb-2">
                    {category.en}
                  </span>
                  <h3 className="font-display-zh text-h3 mb-6">{category.title}</h3>
                  <div className="space-y-4">
                    {category.tools.map((tool) => (
                      <div
                        key={tool.name}
                        className="flex items-start justify-between gap-4 pb-4 border-b border-border last:border-0"
                      >
                        <span className="font-medium">{tool.name}</span>
                        <span className="text-sm text-text-secondary text-right">
                          {tool.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Uses;
