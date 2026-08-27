# QUIETFIELD

**Quietfield** is an interactive website that teaches social observation and interpretation through 25 life-stage scenarios. Its thesis:

> You cannot always control what other people do. You can control how carefully you observe, interpret, communicate, and choose.

The site's entry sequence is the first scenario, not a logo animation: one real round of Notice → Pause → Widen → Choose before any navigation appears. Every scenario then plays out the same loop with camera movement that carries meaning: hard cuts read as impulse, eased moves as deliberation, a widening frame as recontextualization.

A Musterfield Labs project.

## The spec

Everything is governed by the **3D Animation & Entry Sequence Layer** document, kept verbatim in:

- [`docs/quietfield_3d_animation_layer.md`](docs/quietfield_3d_animation_layer.md)

It defines the 2D/3D semantic camera language, the four-token brand system with computed contrast rules, the entry sequence's five beats, per-scenario camera/light directives for all 25 scenarios, and a recommended build order. `CLAUDE.md` summarizes the hard rules for coding sessions; the spec wins on any disagreement.

## What exists today

Per the spec's §1.1 build order, steps 1–3 are in place: the 2D walking skeleton, the 3D entry sequence, and the 3D stage sets.

- **Entry sequence "Threshold"** — all five beats (§4.2), skip from beat 0, plays once per session. Rendered in Three.js (R3F) with GSAP when WebGL is available; the 2D/SVG version stays the fallback. `prefers-reduced-motion` crossfades throughout.
- **All 25 scenarios authored and playable** — five life stages (Playground, Classroom, Café, Meeting Room, Dinner Table), each with a canonical scenario plus four variants, four choices each (A/B/C/D), per-choice consequence beats, and §3.7.1 archetype tags (reactive / avoidant / clarifying / regulated).
- **The shared camera contract in 2D and 3D** — both renderers consume the same `CameraDirective` values (§3.7.2). 2D: CSS transform camera + background blur DOF. 3D: GSAP-driven rig (hard cut = instant set, deliberation = `power3.inOut`, avoidant = drift) with the same meanings.
- **One 3D stage set per life stage** shared by all 25 scenarios (Amendment A.4): ceramic-figure materials (roughness 0.6 / metalness 0.08), 64×64-segment heads, ACES tone mapping at 0.85, ink fog, one soft-shadow key light + ambient + cold tan rim, figures framed in the upper 55–60% of the viewport.
- **Living detail**: sine.inOut idle breathing (torso scale + micro head tilt, never bounce), choice-hover head-turns (power2.out) and camera previews, beat-4 double-exposure ghosts in the entry.
- **Progress persistence** — choice log and completion survive refresh, stored client-side only (no cookies, no backend).
- **The guardrail system** from §3.6 enforced by convention and tests (tokens, contrast ratios, camera grammar, voice rules, palette scan). Glassmorphism is the one recorded override (Amendment A, §9 of the spec), token-derived only.

Still to come: per-scenario 3D key-beat specials (§5 directive blocks) and the remaining §7.5 launch items. Tracked in [`TASK.md`](TASK.md).

## Repository layout

```
context-engineering-intro/
├── docs/
│   └── quietfield_3d_animation_layer.md   # governing spec + Amendment A (§9)
├── site/                                  # the application
│   ├── src/
│   │   ├── lib/            # camera contract, semantics, store, tokens, entry beats
│   │   ├── three/          # 3D layer: figures, stages, lighting, poses, camera rig, effects
│   │   ├── components/     # SceneViewport (2D/3D switch), SceneFrame, stages, marks, controls
│   │   ├── content/        # scenarios per life stage, copy (authored from §5 directives)
│   │   ├── pages/          # home, stage index, scenario, 404
│   │   └── styles/         # tokens, base, scene, entry, pages CSS
│   └── tests/              # vitest suites (colocated with src)
├── TASK.md                                # session handoff + roadmap
└── CLAUDE.md                              # agent rules for this project
```

(The remainder of this repository is the original Context Engineering template — PRP workflow, Claude Code guides, use-cases — kept as-is for reference.)

## Develop

```bash
cd site
npm install
npm run dev      # http://localhost:5173
npm test         # vitest
npm run lint     # oxlint
npm run build    # tsc + vite (production build in dist/)
```

### The test suite as spec guards

62 tests currently enforce the document's own rules:

- `src/lib/contrast.test.ts` — the §3.5.1 WCAG ratios (rust is never text on ink; tan on ink is large/UI only)
- `src/lib/camera.test.ts` — the §2 grammar: reactive = hard cut, clarifying = eased dolly-out, avoidant = drift, regulated = eased settle
- `src/content/scenarios.test.ts` — 25 scenarios, 5 per stage, 4 choices each, valid archetypes, no em dashes / emoji / banned copy constructions
- `src/components/EntrySequence.test.tsx` — the §4.2 beat timeline, skip behavior, session-once gating
- `src/lib/store.test.ts` — progress survives refresh
- `src/pages/ScenarioPage.test.tsx` — choices branch, consequences reveal, camera eases per archetype, 2D fallback when WebGL is unavailable
- `src/three/figures.test.ts` — locked mesh/material parameters (64×64 heads, roughness 0.6, metalness 0.08, grounded rigs)
- `src/three/lighting.test.ts` — ACES 0.85, PCFSoft shadows, ink fog, one shadow-casting light
- `src/three/poses.test.ts` — meaning → pose mapping and the GSAP curve bindings (power3.inOut / instant set / power1.out)
- `src/styles/palette.test.ts` — every hex/rgba in the stylesheet traces to the four tokens; pure white never appears

## Roadmap

1. ✅ 2D walking skeleton
2. ✅ Entry sequence in Three.js / React Three Fiber, same beats, 2D fallback
3. ✅ One 3D stage set per life stage, shared by all 25 scenarios
4. 🔜 Per-scenario 3D key-beat specials (§5 directive blocks: whip-pans, rack-focus, orbit, whisper trail, crowd glide, etc.)
5. §7.5 launch checklist (completion page, about/contact, alt text, terms/privacy if analytics arrive)
