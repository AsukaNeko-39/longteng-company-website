// Fade the visible panel out before introducing its replacement. Rapid input
// cancels the previous transition so the most recent selection always wins.
const panelMotions=new WeakMap();
window.companyMotion={async swap(host,panels,target,animate=true){
  if(!host||!target)return;
  const pending=panelMotions.get(host),opacity=getComputedStyle(host).opacity;
  pending?.animation?.cancel();
  const previous=panels.find(panel=>!panel.hidden);
  const baseline=pending?.baseline??host.style.minHeight;
  const apply=()=>panels.forEach(panel=>{panel.hidden=panel!==target;panel.inert=panel!==target;});
  if(!animate||matchMedia('(prefers-reduced-motion:reduce)').matches){
    panelMotions.delete(host);host.style.minHeight=baseline;host.removeAttribute('aria-busy');apply();return;
  }
  if(previous===target&&!pending){apply();return;}
  const state={baseline,animation:null};panelMotions.set(host,state);
  host.style.minHeight=host.getBoundingClientRect().height+'px';host.setAttribute('aria-busy','true');
  previous&&(previous.inert=true);
  try{
    if(previous&&previous!==target){
      state.animation=host.animate([{opacity,transform:'translateY(0)'},{opacity:0,transform:'translateY(-5px)'}],{duration:190,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});
      await state.animation.finished.catch(()=>{});if(panelMotions.get(host)!==state)return;
    }
    apply();state.animation?.cancel();
    state.animation=host.animate([{opacity:previous===target?opacity:0,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:470,delay:60,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    await state.animation.finished.catch(()=>{});
  }finally{
    if(panelMotions.get(host)===state){state.animation?.cancel();host.style.minHeight=baseline;host.removeAttribute('aria-busy');panelMotions.delete(host);}
  }
}};
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', '打开导航'); menu.focus();
  }
});
const dialog = document.querySelector('.lightbox');
document.querySelectorAll('[data-image]').forEach(button => {
  button.addEventListener('click', () => {
    dialog.querySelector('img').src = button.dataset.image;
    dialog.querySelector('img').alt = button.querySelector('img').alt;
    dialog.querySelector('p').textContent = button.dataset.caption;
    dialog.showModal(); document.body.style.overflow = 'hidden';
  });
});
dialog?.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
dialog?.addEventListener('close', () => {document.body.style.overflow = '';});
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const tabs = [...gallery.querySelectorAll('[role=tab]')];
  function select(tab) {
    tabs.forEach(t => { const active = t === tab; t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1; gallery.querySelector('#'+t.dataset.tab).hidden = !active; });
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (i+1)%tabs.length;
      if (e.key === 'ArrowLeft') next = (i+tabs.length-1)%tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length-1;
      if (next !== undefined) {e.preventDefault(); select(tabs[next]); tabs[next].focus();}
    });
  });
});
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    let count = 0;
    document.querySelectorAll('[data-category]').forEach(item => {item.hidden = category !== '全部' && item.dataset.category !== category; if (!item.hidden) count++;});
    document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button));});
    document.querySelector('.filter-status').textContent = `显示${category}${count}个案例`;
  });
});
let toastTimeout;
document.querySelectorAll('[data-copy]').forEach(button => {
  button.addEventListener('click', async () => {
    const toast = document.querySelector('.toast');
    try {await navigator.clipboard.writeText(button.dataset.copy); toast.textContent='邮箱已复制：'+button.dataset.copy;}
    catch {toast.textContent='请复制邮箱：'+button.dataset.copy;}
    toast.classList.add('show'); clearTimeout(toastTimeout); toastTimeout=setTimeout(()=>toast.classList.remove('show'),4000);
  });
});
// The homepage's capability explorer is a keyboard-operable set of real panels.
document.querySelectorAll('[data-expertise]').forEach(explorer => {
  const tabs = [...explorer.querySelectorAll('[data-expertise-tab]')];
  function activate(tab) {
    for (const t of tabs) {
      const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;
    }
    window.companyMotion.swap(explorer.querySelector('.expertise-panels'),tabs.map(t=>explorer.querySelector('#'+t.dataset.expertiseTab)),explorer.querySelector('#'+tab.dataset.expertiseTab));
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>activate(tab));
    tab.addEventListener('keydown',e=>{
      let n;if(['ArrowDown','ArrowRight'].includes(e.key))n=(i+1)%tabs.length;
      if(['ArrowUp','ArrowLeft'].includes(e.key))n=(i+tabs.length-1)%tabs.length;
      if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;
      if(n!==undefined){e.preventDefault();activate(tabs[n]);tabs[n].focus();}
    });
  });
});
