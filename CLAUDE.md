# Eternal Growth website

Static site for Eternal Growth, a Long Island nonprofit tutoring organization run by high school students. Black-and-silver luxury design (engraved Cinzel capitals, hairline frames), Vanta NET background and GSAP motion throughout. Live at https://eternalgrowth.org.

## Stack and hosting
- Plain HTML, CSS and JavaScript. No build step, no framework, no package manager.
- Hosted on GitHub Pages from the `main` branch, repo root. Every push to `main` goes live within a minute or two.
- `CNAME` holds the custom domain (`eternalgrowth.org`). Don't delete or rename it.
- Domain registered at Squarespace; DNS points to GitHub Pages. Email runs on Google Workspace, so never touch MX, SPF, DKIM or the googlehosted records.

## Files
- `index.html`, `subjects.html`, `about.html`, `team.html` — the four pages. The header (nav, shutter transition overlay, cursor) and footer are identical on every page; change them in all four.
- `style.css` — all styles. Tokens on `:root` (colours `--black`, `--bone`, `--silver`, `--line`, type steps). See `DESIGN.md` for the system.
- `script.js` — GSAP shutter page transitions, cursor, parallax, split-text and word animations, marquees, the pinned subject slider, process line, plate tilt, footer clock, FAQ, Vanta start-up, the hero finder and the request form (Formspree, sent in the background, shows matching tutors).
- `vendor/` — Vanta 0.5.24 (`vanta.net`) and three.js r134, served locally. GSAP 3.12.5 loads from cdnjs.
- `images/` — team photos, max 600px. They are not shown right now: people appear as monogram plates (`plate__face`). To bring a photo back, put an `<img>` inside that person's plate.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product facts, the design system, and the design brief.
- Contact form posts to Formspree (`https://formspree.io/f/xqagapza`). Field names (`parentName`, `studentName`, `email`, `subject`, `grade`, `message`) are what Formspree receives; don't rename them.

## Updating content
- Tutors per subject live in three places: the home page slider, `subjects.html`, and `BY_SUBJECT` in `script.js`. Keep them in step.
- Add `data-rise` to anything that should rise in, `data-split` to a heading that should rise letter by letter, `data-words` to a statement that lights word by word, and `data-strokes` to line art that should draw itself.

## Conventions
- Breakpoint: `max-width: 860px` for phones and tablets (menu overlay, stacked columns, swipeable slider).
- Test changes locally with `python -m http.server` and check desktop and ~390px phone width before pushing.
