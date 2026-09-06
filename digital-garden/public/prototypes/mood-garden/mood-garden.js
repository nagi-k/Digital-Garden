/* ═══════════════ Mood Garden · 交互逻辑 ═══════════════ */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ── Toast ── */
function toast(msg){
  const wrap=$('#toastWrap');
  const t=document.createElement('div');t.className='toast';t.textContent=msg;
  wrap.appendChild(t);
  setTimeout(()=>{t.classList.add('hide');setTimeout(()=>t.remove(),350)},2300);
  while(wrap.children.length>2)wrap.firstChild.remove();
}

/* ═══════════════ 数据 ═══════════════ */
const EMOTIONS={
  happy:{name:'快乐',c:'#FBBF24',plant:'向日葵'},
  calm:{name:'平静',c:'#7DD3FC',plant:'睡莲'},
  focus:{name:'专注',c:'#A78BFA',plant:'薰衣草'},
  anxious:{name:'焦虑',c:'#A8A29E',plant:'含羞草'},
  sad:{name:'悲伤',c:'#93C5FD',plant:'蓝绣球'},
  angry:{name:'愤怒',c:'#FCA5A5',plant:'红仙人掌'},
  tired:{name:'疲惫',c:'#A3A380',plant:'绿萝'},
  energy:{name:'能量',c:'#F97316',plant:'金盏花'},
};

/* ── 表情脸 SVG ── */
function faceSVG(type,size=48){
  const c=EMOTIONS[type].c,d='#292524';
  const faces={
    happy:`<circle cx="19" cy="19" r="1.9" fill="${d}"/><circle cx="29" cy="19" r="1.9" fill="${d}"/><path d="M16 27c2.4 3 5 4.4 8 4.4s5.6-1.4 8-4.4" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    calm:`<path d="M15 19c1.4-1.6 3-1.6 4.4 0M28.6 19c1.4-1.6 3-1.6 4.4 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M19 28c1.6 1.4 3.4 2 5 2s3.4-.6 5-2" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    focus:`<circle cx="19" cy="19" r="1.9" fill="${d}"/><circle cx="29" cy="19" r="1.9" fill="${d}"/><path d="M19 28.5h10" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/>`,
    anxious:`<circle cx="19" cy="18.5" r="1.9" fill="${d}"/><circle cx="29" cy="18.5" r="1.9" fill="${d}"/><path d="M16 29c2-2 4-2 6 0s4 2 6 0 3-1.6 4-.8" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    sad:`<path d="M15 18c1.4-1.6 3-1.6 4.4 0M28.6 18c1.4-1.6 3-1.6 4.4 0" stroke="${d}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M18 30c1.8-2 4-3 6-3s4.2 1 6 3" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M33 22c1 1.6 1 3 0 3.4-1 .4-2-.8-2-2.2" fill="#fff" opacity=".9"/>`,
    angry:`<path d="M14.5 16.5l5 1.5M33.5 16.5l-5 1.5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/><circle cx="19" cy="21" r="1.8" fill="${d}"/><circle cx="29" cy="21" r="1.8" fill="${d}"/><path d="M18 30.5c2-1.6 4-2.4 6-2.4s4 .8 6 2.4" stroke="${d}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    tired:`<path d="M15 19h5M28 19h5" stroke="${d}" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="24" cy="28.5" rx="3" ry="3.6" fill="none" stroke="${d}" stroke-width="2"/>`,
    energy:`<circle cx="19" cy="18" r="2" fill="${d}"/><circle cx="29" cy="18" r="2" fill="${d}"/><path d="M15 26c2.6 4 5.6 6 9 6s6.4-2 9-6c-3 1.4-6 2-9 2s-6-.6-9-2z" fill="${d}"/>`
  };
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}"><circle cx="24" cy="24" r="22" fill="${c}"/>${faces[type]}</svg>`;
}

/* ── 植物 SVG 生成器 ── */
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
      return `<svg viewBox="0 0 100 112"><path d="M50 110V56" ${S}/><path d="M42 110V64" stroke="#3D7A66" stroke-width="3" stroke-linecap="round" fill="none"/><path d="M58 110V64" stroke="#3D7A66" stroke-width="3" stroke-linecap="round" fill="none"/><g>${p}</g><circle cx="50" cy="16" r="4.6" fill="#C4B5FD"/></svg>`}
    case 'anxious':{let p='';for(let i=0;i<4;i++){const y=58-i*11;p+=`<path d="M50 ${y}q-14-2-20-12" stroke="#A8A29E" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M50 ${y}q14-2 20-12" stroke="#A8A29E" stroke-width="2.6" fill="none" stroke-linecap="round"/><ellipse cx="29" cy="${y-13}" rx="5" ry="3" fill="#C0BDB8" transform="rotate(-30 29 ${y-13})"/><ellipse cx="71" cy="${y-13}" rx="5" ry="3" fill="#C0BDB8" transform="rotate(30 71 ${y-13})"/>`}
      return `<svg viewBox="0 0 100 112"><path d="M50 110V56" stroke="#8F8B85" stroke-width="4" stroke-linecap="round" fill="none"/><g>${p}</g><circle cx="50" cy="24" r="5" fill="#D6D3D1"/></svg>`}
    case 'sad':{let p='';const cs=[[50,30],[40,36],[60,36],[44,24],[56,24],[50,42],[36,28],[64,28]];
      cs.forEach(([x,y],i)=>p+=`<circle cx="${x}" cy="${y}" r="7.6" fill="${i%2?'#93C5FD':'#7FB2F0'}"/>`);
      return `<svg viewBox="0 0 100 112"><path d="M50 110V66q0-18 2-24" ${S}/>${leaf(50,86,-14,'#7FBFA0')}<g transform="rotate(10 50 34)">${p}</g><path d="M32 58c2 3.4 2 6 0 6.8-2 .8-4-1.2-4-3.6 0-1.4 1.6-2.6 4-3.2z" fill="#93C5FD"/><path d="M70 62c2 3.4 2 6 0 6.8-2 .8-4-1.2-4-3.6 0-1.4 1.6-2.6 4-3.2z" fill="#93C5FD"/></svg>`}
    case 'angry':{
      return `<svg viewBox="0 0 100 112"><rect x="41" y="34" width="18" height="76" rx="9" fill="#F28B82"/><rect x="24" y="52" width="13" height="30" rx="6.5" fill="#F6A19A"/><rect x="63" y="46" width="13" height="34" rx="6.5" fill="#F6A19A"/><g stroke="#FCA5A5" stroke-width="2" stroke-linecap="round"><path d="M50 42v5M50 56v5M50 70v5M50 84v5M45 48l-3 3M55 62l3 3M45 76l-3 3"/></g><circle cx="50" cy="30" r="6" fill="#FCA5A5"/><circle cx="50" cy="28" r="2.4" fill="#FFE9A8"/></svg>`}
    case 'tired':{
      return `<svg viewBox="0 0 100 112"><path d="M50 110V70" stroke="#8A8A6D" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M50 72q-22-2-30 16 20 6 30-16z" fill="#A3A380"/><path d="M50 64q22-4 32 12-18 8-32-12z" fill="#B5B592"/><path d="M50 56q-14-14-6-30 12 10 6 30z" fill="#A3A380"/><path d="M50 52q12-16 26-14-6 16-26 14z" fill="#B5B592" opacity=".85"/></svg>`}
    case 'sprout':{
      return `<svg viewBox="0 0 100 112"><path d="M50 110V70" ${S}/><path d="M50 76c0-14-11-20-26-19 2 14 12 21 26 19z" fill="#5BA68A"/><path d="M50 66c0-14 11-20 26-19-2 14-12 21-26 19z" fill="#7FBFA0"/></svg>`}
    case 'seed':{
      return `<svg viewBox="0 0 100 112"><ellipse cx="50" cy="106" rx="26" ry="5" fill="#8D6E4B" opacity=".5"/><path d="M50 96c6 0 9 4 9 8s-3 6-9 6-9-2-9-6 3-8 9-8z" fill="#A8793F"/><path d="M50 96c2-4 6-6 10-6" stroke="#8D6E4B" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`}
    case 'rainbow':{
      return `<svg viewBox="0 0 100 112"><path d="M50 110V58" ${S}/>${leaf(50,82,-8)}<g><circle cx="38" cy="38" r="8" fill="#FCA5A5"/><circle cx="62" cy="38" r="8" fill="#FBBF24"/><circle cx="50" cy="26" r="8" fill="#93C5FD"/><circle cx="50" cy="48" r="8" fill="#A78BFA"/><circle cx="50" cy="38" r="7" fill="#fff"/></g></svg>`}
  }
  return plantSVG('sprout');
}

