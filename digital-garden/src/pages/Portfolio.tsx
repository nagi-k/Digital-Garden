import { ArrowRight, ArrowUpRight, Monitor, Box, Smartphone, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';
import GlbViewer from '@/components/3d/GlbViewer';

interface PhonePrototypeProps {
  src: string
  title: string
  desc: string
  fullHref: string
}

const PhonePrototype = ({ src, title, desc, fullHref }: PhonePrototypeProps) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      if (wrapRef.current) setScale(wrapRef.current.clientWidth / 393)
    }
    update()
    const ro = new ResizeObserver(update)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div className="card p-0 group overflow-hidden">
      <div ref={wrapRef} className="relative w-full overflow-hidden bg-[#F1EFEA] aspect-[393/852]">
        <iframe
          src={src}
          className="absolute top-0 left-0 border-0"
          width={393}
          height={852}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          title={title}
        />
      </div>
      <div className="p-5">
        <h4 className="font-display-zh text-lg mb-1">{title}</h4>
        <p className="text-sm text-text-secondary mb-3">{desc}</p>
        <a
          href={fullHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-accent-terracotta transition-colors"
        >
          <span>全屏查看原型</span>
          <ArrowUpRight
            size={12}
            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
          />
        </a>
      </div>
    </div>
  )
}

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
                  href="https://ui-design-d5guvqrft29296773-1465022720.tcloudbaseapp.com"
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
                  href="王颖-工业设计作品集.pdf"
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
                <div className="grid grid-cols-1 gap-6">
                  {/* 真实模型预览 */}
                  <div className="card p-6 group">
                    <div className="rounded-xl overflow-hidden mb-4">
                      <GlbViewer
                        glbUrl="models/2.glb"
                        aspect="video"
                        className="rounded-xl"
                      />
                    </div>
                    <h4 className="font-display-zh text-lg mb-1">模型一</h4>
                    <p className="text-sm text-text-secondary">工业设计模型展示</p>
                  </div>

                  {/* 真实模型预览 */}
                  <div className="card p-6 group">
                    <div className="rounded-xl overflow-hidden mb-4">
                      <GlbViewer
                        glbUrl="models/aircraft.glb"
                        aspect="video"
                        className="rounded-xl"
                      />
                    </div>
                    <h4 className="font-display-zh text-lg mb-1">模型二</h4>
                    <p className="text-sm text-text-secondary">产品造型与 CMF 细节</p>
                  </div>

                  {/* 占位卡位：等待更多 .glb 文件 */}
                  <div className="card p-6 group">
                    <div className="aspect-[16/9] md:aspect-[21/9] bg-bg-secondary border border-border border-dashed mb-4 flex flex-col items-center justify-center gap-3">
                      <Upload size={32} className="text-text-muted opacity-50" />
                      <div className="text-center text-text-muted">
                        <p className="text-xs">3D 查看器已就绪</p>
                        <p className="text-xs mt-1">请上传 .glb 模型文件以替换此占位</p>
                      </div>
                    </div>
                    <h4 className="font-display-zh text-lg mb-1">模型三</h4>
                    <p className="text-sm text-text-secondary">结构与人机工程验证</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 第一行：竖版手机 APP 原型 */}
                  <PhonePrototype
                    src="prototypes/mood-garden/index.html?embed=1"
                    title="Mood Garden 情绪花园"
                    desc="iOS 情绪记录与心理健康陪伴 App · 高保真交互原型"
                    fullHref="prototypes/mood-garden/index.html"
                  />

                  {/* 占位：第二个 APP 原型 */}
                  <div className="card p-0 group overflow-hidden">
                    <div className="aspect-[393/852] bg-bg-secondary border-b border-border flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Smartphone size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-xs">可交互原型占位符</p>
                        <p className="text-xs mt-1">等待导入交互式 APP 原型</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display-zh text-lg mb-1">APP 原型名称</h4>
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

                  {/* 第二行：单列横版网页原型占位符 */}
                  <div className="card p-0 group overflow-hidden md:col-span-2">
                    <div className="aspect-[16/9] bg-bg-secondary border-b border-border flex items-center justify-center">
                      <div className="text-center text-text-muted">
                        <Monitor size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="text-xs">网页原型占位符</p>
                        <p className="text-xs mt-1">等待导入可交互网页原型</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-display-zh text-lg mb-1">网页原型名称</h4>
                      <p className="text-sm text-text-secondary mb-3">
                        响应式网页交互原型，适配桌面与移动端
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