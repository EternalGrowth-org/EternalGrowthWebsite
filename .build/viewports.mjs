// Loads every page at a range of widths and reports layout problems:
// sideways scroll, visible elements that stick out past the screen, and text that overflows its box.
// Run with the preview server up: node .build/viewports.mjs [pages] [widths]
import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const base = 'http://127.0.0.1:5500/';
const pages = (process.argv[2] || ',subjects,impact,about,team').split(',');
const widths = (process.argv[3] || '320,375,414,600,768,900,1024,1280,1440,1920,2560').split(',').map(Number);
const b = await Browser.launch();
let problems = 0;
try {
  for (const w of widths) {
    const h = w < 700 ? 800 : w < 1100 ? 1000 : Math.round(w * 0.56);
    for (const pg of pages) {
      const p = await b.newPage({ width: w, height: h, mobile: w < 700, dsf: 1 });
      await p.goto(base + pg, { settleMs: 1800 });
      // scroll through so lazy content and reveals settle
      await p.eval(async () => { const H = document.documentElement.scrollHeight; for (let y = 0; y < H; y += innerHeight * 0.8) { (window.ScrollSmoother && ScrollSmoother.get() ? ScrollSmoother.get().scrollTo(y, false) : window.scrollTo(0, y)); await new Promise((r) => setTimeout(r, 60)); } });
      await sleep(400);
      const r = await p.eval(() => {
        const W = innerWidth;
        const clipped = (el) => { for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) { const s = getComputedStyle(a); if (/(hidden|clip)/.test(s.overflowX) || s.position === 'fixed') return true; } return false; };
        const out = [];
        for (const el of document.querySelectorAll('#smooth-content *')) {
          const s = getComputedStyle(el);
          if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) continue;
          const q = el.getBoundingClientRect();
          if (!q.width || !q.height) continue;
          if ((q.right > W + 1 || q.left < -1) && !clipped(el) && !el.closest('[aria-hidden="true"]')) out.push(`sticks out ${el.tagName.toLowerCase()}.${[...el.classList].join('.')} ${Math.round(q.left)}..${Math.round(q.right)}`);
          if (/^(H1|H2|H3|P|A|BUTTON|SPAN|B|LI)$/.test(el.tagName) && el.scrollWidth > el.clientWidth + 8 && s.overflowX === 'visible' && el.clientWidth > 1 && !el.closest('.marquee,.ticker,.visually-hidden,[aria-hidden="true"]') && s.display !== 'inline') out.push(`text overflows ${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${el.textContent.trim().slice(0, 30)}" ${el.scrollWidth}>${el.clientWidth}`);
        }
        return { sideways: document.documentElement.scrollWidth - W, out: [...new Set(out)].slice(0, 8) };
      });
      const bad = r.sideways > 0 || r.out.length;
      if (bad) { problems++; console.log(`${w}px /${pg}: sideways ${r.sideways}`); r.out.forEach((x) => console.log('   ' + x)); }
      await p.close();
    }
  }
} finally { await b.close(); }
console.log(problems ? `${problems} page/width combinations with problems` : 'no layout problems at any width');
