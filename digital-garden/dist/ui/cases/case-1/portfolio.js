/* ═══════════ Mood Garden 作品集页 · 交互 ═══════════ */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ── 植物 SVG（与原型同一套插画体系） ── */
function plantSVG(type){
  const S='stroke="#3D7A66" stroke-width="4" stroke-linecap="round" fill="none"';
  const leaf=(x,y,rot,c='#5BA68A')=>`<path d="M${x} ${y}c0-9-7-13-16-12 1 9 7 13 16 12z" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`;
  const leafR=(x,y,rot,c='#7FBFA0')=>`<path d="M${x} ${y}c0-9 7-13 16-12-1 9-7 13-16 12z" fill="${c}" transform="rotate(${rot} ${x} ${y})"/>`;
  switch(type){
    case 'happy':{let p='';for(let i=0;i<12;i++)p+=`<ellipse cx="50" cy="22" rx="5.5" ry="12" fill="#FBBF24" transform="rotate(${i*30} 50 40)"/>`;
      return `<svg viewBox="0 0 100 112"><path d="M50 110V58" ${S}/>${leaf(50,82,-8)}${leafR(50,74,8)}<g>${p}</g><circle cx="50" cy="40" r="12" fill="#8D5A2B"/><g fill="#6B4420"><circle cx="46" cy="37" r="1.5"/><circle cx="54" cy="37" r="1.5"/><circle cx="50" cy="43" r="1.5"/><circle cx="46" cy="44" r="1.5"/><circle cx="54" cy="44" r="1.5"/></g></svg>`}
    case 'energy':{let p='';const pos=[[50,28],[38,34],[62,34],[42,46],[58,46],[50,40],[34,42],[66,42]];
      pos.forEach(([x,y],i)=>p+=`<circle cx="${x}" cy="${y}" r="${i===5?9:7.5}" fill="${i%2?'#F97316':'#FB923C'}"/>`);
      return `<svg viewBox="0 0 100 112"><path d="M50 110V52" ${S}/>${leaf(50,80,-6)}${leafR(50,70,10)}<g>${p}</g><circle cx="50" cy="38" r="5" fill="#C2410C"/></svg>`}
    case 'calm':{let p='';for(let i=0;i<8;i++)p+=`<ellipse cx="50" cy="40" rx="7" ry="17" fill="${i%2?'#F8E1F4':'#FFFFFF'}" stroke="#EBC8E4" stroke-width="1" transform="rotate(${i*45} 50 56)"/>`;
      return `<svg viewBox="0 0 100 112"><ellipse cx="30" cy="104" rx="24" ry="6" fill="#BFE3F6" opacity=".8"/><ellipse cx="74" cy="107" rx="20" ry="5" fill="#BFE3F6" opacity=".6"/><ellipse cx="24" cy="99" rx="12" ry="4" fill="#5BA68A"/><ellipse cx="80" cy="102" rx="10" ry="3.6" fill="#7FBFA0"/><g>${p}</g><circle cx="50" cy="56" r="6" fill="#FFE9A8"/></svg>`}
    case 'focus':{let p='';for(let i=0;i<5;i++){p+=`<circle cx="${43+(i%2)*2}" cy="${52-i*8}" r="4.6" fill="#A78BFA"/><circle cx="${57-(i%2)*2}" cy="${48-i*8}" r="4.6" fill="#8B6FE0"/>`}
      return `<svg viewBox="0 0 100 112"><path d="M50 110V56" ${S}/><g>${p}</g><circle cx="50" cy="16" r="4.6" fill="#C4B5FD"/></svg>`}
    case 'anxious':{let p='';for(let i=0;i<4;i++){const y=58-i*11;p+=`<path d="M50 ${y}q-14-2-20-12" stroke="#A8A29E" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M50 ${y}q14-2 20-12" stroke="#A8A29E" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="29" cy="${y-13}" rx="5" ry="3" fill="#C0BDB8" transform="rotate(-30 29 ${y-13})"/><ellipse cx="71" cy="${y-13}" rx="5" ry="3" fill="#C0BDB8" transform="rotate(30 71 ${y-13})"/>`}
      return `<svg viewBox="0 0 100 112"><path d="M50 110V56" stroke="#8F8B85" stroke-width="4" stroke-linecap="round" fill="none"/><g>${p}</g><circle cx="50" cy="24" r="5" fill="#D6D3D1"/></svg>`}
    case 'sad':{let p='';const cs=[[50,30],[40,36],[60,36],[44,24],[56,24],[50,42],[36,28],[64,28]];
      cs.forEach(([x,y],i)=>p+=`<circle cx="${x}" cy="${y}" r="7.6" fill="${i%2?'#93C5FD':'#7FB2F0'}"/>`);
      return `<svg viewBox="0 0 100 112"><path d="M50 110V66q0-18 2-24" ${S}/>${leaf(50,86,-14,'#7FBFA0')}<g transform="rotate(10 50 34)">${p}</g><path d="M32 58c2 3.4 2 6 0 6.8-2 .8-4-1.2-4-3.6 0-1.4 1.6-2.6 4-3.2z" fill="#93C5FD"/><path d="M70 62c2 3.4 2 6 0 6.8-2 .8-4-1.2-4-3.6 0-1.4 1.6-2.6 4-3.2z" fill="#93C5FD"/></svg>`}
    case 'angry':
      return `<svg viewBox="0 0 100 112"><rect x="41" y="34" width="18" height="76" rx="9" fill="#F28B82"/><rect x="24" y="52" width="13" height="30" rx="6.5" fill="#F6A19A"/><rect x="63" y="46" width="13" height="34" rx="6.5" fill="#F6A19A"/><g stroke="#FCA5A5" stroke-width="2" stroke-linecap="round"><path d="M50 42v5M50 56v5M50 70v5M50 84v5M45 48l-3 3M55 62l3 3M45 76l-3 3"/></g><circle cx="50" cy="30" r="6" fill="#FCA5A5"/><circle cx="50" cy="28" r="2.4" fill="#FFE9A8"/></svg>`;
    case 'tired':
      return `<svg viewBox="0 0 100 112"><path d="M50 110V70" stroke="#8A8A6D" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M50 72q-22-2-30 16 20 6 30-16z" fill="#A3A380"/><path d="M50 64q22-4 32 12-18 8-32-12z" fill="#B5B592"/><path d="M50 56q-14-14-6-30 12 10 6 30z" fill="#A3A380"/><path d="M50 52q12-16 26-14-6 16-26 14z" fill="#B5B592" opacity=".85"/></svg>`;
    case 'sprout':
      return `<svg viewBox="0 0 100 112"><path d="M50 110V70" ${S}/><path d="M50 76c0-14-11-20-26-19 2 14 12 21 26 19z" fill="#5BA68A"/><path d="M50 66c0-14 11-20 26-19-2 14-12 21-26 19z" fill="#7FBFA0"/></svg>`;
    case 'rainbow':
      return `<svg viewBox="0 0 100 112"><path d="M50 110V58" ${S}/>${leaf(50,82,-8)}<g><circle cx="38" cy="38" r="8" fill="#FCA5A5"/><circle cx="62" cy="38" r="8" fill="#FBBF24"/><circle cx="50" cy="26" r="8" fill="#93C5FD"/><circle cx="50" cy="48" r="8" fill="#A78BFA"/><circle cx="50" cy="38" r="7" fill="#fff"/></g></svg>`;
  }
  return plantSVG('sprout');
}

