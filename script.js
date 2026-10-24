// Eternal Growth — motion and behaviour.
// Everything degrades: without GSAP, WebGL or script, all content is visible and links simply navigate.
(function () {
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const desktop = () => innerWidth > 860;
  const G = window.gsap;
  const ST = window.ScrollTrigger;
  if (G && ST) G.registerPlugin(ST);
  const motion = !!(G && ST) && !reduce;

  const showAll = () => document.querySelectorAll('[data-rise]').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });

  /* ---------------------------------------------------------------- split text into lines, words and characters */
  function splitChars(el) {
    if (el.dataset.splitDone) return el.querySelectorAll('.char');
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map((line) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = line;
      const text = tmp.textContent.trim();
      const words = text.split(/\s+/).map((w) => '<span class="word" aria-hidden="true">' + [...w].map((c) => '<span class="char">' + c + '</span>').join('') + '</span>').join(' ');
      return '<span class="split-line">' + words + '</span>';
    }).join('');
    el.dataset.splitDone = '1';
    return el.querySelectorAll('.char');
  }
  function splitWords(el) {
    const label = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', label);
    el.innerHTML = label.split(' ').map((w) => '<span class="word" aria-hidden="true">' + w + '</span>').join(' ');
    return el.querySelectorAll('.word');
  }

  /* ---------------------------------------------------------------- page transition: shutters */
  const shutter = document.querySelector('.shutter');
  const bars = shutter ? [...shutter.querySelectorAll('i')] : [];
  const mark = shutter && shutter.querySelector('.shutter__mark');
  function arrive() {
    if (!root.classList.contains('is-arriving')) return;
    if (!motion || !shutter) { root.classList.remove('is-arriving'); return; }
    G.timeline({ onComplete: () => { root.classList.remove('is-arriving'); G.set(bars, { clearProps: 'transform' }); } })
      .set(bars, { scaleY: 1, transformOrigin: 'top' })
      .set(mark, { opacity: 1, scale: 1 })
      .to(mark, { opacity: 0, scale: 0.8, duration: 0.4, ease: 'power2.in' }, 0.05)
      .to(bars, { scaleY: 0, duration: 0.8, ease: 'expo.inOut', stagger: 0.06 }, 0.2);
  }
  function leave(href) {
    if (!motion || !shutter) { location.href = href; return; }
    try { sessionStorage.setItem('eg-arrive', '1'); } catch (e) { /* still navigates */ }
    shutter.style.visibility = 'visible';
    G.timeline({ onComplete: () => { location.href = href; } })
      .set(bars, { scaleY: 0, transformOrigin: 'bottom' })
      .to(bars, { scaleY: 1, duration: 0.7, ease: 'expo.inOut', stagger: 0.06 })
      .fromTo(mark, { opacity: 0, scale: 0.8, rotate: -40 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.5, ease: 'expo.out' }, 0.45);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault();
    leave(url.href);
  });
  addEventListener('pageshow', (e) => {
    if (!e.persisted || !shutter) return;
    shutter.style.visibility = '';
    if (G) G.set(bars, { clearProps: 'transform' });
  });

  /* ---------------------------------------------------------------- cursor */
  if (fine && motion) {
    const ring = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    if (ring && dot) {
      const rx = G.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
      const ry = G.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
      const dx = G.quickTo(dot, 'x', { duration: 0.08 });
      const dy = G.quickTo(dot, 'y', { duration: 0.08 });
      addEventListener('pointermove', (e) => { root.classList.add('has-cursor'); rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); }, { passive: true });
      document.addEventListener('pointerleave', () => root.classList.remove('has-cursor'));
      document.addEventListener('pointerover', (e) => ring.classList.toggle('is-hover', !!e.target.closest('a, button, select, input, textarea, .slide, .plate__face')));
    }
  }

  /* ---------------------------------------------------------------- nav */
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.nav__menu');
  if (nav && menu) {
    const setOpen = (open) => { nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
    menu.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    nav.querySelectorAll('.nav__links a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((a) => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  if (nav) {
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('is-solid', y > 40);
      nav.classList.toggle('is-hidden', y > last && y > 500 && !nav.classList.contains('is-open'));
      last = y;
    };
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------- Vanta NET: straight lines between drifting points */
  const vantaEl = document.querySelector('[data-vanta]');
  let effect = null;
  if (vantaEl && !reduce && window.VANTA && VANTA.NET && window.THREE) {
    try {
      effect = VANTA.NET({
        el: vantaEl, THREE: window.THREE, mouseControls: true, touchControls: true, gyroControls: false,
        minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1,
        color: 0xa9a8a3, backgroundColor: 0x070707, points: 9, maxDistance: 21, spacing: 19, showDots: false,
      });
    } catch (err) { effect = null; }
  }
  addEventListener('pagehide', () => { if (effect) { effect.destroy(); effect = null; } });

  /* ---------------------------------------------------------------- layered parallax that tracks the cursor */
  if (fine && motion) {
    const layers = [...document.querySelectorAll('[data-depth]')].map((el) => ({
      x: G.quickTo(el, 'x', { duration: 1.2, ease: 'power3' }),
      y: G.quickTo(el, 'y', { duration: 1.2, ease: 'power3' }),
      d: parseFloat(el.dataset.depth),
    }));
    if (layers.length) addEventListener('pointermove', (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.d * 100); l.y(ny * l.d * 100); });
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- hero */
  function hero() {
    const title = document.querySelector('[data-hero-title]');
    const frame = document.querySelectorAll('.hero__frame i');
    const ticks = document.querySelectorAll('.hero__frame b');
    const tree = document.querySelectorAll('.hero__tree path');
    const rest = document.querySelectorAll('.hero [data-hero-rise]');
    if (!motion) return;
    const chars = title ? splitChars(title) : [];
    const delay = root.classList.contains('is-arriving') ? 0.7 : 0.1;
    const tl = G.timeline({ delay });
    tl.fromTo(frame, { scaleX: (i) => (i % 2 ? 1 : 0), scaleY: (i) => (i % 2 ? 0 : 1) }, { scaleX: 1, scaleY: 1, duration: 1.4, ease: 'expo.inOut', stagger: 0.12 }, 0)
      .from(ticks, { opacity: 0, scale: 0.4, duration: 0.6, ease: 'expo.out', stagger: 0.08 }, 0.9)
      .from(chars, { yPercent: 115, rotate: 6, duration: 1.2, ease: 'expo.out', stagger: 0.035 }, 0.25)
      .from(rest, { opacity: 0, y: 24, duration: 1, ease: 'expo.out', stagger: 0.1 }, 0.8);
    tree.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    tl.to(tree, { strokeDashoffset: 0, duration: 2.4, ease: 'power2.out', stagger: { each: 0.004, from: 'start' } }, 0.3);
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      G.to('.hero__inner', { yPercent: -18, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero__ghost', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
      G.to('.hero__tree', { yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------------------------------------------------------------- marquees driven by scroll velocity */
  function marquees() {
    document.querySelectorAll('.marquee__track').forEach((track) => {
      [...track.children].forEach((c) => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); track.appendChild(k); });
      if (!motion) return;
      const right = track.closest('.marquee').dataset.dir === 'right';
      const base = right ? -1 : 1;
      const loop = G.fromTo(track, { xPercent: right ? -50 : 0 }, { xPercent: right ? 0 : -50, duration: 38, ease: 'none', repeat: -1 });
      let settle;
      ST.create({
        trigger: track, start: 'top bottom', end: 'bottom top',
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 350, 6);
          const sign = self.direction === 1 ? 1 : -1;
          G.to(loop, { timeScale: (1 + v) * sign * Math.abs(base), duration: 0.25, overwrite: true });
          clearTimeout(settle);
          settle = setTimeout(() => G.to(loop, { timeScale: 1, duration: 1.2, ease: 'power2.out', overwrite: true }), 180);
        },
      });
    });
  }

  /* ---------------------------------------------------------------- word and line animations */
  function words() {
    if (!motion) { showAll(); return; }
    document.querySelectorAll('[data-words]').forEach((el) => {
      const w = splitWords(el);
      G.fromTo(w, { opacity: 0.12 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 45%', scrub: true } });
    });
    document.querySelectorAll('[data-split]').forEach((el) => {
      const c = splitChars(el);
      G.from(c, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.022, scrollTrigger: { trigger: el, start: 'top 86%' } });
    });
    document.querySelectorAll('[data-draw]').forEach((el) => {
      G.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'expo.inOut', transformOrigin: 'left', scrollTrigger: { trigger: el, start: 'top 92%' } });
    });
    document.querySelectorAll('[data-strokes]').forEach((svg) => {
      const parts = svg.querySelectorAll('path, line, circle, rect, polyline, polygon');
      parts.forEach((p) => { try { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; } catch (e) { /* no length */ } });
      G.to(parts, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.05, scrollTrigger: { trigger: svg, start: 'top 88%' } });
    });
    const risers = G.utils.toArray('[data-rise]').filter((el) => !el.closest('.hero'));
    ST.batch(risers, {
      start: 'top 90%', once: true,
      onEnter: (b) => G.to(b, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 }),
    });
    G.utils.toArray('.hero [data-rise]').forEach((el) => G.set(el, { opacity: 1, y: 0 }));
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      G.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
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
    const prev = wrap.querySelector('[data-prev]');
    const next = wrap.querySelector('[data-next]');
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
        st = ST.create({
          trigger: wrap, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, animation: tween,
          invalidateOnRefresh: true, onUpdate: (self) => setCount(self.progress),
        });
        return () => { st = null; };
      });
    }
    const go = (d) => {
      if (st && desktop()) {
        const p = Math.min(1, Math.max(0, Math.round(st.progress * (n - 1) + d) / (n - 1)));
        scrollTo({ top: st.start + (st.end - st.start) * p, behavior: reduce ? 'auto' : 'smooth' });
      } else {
        viewport.scrollBy({ left: d * (slides[0].getBoundingClientRect().width + 20), behavior: reduce ? 'auto' : 'smooth' });
      }
    };
    if (prev) prev.addEventListener('click', () => go(-1));
    if (next) next.addEventListener('click', () => go(1));
    viewport.addEventListener('scroll', () => { if (!desktop()) setCount(viewport.scrollLeft / Math.max(1, viewport.scrollWidth - viewport.clientWidth)); }, { passive: true });
    viewport.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
  }

  /* ---------------------------------------------------------------- process line */
  function process() {
    const list = document.querySelector('.process__list');
    if (!list) return;
    const steps = [...list.querySelectorAll('.pstep')];
    if (!motion) { steps.forEach((s) => s.classList.add('is-on')); return; }
    G.to(list.querySelector('.process__line span'), { scaleY: 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 65%', end: 'bottom 60%', scrub: true } });
    steps.forEach((s) => ST.create({ trigger: s, start: 'top 62%', onEnter: () => s.classList.add('is-on'), onLeaveBack: () => s.classList.remove('is-on') }));
  }

  /* ---------------------------------------------------------------- plates tilt toward the cursor */
  function plates() {
    if (!fine || !motion) return;
    document.querySelectorAll('.plate__face').forEach((face) => {
      const rX = G.quickTo(face, 'rotationX', { duration: 0.6, ease: 'power3' });
      const rY = G.quickTo(face, 'rotationY', { duration: 0.6, ease: 'power3' });
      face.addEventListener('pointermove', (e) => {
        const r = face.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        rY((px - 0.5) * 14); rX((0.5 - py) * 14);
        face.style.setProperty('--sx', px * 100 + '%'); face.style.setProperty('--sy', py * 100 + '%');
      });
      face.addEventListener('pointerleave', () => { rX(0); rY(0); });
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
    const top = document.querySelector('[data-top]');
    if (top) top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    if (!motion) return;
    const ring = document.querySelector('.footer__emblem .emblem__ring');
    if (ring) G.to(ring, { rotate: 360, svgOrigin: '100 100', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    const word = document.querySelector('.footer__word p');
    if (word) {
      const c = splitChars(word);
      G.from(c, { yPercent: 100, duration: 1.2, ease: 'expo.out', stagger: 0.04, scrollTrigger: { trigger: word, start: 'top 98%' } });
    }
  }

  /* ---------------------------------------------------------------- FAQ */
  document.querySelectorAll('.faq button').forEach((b) => {
    const panel = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      if (!motion) { panel.hidden = !open; return; }
      if (open) { panel.hidden = false; G.fromTo(panel, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'expo.out' }); }
      else G.to(panel, { height: 0, duration: 0.5, ease: 'expo.inOut', onComplete: () => { panel.hidden = true; panel.style.height = ''; } });
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
    const monos = match.querySelector('.match__monos');
    monos.innerHTML = ids.map((id) => '<span aria-hidden="true">' + initials(TUTORS[id]) + '</span>').join('');
    match.querySelector('p').textContent = 'You could learn with ' + listNames(ids.map((id) => TUTORS[id].split(' ')[0])) + '.';
    match.hidden = false;
    if (motion) G.from(monos.children, { y: 10, opacity: 0, duration: 0.5, ease: 'expo.out', stagger: 0.06 });
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
      document.getElementById('request').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(() => document.getElementById('parentName').focus({ preventScroll: true }), reduce ? 0 : 1000);
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
    hero();
    marquees();
    words();
    slider();
    process();
    plates();
    footer();
    if (ST) ST.refresh();
  };
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
  setTimeout(() => {
    document.querySelectorAll('[data-rise]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === '0') { el.style.opacity = 1; el.style.transform = 'none'; }
    });
  }, 4000);
})();
