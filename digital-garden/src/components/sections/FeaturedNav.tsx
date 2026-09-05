import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';
import TiltCard from '@/components/effects/TiltCard';
import FadeIn from '@/components/effects/FadeIn';

const navItems = [
  {
    path: '/ui',
    en: 'SELECTED WORKS',
    zh: '作品',
    description: '精选的 UI/UX 设计项目，从概念到落地的完整过程。',
    color: 'var(--accent-terracotta)',
  },
  {
    path: '/notes',
    en: 'LEARNING GARDEN',
    zh: '笔记',
    description: '设计思考、学习笔记与项目复盘，持续生长的知识花园。',
    color: 'var(--accent-sage)',
  },
  {
    path: '/interests',
    en: 'LIFE & INTERESTS',
    zh: '兴趣',
    description: '电影、音乐、书籍、旅行，设计师的生活策展。',
    color: 'var(--accent-lavender)',
  },
  {
    path: '/about',
    en: 'ABOUT ME',
    zh: '关于',
    description: '我的故事、设计理念与职业旅程。',
    color: 'var(--accent-clay)',
  },
];

const FeaturedNav = () => {
  return (
    <section className="py-section px-container bg-bg-secondary/30">
      <div className="max-w-container mx-auto">
        <SectionTitle en="EXPLORE" zh="探索花园" align="center" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {navItems.map((item, index) => (
            <FadeIn key={item.path} delay={index * 0.1}>
              <TiltCard>
                <Link
                  to={item.path}
                  className="card block p-8 md:p-10 h-full group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <span
                      className="font-display-en text-xs"
                      style={{ color: item.color }}
                    >
                      {item.en}
                    </span>
                    <ArrowUpRight
                      size={20}
                      className="text-text-muted group-hover:text-text-primary transition-colors"
                    />
                  </div>
                  <h3 className="font-display-zh text-h3 mb-3">{item.zh}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {item.description}
                  </p>
                </Link>
              </TiltCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNav;
