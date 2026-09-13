import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Field, SectionCard, TextArea, TextInput } from '../components/admin/fields';
import { useContent } from '../context/ContentContext';
import {
  exportContent,
  getAdminPassword,
  importContent,
  isAuthed,
  setAdminPassword,
  setAuthed,
  uid,
} from '../lib/contentStore';
import type { Project, ProjectCategory, SiteContent } from '../types';

const CATEGORIES: ProjectCategory[] = ['APP 设计', '小程序', '设计系统', '动效'];
const TABS = ['站点与 Hero', '首页', '作品管理', '关于', '联系', '数据与口令'] as const;
type Tab = (typeof TABS)[number];

export default function Admin() {
  const { content, update, reset } = useContent();
  const [authed, setAuthedState] = useState(isAuthed());
  const [tab, setTab] = useState<Tab>('站点与 Hero');
  const [draft, setDraft] = useState<SiteContent>(content);
  const [saved, setSaved] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(content.projects[0]?.id ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(
    () => draft.projects.find((p) => p.id === selectedId) ?? draft.projects[0],
    [draft.projects, selectedId],
  );

  const patch = (fn: (d: SiteContent) => SiteContent) => {
    setDraft((d) => fn(structuredClone(d)));
    setSaved(false);
  };

  const save = () => {
    update(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  /* ---------- 登录门禁 ---------- */
  if (!authed) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6 pt-24">
        <form
          className="card w-full max-w-sm p-8"
          onSubmit={(e) => {
            e.preventDefault();
            const pwd = String(new FormData(e.currentTarget).get('pwd') || '');
            if (pwd === getAdminPassword()) {
              setAuthed(true);
              setAuthedState(true);
            } else {
              alert('口令不正确');
            }
          }}
        >
          <h1 className="text-xl font-extrabold tracking-tight">管理后台</h1>
          <p className="mt-2 text-sm text-sub">
            请输入管理口令。初始口令为 <code className="rounded bg-[#f3f4f6] px-1.5 py-0.5 text-xs">admin123</code>，登录后可在「数据与口令」中修改。
          </p>
          <input
            name="pwd"
            type="password"
            className="input mt-6"
            placeholder="管理口令"
            autoFocus
          />
          <button type="submit" className="btn-primary mt-4 w-full">
            登录
          </button>
          <Link
            to="/"
            className="mt-4 block text-center text-sm text-muted transition-colors hover:text-accent"
          >
            返回首页
          </Link>
        </form>
      </section>
    );
  }

  /* ---------- 后台主界面 ---------- */
  return (
    <section className="section-gap pt-32 md:pt-36">
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">ADMIN</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">内容管理</h1>
            <p className="mt-1 text-sm text-muted">
              修改保存在当前浏览器 localStorage 中，可在「数据与口令」导出 JSON 备份。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn-secondary h-10 px-5 text-sm">
              预览站点
            </Link>
            <button onClick={save} className="btn-primary h-10 px-6 text-sm">
              {saved ? '✓ 已保存' : '保存修改'}
            </button>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="mt-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-9 rounded-full px-4 text-sm font-medium transition-all duration-200 ${
                tab === t ? 'bg-accent text-white' : 'bg-[#eef0f3] text-sub hover:bg-line hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-8">
          {/* ============ 站点与 Hero ============ */}
          {tab === '站点与 Hero' && (
            <>
              <SectionCard title="站点信息">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Logo 文字">
                    <TextInput value={draft.site.logoText} onChange={(v) => patch((d) => ((d.site.logoText = v), d))} />
                  </Field>
                  <Field label="页脚文字">
                    <TextInput value={draft.site.footerText} onChange={(v) => patch((d) => ((d.site.footerText = v), d))} />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="首页 Hero" desc="主标题支持换行（直接回车即可）。">
                <Field label="顶部英文小标签">
                  <TextInput value={draft.hero.eyebrow} onChange={(v) => patch((d) => ((d.hero.eyebrow = v), d))} />
                </Field>
                <Field label="主标题">
                  <TextArea rows={2} value={draft.hero.title} onChange={(v) => patch((d) => ((d.hero.title = v), d))} />
                </Field>
                <Field label="副标题">
                  <TextArea rows={2} value={draft.hero.subtitle} onChange={(v) => patch((d) => ((d.hero.subtitle = v), d))} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="主按钮文字">
                    <TextInput value={draft.hero.ctaPrimary} onChange={(v) => patch((d) => ((d.hero.ctaPrimary = v), d))} />
                  </Field>
                  <Field label="次按钮文字">
                    <TextInput value={draft.hero.ctaSecondary} onChange={(v) => patch((d) => ((d.hero.ctaSecondary = v), d))} />
                  </Field>
                </div>
              </SectionCard>

              <SectionCard title="首页轮播图" desc="每张包含图片 URL、标题与副标题。">
                {draft.hero.slides.map((slide, i) => (
                  <div key={slide.id} className="rounded-btn border border-line p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">第 {i + 1} 张</p>
                      <button
                        className="text-sm text-danger hover:underline"
                        onClick={() => patch((d) => ((d.hero.slides = d.hero.slides.filter((s) => s.id !== slide.id)), d))}
                      >
                        删除
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <Field label="图片 URL">
                        <TextInput value={slide.image} onChange={(v) => patch((d) => ((d.hero.slides[i].image = v), d))} />
                      </Field>
                      <Field label="跳转链接">
                        <TextInput
                          value={slide.link}
                          placeholder="/cases/case-1/index.html"
                          onChange={(v) => patch((d) => ((d.hero.slides[i].link = v), d))}
                        />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="标题">
                          <TextInput value={slide.title} onChange={(v) => patch((d) => ((d.hero.slides[i].title = v), d))} />
                        </Field>
                        <Field label="副标题">
                          <TextInput value={slide.subtitle} onChange={(v) => patch((d) => ((d.hero.slides[i].subtitle = v), d))} />
                        </Field>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  className="btn-secondary h-10 px-5 text-sm"
                  onClick={() =>
                    patch((d) => (
                      (d.hero.slides = [...d.hero.slides, { id: uid(), image: '', title: '新轮播', subtitle: '', link: '' }]),
                      d
                    ))
                  }
                >
                  + 添加轮播图
                </button>
              </SectionCard>
            </>
          )}

          {/* ============ 首页 ============ */}
          {tab === '首页' && (
            <SectionCard title="首页文案">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="精选区英文小标签">
                  <TextInput value={draft.home.featuredEyebrow} onChange={(v) => patch((d) => ((d.home.featuredEyebrow = v), d))} />
                </Field>
                <Field label="精选区标题">
                  <TextInput value={draft.home.featuredTitle} onChange={(v) => patch((d) => ((d.home.featuredTitle = v), d))} />
                </Field>
              </div>
              <Field label="精选区说明">
                <TextInput value={draft.home.featuredDesc} onChange={(v) => patch((d) => ((d.home.featuredDesc = v), d))} />
              </Field>
              <Field label="介绍区标题">
                <TextInput value={draft.home.introTitle} onChange={(v) => patch((d) => ((d.home.introTitle = v), d))} />
              </Field>
              <Field label="介绍区正文">
                <TextArea rows={4} value={draft.home.introText} onChange={(v) => patch((d) => ((d.home.introText = v), d))} />
              </Field>
              <Field label="介绍区按钮文字">
                <TextInput value={draft.home.introCta} onChange={(v) => patch((d) => ((d.home.introCta = v), d))} />
              </Field>
            </SectionCard>
          )}

          {/* ============ 作品管理 ============ */}
          {tab === '作品管理' && (
            <>
              <SectionCard title="作品列表页文案">
                <Field label="页面标题">
                  <TextInput value={draft.worksPage.title} onChange={(v) => patch((d) => ((d.worksPage.title = v), d))} />
                </Field>
                <Field label="页面说明">
                  <TextInput value={draft.worksPage.description} onChange={(v) => patch((d) => ((d.worksPage.description = v), d))} />
                </Field>
              </SectionCard>

              <SectionCard
                title="作品"
                desc="「详情页链接」填你为该项目单独制作好的页面地址，点击卡片即跳转；留空则进入站内概要页。"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {draft.projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`h-9 rounded-full px-4 text-sm font-medium transition-all duration-200 ${
                        selected?.id === p.id ? 'bg-accent text-white' : 'bg-[#eef0f3] text-sub hover:bg-line'
                      }`}
                    >
                      {p.title}
                    </button>
                  ))}
                  <button
                    className="h-9 rounded-full border border-dashed border-line px-4 text-sm text-sub transition-colors hover:border-accent hover:text-accent"
                    onClick={() => {
                      const p: Project = {
                        id: uid(),
                        title: '新作品',
                        subtitle: '',
                        category: 'APP 设计',
                        year: String(new Date().getFullYear()),
                        tags: [],
                        description: '',
                        cover: '',
                        link: '',
                        featured: false,
                      };
                      patch((d) => ((d.projects = [...d.projects, p]), d));
                      setSelectedId(p.id);
                    }}
                  >
                    + 新增作品
                  </button>
                </div>

                {selected && (
                  <div className="rounded-btn border border-line p-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="作品名称">
                        <TextInput
                          value={selected.title}
                          onChange={(v) => patch((d) => ((d.projects[d.projects.findIndex((p) => p.id === selected.id)].title = v), d))}
                        />
                      </Field>
                      <Field label="一句话副标题">
                        <TextInput
                          value={selected.subtitle}
                          onChange={(v) => patch((d) => ((d.projects[d.projects.findIndex((p) => p.id === selected.id)].subtitle = v), d))}
                        />
                      </Field>
                      <Field label="分类">
                        <select
                          className="input"
                          value={selected.category}
                          onChange={(e) =>
                            patch((d) => (
                              (d.projects[d.projects.findIndex((p) => p.id === selected.id)].category = e.target
                                .value as ProjectCategory),
                              d
                            ))
                          }
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="年份">
                        <TextInput
                          value={selected.year}
                          onChange={(v) => patch((d) => ((d.projects[d.projects.findIndex((p) => p.id === selected.id)].year = v), d))}
                        />
                      </Field>
                    </div>
                    <div className="mt-5 grid gap-5">
                      <Field label="标签（用逗号分隔）">
                        <TextInput
                          value={selected.tags.join('，')}
                          onChange={(v) =>
                            patch((d) => (
                              (d.projects[d.projects.findIndex((p) => p.id === selected.id)].tags = v
                                .split(/[,，]/)
                                .map((s) => s.trim())
                                .filter(Boolean)),
                              d
                            ))
                          }
                        />
                      </Field>
                      <Field label="项目描述">
                        <TextArea
                          rows={3}
                          value={selected.description}
                          onChange={(v) => patch((d) => ((d.projects[d.projects.findIndex((p) => p.id === selected.id)].description = v), d))}
                        />
                      </Field>
                      <Field label="封面图 URL">
                        <TextInput
                          value={selected.cover}
                          onChange={(v) => patch((d) => ((d.projects[d.projects.findIndex((p) => p.id === selected.id)].cover = v), d))}
                        />
                      </Field>
                      <Field label="详情页链接（外部页面，留空则用站内概要页）">
                        <TextInput
                          value={selected.link}
                          placeholder="https://…"
                          onChange={(v) => patch((d) => ((d.projects[d.projects.findIndex((p) => p.id === selected.id)].link = v), d))}
                        />
                      </Field>
                      <label className="flex items-center gap-3 text-sm font-medium">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-accent"
                          checked={selected.featured}
                          onChange={(e) =>
                            patch((d) => (
                              (d.projects[d.projects.findIndex((p) => p.id === selected.id)].featured = e.target.checked),
                              d
                            ))
                          }
                        />
                        在首页「精选案例」中展示
                      </label>
                      <div>
                        <button
                          className="text-sm text-danger hover:underline"
                          onClick={() => {
                            if (!confirm(`确定删除「${selected.title}」吗？`)) return;
                            patch((d) => ((d.projects = d.projects.filter((p) => p.id !== selected.id)), d));
                            setSelectedId('');
                          }}
                        >
                          删除该作品
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </SectionCard>
            </>
          )}

          {/* ============ 关于 ============ */}
          {tab === '关于' && (
            <>
              <SectionCard title="个人信息">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="姓名">
                    <TextInput value={draft.about.name} onChange={(v) => patch((d) => ((d.about.name = v), d))} />
                  </Field>
                  <Field label="头衔">
                    <TextInput value={draft.about.role} onChange={(v) => patch((d) => ((d.about.role = v), d))} />
                  </Field>
                </div>
                <Field label="头像 URL">
                  <TextInput value={draft.about.avatar} onChange={(v) => patch((d) => ((d.about.avatar = v), d))} />
                </Field>
                <Field label="个人介绍（每段一行）">
                  <TextArea
                    rows={5}
                    value={draft.about.bio.join('\n')}
                    onChange={(v) => patch((d) => ((d.about.bio = v.split('\n').filter((s) => s.trim())), d))}
                  />
                </Field>
                <Field label="技能标签（用逗号分隔）">
                  <TextInput
                    value={draft.about.skills.join('，')}
                    onChange={(v) =>
                      patch((d) => ((d.about.skills = v.split(/[,，]/).map((s) => s.trim()).filter(Boolean)), d))
                    }
                  />
                </Field>
              </SectionCard>

              <SectionCard title="经历时间轴">
                {draft.about.timeline.map((item, i) => (
                  <div key={item.id} className="rounded-btn border border-line p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{item.period || `第 ${i + 1} 段`}</p>
                      <button
                        className="text-sm text-danger hover:underline"
                        onClick={() => patch((d) => ((d.about.timeline = d.about.timeline.filter((t) => t.id !== item.id)), d))}
                      >
                        删除
                      </button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field label="时间段">
                        <TextInput value={item.period} onChange={(v) => patch((d) => ((d.about.timeline[i].period = v), d))} />
                      </Field>
                      <Field label="标题">
                        <TextInput value={item.title} onChange={(v) => patch((d) => ((d.about.timeline[i].title = v), d))} />
                      </Field>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <Field label="公司 / 学校">
                        <TextInput value={item.org} onChange={(v) => patch((d) => ((d.about.timeline[i].org = v), d))} />
                      </Field>
                      <Field label="描述">
                        <TextArea rows={2} value={item.description} onChange={(v) => patch((d) => ((d.about.timeline[i].description = v), d))} />
                      </Field>
                    </div>
                  </div>
                ))}
                <button
                  className="btn-secondary h-10 px-5 text-sm"
                  onClick={() =>
                    patch((d) => (
                      (d.about.timeline = [...d.about.timeline, { id: uid(), period: '', title: '', org: '', description: '' }]),
                      d
                    ))
                  }
                >
                  + 添加经历
                </button>
              </SectionCard>
            </>
          )}

          {/* ============ 联系 ============ */}
          {tab === '联系' && (
            <SectionCard title="联系方式">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="页面标题">
                  <TextInput value={draft.contact.title} onChange={(v) => patch((d) => ((d.contact.title = v), d))} />
                </Field>
                <Field label="页面说明">
                  <TextInput value={draft.contact.description} onChange={(v) => patch((d) => ((d.contact.description = v), d))} />
                </Field>
                <Field label="邮箱">
                  <TextInput value={draft.contact.email} onChange={(v) => patch((d) => ((d.contact.email = v), d))} />
                </Field>
                <Field label="微信号">
                  <TextInput value={draft.contact.wechat} onChange={(v) => patch((d) => ((d.contact.wechat = v), d))} />
                </Field>
              </div>
              <Field label="社交媒体">
                <div className="space-y-3">
                  {draft.contact.socials.map((s, i) => (
                    <div key={s.id} className="flex flex-wrap items-center gap-3">
                      <input
                        className="input h-10 w-32"
                        value={s.label}
                        placeholder="名称"
                        onChange={(e) => patch((d) => ((d.contact.socials[i].label = e.target.value), d))}
                      />
                      <input
                        className="input h-10 min-w-0 flex-1"
                        value={s.url}
                        placeholder="https://…"
                        onChange={(e) => patch((d) => ((d.contact.socials[i].url = e.target.value), d))}
                      />
                      <button
                        className="text-sm text-danger hover:underline"
                        onClick={() => patch((d) => ((d.contact.socials = d.contact.socials.filter((x) => x.id !== s.id)), d))}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn-secondary h-9 px-4 text-sm"
                    onClick={() => patch((d) => ((d.contact.socials = [...d.contact.socials, { id: uid(), label: '', url: '' }]), d))}
                  >
                    + 添加链接
                  </button>
                </div>
              </Field>
            </SectionCard>
          )}

          {/* ============ 数据与口令 ============ */}
          {tab === '数据与口令' && (
            <>
              <SectionCard title="数据备份" desc="所有内容以 JSON 存储在当前浏览器中，迁移或换设备时请先导出。">
                <div className="flex flex-wrap gap-3">
                  <button
                    className="btn-secondary h-10 px-5 text-sm"
                    onClick={() => {
                      const blob = new Blob([exportContent()], { type: 'application/json' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = 'portfolio-content.json';
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                  >
                    导出 JSON
                  </button>
                  <button className="btn-secondary h-10 px-5 text-sm" onClick={() => fileRef.current?.click()}>
                    导入 JSON
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      file.text().then((text) => {
                        try {
                          const next = importContent(text);
                          setDraft(next);
                          update(next);
                          alert('导入成功');
                        } catch {
                          alert('导入失败：JSON 格式不正确');
                        }
                      });
                      e.target.value = '';
                    }}
                  />
                  <button
                    className="h-10 rounded-btn border border-danger/30 px-5 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
                    onClick={() => {
                      if (!confirm('确定恢复默认内容吗？你当前的修改会丢失（可先导出备份）。')) return;
                      reset();
                      setDraft(structuredClone(content));
                      window.location.reload();
                    }}
                  >
                    恢复默认
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="修改管理口令">
                <form
                  className="flex max-w-sm flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const pwd = String(new FormData(e.currentTarget).get('pwd') || '');
                    if (pwd.length < 6) {
                      alert('口令至少 6 位');
                      return;
                    }
                    setAdminPassword(pwd);
                    alert('口令已更新');
                    e.currentTarget.reset();
                  }}
                >
                  <input name="pwd" type="password" className="input" placeholder="新口令（至少 6 位）" />
                  <button type="submit" className="btn-primary h-10 px-5 text-sm">
                    更新口令
                  </button>
                </form>
              </SectionCard>

              <SectionCard title="退出登录">
                <button
                  className="btn-secondary h-10 px-5 text-sm"
                  onClick={() => {
                    setAuthed(false);
                    setAuthedState(false);
                  }}
                >
                  退出管理后台
                </button>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
