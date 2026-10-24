// Eternal Growth — motion and behaviour, built on GSAP 3.13 and its plugins.
// Everything degrades: without GSAP or WebGL, or with reduced motion, all content is visible and links simply navigate.
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const desktop = () => innerWidth > 860;
  const G = window.gsap;
  const has = (n) => typeof window[n] !== 'undefined';
  const ok = !!G && has('ScrollTrigger');
  if (ok) G.registerPlugin(...['ScrollTrigger', 'ScrollSmoother', 'SplitText', 'DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'ScrambleTextPlugin'].filter(has).map((n) => window[n]));
  const motion = ok && !reduce;
  const ST = window.ScrollTrigger;
  let smoother = null;
  const showAll = () => document.querySelectorAll('[data-rise]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });

  /* ---------------------------------------------------------------- smooth scrolling */
  if (motion && has('ScrollSmoother') && document.getElementById('smooth-wrapper')) {
    smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: true, smoothTouch: false });
  }
  function scrollToEl(el, offset = 90) {
    if (!el) return;
    if (smoother) smoother.scrollTo(el, true, `top ${offset}px`);
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  if (smoother && location.hash) {
    const t = document.querySelector(location.hash);
    if (t) addEventListener('load', () => setTimeout(() => smoother.scrollTo(t, false, 'top 90px'), 80));
  }

  /* ---------------------------------------------------------------- the grey haze */
  const atmos = document.querySelector('.atmos');
  let fog = null;
  if (atmos && !reduce && window.VANTA && VANTA.FOG && window.THREE) {
    try {
      fog = VANTA.FOG({ el: atmos, THREE: window.THREE, mouseControls: false, touchControls: false, gyroControls: false, minHeight: 200, minWidth: 200,
        highlightColor: 0xfbfbf9, midtoneColor: 0xd4d4cf, lowlightColor: 0xaeaea8, baseColor: 0xf0f0ed, blurFactor: 0.6, speed: 0.75, zoom: 0.85 });
    } catch (e) { fog = null; }
  }
  addEventListener('pagehide', () => { if (fog) { fog.destroy(); fog = null; } });
  if (motion) G.utils.toArray('.atmos__orb').forEach((orb, i) => G.to(orb, { x: () => G.utils.random(-120, 120), y: () => G.utils.random(-90, 90), scale: () => G.utils.random(0.85, 1.2), duration: G.utils.random(9, 14), ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true, delay: i }));

  /* ---------------------------------------------------------------- soft rain */
  const rain = document.querySelector('.rain');
  if (rain && motion) {
    const ctx = rain.getContext('2d');
    let W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2), drops = [], wind = 0, windTo = 0, running = true;
    const make = (y) => {
      const z = Math.random();
      return { x: Math.random() * (W + 200) - 100, y: y ?? Math.random() * H, z, len: 14 + z * 46, speed: 5 + z * 13, w: 0.5 + z * 1.4, a: 0.06 + z * 0.18 };
    };
    const size = () => {
      W = innerWidth; H = innerHeight;
      rain.width = W * dpr; rain.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(160, (W * H) / 9000));
      drops = Array.from({ length: n }, () => make());
    };
    size(); addEventListener('resize', size);
    addEventListener('pointermove', (e) => { windTo = (e.clientX / innerWidth - 0.5) * 2.4; }, { passive: true });
    document.addEventListener('visibilitychange', () => { running = !document.hidden; });
    G.ticker.add(() => {
      if (!running) return;
      wind += (windTo - wind) * 0.03;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (const d of drops) {
        d.y += d.speed; d.x += wind * (0.6 + d.z);
        if (d.y - d.len > H) Object.assign(d, make(-d.len));
        ctx.strokeStyle = `rgba(70, 70, 66, ${d.a})`;
        ctx.lineWidth = d.w;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - wind * d.len * 0.08, d.y - d.len); ctx.stroke();
      }
    });
  }

  /* ---------------------------------------------------------------- page transition */
  const shutter = document.querySelector('.shutter');
  const bars = shutter ? [...shutter.querySelectorAll('i')] : [];
  const word = shutter && shutter.querySelector('.shutter__word');
  function arrive() {
    if (!root.classList.contains('is-arriving')) return;
    if (!motion || !shutter) { root.classList.remove('is-arriving'); return; }
    G.timeline({ onComplete: () => { root.classList.remove('is-arriving'); G.set(bars, { clearProps: 'transform' }); } })
      .set(bars, { scaleY: 1, transformOrigin: 'top' })
      .set(word, { opacity: 1, textContent: document.title.split(' — ')[0] })
      .to(word, { opacity: 0, y: -30, duration: 0.5, ease: 'power2.in' }, 0.15)
      .to(bars, { scaleY: 0, duration: 0.9, ease: 'expo.inOut', stagger: { each: 0.07, from: 'center' } }, 0.25);
  }
  function leave(href, label) {
    if (!motion || !shutter) { location.href = href; return; }
    try { sessionStorage.setItem('eg-arrive', '1'); } catch (e) { /* still navigates */ }
    shutter.style.visibility = 'visible';
    const tl = G.timeline({ onComplete: () => { location.href = href; } });
    tl.set(bars, { scaleY: 0, transformOrigin: 'bottom' })
      .set(word, { opacity: 0, y: 30, textContent: '' })
      .to(bars, { scaleY: 1, duration: 0.75, ease: 'expo.inOut', stagger: { each: 0.06, from: 'edges' } })
      .to(word, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.45);
    if (has('ScrambleTextPlugin')) tl.to(word, { duration: 0.6, scrambleText: { text: label, chars: 'lowerCase', speed: 0.6 } }, 0.45);
    else tl.set(word, { textContent: label }, 0.45);
  }
  const pageName = (url) => ({ 'index.html': 'Home', 'subjects.html': 'Subjects', 'impact.html': 'Impact', 'about.html': 'About', 'team.html': 'Team' }[url.pathname.split('/').pop() || 'index.html'] || 'Eternal Growth');
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    const samePage = url.pathname === location.pathname || (url.pathname.endsWith('/') && location.pathname.endsWith('index.html'));
    if (samePage && url.search === location.search) {
      if (url.hash) { e.preventDefault(); closeMenu(); scrollToEl(document.querySelector(url.hash)); }
      return;
    }
    if (!/\.html$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    leave(url.href, pageName(url));
  });
  addEventListener('pageshow', (e) => { if (e.persisted && shutter) { shutter.style.visibility = ''; if (G) G.set(bars, { clearProps: 'transform' }); } });

  /* ---------------------------------------------------------------- cursor, magnetic buttons, spotlights */
  if (fine && motion) {
    const cur = document.querySelector('.cursor');
    if (cur) {
      const label = cur.querySelector('span');
      const cx = G.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
      const cy = G.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
      addEventListener('pointermove', (e) => { root.classList.add('has-cursor'); cx(e.clientX); cy(e.clientY); }, { passive: true });
      document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
      document.addEventListener('pointerover', (e) => {
        const l = e.target.closest('[data-cursor]');
        cur.classList.toggle('is-label', !!l);
        if (l) label.textContent = l.dataset.cursor;
        cur.classList.toggle('is-hover', !l && !!e.target.closest('a, button, select, input, textarea'));
      });
    }
    document.querySelectorAll('.btn, .slider__btn').forEach((b) => {
      const mx = G.quickTo(b, 'x', { duration: 0.6, ease: 'power3' });
      const my = G.quickTo(b, 'y', { duration: 0.6, ease: 'power3' });
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        const px = e.clientX - r.left, py = e.clientY - r.top;
        b.style.setProperty('--bx', px + 'px'); b.style.setProperty('--by', py + 'px');
        mx((px - r.width / 2) * 0.22); my((py - r.height / 2) * 0.3);
      });
      b.addEventListener('pointerleave', () => { mx(0); my(0); });
    });
    document.addEventListener('pointermove', (e) => {
      const c = e.target.closest && e.target.closest('.card');
      if (c) { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }
      const n = e.target.closest && e.target.closest('.nav');
      if (n) n.style.setProperty('--nx', e.clientX - n.getBoundingClientRect().left + 'px');
    }, { passive: true });
    const orbs = G.utils.toArray('.atmos__orb').map((o, i) => ({ x: G.quickTo(o, 'xPercent', { duration: 2.4, ease: 'power3' }), y: G.quickTo(o, 'yPercent', { duration: 2.4, ease: 'power3' }), d: (i + 1) * 6 }));
    const depth = G.utils.toArray('[data-depth]').map((el) => ({ x: G.quickTo(el, 'x', { duration: 1.4, ease: 'power3' }), y: G.quickTo(el, 'y', { duration: 1.4, ease: 'power3' }), d: parseFloat(el.dataset.depth) }));
    addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      orbs.forEach((o) => { o.x(nx * o.d); o.y(ny * o.d); });
      depth.forEach((l) => { l.x(nx * l.d * 100); l.y(ny * l.d * 100); });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- nav */
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.nav__menu');
  function closeMenu() { if (nav) { nav.classList.remove('is-open'); if (menu) menu.setAttribute('aria-expanded', 'false'); } }
  if (nav && menu) {
    menu.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      menu.setAttribute('aria-expanded', String(open));
      if (open && motion) G.from(nav.querySelectorAll('.nav__links a'), { yPercent: 100, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.25 });
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((a) => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  if (nav) {
    let last = 0;
    const onScroll = () => {
      const y = smoother ? smoother.scrollTop() : scrollY;
      if (y > last + 2 && y > 600 && !nav.classList.contains('is-open')) nav.classList.add('is-hidden');
      if (y < last - 2) nav.classList.remove('is-hidden');
      last = y;
    };
    if (ST) ST.create({ start: 0, end: 'max', onUpdate: onScroll }); else addEventListener('scroll', onScroll, { passive: true });
  }
  if (motion && fine && has('ScrambleTextPlugin')) {
    document.querySelectorAll('.nav__links a, .footer__col a').forEach((a) => {
      const text = a.textContent;
      a.addEventListener('pointerenter', () => G.to(a, { duration: 0.5, scrambleText: { text, chars: 'lowerCase', speed: 0.8 }, overwrite: true }));
    });
  }

  /* ---------------------------------------------------------------- shapes */
  const SHAPES = {
    triangle: 'M100 18 182 168H18Z',
    page: 'M30 30H170V170H30Z',
    hexagon: 'M100 14 174 57V143L100 186 26 143V57Z',
    diamond: 'M100 12 188 100 100 188 12 100Z',
    circle: 'M100 14A86 86 0 1 1 99.9 14Z',
    globe: 'M14 100A86 86 0 0 1 186 100H14Z M14 112H186A86 86 0 0 1 14 112Z',
    star: 'M100 8 120 80 192 100 120 120 100 192 80 120 8 100 80 80Z',
    coin: 'M100 20A80 80 0 1 1 99.9 20Z M100 56A44 44 0 1 0 100.1 56Z',
    check: 'M24 104 56 72 86 102 146 40 178 72 86 164Z',
    heart: 'M100 172C40 128 14 96 14 66 14 40 36 22 60 22 78 22 92 32 100 46 108 32 122 22 140 22 164 22 186 40 186 66 186 96 160 128 100 172Z',
    wave: 'M10 112Q35 82 60 112T110 112T160 112T190 112V158H10Z',
    book: 'M18 40H88Q100 40 100 52V170Q100 158 88 158H18Z M112 52Q112 40 124 40H182V158H124Q112 158 112 170Z',
  };
  const LOOP = ['triangle', 'page', 'hexagon', 'diamond', 'circle', 'globe', 'star'];
  const NAMES = ['Mathematics', 'English', 'Science', 'Coding', 'Music', 'Social studies', 'Beyond'];
  function morphLoop(path, label, offset = 0) {
    if (!path || !motion || !has('MorphSVGPlugin')) return;
    const tl = G.timeline({ repeat: -1, delay: 1.2 + offset });
    LOOP.forEach((s, i) => {
      tl.to(path, { morphSVG: { shape: SHAPES[LOOP[(i + 1) % LOOP.length]], type: 'rotational' }, duration: 1.1, ease: 'expo.inOut' }, '+=1.3');
      if (label && has('ScrambleTextPlugin')) tl.to(label, { duration: 0.8, scrambleText: { text: NAMES[(i + 1) % NAMES.length], chars: 'lowerCase', speed: 0.7 } }, '<');
    });
  }

  /* ---------------------------------------------------------------- hero: thorns draw, icons orbit */
  function hero() {
    if (!motion) return;
    const thorns = document.querySelector('.hero__thorns');
    if (thorns && has('DrawSVGPlugin')) {
      G.fromTo(thorns.querySelectorAll('path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 3.2, ease: 'power2.inOut', stagger: 0.12, delay: 0.3 });
      G.to(thorns, { rotate: 360, duration: 160, ease: 'none', repeat: -1 });
      G.to(thorns, { scale: 1.15, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    }
    const chips = G.utils.toArray('.orb-chip');
    if (chips.length && has('MotionPathPlugin')) {
      chips.forEach((c, i) => {
        G.set(c, { opacity: 0, scale: 0.6 });
        G.to(c, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)', delay: 0.8 + i * 0.08 });
        G.to(c, { motionPath: { path: '#orbit-path', align: '#orbit-path', alignOrigin: [0.5, 0.5], start: i / chips.length, end: i / chips.length + 1 }, duration: 48, ease: 'none', repeat: -1 });
      });
    }
    G.to('.hero__inner', { yPercent: -14, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* ---------------------------------------------------------------- text animations (SplitText) */
  function textAnimations() {
    if (!motion || !has('SplitText')) { showAll(); return; }
    const enter = (el, start = 'top 86%') => ({ trigger: el, start, toggleActions: 'play none none reverse' });
    document.querySelectorAll('[data-anim]').forEach((el) => {
      const kind = el.dataset.anim;
      const inHero = !!el.closest('.hero');
      const delay = inHero ? (root.classList.contains('is-arriving') ? 0.9 : 0.2) : 0;
      const st = inHero ? undefined : enter(el);
      if (kind === 'chars') {
        SplitText.create(el, { type: 'words,chars', charsClass: 'sc', mask: 'chars', autoSplit: true, onSplit: (s) => G.from(s.chars, { yPercent: 120, rotate: 8, duration: 1.2, ease: 'expo.out', stagger: 0.028, delay, scrollTrigger: st }) });
      } else if (kind === 'scale') {
        SplitText.create(el, { type: 'words,chars', autoSplit: true, onSplit: (s) => G.from(s.chars, { opacity: 0, scale: 0, rotate: () => G.utils.random(-90, 90), y: () => G.utils.random(-60, 60), duration: 1.1, ease: 'back.out(1.8)', stagger: { each: 0.03, from: 'random' }, delay, scrollTrigger: st }) });
      } else if (kind === 'lines') {
        SplitText.create(el, { type: 'lines', linesClass: 'sl', mask: 'lines', autoSplit: true, onSplit: (s) => G.from(s.lines, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.1, delay, scrollTrigger: st }) });
      } else if (kind === 'blur') {
        SplitText.create(el, { type: 'words', autoSplit: true, onSplit: (s) => G.from(s.words, { opacity: 0, filter: 'blur(12px)', y: 16, duration: 1.1, ease: 'expo.out', stagger: 0.04, delay, scrollTrigger: inHero ? undefined : enter(el, 'top 90%') }) });
      } else if (kind === 'flip') {
        el.style.perspective = '800px';
        SplitText.create(el, { type: 'words', autoSplit: true, onSplit: (s) => G.from(s.words, { rotationX: -95, opacity: 0, transformOrigin: '50% 100% -20px', duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: st }) });
      } else if (kind === 'fill') {
        SplitText.create(el, { type: 'words', wordsClass: 'word', autoSplit: true, onSplit: (s) => G.to(s.words, { color: '#0b0b0b', ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: true } }) });
      } else if (kind === 'scramble' && has('ScrambleTextPlugin')) {
        el.setAttribute('aria-label', el.textContent);
        G.from(el, { duration: 1.4, scrambleText: { text: '', chars: 'upperCase', speed: 0.5 }, delay: delay + 0.4, scrollTrigger: inHero ? undefined : enter(el, 'top 94%') });
      }
    });
    ST.batch(G.utils.toArray('[data-rise]'), { start: 'top 90%', once: true, onEnter: (b) => G.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }) });
  }

  /* ---------------------------------------------------------------- SVG drawings, counters, ring, ticker */
  function graphics() {
    if (motion && has('DrawSVGPlugin')) {
      document.querySelectorAll('[data-draw]').forEach((svg) => {
        if (has('MorphSVGPlugin')) MorphSVGPlugin.convertToPath(svg.querySelectorAll('circle, rect, ellipse, line, polygon, polyline'));
        G.fromTo(svg.querySelectorAll('path'), { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.6, ease: 'expo.inOut', stagger: 0.06, scrollTrigger: { trigger: svg, start: 'top 90%' } });
      });
    }
    // counters
    document.querySelectorAll('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const fmt = (v) => pre + Math.round(v).toLocaleString('en-US') + suf;
      if (!motion) { el.textContent = fmt(end); return; }
      const o = { v: 0 };
      el.textContent = fmt(0);
      G.to(o, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => { el.textContent = fmt(o.v); }, scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    // the giving ring: a tenth of everything raised went to Swim Across America
    const ring = document.querySelector('.ring');
    if (ring && motion && has('DrawSVGPlugin')) {
      if (has('MorphSVGPlugin')) MorphSVGPlugin.convertToPath(ring.querySelectorAll('circle'));
      const tl = G.timeline({ scrollTrigger: { trigger: ring, start: 'top 75%' } });
      tl.fromTo(ring.querySelector('.ring__all'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.8, ease: 'expo.inOut' })
        .fromTo(ring.querySelector('.ring__part'), { drawSVG: '0%' }, { drawSVG: '10%', duration: 1.2, ease: 'expo.out' }, '-=0.6');
    }
    // timeline hairline
    const tlist = document.querySelector('.timeline');
    if (tlist && motion) G.fromTo(tlist, { '--tl': 0 }, { '--tl': 1, duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: tlist, start: 'top 80%' } });
    // icon ticker
    document.querySelectorAll('.ticker__track').forEach((track) => {
      [...track.children].forEach((c) => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); track.appendChild(k); });
      if (!motion) return;
      const loop = G.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
      ST.create({ trigger: track, start: 'top bottom', end: 'bottom top', onUpdate: (self) => { G.to(loop, { timeScale: (1 + Math.min(Math.abs(self.getVelocity()) / 400, 5)) * self.direction, duration: 0.2, overwrite: true }); G.to(loop, { timeScale: 1, duration: 1, delay: 0.25, overwrite: 'auto' }); } });
    });
  }

  /* ---------------------------------------------------------------- chapters: one shape, four words (pinned) */
  function chapters() {
    const box = document.querySelector('[data-chapters]');
    if (!box) return;
    const items = [...box.querySelectorAll('[data-chapter]')].map((li) => ({ shape: li.dataset.shape, word: li.dataset.word, text: li.dataset.text }));
    const path = box.querySelector('.chapters__mark path');
    const wordEl = box.querySelector('.chapter__word');
    const textEl = box.querySelector('.chapters__text');
    const dots = [...box.querySelectorAll('.chapters__dots span')];
    let cur = 0;
    const show = (i) => {
      if (i === cur) return;
      cur = i;
      dots.forEach((d, j) => d.classList.toggle('is-on', j === i));
      if (motion && has('MorphSVGPlugin')) G.to(path, { morphSVG: { shape: SHAPES[items[i].shape], type: 'rotational' }, duration: 0.9, ease: 'expo.inOut', overwrite: true });
      else path.setAttribute('d', SHAPES[items[i].shape]);
      if (motion && has('ScrambleTextPlugin')) G.to(wordEl, { duration: 0.7, scrambleText: { text: items[i].word, chars: 'upperCase', speed: 0.8 }, overwrite: true });
      else wordEl.textContent = items[i].word;
      if (motion) G.fromTo(textEl, { opacity: 0, y: 14, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'expo.out', overwrite: true });
      textEl.textContent = items[i].text;
    };
    path.setAttribute('d', SHAPES[items[0].shape]);
    wordEl.textContent = items[0].word; textEl.textContent = items[0].text;
    dots[0] && dots[0].classList.add('is-on');
    if (!motion) return;
    ST.create({ trigger: box, start: 'top top', end: () => '+=' + innerHeight * (items.length - 0.5), pin: true, scrub: true, onUpdate: (self) => show(Math.min(items.length - 1, Math.floor(self.progress * items.length))) });
  }

  /* ---------------------------------------------------------------- subject slider */
  function slider() {
    const wrap = document.querySelector('[data-slider]');
    if (!wrap) return;
    const viewport = wrap.querySelector('.slider__viewport');
    const track = wrap.querySelector('.slider__track');
    const slides = [...track.children];
    const count = wrap.querySelector('.slider__count');
    const bar = wrap.querySelector('.slider__progress span');
    const n = slides.length;
    const setCount = (p) => {
      const i = Math.min(n - 1, Math.round(p * (n - 1)));
      if (count) count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0');
      if (bar) bar.style.transform = `scaleX(${Math.max(1 / n, p)})`;
    };
    setCount(0);
    let st = null;
    if (motion) {
      G.matchMedia().add('(min-width: 861px)', () => {
        const dist = () => track.scrollWidth - viewport.clientWidth;
        const tween = G.to(track, { x: () => -dist(), ease: 'none' });
        st = ST.create({ trigger: wrap, start: 'top top', end: () => '+=' + dist() * 1.1, pin: true, scrub: 0.8, animation: tween, invalidateOnRefresh: true, onUpdate: (self) => setCount(self.progress) });
        slides.forEach((s) => G.fromTo(s, { rotateY: -10, scale: 0.94 }, { rotateY: 10, scale: 1, ease: 'none', scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
        return () => { st = null; };
      });
    }
    const go = (d) => {
      if (st && desktop()) {
        const p = Math.min(1, Math.max(0, Math.round(st.progress * (n - 1) + d) / (n - 1)));
        const y = st.start + (st.end - st.start) * p;
        if (smoother) smoother.scrollTo(y, true); else scrollTo({ top: y, behavior: 'smooth' });
      } else viewport.scrollBy({ left: d * (slides[0].getBoundingClientRect().width + 20), behavior: reduce ? 'auto' : 'smooth' });
    };
    wrap.querySelector('[data-prev]')?.addEventListener('click', () => go(-1));
    wrap.querySelector('[data-next]')?.addEventListener('click', () => go(1));
    viewport.addEventListener('scroll', () => { if (!desktop()) setCount(viewport.scrollLeft / Math.max(1, viewport.scrollWidth - viewport.clientWidth)); }, { passive: true });
    viewport.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  }

  /* ---------------------------------------------------------------- process path */
  function processPath() {
    const box = document.querySelector('.path');
    if (!box) return;
    const svg = box.querySelector('.path__svg');
    const steps = [...box.querySelectorAll('.step')];
    const dot = box.querySelector('.path__dot');
    let tl = null;
    const build = () => {
      const b = box.getBoundingClientRect();
      svg.setAttribute('viewBox', `0 0 ${b.width} ${b.height}`);
      const pts = steps.map((s, i) => {
        const r = s.getBoundingClientRect(), ic = s.querySelector('.step__icon').getBoundingClientRect();
        const y = ic.top - b.top + ic.height / 2;
        if (!desktop()) return [14, y];
        return i % 2 ? [r.left - b.left - 40, y] : [r.right - b.left + 40, y];
      });
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], my = (y0 + y1) / 2; d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`; }
      svg.innerHTML = `<path d="${d}"/><path class="path__draw" id="process-route" d="${d}"/>`;
      if (!motion || !has('MotionPathPlugin')) { dot.style.transform = `translate(${pts[pts.length - 1][0]}px, ${pts[pts.length - 1][1]}px)`; return; }
      if (tl) { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); }
      tl = G.timeline({ scrollTrigger: { trigger: box, start: 'top 65%', end: 'bottom 65%', scrub: 0.8 } });
      if (has('DrawSVGPlugin')) tl.fromTo('#process-route', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none' }, 0);
      tl.to(dot, { motionPath: { path: '#process-route', align: '#process-route', alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0);
      steps.forEach((s, i) => tl.to(s.querySelector('.step__icon'), { backgroundColor: '#0b0b0b', color: '#ffffff', duration: 0.05 }, Math.max(0, i / (steps.length - 1) - 0.02)));
    };
    build();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { build(); ST && ST.refresh(); }, 250); });
  }

  /* ---------------------------------------------------------------- plates and bios */
  function people() {
    if (motion && fine) {
      document.querySelectorAll('.plate__face').forEach((face) => {
        const rX = G.quickTo(face, 'rotationX', { duration: 0.7, ease: 'power3' });
        const rY = G.quickTo(face, 'rotationY', { duration: 0.7, ease: 'power3' });
        face.style.transformPerspective = '900px';
        face.addEventListener('pointermove', (e) => {
          const r = face.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          rY((px - 0.5) * 16); rX((0.5 - py) * 16);
          face.style.setProperty('--sx', px * 100 + '%'); face.style.setProperty('--sy', py * 100 + '%');
        });
        face.addEventListener('pointerleave', () => { rX(0); rY(0); });
      });
      if (has('ScrambleTextPlugin')) document.querySelectorAll('.plate, .person').forEach((p) => {
        const n = p.querySelector('.plate__name, h3');
        if (!n) return;
        const text = n.textContent;
        p.addEventListener('pointerenter', () => G.to(n, { duration: 0.7, scrambleText: { text, chars: 'upperAndLowerCase', speed: 0.7 }, overwrite: true }));
      });
    }
    document.querySelectorAll('.bio-toggle').forEach((b) => {
      b.addEventListener('click', () => {
        const p = b.closest('.person');
        const open = !p.classList.contains('is-open');
        p.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', String(open));
        b.querySelector('span').textContent = open ? 'Less' : 'Read more';
        if (motion && open) G.from(p.querySelector('.bio-more'), { opacity: 0, duration: 0.6, ease: 'power2.out' });
        if (ST) ST.refresh();
      });
    });
  }

  /* ---------------------------------------------------------------- footer */
  function footer() {
    const clock = document.querySelector('[data-clock]');
    if (clock) {
      const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const tick = () => { clock.textContent = fmt.format(new Date()); };
      tick(); setInterval(tick, 1000);
    }
    document.querySelector('[data-top]')?.addEventListener('click', () => { if (smoother) smoother.scrollTo(0, true); else scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  }

  /* ---------------------------------------------------------------- FAQ */
  document.querySelectorAll('.faq button').forEach((b) => {
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      if (!motion) { panel.hidden = !open; return; }
      if (open) { panel.hidden = false; G.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.7, ease: 'expo.out', onComplete: () => ST.refresh() }); G.from(panel.querySelector('p'), { y: 16, opacity: 0, duration: 0.7, ease: 'expo.out' }); }
      else G.to(panel, { height: 0, duration: 0.5, ease: 'expo.inOut', onComplete: () => { panel.hidden = true; panel.style.height = ''; ST.refresh(); } });
    });
  });

  /* ---------------------------------------------------------------- request form */
  const TUTORS = { daniel: 'Daniel Chen', katherine: 'Katherine Fei', jack: 'Jack Li', eliot: 'Eliot Bih', robert: 'Robert Liu Meng', sue: 'Sue Nian', vincent: 'Vincent Yang', sam: 'Sam Moon', isaac: 'Isaac Tsui', victor: 'Victor Pan', gary: 'Gary Han' };
  const BY_SUBJECT = { math: ['jack', 'sam', 'eliot'], english: ['robert', 'daniel'], science: ['eliot', 'gary', 'sue'], coding: ['jack', 'victor'], music: ['sue', 'vincent', 'daniel', 'katherine'], 'social-studies': ['isaac', 'robert'], beyond: ['sue', 'sam', 'katherine'] };
  const initials = (n) => n.split(' ').slice(0, 2).map((w) => w[0]).join('');
  const listNames = (l) => (l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' or ' + l[l.length - 1]);
  const form = document.getElementById('request-form');
  const subject = document.getElementById('subject');
  const match = form && form.querySelector('.match');
  function showMatch(v) {
    if (!match) return;
    const ids = BY_SUBJECT[v];
    if (!ids) { match.hidden = true; return; }
    const monos = match.querySelector('.monos');
    monos.innerHTML = ids.map((id) => '<span aria-hidden="true">' + initials(TUTORS[id]) + '</span>').join('');
    const p = match.querySelector('p');
    const text = 'You could learn with ' + listNames(ids.map((id) => TUTORS[id].split(' ')[0])) + '.';
    match.hidden = false;
    if (motion && has('ScrambleTextPlugin')) G.to(p, { duration: 0.8, scrambleText: { text, chars: 'lowerCase', speed: 0.8 } }); else p.textContent = text;
    if (motion) G.from(monos.children, { scale: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.07 });
  }
  if (subject) {
    subject.addEventListener('change', () => showMatch(subject.value));
    const fromUrl = new URLSearchParams(location.search).get('subject');
    if (fromUrl && BY_SUBJECT[fromUrl]) { subject.value = fromUrl; showMatch(fromUrl); }
  }
  const finder = document.getElementById('finder');
  if (finder && subject) {
    finder.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = finder.querySelector('select').value;
      if (v) { subject.value = v; showMatch(v); }
      scrollToEl(document.getElementById('request'));
      setTimeout(() => document.getElementById('parentName').focus({ preventScroll: true }), reduce ? 0 : 1400);
    });
  }
  if (form && window.fetch) {
    const status = form.querySelector('.status');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      button.disabled = true; status.dataset.state = ''; status.textContent = 'Sending your request…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset(); if (match) match.hidden = true;
        status.dataset.state = 'ok'; status.textContent = 'Thank you. We have your request and will email you with a tutor match.';
      } catch (err) {
        status.dataset.state = 'error'; status.textContent = 'That did not go through. Please try again, or email info@eternalgrowth.org.';
      } finally { button.disabled = false; }
    });
  }

  /* ---------------------------------------------------------------- go */
  const ready = () => {
    arrive();
    morphLoop(document.querySelector('.hero__mark path'), document.querySelector('[data-mark-label]'));
    morphLoop(document.querySelector('.footer__mark path'), null, 0.7);
    hero();
    textAnimations();
    graphics();
    chapters();
    slider();
    processPath();
    people();
    footer();
    if (ST) ST.refresh();
  };
  const go = () => (document.fonts && document.fonts.ready ? document.fonts.ready.then(ready) : ready());
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
  setTimeout(() => {
    document.querySelectorAll('[data-rise]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === '0') { el.style.opacity = 1; el.style.transform = 'none'; }
    });
  }, 4500);
})();