/* ── Hero 场景植物 ── */
$('#heroPlants').innerHTML=['calm','happy','focus','energy','sad'].map((t,i)=>
  `<div class="hp" style="width:${[64,92,72,68,60][i]}px">${plantSVG(t)}</div>`).join('');

/* ── IA 信息架构 ── */
const IA=[
  ['花园',['时间天空','今日植物','状态仪表盘','近期动态','好友动态']],
  ['记录',['情绪轮盘','强度/混合','语音转写','触发标签','AI 反馈','生成植物']],
  ['洞察',['情绪天气','趋势/分布','触发分析','关键词云','周期洞察','健康联动']],
  ['发现',['急救工具箱','冥想音频','专题活动','社区花园','植物图鉴','主题商店']],
  ['我的',['个人主页','徽章墙','会员','好友','提醒设置','数据隐私']],
];
$('#iaTree').innerHTML=`<div class="ia-level"><span class="ia-root">Mood Garden</span></div>
  <div class="ia-branches">${IA.map(([t,leaves])=>`
    <div class="ia-branch"><span class="ia-tab">${t}</span>
      ${leaves.map(l=>`<span class="ia-leaf">${l}</span>`).join('')}</div>`).join('')}
  </div>`;

/* ── 核心任务流程 ── */
const FLOW=[
  ['打开 App','中央呼吸按钮','#E8F5E9','<path d="M12 20V9" stroke="#3D7A66" stroke-width="2" stroke-linecap="round"/><path d="M12 11c0-4-3-6.4-7.5-6 .7 4 3.7 6.4 7.5 6z" fill="#5BA68A"/><path d="M12 8.5C12 4.5 15 2.1 19.5 2.5c-.7 4-3.7 6.4-7.5 6z" fill="#7FBFA0"/>'],
  ['选择情绪','轮盘 6 选 1','#FEF9C3','<circle cx="12" cy="12" r="8" fill="#FBBF24"/><circle cx="9.5" cy="10.5" r="1.1" fill="#292524"/><circle cx="14.5" cy="10.5" r="1.1" fill="#292524"/><path d="M9 14.5c1 1.3 2 1.9 3 1.9s2-.6 3-1.9" stroke="#292524" stroke-width="1.4" fill="none" stroke-linecap="round"/>'],
  ['强度 + 语音','滑块 / 按住说话','#E3F2FD','<rect x="9.5" y="4" width="5" height="9" rx="2.5" fill="#7DD3FC"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V20" stroke="#7DD3FC" stroke-width="1.8" fill="none" stroke-linecap="round"/>'],
  ['AI 反馈','肯定/安抚/建议','#F3E8FF','<circle cx="12" cy="12" r="8.5" fill="none" stroke="#A78BFA" stroke-width="2"/><path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="#A78BFA" stroke-width="2" fill="none" stroke-linecap="round"/>'],
  ['生成植物','生长动画','#E8F5E9','<path d="M12 20v-8" stroke="#3D7A66" stroke-width="2" stroke-linecap="round"/><path d="M12 13c0-3.5-2.6-5.3-6.5-5 .6 3.5 3 5.3 6.5 5z" fill="#5BA68A"/><path d="M12 11.5c0-3.5 2.6-5.3 6.5-5-.6 3.5-3 5.3-6.5 5z" fill="#7FBFA0"/>'],
  ['种入花园','正反馈循环','#FFF3E0','<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-4.3-3.8-6.6-5.2-9.8-.9 1.7-1.3 3.1-1.1 4.9-1-.5-1.9-1.5-2.3-2.8C8 8.6 5.5 10.9 5.5 14.8c0 3.6 2.6 6.2 6.5 6.2z" fill="#F97316"/>'],
];
$('#flowSteps').innerHTML=FLOW.map(([b,s,bg,svg])=>`
  <div class="flow-step"><div class="flow-ic" style="background:${bg}"><svg viewBox="0 0 24 24" width="26" height="26">${svg}</svg></div>
  <b>${b}</b><span>${s}</span></div>`).join('');

