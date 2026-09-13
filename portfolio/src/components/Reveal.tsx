import { createElement, useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** 延迟毫秒，用于同组元素错峰出现 */
  delay?: number;
  as?: string;
  style?: CSSProperties;
}

/** 单个元素的滚动淡入封装（只触发一次） */
export default function Reveal({ children, className = '', delay = 0, as: Tag = 'div', style }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('is-visible');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    Tag,
    {
      ref,
      className: `reveal ${className}`,
      style: { transitionDelay: delay ? `${delay}ms` : undefined, ...style },
    },
    children,
  );
}
