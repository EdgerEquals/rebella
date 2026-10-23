# Rebella rhythm (preview at `/rhythm/`)

This is a single-page Rebella in which navigation happens through drifting shortcuts instead of a menu, and a small physics model, tied to Edger's stratified sphere, runs the whole page. It uses no frameworks, no GIFs and no randomness. Spec: [`SPEC_LOCKED.md`](SPEC_LOCKED.md). Live: https://edgerequals.github.io/rebella/rhythm/

To run it locally, start `python3 -m http.server` in the repo root and open `/rhythm/`. Links point to the real Rebella pages with `../`.

## What it learned from
- **Harvey "Gizmo" Rosenberg's meta-gizmo.org** (live pages read 23 Oct 2026; the Wayback Machine timed out, and its `metagizmo.com` captures from 2006 onwards are tiny redirects). The pages are black or textured backgrounds scattered with lots of tiny animated GIFs: 14×14 px `multi.gif` bullets (6 frames at 170 ms), `lady_1.gif` (25 frames at 200 ms), `HD.gif` (3 frames at 750 ms). A `setTimeout` loop scrolls a manifesto through the status bar, and a sound plays on load. What carried over is the feel: many small things, each moving on its own clock, with motion that comes and goes rather than looping in sync. GIFs were skipped (spec item 7). Every mover here is a few hundred bytes of inline SVG moved with transform/opacity. Sound is never automatic.
- **Simmie's lightweight polyrhythm work** (`/workspace/simmie-av/edit5.py`, `edit7.py`, and Simmie's conversation). Animal and space "turns" each ran on their own clock in a 3-against-4 rhythm (9 s against 12 s, realigning every 36 s), and weather faces ran on a 3 s / 4 s / 5 s polyrhythm (realigning every 60 s). When two turns coincided they went into different bands. It used transform-only `will-change` sprites, one shared loop that skips work when `document.hidden`, `body.paused` → `animation-play-state:paused`, and `prefers-reduced-motion` removes the lanes. The same technique is used here, but the clocks are consecutive **Fibonacci** seconds (5, 8, 13, 21, 34, 55). They are coprime, which gives a polyrhythm that rarely realigns, and their ratios converge on φ, which keeps φ as the only ratio.

## Load tiers (progressive, strategic)
| Tier | Trigger | Loads | Elements (entity / organism) | Weight (raw / gzip) |
|---|---|---|---|---|
| T0 | page load | `index.html` (critical CSS inline, symbol sprite, all text content), `site-consts.js`, `site-physics.js`, `movers.js`, `tiers.js`, a subset of the Gochi Hand font (`&text=` subset) | 12 pooled genomes. **Entities:** keyhole, clock, hard spot, card, frame, doorway. **Organisms:** spore/seed head, diatom, jellyfish, rabbit, figure, L-system tree. Low-cue lanes active: jellyfish 5 s, seed 8 s, diatom 13 s. Vortex rings, breathing panels | ≈ 50 KB + font 9.6 KB ≈ 60 KB / ≈ 28 KB |
| T1 | first scroll, tap, key, wheel or touch | `<template>` article lists injected, `nebula.js` (377 phyllotaxis motes) | Slow organism lanes switch on: rabbit 21 s, figure 34 s, tree 55 s. Nebula = ambient field (neither category) | 2.1 KB / 1.2 KB |
| T2 | sphere section within 61.8 % of a viewport (IntersectionObserver), or a tap on it | `sphere.js`, `data/sphere-subset.json`, three.js r160 from jsDelivr | Chrome-less sphere (a rigid geometric *entity* view of the model) | own 13.8 KB / 6.2 KB + three.js 670 KB / 168 KB (not counted in the budget) |
| T3 | 8 interactions (Fibonacci), or a Curie, Gd-Dy-knee or α–β threshold crossing | `mind.js` (21 LIF neurons), `morph.js` (procedural high-cue forms) | Mind overlay (*organism*: neural). Morphs: doorway/frame/keyhole/clock/card/spot = *entity*; rabbit/figure/tree/jelly/diatom/seed = *organism* | 8.9 KB / 3.5 KB |
| A | the visitor presses **Sound** in the footer (a user gesture) | `audio.js` | Sound bed and partials | 2 KB / 1 KB |

