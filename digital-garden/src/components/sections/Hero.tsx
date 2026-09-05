import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';
import { siteData } from '@/data/site';
import { staggerContainer, staggerItem } from '@/utils/animations';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(springY, [-0.5, 0.5], ['2deg', '-2deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-2deg', '2deg']);

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

  return (
    <section
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-container pt-24 pb-16"
    >
      <div className="max-w-container mx-auto w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
        >
          {/* Left: Text Content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={staggerItem}>
              <span className="font-display-en text-sm text-text-muted block mb-4">
                DIGITAL GARDEN
              </span>
              <motion.h1
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="font-display-zh text-hero-zh leading-tight"
              >
                数字花园
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
              className="text-body text-text-secondary max-w-xl leading-relaxed"
            >
              {siteData.bioLong}
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-4 pt-4">
              <MagneticButton>
                <a
                  href="/ui"
                  className="magnetic-btn inline-flex items-center gap-2"
                >
                  <span>浏览作品</span>
                  <ArrowRight size={16} />
                </a>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="/notes"
                  className="magnetic-btn inline-flex items-center gap-2"
                >
                  <span>阅读笔记</span>
                </a>
              </MagneticButton>
            </motion.div>
          </div>

          {/* Right: Portrait */}
          <motion.div variants={staggerItem} className="lg:col-span-5">
            <div className="relative">
              <div className="img-container aspect-[3/4] max-w-sm mx-auto lg:ml-auto">
                <img
                  src="/images/portrait.jpg"
                  alt="王颖"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-border rounded-full flex items-center justify-center bg-bg-primary">
                <span className="font-display-en text-xs text-text-muted">EST. 2026</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted"
        >
          <span className="text-xs font-display-en">SCROLL</span>
          <ArrowDown size={16} className="animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
