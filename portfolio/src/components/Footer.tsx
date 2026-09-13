import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function Footer() {
  const { content } = useContent();
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-site flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-lg font-extrabold tracking-tight">{content.site.logoText}</p>
          <p className="mt-1 text-sm text-muted">{content.site.footerText}</p>
        </div>
        <nav className="flex items-center gap-7 text-sm text-sub">
          <Link className="transition-colors duration-200 hover:text-accent" to="/works">
            作品
          </Link>
          <Link className="transition-colors duration-200 hover:text-accent" to="/about">
            关于
          </Link>
          <Link className="transition-colors duration-200 hover:text-accent" to="/contact">
            联系
          </Link>
          <Link className="text-muted transition-colors duration-200 hover:text-accent" to="/admin">
            管理
          </Link>
        </nav>
      </div>
    </footer>
  );
}