When idle, `tiers.js` adds `modulepreload` hints (requestIdleCallback) for T1/T2, so the next tier is warm but not run.

**Budget:** all own files (all tiers) are ≈ 76 KB raw, plus the 9.6 KB font, ≈ 86 KB, which is under 100 KB. three.js is excluded, like the lazy iframe in the original brief.

**Concurrency and governor:** at most Fib(depth) movers at once: 13 at the top of the vortex, then 8, 5, 3, down to 2 at the bottom. A frame-time governor (EMA over 13 frames) steps down one Fibonacci level when frames run slower than 30 fps, and steps back up after 5 s above 55 fps.

**Cues:** *low-cue* = organisms drifting in on their Fibonacci lanes. *High-cue* = threshold crossings in the physics. A band wake-up brings an entity. A Curie crossing (393 K) brings 3 entities and a tree. A Gd-Dy knee crossing (260 K) brings the doorway, rabbit and figure. An α–β crossing (846 K) brings every entity. **Contact:** entities *reject* (rigid elastic bounce, restitution 1/φ, plus spin from the off-centre impulse). Organisms *absorb* (inelastic: they take 1/φ² of the relative momentum and squash, recovering at band-4 rate). Both feed an impulse back into the physics: entities into band 4, organisms into band 0.

## Site physics (`js/site-physics.js`)
- **Bands:** 5 oscillators at f₀·φⁿ. f₀ = the sphere's lowest l=0 shell mode, **1.011 MHz** (base5 case), divided by φ³² = **0.2076 Hz** (≈ resting breathing, 12.5 per minute). Band 4 = 1.42 Hz (≈ resting heart rate, 85 bpm). Because φⁿ⁺¹ = φⁿ + φⁿ⁻¹, every neighbouring triple is exactly three-wave resonant. The cubic coupling U = κ Σ x₍ₙ₋₁₎xₙx₍ₙ₊₁₎ therefore moves energy between bands, which gives swells, dips and beats. Duffing hardening (β = 1/φ) saturates amplitudes. Coupling κ = 1/φ².
- **Damping:** Q of each band = log_φ(Q of a real layer). Quartz 2100 → 15.9, layer two 150 → 10.4, BTO 50 → 8.1, Gd-Dy 500 → 12.9, CALORIVAC 20 → 6.2. This compresses the real Q while keeping its order.
- **Visitor as the nonlinear element:** stillness (presence) pushes band 0. Scroll pushes bands 1–2. Pointer speed and device tilt push bands 3–4. Taps are broadband impulses. Pushes are phase-locked to each band's own velocity (positive feedback, like pumping a swing) and tanh-saturated.
- **Thresholds (from the sphere model):** band wake/sleep is a Schmitt trigger at amplitude² 1/φ² / 1/φ³. Site "temperature" T starts at **293 K** (model reference) and is heated by power dissipated in bands 1–4. Stillness cools it toward below the **Gd-Dy MCE knee, 260 K** (the model flags that its 293 K misses this knee; here stillness can reach it). Crossings are the **BTO Curie point, 393 K**, and **quartz α–β, 846.15 K**. Thermal hysteresis width = (393 − 293)/φ³.
- **Depth D** (the global state): an underdamped oscillator (Q = φ², ω = 2πf₀/φ²) chasing a target set by stillness, heat (which pushes it up) and band 0, so it overshoots and returns rather than moving one way. **Swirl:** Ω = L/r², with r = 1 − D/φ (angular momentum is conserved as you sink). **Light:** band energies weight the hydrogen Balmer lines the model uses (434 / 486.1 / 656.3 nm, weights 0.47 / 1 / 2.86) → sRGB. Brightness = 1 − e^(−E).
- **Loop:** one `requestAnimationFrame`, a fixed 30 Hz physics step, cancelled while the tab is hidden (CSS animations are paused too). DOM writes are transforms on a few elements, and the vignette CSS variables update only when depth changes by more than 0.01.

