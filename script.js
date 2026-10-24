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
  if (ok) {
    const plugins = ['ScrollTrigger', 'ScrollSmoother', 'SplitText', 'DrawSVGPlugin', 'MorphSVGPlugin', 'MotionPathPlugin', 'ScrambleTextPlugin'].filter(has).map((n) => window[n]);
    G.registerPlugin(...plugins);
  }
  const motion = ok && !reduce;
  const ST = window.ScrollTrigger;
  let smoother = null;

  const showAll = () => document.querySelectorAll('[data-rise]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });

  /* ---------------------------------------------------------------- smooth scrolling */
  if (motion && has('ScrollSmoother') && document.getElementById('smooth-wrapper')) {
    smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.15, effects: true, smoothTouch: false });
  }
  function scrollToEl(el, offset = 90) {
    if (!el) return;
    if (smoother) smoother.scrollTo(el, true, `top ${offset}px`);
    else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  if (smoother && location.hash) {
    const t = document.querySelector(location.hash);
    if (t) addEventListener('load', () => setTimeout(() => smoother.scrollTo(t, false, 'top 90px'), 60));
  }

  /* ---------------------------------------------------------------- the grey haze */
  const atmos = document.querySelector('.atmos');
  let fog = null;
  if (atmos && !reduce && window.VANTA && VANTA.FOG && window.THREE) {
    try {
      fog = VANTA.FOG({
        el: atmos, THREE: window.THREE, mouseControls: false, touchControls: false, gyroControls: false,
        minHeight: 200, minWidth: 200,
        highlightColor: 0xfbfbf9, midtoneColor: 0xd6d6d1, lowlightColor: 0xb4b4ae, baseColor: 0xf2f2ef,
        blurFactor: 0.62, speed: 0.75, zoom: 0.85,
      });
    } catch (e) { fog = null; }
  }
  addEventListener('pagehide', () => { if (fog) { fog.destroy(); fog = null; } });
  if (motion) {
    G.utils.toArray('.atmos__orb').forEach((orb, i) => {
      G.to(orb, { x: () => G.utils.random(-120, 120), y: () => G.utils.random(-90, 90), scale: () => G.utils.random(0.85, 1.2), duration: G.utils.random(9, 14), ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true, delay: i });
    });
  }

  /* ---------------------------------------------------------------- page transition: shutters and the next page's name */
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
  const pageName = (url) => {
    const f = url.pathname.split('/').pop() || 'index.html';
    return { 'index.html': 'Home', 'subjects.html': 'Subjects', 'about.html': 'About', 'team.html': 'Team' }[f] || 'Eternal Growth';
  };
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
  addEventListener('pageshow', (e) => {
    if (!e.persisted || !shutter) return;
    shutter.style.visibility = '';
    if (G) G.set(bars, { clearProps: 'transform' });
  });

  /* ---------------------------------------------------------------- cursor */
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
    // the haze leans toward the cursor
    const orbs = G.utils.toArray('.atmos__orb').map((o, i) => ({ x: G.quickTo(o, 'xPercent', { duration: 2.4, ease: 'power3' }), y: G.quickTo(o, 'yPercent', { duration: 2.4, ease: 'power3' }), d: (i + 1) * 6 }));
    addEventListener('pointermove', (e) => { const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5; orbs.forEach((o) => { o.x(nx * o.d); o.y(ny * o.d); }); }, { passive: true });
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
      nav.classList.toggle('is-solid', y > 40);
      nav.classList.toggle('is-hidden', y > last + 2 && y > 600 && !nav.classList.contains('is-open'));
      if (y < last - 2) nav.classList.remove('is-hidden');
      last = y;
    };
    if (ST) ST.create({ start: 0, end: 'max', onUpdate: onScroll });
    else addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  // nav links scramble on hover
  if (motion && fine && has('ScrambleTextPlugin')) {
    document.querySelectorAll('.nav__links a, .footer__col a').forEach((a) => {
      const text = a.textContent;
      a.addEventListener('pointerenter', () => G.to(a, { duration: 0.5, scrambleText: { text, chars: 'lowerCase', speed: 0.8 }, overwrite: true }));
    });
  }

  /* ---------------------------------------------------------------- morphing mark */
  const SHAPES = [
    'M100 18 182 168H18Z',                                                     // math: triangle
    'M30 30H170V170H30Z',                                                      // english: page
    'M100 14 174 57V143L100 186 26 143V57Z',                                   // science: hexagon
    'M100 12 188 100 100 188 12 100Z',                                         // coding: diamond
    'M100 14A86 86 0 1 1 99.9 14Z',                                            // music: circle
    'M14 100A86 86 0 0 1 186 100H14Z M14 112H186A86 86 0 0 1 14 112Z',        // social studies: split globe
    'M100 8 120 80 192 100 120 120 100 192 80 120 8 100 80 80Z',               // beyond: star
  ];
  const NAMES = ['Mathematics', 'English', 'Science', 'Coding', 'Music', 'Social studies', 'Beyond'];
  function morphLoop(path, label, offset = 0) {
    if (!path) return;
    if (!motion || !has('MorphSVGPlugin')) return;
    const tl = G.timeline({ repeat: -1, delay: 1.2 + offset });
    SHAPES.forEach((s, i) => {
      const nextShape = SHAPES[(i + 1) % SHAPES.length];
      tl.to(path, { morphSVG: { shape: nextShape, type: 'rotational' }, duration: 1.1, ease: 'expo.inOut' }, '+=1.4');
      if (label && has('ScrambleTextPlugin')) tl.to(label, { duration: 0.8, scrambleText: { text: NAMES[(i + 1) % NAMES.length], chars: 'lowerCase', speed: 0.7 } }, '<');
    });
    return tl;
  }

  /* ---------------------------------------------------------------- text animations (SplitText) */
  function textAnimations() {
    if (!motion || !has('SplitText')) { showAll(); return; }
    const onEnter = (el, start = 'top 85%') => ({ trigger: el, start, toggleActions: 'play none none reverse' });

    document.querySelectorAll('[data-anim]').forEach((el) => {
      const kind = el.dataset.anim;
      const hero = !!el.closest('.hero');
      const delay = hero ? (root.classList.contains('is-arriving') ? 0.9 : 0.2) : 0;
      if (kind === 'chars') {
        SplitText.create(el, { type: 'words,chars', mask: 'chars', autoSplit: true, onSplit: (s) => G.from(s.chars, { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.035, delay, scrollTrigger: hero ? undefined : onEnter(el) }) });
      } else if (kind === 'lines') {
        SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: (s) => G.from(s.lines, { yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay, scrollTrigger: hero ? undefined : onEnter(el) }) });
      } else if (kind === 'blur') {
        SplitText.create(el, { type: 'words', autoSplit: true, onSplit: (s) => G.from(s.words, { opacity: 0, filter: 'blur(12px)', y: 18, duration: 1.1, ease: 'expo.out', stagger: 0.04, delay, scrollTrigger: hero ? undefined : onEnter(el, 'top 88%') }) });
      } else if (kind === 'flip') {
        el.style.perspective = '800px';
        SplitText.create(el, { type: 'words', autoSplit: true, onSplit: (s) => G.from(s.words, { rotationX: -95, opacity: 0, transformOrigin: '50% 100% -20px', duration: 1.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: onEnter(el) }) });
      } else if (kind === 'fill') {
        SplitText.create(el, { type: 'words', wordsClass: 'word', autoSplit: true, onSplit: (s) => G.to(s.words, { color: '#0b0b0b', ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 50%', scrub: true } }) });
      } else if (kind === 'scramble' && has('ScrambleTextPlugin')) {
        const text = el.textContent;
        G.from(el, { duration: 1.4, scrambleText: { text: '', chars: 'upperCase', speed: 0.5 }, delay: delay + 0.4, scrollTrigger: hero ? undefined : onEnter(el, 'top 92%') });
        el.setAttribute('aria-label', text);
      }
    });

    // giant words sliding sideways with the scroll
    G.utils.toArray('.kinetic__line').forEach((line, i) => {
      G.fromTo(line, { xPercent: i % 2 ? -40 : 5 }, { xPercent: i % 2 ? 5 : -40, ease: 'none', scrollTrigger: { trigger: line, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });

    // everything else rises in reading order
    const risers = G.utils.toArray('[data-rise]');
    ST.batch(risers, { start: 'top 90%', once: true, onEnter: (b) => G.to(b, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }) });

    // the footer wordmark waves in
    const mark = document.querySelector('.footer__word p');
    if (mark) SplitText.create(mark, { type: 'chars', mask: 'chars', onSplit: (s) => G.from(s.chars, { yPercent: 100, duration: 1.4, ease: 'expo.out', stagger: { each: 0.05, from: 'center' }, scrollTrigger: { trigger: mark, start: 'top 98%' } }) });
  }

  /* ---------------------------------------------------------------- SVG line art draws itself */
  function drawings() {
    if (!motion || !has('DrawSVGPlugin')) return;
    document.querySelectorAll('[data-draw]').forEach((svg) => {
      if (has('MorphSVGPlugin')) MorphSVGPlugin.convertToPath(svg.querySelectorAll('circle, rect, ellipse, line, polygon, polyline'));
      const parts = svg.querySelectorAll('path');
      G.fromTo(parts, { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.8, ease: 'expo.inOut', stagger: 0.06, scrollTrigger: { trigger: svg, start: 'top 88%' } });
    });
  }

  /* ---------------------------------------------------------------- the subject slider */
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
        // each card leans slightly as it travels
        slides.forEach((s) => G.fromTo(s, { rotateY: -8, z: -40 }, { rotateY: 8, z: 0, ease: 'none', scrollTrigger: { trigger: s, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } }));
        return () => { st = null; };
      });
    }
    const go = (d) => {
      if (st && desktop()) {
        const p = Math.min(1, Math.max(0, Math.round(st.progress * (n - 1) + d) / (n - 1)));
        const y = st.start + (st.end - st.start) * p;
        if (smoother) smoother.scrollTo(y, true); else scrollTo({ top: y, behavior: 'smooth' });
      } else {
        viewport.scrollBy({ left: d * (slides[0].getBoundingClientRect().width + 20), behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    wrap.querySelector('[data-prev]')?.addEventListener('click', () => go(-1));
    wrap.querySelector('[data-next]')?.addEventListener('click', () => go(1));
    viewport.addEventListener('scroll', () => { if (!desktop()) setCount(viewport.scrollLeft / Math.max(1, viewport.scrollWidth - viewport.clientWidth)); }, { passive: true });
    viewport.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  }

  /* ---------------------------------------------------------------- process: a dot travels a drawn path */
  function processPath() {
    const box = document.querySelector('.path');
    if (!box) return;
    const svg = box.querySelector('.path__svg');
    const steps = [...box.querySelectorAll('.step')];
    const dot = box.querySelector('.path__dot');
    let tl = null;
    const build = () => {
      const b = box.getBoundingClientRect();
      const W = b.width, H = b.height;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      // the route runs down the open middle: just right of a left-hand step, just left of a right-hand one
      const pts = steps.map((s, i) => {
        const box2 = s.getBoundingClientRect();
        const num = s.querySelector('.step__num').getBoundingClientRect();
        const y = num.top - b.top + num.height / 2;
        if (!desktop()) return [14, y];
        return i % 2 ? [box2.left - b.left - 40, y] : [box2.right - b.left + 40, y];
      });
      let d = `M ${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const my = (y0 + y1) / 2;
        d += ` C ${x0} ${my}, ${x1} ${my}, ${x1} ${y1}`;
      }
      svg.innerHTML = `<path class="path__base" d="${d}"/><path class="path__draw" id="process-route" d="${d}"/>`;
      if (!motion || !has('MotionPathPlugin')) { dot.style.transform = `translate(${pts[pts.length - 1][0]}px, ${pts[pts.length - 1][1]}px)`; return; }
      if (tl) { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); }
      tl = G.timeline({ scrollTrigger: { trigger: box, start: 'top 65%', end: 'bottom 65%', scrub: 0.8 } });
      if (has('DrawSVGPlugin')) tl.fromTo('#process-route', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none' }, 0);
      tl.to(dot, { motionPath: { path: '#process-route', align: '#process-route', alignOrigin: [0.5, 0.5] }, ease: 'none' }, 0);
      steps.forEach((s, i) => tl.to(s.querySelector('.step__num'), { color: '#0b0b0b', duration: 0.05 }, i / (steps.length - 1) - 0.02));
    };
    build();
    let t; addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { build(); ST && ST.refresh(); }, 250); });
  }

  /* ---------------------------------------------------------------- plates tilt and names scramble */
  function plates() {
    if (!motion) return;
    document.querySelectorAll('.plate__face').forEach((face) => {
      if (!fine) return;
      const rX = G.quickTo(face, 'rotationX', { duration: 0.7, ease: 'power3' });
      const rY = G.quickTo(face, 'rotationY', { duration: 0.7, ease: 'power3' });
      face.style.transformPerspective = '900px';
      face.addEventListener('pointermove', (e) => {
        const r = face.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        rY((px - 0.5) * 16); rX((0.5 - py) * 16);
        face.style.setProperty('--sx', px * 100 + '%'); face.style.setProperty('--sy', py * 100 + '%');
      });
      face.addEventListener('pointerleave', () => { rX(0); rY(0); });
    });
    if (fine && has('ScrambleTextPlugin')) document.querySelectorAll('.plate').forEach((p) => {
      const n = p.querySelector('.plate__name');
      if (!n) return;
      const text = n.textContent;
      p.addEventListener('pointerenter', () => G.to(n, { duration: 0.7, scrambleText: { text, chars: 'upperAndLowerCase', speed: 0.7 }, overwrite: true }));
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
  const TUTORS = {
    daniel: 'Daniel Chen', katherine: 'Katherine Fei', jack: 'Jack Li', eliot: 'Eliot Bih', robert: 'Robert Liu Meng',
    sue: 'Sue Nian', vincent: 'Vincent Yang', sam: 'Sam Moon', isaac: 'Isaac Tsui', victor: 'Victor Pan', gary: 'Gary Han',
  };
  const BY_SUBJECT = {
    math: ['jack', 'sam', 'eliot'], english: ['robert', 'daniel'], science: ['eliot', 'gary', 'sue'],
    coding: ['jack', 'victor'], music: ['sue', 'vincent', 'daniel', 'katherine'],
    'social-studies': ['isaac', 'robert'], beyond: ['sue', 'sam', 'katherine'],
  };
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
    if (motion && has('ScrambleTextPlugin')) G.to(p, { duration: 0.8, scrambleText: { text, chars: 'lowerCase', speed: 0.8 } });
    else p.textContent = text;
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
    textAnimations();
    drawings();
    slider();
    processPath();
    plates();
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
