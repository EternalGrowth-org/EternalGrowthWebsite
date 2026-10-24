# Design

A silversmith's catalogue for a student tutoring club: every section is a framed plate in a black vitrine, engraved, hairline-bordered and lit like jewellery. Growth is drawn as geometry, a tree made of straight lines. Everything below is the built system in `style.css` and `script.js`.

## Colour
| Token | Value | Job |
|---|---|---|
| `--black` | #070707 | Page ground |
| `--black-2`, `--panel` | #0d0d0c, #111110 | Plates, slides, the form, menus |
| `--bone` | #eeece6 | Type, primary buttons, corner ticks |
| `--silver`, `--steel` | #a9a8a3, #85847d | Secondary copy, small notes |
| `--line`, `--line-2` | bone at 16% and 32% | Hairlines, borders, dividers |
| `--sap` | #a7dcb8 | Live states only (success, hovered contact links) |

## Type
- Cinzel 400–600 (Google Fonts) for display and headings: engraved capitals, letter-spacing 0.01–0.04em.
- Geist 300–600 for reading and controls.
- Micro labels: 12px uppercase, 0.2em tracking, used for navigation, roles and meta, never as eyebrows above headings.
- Steps: micro 12px, small 14px, body 16–18px, lead 19–26px, head 34–72px, display 46–132px.

## Frames and lines
- `.frame` adds a 1px hairline border with bone corner ticks (top-left, bottom-right). No rounded corners anywhere.
- Plates (`.plate__face`) are monogram placeholders for people: concentric rings and a crosshair behind engraved initials, an inner inset border, and a light sheen that follows the cursor.
- Subject drawings sit on a 40–48px drafting grid that fades to the edges.

## Buttons
Bone fill with black text; on hover a black panel rises from the bottom and the text turns bone. `.btn--line` is the inverse. `.link-line` is a micro-label link with an underline that extends on hover.

## Motion (GSAP 3.12 + ScrollTrigger)
- **Page transitions:** five vertical shutters close from the bottom around the emblem, then open from the top on the next page (`sessionStorage` key `eg-arrive`).
- **Hero:** the inset frame draws itself line by line, corner ticks appear, the title rises letter by letter, and the straight-line tree draws trunk-first. Layers marked `data-depth` follow the cursor; the title, ghost word and tree separate on scroll.
- **Words:** `[data-words]` lights word by word with scroll (the manifesto); `[data-split]` headings rise letter by letter; marquees speed up and reverse with scroll velocity.
- **Slider:** on desktop the subject section pins and the track moves sideways with scroll, with a progress hairline and counter; on phones it is a native snap carousel. Arrow buttons and arrow keys step one slide.
- **Lines:** `[data-strokes]` line art draws itself in; the process line fills as you scroll and each diamond node lights.
- **Cursor:** a ring and dot with `mix-blend-mode: difference`, growing over interactive elements; plates tilt toward it.
- **Footer:** the emblem ring rotates with scroll, the wordmark rises letter by letter, and a live Long Island clock ticks.
- Everything respects `prefers-reduced-motion` and stays visible without JavaScript.

## Background
Vanta NET 0.5.24 (three.js r134, in `vendor/`): silver lines between drifting points on black, at 32% opacity behind a dark veil. One per page, destroyed on `pagehide`.
