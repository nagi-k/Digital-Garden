import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver 滚动淡入：进入视口后添加 is-visible，只触发一次。
 * 直接在容器上挂 ref，子元素带 .reveal 类即可；也可传 selector 自定义。
 */
export function useRevealContainer<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('.reveal');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return ref;
}