/* ── 养成循环图 ── */
const LOOP=[
  ['记录情绪','1 分钟/天','<circle cx="12" cy="12" r="8" fill="#FBBF24"/><circle cx="9.5" cy="10.5" r="1.1" fill="#292524"/><circle cx="14.5" cy="10.5" r="1.1" fill="#292524"/><path d="M9 14.5c1 1.3 2 1.9 3 1.9s2-.6 3-1.9" stroke="#292524" stroke-width="1.4" fill="none" stroke-linecap="round"/>'],
  ['植物生长','破土→开花','<path d="M12 20v-8" stroke="#3D7A66" stroke-width="2" stroke-linecap="round"/><path d="M12 13c0-3.5-2.6-5.3-6.5-5 .6 3.5 3 5.3 6.5 5z" fill="#5BA68A"/><path d="M12 11.5c0-3.5 2.6-5.3 6.5-5-.6 3.5-3 5.3-6.5 5z" fill="#7FBFA0"/>'],
  ['花园繁荣','视觉资产累积','<path d="M7 20h10M8 20l-1-5h10l-1 5M12 15v-5" stroke="#3D7A66" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M12 11c0-3-2.2-4.6-5.5-4.2C7 9.6 9.2 11.2 12 11z" fill="#5BA68A"/><path d="M12 9.6C12 6.6 14.2 5 17.5 5.4 17 8.2 14.8 9.8 12 9.6z" fill="#7FBFA0"/>'],
  ['情感回报','成就/陪伴感','<path d="M12 20s-6.5-4-8.2-7.8A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.2 5.2C18.5 16 12 20 12 20z" fill="#FCA5A5"/>'],
  ['再次记录','习惯形成','<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="#5BA68A" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18 3.5v3.5h-3.5M6 20.5V17h3.5" stroke="#5BA68A" stroke-width="2.2" fill="none" stroke-linecap="round"/>'],
];
$('#loopFlow').innerHTML=LOOP.map(([b,s,svg],i)=>`
  ${i?'<span class="loop-arrow">→</span>':''}
  <div class="loop-node"><i><svg viewBox="0 0 24 24" width="30" height="30">${svg}</svg></i><b>${b}</b><span>${s}</span></div>`).join('')
  +`<div class="loop-return">↩ 断记植物枯萎 → 浇水可拯救 → 回流而非流失</div>`;

