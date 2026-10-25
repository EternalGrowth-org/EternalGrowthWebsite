// Screenshots each section aligned to the top of a 1440x900 screen, to check composition.
import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const page = process.argv[2] || 'index.html';
const ids = (process.argv[3] || 'idea,stages,ways,people').split(',');
const b = await Browser.launch();
try {
  const p = await b.newPage({ width: 1440, height: 900 });
  await p.goto('http://127.0.0.1:5500/' + page, { settleMs: 2500 });
  for (const id of ids) {
    await p.eval((x) => { const el = document.getElementById(x); window.scrollTo(0, el.getBoundingClientRect().top + scrollY); }, id);
    await sleep(2200);
    await p.screenshot({ path: `.taste-skill/shots/sec-${id}.jpg`, quality: 60 });
  }
} finally { await b.close(); }
