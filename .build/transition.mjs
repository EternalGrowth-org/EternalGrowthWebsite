// Checks the page transition: black bars close, no word shows, the next page opens.
import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const b = await Browser.launch();
const out = '.taste-skill/shots/';
try {
  const p = await b.newPage({ width: 1440, height: 900 });
  await p.goto('http://127.0.0.1:5500/index.html', { settleMs: 2500 });
  const state = () => p.eval(() => ({ text: document.querySelector('.shutter').textContent.trim(), bars: [...document.querySelectorAll('.shutter i')].map((i) => getComputedStyle(i).transform) }));
  await p.eval(() => { [...document.querySelectorAll('.nav__links a')].find((x) => x.textContent.trim() === 'Team').click(); });
  await sleep(500);
  try { console.log('leaving', JSON.stringify(await state())); await p.screenshot({ path: out + 'leave.jpg', quality: 60 }); } catch (e) { /* navigating */ }
  await sleep(2600);
  console.log('arrived', JSON.stringify(await state()), await p.eval(() => location.pathname));
} finally { await b.close(); }
