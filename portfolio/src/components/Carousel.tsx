import { useCallback, useEffect, useRef, useState } from 'react';
import type { HeroSlide } from '../types';

interface CarouselProps {
  slides: HeroSlide[];
  interval?: number;
}

/** 首页精选轮播：自动播放 + 手动切换 + 指示器 */
export default function Carousel({ slides, interval = 4500 }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const timer = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count],
  );

  const start = useCallback(() => {
    if (timer.current) window.clearInterval(timer.current);
    if (count > 1) timer.current = window.setInterval(() => go(index + 1), interval);
  }, [count, go, index, interval]);

  useEffect(() => {
    start();
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [start]);

  if (!count) return null;

  return (
    <div
      className="group relative overflow-hidden rounded-card border border-line bg-white shadow-card"
      onMouseEnter={() => timer.current && window.clearInterval(timer.current)}
      onMouseLeave={start}
    >
      <div
        className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const isFirst = i === 0;
          const slideInner = (
            <>
              <img
                src={slide.image}
                alt={slide.title}
                loading={isFirst ? 'eager' : 'lazy'}
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  {slide.subtitle}
                </p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {slide.title}
                </h3>
              </div>
            </>
          );
          return (
            <div key={slide.id} className="relative aspect-[16/9] w-full shrink-0 md:aspect-[21/9]">
              {slide.link ? (
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full w-full cursor-pointer"
                >
                  {slideInner}
                </a>
              ) : (
                slideInner
              )}
            </div>
          );
        })}
      </div>

      {/* 左右切换 */}
      {count > 1 && (
        <>
          <button
            aria-label="上一张"
            onClick={() => go(index - 1)}
            className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink opacity-0 shadow-card backdrop-blur transition-all duration-200 hover:bg-white group-hover:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            aria-label="下一张"
            onClick={() => go(index + 1)}
            className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-ink opacity-0 shadow-card backdrop-blur transition-all duration-200 hover:bg-white group-hover:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </>
      )}

      {/* 指示器 */}
      {count > 1 && (
        <div className="absolute bottom-5 right-6 flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`切换到第 ${i + 1} 张`}
              onClick={() => go(i)}
              className={`dot ${i === index ? 'is-active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
