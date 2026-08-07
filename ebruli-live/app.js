import { media, pigments, techniques, translations } from './data.js';
import { EbruAtelier } from './atelier.js';
import { EbruliGuide } from './assistant.js';
import { atlasSVG, downloadSVG } from './atlas.js';

const state = {
  lang: localStorage.getItem('ebruli-lang') || 'tr',
  technique: 'Battal',
  pigment: 0,
  guide: new EbruliGuide({
    endpoint: localStorage.getItem('ebruli-ollama-endpoint') || 'http://127.0.0.1:11434',
    model: localStorage.getItem('ebruli-model') || 'qwen3.5:4b'
  }),
  milestones: JSON.parse(localStorage.getItem('anatolian-atlas-draft') || 'null')?.milestones || [
    { place: 'Başlangıç / Origin', note: '' },
    { place: 'Ayrılış / Departure', note: '' },
    { place: 'Yeni yer / Arrival', note: '' }
  ],
  atlasTitle: JSON.parse(localStorage.getItem('anatolian-atlas-draft') || 'null')?.title || 'Between places'
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const t = key => translations[state.lang]?.[key] || translations.en[key] || key;

function toast(message) {
  const old = $('.toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), 2800);
}

function nav() {
  return `
    <nav class="nav" aria-label="Primary navigation">
      <a class="brand" href="#top">EBRULİ<small>WATER · MEMORY · INTELLIGENCE</small></a>
      <div class="navlinks">
        <a href="#archive">${t('archive')}</a>
        <a href="#atelier">${t('atelier')}</a>
        <a href="#guide">${t('assistant')}</a>
        <a href="#atlas">${t('atlas')}</a>
        <a href="#workshops">${t('workshops')}</a>
        <a href="#local-ai">${t('system')}</a>
      </div>
      <div class="lang" aria-label="Language">
        ${['tr','de','en'].map(l => `<button data-lang="${l}" class="${state.lang===l?'active':''}">${l.toUpperCase()}</button>`).join('')}
      </div>
    </nav>`;
}

function hero() {
  return `
    <header id="top" class="hero">
      <div class="heroCopy">
        <div class="eyebrow">${t('heroEye')}</div>
        <h1>${t('heroA')}<em>${t('heroB')}</em></h1>
        <p class="lead">${t('lead')}</p>
        <div class="heroActions">
          <a class="cta" href="#atelier">${t('enter')}</a>
          <a class="ghost" href="#workshops">${t('book')}</a>
        </div>
        <div style="margin-top:24px"><span class="truth">Physical work is primary</span></div>
      </div>
      <div class="heroVisual">
        <img src="${media.hero}" alt="Documented physical Ebru process" loading="eager" />
        <div class="ripple" aria-hidden="true"></div>
      </div>
    </header>`;
}

function worlds() {
  const cards = [
    { href:'#archive', image:media.collage, name:t('physical'), text:t('physicalText'), label:'PHYSICAL / DOCUMENTED' },
    { href:'#atelier', image:media.process, name:t('digital'), text:t('digitalText'), label:'DIGITAL STUDY / LABELLED' },
    { href:'#atlas', image:media.workshop, name:t('atlasTitle'), text:t('atlasText'), label:'MEMORY / LOCAL-FIRST' }
  ];
  return `
    <section class="section" id="worlds">
      <div class="sectionHead">
        <h2>${t('worlds')}</h2>
        <p>${t('worldIntro')}</p>
      </div>
      <div class="worlds">
        ${cards.map(c => `<a class="world" href="${c.href}"><img src="${c.image}" alt="" loading="lazy"/><div class="worldCopy"><span>${c.label}</span><h3>${c.name}</h3><p>${c.text}</p></div></a>`).join('')}
      </div>
    </section>`;
}

function archive() {
  const cards = [
    {src:media.collage, label:'Physical works · documented archive'},
    {src:media.process, label:'Physical process · water tray'},
    {src:media.workshop, label:'Workshop documentation'},
    {src:media.hero, label:'Artist process · real media'}
  ];
  return `
    <section class="section" id="archive">
      <div class="sectionHead">
        <h2>${t('archiveTitle')}</h2>
        <div><p>${t('archiveText')}</p><div style="margin-top:18px"><span class="truth">Truth layer · physical provenance</span></div></div>
      </div>
      <div class="archiveGrid">
        ${cards.map(c => `<figure class="artCard"><img src="${c.src}" loading="lazy" alt="${c.label}"/><figcaption class="tag">${c.label}</figcaption></figure>`).join('')}
      </div>
    </section>`;
}

function atelierSection() {
  return `
    <section class="section" id="atelier">
      <div class="sectionHead">
        <h2>${t('atelierTitle')}</h2>
        <div><p>${t('atelierText')}</p><div style="margin-top:18px"><span class="truth">Digital studies are always labelled</span></div></div>
      </div>
      <div class="atelierShell">
        <div class="atelierTop">
          <h3>EBRULİ AI Atelier</h3>
          <span style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#b9b1a4">LOCAL · TOUCH · EXPORT</span>
        </div>
        <div class="atelierGrid">
          <aside class="toolRail" aria-label="Techniques">
            ${techniques.map(n => `<button class="techBtn ${state.technique===n?'active':''}" data-tech="${n}">${n}</button>`).join('')}
          </aside>
          <div class="trayWrap">
            <canvas id="ebruTray" class="tray" aria-label="Interactive digital Ebru water tray"></canvas>
            <div class="trayHint"><span id="trayTechnique">${state.technique}</span><span>Touch / drag on water</span></div>
          </div>
          <aside class="instrumentPanel">
            <div class="eyebrow" style="color:#c6a879;margin-bottom:12px">Pigment Library</div>
            <div class="pigments">
              ${pigments.map((p,i)=>`<button class="pigment ${state.pigment===i?'active':''}" data-pigment="${i}" title="${p.name}" aria-label="${p.name}" style="background:${p.hex}"></button>`).join('')}
            </div>
            <div id="pigmentName" style="font-family:var(--serif);font-size:20px;margin-bottom:20px">${pigments[state.pigment].name}</div>
            ${[
              ['drop','Drop size',28,8,70],
              ['spread','Gall / spread',70,10,100],
              ['visc','Viscosity',55,10,100],
              ['flow','Water flow',45,0,100]
            ].map(([id,label,val,min,max])=>`<div class="control"><label for="${id}"><span>${label}</span><output id="${id}Out">${val}</output></label><input id="${id}" type="range" min="${min}" max="${max}" value="${val}" /></div>`).join('')}
            <div class="miniActions">
              <button id="undoStudy">Undo</button><button id="clearStudy">Clear</button>
              <button class="primary" id="saveStudy">Save local</button><button class="primary" id="exportStudy">Export PNG</button>
            </div>
          </aside>
        </div>
      </div>
    </section>`;
}

function guideSection() {
  return `
    <section class="section" id="guide">
      <div class="sectionHead">
        <h2>${t('guideTitle')}</h2>
        <p>${t('guideText')}</p>
      </div>
      <div class="guideGrid">
        <aside class="statusPanel">
          <div class="eyebrow">Private AI status</div>
          <div class="statusRow"><span>Local Ollama</span><span style="display:flex;align-items:center;gap:8px"><i id="ollamaDot" class="dot"></i><b id="ollamaText">checking</b></span></div>
          <div class="statusRow"><span>Cloud Kimi K3</span><span style="display:flex;align-items:center;gap:8px"><i class="dot"></i><b>server only</b></span></div>
          <div class="statusRow"><span>Offline Guide</span><span style="display:flex;align-items:center;gap:8px"><i class="dot on"></i><b>ready</b></span></div>
          <label class="field" style="display:block;margin-top:18px"><span style="display:block;font-size:10px;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px">Local model</span>
            <select id="modelSelect" class="modelSelect">
              ${['qwen3.5:2b','qwen3.5:4b','qwen3.5:9b','gemma3:4b','gemma3:12b'].map(m=>`<option ${state.guide.model===m?'selected':''}>${m}</option>`).join('')}
            </select>
          </label>
          <p style="font-size:11px;color:var(--muted);line-height:1.6">No model? The site remains usable. Offline Guide is deterministic and says exactly when no AI model is connected.</p>
          <div class="quick">
            <button class="pill" data-q="Battal tekniğinde alanı nasıl sakin tutarım?">Battal</button>
            <button class="pill" data-q="Lale çalışması için nasıl ilerlemeliyim?">Lale</button>
            <button class="pill" data-q="Renklerim çamurlaştı, paleti nasıl sadeleştireyim?">Palette</button>
            <button class="pill" data-q="Anatolian Atlas için ilk üç hafıza durağını nasıl seçerim?">Atlas</button>
          </div>
        </aside>
        <div class="chat">
          <div class="messages" id="messages">
            <div class="msg ai">EBRULİ Guide hazır. Yerel Ollama bulunursa açık kaynak modelle konuşurum; bulunmazsa Offline Guide olarak şeffaf biçimde çalışırım.</div>
          </div>
          <div class="composer">
            <textarea id="chatInput" placeholder="Ask about Ebru technique, colour, workshop or memory…"></textarea>
            <button id="sendChat">Send</button>
          </div>
        </div>
      </div>
    </section>`;
}

function atlasSection() {
  return `
    <section class="section" id="atlas">
      <div class="sectionHead">
        <h2>${t('atlasHead')}</h2>
        <div><p>${t('atlasLead')}</p><div style="margin-top:18px"><span class="truth">Local by default · no upload</span></div></div>
      </div>
      <div class="atlasBuilder">
        <div class="atlasForm">
          <div class="field"><label>Portrait title</label><input id="atlasTitle" value="${state.atlasTitle.replaceAll('"','&quot;')}" /></div>
          <div class="eyebrow" style="margin:20px 0 10px">3–7 milestones</div>
          <div class="milestones" id="milestones"></div>
          <div class="atlasActions"><button id="addMilestone">+ Milestone</button><button id="saveAtlas">Save locally</button><button id="exportAtlas">Export SVG</button></div>
          <p style="font-size:11px;color:var(--muted);line-height:1.6;margin-top:18px">Origins · Departure · Arrival · Belonging · What We Carried · Return & Future. You choose what remains private.</p>
        </div>
        <div class="atlasCanvas" id="atlasPreview"></div>
      </div>
    </section>`;
}

function systemSection() {
  return `
    <section class="section" id="local-ai">
      <div class="sectionHead"><h2>${t('labTitle')}</h2><p>${t('labLead')}</p></div>
      <div class="systemDiagram">
        <div class="node"><strong>Browser</strong><p>EBRULİ interface, digital water tray, Atlas drafts. Works without a paid AI subscription.</p></div>
        <div class="node"><strong>EBRULİ</strong><p>Local-first routing. Offline Guide remains available if no model is connected.</p></div>
        <div class="node"><strong>Ollama / MLX</strong><p>Small open models on Apple Silicon for private technique guidance, writing and optional vision.</p></div>
        <div class="node"><strong>4 TB SSD</strong><p>Model weights, real art archive and future RAG index. Storage only — it does not increase unified memory.</p></div>
        <div class="node"><strong>Kimi K3</strong><p>Optional cloud/server frontier reasoning. Too large to treat as a practical MacBook Air local model.</p></div>
      </div>
      <table class="modelTable">
        <thead><tr><th>Unified memory</th><th>Practical starting point</th><th>Role</th></tr></thead>
        <tbody>
          <tr><td>8 GB</td><td>Qwen 3.5 2B / small Gemma</td><td>Light guide, writing, retrieval</td></tr>
          <tr><td>16 GB</td><td>Qwen 3.5 4B; 9B selectively</td><td>Daily local assistant, some vision</td></tr>
          <tr><td>24 GB</td><td>Qwen 3.5 9B / Gemma 3 12B</td><td>Stronger local reasoning / visual critique</td></tr>
          <tr><td>32 GB+</td><td>Larger MLX / Ollama experiments</td><td>Coding and heavier local workloads</td></tr>
        </tbody>
      </table>
      <p style="margin-top:18px;color:var(--muted);font-size:11px;line-height:1.7">Exact model fit depends on your MacBook Air’s unified memory, context length and workload. The external SSD expands storage capacity, not RAM.</p>
    </section>`;
}

function workshops() {
  const mail = `mailto:charlysmoky2010@gmail.com?subject=${encodeURIComponent('Water & Memory — Ebru Workshop Inquiry')}&body=${encodeURIComponent('Hello Yusuf,\n\nI would like to ask about the Water & Memory Ebru workshop.\n\nOrganisation / place:\nPreferred date:\nNumber of participants:\n\nBest regards,')}`;
  return `
    <section class="section" id="workshops">
      <div class="workshop">
        <div class="workshopMedia"><img src="${media.workshop}" alt="Documented Ebru workshop process" loading="lazy" /></div>
        <div class="workshopCopy">
          <div class="eyebrow">ANALOG FIRST · ADULT WORKSHOP</div>
          <h3>${t('workTitle')}</h3>
          <p class="lead" style="font-size:21px">${t('workLead')}</p>
          <div class="facts"><div class="fact"><b>3 hours</b><br/>guided analog practice</div><div class="fact"><b>8–10 adults</b><br/>ideal small group</div><div class="fact"><b>Real materials</b><br/>water, pigment, paper</div><div class="fact"><b>Optional digital layer</b><br/>reflection, not substitution</div></div>
          <div><a class="cta" href="${mail}">${t('contact')}</a></div>
        </div>
      </div>
    </section>`;
}

function principles() {
  const ps = [
    ['01','Physical first','The physical Ebru work and documented process are the source. Digital tools do not rewrite provenance.'],
    ['02','Label AI','Every generated or simulated study is visibly identified as digital and never presented as a physical Yusuf Şen work.'],
    ['03','Memory stays local','Anatolian Atlas drafts remain in the browser by default. Export is a deliberate user action.'],
    ['04','Private AI first','Sensitive stories should use local models where possible. Cloud inference is optional, not the default.']
  ];
  return `<section class="section" id="principles"><div class="sectionHead"><h2>${t('principles')}</h2><p>Technology is useful only when authorship, provenance and human choice remain visible.</p></div><div class="principles">${ps.map(([n,b,p])=>`<article class="principle"><div class="eyebrow">${n}</div><b>${b}</b><p>${p}</p></article>`).join('')}</div></section>`;
}

function footer() {
  return `<footer class="footer"><h2>EBRULİ</h2><p>Water · Memory · Intelligence<br/><br/>A living digital atelier around the physical Ebru practice of Yusuf Şen. Built local-first; open models are tools, not authors.</p></footer>`;
}

function render() {
  $('#app').innerHTML = `<main class="shell">${nav()}${hero()}${worlds()}${archive()}${atelierSection()}${guideSection()}${atlasSection()}${systemSection()}${workshops()}${principles()}${footer()}</main>`;
  wire();
}

function wire() {
  $$('.lang button').forEach(btn => btn.addEventListener('click', () => {
    state.lang = btn.dataset.lang;
    localStorage.setItem('ebruli-lang', state.lang);
    render();
  }));

  const canvas = $('#ebruTray');
  const atelier = new EbruAtelier(canvas, toast);
  atelier.setTech(state.technique);
  atelier.setPig(state.pigment);

  $$('.techBtn').forEach(btn => btn.addEventListener('click', () => {
    state.technique = btn.dataset.tech;
    atelier.setTech(state.technique);
    $$('.techBtn').forEach(b => b.classList.toggle('active', b === btn));
    $('#trayTechnique').textContent = state.technique;
  }));

  $$('.pigment').forEach(btn => btn.addEventListener('click', () => {
    state.pigment = Number(btn.dataset.pigment);
    atelier.setPig(state.pigment);
    $$('.pigment').forEach(b => b.classList.toggle('active', b === btn));
    $('#pigmentName').textContent = pigments[state.pigment].name;
  }));

  [['drop','drop',1],['spread','spread',.01],['visc','visc',.01],['flow','flow',.01]].forEach(([id,prop,scale]) => {
    const input = $(`#${id}`);
    input.addEventListener('input', () => { atelier[prop] = Number(input.value)*scale; $(`#${id}Out`).textContent = input.value; });
  });

  $('#undoStudy').onclick = () => atelier.undo();
  $('#clearStudy').onclick = () => atelier.clear();
  $('#exportStudy').onclick = () => atelier.export();
  $('#saveStudy').onclick = () => {
    try {
      const studies = JSON.parse(localStorage.getItem('ebruli-studies') || '[]');
      studies.unshift({ createdAt:new Date().toISOString(), technique:state.technique, pigment:pigments[state.pigment].name, data:canvas.toDataURL('image/jpeg',.74) });
      localStorage.setItem('ebruli-studies', JSON.stringify(studies.slice(0,6)));
      toast('Digital study saved locally in this browser.');
    } catch { toast('This browser could not save the study locally.'); }
  };

  $('#modelSelect').addEventListener('change', e => {
    state.guide.model = e.target.value;
    localStorage.setItem('ebruli-model', state.guide.model);
    toast(`Local model preference: ${state.guide.model}`);
  });

  $$('.quick button').forEach(btn => btn.addEventListener('click', () => { $('#chatInput').value = btn.dataset.q; sendChat(); }));
  $('#sendChat').onclick = sendChat;
  $('#chatInput').addEventListener('keydown', e => { if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendChat(); } });
  health();

  renderMilestones();
  $('#atlasTitle').addEventListener('input', e => { state.atlasTitle = e.target.value; renderAtlas(); });
  $('#addMilestone').onclick = () => {
    if(state.milestones.length >= 7) return toast('Maximum 7 milestones.');
    state.milestones.push({place:'',note:''}); renderMilestones();
  };
  $('#saveAtlas').onclick = () => {
    localStorage.setItem('anatolian-atlas-draft', JSON.stringify({title:state.atlasTitle,milestones:state.milestones}));
    toast('Atlas draft saved locally.');
  };
  $('#exportAtlas').onclick = () => downloadSVG(atlasSVG(state.atlasTitle,state.milestones));
}

async function health() {
  const ok = await state.guide.health();
  $('#ollamaDot')?.classList.toggle('on', ok);
  if($('#ollamaText')) $('#ollamaText').textContent = ok ? 'local model ready' : 'offline guide';
}

async function sendChat() {
  const input = $('#chatInput');
  const q = input.value.trim();
  if(!q) return;
  input.value = '';
  const box = $('#messages');
  const u = document.createElement('div'); u.className='msg user';u.textContent=q;box.append(u);box.scrollTop=box.scrollHeight;
  const wait = document.createElement('div');wait.className='msg ai';wait.textContent='…';box.append(wait);box.scrollTop=box.scrollHeight;
  const r = await state.guide.chat(q);
  wait.textContent = `${r.text}\n\n[${r.mode === 'local' ? `Local · ${state.guide.model}` : 'Offline Guide · no model connected'}]`;
  box.scrollTop=box.scrollHeight;
  if(r.mode==='offline') health();
}

function renderMilestones() {
  const box = $('#milestones');
  if(!box) return;
  box.innerHTML = state.milestones.map((m,i)=>`<div class="milestone"><input data-i="${i}" data-k="place" value="${String(m.place||'').replaceAll('"','&quot;')}" placeholder="Place / year"/><input data-i="${i}" data-k="note" value="${String(m.note||'').replaceAll('"','&quot;')}" placeholder="Short memory"/><button class="remove" data-remove="${i}" aria-label="Remove milestone">×</button></div>`).join('');
  $$('input[data-i]',box).forEach(el=>el.addEventListener('input',()=>{state.milestones[Number(el.dataset.i)][el.dataset.k]=el.value;renderAtlas()}));
  $$('[data-remove]',box).forEach(btn=>btn.addEventListener('click',()=>{if(state.milestones.length<=3)return toast('Keep at least 3 milestones.');state.milestones.splice(Number(btn.dataset.remove),1);renderMilestones()}));
  renderAtlas();
}

function renderAtlas() {
  const preview = $('#atlasPreview');
  if(preview) preview.innerHTML = atlasSVG(state.atlasTitle,state.milestones).replace('<svg ','<svg class="atlasSvg" ');
}

render();
