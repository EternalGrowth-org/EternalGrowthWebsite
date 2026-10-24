// Eternal Growth — the small amount of script the site needs.
// Everything works without it: the menu shows, content is visible, the form posts to Formspree.
(function () {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile menu ---------- */
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  if (nav && toggle) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close' : 'Menu';
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.querySelectorAll('ul a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  /* ---------- mark the current page in the nav ---------- */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav ul a').forEach((a) => {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------- reveal once on entry ---------- */
  const targets = document.querySelectorAll('[data-reveal], [data-open]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    targets.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach((el) => io.observe(el));
    // safety net: anything on screen that never got its class is shown anyway
    window.addEventListener('load', () => setTimeout(() => {
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 2500));
  }

  /* ---------- the header takes the ink and ground of the chapter under it ---------- */
  const header = document.querySelector('.site-header');
  const chapters = document.querySelectorAll('[data-ink]');
  if (header && chapters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        root.style.setProperty('--header-ink', entry.target.dataset.ink);
        root.style.setProperty('--header-ground', entry.target.dataset.ground || 'transparent');
      });
    }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
    chapters.forEach((el) => cio.observe(el));
    const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 8);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- the hero field keeps rising as you scroll ---------- */
  const hero = document.querySelector('.hero');
  if (hero && !reduceMotion) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const h = hero.offsetHeight;
      const p = Math.min(Math.max(scrollY / h, 0), 1);
      // up to 38% of the hero's height: the seam climbs over the first line of the name
      hero.style.setProperty('--lift', (p * 38).toFixed(2) + '%');
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  /* ---------- pause the seedling loop when it is off screen ---------- */
  document.querySelectorAll('video[autoplay]').forEach((v) => {
    if (reduceMotion) { v.pause(); v.removeAttribute('autoplay'); return; }
    if (!('IntersectionObserver' in window)) return;
    new IntersectionObserver(([e]) => { e.isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(v);
  });

  /* ---------- the request form: who could teach this ---------- */
  const TUTORS = {
    daniel: { name: 'Daniel', img: 'images/daniel_bio.png' },
    katherine: { name: 'Katherine', img: 'images/katherine_bio.jpg' },
    jack: { name: 'Jack', img: 'images/jack_bio.png' },
    eliot: { name: 'Eliot', img: 'images/eliot_bio.png' },
    robert: { name: 'Robert', img: null },
    sue: { name: 'Sue', img: 'images/sue_bio.jpg' },
    vincent: { name: 'Vincent', img: 'images/vincent_bio.jpg' },
    sam: { name: 'Sam', img: 'images/sam_bio.jpg' },
    isaac: { name: 'Isaac', img: 'images/isaac_bio.webp' },
    victor: { name: 'Victor', img: 'images/victor_bio.webp' },
    gary: { name: 'Gary', img: 'images/gary_bio.png' },
  };
  const BY_SUBJECT = {
    math: ['jack', 'sam', 'eliot'],
    english: ['robert', 'daniel'],
    science: ['eliot', 'gary', 'sue'],
    coding: ['jack', 'victor'],
    music: ['sue', 'vincent', 'daniel', 'katherine'],
    'social-studies': ['isaac', 'robert'],
    beyond: ['sue', 'sam', 'katherine'],
  };

  const form = document.getElementById('request-form');
  const select = document.getElementById('subject');
  const match = form && form.querySelector('.match');

  const listNames = (names) => names.length < 2 ? names.join('') :
    names.slice(0, -1).join(', ') + ' or ' + names[names.length - 1];

  function showMatch(value) {
    if (!match) return;
    const ids = BY_SUBJECT[value];
    if (!ids) { match.hidden = true; return; }
    const faces = match.querySelector('.match__faces');
    faces.innerHTML = '';
    ids.forEach((id, i) => {
      const t = TUTORS[id];
      if (!t.img) return;
      const img = document.createElement('img');
      img.src = t.img; img.alt = ''; img.width = 48; img.height = 48;
      img.style.setProperty('--i', i);
      faces.appendChild(img);
    });
    match.querySelector('.match__text').textContent =
      'You could learn with ' + listNames(ids.map((id) => TUTORS[id].name)) + '.';
    match.hidden = false;
  }

  if (select) {
    select.addEventListener('change', () => showMatch(select.value));
    // subject rows on the home page and links from other pages pre-fill the choice
    document.querySelectorAll('[data-subject]').forEach((a) => {
      a.addEventListener('click', () => { select.value = a.dataset.subject; showMatch(select.value); });
    });
    const fromUrl = new URLSearchParams(location.search).get('subject');
    if (fromUrl && BY_SUBJECT[fromUrl]) { select.value = fromUrl; showMatch(fromUrl); }
  }

  if (form && window.fetch && window.FormData) {
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      button.disabled = true;
      status.dataset.state = '';
      status.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, {
          method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error(res.status);
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
})();
