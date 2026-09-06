import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import FadeIn from '@/components/effects/FadeIn';
import { notes } from '@/data/notes';

const NoteDetail = () => {
  const { slug } = useParams();
  const note = notes.find((n) => n.slug === slug);

  if (!note) {
    return (
      <PageTransition>
        <div className="pt-32 px-container text-center">
          <h1 className="text-h2">笔记未找到</h1>
          <Link to="/notes" className="text-accent-terracotta mt-4 inline-block">
            返回学习记录
          </Link>
        </div>
      </PageTransition>
    );
  }

  const relatedNotes = notes
    .filter((n) => n.id !== note.id && n.tags.some((t) => note.tags.includes(t)))
    .slice(0, 3);

  return (
    <PageTransition>
      <article className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto max-w-3xl">
          <FadeIn>
            <Link
              to="/notes"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-8 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>返回学习记录</span>
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            <header className="mb-12">
              <h1 className="font-display-zh text-h1 mb-6">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {note.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {note.readTime} min read
                </span>
                <div className="flex gap-2">
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 border border-border ">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="prose prose-lg max-w-none mb-24">
              <div className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                {note.content}
              </div>
            </div>
          </FadeIn>

          {relatedNotes.length > 0 && (
            <FadeIn delay={0.3}>
              <div className="border-t border-border pt-12">
                <h2 className="font-display-zh text-h3 mb-8">相关笔记</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNotes.map((related) => (
                    <Link
                      key={related.id}
                      to={`/notes/${related.slug}`}
                      className="group block p-6 border border-border  hover:border-accent-terracotta transition-colors"
                    >
                      <h3 className="font-display-zh mb-2 group-hover:text-accent-terracotta transition-colors">
                        {related.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {related.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </article>
    </PageTransition>
  );
};

export default NoteDetail;
