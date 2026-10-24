# Design

The site is one living tree at night: a night-forest ground, a single bioluminescent green, and liquid glass floating over it. Everything below is the built system in `style.css` and `script.js`.

## Colour
| Token | Value | Job |
|---|---|---|
| `--ground` | #050a07 | Page ground everywhere |
| `--canopy`, `--canopy-2` | #0b1a12, #10251a | Placeholder fills (initials tiles, image backs) |
| `--sap` | #8dffb0 | The one light: trunk line, icons, roles, text links, focus ring |
| `--lichen` | #c9f26b | Primary actions only, and the lit growth rings |
| `--text`, `--text-2`, `--text-3` | #eef6ef, #a8bcae, #869c90 | Headlines and body, secondary copy, small captions |

Dark is chosen from the scene: a parent reading on a phone in the evening, and a "night forest" world where green light is the material.

## Type
Geist (Google Fonts, weights 300–700), one family. Five steps: small 14px, body 17–19px, lead 20–26px, head 36–68px, display 52–96px. Display tracking −0.04em, headings −0.035em, line height ~1. Headings end with a full stop, Apple style.

## Liquid glass
`.glass`: translucent white fill from 11% to 3.5%, `backdrop-filter: blur(28px) saturate(170%)`, a 1px rim at 13% white, an inset top highlight, and a soft drop shadow. A radial sheen follows the pointer (`--mx`, `--my` set by `script.js`). Used for the nav bar, the hero finder, panels, the form and person cards. Radius 28px on panels, full pill on bars and buttons.

## Components
- **Buttons:** pill, lichen fill with dark text, neutral shadow; `.btn--ghost` is glass; `.btn--small` in the nav.
- **Nav:** one floating glass pill; hides on scroll down, returns on scroll up; collapses to a menu button under 760px.
- **Photos:** portraits always fade into the ground through a vertical mask (top and bottom on the home page row, bottom on cards). Cropped copies exist for Gary, Austin and Eliot (`images/*_portrait.jpg`).
- **Icons:** authored inline SVG, 1.5 stroke, round caps.

## Motion (GSAP 3.12 + ScrollTrigger)
- **Signature:** the trunk, an SVG line in the left gutter that draws as you scroll, with branches reaching to each `[data-knot]` heading.
- **Page transitions:** growth rings spread from the click point while a dark circle covers the page; the next page opens from the centre. Driven by `sessionStorage` (`eg-arrive`) and the `.rings` overlay.
- **Reveals:** `[data-rise]` elements rise 28px, unblur and fade in, batched with a stagger.
- **Live pieces:** the tutors row drifts sideways (pauses on hover or focus); the growth-ring cross-section draws in and lights one ring per step as you read.
- Everything respects `prefers-reduced-motion` and stays visible without JavaScript.

## Backgrounds (Vanta 0.5.24, in `vendor/`)
- Home hero: `VANTA.TRUNK` (p5) in sap green. It is forced to draw at 1× pixel density, because at higher densities it fills three quarters of the canvas solid.
- Other page heroes: `VANTA.FOG` (three.js r134) in deep greens.
- One effect per page, destroyed on `pagehide`.
