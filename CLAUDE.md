# Eternal Growth website

Static site for Eternal Growth, a Long Island nonprofit tutoring organization run by high school students. Light, minimal design: compact Archivo type in black on off-white, with a slow grey fog and GSAP 3.13 motion throughout. Live at https://eternalgrowth.org.

## Stack and hosting
- Plain HTML, CSS and JavaScript. No build step, no framework, no package manager.
- Hosted on GitHub Pages from the `main` branch, repo root. Every push to `main` goes live within a minute or two.
- `CNAME` holds the custom domain (`eternalgrowth.org`). Don't delete or rename it.
- Domain registered at Squarespace; DNS points to GitHub Pages. Email runs on Google Workspace, so never touch MX, SPF, DKIM or the googlehosted records.

## Files
- `index.html`, `subjects.html`, `impact.html`, `about.html`, `team.html` — the five pages. The header (nav, shutter overlay, cursor, fog layer) and footer are identical on every page; change them in all five. Page content sits inside `#smooth-wrapper > #smooth-content` for ScrollSmoother; fixed elements stay outside it.
- `style.css` — all styles. Tokens on `:root` (colours `--ground`, `--ink`, greys, `--line`, type steps). See `DESIGN.md` for the system.
- `script.js` — ScrollSmoother, SplitText and ScrambleText text effects, MorphSVG marks, DrawSVG line art, the MotionPath process dot, the pinned subject slider, shutter page transitions, cursor, nav, plate tilt, footer clock, FAQ, the Vanta fog, the hero finder and the request form (Formspree, sent in the background, shows matching tutors).
- `vendor/` — Vanta 0.5.24 (`vanta.fog`) and three.js r134, served locally. GSAP 3.13.0 and its plugins (ScrollTrigger, ScrollSmoother, SplitText, DrawSVG, MorphSVG, MotionPath, ScrambleText) load from jsDelivr.
- `images/` — headshots named `<id>_bio.<ext>` (max 600px, ids from `PEOPLE` in `content.py`). `build.py` picks them up automatically and shows each as a round portrait on the person's card; people without a photo keep a monogram. To add one, drop `images/<id>_bio.jpg` in and rebuild.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/` — product facts, the design system, and the design brief.
- `.build/` — not published (GitHub Pages skips dot-folders). `content.py` holds people, roles, bios and subjects; `python .build/build.py` regenerates all five HTML pages from it. `test.mjs`, `transition.mjs`, `sections.mjs` and `shots.mjs` are headless-Chrome checks against `python .build/serve.py` (port 5500). Edit `content.py` and rebuild rather than hand-editing the HTML.
- `404.html`, `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest` — written by `build.py`.
- Icons and share image: `favicon.svg` is the brand mark (black disc, ring, dot). `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and `og-image.png` (1200×630) are rendered from it by `node .build/icons.mjs` (sources in `.build/brand/`). Re-run it if the mark or the share card changes. Each page's title, meta description, canonical URL, Open Graph/Twitter tags and JSON-LD (organization on home, FAQPage on About, breadcrumbs elsewhere) are set in the `head(...)` calls in `build.py`.
- Contact form posts to Formspree (`https://formspree.io/f/xqagapza`). Field names (`parentName`, `studentName`, `email`, `subject`, `grade`, `message`) are what Formspree receives; don't rename them.

## Updating content
- Impact figures (more than $35,000 raised, more than $3,500 to Swim Across America, subsidized tutoring, and the $10,000 three-month Swim Across America drive led by Victor Pan) appear on the home page band, `impact.html` (including the Projects section) and the FAQ answer about money. Update them together.
- People: `OFFICERS`, `FOUNDERS` and `ALUMNI` in `content.py`. The Team page gives each its own section: Officers (co-presidents as layered spotlight cards, then the rest), Founders (dark band with parallax numbers) and Alumni (two drifting rows, `[data-marquee]`). `EXTRA_ROLES` adds a second role (Victor Pan is also Webmaster); it shows on cards and switches in the spotlight (`[data-roles]`). Officer and alumni counts in the copy are computed from these lists.
- Voice: present Eternal Growth as an organization that started on Long Island and is growing, not as a small club.
- Tutors per subject live in three places: the home page slider, `subjects.html`, and `BY_SUBJECT` in `script.js`. Keep them in step.
- Animations are set in the markup:
  - `data-anim="chars|lines|blur|flip|fill|scramble"` for text;
  - `data-draw` for SVG line art;
  - `data-rise` for blocks;
  - `data-speed` for parallax;
  - `data-cursor="Label"` for a cursor label.

## Conventions
- Breakpoint: `max-width: 860px` for phones and tablets (menu overlay, stacked columns, swipeable slider).
- URLs are clean: links point to `about`, `subjects`, `impact`, `team` and `./` (home), never `*.html`. GitHub Pages serves `about.html` at `/about`; the `.html` addresses still work. Canonicals and the sitemap use the clean form.
- Test changes locally with `python .build/serve.py` (serves `/about` like GitHub Pages; plain `python -m http.server` can't) and check desktop and ~390px phone width before pushing.
