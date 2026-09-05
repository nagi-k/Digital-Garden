import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Sprout, TreePine, Leaf } from 'lucide-react';
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
    borderColor: 'border-accent-sage',
  },
  growing: {
    icon: Leaf,
    label: '成长中',
    color: 'var(--accent-terracotta)',
    borderColor: 'border-accent-terracotta',
  },
  mature: {
    icon: TreePine,
    label: '成熟',
    color: 'var(--accent-clay)',
    borderColor: 'border-accent-clay',
  },
};

const Notes = () => {
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredNotes = activeTag
    ? notes.filter((n) => n.tags.includes(activeTag))
    : notes;

  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto">
          <SectionTitle en="LEARNING GARDEN" zh="学习记录">
            <p className="text-text-secondary">
              这里是我沉淀设计思考、记录创作过程的自留地。笔记不是完成品，而是持续生长的想法。
            </p>
          </SectionTitle>

          {/* Tags Filter */}
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2 mb-12">
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
                      className={`card p-8 h-full border-l-2 ${status.borderColor}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            size={16}
                            style={{ color: status.color }}
                          />
                          <span
                            className="text-xs"
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

                      <h3 className="font-display-zh text-xl mb-3 group-hover:text-accent-terracotta transition-colors">
                        {note.title}
                      </h3>

                      <p className="text-text-secondary text-sm mb-6 line-clamp-2">
                        {note.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-text-muted"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-text-muted">
                          {note.date}
                        </span>
                      </div>
                    </article>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Notes;
