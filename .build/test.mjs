import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const base = 'http://127.0.0.1:5500/';
const out = 'C:/Users/awvp3/.claude/jobs/8495729c/tmp/';
const b = await Browser.launch();
const results = [];
const check = (name, ok, detail = '') => console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);

try {
  // phone: menu opens and closes
  let p = await b.newPage({ width: 390, height: 844, mobile: true, dsf: 2 });
  await p.goto(base + 'index.html');
  const before = await p.eval(() => document.querySelector('.nav').classList.contains('is-open'));
  await p.eval(() => document.querySelector('.nav__menu').click());
  await sleep(400);
  const after = await p.eval(() => [document.querySelector('.nav').classList.contains('is-open'), document.querySelector('.nav__menu').getAttribute('aria-expanded')]);
  check('phone menu opens', before === false && after[0] === true && after[1] === 'true', `${before} -> ${after}`);
  await p.screenshot({ path: out + 'menu-open.jpg' });
  await p.eval(() => document.querySelector('.nav__menu').click());
  await sleep(400);
  const closed = await p.eval(() => document.querySelector('.nav').classList.contains('is-open'));
  check('phone menu closes', closed === false, String(closed));
  const overflow = await p.eval(() => document.documentElement.scrollWidth - innerWidth);
  check('no sideways scroll at 390', overflow <= 0, String(overflow));
  await p.close();

  // desktop: picking a subject shows who could teach it
  p = await b.newPage({ width: 1440, height: 900 });
  await p.goto(base + 'index.html');
  const hiddenAtStart = await p.eval(() => document.querySelector('.match').hidden);
  await p.eval(() => { const s = document.getElementById('subject'); s.value = 'music'; s.dispatchEvent(new Event('change')); });
  await sleep(600);
  const m = await p.eval(() => ({ hidden: document.querySelector('.match').hidden, text: document.querySelector('.match p').textContent, faces: document.querySelectorAll('.match .monos span').length }));
  check('match hidden before choice', hiddenAtStart === true);
  check('match shows tutors for music', !m.hidden && m.faces === 4, `${m.faces} faces, "${m.text}"`);
  await p.eval(() => { const s = window.ScrollSmoother && ScrollSmoother.get(); if (s) s.scrollTo('#request', false, 'top 90px'); else document.getElementById('request').scrollIntoView(); });
  await sleep(1500);
  await p.screenshot({ path: out + 'match.jpg' });

  // subject row pre-fills the form
  await p.eval(() => { const f = document.getElementById('finder'); f.querySelector('select').value = 'coding'; f.requestSubmit(); });
  await sleep(2600);
  const v = await p.eval(() => [document.getElementById('subject').value, Math.round(document.getElementById('request').getBoundingClientRect().top)]);
  check('hero finder pre-fills form and scrolls to it', v[0] === 'coding' && v[1] < 200, v.join(' | '));
  const sl = await p.eval(async () => { const s0 = ScrollTrigger.getAll().find((x) => x.pin); window.scrollTo(0, s0.start + 2); await new Promise((r) => setTimeout(r, 1500)); const c = document.querySelector('.slider__count'); const before = c.textContent; document.querySelector('[data-next]').click(); await new Promise((r) => setTimeout(r, 2200)); return [before, c.textContent]; });
  check('slider next button advances', sl[0] !== sl[1], sl.join(' -> '));
  // form fields keep the names Formspree already receives
  const names = await p.eval(() => [...document.querySelectorAll('#request-form [name]')].map((e) => e.name).join(','));
  check('form field names unchanged', names === 'parentName,studentName,email,subject,grade,message', names);
  const action = await p.eval(() => document.getElementById('request-form').action);
  check('form posts to Formspree', action === 'https://formspree.io/f/xqagapza', action);
  await p.close();

  p = await b.newPage({ width: 1440, height: 900 });
  await p.goto(base + 'about.html', { settleMs: 1500 });
  const fq = await p.eval(async () => { const btn = document.querySelector('.faq button'); btn.click(); await new Promise((r) => setTimeout(r, 900)); const pn = document.getElementById(btn.getAttribute('aria-controls')); return [btn.getAttribute('aria-expanded'), pn.hidden, Math.round(pn.getBoundingClientRect().height)]; });
  check('FAQ opens', fq[0] === 'true' && fq[1] === false && fq[2] > 20, fq.join(','));
  const clock = await p.eval(() => document.querySelector('[data-clock]').textContent);
  check('footer clock ticks', /^\d\d:\d\d:\d\d$/.test(clock), clock);
  await p.close();

  // link from the subjects page pre-fills
  p = await b.newPage({ width: 1440, height: 900 });
  await p.goto(base + '?subject=science#request');
  const v2 = await p.eval(() => [document.getElementById('subject').value, document.querySelector('.match p').textContent]);
  check('?subject= link pre-fills form', v2[0] === 'science', v2.join(' | '));
  await p.close();

  // every internal link resolves
  const pages = ['', 'subjects', 'impact', 'about', 'team'];
  const seen = new Set();
  for (const pg of pages) {
    p = await b.newPage({ width: 1440, height: 900 });
    await p.goto(base + pg, { settleMs: 300 });
    const links = await p.eval(() => [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin)));
    const ids = await p.eval(() => [...document.querySelectorAll('a[href*="#"]')].map((a) => a.getAttribute('href')));
    for (const l of links) seen.add(l.split('#')[0]);
    // anchors on the same or another page
    for (const h of ids) {
      const [file, id] = h.split('#');
      if (!id) continue;
      const target = file ? file.split('?')[0].replace(/^\.\/$/, '') : pg;
      const ok = await (async () => {
        if (target === pg) return p.eval((x) => !!document.getElementById(x), id);
        const q = await b.newPage({ width: 800, height: 600 });
        await q.goto(base + target, { settleMs: 100 });
        const r = await q.eval((x) => !!document.getElementById(x), id);
        await q.close();
        return r;
      })();
      if (!ok) check(`anchor ${h} on ${pg}`, false);
    }
    const imgs = await p.eval(async () => { for (const i of document.images) { i.loading = 'eager'; } await new Promise((r) => setTimeout(r, 1500)); return [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src); });
    check(`images load on /${pg}`, imgs.length === 0, imgs.join(', '));
    await p.close();
  }
  p = await b.newPage({ width: 800, height: 600 });
  await p.goto(base + 'index.html', { settleMs: 100 });
  const bad = await p.eval(async (urls) => { const out = []; for (const u of urls) { const r = await fetch(u); if (!r.ok) out.push(u + ' ' + r.status); } return out; }, [...seen]);
  await p.close();
  check('no broken internal links', bad.length === 0, bad.join(', '));
  check('internal pages reachable', true, [...seen].map((u) => u.replace(base, '')).join(', '));
} finally {
  await b.close();
}
console.log(results.join('\n'));
