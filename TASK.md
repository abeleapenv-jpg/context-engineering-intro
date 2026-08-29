# TASK.md — WORKSPACE (Quietfield + Animate UI)

Last updated: 2026-08-29

## Session status: PR #1 MERGED ✅ + docs upgrade complete

- [x] **PR #1 merged** into `main` (merge commit `637b166`, 2026-08-29)
- [x] Follow-up: Animate UI docs quality pass (see below), committed and pushed; new PR can be opened on request

## Animate UI — docs quality pass ✅ DONE (2026-08-29)

- [x] Theme toggle upgraded: animated sun/moon swap, localStorage persistence, pre-paint script (already existed; polished rather than duplicated), smooth color transition (reduced-motion aware)
- [x] Typography/contrast: code font stack, text-balance hero, muted preview stage, visible token-derived focus ring site-wide
- [x] Entrance animations (staggered fades ≤300ms) + hover/active states on nav, sidebar, cards
- [x] Tabbed component pages: Preview / Code / Props API (WAI-ARIA tabs, arrow-key navigation)
- [x] Interactive controls drive real props: variant/size/disabled (button), type/collapsible/duration (accordion), duration (dialog), delay/duration (tooltip). Logic correction: added real `duration` props to accordion/dialog/tooltip instead of fake UI-only knobs
- [x] Copy buttons with animated checkmark feedback (CodeBlock + InstallCommand)
- [x] Cmd+K fuzzy search palette (subsequence matching, keyboard, aria combobox/listbox)
- [x] Mobile slide-over drawer (focus management, Escape, backdrop) + desktop sidebar grouped by category
- [x] Breadcrumbs + previous/next pagination on component pages
- [x] Props API tables + Accessibility & Keyboard Interactions sections for all 6 components (authored from sources; completeness tested)
- [x] Dialog focus trap added (Tab/Shift+Tab cycle within the panel) — a real ARIA gap found and fixed
- [x] Gates: 43 tests green (palette, drawer, tabs, theme, trap, duration props), lint 0/0, typecheck, production build

## Animate UI (animate-ui/) ✅ DONE — MVP

- [x] Six components (button, card, accordion, dialog, skeleton, tooltip): React 19 + TypeScript + Tailwind v4 semantic tokens + Motion, reduced-motion aware, accessible (aria, keyboard, focus management)
- [x] shadcn-style registry (`registry/registry.json`) + zero-dep Node CLI (`add`, `list`) with cn() resolution, dependency reporting, and theme-snippet output
- [x] Docs site (Vite workspace): home, component index, detail pages with live previews + install commands + real `?raw` source, license + contributing pages, 404, theme toggle, per-page titles, honest GitHub links
- [x] Motion quality control codified (≤200ms micro-interactions, reduced motion everywhere, static components stay static)
- [x] 31 tests green: component behavior, dialog portal/Escape/focus, CLI copy + failure modes, registry ↔ docs consistency, docs routes
- [x] lint / typecheck / production build green; CLI smoke-tested from an external cwd
- [x] Repo docs updated (README, CLAUDE.md section, .gitignore)

## Animate UI — roadmap
- [ ] Expand components (tabs, toast, popover, dropdown menu, avatar, badge)
- [ ] Serve the registry over HTTP so `npx animate-ui add` works outside this repo
- [ ] Registry schema versioning + dependency resolution across releases
- [ ] Own repository + updated `GITHUB_URL` in `animate-ui/docs/src/components/site/Header.tsx`

## Quietfield — Active Tasks

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

### 3.5 Quiz state isolation refactor (dictionary-based selection state) ✅ DONE
- [x] Replaced the bare `chosen`/`revealed` primitives in `ScenarioPage` (which leaked across `/scenario/:id` route reuse, highlighting the same A–D letter on every scenario) with `Record<scenarioId, Selection>` keyed per scenario
- [x] Isolated handlers: choosing writes only that scenario's key; the settle callback reveals only that scenario's consequence
- [x] Deterministic navigation rendering: each scenario reads its own key; transient camera/hover state resets on scenario change; hydration from persisted `choiceLog` restores a scenario's own choice on fresh visits
- [x] Defensive initialization: unselected scenarios render blank with all choices enabled; stale persisted choice ids resolve to blank instead of a fallback index or crash
- [x] Store: added `getChoiceId(scenarioId)` read helper + test-only `__resetForTests()`
- [x] Regression tests: in-page navigation cross-talk, dictionary retention on return, per-scenario hydration, stale-id defense (73 tests green)

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

- **No 25-scenario bible exists in the repo.** The spec references one; scenario stories and choice copy were authored from the §5 directive blocks (psych tags, camera/light directives, key beats) and marked in `src/content/scenarios/`. When the real bible arrives, reconcile it against these files and the §3.7 archetype tags. **Citations to "Section 11/12/13" of the bible (§1, §2, §3, §3.5, §7 of the 3D doc) remain unverified** — the source file is not present to check its current numbering against; re-verify those numbers once the bible is added to `docs/`.
- **Stack decision**: React 19 + Vite 8 + TypeScript strict + Three.js (R3F 9) + GSAP 3; HashRouter for static-host friendliness; Archivo Variable (display) + Fraunces Variable (body) per §3.6.1 #10.
- **The spec's canonical Childhood scene lives in the missing master spec** (§5.3 note). Its current authored version is an interpretation; flag for reconciliation.
- **CLAUDE.md rewritten** from the repo's Python template defaults to the project's actual TypeScript stack (template rules kept in spirit: file length caps, tests-first, TASK.md tracking).
- **Amendment A (2026-08-27, studio-approved):** glassmorphism override (§3.6.1 #8) restricted to stage cards, page headers, choice cards, token-derived only; 3D material/lighting/motion parameters locked. Recorded in §9 of the spec document.
- **Proofreading pass (2026-08-27):** fixes 1–8 applied to the spec doc (§3.6.1/§7.5 status vocabularies standardized; ordinal text-cue labels in §4.2/§4.3) with code mirrors: `data-text-cue` ordinals on the entry overlays, §5.6 4D wording in `scenarios/office.ts`, `sessionId | userId` union note in `store.ts`.
- **PENDING VERIFICATION (flagged, not fixed):** §3.5 logo mark bullet: "INDEPENDENT CREATIVE STUDIO." trailing period. No logo source file (.ai/.eps/.pdf) exists in this repo to check against. Doc (§3.5) and code (`content/cta.ts` TAGLINE_2, footer) currently agree on the period. When the studio provides the source logo file, if it has no trailing period: update `cta.ts` TAGLINE_2 and the §3.5 bullet together.