/* ── 状态栏时间 ── */
function tickTime(){
  const d=new Date();
  $('#sbTime').textContent=`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
}
tickTime();setInterval(tickTime,20000);

/* ── 入场动效重排 ── */
function runAnims(scope){
  $$('.anim',scope).forEach((el,i)=>{
    el.style.animation='none';el.style.setProperty('--i',Math.min(i,12));
    void el.offsetWidth;el.style.animation='';
  });
}

/* ═══════════════ Onboarding ═══════════════ */
let obIdx=0;
const obSlides=$$('.ob-slide');
const dotsWrap=$('#obDots');
obSlides.forEach((_,i)=>{const d=document.createElement('i');if(i===0)d.className='on';dotsWrap.appendChild(d)});
function obGo(n){
  obIdx=Math.max(0,Math.min(n,obSlides.length-1));
  obSlides.forEach((s,i)=>s.classList.toggle('active',i===obIdx));
  $$('#obDots i').forEach((d,i)=>d.classList.toggle('on',i===obIdx));
}
$$('.ob-next').forEach(b=>b.addEventListener('click',()=>obGo(obIdx+1)));
$$('[data-skip]').forEach(b=>b.addEventListener('click',()=>enterApp()));
setTimeout(()=>{if(obIdx===0)obGo(1)},3000);

/* 目标选择 */
$('#goalGrid').addEventListener('click',e=>{
  const chip=e.target.closest('.goal-chip');if(!chip)return;
  $$('.goal-chip').forEach(c=>c.classList.remove('active'));chip.classList.add('active');
});

/* 情绪初体验 */
const obEmos=['happy','calm','focus','anxious','sad','energy'];
$('#obEmotionGrid').innerHTML=obEmos.map(t=>
  `<button class="ob-emo" data-t="${t}" style="--emo-c:${EMOTIONS[t].c}">${faceSVG(t,40)}${EMOTIONS[t].name}</button>`).join('');
$('#obEmotionGrid').addEventListener('click',e=>{
  const b=e.target.closest('.ob-emo');if(!b)return;
  $$('.ob-emo').forEach(x=>x.classList.remove('active'));b.classList.add('active');
  const t=b.dataset.t;
  $('#obFirstPlant').innerHTML=plantSVG(t);
  $('#obFirstResult').classList.add('show');
  $('#obFirstNext').disabled=false;
});

/* 进入花园 */
$('#enterGarden').addEventListener('click',enterApp);
function enterApp(){
  const name=$('#obName').value.trim()||'Alex';
  state.user=name;
  $('#greetText').textContent=`${greetWord()}，${name}`;
  $('#scr-onboard').classList.remove('active');
  $('#scr-app').classList.add('active');
  runAnims($('#page-garden'));
  toast(`欢迎来到你的花园，${name}`);
}
function greetWord(){const h=new Date().getHours();return h<6?'夜深了':h<11?'早安':h<14?'午安':h<18?'下午好':'晚上好'}

/* ═══════════════ 全局状态 ═══════════════ */
const state={
  user:'Alex',tab:'page-garden',dayOff:0,health:76,streak:12,
  selEmotion:null,mixEmotion:null,intensity:7,recording:false,recTimer:null,
};
const DAYS=[
  {off:-6,type:'calm',score:6.2},{off:-5,type:'focus',score:7.4},{off:-4,type:'anxious',score:5.8},
  {off:-3,type:'sad',score:6.9},{off:-2,type:'happy',score:8.1},{off:-1,type:'energy',score:7.6},
  {off:0,type:'happy',score:8.2},
];
function dateOf(off){const d=new Date();d.setDate(d.getDate()+off);return d}
function fmtDate(d){return `${d.getMonth()+1}月${d.getDate()}日`}
const WD=['日','一','二','三','四','五','六'];
$('#gardenDate').textContent=`${fmtDate(new Date())} 星期${WD[new Date().getDay()]}`;

/* ═══════════════ Tab 导航 ═══════════════ */
function switchTab(pageId){
  state.tab=pageId;
  $$('.tab').forEach(t=>{
    const on=t.dataset.tab===pageId;
    t.classList.toggle('active',on);
    if(on){t.classList.remove('bounce');void t.offsetWidth;t.classList.add('bounce')}
  });
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===pageId));
  const pg=$('#'+pageId);pg.scrollTop=0;runAnims(pg);
}
$$('.tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-goto]');if(g){switchTab(g.dataset.goto);return}
  const ts=e.target.closest('[data-toast]');if(ts){toast(ts.dataset.toast);return}
  const sw=e.target.closest('[data-switch]');if(sw){sw.classList.toggle('on');toast(sw.classList.contains('on')?'提醒已开启':'提醒已关闭')}
});

/* 中央记录按钮：点击进记录页，长按快速模式 */
let pressTimer=null;
const centerBtn=$('#tabCenter');
centerBtn.addEventListener('pointerdown',()=>{pressTimer=setTimeout(()=>{switchTab('page-record');quickMode(true);toast('快速记录模式 · 3 秒完成');pressTimer=null},600)});
centerBtn.addEventListener('pointerup',()=>{if(pressTimer){clearTimeout(pressTimer);pressTimer=null;quickMode(false);switchTab('page-record')}});
centerBtn.addEventListener('pointerleave',()=>{if(pressTimer){clearTimeout(pressTimer);pressTimer=null}});
function quickMode(on){$('#page-record').classList.toggle('quick',on);
  $$('#page-record .voice,#page-record .three-things,#page-record .triggers').forEach(el=>el.style.display=on?'none':'');
  $('#recordSub').textContent=on?'快速模式：只选情绪 + 强度':'此刻的你，感觉怎么样？';
}

/* ═══════════════ 花园：天空随时间变化 ═══════════════ */
function setSky(){
  const h=new Date().getHours();
  const scene=$('#scene'),sky=$('#skyLayer'),cel=$('#celestial');
  scene.classList.remove('night');
  sky.className='sky-layer';
  cel.className='celestial';
  if(h>=6&&h<10){sky.classList.add('sky-morning');cel.classList.add('sky-sun')}
  else if(h>=10&&h<16){sky.classList.add('sky-noon');cel.classList.add('sky-sun')}
  else if(h>=16&&h<19){sky.classList.add('sky-evening');cel.classList.add('sky-sun')}
  else{sky.classList.add('sky-night');cel.classList.add('sky-moon');scene.classList.add('night')}
  /* 星星 */
  const stars=$('#stars');stars.innerHTML='';
  for(let i=0;i<26;i++){const s=document.createElement('i');
    s.style.left=Math.random()*100+'%';s.style.top=Math.random()*55+'%';
    s.style.animationDelay=Math.random()*2.6+'s';stars.appendChild(s)}
}
setSky();

/* ═══════════════ 花园：植物渲染与日期切换 ═══════════════ */
function dayData(off){
  if(off>0)return{off,type:'seed',future:true};
  return DAYS.find(d=>d.off===off)||DAYS[DAYS.length-1];
}
function renderScene(){
  const d=dayData(state.dayOff);
  const tp=$('#todayPlant');
  tp.innerHTML=plantSVG(d.type);
  tp.style.width=d.type==='seed'?'80px':'118px';
  const dt=dateOf(state.dayOff);
  $('#dayTag').textContent=state.dayOff===0?`今天 · ${EMOTIONS[d.type].plant}`:
    d.future?`${fmtDate(dt)} · 待种下`:`${fmtDate(dt)} · ${EMOTIONS[d.type].plant}`;
  /* 两侧陪衬植物 */
  const others=DAYS.filter(x=>x.off!==state.dayOff);
  const picks=[others[Math.abs(state.dayOff*2+1)%others.length],others[Math.abs(state.dayOff*3+2)%others.length],others[Math.abs(state.dayOff+4)%others.length]];
  $('#scenePlants').innerHTML=picks.map(p=>`<div class="sp">${plantSVG(p.type)}</div>`).join('');
  $('#prevDay').style.opacity=state.dayOff<=-6?.25:1;
  $('#nextDay').style.opacity=state.dayOff>=2?.25:1;
}
renderScene();
$('#prevDay').addEventListener('click',()=>{if(state.dayOff>-6){state.dayOff--;renderScene()}});
$('#nextDay').addEventListener('click',()=>{if(state.dayOff<2){state.dayOff++;renderScene()}});
/* 滑动切换 */
let swX=null;
$('#scene').addEventListener('pointerdown',e=>{swX=e.clientX});
$('#scene').addEventListener('pointerup',e=>{
  if(swX===null)return;const dx=e.clientX-swX;swX=null;
  if(dx>42&&state.dayOff>-6){state.dayOff--;renderScene()}
  else if(dx<-42&&state.dayOff<2){state.dayOff++;renderScene()}
});
$('#todayPlant').addEventListener('click',()=>{
  const d=dayData(state.dayOff);
  toast(d.future?'这一天还没有植物，记得来记录哦':`${fmtDate(dateOf(state.dayOff))} · ${EMOTIONS[d.type].name} · ${EMOTIONS[d.type].plant}`);
});

/* 今日情绪卡展开 */
$('#todayCardMain').addEventListener('click',()=>$('#todayCard').classList.toggle('open'));
$('#tcEmoji').innerHTML=faceSVG('happy',48);

/* ═══════════════ 浇水 ═══════════════ */
const waterTexts=['植物喝饱水了，向你摇了摇叶子','咕噜咕噜… 健康度 +2','你的向日葵更有精神了','水滴渗进土壤，根系在道谢'];
$('#waterBtn').addEventListener('click',function(){
  this.classList.remove('watering');void this.offsetWidth;this.classList.add('watering');
  const scene=$('#scene');
  for(let i=0;i<6;i++){
    const drop=document.createElement('div');drop.className='drop';
    drop.style.left=`calc(50% + ${(Math.random()*70-35)|0}px)`;
    drop.style.top='90px';drop.style.animationDelay=(i*0.09)+'s';
    scene.appendChild(drop);setTimeout(()=>drop.remove(),1600);
  }
  setTimeout(()=>{
    const r=document.createElement('div');r.className='ripple';scene.appendChild(r);setTimeout(()=>r.remove(),950);
    const tp=$('#todayPlant');tp.classList.add('bounce','glow');
    setTimeout(()=>tp.classList.remove('bounce','glow'),1250);
  },620);
  state.health=Math.min(100,state.health+2);
  $('#healthNum').textContent=state.health;$('#healthBar').style.width=state.health+'%';
  setTimeout(()=>toast(waterTexts[(Math.random()*waterTexts.length)|0]),700);
});

/* 花瓣飘落 */
setInterval(()=>{
  if(state.tab!=='page-garden'||!$('#scr-app').classList.contains('active'))return;
  const colors=['#FBBF24','#F8E1F4','#FCA5A5','#FFFFFF'];
  const p=document.createElement('div');p.className='petal';
  const s=6+Math.random()*6;
  p.style.cssText=`left:${Math.random()*90}%;width:${s}px;height:${s}px;background:${colors[(Math.random()*4)|0]};animation-duration:${4+Math.random()*3}s`;
  $('#petals').appendChild(p);setTimeout(()=>p.remove(),7500);
},3800);

/* 近期 7 天 */
$('#weekRow').innerHTML=DAYS.map(d=>{
  const dt=dateOf(d.off);
  return `<div class="week-cell ${d.off===0?'today':''}" data-off="${d.off}">
    <div class="wp">${plantSVG(d.type)}</div><b>${d.off===0?'今天':WD[dt.getDay()]}</b><span>${fmtDate(dt)}</span></div>`;
}).join('');
$('#weekRow').addEventListener('click',e=>{
  const c=e.target.closest('.week-cell');if(!c)return;
  state.dayOff=+c.dataset.off;renderScene();
  $('#scene').scrollIntoView({behavior:'smooth',block:'center'});
});

/* 好友动态 */
const FRIENDS=[
  {name:'小满',c:'#F5A65B',t:'happy',txt:'种下了向日葵 · 2 小时前'},
  {name:'阿茶',c:'#7DD3FC',t:'calm',txt:'种下睡莲 · 4 小时前'},
  {name:'Momo',c:'#A78BFA',t:'focus',txt:'种下薰衣草 · 6 小时前'},
];
$('#friendsRow').innerHTML=FRIENDS.map((f,i)=>`
  <div class="friend-card">
    <div class="f-avatar" style="background:${f.c}">${f.name[0]}</div>
    <div class="f-info"><b>${f.name}</b><p>${f.txt}</p></div>
    <div class="f-plant">${plantSVG(f.t)}</div>
    <button class="f-water" data-i="${i}">送水</button>
  </div>`).join('');
$('#friendsRow').addEventListener('click',e=>{
  const b=e.target.closest('.f-water');if(!b||b.classList.contains('sent'))return;
  b.classList.add('sent');b.textContent='已送达';
  toast(`你给 ${FRIENDS[+b.dataset.i].name} 的植物浇了水`);
});

/* ═══════════════ 记录页：情绪轮盘 ═══════════════ */
const wheelEmos=['happy','calm','focus','anxious','sad','angry'];
const wheel=$('#wheel');
wheel.innerHTML=wheelEmos.map((t,i)=>{
  const a=(-90+i*60)*Math.PI/180,R=96;
  const x=Math.cos(a)*R,y=Math.sin(a)*R;
  return `<button class="wheel-item" data-t="${t}" style="--c:${EMOTIONS[t].c};transform:translate(${x}px,${y}px)">${faceSVG(t,30)}<span>${EMOTIONS[t].name}</span></button>`;
}).join('');
wheel.addEventListener('click',e=>{
  const item=e.target.closest('.wheel-item');if(!item)return;
  selectEmotion(item.dataset.t,item);
});
function selectEmotion(t,item){
  state.selEmotion=t;
  $$('.wheel-item').forEach(w=>w.classList.remove('selected'));
  if(item){
    item.classList.add('selected');
    /* 粒子喷发 */
    const wrap=$('#wheelWrap'),r=item.getBoundingClientRect(),wr=wrap.getBoundingClientRect();
    const cx=r.left-wr.left+r.width/2,cy=r.top-wr.top+r.height/2;
    for(let i=0;i<9;i++){
      const p=document.createElement('i');p.className='particle';
      const a=Math.random()*Math.PI*2,d=34+Math.random()*40;
      p.style.cssText=`left:${cx}px;top:${cy}px;background:${EMOTIONS[t].c};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px`;
      wrap.appendChild(p);setTimeout(()=>p.remove(),750);
    }
  }
  const c=EMOTIONS[t].c;
  const tint=$('#wheelTint');
  tint.style.background=`linear-gradient(180deg,transparent 20%,${c}33 70%,${c}55)`;
  tint.style.opacity=1;
  const wc=$('#wheelCenter');
  wc.classList.add('picked');wc.style.background=c;
  wc.innerHTML=`<span>${EMOTIONS[t].name}<br><i style="font-style:normal;font-size:10px;opacity:.85">${EMOTIONS[t].plant}</i></span>`;
  updateAIFeedback();
  $('#generateBtn').disabled=false;
  buildMixChips();
}

/* 强度滑块 */
$('#intensityRange').addEventListener('input',function(){
  state.intensity=+this.value;
  const v=$('#intensityVal');v.textContent=this.value;
  v.classList.remove('pop');void v.offsetWidth;v.classList.add('pop');
  updateAIFeedback();
});

/* 混合情绪 */
function buildMixChips(){
  const rest=Object.keys(EMOTIONS).filter(t=>t!==state.selEmotion);
  $('#mixChips').innerHTML=rest.map(t=>
    `<button class="mix-chip ${state.mixEmotion===t?'active':''}" data-t="${t}" style="--c:${EMOTIONS[t].c}">${EMOTIONS[t].name}</button>`).join('');
}
$('#mixChips').addEventListener('click',e=>{
  const c=e.target.closest('.mix-chip');if(!c)return;
  const t=c.dataset.t;
  state.mixEmotion=state.mixEmotion===t?null:t;
  $$('.mix-chip').forEach(x=>x.classList.toggle('active',x.dataset.t===state.mixEmotion));
  $('#mixHint').textContent=state.mixEmotion?
    `将生成复合植物：${EMOTIONS[state.selEmotion]?.name||''} × ${EMOTIONS[state.mixEmotion].name}，独一无二`:'';
});

/* 语音记录 */
const wave=$('#wave');
for(let i=0;i<26;i++){const b=document.createElement('i');wave.appendChild(b)}
$('#voiceBtn').addEventListener('click',function(){
  state.recording=!state.recording;
  this.classList.toggle('rec',state.recording);
  if(state.recording){
    state.recTimer=setInterval(()=>{
      $$('#wave i').forEach(b=>b.style.height=(5+Math.random()*36)+'px');
    },120);
  }else{
    clearInterval(state.recTimer);
    $$('#wave i').forEach(b=>b.style.height='6px');
    if(!$('#transcript').textContent.trim()){
      $('#transcript').textContent='今天项目评审很顺利，方案得到了认可。中午阳光很好，和同事散了步。有点累，但很充实。';
      toast('语音已转写成文字，可编辑');
    }
  }
});

/* 触发因素 */
const TRIGGERS=['工作','学习','人际关系','健康','睡眠','天气','财务','家庭','创作','运动','美食','宠物'];
$('#triggerGrid').innerHTML=TRIGGERS.map(t=>`<button class="tag">${t}</button>`).join('');
$('#triggerGrid').addEventListener('click',e=>{
  const t=e.target.closest('.tag');if(!t)return;t.classList.toggle('active');
});

/* AI 反馈 */
function updateAIFeedback(){
  const t=state.selEmotion;if(!t)return;
  const i=state.intensity;
  let face=t,title='AI 花园守护者 · 肯定',text='';
  if(['happy','energy'].includes(t)){
    text=i>=7?'今天你完成了很多事，这份能量值得被记住，也值得骄傲。':'小小的快乐也是快乐，已经替你种进花园了。';
  }else if(['anxious','sad','angry','tired'].includes(t)){
    title='AI 花园守护者 · 安抚';face=t;
    text={anxious:'听起来心里有点紧绷。焦虑像含羞草，碰一碰就卷起叶子——先深呼吸三次，好吗？',
      sad:'有点难过也没关系，蓝绣球在雨里也一样好看。给自己一点温柔吧。',
      angry:'生气是在保护你。先把这股劲儿写下来，它就已经小了一半。',
      tired:'听起来有点累，给自己放个假吧。今晚早点休息，植物也需要夜晚。'}[t];
  }else{
    title='AI 花园守护者 · 建议';
    text=t==='calm'?'这份平静很珍贵。要不要配一段 3 分钟的冥想，让它停留久一点？':'专注的你很有魅力。试试 25 分钟番茄钟，保持这份心流。';
  }
  $('#aiFace').innerHTML=faceSVG(face,40);
  $('#aiTitle').textContent=title;
  $('#aiText').textContent=text;
  const fb=$('#aiFeedback');fb.style.animation='none';void fb.offsetWidth;fb.style.animation='';
}

/* ═══════════════ 生成植物流程 ═══════════════ */
$('#generateBtn').addEventListener('click',startGrow);
function startGrow(){
  const t=state.selEmotion;if(!t)return;
  const ov=$('#growOverlay');ov.classList.add('show');
  $('#growResult').classList.remove('show');
  const seed=$('#growSeed'),plant=$('#growPlant'),txt=$('#growText');
  seed.className='grow-seed';plant.className='grow-plant';
  const stages=['种子落下…','破土而出…','抽芽展叶…','正在开花…'];
  txt.textContent=stages[0];
  requestAnimationFrame(()=>{seed.classList.add('fall')});
  setTimeout(()=>{txt.textContent=stages[1];plant.innerHTML=plantSVG('sprout');plant.classList.add('sprout')},650);
  setTimeout(()=>{txt.textContent=stages[2]},1150);
  setTimeout(()=>{txt.textContent=stages[3];plant.innerHTML=plantSVG(t);plant.classList.remove('sprout');plant.classList.add('bloom')},1650);
  setTimeout(()=>{
    $('#grPlant').innerHTML=plantSVG(t);
    const mix=state.mixEmotion?` × ${EMOTIONS[state.mixEmotion].name}`:'';
    $('#grTitle').textContent=`你的${EMOTIONS[t].plant}开花了`;
    $('#grDesc').textContent=`${EMOTIONS[t].name}${mix} · 强度 ${state.intensity}/10 · 带着${t==='sad'?'雨滴的清澈':t==='angry'?'柔和的勇气':t==='anxious'?'慢慢舒展的叶子':'阳光的味道'}`;
    $('#growResult').classList.add('show');
  },2450);
}
$('#regenPlant').addEventListener('click',()=>{$('#growResult').classList.remove('show');startGrow()});
$('#plantToGarden').addEventListener('click',()=>{
  $('#growOverlay').classList.remove('show');
  const t=state.selEmotion;
  DAYS[DAYS.length-1]={off:0,type:t,score:state.intensity};
  state.dayOff=0;renderScene();
  state.streak++;$('#streakNum').textContent=state.streak;
  const ms=$('#meStreakNum');if(ms)ms.textContent=state.streak;
  /* 更新今日卡 */
  $('#tcEmoji').innerHTML=faceSVG(t,48);
  $('#tcMood').textContent=EMOTIONS[t].name;
  $('#tcIntensity').textContent=`强度 ${state.intensity}/10`;
  $('#tcFeedback').textContent='「'+($('#transcript').textContent.trim()||'刚刚记录的情绪，已经种进花园。')+'」';
  switchTab('page-garden');
  setTimeout(()=>showAchieve('新植物入住花园',`${EMOTIONS[t].plant} · 连续记录 ${state.streak} 天`),500);
});

/* ═══════════════ 成就遮罩 ═══════════════ */
function showAchieve(title,desc){
  $('#achTitle').textContent=title;$('#achDesc').textContent=desc;
  $('#achIcon').innerHTML=`<svg viewBox="0 0 76 76" width="76" height="76"><circle cx="38" cy="38" r="34" fill="#FFF3D6"/><path d="M38 16l5.8 12 13.2 1.8-9.6 9.2 2.4 13L38 45.8 26.2 52l2.4-13-9.6-9.2L32.2 28z" fill="#FBBF24" stroke="#F59E0B" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const burst=$('#achBurst');burst.innerHTML='';
  const colors=['#FBBF24','#5BA68A','#FCA5A5','#93C5FD','#A78BFA'];
  for(let i=0;i<18;i++){
    const p=document.createElement('i');const a=Math.random()*Math.PI*2,d=60+Math.random()*90;
    p.style.cssText=`background:${colors[i%5]};--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d}px;animation-delay:${Math.random()*.2}s`;
    burst.appendChild(p);
  }
  $('#achieveOverlay').classList.add('show');
}
$('#achClose').addEventListener('click',()=>$('#achieveOverlay').classList.remove('show'));

