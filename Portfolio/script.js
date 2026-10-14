/* ==========================================================
   PORTFOLIO ENGINE v4 - Aniket Barai
========================================================== */
(() => {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const safeStore = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} }
  };
  const toast = (msg) => {
    const t = $('#toast'); if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200);
  };

  /* ---------- PRELOADER ---------- */
  document.body.classList.add('loading');
  const bootMsgs = ['initialising portfolio engine', 'loading MERN modules', 'mounting animations', 'compiling experience', 'ready....'];
  let heroStarted = false;
  function runBoot() {
    const lines = $('#boot-lines'), fill = $('#boot-fill'), pct = $('#boot-pct'), pre = $('#preloader');
    if (!pre) return startSite();
    let i = 0;
    const step = () => {
      if (i < bootMsgs.length) {
        const p = document.createElement('p'); p.textContent = bootMsgs[i]; lines.appendChild(p);
        const v = Math.round(((i + 1) / bootMsgs.length) * 100);
        fill.style.width = v + '%'; pct.textContent = v + '%';
        i++; setTimeout(step, reduceMotion ? 20 : 340);
      } else {
        setTimeout(() => { pre.classList.add('done'); document.body.classList.remove('loading'); startSite(); }, 250);
      }
    };
    step();
  }
  function startSite() {
    if (heroStarted) return; heroStarted = true;
    scramble($('#scramble-name'));
    startTyping();
    typeCode();
    initReveal();
    startBotToasts();
  }

  /* ---------- THEME ---------- */
  const THEMES = ['cyber-blue', 'executive-slate', 'royal-purple', 'sunset-orange', 'crimson-red'];
  const themeBtns = $$('.theme-btn');
  const applyTheme = (t) => {
    if (!THEMES.includes(t)) t = 'cyber-blue';
    document.documentElement.setAttribute('data-theme', t);
    safeStore.set('portfolio-theme', t);
    themeBtns.forEach(b => b.classList.toggle('active', b.dataset.themeId === t));
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    pcolors = null; // refresh particle colors
  };
  themeBtns.forEach(b => b.addEventListener('click', () => { applyTheme(b.dataset.themeId); toast('Theme: ' + (b.title || b.dataset.themeId)); }));

  /* ---------- DRAWER ---------- */
  const drawer = $('#theme-drawer'), overlay = $('#drawer-overlay');
  const setDrawer = (open) => { drawer?.classList.toggle('open', open); overlay?.classList.toggle('open', open); };
  $('#open-drawer')?.addEventListener('click', () => setDrawer(true));
  $('#close-drawer')?.addEventListener('click', () => setDrawer(false));
  overlay?.addEventListener('click', () => setDrawer(false));

  /* ---------- MOBILE NAV ---------- */
  const navToggle = $('#nav-toggle'), navLinksEl = $('#nav-links');
  navToggle?.addEventListener('click', () => { navToggle.classList.toggle('open'); navLinksEl.classList.toggle('open'); });
  $$('.nav-link').forEach(l => l.addEventListener('click', () => { navToggle?.classList.remove('open'); navLinksEl?.classList.remove('open'); }));

  /* ---------- SMOOTH ANCHORS ---------- */
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const t = $(id); if (!t) return;
    e.preventDefault(); t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));

  /* ---------- TEXT SCRAMBLE ---------- */
  function scramble(el) {
    if (!el) return;
    const final = el.dataset.text, chars = '!<>-_\\/[]{}=+*^?#01';
    if (reduceMotion) { el.textContent = final; return; }
    let frame = 0; const total = 36;
    const tick = () => {
      let out = '';
      for (let i = 0; i < final.length; i++) {
        if (final[i] === ' ') { out += ' '; continue; }
        out += frame / total * final.length > i ? final[i] : chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
      if (frame++ < total + 8) requestAnimationFrame(tick); else el.textContent = final;
    };
    tick();
    el.addEventListener('mouseenter', () => { if (frame > total) { frame = 0; tick(); } });
  }

  /* ---------- CONFIG CARD: type the code from blank to full ---------- */
  function typeCode() {
    const pre = $('#code-block'), code = $('#code-block code'); if (!pre || !code) return;
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT), nodes = [];
    for (let n; (n = walker.nextNode());) if (n.nodeValue) nodes.push({ node: n, full: n.nodeValue });
    pre.setAttribute('aria-label', code.textContent);
    if (reduceMotion) return;
    pre.style.minHeight = pre.offsetHeight + 'px';          // keep card size stable while empty
    nodes.forEach(o => { o.node.nodeValue = ''; });
    const caret = document.createElement('span');
    caret.className = 'caret code-caret'; caret.setAttribute('aria-hidden', 'true');
    code.insertBefore(caret, code.firstChild);
    let ni = 0, ci = 0;
    const tick = () => {
      if (ni >= nodes.length) return;                        // finished: caret keeps blinking
      const o = nodes[ni]; ci++;
      o.node.nodeValue = o.full.slice(0, ci);
      o.node.parentNode.insertBefore(caret, o.node.nextSibling);
      const ch = o.full[ci - 1];
      if (ci >= o.full.length) { ni++; ci = 0; }
      setTimeout(tick, ch === '\n' ? 170 : ch === ',' ? 90 : 22 + Math.random() * 38);
    };
    setTimeout(tick, 700);
  }

  /* ---------- TYPING ---------- */
  function startTyping() {
    const el = $('#typing'); if (!el) return;
    const words = ['MERN products', 'admin dashboards', 'vision-powered apps', 'client solutions'];
    if (reduceMotion) { el.textContent = words[0]; return; }
    let w = 0, c = 0, del = false;
    (function loop() {
      const word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(loop, 1400); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; return setTimeout(loop, 300); }
      c += del ? -1 : 1;
      setTimeout(loop, del ? 40 : 85);
    })();
  }

  /* ---------- REVEAL + COUNTERS + BARS ---------- */
  function initReveal() {
    const groups = new Map();
    $$('.reveal').forEach(el => {
      const p = el.parentElement; const n = groups.get(p) || 0; groups.set(p, n + 1);
      el.style.setProperty('--d', Math.min(n * 0.08, 0.5) + 's');
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in'); io.unobserve(e.target);
      $$('.counter', e.target).forEach(countUp);
      if (e.target.matches('.counter')) countUp(e.target);
      $$('.bar', e.target).forEach(b => b.classList.add('on'));
    }), { threshold: .15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  }
  $$('.bar').forEach(b => {
    const lvl = b.dataset.level || 0;
    $('em', b).style.setProperty('--w', lvl + '%');
    $('span', b).dataset.pct = lvl + '%';
  });
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const target = +el.dataset.target, suf = el.dataset.suffix || '';
    const dec = +el.dataset.dec || 0;
    if (reduceMotion) { el.textContent = target.toFixed(dec) + suf; return; }
    const dur = 1600, t0 = performance.now();
    (function f(t) {
      const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 4);
      el.textContent = (dec ? (target * eased).toFixed(dec) : Math.round(target * eased)) + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------- SCROLL: progress, nav hide, active link, timeline fill ---------- */
  const progress = $('#scroll-progress'), nav = $('#nav'), pill = $('#nav-pill');
  const links = $$('.nav-link'), sections = links.map(l => $(l.getAttribute('href')));
  let lastY = 0, ticking = false;
  function movePill(link) {
    if (!pill || !link || innerWidth <= 820) return;
    pill.style.width = link.offsetWidth + 'px'; pill.style.left = link.offsetLeft + 'px';
  }
  function onScroll() {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = (max > 0 ? y / max * 100 : 0) + '%';
    if (nav) {
      nav.classList.toggle('scrolled', y > 20);
      nav.classList.toggle('hide', y > lastY && y > 400 && !navLinksEl?.classList.contains('open'));
    }
    lastY = y;
    let cur = null;
    sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = links[i]; });
    links.forEach(l => l.classList.toggle('active', l === cur));
    if (cur) movePill(cur); else if (pill) pill.style.width = '0';
    // timeline fill
    const tl = $('#timeline'), fill = $('#tl-fill');
    if (tl && fill) {
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((innerHeight * .6 - r.top) / r.height, 0), 1);
      fill.style.height = p * 100 + '%';
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  $('#to-top')?.addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- CUSTOM CURSOR ---------- */
  if (finePointer && !reduceMotion) {
    const dot = $('#cursor-dot'), ring = $('#cursor-ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY; document.body.classList.add('has-cursor');
      dot.style.transform = `translate(${mx}px, ${my}px)`;
    });
    (function loop() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', e => {
      ring.classList.toggle('hover', !!e.target.closest('a, button, .filters button, input, label'));
    });
  }

  /* ---------- SPOTLIGHT (cards follow mouse, 1 update per frame) ---------- */
  let spotEv = null, spotRaf = 0;
  document.addEventListener('mousemove', e => {
    spotEv = e;
    if (spotRaf) return;
    spotRaf = requestAnimationFrame(() => {
      spotRaf = 0;
      const card = spotEv.target.closest?.('.spot-card'); if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (spotEv.clientX - r.left) + 'px');
      card.style.setProperty('--my', (spotEv.clientY - r.top) + 'px');
    });
  }, { passive: true });

  /* ---------- 3D TILT ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transition = 'transform .08s linear';
        el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(8px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
        el.style.transform = '';
      });
    });
  }

  /* ---------- MAGNETIC ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- PROJECT FILTER ---------- */
  $$('#filters button').forEach(btn => btn.addEventListener('click', () => {
    $$('#filters button').forEach(b => b.classList.remove('active')); btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.project').forEach(p => {
      const show = f === 'all' || p.dataset.cat.split(' ').includes(f);
      p.classList.toggle('hidden', !show);
      if (show) { p.classList.remove('pop'); void p.offsetWidth; p.classList.add('pop'); }
    });
  }));

  /* ---------- PARTICLE NETWORK BACKGROUND ---------- */
  const cv = $('#bg-canvas'); const ctx = cv?.getContext('2d');
  let W, H, parts = [], pcolors = null, fxOn = true;
  const mouse = { x: -999, y: -999 };
  function readColors() {
    const s = getComputedStyle(document.documentElement);
    pcolors = { a: s.getPropertyValue('--a').trim().replace(/\s+/g, ','), b: s.getPropertyValue('--b').trim().replace(/\s+/g, ',') };
  }
  function resizeCanvas() {
    if (!cv) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(Math.floor(W * H / 24000), 50);
    parts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, r: Math.random() * 1.6 + .6 }));
  }
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  function drawParticles() {
    if (!ctx) return;
    requestAnimationFrame(drawParticles);
    ctx.clearRect(0, 0, W, H);
    if (!fxOn || document.hidden) return;
    if (!pcolors) readColors();
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140) { p.x += dx / d * 1.4; p.y += dy / d * 1.4; }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283);
      ctx.fillStyle = `rgba(${pcolors.b},.8)`; ctx.fill();
      for (let j = i + 1; j < parts.length; j++) {
        const q = parts[j], dd = Math.hypot(p.x - q.x, p.y - q.y);
        if (dd < 130) {
          ctx.strokeStyle = `rgba(${pcolors.a},${(1 - dd / 130) * .25})`;
          ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      if (d < 180) {
        ctx.strokeStyle = `rgba(${pcolors.b},${(1 - d / 180) * .45})`;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
  }
  if (cv && !reduceMotion) { resizeCanvas(); addEventListener('resize', resizeCanvas); drawParticles(); }
  $('#toggle-fx')?.addEventListener('change', e => { fxOn = e.target.checked; safeStore.set('portfolio-fx', fxOn ? '1' : '0'); });

  /* ---------- COMMAND PALETTE ---------- */
  const palette = $('#palette'), pInput = $('#palette-input'), pList = $('#palette-list');
  const cycleTheme = () => { const cur = document.documentElement.dataset.theme; applyTheme(THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length]); };
  const go = id => () => $(id)?.scrollIntoView({ behavior: 'smooth' });
  const commands = [
    { t: 'Go to About', k: 'g a', run: go('#about') },
    { t: 'Go to Skills', k: 'g s', run: go('#skills') },
    { t: 'Go to Projects', k: 'g p', run: go('#projects') },
    { t: 'Go to Experience', k: 'g e', run: go('#experience') },
    { t: 'Go to Education', k: 'g d', run: go('#education') },
    { t: 'Go to Achievements', k: 'g w', run: go('#achievements') },
    { t: 'Go to Contact', k: 'g c', run: go('#contact') },
    { t: 'Cycle theme', k: 't', run: cycleTheme },
    { t: 'Toggle particles', k: 'f', run: () => { const c = $('#toggle-fx'); c.checked = !c.checked; c.dispatchEvent(new Event('change')); toast('Particles ' + (c.checked ? 'on' : 'off')); } },
    { t: 'Copy email', k: 'm', run: () => { navigator.clipboard?.writeText('aniketbarai678@gmail.com').then(() => toast('Email copied'), () => toast('Copy failed')); } },
    { t: 'Open GitHub', k: 'gh', run: () => open('https://github.com/aniketbarai', '_blank', 'noopener') },
    { t: 'Open LinkedIn', k: 'in', run: () => open('https://www.linkedin.com/in/aniketbarai/', '_blank', 'noopener') },
    { t: 'Download resume', k: 'r', run: () => { const a = document.createElement('a'); a.href = './Asset/AniketBarai_Resume.pdf'; a.download = ''; a.click(); } }
  ];
  let filtered = commands, sel = 0;
  function renderPalette() {
    pList.innerHTML = '';
    filtered.forEach((c, i) => {
      const li = document.createElement('li'); li.className = i === sel ? 'sel' : '';
      li.innerHTML = `<span>${c.t}</span><small>${c.k}</small>`;
      li.addEventListener('click', () => { closePalette(); c.run(); });
      li.addEventListener('mousemove', () => { sel = i; $$('li', pList).forEach((x, j) => x.classList.toggle('sel', j === i)); });
      pList.appendChild(li);
    });
  }
  function openPalette() { palette.classList.add('open'); pInput.value = ''; filtered = commands; sel = 0; renderPalette(); setTimeout(() => pInput.focus(), 50); }
  function closePalette() { palette.classList.remove('open'); }
  $('#open-palette')?.addEventListener('click', openPalette);
  palette?.addEventListener('click', e => { if (e.target === palette) closePalette(); });
  pInput?.addEventListener('input', () => {
    const q = pInput.value.toLowerCase();
    filtered = commands.filter(c => c.t.toLowerCase().includes(q)); sel = 0; renderPalette();
  });
  addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.classList.contains('open') ? closePalette() : openPalette(); return; }
    if (e.key === 'Escape') { closePalette(); setDrawer(false); }
    if (!palette?.classList.contains('open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % filtered.length; renderPalette(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); sel = (sel - 1 + filtered.length) % filtered.length; renderPalette(); }
    if (e.key === 'Enter' && filtered[sel]) { const c = filtered[sel]; closePalette(); c.run(); }
  });

  /* ---------- ARSENAL: DATA ---------- */
  const SKILLS = {
    'Languages': [
      { n: 'Java', l: 85, d: 'Object-oriented design, collections and exception handling. My main language for DSA and logic building.', u: ['Console Bank System', 'DSA practice'] },
      { n: 'JavaScript', l: 88, d: 'ES6+, async/await, DOM and the full MERN stack in a single language.', u: ['CRAFTON', 'Wedding Bingo', 'Interview PrepAI'] },
      { n: 'Python', l: 75, d: 'Computer vision and ML experiments with OpenCV and MediaPipe.', u: ['SignSpace'] },
      { n: 'SQL', l: 72, d: 'Relational modelling and queries; PostgreSQL for structured data.', u: ['Coursework', 'PostgreSQL'] },
      { n: 'HTML/CSS', l: 92, d: 'Semantic markup, responsive layouts, grid/flex and animation-heavy styling.', u: ['This portfolio', 'Ochi clone'] }
    ],
    'Frontend': [
      { n: 'React.js', l: 90, d: 'Component architecture, hooks, routing and state for production client apps.', u: ['CRAFTON', 'Wedding Bingo', 'Ochi clone'] },
      { n: 'Next.js', l: 72, d: 'Routing, SSR/SSG fundamentals and deployment on Vercel.', u: ['Side projects'] },
      { n: 'Tailwind CSS', l: 90, d: 'Utility-first design systems that stay consistent and fast to ship.', u: ['CRAFTON', 'Interview PrepAI'] },
      { n: 'Framer Motion', l: 82, d: 'Scroll-triggered and gesture animations that make interfaces feel alive.', u: ['Wedding Bingo'] }
    ],
    'Backend': [
      { n: 'Node.js', l: 85, d: 'Event-driven server runtime for APIs and tooling.', u: ['CRAFTON', 'Interview PrepAI'] },
      { n: 'Express.js', l: 85, d: 'REST API design, middleware, validation and error handling.', u: ['CRAFTON', 'Wedding Bingo'] },
      { n: 'MongoDB', l: 85, d: 'Schema design with Mongoose, aggregation and indexing for catalogue data.', u: ['500+ product catalogue'] },
      { n: 'JWT Auth', l: 82, d: 'Token auth with role-based access control for admin dashboards.', u: ['CRAFTON admin'] },
      { n: 'PostgreSQL', l: 68, d: 'Relational database work with joins and normalised schemas.', u: ['Coursework'] }
    ],
    'Tools & Deploy': [
      { n: 'Git & GitHub', l: 88, d: 'Branching, pull requests and clean commit history across client work.', u: ['Every project'] },
      { n: 'Vercel', l: 85, d: 'Frontend deployment with preview builds and env management.', u: ['CRAFTON', 'Interview PrepAI'] },
      { n: 'Render', l: 78, d: 'Hosting Node/Express APIs in production.', u: ['CRAFTON API'] },
      { n: 'Cloudinary', l: 82, d: 'Optimised image upload, transform and delivery.', u: ['CRAFTON'] },
      { n: 'ImageKit', l: 80, d: 'Fast CDN image delivery for gallery-heavy sites.', u: ['Wedding Bingo'] },
      { n: 'Postman', l: 85, d: 'API testing, collections and debugging request flows.', u: ['All APIs'] }
    ],
    'AI / Vision': [
      { n: 'OpenCV', l: 70, d: 'Real-time video capture and image processing pipelines.', u: ['SignSpace'] },
      { n: 'MediaPipe', l: 72, d: 'Hand landmark tracking for gesture-controlled interactions.', u: ['SignSpace'] },
      { n: 'Emotion AI', l: 62, d: 'Live emotion detection experiments on webcam streams.', u: ['SignSpace'] },
      { n: 'Prompting', l: 80, d: 'Integrating LLMs into products and shaping their output.', u: ['Interview PrepAI'] }
    ]
  };

  /* ---------- ARSENAL: TABS + RINGS ---------- */
  const tabsEl = $('#skill-tabs'), ringsEl = $('#skill-rings');
  if (tabsEl && ringsEl) {
    const NS = 'http://www.w3.org/2000/svg';
    const levelWord = l => l >= 88 ? 'Expert-level comfort' : l >= 78 ? 'Advanced' : l >= 68 ? 'Proficient' : 'Learning fast';
    const R = 32, C = 2 * Math.PI * R; // 201
    const showDetail = (s, cat) => {
      const box = $('#skill-detail');
      $('#detail-tag').textContent = cat + ' · ' + levelWord(s.l);
      $('#detail-title').textContent = s.n + ' - ' + s.l + '%';
      $('#detail-text').textContent = s.d;
      $('#detail-used').innerHTML = s.u.map(x => `<span>${x}</span>`).join('');
      box.classList.remove('flash'); void box.offsetWidth; box.classList.add('flash');
    };
    const renderRings = (cat) => {
      ringsEl.innerHTML = '';
      SKILLS[cat].forEach((s, i) => {
        const el = document.createElement('div'); el.className = 'ring'; el.style.setProperty('--i', i * .06 + 's');
        el.innerHTML = `<svg viewBox="0 0 80 80"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgb(${getComputedStyle(document.documentElement).getPropertyValue('--a').trim().replace(/\s+/g, ',')})"/><stop offset="1" stop-color="rgb(${getComputedStyle(document.documentElement).getPropertyValue('--b').trim().replace(/\s+/g, ',')})"/></linearGradient></defs><circle class="trk" cx="40" cy="40" r="${R}"/><circle class="val" cx="40" cy="40" r="${R}"/></svg><span class="pct">0</span><span class="nm">${s.n}</span>`;
        const val = $('.val', el), pct = $('.pct', el);
        el.addEventListener('mouseenter', () => showDetail(s, cat));
        el.addEventListener('click', () => { $$('.ring', ringsEl).forEach(r => r.classList.remove('sel')); el.classList.add('sel'); showDetail(s, cat); });
        ringsEl.appendChild(el);
        requestAnimationFrame(() => requestAnimationFrame(() => {
          val.style.strokeDashoffset = C * (1 - s.l / 100);
          const t0 = performance.now();
          (function f(t) { const p = Math.min((t - t0) / 1200, 1); pct.textContent = Math.round(s.l * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
        }));
      });
      showDetail(SKILLS[cat][0], cat);
    };
    Object.keys(SKILLS).forEach((cat, i) => {
      const b = document.createElement('button'); b.textContent = cat; b.setAttribute('role', 'tab');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => { $$('button', tabsEl).forEach(x => x.classList.remove('active')); b.classList.add('active'); renderRings(cat); });
      tabsEl.appendChild(b);
    });
    // render when scrolled into view so the ring animation is seen
    const first = Object.keys(SKILLS)[0];
    const ringIO = new IntersectionObserver(es => { if (es[0].isIntersecting) { renderRings(first); ringIO.disconnect(); } }, { threshold: .25 });
    ringIO.observe(ringsEl);
  }

  /* ---------- ARSENAL: 3D TECH GLOBE (optimised) ---------- */
  (function initGlobe() {
    const cvs = $('#globe'); if (!cvs) return;
    const g = cvs.getContext('2d', { alpha: true }), label = $('#globe-label');
    const tools = ['Java', 'JavaScript', 'Python', 'SQL', 'React', 'Next.js', 'Tailwind', 'Framer', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'JWT', 'REST', 'Git', 'GitHub', 'Postman', 'Vercel', 'Render', 'Cloudinary', 'ImageKit', 'Firebase', 'OpenCV', 'MediaPipe', 'HTML5', 'CSS3', 'VS Code', 'Mongoose'];
    const N = tools.length, cnt = $('#globe-count'); if (cnt) cnt.textContent = N;

    // fixed fibonacci sphere; rotation is a single matrix applied to the ORIGINAL points (no drift, no per-frame trig per point)
    const base = tools.map((t, i) => {
      const k = i + .5, phi = Math.acos(1 - 2 * k / N), th = Math.PI * (1 + Math.sqrt(5)) * k;
      return [Math.cos(th) * Math.sin(phi), Math.sin(th) * Math.sin(phi), Math.cos(phi)];
    });
    // precompute static links: each node to its 2 nearest neighbours (≈ 40 lines instead of 378 distance checks)
    const linkSet = new Set(), links = [];
    base.forEach((p, i) => {
      base.map((q, j) => [j, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2]).filter(x => x[0] !== i)
        .sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => {
          const key = i < j ? i + '-' + j : j + '-' + i;
          if (!linkSet.has(key)) { linkSet.add(key); links.push([i, j]); }
        });
    });

    // cached theme colours (no getComputedStyle inside the frame loop)
    let cA = '59,130,246', cB = '0,242,254';
    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      cA = s.getPropertyValue('--a').trim().replace(/\s+/g, ',') || cA;
      cB = s.getPropertyValue('--b').trim().replace(/\s+/g, ',') || cB;
    };
    readColors();
    new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    let w = 0, h = 0, rx = 0, ry = 0, vx = 0, vy = reduceMotion ? 0 : .0045;
    let drag = false, lx = 0, ly = 0, mx = -999, my = -999, hover = -1, visible = false, raf = 0, last = 0;
    const out = base.map(() => ({ x: 0, y: 0, z: 0, sx: 0, sy: 0 }));

    const resize = () => {
      const r = cvs.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 1.5);
      w = r.width; h = r.height; cvs.width = Math.round(w * d); cvs.height = Math.round(h * d); g.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });

    const pos = e => { const r = cvs.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cvs.addEventListener('pointerdown', e => { drag = true; [lx, ly] = pos(e); cvs.setPointerCapture(e.pointerId); });
    cvs.addEventListener('pointerup', () => { drag = false; });
    cvs.addEventListener('pointercancel', () => { drag = false; });
    cvs.addEventListener('pointermove', e => {
      const [x, y] = pos(e); mx = x; my = y;
      if (drag) { vy = (x - lx) * .004; vx = (y - ly) * .004; lx = x; ly = y; }
    });
    cvs.addEventListener('pointerleave', () => { mx = my = -999; drag = false; });

    const io = new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }, { threshold: 0 });
    io.observe(cvs);

    function frame(now) {
      raf = 0;
      if (!visible || document.hidden) return;           // fully stops the loop when off-screen
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 16.67, 3); last = now;  // frame-rate independent motion

      if (!drag) {
        vx *= Math.pow(.95, dt);                          // inertia decays toward idle spin
        vy += ((reduceMotion ? 0 : .0045) - vy) * .03 * dt;
      }
      const slow = hover >= 0 && !drag ? .15 : 1;         // calm down while hovering a tool
      rx += vx * dt * slow; ry += vy * dt * slow;

      const cxr = Math.cos(rx), sxr = Math.sin(rx), cyr = Math.cos(ry), syr = Math.sin(ry);
      const R = Math.min(w, h) * .4, cx = w / 2, cy = h / 2;
      for (let i = 0; i < N; i++) {
        const p = base[i], o = out[i];
        const y1 = p[1] * cxr - p[2] * sxr, z1 = p[1] * sxr + p[2] * cxr;
        const x2 = p[0] * cyr + z1 * syr, z2 = -p[0] * syr + z1 * cyr;
        const sc = 1 / (1.6 - z2 * .5);
        o.x = x2; o.y = y1; o.z = z2; o.sx = cx + x2 * R * sc * 1.45; o.sy = cy + y1 * R * sc * 1.45;
      }

      g.clearRect(0, 0, w, h);
      g.strokeStyle = `rgba(${cA},.12)`; g.lineWidth = 1;
      g.beginPath(); g.arc(cx, cy, R * 1.05, 0, 6.2832); g.stroke();

      // links, batched into two strokes (front / back) instead of one per line
      g.lineWidth = .8;
      for (let pass = 0; pass < 2; pass++) {
        g.strokeStyle = `rgba(${cA},${pass ? .3 : .09})`; g.beginPath();
        for (let k = 0; k < links.length; k++) {
          const a = out[links[k][0]], b = out[links[k][1]];
          if (((a.z + b.z) > 0.2) !== !!pass) continue;
          g.moveTo(a.sx, a.sy); g.lineTo(b.sx, b.sy);
        }
        g.stroke();
      }

      // hover detection + depth sort (28 items, trivial)
      let best = -1, bd = 1300;
      for (let i = 0; i < N; i++) { const o = out[i]; if (o.z < -.15) continue; const d = (o.sx - mx) ** 2 + (o.sy - my) ** 2; if (d < bd) { bd = d; best = i; } }
      hover = best;
      const order = out.map((_, i) => i).sort((a, b) => out[a].z - out[b].z);

      g.textAlign = 'center'; g.textBaseline = 'middle';
      for (let n = 0; n < N; n++) {
        const i = order[n], o = out[i], f = (o.z + 1) / 2, isH = i === hover;
        const size = Math.round((11 + f * 8) * (isH ? 1.3 : 1));
        g.globalAlpha = isH ? 1 : .22 + f * .78;
        if (isH) {                                          // cheap highlight: pill background instead of shadowBlur
          const tw = g.measureText(tools[i]).width + 22;
          g.fillStyle = `rgba(${cA},.28)`; g.beginPath(); g.roundRect(o.sx - tw / 2, o.sy - 14, tw, 28, 14); g.fill();
        }
        g.font = `${isH ? 700 : 600} ${size}px 'JetBrains Mono', monospace`;
        g.fillStyle = isH ? '#fff' : `rgb(${f > .6 ? cB : cA})`;
        g.fillText(tools[i], o.sx, o.sy);
      }
      g.globalAlpha = 1;
      cvs.style.cursor = hover >= 0 ? 'pointer' : (drag ? 'grabbing' : 'grab');
      const txt = hover >= 0 ? '› ' + tools[hover] : 'Drag to spin · hover a tool';
      if (label && label.textContent !== txt) label.textContent = txt;
    }
  })();

  /* ---------- EXPERIENCE: live months since Feb 2026 ---------- */
  const monthsEl = $('#exp-months');
  if (monthsEl) { const s = new Date(2026, 1, 1), n = new Date(); monthsEl.textContent = Math.max((n.getFullYear() - s.getFullYear()) * 12 + n.getMonth() - s.getMonth(), 1); }

  /* ---------- PORTRAIT: 3D tilt + parallax ---------- */
  const portrait = $('#portrait');
  if (portrait && finePointer && !reduceMotion) {
    let pr = 0;
    portrait.addEventListener('mousemove', e => {
      if (pr) return;
      pr = requestAnimationFrame(() => {
        pr = 0;
        const r = portrait.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        portrait.style.setProperty('--ry', (x * 18) + 'deg'); portrait.style.setProperty('--rx', (-y * 18) + 'deg');
        portrait.style.setProperty('--px', (-x * 14) + 'px'); portrait.style.setProperty('--py', (-y * 14) + 'px');
      });
    });
    portrait.addEventListener('mouseleave', () => ['--rx', '--ry', '--px', '--py'].forEach(k => portrait.style.removeProperty(k)));
  }

  /* ---------- BOT TOASTS ---------- */