/* ── 色彩系统 ── */
const COLORS=[
  ['品牌主色','#5BA68A'],['品牌浅','#E8F5E9'],['品牌深','#3D7A66'],['能量','#F97316'],
  ['快乐','#FBBF24'],['平静','#7DD3FC'],['专注','#A78BFA'],['焦虑','#A8A29E'],
  ['悲伤','#93C5FD'],['愤怒','#FCA5A5'],['背景','#FAF9F6'],['卡片','#FFFFFF'],
  ['主文字','#292524'],['次要文字','#78716C'],['辅助文字','#A8A29E'],['分割线','#E7E5E4'],
];
$('#colorGrid').innerHTML=COLORS.map(([n,c])=>`
  <div class="swatch" title="点击复制 ${c}"><i style="background:${c};${c==='#FFFFFF'||c==='#FAF9F6'?'border-bottom:1px solid #E7E5E4':''}"></i>
  <div><b>${n}</b><span>${c}</span></div></div>`).join('');
$('#colorGrid').addEventListener('click',e=>{
  const s=e.target.closest('.swatch');if(!s)return;
  const hex=s.querySelector('span').textContent;
  navigator.clipboard?.writeText(hex).catch(()=>{});
  const b=s.querySelector('b'),old=b.textContent;
  b.textContent='已复制 ✓';setTimeout(()=>b.textContent=old,900);
});

/* ── 间距阶梯 ── */
$('#spaceRow').innerHTML=[4,8,12,16,20,24,32,48].map(v=>
  `<i style="width:${v}px;height:${v}px" title="${v}px"></i>`).join('');

/* ── 图标体系 ── */
const ICONS=[
  ['花园','<path d="M7 21h10M8 21l-1-6h10l-1 6M12 15V8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M12 9c0-3.4-2.6-5.4-6.5-5 .5 3.4 3 5.4 6.5 5z" fill="currentColor"/><path d="M12 7.5C12 4.1 14.6 2.1 18.5 2.5c-.5 3.4-3 5.4-6.5 5z" fill="currentColor" opacity=".7"/>'],
  ['记录','<path d="M12 20V9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/><path d="M12 11c0-4-3-6.4-7.5-6 .7 4 3.7 6.4 7.5 6z" fill="currentColor" opacity=".85"/><path d="M12 8.5C12 4.5 15 2.1 19.5 2.5c-.7 4-3.7 6.4-7.5 6z" fill="currentColor"/>'],
  ['洞察','<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="currentColor"/>'],
  ['发现','<path d="M12 3c1.8 0 3 1.4 3 3 1.6 0 3 1.2 3 3 0 1.5-1 2.7-2.4 3 .6.3 1.1.9 1.4 1.6.4 1.2-.2 2.5-1.4 3-.5.2-1 .2-1.6 0V21h-4v-4.4c-.5.2-1 .2-1.6 0-1.2-.5-1.8-1.8-1.4-3 .3-.7.8-1.3 1.4-1.6C5 11.7 4 10.5 4 9c0-1.8 1.4-3 3-3 0-1.6 1.2-3 3-3h2z" fill="currentColor"/>'],
  ['我的','<circle cx="12" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.9"/><path d="M5 20c.8-3.8 3.6-5.6 7-5.6s6.2 1.8 7 5.6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'],
  ['浇水','<path d="M12 21c-3.9 0-6.5-2.7-6.5-6.2C5.5 10 9.5 5.5 12 3c2.5 2.5 6.5 7 6.5 11.8 0 3.5-2.6 6.2-6.5 6.2z" fill="currentColor"/>'],
  ['连击','<path d="M12 22c4.4 0 7.5-3 7.5-7.2 0-5-4.4-7.6-6-11.3-1 2-1.5 3.6-1.3 5.7-1.2-.6-2.2-1.7-2.7-3.2C7.3 8 4.5 10.6 4.5 14.8 4.5 19 7.6 22 12 22z" fill="currentColor"/>'],
  ['冥想','<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>'],
  ['睡眠','<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" fill="currentColor"/>'],
  ['语音','<rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'],
  ['徽章','<path d="M12 3l2.5 5.2 5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4 5.7-.8z" fill="currentColor"/>'],
  ['主题','<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor"/>'],
];
$('#iconGrid').innerHTML=ICONS.map(([n,svg])=>`
  <div class="icon-cell"><svg viewBox="0 0 24 24" width="26" height="26" style="color:var(--brand-deep)">${svg}</svg><span>${n}</span></div>`).join('');

