# TASK.md — QUIETFIELD

Last updated: 2026-08-27

## Active Tasks

### 1. Quietfield website — 2D walking skeleton (spec §1.1 step 1) ✅ DONE
- [x] Persist spec as `docs/quietfield_3d_animation_layer.md` (verbatim source of truth)
- [x] Author all 25 scenarios (story, context, 4 choices each) since no bible was present in the repo; archetypes tagged per §3.7.1 (reactive A / avoidant B / clarifying C / regulated D, verified per scenario)
- [x] Four-token design system with computed contrast rules enforced by test
- [x] Shared camera contract in 2D (`src/lib/useSceneCamera.ts`, `src/components/SceneFrame.tsx`): cut = impulse, ease = deliberation, DOF via background blur
- [x] Entry sequence "Threshold" (all 5 beats, skip from beat 0, session-once, reduced-motion crossfades)
- [x] Scenario engine: stage-intro beats per §5.2 motion language, hover camera previews, per-choice consequence beats, choice log persisted to localStorage (survives refresh)
- [x] Home / stage index / scenario / custom 404 pages; distinct page titles; breadcrumbs with tick motif
- [x] Test suite green: contrast, camera grammar, scenario data model, entry beats, store, scenario page
- [x] Lint + production build green

### 2. Entry sequence — 3D upgrade (spec §4, §1.1 step 2) ✅ DONE
- [x] Three.js / React Three Fiber + GSAP added (`site/src/three/`)
- [x] Low-poly faceless figure + context (two figures, railing, window), ink fog, three-light rig
- [x] Same five beats, same timings, same camera grammar; skip and session-once identical
- [x] WebGL-unsupported falls back to the existing 2D version (verified by tests in jsdom)
- [x] Beat 4 ghost double-exposure rendered in-scene (static crossfade under reduced motion)

### 3. Scenario 3D stage sets (spec §5.3–§5.7, §1.1 step 3) ✅ DONE (first pass)
- [x] One 3D stage set per life stage, shared by all 25 scenarios: playground, classroom, café, meeting room, dinner table (Amendment A.4)
- [x] Shared 3D camera rig consuming the same CameraDirective values as 2D (cut = instant set, ease = power3.inOut, drift = power1.out)
- [x] Idle breathing (sine.inOut torso scale + micro head tilt), hover head-turn (power2.out), DOF context fade
- [x] Upper-band framing (figures in the upper 55–60%, clearance structural via stacked layout)
- [x] Ceramic materials (roughness 0.6 / metalness 0.08), 64×64 heads, ACES 0.85, FogExp2 ink 0.04, PCFSoft shadows
- [x] Glassmorphism on stage cards, page headers, choice cards (token-derived, Amendment A.1)
- [x] 62 tests green (palette, contrast, camera grammar, figure params, lighting params, pose mapping)

### 4. Per-scenario 3D key-beat specials (spec §5 directive blocks) 🔜 NEXT
- [ ] 1A whip-pan on the ball's roll; snap-zoom on attention landing
- [ ] 1B rack-focus freeze (shallow DOF) + reveal dolly-out
- [ ] 1C orbit around the closed circle; 1D deliberate crawl push-in
- [ ] 2A message-card stack; 2B echo dolly-ins; 2C whisper trail; 2D handheld cuts
- [ ] 3A two-shot widening; 3B phone foreground day/night; 3C disclosure volume; 3D crowd glide
- [ ] 4A speech-volume separation; 4B vignette release; 4C proposal split; 4D gaze pan
- [ ] 5A light-stream slowing; 5B memory overlay; 5C attention relocation; 5D exhale push-in
- [ ] (These attach to the per-scenario directive strings already in `src/content/scenarios/`)

### 5. Launch checklist (spec §7.5)
- [x] Custom 404 (done)
- [x] Breadcrumbs (done)
- [x] CTA above the fold (entry "Enter" affordance, done)
- [x] Unique page titles (done)
- [x] Internal links: stage index ↔ scenarios (done)
- [x] Favicon: M-monogram with rust notch, designed to stay legible at 16×16 (§7.5 #19)
- [x] Real loading state for 3D scenes (rule-line ornament, §3.6.1 #21)
- [ ] Completion page after all 25 (§7.5 #6)
- [ ] "How this works" explainer (§7.5 #5, conditional)
- [ ] About page (studio credit) + contact page (§7.5 #17, #18)
- [ ] Terms / privacy if analytics ever added (§7.5 #11, #26, #27)
- [ ] Alt text audit for all scene SVGs (§7.5 #7)

## Discovered During Work

- **No 25-scenario bible exists in the repo.** The spec references one; scenario stories and choice copy were authored from the §5 directive blocks (psych tags, camera/light directives, key beats) and marked in `src/content/scenarios/`. When the real bible arrives, reconcile it against these files and the §3.7 archetype tags.
- **Stack decision**: React 19 + Vite 8 + TypeScript strict + Three.js (R3F 9) + GSAP 3; HashRouter for static-host friendliness; Archivo Variable (display) + Fraunces Variable (body) per §3.6.1 #10.
- **The spec's canonical Childhood scene lives in the missing master spec** (§5.3 note). Its current authored version is an interpretation; flag for reconciliation.
- **CLAUDE.md rewritten** from the repo's Python template defaults to the project's actual TypeScript stack (template rules kept in spirit: file length caps, tests-first, TASK.md tracking).
- **Amendment A (2026-08-27, studio-approved):** glassmorphism override (§3.6.1 #8) restricted to stage cards, page headers, choice cards, token-derived only; 3D material/lighting/motion parameters locked. Recorded in §9 of the spec document.
