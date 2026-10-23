# Rebella rhythm (preview at `/rhythm/`)

This is a single-page Rebella in which navigation happens through drifting shortcuts instead of a menu, and a small physics model, tied to Edger's stratified sphere, runs the whole page. It uses no frameworks, no GIFs and no randomness. Spec: [`SPEC_LOCKED.md`](SPEC_LOCKED.md). Live: https://edgerequals.github.io/rebella/rhythm/

To run it locally, start `python3 -m http.server` in the repo root and open `/rhythm/`. Links point to the real Rebella pages with `../`.

## What it learned from
- **Harvey "Gizmo" Rosenberg's meta-gizmo.org** (live pages read 23 Oct 2026; the Wayback Machine timed out, and its `metagizmo.com` captures from 2006 onwards are tiny redirects). The pages are black or textured backgrounds scattered with lots of tiny animated GIFs: 14×14 px `multi.gif` bullets (6 frames at 170 ms), `lady_1.gif` (25 frames at 200 ms), `HD.gif` (3 frames at 750 ms). A `setTimeout` loop scrolls a manifesto through the status bar, and a sound plays on load. What carried over is the feel: many small things, each moving on its own clock, with motion that comes and goes rather than looping in sync. GIFs were skipped (spec item 7). Every mover here is a few hundred bytes of inline SVG moved with transform/opacity. Sound is never automatic.
- **Simmie's lightweight polyrhythm work** (`/workspace/simmie-av/edit5.py`, `edit7.py`, and Simmie's conversation). Animal and space "turns" each ran on their own clock in a 3-against-4 rhythm (9 s against 12 s, realigning every 36 s), and weather faces ran on a 3 s / 4 s / 5 s polyrhythm (realigning every 60 s). When two turns coincided they went into different bands. It used transform-only `will-change` sprites, one shared loop that skips work when `document.hidden`, `body.paused` → `animation-play-state:paused`, and `prefers-reduced-motion` removes the lanes. The same technique is used here, with the clocks replaced (spec 10) by **exact** T0·φⁿ periods. Because φ is irrational, no two of these clocks ever realign, which is the furthest reach of a polyrhythm with no integer ratios.

## Load tiers (cascade, spec 8 / 11 / 22). Sizes measured 23 Oct 2026 (AWST)
| Layer | Trigger (φ-derived) | Files | Elements: entity (E) / organism (O) | Raw | gzip |
|---|---|---|---|---|---|
| L0 page | load | index.html, site-consts.js, site-physics.js, field.js, tiers.js | the shader tunnel: nebula, up to 13 hard spots (E: cue 1), 8 soft drifters (O: cell, diatom, spore, jelly; cue φ⁻²…φ⁻⁴) | 41.1 KB | 16.7 KB |
| L1 genomes | first idle callback (fallback 1000/φ ms) | genomes.js | 8 drawn link genomes. E: keyhole, card, frame, doorway, clock. O: rabbit, figure, L-system tree | 12.0 KB | 4.4 KB |
| L2 lists | first scroll, tap, key, wheel or touch | (inline `<template>`) | article lists | 0 | 0 |
| L3 mind | engagement ≥ T0·φ² (12.6 s, never announced) | mind.js | 21 leaky integrate-and-fire neurons (O) | 2.2 KB | 1.2 KB |
| L4 sphere | the sphere comes within 1/φ (61.8 %) of a viewport, or a tap on it | sphere.js + data/sphere-subset.json (5.5 KB) | the stratified sphere (E), no controls | 15.1 KB | 6.7 KB |
| L5 imaginarium | windowing crosses a physics threshold (below) | imaginarium.js | 89 motes on a Fibonacci lattice (O) | 3.0 KB | 1.6 KB |
| L6 3D entities | depth D > φ⁻¹, or round(φ⁵) = 11 taps | entities3d.js | waving rabbit (O), door (E), procedural meshes reusing three.js | 2.6 KB | 1.2 KB |
| A audio | the footer "Sound" button only (off by default) | audio.js | sphere shell modes ÷ φ¹⁸ | 1.9 KB | 1.0 KB |

