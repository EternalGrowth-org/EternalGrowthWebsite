// Renders the favicon set and the social share image from .build/brand/*.html.
// Run from the repo root with the preview server on :5500: node .build/icons.mjs
import { Browser, sleep } from 'file:///C:/Users/awvp3/.claude/skills/design-taste-frontend/scripts/lib/cdp.mjs';
import { writeFileSync, readFileSync, unlinkSync } from 'node:fs';
const base = 'http://127.0.0.1:5500/.build/brand/';
const jobs = [
  ['favicon-16.png', 16, 'icon.html?s=100'],
  ['favicon-32.png', 32, 'icon.html?s=100'],
  ['favicon-48.png', 48, 'icon.html?s=100'],
  ['apple-touch-icon.png', 180, 'icon.html?s=62&tile=1'],
  ['icon-192.png', 192, 'icon.html?s=100'],
  ['icon-512.png', 512, 'icon.html?s=100'],
  ['icon-maskable-512.png', 512, 'icon.html?s=56&tile=1'],
];
const b = await Browser.launch();
try {
  for (const [name, size, url] of jobs) {
    const p = await b.newPage({ width: size, height: size });
    await p.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
    await p.goto(base + url, { settleMs: 300 });
    await p.screenshot({ path: name, format: 'png' });
    await p.close();
  }
  const p = await b.newPage({ width: 1200, height: 630 });
  await p.goto(base + 'og.html', { settleMs: 800 });
  await p.eval(() => document.fonts.ready.then(() => true));
  await sleep(300);
  await p.screenshot({ path: 'og-image.png', format: 'png' });
} finally { await b.close(); }

// favicon.ico: the 16, 32 and 48 px PNGs packed into one file
const sizes = [16, 32, 48];
const imgs = sizes.map((s) => readFileSync(`favicon-${s}.png`));
const head = Buffer.alloc(6 + 16 * imgs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
let off = head.length;
imgs.forEach((d, i) => {
  const o = 6 + 16 * i;
  head.writeUInt8(sizes[i], o); head.writeUInt8(sizes[i], o + 1); head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
  head.writeUInt32LE(d.length, o + 8); head.writeUInt32LE(off, o + 12); off += d.length;
});
writeFileSync('favicon.ico', Buffer.concat([head, ...imgs]));
for (const s of sizes) unlinkSync(`favicon-${s}.png`);
console.log('icons written');
