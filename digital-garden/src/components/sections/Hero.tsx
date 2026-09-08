import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import { siteData } from '@/data/site';
import { staggerContainer, staggerItem } from '@/utils/animations';

const slides = [
  { src: 'images/hero-1_1.jpg', label: 'MONO 01' },
  { src: 'images/hero-2_1.jpg', label: 'MONO 02' },
  { src: 'images/hero-3_1.jpg', label: 'MONO 03' },
];

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [typedText, setTypedText] = useState('');
  const fullText = '用界面讲述故事，在数字空间里持续生长。';
  const [typeIndex, setTypeIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['3deg', '-3deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-3deg', '3deg']);
  const translateX = useTransform(springX, [-0.5, 0.5], ['-10px', '10px']);
  const translateY = useTransform(springY, [-0.5, 0.5], ['-10px', '10px']);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    return () => container?.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (typeIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + fullText[typeIndex]);
        setTypeIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    }
  }, [typeIndex]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center px-container pt-24 pb-16 overflow-hidden noise"
    >
      {/* 流体背景 */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="max-w-container mx-auto w-full relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Text Content */}
          <motion.div style={{ y: y1, opacity }} className="lg:col-span-5 space-y-8">
            <motion.div variants={staggerItem}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles size={16} className="text-accent-terracotta" />
                <span className="font-display-zh text-sm text-text-muted tracking-widest">
                  数字花园
                </span>
              </div>
              <motion.h1
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="hero-title-en leading-none"
              >
                Digital
                <br />
                Garden
              </motion.h1>
            </motion.div>

            <motion.p
              variants={staggerItem}
              className="text-h3 font-display-zh text-text-secondary"
            >
              Wang Ying · UI/UX 设计师 · 在上海记录设计与生活
            </motion.p>

            <motion.p
              variants={staggerItem}
              className="text-body text-text-secondary max-w-xl leading-relaxed min-h-[3.5rem]"
            >
              {typedText}
              <span className="inline-block w-0.5 h-5 bg-accent-terracotta ml-1 animate-pulse" />
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-4 pt-4">
              <MagneticButton>
                <a
                  href="https://ui-design-d5guvqrft29296773-1465022720.tcloudbaseapp.com/garden/#/ui"
                  className="magnetic-btn inline-flex items-center gap-2"
                >
                  <span>浏览作品</span>
                  <ArrowRight size={16} />
                </a>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Right: Image carousel with decorative elements */}
          <motion.div
            style={{ y: y2, opacity }}
            variants={staggerItem}
            className="lg:col-span-7 relative lg:pl-12"
          >
            <motion.div
              style={{ x: translateX, y: translateY }}
              className="relative"
            >
              <div className="img-container aspect-[4/3] w-full max-w-3xl mx-auto lg:ml-auto lg:mr-0 relative z-10 overflow-hidden">
                {slides.map((slide, i) => (
                  <motion.img
                    key={slide.src}
                    src={slide.src}
                    alt={slide.label}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={i === 0 ? 'eager' : 'lazy'}
                    initial={false}
                    animate={{ opacity: i === slideIndex ? 1 : 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}
              </div>

              {/* 装饰元素 */}
              <div className="absolute -bottom-6 -right-6 w-28 h-28 border border-accent-terracotta/30 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm z-20">
                <span className="font-display-en text-xs text-accent-terracotta">
                  {slides[slideIndex].label}
                </span>
              </div>

              {/* 轮播指示点 */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlideIndex(i)}
                    className={`h-1 transition-all duration-300 ${
                      i === slideIndex ? 'w-6 bg-text-primary' : 'w-2 bg-border-strong'
                    }`}
                    aria-label={`切换到第 ${i + 1} 张`}
                  />
                ))}
              </div>

              <div className="absolute -top-4 -left-4 w-16 h-16 border border-accent-lavender/30 rotate-12 z-0" />
              <div className="absolute top-1/2 -right-8 w-20 h-20 border border-accent-sage/30 z-0" />
            </motion.div>
          </motion.div>
        </motion.div>


      </div>
    </section>
  );
};

export default Hero;
