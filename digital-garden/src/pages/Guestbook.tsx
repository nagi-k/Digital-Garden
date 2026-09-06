import { useState } from 'react';
import { Send } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import SectionTitle from '@/components/ui/SectionTitle';
import FadeIn from '@/components/effects/FadeIn';

interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  date: string;
  color: string;
  rotate: number;
}

const initialEntries: GuestbookEntry[] = [
  {
    id: 1,
    name: '设计同路人',
    message: '网站做得很有感觉！特别是首页的留白和字体搭配，学习了。',
    date: '2026-08-20',
    color: 'var(--accent-sage)',
    rotate: -2,
  },
  {
    id: 2,
    name: 'Alice',
    message: 'Love your digital garden concept! The bilingual approach is so elegant.',
    date: '2026-08-15',
    color: 'var(--accent-lavender)',
    rotate: 1,
  },
  {
    id: 3,
    name: '老白',
    message: '从作品集过来的，梦屿那个项目做得真不错，期待更多分享。',
    date: '2026-07-30',
    color: 'var(--accent-terracotta)',
    rotate: -1,
  },
];

const Guestbook = () => {
  const [entries, setEntries] = useState(initialEntries);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const colors = ['var(--accent-sage)', 'var(--accent-lavender)', 'var(--accent-terracotta)', 'var(--accent-clay)'];
    const newEntry: GuestbookEntry = {
      id: entries.length + 1,
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      color: colors[entries.length % colors.length],
      rotate: Math.random() * 4 - 2,
    };

    setEntries([newEntry, ...entries]);
    setName('');
    setMessage('');
  };

  return (
    <PageTransition>
      <section className="pt-32 pb-section px-container">
        <div className="max-w-container mx-auto">
          <SectionTitle en="GUESTBOOK" zh="访客留言">
            <p className="text-text-secondary">
              谢谢你来到这里。如果愿意，可以留下一句话，成为这个花园的一部分。
            </p>
          </SectionTitle>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form */}
            <FadeIn className="lg:col-span-4">
              <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary mb-2">你的名字</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded bg-transparent focus:outline-none focus:border-accent-terracotta transition-colors"
                    placeholder="怎么称呼你？"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary mb-2">留言</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded bg-transparent focus:outline-none focus:border-accent-terracotta transition-colors resize-none"
                    placeholder="想说点什么..."
                  />
                </div>
                <button
                  type="submit"
                  className="magnetic-btn w-full inline-flex items-center justify-center gap-2"
                >
                  <span>留下足迹</span>
                  <Send size={14} />
                </button>
              </form>
            </FadeIn>

            {/* Entries Wall */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entries.map((entry, index) => (
                  <FadeIn key={entry.id} delay={index * 0.1}>
                    <article
                      className="p-6 bg-bg-card border border-border  shadow-soft"
                      style={{
                        transform: `rotate(${entry.rotate}deg)`,
                        borderLeft: `3px solid ${entry.color}`,
                      }}
                    >
                      <p className="text-text-secondary mb-4 leading-relaxed">
                        {entry.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-display-zh font-medium">{entry.name}</span>
                        <span className="text-xs text-text-muted">{entry.date}</span>
                      </div>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Guestbook;
