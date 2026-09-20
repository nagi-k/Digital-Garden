import { ArrowUp } from 'lucide-react';
import { siteData } from '@/data/site';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-bg-secondary/50">
      <div className="max-w-container mx-auto px-container py-6 md:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="font-body-en text-sm text-text-secondary mb-2">
              {siteData.email}
            </p>
            <div className="flex gap-4">
              {siteData.social.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-accent-terracotta transition-colors link-underline"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={scrollToTop}
              className="p-2 border border-border  hover:border-accent-terracotta hover:text-accent-terracotta transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp size={16} />
            </button>
            <p className="text-xs text-text-muted">
              © 2026 Wang Ying · 数字花园
            </p>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-accent-terracotta transition-colors"
            >
              {siteData.icp}
            </a>
            <a
              href="https://beian.mps.gov.cn/#/query/webSearch?code=32010402002660"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-accent-terracotta transition-colors flex items-center gap-1"
            >
              <img
                src="/images/beian.png"
                alt="备案图标"
                className="w-4 h-4"
              />
              苏公网安备32010402002660号
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
