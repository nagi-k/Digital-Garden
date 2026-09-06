import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sprout, TreePine, Leaf, Search } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import Tag from '@/components/ui/Tag';
import FadeIn from '@/components/effects/FadeIn';
import { notes } from '@/data/notes';

const statusConfig = {
  seedling: {
    icon: Sprout,
    label: '幼苗',
    color: 'var(--accent-sage)',
    bgColor: 'bg-accent-sage/10',
    borderColor: 'border-accent-sage',
  },
  growing: {
    icon: Leaf,
    label: '成长中',
    color: 'var(--accent-terracotta)',
    bgColor: 'bg-accent-terracotta/10',
    borderColor: 'border-accent-terracotta',
  },
  mature: {
    icon: TreePine,
    label: '成熟',
    color: 'var(--accent-clay)',
    bgColor: 'bg-accent-clay/10',
    borderColor: 'border-accent-clay',
  },
};

const Notes = () => {
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter((note) => {
    const matchesTag = !activeTag || note.tags.includes(activeTag);
    const matchesSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-sage/5  blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-terracotta/5  blur-3xl" />

        <div className="max-w-container mx-auto relative z-10">
          <SectionTitle en="LEARNING GARDEN" zh="学习记录">
            <p className="text-text-secondary">
              这里是我沉淀设计思考、记录创作过程的自留地。笔记不是完成品，而是持续生长的想法。
            </p>
          </SectionTitle>

          {/* Search & Filter */}
          <FadeIn delay={0.1}>
            <div className="mb-12 space-y-6">
              {/* Search */}
              <div className="relative max-w-md">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="text"
                  placeholder="搜索笔记..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-bg-card border border-border  text-sm focus:outline-none focus:border-accent-terracotta transition-colors"
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <Tag
                  label="全部"
                  active={!activeTag}
                  onClick={() => setActiveTag(null)}
                />
                {allTags.map((tag) => (
                  <Tag
                    key={tag}
                    label={tag}
                    active={activeTag === tag}
                    onClick={() => setActiveTag(tag)}
                  />
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotes.map((note, index) => {
              const status = statusConfig[note.status];
              const StatusIcon = status.icon;

              return (
                <FadeIn key={note.id} delay={index * 0.1}>
                  <Link to={`/notes/${note.slug}`} className="group block h-full">
                    <article
                      className={`card p-8 h-full border-l-4 ${status.borderColor} relative overflow-hidden`}
                    >
                      {/* 状态背景装饰 */}
                      <div
                        className={`absolute top-0 right-0 w-32 h-32  blur-2xl ${status.bgColor}`}
                      />

                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8  ${status.bgColor} flex items-center justify-center`}
                            >
                              <StatusIcon size={14} style={{ color: status.color }} />
                            </div>
                            <span
                              className="text-xs font-medium"
                              style={{ color: status.color }}
                            >
                              {status.label}
                            </span>
                          </div>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            <Clock size={12} />
                            {note.readTime} min
                          </span>
                        </div>

                        <h3 className="font-display-zh text-xl mb-3 group-hover:text-accent-terracotta transition-colors duration-300">
                          {note.title}
                        </h3>

                        <p className="text-text-secondary text-sm mb-6 line-clamp-2 leading-relaxed">
                          {note.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {note.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-text-muted hover:text-accent-terracotta transition-colors"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-text-muted flex items-center gap-1">
                            {note.date}
                            <ArrowRight
                              size={12}
                              className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                            />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </FadeIn>
              );
            })}
          </div>

          {filteredNotes.length === 0 && (
            <FadeIn>
              <div className="text-center py-24 text-text-muted">
                <p>没有找到相关笔记</p>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Notes;
