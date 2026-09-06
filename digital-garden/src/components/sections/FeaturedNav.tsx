import { Link } from 'react-router-dom';
import { ArrowUpRight, Palette, BookOpen, Heart, User } from 'lucide-react';
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
    icon: Palette,
    gradient: 'from-accent-terracotta/20 to-transparent',
  },
  {
    path: '/notes',
    en: 'LEARNING GARDEN',
    zh: '笔记',
    description: '设计思考、学习笔记与项目复盘，持续生长的知识花园。',
    color: 'var(--accent-sage)',
    icon: BookOpen,
    gradient: 'from-accent-sage/20 to-transparent',
  },
  {
    path: '/interests',
    en: 'LIFE & INTERESTS',
    zh: '兴趣',
    description: '电影、音乐、书籍、旅行，设计师的生活策展。',
    color: 'var(--accent-lavender)',
    icon: Heart,
    gradient: 'from-accent-lavender/20 to-transparent',
  },
  {
    path: '/about',
    en: 'ABOUT ME',
    zh: '关于',
    description: '我的故事、设计理念与职业旅程。',
    color: 'var(--accent-clay)',
    icon: User,
    gradient: 'from-accent-clay/20 to-transparent',
  },
];

const FeaturedNav = () => {
  return (
    <section className="py-section px-container bg-bg-secondary/30 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-lavender/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-sage/10 rounded-full blur-3xl" />

      <div className="max-w-container mx-auto relative z-10">
        <SectionTitle en="EXPLORE" zh="探索花园" align="center" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <FadeIn key={item.path} delay={index * 0.1}>
                <TiltCard>
                  <Link
                    to={item.path}
                    className="gradient-border block p-8 md:p-10 h-full group relative overflow-hidden"
                    data-cursor-text="进入"
                  >
                    {/* 内部渐变背景 */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <Icon size={18} style={{ color: item.color }} />
                          </div>
                          <span
                            className="font-display-en text-xs tracking-wider"
                            style={{ color: item.color }}
                          >
                            {item.en}
                          </span>
                        </div>
                        <ArrowUpRight
                          size={24}
                          className="text-text-muted group-hover:text-text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                        />
                      </div>

                      <h3 className="font-display-zh text-h3 mb-3 group-hover:translate-x-2 transition-transform duration-300">
                        {item.zh}
                      </h3>

                      <p className="text-text-secondary text-sm leading-relaxed group-hover:translate-x-2 transition-transform duration-300 delay-75">
                        {item.description}
                      </p>

                      {/* 底部装饰线 */}
                      <div
                        className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                        style={{ background: `linear-gradient(90deg, ${item.color}, transparent)` }}
                      />
                    </div>
                  </Link>
                </TiltCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedNav;
