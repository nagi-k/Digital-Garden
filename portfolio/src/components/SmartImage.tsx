import { useState, type ImgHTMLAttributes } from 'react';

interface SmartImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

/** 懒加载 + 模糊渐变淡入的图片 */
export default function SmartImage({ wrapperClassName = '', className = '', ...rest }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`overflow-hidden bg-[#eef0f3] ${wrapperClassName}`}>
      <img
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`img-fade ${loaded ? 'is-loaded' : ''} ${className}`}
        {...rest}
      />
    </div>
  );
}
