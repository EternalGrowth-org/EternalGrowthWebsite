# Eternal Growth website

Static site for Eternal Growth, a Long Island nonprofit tutoring organization. Live at https://eternalgrowth.org.

## Stack and hosting
- Plain HTML, CSS and JavaScript. No build step, no framework, no package manager.
- Hosted on GitHub Pages from the `main` branch, repo root. Every push to `main` goes live within a minute or two.
- `CNAME` holds the custom domain (`eternalgrowth.org`). Don't delete or rename it.
- Domain registered at Squarespace; DNS points to GitHub Pages. Email runs on Google Workspace, so never touch MX, SPF, DKIM or the googlehosted records.

## Files
- `index.html`, `about.html`, `subjects.html`, `team.html` — the four pages. Each links `style.css`, `motion.css`, `script.js`, `motion.js`; all but `about.html` also load `dotGrid.js`.
- `style.css` — main styles and design tokens (`:root` variables: greens `--forest-*`, `--sage-*`, `--mint-fresh`, etc.; font Inter).
- `motion.css` / `motion.js` — hero entrance (word reveal, underline grow, shapes assemble), cursor/scroll depth on hero shapes, stat count-up, cross-page View Transitions. Respects `prefers-reduced-motion` and works without JS (hidden start states are scoped under `html.js`).
- `script.js` — nav, hamburger menu, scroll-in animations for other sections, notifications.
- `dotGrid.js` — interactive dot-grid canvas background.
- `images/` — team bio photos, resized to max 600px. Keep new photos at that size.
- Contact form posts to Formspree (`https://formspree.io/f/xqagapza`); no backend.

## Conventions
- Hero shapes: each CSS property has one owner — `transform` (entrance + drift keyframes), `translate` (JS depth via `--dx`/`--dy`), `rotate` (resting angle), `scale` (hover/tap). Don't set `style.transform` on them from JS.
- Breakpoint for mobile is `max-width: 768px`.
- Test changes locally with `python -m http.server` and check desktop and ~390px phone width before pushing.