/* ── 植物图鉴画廊 ── */
const PLANTS=[['happy','快乐 · 向日葵'],['calm','平静 · 睡莲'],['focus','专注 · 薰衣草'],['anxious','焦虑 · 含羞草'],['sad','悲伤 · 蓝绣球'],['angry','愤怒 · 红仙人掌'],['tired','疲惫 · 绿萝'],['energy','能量 · 金盏花'],['rainbow','稀有 · 彩虹花']];
$('#plantGallery').innerHTML=PLANTS.map(([t,n])=>`<div class="plant-cell">${plantSVG(t)}<span>${n}</span></div>`).join('');

/* ── Dark Mode 植物 ── */
$('#darkPlants').innerHTML=['happy','calm','focus'].map(t=>plantSVG(t)).join('');

/* ── 空态插画 ── */
$('#stateEmpty').innerHTML=`<svg viewBox="0 0 100 80" width="76" height="62">
  <ellipse cx="50" cy="70" rx="42" ry="8" fill="#E8F5E9"/>
  <path d="M50 66c0-10-1-16-1-22" stroke="#A8A29E" stroke-width="2.4" stroke-dasharray="3 4" fill="none" stroke-linecap="round"/>
  <path d="M50 46c-6 0-9 3.4-9 7.4s3 6.6 9 6.6 9-2.6 9-6.6-3-7.4-9-7.4z" fill="#D8C6A8"/>
  <path d="M50 46c1.6-3.4 5-5.4 8.6-5.4" stroke="#A8A29E" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="76" cy="22" r="9" fill="#FFE9A8" opacity=".8"/>
</svg>`;

/* ── 演示开关 ── */
$$('[data-demo-switch]').forEach(s=>s.addEventListener('click',()=>s.classList.toggle('on')));

/* ── 滚动入场 ── */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));

/* ── 数字动画 ── */
const cio=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;cio.unobserve(e.target);
  const el=e.target,target=parseFloat(el.dataset.count),dec=String(el.dataset.count).includes('.');
  const t0=performance.now(),dur=1400;
  (function tick(t){
    const p=Math.min(1,(t-t0)/dur),ease=1-Math.pow(1-p,3);
    el.textContent=dec?(target*ease).toFixed(1):Math.round(target*ease);
    if(p<1)requestAnimationFrame(tick);
  })(t0);
}),{threshold:.5});
$$('.count').forEach(el=>cio.observe(el));

/* ── iframe 懒加载 ── */
const fio=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){const f=e.target;if(f.dataset.src){f.src=f.dataset.src;f.removeAttribute('data-src')}fio.unobserve(f)}
}),{rootMargin:'400px'});
$$('iframe[data-src]').forEach(f=>fio.observe(f));

/* ── 导航状态 ── */
const nav=$('#nav'),toTop=$('#toTop'),footerEl=$('.footer');
let footerVisible=false;
addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',scrollY>20);
  toTop.classList.toggle('show',scrollY>700&&!footerVisible);
},{passive:true});
new IntersectionObserver(es=>es.forEach(e=>{
  footerVisible=e.isIntersecting;
  if(footerVisible)toTop.classList.remove('show');
}),{threshold:.05}).observe(footerEl);
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

/* 导航高亮 */
const secs=$$('section.sec, header.hero');
const nio=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting)return;
    const id=e.target.id;
    $$('#navLinks a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));
  });
},{rootMargin:'-40% 0px -55% 0px'});
secs.forEach(s=>s.id&&nio.observe(s));