/* ═══════════════ 呼吸练习 ═══════════════ */
let breathTimer=null;
function openBreath(title){
  $('#bmTitle').textContent=title||'478 呼吸法';
  $('#breatheModal').classList.add('show');
  const ring=$('#bmRing'),core=$('#bmCore')||$('.bm-core'),txt=$('#bmText');
  ring.style.animation='none';core.style.animation='none';txt.style.animation='none';
  const phases=[{t:'吸气',d:4000,s:1.06},{t:'屏息',d:7000,s:1.06},{t:'呼气',d:8000,s:.82}];
  let pi=0;
  function runPhase(){
    const p=phases[pi%phases.length];
    [ring,core].forEach(el=>{el.style.transition=`transform ${p.d}ms ease-in-out`;el.style.transform=`scale(${p.s})`});
    txt.style.transition='opacity .5s';txt.style.opacity=0;
    setTimeout(()=>{txt.textContent=p.t;txt.style.opacity=1},250);
    breathTimer=setTimeout(()=>{pi++;runPhase()},p.d);
  }
  runPhase();
}
function closeBreath(){
  clearTimeout(breathTimer);breathTimer=null;
  $('#breatheModal').classList.remove('show');
  toast('练习完成 · 花园守护者为你点赞');
}
$('#breathBtn').addEventListener('click',()=>openBreath('自然呼吸'));
$('#toolBreath').addEventListener('click',()=>openBreath('478 呼吸法'));
$('#bmClose').addEventListener('click',closeBreath);
$('#bmDone').addEventListener('click',closeBreath);