- **Initial page:** L0 plus L1 = 53.1 KB raw of our own files, plus a 9.6 KB Gochi Hand subset font, which comes to about 63 KB. That is under the ~78 KB target.
- **All our own files:** 78.0 KB raw (32.8 KB gzip).
- **Lazy layers:** every lazy layer is under 15 KB.
  - The one exception is L4, at 15.1 KB raw with the sphere data included, or 6.7 KB gzip. The sphere.js file alone is 9.6 KB.
  - three.js r160 comes from jsDelivr (670 KB raw / 168 KB gzip). It is loaded only at L4 and is shared by L5 and L6. It is not counted in the budget, as before.
- **Shader:** 2586 bytes (1250 gzip), well under the 6 KB limit.
- **Images:** there are no image assets anywhere. Everything is drawn: inline SVG, SDF in the shader, and procedural three.js meshes.

## The one ratio (spec 10)
- **The one ratio is φ.** CSS has a single `--phi: 1.6180339887`. Every spacing, type step, layout split and band duration is a `calc()` chain or a `pow()` of that variable. In JS, `RB.PHI` comes from `site-consts.js`, which is generated from that same constant.
- **The one time base:** T0 = 1/f0 = **4.817 s**, where f0 = 1.011 MHz ÷ φ³² = 0.2076 Hz.
  - The 1.011 MHz is the sphere model's lowest l=0 shell mode (base5).
  - At runtime the JS writes the exact value into CSS `--T0`.
- **The one device constant:** F = 1/60 s, the display frame. It is hardware, not a design ratio.
- **Every loop, delay, cap and threshold** is T0·φⁿ, F·φⁿ, φⁿ, or a Fibonacci number computed by Binet's formula, round(φⁿ/√5). The audit below lists each one.

## Motion (spec 12): no linear motion
- **Genomes (the only navigation):** each genome orbits its own pivot, which sits off-screen.
  - The pivot distance is diag·φ^(1−1/φ)·φ^(−D/φ) from the screen centre, always beyond the viewport.
  - Pivots are spread by the golden angle and drift with S.psi.
  - A genome is visible only while its arc sweeps through the view. Per turn, the radius and scale fall by φ (a golden spiral). It then re-enters off-screen, which makes a seamless infinite-zoom loop.
  - The transform is `translate(pivot) rotate(a) translate(R) rotate(−a+spin)`: a rotation about the pivot. There is no translate-only drift.
- **Shader tunnel:** it is drawn in log-polar coordinates around `RB.pivot()`, also off-screen. Zoom is a shift along log_φ r, so each loop scales by φ exactly and is seamless.
- **Shader bodies:** these are CPU vortex particles about the same pivot (ω ∝ 1/r², inflow on a golden spiral with b = 2 ln φ / π). They re-enter beyond the far edge.
- **3D entities:** they orbit a pivot at (φ², 0, −φ), outside the frustum.
- **Imaginarium motes:** they move radially in and out of a spherical vortex.
- **Audit:** `grep -n "translate" rhythm/js/*.js` shows translate only as the radius term inside the rotate composition, plus the label-centring `translate(-50%,-50%)`. No old drift lanes remain: movers.js, nebula.js and morph.js are deleted.
- **Global drifting state:**
  - S.tau (site time) runs at φ^(−D)·φ^(−rung·imag): slower when deep, and slower again in the imaginarium.
  - S.psi (where the site sits in space) is integrated from swirl and jumps by one golden angle on every navigation (hashchange).
  - Neither is ever reset, so the state is never fixed.

## Progressive revelation (spec 13): "you are inside Edger's mind"
- **Nothing is announced.** The hero hint line has been removed.
- **Stages:** stage = clamp(floor(log_φ(eng/T0)) − 1, 0, 5), where eng = dwell + interactions. Stage k arrives at eng = T0·φ^(k+1): 12.6, 20.4, 33, 53 and 86 s.
  - Stage 1: 21 neuron sites (phyllotaxis) glow faintly in the nebula.
  - Stage 2: they fire.
  - Stage 3: they answer where you look.
  - Stage 4: spikes travel to parastichy neighbours (i ± 5, i ± 8) with a conduction delay.
  - Stage 5: the tunnel walls fold into cortex-like ridges.
