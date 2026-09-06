import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Monitor, Box, Smartphone } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';

const Portfolio = () => {
  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-lavender/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-sage/5 blur-3xl" />

        <section className="pt-32 pb-section px-container relative z-10">
          <div className="max-w-container mx-auto">
            <SectionTitle en="SELECTED WORKS" zh="作品">
              <p className="text-text-secondary">
                UI/UX 与工业设计的创作集合。从界面到实体，从概念到落地。
              </p>
            </SectionTitle>

            {/* 作品集入口 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
              <FadeIn delay={0.1}>
                <a
                  href="https://your-ui-portfolio-url.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-8 lg:p-12 group relative overflow-hidden h-full min-h-[280px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent-terracotta/5 blur-2xl" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-accent-terracotta/10 flex items-center justify-center mb-6">
                      <Monitor size={20} className="text-accent-terracotta" />
                    </div>
                    <h3 className="font-display-zh text-2xl lg:text-3xl mb-2 group-hover:text-accent-terracotta transition-colors">
                      UI作品集
                    </h3>
                    <p className="text-text-secondary text-sm">
                      界面设计、交互体验、视觉系统
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center gap-2 text-sm text-text-muted group-hover:text-accent-terracotta transition-colors mt-8">
                    <span>查看完整作品集</span>
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </div>
                </a>
              </FadeIn>

              <FadeIn delay={0.2}>
                <a
                  href="https://your-industrial-portfolio-url.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-8 lg:p-12 group relative overflow-hidden h-full min-h-[280px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-accent-clay/5 blur-2xl" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-accent-clay/10 flex items-center justify-center mb-6">
                      <Box size={20} className="text-accent-clay" />
                    </div>
                    <h3 className="font-display-zh text-2xl lg:text-3xl mb-2 group-hover:text-accent-clay transition-colors">
                      工业设计作品集
                    </h3>
                    <p className="text-text-secondary text-sm">
                      产品造型、CMF、人机工程、制造落地
                    </p>
                  </div>
                  <div className="relative z-10 flex items-center gap-2 text-sm text-text-muted group-hover:text-accent-clay transition-colors mt-8">
                    <span>查看完整作品集</span>
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </div>
                </a>
              </FadeIn>
            </div>

            {/* 3D 建模展示区域 */}
            <FadeIn delay={0.1}>
              <div className="mb-24">
                <div className="flex items-center gap-3 mb-8">
                  <Box size={20} className="text-accent-sage" />
                  <h3 className="font-display-zh text-h3">3D 建模</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 占位符：后续替换为 Three.js 模型 */}
                  <div className="card p-6 group">
                    <div className="aspect-[4/3] bg-bg-secondary border border-border mb-4 flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Box size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">3D 模型占位符</p>
                        <p className="text-xs mt-1">等待导入 Three.js 场景</p>
                      </div>
                    </div>
                    <h4 className="font-display-zh text-lg mb-1">模型名称</h4>
                    <p className="text-sm text-text-secondary">模型描述与细节说明</p>
                  </div>
                  <div className="card p-6 group">
                    <div className="aspect-[4/3] bg-bg-secondary border border-border mb-4 flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Box size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">3D 模型占位符</p>
                        <p className="text-xs mt-1">等待导入 Three.js 场景</p>
                      </div>
                    </div>
                    <h4 className="font-display-zh text-lg mb-1">模型名称</h4>
                    <p className="text-sm text-text-secondary">模型描述与细节说明</p>
                  </div>
                  <div className="card p-6 group">
                    <div className="aspect-[4/3] bg-bg-secondary border border-border mb-4 flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Box size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-xs">3D 模型占位符</p>
                        <p className="text-xs mt-1">等待导入 Three.js 场景</p>
                      </div>
                    </div>
                    <h4 className="font-display-zh text-lg mb-1">模型名称</h4>
                    <p className="text-sm text-text-secondary">模型描述与细节说明</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* UI 原型展示区域 */}
            <FadeIn delay={0.2}>
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Smartphone size={20} className="text-accent-terracotta" />
                  <h3 className="font-display-zh text-h3">UI 原型</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* 占位符：后续替换为可交互原型 */}
                  <div className="card p-0 group overflow-hidden">
                    <div className="aspect-[9/16] md:aspect-[3/4] bg-bg-secondary border-b border-border flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Smartphone size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-xs">可交互原型占位符</p>
                        <p className="text-xs mt-1">等待导入交互式 APP 原型</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display-zh text-lg mb-1">原型名称</h4>
                      <p className="text-sm text-text-secondary mb-3">
                        高保真交互原型，支持页面跳转与操作反馈
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>查看原型</span>
                        <ArrowRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="card p-0 group overflow-hidden">
                    <div className="aspect-[9/16] md:aspect-[3/4] bg-bg-secondary border-b border-border flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Smartphone size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-xs">可交互原型占位符</p>
                        <p className="text-xs mt-1">等待导入交互式 APP 原型</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display-zh text-lg mb-1">原型名称</h4>
                      <p className="text-sm text-text-secondary mb-3">
                        高保真交互原型，支持页面跳转与操作反馈
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <span>查看原型</span>
                        <ArrowRight
                          size={12}
                          className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Portfolio;