**Estimates:** the sphere model is a *v0 paper model, ESTIMATED PHYSICS, nothing measured* (its own status). BTO Curie ~393 K and its piezo/pyro switch-off are marked [est] in `solver_v0.py`. Gd-Dy ~260 K comes from the material name and flags. The model defines **no drive mechanism**: all of its fields are zero. Here the visitor is the drive. The time-scalings (φ⁻³² visual, φ⁻¹⁸ audio), heating gain and log_φ(Q) compression are mapping choices, not physics.

**Provenance:** `tools/build_physics_subset.py /workspace/ssm-fx2 base5` reads `model_data_v0.json` (1.3 MB, sha256 `9efcbc98…`, EdgerEquals/sphere-holster @ `8df3f2c`, the local working clone; origin/main is `7da53c1` and its model file differs by one line). It writes `data/sphere-subset.json` (5.2 KB, which records the commit, sha256 and model status) and `js/site-consts.js` (0.7 KB).

## The sphere (chrome-less, spec item 16)
It uses the same renderer approach as sphere-holster (three.js r160, a concentric shell per layer, five domains) but has no panels, labels, warning banner or hints. The 'estimated physics' disclosure lives here and in the credits link, not on the sphere. The visitor only changes how the model is **windowed**:
- **Bump:** pointer momentum at the contact point → torque (r × p) → spin, damped by τ = log_φ(Q_ferrite)/(πf₀) ≈ 20 s.
- **Look:** hover position aims a cross-section plane, and dwelling deepens the cut. Device tilt moves the camera.
- **Switch by contact:** a tap's latitude band selects the domain shown (optical, acoustic, thermal, electric, magnetic). Domains crossfade at τ = 1/φ s.
- **Centring and depth:** the more centred the sphere is in the viewport, the closer the camera, down to inside the quartz at depth. Depth also widens the **time window** (one transit per φ³ s, slower when deep).
- Domain content comes from the subset. *Optical:* a Balmer front travels out along the model's cumulative light-transit time and dims beyond the Gd-Dy film where it is absorbed. *Acoustic:* a front along the acoustic transit time, plus radial breathing = Σ (mode share per layer × band amplitude), limited to the model's acoustic extent (r ≤ 0.383 R). *Thermal:* glow inside the penetration radius from the model's thermal track at the band-weighted frequency, coloured by T (cold below 260 K, hot toward 393 K). *Electric:* piezo (d coefficients) × acoustic stress, plus pyro (p) × ΔT. *Magnetic:* B = 0 (radial fields have no curl and no drive is defined), so it stays almost dark, which is honest.

## Where φ is used
- **Layout:** the hero frame has aspect ratio φ:1 (`min-height = width/φ`). Column split `1.618fr 1fr` = 61.8/38.2. The frame is 61.8rem wide. The sphere stage is φ:1 (1:φ on phones).
- **Type and spacing:** the type scale is 0.786, 1, 1.272 (√φ), 1.618, 2.618, 4.236 rem. Spacing is 0.382, 0.618, 1, 1.618, 2.618, 4.236 and 6.854 rem. Line height is 1.618. Radii and shadows use the same steps.
- **Rhythm:** band periods are 4.817 / 2.977 / 1.840 / 1.137 / 0.703 s (f₀·φⁿ, used as CSS `--b0…--b4` for breathing, flapping, pulsing and cilia). Lanes run on Fibonacci seconds. Concurrency is Fibonacci. Depth is Q = φ². Fades run at a rate of φ per second. Keyframe stops sit at 23.6 / 38.2 / 61.8 %.
- **Geometry:** the golden angle 137.5° = 360°/φ² (phyllotaxis seed heads, nebula, neurons, spawn points). Golden-spiral inflow (growth b = 2 ln φ/π). The L-system branches at golden angle/φ³ with length ratio 1/φ. Ring radii are 100/φⁿ. The frame is drawn by golden-rectangle subdivision. Restitution is 1/φ.
- **Physics mapping:** time-scalings φ⁻³² (visual) and φ⁻¹⁸ (audio), Q compression log_φ, thresholds and hysteresis widths in φ powers.

