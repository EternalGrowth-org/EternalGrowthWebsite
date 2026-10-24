# Eternal Growth website

Static site for Eternal Growth, a Long Island nonprofit tutoring organization run by high school students. Live at https://eternalgrowth.org.

## Stack and hosting
- Plain HTML, CSS and JavaScript. No build step, no framework, no package manager.
- Hosted on GitHub Pages from the `main` branch, repo root. Every push to `main` goes live within a minute or two.
- `CNAME` holds the custom domain (`eternalgrowth.org`). Don't delete or rename it.
- Domain registered at Squarespace; DNS points to GitHub Pages. Email runs on Google Workspace, so never touch MX, SPF, DKIM or the googlehosted records.

## Files
- `index.html`, `subjects.html`, `about.html`, `team.html` — the four pages. Each links `style.css` and `script.js` and loads the Erode typeface from Fontshare. The header and footer are the same on every page; change them in all four.
- `style.css` — all styles. Design tokens are on `:root`: colours (`--paper`, `--ink`, `--forest`, `--mint`, `--sprout` for buttons, `--night` for the footer), five type steps (`--step-small` … `--step-display`), margins and motion easings.
- `script.js` — mobile menu, reveal-on-scroll, header colour by chapter, the hero field rising on scroll, and the request form (sends to Formspree in the background and shows which tutors teach the chosen subject).
- `images/` — team bio photos, max 600px. Keep new photos at that size.
- `assets/` — archive pictures and the seedling clip, with their credits in the footer of every page. Keep the credits if you keep the pictures.
- Contact form posts to Formspree (`https://formspree.io/f/xqagapza`); no backend. Field names (`parentName`, `studentName`, `email`, `subject`, `grade`, `message`) are what Formspree receives; don't rename them.

## How the design works
- Each section is a "chapter" with one flat background: `chapter--paper`, `--mint`, `--forest` or `--night`. Give each a `data-ink` and `data-ground` (its text and background colours) so the fixed header can match it.
- Hero: two stacked copies of the name, one on the paper layer and one on the green field layer. The field's top edge is `--seam` (animated on load) minus `--lift` (set by `script.js` on scroll).
- Motion: add `data-reveal` to anything that should rise in when scrolled into view, and `data-open` to a `figure` whose picture should open from a mask. Use `style="--i:1"` etc. to stagger. Everything stays visible without JavaScript and with reduced motion.
- No emoji, gradients, drop shadows, or icon cards; separate surfaces with a flat colour step instead.

## Updating content
- Tutors per subject live in three places: the home page subjects table, `subjects.html`, and the `BY_SUBJECT` map in `script.js`. Keep them in step.
- Team bios are in `team.html` (`#officers` and `#founders`). Robert Liu Meng has no photo yet; his card shows initials until one is added to `images/`.

## Conventions
- Breakpoint for phones is `max-width: 768px`.
- Test changes locally with `python -m http.server` and check desktop and ~390px phone width before pushing.
