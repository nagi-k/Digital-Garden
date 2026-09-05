import { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '@/hooks/useMousePosition';

const Cursor = () => {
  const { x, y } = useMousePosition();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [isImageHover, setIsImageHover] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, button, [data-hover]');
      const image = target.closest('[data-cursor-text]');

      if (image) {
        setIsImageHover(true);
        setCursorText(image.getAttribute('data-cursor-text') || '查看');
      } else {
        setIsImageHover(false);
      }

      setIsHover(!!link);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, []);

  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.left = `${x}px`;
      dotRef.current.style.top = `${y}px`;
    }
    if (ringRef.current) {
      ringRef.current.style.left = `${x}px`;
      ringRef.current.style.top = `${y}px`;
    }
  }, [x, y]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div
        ref={ringRef}
        className={`cursor-ring hidden md:flex ${isHover ? 'is-hover' : ''} ${
          isImageHover ? 'is-image-hover' : ''
        }`}
      >
        {isImageHover && <span className="text-xs">{cursorText}</span>}
      </div>
    </>
  );
};

export default Cursor;