- **Neuron timing:** neurons are leaky integrate-and-fire with τm = φ³ s and a refractory period of φ⁻² s, so at most 2.6 flashes/s (under 3/s, spec 18).

## The imaginarium (spec 17)
- **How it is reached:** windowing (spec 16: dwell, scroll or pinch toward the sphere) pushes the camera inside the quartz radius, or the cut depth below the core radius. Both radii come from the sphere model. It exits with hysteresis, once the camera and the cut are beyond radius·φ. There is no UI.
- **What it does:** it lazy-loads `imaginarium.js` and adds a layer on top of the sphere (additive).
- **Down-shift:**
  - Periods lengthen by φ per rung, through S.tau.
  - Audio pitch drops by φ per rung.
  - Colours walk the downshift ladder 486 → 550 → 650 → 800 → 1060 → 1500 → 2050 → 2800 nm, with the wall at 3500 nm. Infrared is shown in false colour, darkening toward deep red with no hue cycling.
- **Motion:** the motes scatter outward under constant radial acceleration a = 2/(T0·φ)². They hit the boundary with restitution 1/φ (damped reflection). When the rebound speed falls below the threshold they re-concentrate and up-shift. The cycle repeats.
- **Ladder provenance:** the ladder values were read from `sphere-holster/Downshift_Phosphor_Ladder_2026-10-19.png`, because the sourced markdown table is not in the repo. They are ±10 nm readings. *Estimated.*

## Not psychedelic (spec 18), Carroll (spec 19)
- **Palette:** fixed brand colours (cream, plum, rose, slate) plus physical Balmer-line colours. There is no hue rotation, no neon gradient and no mirroring.
- **Flashes:** at most 2.6 per second. Animation runs at a 60/φ fps cap.
- **Carroll rules (internal logic, never explained):**
  - In the imaginarium, receding things grow.
  - Below the Gd-Dy knee (260 K) the clock runs backwards.
  - The faster you move, the smaller the door gets.
  - The rabbit hurries more the longer you stay.
  - Curious thresholds (Curie, knee, α–β) pull specific genomes in.

## Cue (spec 20)
- **Values step on φ:** hard spots and doorway/frame/keyhole have cue 1; card/clock φ⁻¹; organisms φ⁻² to φ⁻⁴.
- **Shader edge:** softness w = φ^(−2−4·cue).
- **Collisions:**
  - Restitution = cue (rejected).
  - 1 − cue is absorbed into the interior: the pattern phase and mutation in the shader, a re-draw for the genomes.
  - Visitor bumps and looks inject energy into the bands (RB.kick).

## Fractal resolution and the governor (spec 22)
- **Per-region LOD:** a noise field sets each region's octave count (up to 5 + gov) and a pixel-snap step of φᵏ. *Caveat:* this snap reproduces the LOD look per region, but the GPU cost saving comes only from the global render scale.
- **Governor:**
  - The EMA weight is φ⁻⁵.
  - It steps down when the frame-time EMA exceeds F·φ² (43.6 ms, about 23 fps) and steps back up after T0 under F·φ.
  - Render scale is φ^(−1+gov): 0.618 at the top (≈0.5× from spec 20, made exact).
  - Octaves are 5 + gov, and the counts are fib(7 − round(3D) + gov) hard spots and fib(5 − round(2D) + gov) genomes.
- **Concurrency:**
  - At the top: 13 hard spots + 8 soft, 5 genomes, 0–1 3D.
  - Deep: 3–5 hard spots, 1–2 genomes, up to 2 3D.
- **Hidden tab:** everything pauses (rAF stops, audio suspends).
- **Measured:** under software rendering (SwiftShader, headless test) the governor fell to gov −3 on desktop (scale 0.146), as designed.

