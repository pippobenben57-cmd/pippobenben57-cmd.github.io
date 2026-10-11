(() => {
  'use strict';
  const main = document.getElementById('content');
  const D = window.BUFFETT;
  if (!D) {
    main.innerHTML = '<h2>正文未能载入</h2><p>请检查网络后<a href="./">重新载入</a>，或先阅读<a href="https://www.berkshirehathaway.com/letters/letters.html">官方股东信</a>。</p>';
    return;
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const byId = (items, id) => items.find(x => x.id === id);
  const paras = xs => xs.map(x => `<p>${esc(x)}</p>`).join('');
  const href = (tab, id='') => `#${tab}${id ? '/' + encodeURIComponent(id) : ''}`;
  const tabs = {life:'行迹',book:'读《滚雪球》',cases:'决策与失误',ideas:'思想',people:'人物',timeline:'年表',sources:'原文与来源'};
  const memory = {life:D.stops[0].id,book:D.guides[0].id,cases:D.cases[0].id,ideas:D.ideas[0].id,people:'all',timeline:'all',sources:'reading'};
  let current = {tab:'life',id:memory.life};
  let caseFilter = '全部', timeFilter = '全部', searchLimit = 30;
  const places = {
    omaha:{name:'奥马哈',en:'Omaha',x:365,y:205,tx:350,ty:181,anchor:'middle'},
    lincoln:{name:'林肯',en:'Lincoln',x:342,y:224,tx:314,ty:253,anchor:'middle'},
    philadelphia:{name:'费城',en:'Philadelphia',x:583,y:199,tx:626,ty:226,anchor:'start'},
    ny:{name:'纽约',en:'New York',x:601,y:180,tx:632,ty:177,anchor:'start'},
    dc:{name:'华盛顿',en:'Washington, D.C.',x:566,y:224,tx:604,ty:266,anchor:'start'},
    newbedford:{name:'新贝德福德',en:'New Bedford',x:629,y:156,tx:594,ty:112,anchor:'middle'},
    la:{name:'洛杉矶',en:'Los Angeles',x:151,y:279,tx:142,ty:310,anchor:'middle'},
    sf:{name:'旧金山',en:'San Francisco',x:104,y:221,tx:73,ty:190,anchor:'middle'}
  };
  const refs = ids => `<div class="source-line"><span class="label">核对与延伸阅读</span>${[...new Set(ids)].filter(id=>D.sources[id]).map(id => `<a href="${esc(D.sources[id].url)}" target="_blank" rel="noopener noreferrer">${esc(D.sources[id].title)} ↗</a>`).join('')}</div>`;
  const relatedStops = ids => `<div class="related">${ids.map(id=>byId(D.stops,id)).filter(Boolean).map(x=>`<a href="${href('life',x.id)}">${esc(x.year)} · ${esc(x.title)} →</a>`).join('')}</div>`;
  const relatedCases = ids => `<div class="related">${ids.map(id=>{const c=byId(D.cases,id);const s=byId(D.stops,id);return c?`<a href="${href('cases',c.id)}">${esc(c.title)} →</a>`:s?`<a href="${href('life',s.id)}">${esc(s.title)} →</a>`:'';}).join('')}</div>`;
  function pager(items, tab, id) {
    const i = items.findIndex(x => x.id === id);
    return `<nav class="pager" aria-label="前后篇"><span>${i>0?`<a href="${href(tab,items[i-1].id)}">← 上一${tab==='life'?'站':'篇'}</a>`:'<span class="off">从这里开始</span>'}</span><span class="small muted">${i+1} / ${items.length}</span><span>${i<items.length-1?`<a href="${href(tab,items[i+1].id)}">下一${tab==='life'?'站':'篇'} →</a>`:'<span class="off">本组读完</span>'}</span></nav>`;
  }
  function listLayout(items, tab, selected, title, body, intro='') {
    const i = items.findIndex(x=>x.id===selected.id);
    return `${intro}<div class="mobile-selector"><label for="reading-select">${esc(title)} · ${i+1} / ${items.length}</label><select id="reading-select" data-select-tab="${tab}">${items.map((x,n)=>`<option value="${esc(x.id)}" ${x.id===selected.id?'selected':''}>${String(n+1).padStart(2,'0')} · ${esc(x.title)}</option>`).join('')}</select></div><div class="bookgrid"><aside class="toc" aria-label="${esc(title)}"><p class="toc-title">${esc(title)} / ${items.length} 篇</p>${items.map((x,n)=>`<a href="${href(tab,x.id)}" aria-current="${x.id===selected.id}"><span class="num">${String(n+1).padStart(2,'0')}</span>${esc(x.title)}${x.year?`<small>${esc(x.year)} · ${esc(x.tag||'')}</small>`:''}</a>`).join('')}</aside><article class="reading-text" id="article">${body}${pager(items,tab,selected.id)}</article></div>`;
  }
  function makeMap(place) {
    return `<div class="mapbox"><svg class="map" viewBox="0 0 710 420" role="group" aria-labelledby="map-title map-desc"><title id="map-title">巴菲特的生活与事业地点示意</title><desc id="map-desc">奥马哈、林肯、费城、纽约、华盛顿、新贝德福德、洛杉矶与旧金山。地点可以点击，地图下方也有对应按钮。</desc>
      <path class="land" d="M97 78 L122 84 L154 91 L208 99 L265 102 L322 104 L374 102 L400 118 L430 119 L449 137 L472 135 L484 148 L478 172 L501 178 L519 171 L542 173 L559 160 L579 164 L604 149 L627 137 L642 152 L627 168 L610 177 L600 197 L584 215 L582 235 L562 252 L551 281 L536 299 L543 325 L556 340 L548 357 L537 350 L521 322 L499 316 L471 315 L452 324 L420 312 L391 317 L371 332 L360 359 L341 351 L327 330 L317 307 L286 298 L270 276 L241 278 L221 291 L194 290 L171 283 L154 271 L144 250 L127 239 L113 213 L108 190 L92 169 L87 150 L92 126 L95 102 Z"/>
      <path class="geoline" d="M255 102 L247 279 M375 105 L370 306"/>
      <path class="route" d="M365 205 Q470 143 583 199 M365 205 Q465 93 601 180 M365 205 Q467 230 566 224 M365 205 Q239 194 151 279"/>
      <text class="caption" x="23" y="31">从奥马哈出发</text><text class="caption" x="23" y="51">生活与事业的发生地</text>
      <text class="ocean" x="32" y="347">Pacific</text><text class="ocean" x="603" y="330">Atlantic</text>
      ${Object.entries(places).map(([id,p])=>`<g class="city" role="button" tabindex="0" data-place="${id}" aria-label="查看${p.name}相关经历" aria-current="${place===id}"><line x1="${p.x}" y1="${p.y}" x2="${p.tx}" y2="${p.ty+4}" stroke="var(--rule)"/><circle cx="${p.x}" cy="${p.y}" r="${place===id?8:5}"/><text x="${p.tx}" y="${p.ty}" text-anchor="${p.anchor}">${p.name}</text></g>`).join('')}
      <text class="caption" x="23" y="395">虚线连接相关地点，不表示实际旅行路线</text></svg></div>`;
  }
  function life(id, placeOverride) {
    const s=byId(D.stops,id)||D.stops[0];current.id=s.id;memory.life=s.id;
    const placeKey=s.id==='study'&&['lincoln','philadelphia'].includes(placeOverride)?placeOverride:s.place;
    const p=places[placeKey];const group=D.stops.filter(x=>x.place===placeKey||(placeKey==='lincoln'&&x.id==='study'));
    main.innerHTML=`<div class="mapgrid"><div class="map-side">${makeMap(placeKey)}<div class="placechips" aria-label="按地点看经历">${Object.entries(places).map(([id,p])=>`<button type="button" data-place="${id}" aria-pressed="${id===placeKey}">${p.name}</button>`).join('')}</div><p class="note">地理位置为简化示意。商业事件按相关城市或奥马哈管理中枢归类，不代表他曾在那里长期居住；林肯与费城合并到求学一站。</p><div class="place-years"><p>${p.name} · ${group.length} 个节点</p>${group.map(x=>`<a href="${href('life',x.id)}" aria-current="${x.id===s.id}">${esc(x.year)}</a>`).join('')}</div></div><article class="story" id="article"><p class="eyebrow">第 ${String(D.stops.indexOf(s)+1).padStart(2,'0')} 站 · ${p.name}${s.after?'<span class="after">出版后延伸</span>':''}</p><h2>${esc(s.title)}</h2><p class="en">${esc(s.year)} / ${p.en}</p><div class="reading-text">${paras(s.body)}</div><ul class="events">${s.events.map(e=>`<li><span class="date">${esc(e[0])}</span><span class="event">${esc(e[1])}</span></li>`).join('')}</ul><div class="question"><span>留一个问题 · 本站思考</span><p>${esc(s.question)}</p></div>${refs(s.refs)}${pager(D.stops,'life',s.id)}</article></div><div class="journey-head"><h2>沿着一生往下走</h2><span class="small muted">${D.stops.length} 个节点 · 1930—2026</span></div><ol class="journey">${D.stops.map(x=>`<li><a href="${href('life',x.id)}" aria-current="${x.id===s.id}"><span class="yr">${esc(x.year)}</span>${x.after?'<span class="ext">延伸</span>':''}<span class="name">${esc(x.title)}</span></a></li>`).join('')}</ol>`;
  }
  function book(id) {
    const x=byId(D.guides,id)||D.guides[0];current.id=x.id;memory.book=x.id;
    main.innerHTML=listLayout(D.guides,'book',x,'十条阅读线索',`<header class="article-head"><p class="eyebrow">原创阅读导引 · ${esc(x.sub)}</p><h2>${esc(x.title)}</h2></header>${paras(x.body)}<h3>带着问题读</h3><ul class="questions">${x.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul><h3>回到人生里的具体一站</h3>${relatedStops(x.related)}${refs(x.refs)}`,'<p class="section-note">这些是本站为阅读设计的问题，不是原书目录或章节摘要。手边有书时，可以用事件和人物名称对照；没有书时，也可以沿着公开资料继续读。</p>');
  }
  function cases(id) {
    const allTags=['全部',...new Set(D.cases.map(x=>x.tag))];
    let items=D.cases.filter(x=>caseFilter==='全部'||x.tag===caseFilter);
    let x=byId(items,id)||items[0];current.id=x.id;memory.cases=x.id;
    const intro=`<h2>把决定拆开来看</h2><p class="section-note">每一笔都分成背景、选择、结果和问题。案例描述的是历史，不是今天的证券推荐；事后结果与事前判断要分开评价。</p><div class="filters" aria-label="筛选案例">${allTags.map(tag=>`<button type="button" data-case-filter="${tag}" aria-pressed="${caseFilter===tag}">${tag}</button>`).join('')}</div>`;
    const blocks=[['当时的背景',x.context],['作出的选择',x.decision],['后来的结果',x.result],['本站分析',x.lesson],['理解的边界',x.limit]];
    main.innerHTML=listLayout(items,'cases',x,'决策与失误',`<header class="article-head"><p class="eyebrow">${esc(x.year)} · ${esc(x.tag)}</p><h2>${esc(x.title)}</h2></header>${blocks.map(([t,b])=>`<section class="case-block"><h3>${t}</h3><p>${esc(b)}</p></section>`).join('')}<h3>在一生中的位置</h3>${relatedStops(x.related)}${refs(x.refs)}`,intro);
  }
  function calcHTML(){
    return `<section class="compound" aria-labelledby="compound-title"><h3 id="compound-title">把时间放进公式里</h3><p class="small muted">仅作数学演示：固定年回报、收益全部再投入，不计税费、通胀与提款。默认值没有预测含义。</p><div class="calc-controls"><label for="principal">初始金额（元）<input type="number" id="principal" min="1" max="100000000" step="any" value="10000"></label><label for="rate">假设年回报（%）<input type="number" id="rate" min="-50" max="50" step="0.5" value="5"></label><label for="years">年数<input type="number" id="years" min="1" max="80" step="1" value="20"></label></div><p id="calc-error" class="calc-error" hidden></p><p class="calc-result" id="calc-result" aria-live="polite"></p><svg class="calc-chart" id="calc-chart" viewBox="0 0 560 180" role="img" aria-label="按假设条件计算的复利示意曲线"></svg><p class="small muted">计算：期末金额 = 初始金额 × (1 + 年回报率)<sup>年数</sup>。现实收益不会按这条平滑曲线发生。</p></section>`;
  }
  function updateCalc(){
    const inputs=['principal','rate','years'].map(id=>document.getElementById(id));
    if(!inputs[0])return;
    const [p,r,n]=inputs.map(x=>Number(x.value));const err=document.getElementById('calc-error');
    const valid=inputs.every(x=>x.value.trim()!==''&&x.validity.valid)&&Number.isInteger(n)&&Number.isFinite(p)&&Number.isFinite(r)&&Number.isFinite(n);
    err.hidden=valid;
    if(!valid){err.textContent='金额须为 1 至 100,000,000，年回报为 −50% 至 50%，年数为 1 至 80 的整数。';document.getElementById('calc-result').textContent='请调整上面的数值。';document.getElementById('calc-chart').innerHTML='';return;}
    const vals=Array.from({length:n+1},(_,i)=>p*Math.pow(1+r/100,i));const end=vals[n],max=Math.max(...vals)*1.12;
    const format=v=>v.toLocaleString('zh-CN',{maximumFractionDigits:0});
    document.getElementById('calc-result').textContent=`${n} 年后：${format(end)} 元 · 约为本金的 ${(end/p).toFixed(2)} 倍`;
    const pts=vals.map((v,i)=>`${42+i/n*488},${144-v/max*120}`).join(' ');
    document.getElementById('calc-chart').innerHTML=`<title>假设 ${r}% 固定年回报下 ${n} 年的数学变化，非收益预测</title><path class="base" d="M42 16V144H534"/><line class="base" x1="42" y1="${144-p/max*120}" x2="530" y2="${144-p/max*120}" stroke-dasharray="4 4"/><polyline class="curve" points="${pts}"/><text x="42" y="165">第 0 年</text><text x="530" y="165" text-anchor="end">第 ${n} 年</text><text x="530" y="18" text-anchor="end">${esc(format(end))} 元</text>`;
  }
  function ideas(id){
    const x=byId(D.ideas,id)||D.ideas[0];current.id=x.id;memory.ideas=x.id;
    main.innerHTML=listLayout(D.ideas,'ideas',x,'十二个思想专题',`<header class="article-head"><p class="eyebrow">思想 · 本站归纳</p><h2>${esc(x.title)}</h2><p class="en">${esc(x.term)}</p></header>${paras(x.body)}<h3>试着做一次</h3><p>${esc(x.practice)}</p><div class="question"><span>容易误读的地方</span><p>${esc(x.misread)}</p></div>${x.id==='time'?calcHTML():''}<h3>用案例检验</h3>${relatedCases(x.related)}${refs(x.refs)}`,'<p class="section-note">以下标题与解释均为本站归纳，不冒充巴菲特原话。思想应回到具体案例中检验，尤其要读那些没有成功的决定。</p>');
    updateCalc();
  }
  function people(id){
    current.id=id==='all'||byId(D.people,id)?id:'all';memory.people=current.id;
    main.innerHTML=`<h2>一生不是一个人的作品</h2><p class="section-note">老师、家人、伙伴、经营者与作者。点击每个人下方的经历，回到他们相遇或作出选择的时刻。</p><div class="people-grid">${D.people.map(p=>`<article class="person${current.id===p.id?' focused':''}" id="person-${p.id}"><h3>${esc(p.name)}</h3><span class="en">${esc(p.en)}</span><p class="role">${esc(p.role)}</p><p>${esc(p.text)}</p>${relatedStops(p.related)}${refs(p.refs)}</article>`).join('')}</div>`;
  }
  function timeline(){
    current.id='all';memory.timeline='all';const items=D.stops.filter(s=>timeFilter==='全部'||(timeFilter==='出版后延伸'?s.after:!s.after));
    main.innerHTML=`<h2>一张可以来回翻的年表</h2><p class="section-note">以事件时期排序，部分阶段有重叠。2008 年出版节点以前为生涯主线；金融危机与此后经历另作公开资料补读。年份不代表每段经历都能精确划出起止日。</p><div class="filters" aria-label="筛选年表">${['全部','生涯主线','出版后延伸'].map(f=>`<button type="button" data-time-filter="${f}" aria-pressed="${timeFilter===f}">${f}</button>`).join('')}</div><div class="timeline">${items.map((s,i)=>`${s.after&&(i===0||!items[i-1].after)?'<div class="time-divider">延伸阅读 · 危机、巨型企业与交接</div>':''}<article class="time-row"><div class="year">${esc(s.year)}</div><div><h3><a href="${href('life',s.id)}">${esc(s.title)} →</a></h3><span class="local">${places[s.place].name}${s.after?' · 出版后延伸':''}</span><p>${s.events.map(e=>esc(e[0])+'：'+esc(e[1])).join('　')}</p></div></article>`).join('')}</div>`;
  }
  function sources(id){
    const choice=['reading','all','method'].includes(id)?id:'reading';current.id=choice;memory.sources=choice;
    let body='';
    if(choice==='reading')body=`<h2>回到他当时写下与说出的话</h2><p class="section-note">按年份排列的 ${D.reading.length} 个入口。这里提供阅读提示与原站链接；原文仍受相应版权保护。年度信通常在次年发布，列表按它所述的财务年度标记；最后一篇是阿贝尔于 2026 年发表的信。</p><ol class="read-list">${D.reading.map(x=>{const s=D.sources[x.source];return `<li><span class="year">${esc(x.year)}</span><div><h3><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)} ↗</a></h3><p>${esc(x.note)}</p><span class="source-title muted">${esc(s.title)}</span></div></li>`;}).join('')}</ol>`;
    if(choice==='all')body=`<h2>资料目录</h2><p class="section-note">${Object.keys(D.sources).length} 个资料入口。关键历史节点优先参考伯克希尔官方材料与当事人的公开发言；一般生平另参考学校、出版机构和 CNBC 的整理。</p><div class="bibliography">${Object.values(D.sources).map(s=>`<article class="bib"><small>${esc(s.kind)}</small><h3><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a></h3><p>${esc(s.note)}</p></article>`).join('')}</div>`;
    if(choice==='method')body=`<h2>怎么使用这份专题</h2><dl class="how"><dt>这是怎样的一本书？</dt><dd>《滚雪球》（The Snowball: Warren Buffett and the Business of Life）由艾丽斯·施罗德撰写，英文初版于 2008 年出版。巴菲特配合采访并提供资料，但它属于传记，不是他亲笔写的自传。<a href="${S('book')}">查看出版社介绍 ↗</a></dd><dt>本站写了什么？</dt><dd>这是原创人物概述、主题导引与商业案例分析，不提供原书全文、逐段翻译或逐章替代性复述，也未逐页校勘特定中文版本。阅读线索按主题另行组织，故不标原书页码。</dd><dt>事实与分析怎样区分？</dt><dd>生涯节点、交易背景与日期附公开来源；“留一个问题”“本站分析”“试着做一次”等文字为本站原创解读，并非当事人的原话。没有可核实出处的流传格言不作为引文收录。</dd><dt>原书与后续经历的分界</dt><dd>2008 年出版节点以前按人生阶段铺陈。金融危机交易及此后铁路、苹果、日本商社、管理交接，均标为延伸阅读；这些内容来自后续年报或公开访谈，不声称出自原书。</dd><dt>年报中的年份</dt><dd>“2024 年股东信”指谈论 2024 财务年度、通常于 2025 年发布的信。阿贝尔在 2026 年发表的首封年度信列为“2025 年年报”，作者已经改变。交接状态以官方公告与该年报核对，不沿用旧简介中的 CEO 头衔。</dd><dt>求学时间的口径</dt><dd>内布拉斯加大学校友页按 1951 届记载，部分生平资料按 1950 年完成学业记载。本站把本科与硕士合并到 1947—1951 的求学阶段，单独标明可核对的哥伦比亚 1951 年硕士学位。</dd><dt>地图表示什么？</dt><dd>手绘位置示意，不是精确底图。生活地点、企业所在地与奥马哈的管理决策被放在一起展示；虚线仅关联地点，不宣称还原实际出行路径。林肯与费城对应同一个求学节点。</dd><dt>案例结果与今天的选择</dt><dd>案例旨在理解当时的条件。文中金额若出现，均为注明时期的历史数字；没有提供实时持仓、证券估值、收益承诺或个性化买卖建议。普通股、优先股、认股权证与整家公司收购有不同权利，不能混为一谈。</dd><dt>来源也需要比较</dt><dd>股东信是管理者对股东的说明，访谈与传记有各自视角。来源链接便于回查，不等于每一项分析已有定论。内容由 AI 辅助整理，仍可能存在疏漏；新增证据应当用于修正。</dd><dt>一条简短的阅读顺序</dt><dd>先读行迹中的求学、芒格、喜诗和纺织四站，再看“决策与失误”里的喜诗与德克斯特；接着读“人物”中的家人，最后回到捐赠与交接。完整阅读可以沿年表逐站展开。</dd></dl>`;
    main.innerHTML=`<nav class="source-nav" aria-label="资料分类">${[['reading','原文阅读顺序'],['all','全部来源'],['method','资料口径与边界']].map(([v,t])=>`<a href="${href('sources',v)}" aria-current="${choice===v}">${t}</a>`).join('')}</nav>${body}`;
  }
  function S(id){return esc(D.sources[id].url);}
  function route(initial=false){
    let parts;try{parts=decodeURIComponent(location.hash.slice(1)).split('/');}catch{parts=['life'];}
    if(parts[0]==='content'){main.focus({preventScroll:true});return;}
    const tab=Object.hasOwn(tabs,parts[0])?parts[0]:'life';let id=parts[1]||memory[tab];
    if(tab==='cases'&&byId(D.cases,id)&&caseFilter!=='全部'&&byId(D.cases,id).tag!==caseFilter)caseFilter='全部';
    current={tab,id};
    document.querySelectorAll('[data-tab]').forEach(a=>{if(a.dataset.tab===tab)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(tab==='life')life(id,parts[2]);else ({book,cases,ideas,people,timeline,sources})[tab](id);
    document.title=`${tabs[tab]} · 巴菲特 · 滚雪球 — 渊默的学习小院`;
    if(!initial){
      if(tab==='people'&&current.id!=='all')document.getElementById('person-'+current.id)?.scrollIntoView({block:'start'});
      else main.scrollIntoView({block:'start'});
      main.focus({preventScroll:true});
    }
  }
  const searchItems=[];
  const flatten=v=>typeof v==='string'?v:Array.isArray(v)?v.map(flatten).join(' '):v&&typeof v==='object'?Object.entries(v).filter(([k])=>!['id','refs','related','url','after','source','place'].includes(k)).map(([,v])=>flatten(v)).join(' '):'';
  for(const [key,tab] of [['stops','life'],['guides','book'],['cases','cases'],['ideas','ideas'],['people','people']])for(const item of D[key])searchItems.push({title:item.title||item.name,where:tabs[tab],route:href(tab,item.id),text:flatten(item)});
  for(const s of Object.values(D.sources))searchItems.push({title:s.title,where:'来源',url:s.url,text:s.title+' '+s.note});
  const q=document.getElementById('q'), results=document.getElementById('search-results'),status=document.getElementById('search-status'),clear=document.getElementById('clear-search');
  function highlight(text,query){
    const at=text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());
    return at<0?esc(text):esc(text.slice(0,at))+'<mark>'+esc(text.slice(at,at+query.length))+'</mark>'+esc(text.slice(at+query.length));
  }
  function search(){
    const query=q.value.trim().slice(0,200);clear.hidden=!query;
    if(!query){results.hidden=true;results.innerHTML='';status.textContent='';return;}
    const hits=searchItems.filter(x=>x.text.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
    results.hidden=false;status.textContent=`找到 ${hits.length} 条相关内容`;
    results.innerHTML=`<h2>“${esc(query)}” · ${hits.length} 条结果</h2>${hits.length?hits.slice(0,searchLimit).map(x=>{const at=x.text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase());const snippet=x.text.slice(Math.max(0,at-34),at+query.length+90);return `<a class="search-hit" href="${esc(x.url||x.route)}" ${x.url?'target="_blank" rel="noopener noreferrer"':'data-search-hit="true"'}><span class="where">${esc(x.where)}</span><span class="title">${highlight(x.title,query)}${x.url?' ↗':' →'}</span><p>${at>34?'…':''}${highlight(snippet,query)}${at+query.length+90<x.text.length?'…':''}</p></a>`;}).join(''):'<p class="empty">没有找到。可以试试人物姓名、公司名称，或“家庭”“承保”“错误”等关键词。</p>'}${hits.length>searchLimit?'<button class="search-more" type="button" id="more-search">显示更多结果</button>':''}`;
  }
  function clearSearch(){q.value='';searchLimit=30;search();}
  q.addEventListener('input',()=>{searchLimit=30;search();});
  q.addEventListener('keydown',e=>{if(e.key==='Escape')clearSearch();});
  clear.addEventListener('click',()=>{clearSearch();q.focus();});
  function goPlace(p){
    const target=p==='lincoln'?'study':D.stops.find(s=>s.place===p)?.id;
    if(target){const hash=href('life',target)+(p==='lincoln'?'/lincoln':'');if(location.hash===hash)life(target,p);else location.hash=hash;}
  }
  document.addEventListener('click',e=>{
    const place=e.target.closest('[data-place]');if(place){goPlace(place.dataset.place);return;}
    const filter=e.target.closest('[data-case-filter]');if(filter){caseFilter=filter.dataset.caseFilter;const item=D.cases.find(c=>caseFilter==='全部'||c.tag===caseFilter);memory.cases=item.id;current={tab:'cases',id:item.id};history.replaceState(null,'',href('cases',item.id));cases(item.id);return;}
    const time=e.target.closest('[data-time-filter]');if(time){timeFilter=time.dataset.timeFilter;timeline();return;}
    if(e.target.closest('#more-search')){searchLimit+=30;search();return;}
    const hit=e.target.closest('[data-search-hit]');if(hit){const same=location.hash===hit.getAttribute('href');clearSearch();if(same)route(false);}
    const tab=e.target.closest('[data-tab]');if(tab&&current.tab===tab.dataset.tab){e.preventDefault();main.scrollIntoView({block:'start'});}
  });
  document.addEventListener('keydown',e=>{const place=e.target.closest('g[data-place]');if(place&&(e.key==='Enter'||e.key===' ')){e.preventDefault();goPlace(place.dataset.place);}});
  document.addEventListener('change',e=>{if(e.target.matches('[data-select-tab]'))location.hash=href(e.target.dataset.selectTab,e.target.value);});
  document.addEventListener('input',e=>{if(['principal','rate','years'].includes(e.target.id))updateCalc();});
  let theme='auto';try{const saved=localStorage.getItem('buffett-theme');if(['auto','light','dark'].includes(saved))theme=saved;}catch{}
  function applyTheme(){if(theme==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.dataset.theme=theme;document.getElementById('theme').textContent='配色：'+({auto:'随系统',light:'浅色',dark:'深色'}[theme]);}
  document.getElementById('theme').addEventListener('click',()=>{theme={auto:'light',light:'dark',dark:'auto'}[theme];applyTheme();try{localStorage.setItem('buffett-theme',theme);}catch{}});
  applyTheme();
  document.getElementById('stat').textContent=`${D.stops.length} 站人生 · ${D.cases.length} 个案例 · ${D.people.length} 位人物 · ${D.reading.length} 篇原文入口`;
  window.addEventListener('hashchange',()=>route());route(true);
})();