const BOT_MESSAGES = [
  "Hey, gorgeous. 😉 I'm Aniket's PA. He built this portfolio to show off his skills... but between us, I think you just came for the plot twist. 💙",

  "Friendly reminder: Aniket writes code, solves problems, and builds cool things. Remembering to drink water? Still a work in progress. 💧😅",

  "Fun fact: this portfolio wasn't assembled by magic. I know, I know... developers are getting out of hand. 🤖",

  "Psst... try Ctrl + K. Aniket hide a little shortcut for curious minds. And I absolutely did not tell you that. 👀",

  "Aniket's debugging strategy: investigate the problem, trace the bug, fix the code, and pretend everything went according to plan. Classic. 🐛",

  "See that Skills section? Go spin the tech globe! It's interactive, it's satisfying, and yes, he spent time getting it just right. 🌎",

  "My professional opinion? Good code solves problems. Great UI makes people smile. Aniket tries to deliver both. I may be slightly biased. 🤭",

  "Have you visited CRAFTON under Projects yet? It's a real client project, not just another tutorial clone. This one's got actual business behind it. 🛍️",

  "Aniket calls himself a developer. I call him the person who turns 'Wouldn't it be cool if...' into something that actually works. 💡",

  "Feeling dark or light today? Try the theme switcher! Aniket believes even your portfolio should respect your mood. 🌙☀️",

  "He builds MERN applications, tackles tricky bugs, and keeps learning new technologies. Meanwhile, I still get nervous when someone opens DevTools. ☕🤖",

  "Looking for a teammate who cares about clean code, thoughtful design, and getting things done? I'd recommend Aniket. And no, he didn't pay me to say that. 👀",

  "Don't skip the Experience section! There's more to a developer than a list of technologies. Aniket has projects, responsibilities, and real work to show. 📌",

  "Recruiter detected! 🚨 Just kidding. But if you're looking for someone who enjoys building full-stack products and learning fast, you might want to stick around.",

  "A little birdie told me Aniket is always working on something new. I told the bird to check his GitHub before spreading more rumors. 🐦💻",

  "Want to make a human developer's day? Visit Contact and say hello. Aniket appreciates good conversations, interesting ideas, and exciting opportunities. 💌",

  "Behind every good developer is a mountain of documentation, a suspicious number of browser tabs, and at least one bug that makes absolutely no sense. 😭",

  "Plot twist: the best feature of this portfolio isn't the animations, the 3D elements, or the fancy UI. It's the human who built them. Okay, that was cheesy. I'll own it. 🧀",

  "If you're wondering whether Aniket can work on real projects, take a look at his Projects section. I could tell you all day, but I'd rather let the work speak. 🎯",

  "Okay, I'll stop talking now. Probably. Thanks for visiting Aniket's portfolio! Explore a little, break nothing, and definitely say hello before you leave. 💙"
];

