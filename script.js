// Eternal Growth — motion and behaviour.
// Every piece degrades: without GSAP, WebGL or script the content is all there and the links just navigate.
(function () {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap = !!window.gsap;
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const showAll = () => document.querySelectorAll('[data-rise]').forEach((el) => {
    el.style.opacity = 1; el.style.translate = 'none'; el.style.filter = 'none';
  });

  /* ---------------------------------------------------------------- page transition: growth rings */
  const rings = document.querySelector('.rings');
  const fill = rings && rings.querySelector('.rings__fill');
  const ringEls = rings ? [...rings.querySelectorAll('.rings__ring')] : [];

  function arrive() {
    if (!root.classList.contains('is-arriving')) return;
    if (!hasGsap || reduce || !rings) { root.classList.remove('is-arriving'); return; }
    rings.style.setProperty('--rx', '50%');
    rings.style.setProperty('--ry', '50%');
    const tl = gsap.timeline({ onComplete: () => root.classList.remove('is-arriving') });
    tl.set(ringEls, { scale: 0, opacity: 1 })
      .fromTo(fill, { clipPath: 'circle(150% at 50% 50%)' }, { clipPath: 'circle(0% at 50% 50%)', duration: 1.0, ease: 'expo.inOut' }, 0)
      .to(ringEls, { scale: (i) => 0.75 + i * 0.2, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.09 }, 0.15);
  }

  function leave(href, x, y) {
    if (!hasGsap || reduce || !rings) { location.href = href; return; }
    try { sessionStorage.setItem('eg-arrive', '1'); } catch (e) { /* private mode: still navigates */ }
    const rx = (x / innerWidth) * 100 + '%';
    const ry = (y / innerHeight) * 100 + '%';
    rings.style.setProperty('--rx', rx);
    rings.style.setProperty('--ry', ry);
    rings.style.visibility = 'visible';
    const tl = gsap.timeline({ onComplete: () => { location.href = href; } });
    tl.set(ringEls, { scale: 0, opacity: 1 })
      .to(ringEls, { scale: (i) => 0.45 + i * 0.18, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0)
      .fromTo(fill, { clipPath: `circle(0% at ${rx} ${ry})` }, { clipPath: `circle(150% at ${rx} ${ry})`, duration: 0.75, ease: 'expo.in' }, 0.05)
      .to('main, .footer', { scale: 0.97, filter: 'blur(6px)', duration: 0.6, ease: 'power2.in' }, 0);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    const samePage = url.pathname === location.pathname && url.search === location.search;
    if (samePage) return; // in-page anchors scroll normally
    if (!/\.html$|\/$/.test(url.pathname)) return;
    e.preventDefault();
    leave(url.href, e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
  });
  // coming back through the browser's cache: never leave the overlay up
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted || !rings) return;
    rings.style.visibility = '';
    if (hasGsap) gsap.set('main, .footer', { clearProps: 'all' });
    if (fill) fill.style.clipPath = '';
  });

  /* ---------------------------------------------------------------- nav */
  const nav = document.querySelector('.nav');
  const menu = document.querySelector('.nav__menu');
  if (nav && menu) {
    const setOpen = (open) => { nav.classList.toggle('is-open', open); menu.setAttribute('aria-expanded', String(open)); };
    menu.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((a) => { if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page'); });
  if (nav) {
    let last = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      nav.classList.toggle('is-hidden', y > last && y > 400 && !nav.classList.contains('is-open'));
      last = y;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- liquid glass follows the pointer */
  if (!reduce && matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', (e) => {
      const g = e.target.closest && e.target.closest('.glass');
      if (!g) return;
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      g.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- Vanta: one living background per page */
  const vantaEl = document.querySelector('[data-vanta]');
  let effect = null;
  function startVanta() {
    if (!vantaEl || reduce || !window.VANTA) return;
    const kind = vantaEl.dataset.vanta;
    try {
      if (kind === 'trunk' && VANTA.TRUNK && window.p5) {
        // Vanta's trunk sketch only fills a quarter of the canvas on high-density screens
        // (phones, Retina laptops). Drawing it at 1x keeps the rings intact everywhere.
        if (!p5.prototype.__egDensity) {
          const create = p5.prototype.createCanvas;
          p5.prototype.createCanvas = function (...args) { this.pixelDensity(1); return create.apply(this, args); };
          p5.prototype.__egDensity = true;
        }
        effect = VANTA.TRUNK({
          el: vantaEl, p5: window.p5, mouseControls: true, touchControls: true, gyroControls: false,
          minHeight: 200, minWidth: 200, scale: 1, scaleMobile: 1,
          color: 0x6fe39a, backgroundColor: 0x050a07, spacing: 2, chaos: 4.5,
        });
      } else if (kind === 'fog' && VANTA.FOG && window.THREE) {
        effect = VANTA.FOG({
          el: vantaEl, THREE: window.THREE, mouseControls: true, touchControls: true, gyroControls: false,
          minHeight: 200, minWidth: 200,
          highlightColor: 0x2f8f5a, midtoneColor: 0x123a26, lowlightColor: 0x07140d, baseColor: 0x050a07,
          blurFactor: 0.72, speed: 0.7, zoom: 0.8,
        });
      }
    } catch (err) { effect = null; }
  }
  startVanta();
  addEventListener('pagehide', () => { if (effect) { effect.destroy(); effect = null; } });

  /* ---------------------------------------------------------------- the trunk that grows down the page */
  const grows = document.querySelector('.grows');
  let trunkTrigger = null;
  function buildTrunk() {
    if (!grows) return;
    let svg = grows.querySelector('.trunk');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'trunk');
      svg.setAttribute('aria-hidden', 'true');
      grows.prepend(svg);
    }
    const W = grows.clientWidth, H = grows.scrollHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const g = grows.getBoundingClientRect();
    const wrapEl = grows.querySelector('.wrap');
    const gutter = wrapEl ? wrapEl.getBoundingClientRect().left - g.left : 40;
    // the stem lives in the left gutter, never across the copy
    const x = Math.max(8, Math.round(gutter / 2));
    const knots = [...grows.querySelectorAll('[data-knot]')].map((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const r = range.getBoundingClientRect();
      return { y: r.top - g.top + Math.min(r.height, 80) / 2, ex: r.left - g.left - 22 };
    });
    let d = `M ${x} 0`;
    const seg = 260;
    for (let y = seg, i = 0; y <= H + seg; y += seg, i++) {
      const sway = gutter < 40 ? 2 : (i % 2 ? 10 : -10);
      d += ` Q ${x + sway} ${y - seg / 2} ${x} ${Math.min(y, H)}`;
    }
    const branches = knots.map((k) => {
      if (k.ex - x < 28) return '';
      const midx = x + (k.ex - x) * 0.45;
      return `<path class="trunk__branch" d="M ${x} ${k.y + 70} C ${x + 6} ${k.y + 20}, ${midx} ${k.y}, ${k.ex} ${k.y}"/><circle cx="${k.ex}" cy="${k.y}" r="3"/>`;
    }).join('');
    svg.innerHTML = `<path class="trunk__main" d="${d}"/>${branches}`;

    if (!hasGsap || !window.ScrollTrigger || reduce) return;
    const paths = [...svg.querySelectorAll('path')];
    const dots = svg.querySelectorAll('circle');
    paths.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    gsap.set(dots, { opacity: 0, scale: 0, transformOrigin: 'center' });
    if (trunkTrigger) trunkTrigger.kill();
    const main = paths[0];
    trunkTrigger = ScrollTrigger.create({
      trigger: grows, start: 'top 70%', end: 'bottom 80%', scrub: 0.6,
      onUpdate: (st) => { main.style.strokeDashoffset = main.getTotalLength() * (1 - st.progress); },
    });
    paths.slice(1).forEach((p, i) => {
      gsap.to(p, { strokeDashoffset: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: grows.querySelectorAll('[data-knot]')[i], start: 'top 75%' } });
      gsap.to(dots[i], { opacity: 1, scale: 1, duration: 0.6, delay: 0.9, ease: 'back.out(3)', scrollTrigger: { trigger: grows.querySelectorAll('[data-knot]')[i], start: 'top 75%' } });
    });
  }

  /* ---------------------------------------------------------------- entrances */
  function entrances() {
    if (!hasGsap || reduce) { showAll(); return; }
    const hero = document.querySelector('.hero__inner');
    if (hero) {
      const parts = hero.querySelectorAll('[data-rise]');
      gsap.to(parts, { opacity: 1, translate: '0 0', filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: root.classList.contains('is-arriving') ? 0.45 : 0.15 });
    }
    if (!window.ScrollTrigger) { showAll(); return; }
    const rest = [...document.querySelectorAll('[data-rise]')].filter((el) => !el.closest('.hero__inner'));
    ScrollTrigger.batch(rest, {
      start: 'top 88%', once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, translate: '0 0', filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', stagger: 0.08 }),
    });
    // the canopy of faces drifts sideways, forever; it pauses under the pointer
    const track = document.querySelector('.faces__track');
    if (track) {
      [...track.children].forEach((c) => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.tabIndex = -1; track.appendChild(k); });
      const loop = gsap.to(track, { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });
      track.addEventListener('pointerenter', () => gsap.to(loop, { timeScale: 0, duration: 0.6 }));
      track.addEventListener('pointerleave', () => gsap.to(loop, { timeScale: 1, duration: 0.6 }));
      track.addEventListener('focusin', () => loop.pause());
      track.addEventListener('focusout', () => loop.play());
    }
    // the cross-section: rings draw in, then each step lights its ring as you read it
    const art = document.querySelector('.rings-art');
    if (art) {
      const rings = [...art.querySelectorAll('.growth-ring')];
      rings.forEach((r) => { const L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; });
      gsap.to(rings, { strokeDashoffset: 0, duration: 2.2, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: art, start: 'top 80%' } });
      const stepRings = [...art.querySelectorAll('.growth-ring--step')];
      const steps = [...document.querySelectorAll('.growth .step')];
      const light = (n) => {
        steps.forEach((st, i) => st.classList.toggle('is-lit', i === n));
        stepRings.forEach((r) => r.classList.toggle('is-lit', +r.dataset.step <= n));
      };
      steps.forEach((st, i) => {
        ScrollTrigger.create({ trigger: st, start: 'top 65%', end: 'bottom 35%', onEnter: () => light(i), onEnterBack: () => light(i), onLeaveBack: () => light(i - 1) });
      });
    }
    // the footer wordmark grows into place
    const mark = document.querySelector('.wordmark');
    if (mark) gsap.fromTo(mark, { yPercent: 40, opacity: 0.15, scale: 0.94 }, { yPercent: 0, opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: mark, start: 'top bottom', end: 'bottom 85%', scrub: true } });
  }

  /* ---------------------------------------------------------------- subject branches (tabs) */
  const tabs = [...document.querySelectorAll('.branch-tab')];
  if (tabs.length) {
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (hasGsap && !reduce) gsap.fromTo(panels[i].children, { opacity: 0, y: 14, filter: 'blur(4px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out', stagger: 0.05 });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(k)) return;
        e.preventDefault();
        const n = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : (i + (k === 'ArrowDown' || k === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        select(n, true);
      });
    });
    select(0);
  }

  /* ---------------------------------------------------------------- the request form */
  const TUTORS = {
    daniel: ['Daniel', 'images/daniel_bio.png'], katherine: ['Katherine', 'images/katherine_bio.jpg'],
    jack: ['Jack', 'images/jack_bio.png'], eliot: ['Eliot', 'images/eliot_portrait.jpg'], robert: ['Robert', null],
    sue: ['Sue', 'images/sue_bio.jpg'], vincent: ['Vincent', 'images/vincent_bio.jpg'], sam: ['Sam', 'images/sam_bio.jpg'],
    isaac: ['Isaac', 'images/isaac_bio.webp'], victor: ['Victor', 'images/victor_bio.webp'], gary: ['Gary', 'images/gary_portrait.jpg'],
  };
  const BY_SUBJECT = {
    math: ['jack', 'sam', 'eliot'], english: ['robert', 'daniel'], science: ['eliot', 'gary', 'sue'],
    coding: ['jack', 'victor'], music: ['sue', 'vincent', 'daniel', 'katherine'],
    'social-studies': ['isaac', 'robert'], beyond: ['sue', 'sam', 'katherine'],
  };
  const form = document.getElementById('request-form');
  const subject = document.getElementById('subject');
  const match = form && form.querySelector('.match');
  const names = (l) => (l.length < 2 ? l.join('') : l.slice(0, -1).join(', ') + ' or ' + l[l.length - 1]);
  function showMatch(v) {
    if (!match) return;
    const ids = BY_SUBJECT[v];
    if (!ids) { match.hidden = true; return; }
    const faces = match.querySelector('.match__faces');
    faces.innerHTML = '';
    ids.forEach((id) => { if (!TUTORS[id][1]) return; const img = new Image(48, 48); img.src = TUTORS[id][1]; img.alt = ''; faces.appendChild(img); });
    match.querySelector('p').textContent = 'You could learn with ' + names(ids.map((id) => TUTORS[id][0])) + '.';
    match.hidden = false;
    if (hasGsap && !reduce) gsap.from(faces.children, { scale: 0.4, opacity: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.06 });
  }
  if (subject) {
    subject.addEventListener('change', () => showMatch(subject.value));
    const fromUrl = new URLSearchParams(location.search).get('subject');
    if (fromUrl && BY_SUBJECT[fromUrl]) { subject.value = fromUrl; showMatch(fromUrl); }
  }
  // the hero finder hands its choice to the form
  const finder = document.getElementById('finder');
  if (finder && subject) {
    finder.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = finder.querySelector('select').value;
      if (v) { subject.value = v; showMatch(v); }
      document.getElementById('request').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
      setTimeout(() => document.getElementById('parentName').focus({ preventScroll: true }), reduce ? 0 : 900);
    });
  }
  if (form && window.fetch) {
    const status = form.querySelector('.status');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      button.disabled = true;
      status.dataset.state = '';
      status.textContent = 'Sending your request…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        if (match) match.hidden = true;
        status.dataset.state = 'ok';
        status.textContent = 'Thank you. We have your request and will email you with a tutor match.';
      } catch (err) {
        status.dataset.state = 'error';
        status.textContent = 'That did not go through. Please try again, or email info@eternalgrowth.org.';
      } finally {
        button.disabled = false;
      }
    });
  }

  /* ---------------------------------------------------------------- pause the seedling clip off screen */
  document.querySelectorAll('video[autoplay]').forEach((v) => {
    if (reduce) { v.pause(); v.removeAttribute('autoplay'); return; }
    new IntersectionObserver(([en]) => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(v);
  });

  /* ---------------------------------------------------------------- go */
  const ready = () => {
    arrive();
    entrances();
    buildTrunk();
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { buildTrunk(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 250); });
  };
  if (document.readyState === 'complete') ready(); else addEventListener('load', ready);
  // safety net: if anything is still hidden after the load sequence, show it
  setTimeout(() => {
    document.querySelectorAll('[data-rise]').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === '0') { el.style.opacity = 1; el.style.translate = 'none'; el.style.filter = 'none'; }
    });
  }, 3500);
})();