## Numeric audit (every timing / ratio and its φ derivation)
| Value | Where | Derivation |
|---|---|---|
| T0 = 4.817 s | all clocks | 1 / (1.011 MHz · φ⁻³²) |
| band periods 4.82, 2.98, 1.84, 1.14, 0.70 s | site-physics, CSS --b0..b4 | T0·φ⁻ⁿ |
| genome orbits 7.8 … 226 s | genomes | T0·φⁿ, n = 1..8 |
| first entries | genomes | T0·φ^(n−3) after load; phase 0.5 − φ⁻⁴ − φ⁻³ |
| 3D orbits | entities3d | T0·φ^(n+2) |
| physics step 37 Hz | site-physics | F·φ |
| render cap 37 fps | field | 60/φ (spec 20's "~30 fps" made φ-exact) |
| governor down / up | site-physics | EMA > F·φ² / below F·φ for T0; EMA weight φ⁻⁵ |
| render scale 0.618, 0.382, … | field | φ^(−1+gov) |
| octaves | shader | 5 + gov, lacunarity φ, gain 1/φ |
| caps 13/8/5/3/2/1 | field, genomes | Fibonacci via Binet (φⁿ/√5) |
| coupling κ, Duffing β, saturation | site-physics | φ⁻², φ⁻¹, φ⁻¹ |
| wake / sleep | site-physics | φ⁻² / φ⁻³ (Schmitt) |
| band Q | site-physics | log_φ(Q of the real layer) |
| depth oscillator | site-physics | Q = φ² |
| thermal relaxation | site-physics | T0·φ² |
| stillness time constant | site-physics | T0·φ³ |
| heat gain, hysteresis | site-physics | (393 − 293 K)·φ² and ·φ⁻³ |
| touch/pointer live window | genomes, field | F·φ⁴ = 115 ms |
| mind stages | mind | T0·φ^(k+1), k = 1..5 |
| neuron τm / refractory | mind | φ³ s / φ⁻² s |
| L3 trigger | tiers | eng ≥ T0·φ² |
| L4 rootMargin | tiers | 100/φ % |
| L6 trigger | sphere | D > φ⁻¹ or round(φ⁵) = 11 interactions (was "8") |
| idle fallback | tiers | 1000/φ ms |
| imaginarium enter / exit | sphere | radius b / b·φ; ease over T0 |
| imaginarium accel / restitution | imaginarium | 2/(T0φ)² / 1/φ; 89 motes = F(11) |
| audio | audio | ÷φ¹⁸ partials, master φ⁻⁸, time constants φ⁻¹, φ⁻² |
| tessellation 34×21, FOV, camera | sphere | Fibonacci; 100°·φ⁻²; lerp(φ³, lerp(φ, φ⁻³, D)) |
| CSS spacing / type | index.html | 1rem·φⁿ / 1rem·φ^(n/2) |
| CSS layout | index.html | grid (W−gap)/φ : rest; frame 100rem/φ; hero height = frame/φ; sphere aspect φ:1 |
| CSS keyframes | index.html | 38.2 % = 100·φ⁻², breath scale 1 + φ⁻⁸, rotate 1°/φ³, flap −1 turn/φ⁴ |
| alphas | CSS, shader | .944 = 1 − φ⁻⁶, .854 = 1 − φ⁻⁴, .382, .146, .09 = φ⁻⁵ |
| noise tile | field fallback | 55 = F(10) px |

**Not design ratios (justified):**
- Brand hex colours and their 255 byte encodings.
- The CIE / Bruton wavelength-to-RGB fit breakpoints (440 / 490 / 510 / 580 / 645 nm). These are measured data.
- The physical constants from the sphere model: 293, 260, 393 and 846 K, and the radii.
- The smoothstep polynomial 3 − 2f (Hermite) and integer loop counts in GLSL.
- The 5 bands (F(5)).
- 90° in the tilt reading (a unit conversion).
- 2π.
- The "Get me out" button size: 188 × 64 px, the Rebella safety standard shared with every page.
- The 47rem mobile breakpoint, which is φ⁸ rounded because CSS media queries cannot use variables.
- The 100° FOV reference.

## Accessibility
- **Focus:** there is a skip link and a visible focus ring. All 8 genomes are real links. Tabbing to one parks it at the top left, holds it still and shows its label.
- **Reduced motion:** `prefers-reduced-motion` gives a still version. The shader draws one frame, and the genomes become a static row of labelled links. This row is an accessibility exception to "no menu" and appears only when motion is off or JavaScript is missing.
- **Sound:** off by default, behind a discreet footer text button.
- **Get me out:** kept.
- **Sphere:** has `role="img"`, with no controls (spec 16). Its windowing is pointer, touch and scroll driven, and it has no keyboard equivalent.