function startBotToasts(){
  const stack = $('#bot-stack');
  if (!stack || stack.dataset.on) return;
  stack.dataset.on = '1';
  let muted = false;
  try { muted = localStorage.getItem('botMuted') === '1'; } catch (e) {}
  if (muted) return;

  const SHOW = 7000, GAP = 2000;
  const logo = '<svg viewBox="0 0 32 32" aria-hidden="true"><line class="b-line" x1="16" y1="3" x2="16" y2="8"/><circle class="b-ant" cx="16" cy="3" r="1.6"/><rect class="b-line" x="5" y="8" width="22" height="17" rx="6"/><ellipse class="b-eye" cx="12" cy="16" rx="1.8" ry="2.4"/><ellipse class="b-eye" cx="20" cy="16" rx="1.8" ry="2.4"/><path class="b-line" d="M12.5 21c2 1.6 5 1.6 7 0"/></svg>';
  let i = 0, stopped = false;

  const next = () => {
    if (stopped || i >= BOT_MESSAGES.length) return;
    const el = document.createElement('div');
    el.className = 'bot-toast';
    el.style.setProperty('--dur', SHOW + 'ms');
    el.innerHTML = '<div class="bot-av">' + logo + '</div><div class="bot-body"><div class="bot-name"><i></i>Aniket\u2019s Bot</div><p class="bot-msg"></p>' +
      (i === 0 ? '<button class="bot-mute" type="button">Mute bot</button>' : '') +
      '</div><button class="bot-x" type="button" aria-label="Dismiss">\u00d7</button><span class="bot-bar"></span>';
    el.querySelector('.bot-msg').textContent = BOT_MESSAGES[i++];
    stack.appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));

    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      el.classList.remove('show'); el.classList.add('out');
      setTimeout(() => el.remove(), 550);
      if (!stopped) setTimeout(next, GAP);
    };
    el.querySelector('.bot-x').addEventListener('click', close);
    const m = el.querySelector('.bot-mute');
    if (m) m.addEventListener('click', () => {
      stopped = true;
      try { localStorage.setItem('botMuted', '1'); } catch (e) {}
      close();
    });
    el.querySelector('.bot-bar').addEventListener('animationend', close);
  };
  setTimeout(next, 1500);
}

  /* ---------- BOOT ---------- */
  applyTheme(safeStore.get('portfolio-theme') || 'cyber-blue');
  if (safeStore.get('portfolio-fx') === '0') { fxOn = false; const c = $('#toggle-fx'); if (c) c.checked = false; }
  onScroll();
  addEventListener('load', () => { movePill($('.nav-link.active')); });
  runBoot();
  console.log('%cPortfolio Engine v4 loaded. Hiring? aniketbarai678@gmail.com', 'color:#3b82f6;font-size:13px');
})();