/* ═══════════════ 洞察页 ═══════════════ */
$('#segment').addEventListener('click',e=>{
  const s=e.target.closest('.seg');if(!s)return;
  $$('.seg').forEach(x=>x.classList.remove('active'));s.classList.add('active');
  const seg=s.dataset.seg;
  const conf={周:['本周情绪天气 · 多云转晴','优于上周','前半周有些阴郁，周四开始放晴。你的花园正在恢复生机。'],
    月:['本月情绪天气 · 晴间多云','优于上月','整体阳光充足，只有一次短暂雷阵雨。花园枝繁叶茂。'],
    季:['本季情绪天气 · 春暖花开','显著提升','从冬末的低垂到春天的舒展，你的花园完成了一次换季。'],
    年:['年度情绪天气 · 四季分明','值得纪念','经历过雨季也拥抱过晴天，这座花园记录了完整的你。']}[seg];
  $('#wcTitle').textContent=conf[0];$('#wcBadge').textContent=conf[1];$('#wcDesc').textContent=conf[2];
  toast(`已切换到「${seg}」维度`);
});
/* 天气插画 */
$('#wcIllu').innerHTML=`<svg viewBox="0 0 353 150" preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%">
  <defs><linearGradient id="wcSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B8D9F0"/><stop offset="100%" stop-color="#EAF6FD"/></linearGradient></defs>
  <rect width="353" height="150" fill="url(#wcSky)"/>
  <circle cx="286" cy="40" r="22" fill="#FFE9A8"/><circle cx="286" cy="40" r="30" fill="#FFE9A8" opacity=".3"/>
  <g fill="#fff" opacity=".95"><ellipse cx="90" cy="52" rx="34" ry="14"/><ellipse cx="116" cy="44" rx="24" ry="11"/><ellipse cx="200" cy="80" rx="28" ry="12" opacity=".8"/></g>
  <ellipse cx="176" cy="160" rx="230" ry="46" fill="#BFE3C8"/>
  <g class="ob-hero-plant"><path d="M150 150V118" stroke="#3D7A66" stroke-width="3.5" stroke-linecap="round"/><circle cx="150" cy="110" r="9" fill="#FBBF24"/><circle cx="150" cy="110" r="4.5" fill="#8D5A2B"/></g>
  <g class="ob-hero-plant" style="animation-delay:.3s"><path d="M196 152V124" stroke="#3D7A66" stroke-width="3.5" stroke-linecap="round"/><g fill="#A78BFA"><circle cx="192" cy="116" r="5"/><circle cx="200" cy="116" r="5"/><circle cx="196" cy="109" r="5"/></g></g>
</svg>`;

