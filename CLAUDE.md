# Eternal Growth website

Static site for Eternal Growth, a Long Island nonprofit tutoring organization run by high school students. Dark "living tree" design with liquid glass, Vanta backgrounds and GSAP motion. Live at https://eternalgrowth.org.

## Stack and hosting
- Plain HTML, CSS and JavaScript. No build step, no framework, no package manager.
- Hosted on GitHub Pages from the `main` branch, repo root. Every push to `main` goes live within a minute or two.
- `CNAME` holds the custom domain (`eternalgrowth.org`). Don't delete or rename it.
- Domain registered at Squarespace; DNS points to GitHub Pages. Email runs on Google Workspace, so never touch MX, SPF, DKIM or the googlehosted records.

## Files
- `index.html`, `subjects.html`, `about.html`, `team.html` — the four pages. The header (glass nav, transition overlay) and footer are identical on every page; change them in all four.
- `style.css` — all styles. Tokens on `:root` (colours `--ground`, `--sap`, `--lichen`, text greys, type steps, glass recipe). See `DESIGN.md` for the system.
- `script.js` — GSAP page transitions, the scroll-drawn trunk, reveals, Vanta start-up, nav, subject tabs, the hero finder and the request form (Formspree, sent in the background, shows matching tutors).
- `vendor/` — Vanta 0.5.24 (`vanta.trunk`, `vanta.fog`), three.js r134 and p5.js, served locally. GSAP 3.12.5 loads from cdnjs.
- `images/` — team photos, max 600px. `*_portrait.jpg` are tighter crops used instead of the originals for Gary, Austin and Eliot.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product facts, the design system, and the design brief.
- Contact form posts to Formspree (`https://formspree.io/f/xqagapza`). Field names (`parentName`, `studentName`, `email`, `subject`, `grade`, `message`) are what Formspree receives; don't rename them.

## Updating content
- Tutors per subject live in three places: the home page subject tabs, `subjects.html`, and `BY_SUBJECT` in `script.js`. Keep them in step.
- Robert Liu Meng has no photo yet; his cards show initials until one is added.
- Add `data-rise` to anything that should animate in, and `data-knot` to a heading the trunk should branch to.

## Conventions
- Breakpoints: `max-width: 760px` for phones, `max-width: 860px` where two-column sections stack.
- Test changes locally with `python -m http.server` and check desktop and ~390px phone width before pushing.
