(() => {
'use strict';
const c = window.SITE_CONFIG;
const mottos = c.mottos?.length ? c.mottos : [c.motto || {text:'',author:'',url:''}];
let mottoIndex = 0;
let quoteFadeTimer;
const quoteInterval = Math.max(5, Number(c.mottoIntervalSeconds) || 10) * 1000;
const pages = [
 ['about','关于','About','认识雲隐','A little about me'],
 ['research','研究兴趣','Research','在数学中探索','Questions & interests'],
 ['notes','数学讲义','Lecture Notes','学习与记录','Learning & writing'],
 ['bookmarks','链接收藏','Bookmarks','值得重访的地方','Places to return to'],
 ['workshop','数学工坊','Math Workshop','程序与小工具','Programs & little tools']
];
let lang = 'zh';
try {lang = localStorage.getItem('yunyin-language') === 'en' ? 'en' : 'zh';} catch (_) {}
const page = document.body.dataset.page;
const esc = s => String(s ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const t = value => typeof value === 'string' ? value : value?.[lang] || '';
const tr = (zh,en) => lang === 'zh' ? zh : en;
function url(value) {
 if (!value || typeof value !== 'string') return '';
 try {const u = new URL(value,location.href); return ['http:','https:','mailto:'].includes(u.protocol) ? value : '';} catch (_) {return '';}
}
const anchor = (href, label) => `<a href="${esc(href)}">${label}</a>`;
function socials() {return `<div class="socials">${c.socials.map(s => url(s.url) ? anchor(url(s.url),esc(t(s.name))) : `<span class="unavailable" aria-disabled="true">${esc(t(s.name))}<small>${tr('待补充','soon')}</small></span>`).join('')}</div>`;}
function quoteMarkup() {
 const motto = mottos[mottoIndex];
 const text = esc(t(motto.text));
 const href = url(motto.url);
 return `<div class="motto">${href ? anchor(href,text) : text}</div><div class="motto-author">${t(motto.author) ? '— ' + esc(t(motto.author)) : ''}</div>`;
}
function render() {
 clearTimeout(quoteFadeTimer);
 document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
 document.querySelectorAll('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
 const name = tr('雲隐的数学个人主页',"Yunyin’s Mathematical Homepage");
 const current = pages.find(p => p[0] === page);
 document.title = current ? `${current[lang === 'zh' ? 1 : 2]} · ${name}` : name;
 document.querySelector('.footer-note').textContent = tr('数学 · 思考 · 记录','Mathematics · Thoughts · Notes');
 let html;
 if (page === 'index') {
 html = `<div class="home"><p class="eyebrow">${tr('数学的一个小小角落','A SMALL CORNER OF MATHEMATICS')}</p><div class="avatar-wrap"><img class="avatar" src="${esc(url(c.avatar) || 'assets/avatar.svg?v=blue1')}" alt="${tr('雲隐的头像占位图','Yunyin avatar placeholder')}" width="116" height="116"></div><h1 class="${c.showHomeTitle ? 'full-title' : ''}">${esc(c.showHomeTitle ? name : t(c.name))}</h1><div class="quote">${quoteMarkup()}</div>${socials()}<nav class="entries" aria-label="${tr('栏目入口','Explore')}">${pages.map((p,i)=>`<a class="entry" href="${p[0]}.html"><span class="entry-top"><span>0${i+1}</span><span aria-hidden="true">↗</span></span><strong>${p[lang==='zh'?1:2]}</strong><small>${p[lang==='zh'?2:4]}</small></a>`).join('')}</nav><p class="home-end">${tr('于此，留下一些思考。','A space to think, and to leave a trace.')}</p></div>`;
 } else {
 let body = '';
 if(page === 'about') body = `<div class="content-row"><p>${esc(t(c.about))}</p></div><h2>${tr('联系方式','Contact')}</h2>${socials()}`;
 if(page === 'research') body = c.interests.map((r,i)=>`<div class="content-row"><span class="section-label">0${i+1}</span><h2>${esc(t(r))}</h2>${lang==='zh'?`<p>${esc(r.en)}</p>`:''}</div>`).join('');
 if(['notes','bookmarks','workshop'].includes(page)) {
 const items = c[page] || [];
 body = items.length ? items.map(r=>`<article class="content-row"><h2>${esc(t(r.title))}</h2>${r.category?`<small>${esc(t(r.category))}</small>`:''}<p>${esc(t(r.description))}</p>${url(r.url)?anchor(url(r.url),tr('打开','Open')+' ↗'):''}${url(r.tex)?' · '+anchor(url(r.tex),'TeX'):''}${url(r.source)?' · '+anchor(url(r.source),tr('源代码','Source')):''}</article>`).join('') : `<div class="empty">${({notes:tr('讲义正在整理，稍后在这里分享 PDF 与 TeX 文件。','Lecture notes are being organized. PDF and TeX files will appear here.'),bookmarks:tr('这里将收藏学者主页、讲义资源，以及朋友与合作者的主页。链接待补充。','A collection of academic homepages, learning resources, friends, and collaborators. Links to follow.'),workshop:tr('这里将展示自制程序与科研辅助小工具。作品待补充。','A home for personal programs and research tools. Projects to follow.')})[page]}</div>`;
 }
 html = `<article class="detail"><a class="back" href="index.html">← ${tr('返回首页','Back home')}</a><div class="section-label">0${pages.indexOf(current)+1} / ${current[2].toUpperCase()}</div><h1>${current[lang==='zh'?1:2]}</h1><p class="intro">${current[lang==='zh'?3:4]}</p>${body}<nav class="detail-nav" aria-label="${tr('其他栏目','Other sections')}">${pages.map(p=>`<a href="${p[0]}.html" ${page===p[0]?'aria-current="page"':''}>${p[lang==='zh'?1:2]}</a>`).join('')}</nav></article>`;
 }
 document.querySelector('main').innerHTML = html;
}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;try{localStorage.setItem('yunyin-language',lang);}catch(_){}render();}));
render();
if (page === 'index' && mottos.length > 1) {
 setInterval(() => {
  const quote = document.querySelector('.quote');
  // Pause while reading a hovered quote, using its link, or viewing another tab.
  if (!quote || document.hidden || quote.matches(':hover') || quote.contains(document.activeElement)) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  quote.classList.add('quote-fading');
  quoteFadeTimer = setTimeout(() => {
   if (document.hidden || quote.matches(':hover') || quote.contains(document.activeElement)) {
    quote.classList.remove('quote-fading');
    return;
   }
   mottoIndex = (mottoIndex + 1) % mottos.length;
   quote.innerHTML = quoteMarkup();
   quote.classList.remove('quote-fading');
  }, reducedMotion ? 0 : 600);
 }, quoteInterval);
}
})();
