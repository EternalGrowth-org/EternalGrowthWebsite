// Checks that the page name in the shutter transition stays centred while leaving and arriving.
import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
const b = await Browser.launch();
const out = '.taste-skill/shots/';
try {
  const p = await b.newPage({ width: 1440, height: 900 });
  await p.goto('http://127.0.0.1:5500/index.html', { settleMs: 2500 });
  const rect = () => p.eval(() => { const w = document.querySelector('.shutter__word > span'); const r = w.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2), w.textContent]; });
  await p.eval(() => { const a = [...document.querySelectorAll('.nav__links a')].find((x) => x.textContent.trim() === 'Team'); a.click(); });
  const leaving = [];
  for (let i = 0; i < 5; i++) { await sleep(180); try { leaving.push(await rect()); } catch (e) { break; } }
  try { await p.screenshot({ path: out + 'leave.jpg', quality: 60 }); } catch (e) { /* navigating */ }
  await sleep(1400);
  const arriving = [];
  for (let i = 0; i < 4; i++) { try { arriving.push(await rect()); } catch (e) { /* not ready */ } await sleep(150); }
  console.log('leaving ', JSON.stringify(leaving));
  console.log('arriving', JSON.stringify(arriving));
  console.log('url', await p.eval(() => location.pathname));
} finally { await b.close(); }
