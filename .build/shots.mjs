import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const base = 'http://127.0.0.1:5500/';
const out = '.taste-skill/shots/';
const pages = (process.argv[2] || 'index,subjects,team,about').split(',');
const sizes = (process.argv[3] || 'd,m').split(',');
const steps = Number(process.argv[4] || 8);
const b = await Browser.launch();
try {
  for (const name of pages) {
    for (const s of sizes) {
      const vp = s === 'd' ? { width: 1440, height: 900 } : { width: 390, height: 844, mobile: true, dsf: 2 };
      const p = await b.newPage(vp);
      await p.goto(base + name + '.html', { settleMs: 2500 });
      const errs = await p.eval(() => (window.__errs || []).join(' | '));
      const info = await p.eval(() => ({
        h: document.documentElement.scrollHeight,
        vanta: !!document.querySelector('[data-vanta] canvas'),
        gsap: !!window.gsap, overflow: document.documentElement.scrollWidth - innerWidth,
        hidden: [...document.querySelectorAll('[data-rise]')].filter((e) => getComputedStyle(e).opacity === '0').length,
      }));
      console.log(name, s, JSON.stringify(info), errs);
      const n = Math.min(steps, Math.ceil(info.h / vp.height));
      for (let i = 0; i < n; i++) {
        await p.eval((y) => window.scrollTo(0, y), Math.round(i * (info.h - vp.height) / Math.max(1, n - 1)));
        await sleep(1400);
        await p.screenshot({ path: `${out}${name}-${s}-${String(i).padStart(2, '0')}.jpg`, quality: 70 });
      }
      await p.close();
    }
  }
} finally { await b.close(); }
