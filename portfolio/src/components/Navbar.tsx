import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const NAV_ITEMS = [
  { to: '/', label: '首页' },
  { to: '/works', label: '作品' },
  { to: '/about', label: '关于' },
  { to: '/contact', label: '联系' },
];

export default function Navbar() {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 路由切换时关闭抽屉并回到顶部
  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-line/70 bg-white/80 shadow-[0_1px_12px_rgba(17,24,39,0.05)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-site flex h-16 items-center justify-between md:h-[72px]">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-ink transition-colors duration-200 hover:text-accent"
        >
          {content.site.logoText}
        </Link>

        {/* 桌面导航 */}
        <nav className="hidden items-center gap-9 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="ml-2 inline-flex h-10 items-center rounded-btn bg-ink px-5 text-sm font-medium text-white transition-all duration-200 hover:bg-accent active:scale-[0.97]"
          >
            联系我
          </Link>
        </nav>

        {/* 移动端汉堡 */}
        <button
          aria-label="打开菜单"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-btn transition-colors hover:bg-black/5 md:hidden"
        >
          <span
            className={`h-[2px] w-5 rounded bg-ink transition-all duration-200 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span className={`h-[2px] w-5 rounded bg-ink transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span
            className={`h-[2px] w-5 rounded bg-ink transition-all duration-200 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {/* 移动端抽屉 */}
      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-site flex flex-col gap-1 pb-6 pt-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `rounded-btn px-4 py-3 text-[15px] font-medium transition-colors duration-200 ${
                  isActive ? 'bg-accent-soft text-accent' : 'text-sub hover:bg-black/5 hover:text-ink'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
