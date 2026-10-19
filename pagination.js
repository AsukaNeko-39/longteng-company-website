(() => {
  const main=document.querySelector('main');
  if(!main)return;
  const backup=main.innerHTML;
  const originalFooter=document.querySelector('.site-footer');
  try {
    const source=main.cloneNode(true);
    const mobile=matchMedia('(max-width:760px)').matches;
    const compact=mobile||innerHeight<650;
    const shortPhone=mobile&&innerHeight<=720;
    const reduced=matchMedia('(prefers-reduced-motion:reduce)');
    const route=location.pathname.split('/').pop()||'index.html';
    const routes=['index.html','services.html','maps.html','cases.html','about.html'];
    const names=['首页','能力与服务','特色地图','案例与合作','认识龙腾'];
    const chapter=Math.max(0,routes.indexOf(route));
    const q=(s,root=source)=>root?.querySelector(s);
    const qa=(s,root=source)=>[...(root?.querySelectorAll(s)||[])];
    const clone=node=>node?.cloneNode(true);
    const div=(name,nodes=[])=>{const n=document.createElement('div');n.className=name;for(const node of nodes)if(node)n.append(node);return n;};
    const heading=(text,level='h2')=>{const n=document.createElement(level);n.textContent=text;return n;};
    const para=text=>{const n=document.createElement('p');n.textContent=text;return n;};
    const deck=div('page-deck');
    const scenes=[];
    let selectHomeMap=()=>{};
    function sheet(id,title,nodes,kind='',tone='#ffffff'){
      const n=document.createElement('section');n.id='view-'+id;n.className='scene '+kind;n.dataset.title=title;n.dataset.tone=tone;
      n.setAttribute('role','group');n.setAttribute('aria-roledescription','页面');n.setAttribute('aria-label',title);
      const body=div('scene-body',nodes);n.append(body);deck.append(n);scenes.push(n);return n;
    }
    const titleBlock=(label,title,description)=>{
      const eyebrow=para(label);eyebrow.className='eyebrow';return div('scene-heading',[eyebrow,heading(title),description?para(description):null]);
    };
    function lead(image){
      const intro=q('.page-intro');
      const copy=div('lead-copy',[q('.breadcrumbs'),intro,q('.page-subnav')||q('.anchor-tabs')]);
      return sheet('overview',names[chapter],[div('scene-grid chapter-lead',[copy,image])],'scene--lead');
    }
    function contact(band=q('.contact-band')){
      if(band){const page=sheet('contact','业务咨询与合作',[band,clone(originalFooter)],'scene--contact','#edf4fd');if(chapter===0)page.dataset.auxiliary='true';}
    }
    if(chapter===0){
      const hero=q('.flagship');const first=q('.flagship-top>div',hero);first.classList.add('hero-copy');first.append(q('.flagship-intro',hero));
      sheet('overview','多源空间数据与行业应用',[div('scene-grid hero-grid',[first,q('.flagship-visual',hero)]),q('.hero-bottom-line',hero)],'scene--hero');
      const expertise=q('.expertise-section');
      if(mobile)q('.expertise-options',expertise).setAttribute('aria-orientation','horizontal');
      sheet('capabilities','多源空间数据与地理信息平台',[expertise],'scene--expertise');
      const mapCopies=div('map-project-copy'),photos=div('map-photo-stack'),mapShowcase=div('map-showcase',[mapCopies,photos]);
      const mapProjects=[['agri','农耕文化地图','.signature-farm','.signature-screen img'],['football','湘超数字地图','.signature-football','.football-desktop img']];
      const mapButtons=[];
      function selectMap(id){
        mapShowcase.dataset.active=id;
        for(const button of mapButtons){const active=button.dataset.project===id;button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',(active?'当前展示：':'切换至')+button.dataset.name);}
        const copies=qa('.signature-copy',mapCopies),selected=copies.find(copy=>copy.dataset.project===id);
        if(window.companyMotion)window.companyMotion.swap(mapCopies,copies,selected,!!mapShowcase.closest('.is-current'));
        else copies.forEach(copy=>{copy.hidden=copy!==selected;copy.inert=copy!==selected;});
      }
      selectHomeMap=selectMap;
      mapProjects.forEach(([id,name,selector,imageSelector])=>{
        const project=q(selector),copy=q('.signature-copy',project);copy.id='home-map-'+id;copy.dataset.project=id;mapCopies.append(copy);
        const button=document.createElement('button');button.type='button';button.className='map-photo';button.dataset.project=id;button.dataset.name=name;button.setAttribute('aria-controls',copy.id);
        const label=document.createElement('span');label.className='map-photo-label';label.textContent=name;
        button.append(q(imageSelector,project),label);button.addEventListener('click',()=>selectMap(id));
        button.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();e.stopPropagation();const other=mapButtons.find(b=>b!==button);selectMap(other.dataset.project);other.focus({preventScroll:true});}});
        mapButtons.push(button);photos.append(button);
      });
      selectMap('agri');
      const mapHint=para('点击相片切换项目');mapHint.className='map-switch-hint';photos.append(mapHint);
      sheet('maps','农耕文化与湘超数字地图',[titleBlock('02 / SIGNATURE MAPS','专题地理信息与特色地图应用'),mapShowcase],'scene--map-showcase','#f3f6fa');
      const homeCase=q('.home-case');
      if(shortPhone){q('.section-heading',homeCase)?.remove();q('.scenario-links',homeCase)?.remove();}
      sheet('case','智慧园区应用',[homeCase],'scene--home-case');
      const homeCompany=q('.home-about'),partners=q('.partner-line');
      const partnerAssets=[['survey','png'],['pingan','png'],['whu','png'],['csust','png'],['hnust','png']];
      qa('.partner-names>span',partners).forEach((card,i)=>{
        const [id,extension]=partnerAssets[i];card.className='partner-card';card.dataset.partner=id;
        const image=document.createElement('img');image.src='assets/partners/'+id+'.'+extension;image.alt='';image.setAttribute('aria-hidden','true');image.decoding='sync';
        card.prepend(div('partner-logo',[image]));
      });
      sheet('company','公司团队与产学研合作',[homeCompany,partners],'scene--company-partners','#eef4fd');
      contact();
    }else if(chapter===1){
      const data=q('#data'),imageStack=q('.image-stack',data),dataCopy=q('.split-copy',data);
      lead(div('lead-visual',[clone(q('.visual',imageStack))]));
      if(compact){
        const details=q('.detail-list',dataCopy);
        sheet('data','空间数据采集与生产',[div('mobile-data-copy',[dataCopy]),q('.visual',imageStack)],'scene--data');
        // Move the detailed service list to its own page, keeping readable type.
        const bim=q('.stack-small',imageStack);
        sheet('data-types','空间数据类型与BIM',[titleBlock('01 / DATA SERVICES','空间数据类型与模型生产'),details,shortPhone?null:bim],'scene--data-types');
        if(shortPhone)sheet('bim','BIM模型与空间结构',[titleBlock('01 / BIM','BIM模型与空间结构'),bim],'scene--bim');
      }else sheet('data','空间数据采集与生产',[data],'scene--data');
      const platform=q('#platform');const platformHeading=q('.section-heading',platform);const layout=q('.platform-layout',platform);
      if(compact){
        sheet('platform','GIS与物联网平台',[platformHeading,q('.visual',layout)],'scene--platform','#f3f7fb');
        const products=q('.platform-list',layout);
        if(shortPhone)qa('article',products).forEach((product,i)=>sheet('platform-product-'+i,q('h3',product).textContent,[titleBlock('02 / PLATFORM / 0'+(i+1),'GIS与物联网产品体系'),div('platform-list',[product])],'scene--products','#f3f7fb'));
        else sheet('platform-products','平台产品与集成能力',[titleBlock('02 / PLATFORM','GIS与物联网产品体系'),products],'scene--products','#f3f7fb');
      }else sheet('platform','GIS与物联网平台',[platform],'scene--platform','#f3f7fb');
      const remote=q('#remote'),remoteVisual=q('.visual',remote);
      if(shortPhone){remoteVisual.remove();sheet('remote','遥感影像解译与专题分析',[remote],'scene--remote');sheet('remote-analysis','遥感变化检测图示',[titleBlock('03 / REMOTE SENSING','遥感变化检测图示'),remoteVisual],'scene--remote-image');}
      else sheet('remote','遥感影像解译与专题分析',[remote],'scene--remote');
      sheet('delivery','项目全生命周期管理',[q('.process')],'scene--process');
      contact();
    }else if(chapter===2){
      const agri=q('#agri'),football=q('#football');
      const agriTitle=q('.project-title',agri),agriFigure=q('.map-main',agri),stats=q('.project-stats',agri),gallery=q('[data-gallery]',agri);
      lead(div('lead-visual',[clone(agriFigure)]));
      sheet('agri','农耕文化资源专题地图',[agriTitle,shortPhone?null:agriFigure],'scene--project','#f5f3e9');
      if(shortPhone)sheet('agri-map','农耕文化地图总览',[titleBlock('01 / AGRICULTURAL CULTURE GIS','农耕文化资源分布'),agriFigure],'scene--map-image','#f5f3e9');
      sheet('agri-topics','农耕文化专题内容',[stats,gallery],'scene--topics','#f5f3e9');
      const ft=q('.project-title',football),fl=q('.football-layout',football),notes=q('.football-notes',football),detail=q('.sport-detail',football);
      const phone=q('.mobile-showcase',fl);
      if(compact){
        const footballMap=q('.visual',fl);
        sheet('football','湘超赛事地理信息',[ft,shortPhone?null:footballMap],'scene--project','#edf4fd');
        if(shortPhone)sheet('football-map','湘超城市赛事总览',[titleBlock('02 / FOOTBALL GIS','湘超城市赛事总览'),footballMap],'scene--map-image','#edf4fd');
        sheet('football-mobile','湘超移动端地图',[titleBlock('02 / MOBILE MAP','移动端赛事信息服务'),phone],'scene--phone','#edf4fd');
        sheet('football-services','场馆信息与城市服务',[notes,detail],'scene--sport-detail','#edf4fd');
      }else{
        sheet('football','湘超赛事地理信息',[ft,fl],'scene--football','#edf4fd');
        sheet('football-services','场馆信息与城市服务',[notes,detail],'scene--sport-detail','#edf4fd');
      }
      contact();
    }else if(chapter===3){
      const cases=qa('.case-item');
      lead(div('lead-visual',[clone(q('.visual',cases[1]))]));
      const note=q('.case-section>.source-note');
      cases.forEach((item,i)=>{
        const title=q('figcaption strong',item).textContent;
        const text=q('.case-text',item);q('.featured-case-title',text)?.remove();
        const frame=sheet('case-'+(i+1),title,[titleBlock('行业应用案例 / 0'+(i+1),title),div('case-page-grid',[q('figure',item),text]),i===0?note:null],'scene--case');
        frame.dataset.category=item.dataset.category;
      });
      sheet('projects','地区项目与应用场景',[q('.case-index')],'scene--project-index','#f3f7fb');
      const partners=q('#partners');const sectionHeading=q('.section-heading',partners),photos=qa('.cooperation-grid>article',partners),list=q('.cooperation-names',partners);
      if(compact){
        photos.forEach((photo,i)=>sheet('exchange-'+i,q('h3',photo).textContent+'交流',[photo],'scene--exchange'));
        sheet('partners','产学研合作与行业交流',[sectionHeading,list],'scene--partner');
      }else{
        sheet('exchanges','产学研合作与行业交流',[sectionHeading,q('.cooperation-grid',partners)],'scene--cooperation');
        sheet('partners','合作单位与产学研交流',[titleBlock('PARTNERS & EXCHANGE','合作单位与产学研交流'),list],'scene--partner');
      }
      contact();
    }else{
      const company=q('.about-overview'),facts=q('.company-facts',company);
      lead(div('lead-facts',[clone(facts)]));
      if(compact)q('.company-facts',company)?.remove();
      sheet('company','企业定位与技术体系',[company],'scene--company');
      const teamHeading=q('.team-grid')?.parentElement?.querySelector('.section-heading');const team=q('.team-grid');
      if(compact)qa('.team-member',team).forEach((member,i)=>sheet('team-'+i,q('h3',member).textContent.trim(),[titleBlock('核心团队 / 0'+(i+1),'核心团队'),member],'scene--member','#f7f9fb'));
      else sheet('team','经营管理、研发与项目交付',[teamHeading,team],'scene--team','#f7f9fb');
      const research=q('.research');
      if(shortPhone){const researchList=q('.research-list',research);researchList.remove();sheet('research','空间信息技术研发',[research],'scene--research');sheet('research-directions','技术研发方向',[titleBlock('TECHNOLOGY & DEVELOPMENT','空间信息技术研发方向'),researchList],'scene--research-directions');}
      else sheet('research','空间信息技术研发',[research],'scene--research');
      const contactSection=q('#contact');const contactGrid=q('.contact-layout',contactSection);
      if(compact){
        sheet('contact','业务咨询与技术合作',[q('.contact-layout>div',contactSection)],'scene--contact-copy','#edf4fd');
        sheet('address','联系方式与办公地址',[titleBlock('CONTACT INFORMATION','联系方式与办公地址'),q('address',contactGrid),clone(originalFooter)],'scene--address','#edf4fd');
      }else sheet('contact','业务咨询与技术合作',[contactSection,clone(originalFooter)],'scene--address','#edf4fd');
    }
    const frames=scenes.filter(s=>s.querySelector('.scene-body').children.length);
    const primaryFrames=frames.filter(s=>s.dataset.auxiliary!=='true');
    if(!frames.length)throw Error('Empty presentation');
    for(const frame of frames){
      frame.hidden=false;frame.inert=true;frame.setAttribute('aria-hidden','true');
      qa('img',frame).forEach(img=>{img.loading='eager';});
    }
    main.replaceChildren(deck);main.setAttribute('tabindex','-1');originalFooter?.remove();document.documentElement.classList.add('paged');document.body.classList.add('paged-site');
    // Replace the legacy, document-scrolling call to action with a page target.
    qa('a[href="#capabilities"]',main).forEach(a=>{a.setAttribute('href','#view-capabilities');a.textContent='继续了解能力与服务 →';});
    const pager=document.createElement('nav');pager.className='page-controls';pager.setAttribute('aria-label','页面翻阅');
    pager.innerHTML='<div class="page-controls-inner"><button class="page-menu" aria-haspopup="dialog" aria-label="打开目录"><span aria-hidden="true">☷</span><b>目录</b></button><div class="page-position"><span class="page-count"></span><span class="page-name"></span></div><div class="page-buttons"><button class="page-prev" aria-label="上一页"><span aria-hidden="true">←</span></button><button class="page-next" aria-label="下一页"><span aria-hidden="true">→</span></button></div></div><div class="page-progress" aria-hidden="true"><span></span></div>';
    document.body.append(pager);
    const directory=document.createElement('dialog');directory.className='page-directory';directory.setAttribute('aria-label','目录');
    directory.innerHTML='<div class="directory-heading"><div><p>CHAPTER INDEX</p><h2>'+names[chapter]+'</h2></div><button class="directory-close" aria-label="关闭目录">关闭 ×</button></div><ol></ol>';
    frames.forEach((s,i)=>{const li=document.createElement('li');const b=document.createElement('button');b.innerHTML='<span>'+(s.dataset.auxiliary==='true'?'+':String(primaryFrames.indexOf(s)+1).padStart(2,'0'))+'</span><b></b><i aria-hidden="true">↗</i>';b.querySelector('b').textContent=s.dataset.title;b.addEventListener('click',()=>{directory.close();go(i,true);});li.append(b);directory.querySelector('ol').append(li);});document.body.append(directory);
    const live=document.createElement('div');live.className='sr-only';live.setAttribute('role','status');live.setAttribute('aria-live','polite');document.body.append(live);
    const prev=q('.page-prev',pager),next=q('.page-next',pager);
    let current=-1,busy=false;
    const chapterNext=()=>{location.href=routes[(chapter+1)%routes.length];};
    function update(){
      const s=frames[current],primaryIndex=primaryFrames.indexOf(s);
      q('.page-count',pager).textContent=primaryIndex<0?'附加页':String(primaryIndex+1).padStart(2,'0')+' / '+String(primaryFrames.length).padStart(2,'0');q('.page-name',pager).textContent=s.dataset.title;
      q('.page-progress span',pager).style.width=(primaryIndex<0?100:(primaryIndex+1)/primaryFrames.length*100)+'%';
      prev.disabled=current===0&&chapter===0;
      next.setAttribute('aria-label',current===frames.length-1?(chapter===4?'返回首页':'下一章 · '+names[chapter+1]):'下一页');
      qa('ol button',directory).forEach((b,i)=>{b.setAttribute('aria-current',i===current?'page':'false');});
      live.textContent=names[chapter]+'，'+(primaryIndex<0?'附加联系页':'第'+(primaryIndex+1)+'页，共'+primaryFrames.length+'页')+'：'+s.dataset.title;
      document.body.style.setProperty('--scene-bg',s.dataset.tone);
      document.body.dataset.currentPage=String(current+1);
    }
    async function go(index,animate=true,writeHash=true){
      if(busy||index===current||index<0||index>=frames.length)return;
      const previous=frames[current],target=frames[index],direction=index>current?1:-1;busy=true;
      // If a directory or removed scene held focus, restore a visible control.
      if(previous?.contains(document.activeElement))next.focus({preventScroll:true});
      if(previous){previous.inert=true;previous.setAttribute('aria-hidden','true');}
      target.classList.add('is-current');target.inert=false;target.setAttribute('aria-hidden','false');current=index;update();
      const visual=qa('img',target).find(i=>!i.complete);if(visual)visual.decode().catch(()=>{});
      if(animate&&!reduced.matches&&previous){
        previous.classList.add('is-outgoing');
        const out=previous.animate([{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX('+(-direction*32)+'px)'}],{duration:300,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'});
        const incoming=target.animate([{opacity:0,transform:'translateX('+(direction*38)+'px)'},{opacity:1,transform:'translateX(0)'}],{duration:680,delay:140,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
        await Promise.all([out.finished.catch(()=>{}),incoming.finished.catch(()=>{})]);out.cancel();incoming.cancel();
      }
      if(previous){previous.classList.remove('is-current','is-outgoing');}
      if(writeHash)history.replaceState({page:index},'', '#'+target.id);
      busy=false;
    }
    function step(direction){
      if(busy||document.querySelector('dialog[open]')||document.querySelector('#main-nav')?.classList.contains('open'))return;
      if(direction>0&&current===frames.length-1)return chapterNext();
      if(direction<0&&current===0&&chapter>0){location.href=routes[chapter-1]+'#view-last';return;}
      go(current+direction);
    }
    function hashIndex(){
      if(location.hash==='#view-last')return frames.length-1;
      const id=decodeURIComponent(location.hash.slice(1));if(!id||id==='main')return 0;
      const exact=frames.findIndex(s=>s.id===id);if(exact>=0)return exact;
      const target=document.getElementById(id);const owner=target?.closest('.scene');if(owner)return frames.indexOf(owner);
      // IDs of source containers split across pages remain valid deep links.
      if(chapter===0&&['agri','football','view-agri','view-football'].includes(id)){selectHomeMap(id.includes('football')?'football':'agri');return frames.findIndex(s=>s.id==='view-maps');}
      const aliases={capabilities:'view-capabilities',partners:chapter===0?'view-company':'view-partners','view-partners':chapter===0?'view-company':'view-partners',agri:'view-agri',football:'view-football',data:'view-data',platform:'view-platform',remote:'view-remote',contact:'view-contact'};
      return Math.max(0,frames.findIndex(s=>s.id===aliases[id]));
    }
    next.addEventListener('click',()=>step(1));prev.addEventListener('click',()=>step(-1));
    q('.page-menu',pager).addEventListener('click',()=>directory.showModal());q('.directory-close',directory).addEventListener('click',()=>directory.close());directory.addEventListener('click',e=>{if(e.target===directory)directory.close();});
    document.addEventListener('click',e=>{
      const a=e.target.closest('a[href^="#"]');if(!a)return;
      const hash=a.getAttribute('href');if(hash.length<2)return;e.preventDefault();
      if(hash==='#main'){go(0);main.focus({preventScroll:true});return;}
      const old=location.hash;history.replaceState(null,'',hash);const index=hashIndex();history.replaceState(null,'',old||location.pathname+location.search);go(index);
    });
    addEventListener('hashchange',()=>go(hashIndex(),true,false));
    document.addEventListener('keydown',e=>{
      if(document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey||e.target.closest('input,textarea,select,[role="tab"],[contenteditable="true"]'))return;
      if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();step(1);}
      else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();step(-1);}
      else if(e.key==='Home'){e.preventDefault();go(0);}
      else if(e.key==='End'){e.preventDefault();go(frames.length-1);}
    });
    let wheelTotal=0,lastWheel=0,wheelConsumed=false;
    addEventListener('wheel',e=>{
      if(e.ctrlKey||document.querySelector('dialog[open]'))return;e.preventDefault();
      const now=performance.now();if(now-lastWheel>220){wheelTotal=0;wheelConsumed=false;}lastWheel=now;
      if(busy||wheelConsumed)return;
      const delta=(Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY)*(e.deltaMode===1?16:1);wheelTotal+=delta;
      if(Math.abs(wheelTotal)>65){wheelConsumed=true;step(wheelTotal>0?1:-1);}
    },{passive:false});
    let touch;
    main.addEventListener('touchstart',e=>{if(e.touches.length===1){const t=e.touches[0];touch={x:t.clientX,y:t.clientY};}else touch=null;},{passive:true});
    main.addEventListener('touchend',e=>{if(!touch||document.querySelector('dialog[open]'))return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.2)step(dx<0?1:-1);},{passive:true});
    // Keep a direct test and accessibility hook without exposing implementation controls in the UI.
    window.companyPager={go:(index,animated=false)=>go(index,animated),get current(){return current;},get count(){return frames.length;},get primaryCount(){return primaryFrames.length;}};
    go(hashIndex(),false,!!location.hash);
    const nativeChapterTransition='onpagereveal' in window;
    if(!nativeChapterTransition&&!reduced.matches){
      deck.animate([{opacity:0,transform:'translateX(18px)'},{opacity:1,transform:'translateX(0)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
      document.addEventListener('click',e=>{
        const link=e.target.closest('a[href]');if(!link||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||link.target||link.hasAttribute('download'))return;
        const url=new URL(link.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('.html')||url.pathname===location.pathname)return;
        // Keep the outgoing document painted while the destination loads.
        e.preventDefault();deck.animate([{opacity:1},{opacity:.78}],{duration:200,easing:'ease-out',fill:'forwards'}).finished.then(()=>location.assign(url.href));
      });
    }
    // Warm the five lightweight HTML documents; shared imagery remains browser-cached.
    for(const file of routes){if(file!==route){const link=document.createElement('link');link.rel='prefetch';link.href=file;link.as='document';document.head.append(link);}}
    // Recompose at device breakpoints; ordinary browser toolbar height changes do not reload.
    matchMedia('(max-width:760px)').addEventListener('change',()=>location.reload());
  }catch(error){
    main.innerHTML=backup;document.documentElement.classList.remove('paged');document.body.classList.remove('paged-site');
    if(originalFooter&&!originalFooter.isConnected)main.after(originalFooter);
    console.error('The page viewer could not initialize.',error);
  }
})();