/* 趋势图 */
function drawTrend(){
  const wrap=$('#trendWrap');
  const W=340,H=150,pad=26;
  const scores=DAYS.map(d=>d.score);
  const xs=i=>pad+i*(W-pad*2)/(scores.length-1);
  const ys=v=>H-22-(v-4)/(10-4)*(H-52);
  let line='',area='';
  scores.forEach((v,i)=>{const x=xs(i),y=ys(v);line+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';});
  area=line+`L${xs(scores.length-1)} ${H-22} L${xs(0)} ${H-22} Z`;
  const maxI=scores.indexOf(Math.max(...scores)),minI=scores.indexOf(Math.min(...scores));
  wrap.innerHTML=`<svg viewBox="0 0 ${W} ${H}" style="width:100%">
    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5BA68A" stop-opacity=".32"/><stop offset="100%" stop-color="#5BA68A" stop-opacity="0"/></linearGradient></defs>
    ${[4,6,8,10].map(v=>`<line x1="${pad}" x2="${W-pad}" y1="${ys(v)}" y2="${ys(v)}" stroke="#E7E5E4" stroke-dasharray="3 5"/><text x="4" y="${ys(v)+4}" font-size="9" fill="#A8A29E">${v}</text>`).join('')}
    <path d="${area}" fill="url(#tg)"/>
    <path d="${line}" fill="none" stroke="#5BA68A" stroke-width="3" stroke-linecap="round"/>
    ${scores.map((v,i)=>`<circle class="trend-node" data-i="${i}" cx="${xs(i)}" cy="${ys(v)}" r="5" fill="#fff" stroke="#5BA68A" stroke-width="3"/>`).join('')}
    <text x="${xs(maxI)}" y="${ys(scores[maxI])-13}" font-size="9.5" font-weight="700" fill="#3D7A66" text-anchor="middle">最高 ${scores[maxI]}</text>
    <text x="${xs(minI)}" y="${ys(scores[minI])+20}" font-size="9.5" font-weight="700" fill="#A8A29E" text-anchor="middle">最低 ${scores[minI]}</text>
    ${DAYS.map((d,i)=>`<text x="${xs(i)}" y="${H-6}" font-size="9" fill="#A8A29E" text-anchor="middle">${WD[dateOf(d.off).getDay()]}</text>`).join('')}
  </svg>`;
  $$('.trend-node',wrap).forEach(n=>n.addEventListener('click',()=>{
    $$('.trend-tip',wrap).forEach(t=>t.remove());
    const i=+n.dataset.i,d=DAYS[i];
    const tip=document.createElement('div');tip.className='trend-tip';
    const r=n.getBoundingClientRect(),wr=wrap.getBoundingClientRect();
    tip.style.left=(r.left-wr.left+r.width/2)+'px';
    tip.style.top=(r.top-wr.top)+'px';
    tip.innerHTML=`<div class="tp">${plantSVG(d.type)}</div><div><b>${fmtDate(dateOf(d.off))} · ${EMOTIONS[d.type].name}</b><span>指数 ${d.score} · ${EMOTIONS[d.type].plant}</span></div>`;
    wrap.appendChild(tip);
    setTimeout(()=>tip.remove(),2600);
  }));
}
drawTrend();

/* 分布环图 */
(function(){
  const data=[['happy',32],['calm',22],['focus',16],['sad',12],['anxious',10],['angry',8]];
  const R=44,C=2*Math.PI*R;let off=0;
  const segs=data.map(([t,v])=>{
    const s=`<circle cx="60" cy="60" r="${R}" fill="none" stroke="${EMOTIONS[t].c}" stroke-width="15" stroke-dasharray="${(v/100*C).toFixed(1)} ${C.toFixed(1)}" stroke-dashoffset="${(-off/100*C).toFixed(1)}" transform="rotate(-90 60 60)" style="cursor:pointer"><title>${EMOTIONS[t].name} ${v}%</title></circle>`;
    off+=v;return s;
  }).join('');
  $('#donutWrap').innerHTML=`<svg viewBox="0 0 120 120" width="118" height="118">${segs}
    <text x="60" y="56" text-anchor="middle" font-size="12" font-weight="700" fill="#292524">快乐</text>
    <text x="60" y="72" text-anchor="middle" font-size="10" fill="#A8A29E">32%</text></svg>
    <div class="donut-legend">${data.map(([t,v])=>`<span><i style="background:${EMOTIONS[t].c}"></i>${EMOTIONS[t].name}</span>`).join('')}</div>`;
  $('#donutWrap').addEventListener('click',()=>toast('点击扇区可查看相关记录（原型演示）'));
})();

/* 关键词云 */
const WORDS=[['工作',22,'#5BA68A'],['阳光',19,'#F59E0B'],['朋友',17,'#7DD3FC'],['deadline',13,'#A8A29E'],['散步',15,'#3D7A66'],['睡眠',14,'#A78BFA'],['咖啡',11,'#8D6E4B'],['运动',13,'#F97316'],['音乐',11,'#93C5FD'],['加班',12,'#A8A29E'],['成就感',14,'#FBBF24'],['猫',10,'#FCA5A5']];
$('#cloudWords').innerHTML=WORDS.map(([w,s,c])=>`<span style="font-size:${s}px;color:${c}" data-toast="查看含「${w}」的 12 条记录">${w}</span>`).join('');

/* 触发排行 */
const TRS=[
  {name:'朋友聚会',kind:'正向',v:92,c:'#5BA68A',note:'快乐平均 +2.3 分',rank:1},
  {name:'运动出汗',kind:'正向',v:74,c:'#7FBFA0',note:'快乐出现率 +24%',rank:2},
  {name:'deadline',kind:'负向',v:68,c:'#A8A29E',note:'焦虑平均 +1.6 分',rank:3},
];
$('#triggerRank').innerHTML=TRS.map(t=>`
  <div class="tr-item">
    <span class="tr-rank" style="background:${t.c}">${t.rank}</span>
    <div class="tr-info"><b>${t.name}</b><p>${t.kind}因素 · ${t.note}</p></div>
    <div class="tr-bar"><span style="width:${t.v}%;background:${t.c}"></span></div>
    <span class="tr-val">${t.v}</span>
  </div>`).join('');

/* AI 周期洞察 */
const AIS=[
  {bg:'#FEF3C7',svg:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#D97706" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 2M4.5 4.5l2 2M19.5 4.5l-2 2"/></svg>',t:'<b>周三下午</b>是你的焦虑高发时段，建议中午做一次 3 分钟呼吸练习。'},
  {bg:'#E8F5E9',svg:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#5BA68A" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6"/><circle cx="16.8" cy="9" r="2.4"/><path d="M15.5 14.2c2.4.2 4.2 1.6 4.8 4.3"/></svg>',t:'和朋友见面后，你的快乐值平均提升 <b>2.3 分</b>，多约小满出来玩吧。'},
  {bg:'#EDE9FE',svg:'<svg viewBox="0 0 24 24" width="17" height="17"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z" fill="#A78BFA"/></svg>',t:'睡眠超过 7 小时的第二天，情绪指数平均高 <b>1.8 分</b>。'},
];
$('#aiInsights').innerHTML=AIS.map(a=>`<div class="ai-insight"><span class="aii-ic" style="background:${a.bg}">${a.svg}</span><p>${a.t}</p></div>`).join('');

/* 时间轴 */
const MONTHS=[['3月','#F9C9A8',2],['4月','#AEE0F8',3],['5月','#BFE3C8',4],['6月','#FFE3C2',5]];
$('#timeline').innerHTML=MONTHS.map(([m,c,n])=>{
  let plants='';const types=['happy','calm','focus','sad','energy'];
  for(let i=0;i<n;i++)plants+=`<div style="width:${34-i*2}px">${plantSVG(types[i%5])}</div>`;
  return `<div class="tl-month"><div class="tl-thumb" style="background:linear-gradient(180deg,${c},#FDFBF5)" data-toast="查看${m}花园全景">
    <div style="position:absolute;bottom:4px;left:0;right:0;display:flex;justify-content:center;gap:2px;align-items:flex-end">${plants}</div></div><span>${m}</span></div>`;
}).join('');

/* ═══════════════ 发现页 ═══════════════ */
const MEDS=[
  {t:'雨夜安眠',cat:'助眠',dur:'15 分钟',p:'23.4w',c1:'#7D8FD4',c2:'#4A5580',svg:'<svg viewBox="0 0 24 24" width="24" height="24"><path d="M7 14h9a3.5 3.5 0 0 0 .5-6.96A4.8 4.8 0 0 0 7.3 7.5 3 3 0 0 0 7 14z" fill="#fff" opacity=".92"/><path d="M9 17l-1 2.5M13 17l-1 2.5M17 17l-1 2.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/></svg>'},
  {t:'晨间唤醒',cat:'专注',dur:'8 分钟',p:'18.2w',c1:'#F5B94E',c2:'#F97316',svg:'<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="14" r="5" fill="#fff" opacity=".92"/><path d="M12 4v2.5M5 14H2.5M21.5 14H19M5.6 7.6l1.8 1.8M18.4 7.6l-1.8 1.8" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".85"/><path d="M3 20h18" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".7"/></svg>'},
  {t:'森林呼吸',cat:'减压',dur:'10 分钟',p:'31.0w',c1:'#8FC9A8',c2:'#3D7A66',svg:'<svg viewBox="0 0 24 24" width="24" height="24" fill="#fff" opacity=".92"><path d="M12 3l4.5 6h-2.8l4 5.5H6.3l4-5.5H7.5z"/><rect x="10.8" y="14.5" width="2.4" height="5" rx="1"/></svg>'},
];
$('#medList').innerHTML=MEDS.map((m,i)=>`
  <div class="med-item">
    <div class="med-cover" style="background:linear-gradient(135deg,${m.c1},${m.c2})">${m.svg}</div>
    <div class="med-info"><b>${m.t}</b><span>${m.cat} · ${m.dur} · ${m.p} 次播放</span></div>
    <button class="med-play" data-i="${i}">
      <svg class="med-tri" viewBox="0 0 24 24" width="14" height="14"><path d="M8 5.5v13l11-6.5z" fill="#5BA68A"/></svg>
      <span class="med-eq"><i></i><i></i><i></i></span>
    </button>
  </div>`).join('');
$('#medList').addEventListener('click',e=>{
  const b=e.target.closest('.med-play');if(!b)return;
  const on=b.classList.toggle('playing');
  $$('.med-play').forEach(x=>{if(x!==b)x.classList.remove('playing')});
  if(on)toast(`正在播放：${MEDS[+b.dataset.i].t}`);
});

/* 白噪音 */
$('#toolNoise').addEventListener('click',()=>toast('白噪音：雨声 · 森林 · 海浪 · 篝火 · 咖啡馆'));

/* 社区 */
const COM=[['匿名园丁 A','happy','# 今天也有好好记录',128],['匿名园丁 B','calm','# 雨天植物园',96],['匿名园丁 C','energy','# 我的花园开花了',210]];
$('#communityRow').innerHTML=COM.map(([n,t,tag,likes])=>`
  <div class="com-card">
    <div class="com-plant">${plantSVG(t)}</div>
    <b>${n}</b><span class="com-meta">${tag}</span>
    <div class="com-actions">
      <button class="com-btn c-like">♡ ${likes}</button>
      <button class="com-btn c-water">送水</button>
    </div>
  </div>`).join('');
$('#communityRow').addEventListener('click',e=>{
  const l=e.target.closest('.c-like'),w=e.target.closest('.c-water');
  if(l){const on=l.classList.toggle('liked');l.textContent=(on?'♥ ':'♡ ')+(parseInt(l.textContent.slice(2))+(on?1:-1))}
  if(w&&!w.classList.contains('watered')){w.classList.add('watered');w.textContent='已送水';toast('送出了一份温柔')}
});

/* 图鉴 */
const DEX=[['happy',1],['calm',1],['focus',1],['sad',1],['angry',1],['anxious',1],['rainbow',0,'稀有'],['seed',0]];
$('#dexGrid').innerHTML=DEX.map(([t,own,rare])=>`
  <div class="dex-cell ${own?'':'locked'} ${rare?'rare':''}" data-toast="${own?EMOTIONS[t]?.plant||'彩虹花':'未解锁 · 继续记录来收集'}">
    <div class="dp">${plantSVG(t)}</div><span>${t==='rainbow'?'彩虹花':t==='seed'?'？？？':EMOTIONS[t].plant}${rare?' ✦':''}</span>
  </div>`).join('');

/* 主题商店 */
const THEMES=[
  {n:'四季·春',tag:'免费 · 使用中',a:'#A8D5A2',b:'#8CC48A',sky:'linear-gradient(180deg,#B8E0F0,#EAF6EA)',on:1},
  {n:'森林',tag:'免费',a:'#7CB083',b:'#5E9468',sky:'linear-gradient(180deg,#9CC9A8,#DCEFE0)'},
  {n:'海边',tag:'免费',a:'#E8D9A8',b:'#DBC584',sky:'linear-gradient(180deg,#8ED0F0,#DFF4FB)'},
  {n:'雪原',tag:'免费',a:'#EDF2F7',b:'#D8E2EC',sky:'linear-gradient(180deg,#C3D4E8,#EFF5FA)'},
  {n:'樱花季',tag:'Pro 限定',a:'#F3C6D8',b:'#E8A8C4',sky:'linear-gradient(180deg,#F9D9E8,#FDF0F5)',pro:1},
  {n:'极光夜',tag:'Pro 限定',a:'#3A4A6B',b:'#2B3852',sky:'linear-gradient(180deg,#26355A,#6B5B9E)',pro:1},
];
$('#themeRow').innerHTML=THEMES.map((t,i)=>`
  <button class="theme-card ${t.on?'using':''}" data-i="${i}">
    <div class="theme-prev" style="background:${t.sky}"><div style="position:absolute;bottom:0;left:0;right:0;height:26px;background:linear-gradient(180deg,${t.a},${t.b});border-radius:50% 50% 0 0/14px 14px 0 0"></div></div>
    <b>${t.n}</b><span>${t.tag}</span>
  </button>`).join('');
$('#themeRow').addEventListener('click',e=>{
  const c=e.target.closest('.theme-card');if(!c)return;
  const t=THEMES[+c.dataset.i];
  if(t.pro){toast('「'+t.n+'」为 Pro 主题 · 升级后解锁');return}
  $$('.theme-card').forEach(x=>x.classList.remove('using'));c.classList.add('using');
  $('#ground').style.setProperty('--ground-a',t.a);
  $('#ground').style.setProperty('--ground-b',t.b);
  toast(`已应用主题「${t.n}」`);
});

/* ═══════════════ 我的页 ═══════════════ */
/* 封面花园 */
(function(){
  let plants='';const types=['happy','calm','focus','energy','sad'];
  types.forEach((t,i)=>{plants+=`<div style="width:${44+(i%2)*10}px;opacity:.95">${plantSVG(t)}</div>`});
  $('#meCoverScene').innerHTML=`
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,#F9C9A8,#FDF0DC)"></div>
    <div style="position:absolute;top:26px;right:36px;width:40px;height:40px;border-radius:50%;background:radial-gradient(circle at 40% 40%,#FFF3C4,#FFD65C);box-shadow:0 0 24px 8px rgba(255,214,92,.5)"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;height:74px;background:linear-gradient(180deg,#A8D5A2,#8CC48A);border-radius:46% 54% 0 0/24px 26px 0 0"></div>
    <div style="position:absolute;bottom:8px;left:0;right:0;display:flex;justify-content:center;gap:12px;align-items:flex-end">${plants}</div>`;
})();

/* 徽章墙 */
const BADGES=[
  {n:'初长成',c:'#E8F5E9',svg:'<path d="M12 20V9" stroke="#3D7A66" stroke-width="2" stroke-linecap="round"/><path d="M12 11c0-4-3-6-7-5.5C5.7 9.5 8 11.5 12 11z" fill="#5BA68A"/><path d="M12 9c0-4 3-6 7-5.5-.7 4-3 5.5-7 5.5z" fill="#7FBFA0"/>',own:1},
  {n:'7天连击',c:'#FFF3E0',svg:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-4.3-3.8-6.6-5.2-9.8-.9 1.7-1.3 3.1-1.1 4.9-1-.5-1.9-1.5-2.3-2.8C8 8.6 5.5 10.9 5.5 14.8c0 3.6 2.6 6.2 6.5 6.2z" fill="#F97316"/>',own:1,ne:1},
  {n:'30天连击',c:'#FFF3E0',svg:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-4.3-3.8-6.6-5.2-9.8-.9 1.7-1.3 3.1-1.1 4.9-1-.5-1.9-1.5-2.3-2.8C8 8.6 5.5 10.9 5.5 14.8c0 3.6 2.6 6.2 6.5 6.2z" fill="#FBBF24"/>',own:1},
  {n:'100天连击',c:'#F5F5F4',svg:'<path d="M12 21c3.9 0 6.5-2.6 6.5-6.2 0-4.3-3.8-6.6-5.2-9.8-.9 1.7-1.3 3.1-1.1 4.9-1-.5-1.9-1.5-2.3-2.8C8 8.6 5.5 10.9 5.5 14.8c0 3.6 2.6 6.2 6.5 6.2z" fill="#A8A29E"/>'},
  {n:'快乐园丁',c:'#FEF9C3',svg:'<circle cx="12" cy="12" r="7" fill="#FBBF24"/><circle cx="9.5" cy="10.5" r="1" fill="#292524"/><circle cx="14.5" cy="10.5" r="1" fill="#292524"/><path d="M9 14c1 1.2 2 1.8 3 1.8s2-.6 3-1.8" stroke="#292524" stroke-width="1.4" fill="none" stroke-linecap="round"/>',own:1},
  {n:'雨中行者',c:'#E3F2FD',svg:'<path d="M7 13h9a3.5 3.5 0 0 0 .5-6.96A4.8 4.8 0 0 0 7.3 7.5 3 3 0 0 0 7 13z" fill="#93C5FD"/><path d="M9 16l-1 2.5M13 16l-1 2.5M17 16l-1 2.5" stroke="#7DD3FC" stroke-width="1.6" stroke-linecap="round"/>',own:1},
  {n:'愤怒管理师',c:'#F5F5F4',svg:'<rect x="9" y="6" width="6" height="13" rx="3" fill="#A8A29E"/><circle cx="12" cy="5" r="2" fill="#A8A29E"/>'},
  {n:'平静大师',c:'#E3F2FD',svg:'<circle cx="12" cy="12" r="8" fill="none" stroke="#7DD3FC" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#7DD3FC"/>',own:1},
  {n:'送水达人',c:'#E3F2FD',svg:'<path d="M12 20c-3.3 0-5.5-2.3-5.5-5.2C6.5 10.8 9.6 7 12 5c2.4 2 5.5 5.8 5.5 9.8 0 2.9-2.2 5.2-5.5 5.2z" fill="#7DD3FC"/>',own:1},
  {n:'社区温暖者',c:'#F5F5F4',svg:'<path d="M12 20s-6.5-4-8.2-7.8A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.2 5.2C18.5 16 12 20 12 20z" fill="#A8A29E"/>'},
  {n:'凌晨记录者',c:'#F5F5F4',svg:'<path d="M19 13.5A7.5 7.5 0 0 1 10.5 5a7.5 7.5 0 1 0 8.5 8.5z" fill="#A8A29E"/>'},
  {n:'语音达人',c:'#F3E8FF',svg:'<rect x="9.5" y="4" width="5" height="9" rx="2.5" fill="#A78BFA"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V20" stroke="#A78BFA" stroke-width="1.8" fill="none" stroke-linecap="round"/>',own:1},
];
$('#badgeWall').innerHTML=BADGES.map(b=>`
  <div class="badge-cell ${b.own?'':'locked'} ${b.ne?'new':''}" data-toast="${b.own?'「'+b.n+'」已获得':'「'+b.n+'」未解锁 · 继续加油'}">
    <div class="badge-ic" style="background:${b.c}"><svg viewBox="0 0 24 24" width="24" height="24">${b.svg}</svg></div>
    <span>${b.n}</span>
  </div>`).join('');

/* ═══════════════ URL 参数：iframe 嵌入支持 ═══════════════
   #embed=1           隐藏舞台标题与标注栏，仅保留手机
   #tab=garden|record|insight|discover|me   跳过引导直达指定 Tab */
(function(){
  try{
    const h=new URLSearchParams(location.hash.slice(1));
    if(h.get('embed'))document.body.classList.add('embed');
    const tab=h.get('tab');
    if(tab){
      enterApp();
      if(tab!=='garden'&&$('#page-'+tab))switchTab('page-'+tab);
    }
  }catch(e){}
})();