## MOTION_BASIS
| Element | Category | Basis | Parameters / source |
|---|---|---|---|
| Vortex rings (ambient) | ambient | Rankine vortex: ω ∝ 1/r² outside the core (angular momentum), solid-body inside | Ω from physics; radii 100/φⁿ; core r = 38.2 |
| Ring zoom + vignette | ambient | Depth narrows the field of view (falling inward) | D from physics; zoom 1 + Dφ |
| Nebula motes | ambient | Phyllotaxis placement; differential rotation winds spiral arms; golden-spiral inflow; count conserved | 377 motes; golden angle; b = 2lnφ/π |
| Nebula colour and brightness | ambient | Balmer emission lines weighted by band energies; inverse-square falloff from the core glow | 434/486/656 nm and weights from solver_v0.py |
| Panel "breath" | ambient | Breathing envelope at band 0 (≈ resting respiration) | 4.817 s, scale 1.46 % |
| Keyhole | entity | Physical pendulum, damped, advected by the vortex | ω = band 1; Q = log_φ(150) |
| Clock face | entity | Kepler ellipse around the vortex centre (a = −GM r/r³); hands follow the vortex phase | period 13 s, v = v_circ/√φ; minute hand = φ⁵ × hour hand |
| Hard spot | entity | Rigid elastic billiard (e = 1) for 21 s, then it leaves | speed = min(W,H)/φ⁴ |
| Playing card | entity | Falling-plate flutter: angle oscillates, falls faster edge-on | ω = band 2; terminal fall = H/34 per second |
| Picture frame | entity | Rigid body carried by an irrotational flow keeps its orientation (rotates only inside the core) | Rankine flow |
| Doorway | entity | Falls down the vortex on a golden spiral with r²ω conserved; shrinks with distance | Ω, b, core radius = min/φ⁴ |
| Seed head (spore) | organism | Wind-borne pappus: drag-dominated, terminal velocity, pendulum sway; seeds in phyllotaxis | 34 seeds, golden angle; sway at band 1 |
| Diatom / ciliate | organism | Low-Reynolds-number swimming: velocity = propulsion + advection, helical heading; ciliary beat (dash travel) | band 2 heading oscillation; cilia at band 4 |
| Jellyfish | organism | Pulsed jet propulsion: thrust only during bell contraction, drag between | band 2; bell keyframes at 23.6/61.8 % |
| Rabbit | organism | Bounding gait: ballistic hops under gravity | hop = φ × band-4 period; height H/φ⁵ |
| Figure | organism | Floats with the flow, slight buoyancy; breathing envelope; arms swing at band 0 | band 0 |
| L-system tree | organism | Logistic growth, then senescence fade; rises in the flow | t½ = φ² s; fade after 21 s |
| Contact squash | organism | Soft-body inelastic absorption, recovering at band-4 rate | 1/φ² momentum share; squash 1/φ³ |
| Contact bounce | entity | Rigid elastic rejection, restitution 1/φ, spin from the off-centre impulse | |
| Mind overlay | organism | Leaky integrate-and-fire neurons, refractory period, finite conduction velocity along parastichy neighbours (±5, ±8) | τ_m = 1/φ s, τ_ref = τ_m/φ⁵ (biological ratio ~10); 21 neurons |
| High-cue morphs | both | Primitive counts and sizes follow band energies and depth (Fibonacci counts, 1/φ self-similarity) | `morph.js` |
| Sphere shells | entity | Sphere model: light/acoustic transit fronts, l=0 mode shares, thermal penetration, piezo/pyro, B = 0 | `data/sphere-subset.json` |
| Sphere spin | entity | Torque from pointer momentum, exponential decay | τ = log_φ(500)/(πf₀) |
| Sound | — | Sphere l=0 modes and gas-cavity mode ÷ φ¹⁸, Q preserved; depth low-pass (air absorption ∝ f²) | `audio.js`; master −34 dB |
| Get me out button, focus parking | — | Not animated | |

Randomness: there is no `Math.random` anywhere. Spawn points come from the golden-angle sequence.

## Accessibility
- There is a skip link and a visible focus ring.
- All 12 shortcuts are real links in the DOM. Tabbing to one parks it in view, holds it still and shows its label.
- `prefers-reduced-motion` (and no JavaScript) turns the shortcuts into a static row of labelled links. Every animation stops, and tiers 1/3 do not run their canvases.
- Sound is off by default. A text "Sound off/on" toggle sits in the footer, away from the sphere.
- The "Get me out" button is kept, as on every Rebella page.
- The sphere has `role="img"`.
