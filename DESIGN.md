# Design

A gallery in daylight: off-white walls and one slow grey fog behind compact black type. Nothing floats for its own sake; every move is tied to the scroll or to a click. Everything below is the built system in `style.css` and `script.js`.

## Colour
| Token | Value | Job |
|---|---|---|
| `--ground` | #f2f2ef | Page ground (painted by the fixed `.atmos` layer; `body` is transparent so the haze shows) |
| `--white`, `--panel` | #ffffff, white at 72% | The form, slides, plates, principle and way panels |
| `--ink` | #0b0b0b | Type, buttons, the morphing mark, the process dot |
| `--gray-1`, `--gray-2`, `--gray-3` | #4c4c48, #6b6b66, #b4b4ae | Body copy, labels, the unread state of the manifesto |
| `--line`, `--line-2` | ink at 10% and 20% | Dividers and panel rims |

## Type
Archivo (Google Fonts, width 62–125, weight 400–800), one family. Headings at 600 weight and 88% width; SplitText masks carry extra padding so nothing clips.
- Display 46–122px at weight 600, 88% width, tracking −0.035em, line height 1.02.
- Headings 32–64px at weight 600, 88% width, tracking −0.03em.
- Lead 18–22px, body 16–18px, micro labels 12px uppercase at 0.12em tracking.

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
- **Page transitions:** four black shutters close from the edges, then open from the centre on arrival. No text shows during the transition.
- **Cursor:** an ink dot that grows over controls and shows a label over `data-cursor` elements. The grey haze leans toward the pointer.
- Everything respects `prefers-reduced-motion` (no smoothing, no animation, everything visible) and works without JavaScript.

## Background
Vanta FOG 0.5.24 (three.js r134, in `vendor/`) in greys on the fixed `.atmos` layer, with three blurred grey orbs and a faint noise texture as the fallback.

## Motion added in the restraint pass
- **Hero:** one entrance (fog fades up, letters rise through masks, the finder and chips follow), then the hero recedes on scroll, scaling to 90% and blurring away.
- **Stacked impact cards (desktop):** the band runs edge to edge, pins and each figure slides up over the last, which shrinks, dims and softens.
- **Lean:** section headings, the subject track, card rows and plates skew up to 3° with scroll speed and settle when scrolling stops.
- **Mask reveals:** subject drawings, slide art and the giving ring open from an inset rounded clip.
- **Footer:** rises and squares off its corners as it comes into view.
- **Liquid-glass nav:** blur plus SVG displacement (`#liquid`), with a pointer-following highlight. Buttons are magnetic; cards have a cursor spotlight.
- **Kept:** pinned shape-to-word chapters (MorphSVG and ScrambleText), the giving ring (DrawSVG), counters, the pinned subject slider, SplitText headings and the shutter page transitions.
- **Removed:** rain, grain, the thorn ring, orbiting icons, drifting orbs and the floating morph marks in the hero and footer.
