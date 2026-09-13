import { useState, type FormEvent } from 'react';
import Reveal from '../components/Reveal';
import { useContent } from '../context/ContentContext';

export default function Contact() {
  const { content } = useContent();
  const { contact } = content;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!name || !email || !message) {
      setError('请完整填写姓名、邮箱和留言内容。');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('邮箱格式看起来不太对，请检查一下。');
      return;
    }
    setError('');
    // 静态站点无后端：通过 mailto 打开邮件客户端，正文预填留言
    const subject = encodeURIComponent(`来自作品集的留言 · ${name}`);
    const body = encodeURIComponent(`${message}\n\n—— ${name}（${email}）`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section className="section-gap pt-36 md:pt-44">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">CONTACT</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
            {contact.title}
          </h1>
          <p className="mt-4 max-w-xl text-sub">{contact.description}</p>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.1fr]">
          {/* 联系方式 */}
          <Reveal delay={80}>
            <div className="space-y-4">
              <a
                href={`mailto:${contact.email}`}
                className="card group flex items-center gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-accent-soft text-accent transition-colors duration-200 group-hover:bg-accent group-hover:text-white">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs text-muted">邮箱</span>
                  <span className="block font-medium transition-colors group-hover:text-accent">
                    {contact.email}
                  </span>
                </span>
              </a>
              <div className="card flex items-center gap-4 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-btn bg-accent-soft text-accent">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                  </svg>
                </span>
                <span>
                  <span className="block text-xs text-muted">微信</span>
                  <span className="block font-medium">{contact.wechat}</span>
                </span>
              </div>
              <div className="card p-6">
                <p className="text-xs text-muted">社交媒体</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {contact.socials.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-medium text-sub transition-all duration-200 hover:border-accent hover:text-accent"
                    >
                      {s.label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M7 17L17 7M9 7h8v8" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* 联系表单 */}
          <Reveal delay={160}>
            <form onSubmit={onSubmit} className="card p-7 md:p-8" noValidate>
              <h2 className="text-lg font-bold tracking-tight">给我留言</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">姓名</span>
                  <input name="name" className="input" placeholder="怎么称呼你" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">邮箱</span>
                  <span className="block">
                    <input name="email" type="email" className="input" placeholder="you@example.com" />
                  </span>
                </label>
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-medium">留言</span>
                <textarea name="message" className="textarea" placeholder="想聊点什么…" />
              </label>
              {error && <p className="mt-3 text-sm text-danger">{error}</p>}
              {sent && (
                <p className="mt-3 text-sm text-success">
                  已为你打开邮件客户端，发送后我会尽快回复。
                </p>
              )}
              <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
                发送留言
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
