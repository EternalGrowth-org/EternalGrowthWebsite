# Design

A gallery in daylight: white walls, soft grey haze drifting behind black type, and words that move like a curated exhibition. Everything below is the built system in `style.css` and `script.js`.

## Colour
| Token | Value | Job |
|---|---|---|
| `--ground` | #f4f4f2 | Page ground (painted by the fixed `.atmos` layer; `body` is transparent so the haze shows) |
| `--white`, `--panel` | #ffffff, white at 72% | The form, slides, plates, principle and way panels |
| `--ink` | #0b0b0b | Type, buttons, the morphing mark, the process dot |
| `--gray-1`, `--gray-2`, `--gray-3` | #4f4f4b, #6f6f6a, #b9b9b4 | Body copy, labels, the unread state of the manifesto |
| `--line`, `--line-2` | ink at 10% and 20% | Dividers and panel rims |

## Type
Host Grotesk (Google Fonts, 200–700), one family.
- Display 54–176px at weight 300, tracking −0.055em, line height 0.94.
- Headings 37–84px at weight 300, tracking −0.045em.
- Lead 19–26px, body 16–18px, micro labels 12px uppercase at 0.14em tracking.

## Surfaces and controls
- Panels: white at 72% with a blur, a 1px rim at 10% ink, 20px radius. They lift 6px on hover.
- Buttons: black pills; the label rolls up to a copy of itself on hover and the arrow turns 45°. `.btn--ghost` is the white version.
- People are monogram plates: a soft white-to-grey radial tile with a blurred grey shadow and light initials. They tilt toward the cursor, and their names scramble on hover.
- Line art: 1.4px round-cap strokes in ink, drawn in with DrawSVG.

## Motion (GSAP 3.13, all plugins from jsDelivr)
- **ScrollSmoother** smooths the whole page (`#smooth-wrapper` / `#smooth-content`; fixed elements sit outside). `data-speed` gives parallax.
- **SplitText** effects, set with `data-anim`:
  - `chars`: letters rise through a mask.
  - `lines`: lines slide up through a mask.
  - `blur`: words unblur and rise.
  - `flip`: words flip up in 3D.
  - `fill`: words turn from grey to ink as you scroll.
  - `scramble`: labels decode, via **ScrambleText**.
- **MorphSVG**: the hero mark and the footer mark morph through seven subject shapes; the hero caption scrambles to each subject's name.
- **DrawSVG**: every `data-draw` drawing draws from its middle outward on entry; the process route draws as you scroll.
- **MotionPath**: a dot travels the process route, which winds down the open middle between the steps.
- **ScrollTrigger**:
  - The subject slider pins and moves sideways, each card leaning in 3D as it passes.
  - The kinetic lines slide sideways with scroll.
  - `data-rise` blocks rise in batches.
- **Page transitions:** four black shutters close from the edges while the next page's name scrambles in, then open from the centre on arrival.
- **Cursor:** an ink dot that grows over controls and shows a label over `data-cursor` elements. The grey haze leans toward the pointer.
- Everything respects `prefers-reduced-motion` (no smoothing, no animation, everything visible) and works without JavaScript.

## Background
Vanta FOG 0.5.24 (three.js r134, in `vendor/`) in greys on the fixed `.atmos` layer, with three blurred grey orbs and a faint noise texture as the fallback.
