### 🔄 Project Awareness & Context
- **Read `TASK.md` first** when starting a new conversation, and `docs/quietfield_3d_animation_layer.md` whenever touching the entry sequence, any scenario, camera behavior, or design tokens. The spec document is the source of truth; the summary below is a shortcut, not a substitute.
- **Check `TASK.md`** before starting a new task. If the task isn't listed, add it with a brief description and today's date.
- **All application code lives in `site/`.** Run everything (dev server, tests, lint, build) from that directory.

### 🎨 Quietfield Hard Rules (from docs/quietfield_3d_animation_layer.md)
- **Camera grammar (§2)**: cut = impulse/reactivity · ease = deliberation · dolly-in = narrowing attention · dolly-out = widening context · shallow DOF = tunnel vision · deep DOF = full awareness. Check every camera/light/motion choice against this before implementing; never break it across scenes.
- **The one test**: does this motion/hover/color carry psychological meaning, or would the scene work identically without it? If the latter, cut it.
- **Tokens (§3.5)**: exactly four. `--qf-ink #1E1E17`, `--qf-cream #EFE7DB`, `--qf-rust #904A30`, `--qf-tan #848177`. Contrast rules: rust is never text on ink; tan on ink is large/UI only (>=14px bold / >=18px regular / non-text); body copy on ink is cream. A unit test (`src/lib/contrast.test.ts`) enforces the computed ratios.
- **Geometry**: border-radius <= 2px; depth shown with 1px tan hairlines, never drop shadows; no icon libraries; no emoji; no gradients; no em dashes in copy; no "it's not X, it's Y" constructions.
- **Glassmorphism (Amendment A, §9)**: allowed ONLY on home stage cards, scenario/stage page headers, and choice cards, and ONLY token-derived (ink fill 65%, cream border 8%, cream hover 32%, blur 12px). Pure white never appears. All other surfaces stay matte/flat.
- **Characters**: abstracted, low-poly, faceless. Ambiguity is load-bearing. Never "upgrade" with facial detail.
- **Accessibility**: `prefers-reduced-motion` fallbacks (instant crossfades) and the entry sequence Skip control are part of the primary build, not extras.
- **Build order (§1.1)**: 2D walking skeleton first (done), then entry sequence 3D (done), then one life stage of 3D at a time (stage sets done; per-scenario key beats next).

### 🧱 3D Layer (Three.js / R3F + GSAP — locked parameters, Amendment A)
- **Materials**: heads `SphereGeometry(r, 64, 64)` with `flatShading: false`; figures `MeshStandardMaterial` roughness 0.6, metalness 0.08.
- **Renderer**: `ACESFilmicToneMapping`, exposure 0.85, `PCFSoftShadowMap`, ink clear color, `FogExp2(ink, 0.04)`.
- **Rig**: ambient 0.35 (static) + directional key with soft shadows + tan rim 0.6 (static). ONE shadow-casting light max (the §3 budget).
- **Motion curves**: eased moves = `power3.inOut` (position AND target); hard cut = instant `gsap.set`; hover preview/gaze = `power2.out`; idle breathing = `sine.inOut` torso scale + micro head tilt (never vertical bounce).
- **Framing**: home camera elevated, looking gently down; figures and tables sit in the upper 55–60% of the viewport. Clearance is structural: scene, context, and choices stack in flow, never overlap.
- **Shared contract (§3.7.2)**: the 2D and 3D renderers consume the same `CameraDirective` values (`src/lib/camera.ts`); 3D pose/curve mapping lives in `src/three/poses.ts`. Never build per-scene camera rigs.
- **Fallback (§1)**: `SceneViewport` switches on WebGL; the 2D/SVG scene stays the fallback for unsupported browsers and tests (jsdom has no WebGL).

### 🧱 Code Structure & Modularity
- **Never create a file longer than 500 lines.** If a file approaches this limit, split it into modules or helper files.
- **Selection state is a dictionary keyed by scenarioId** — `Record<scenarioId, Selection>` in `ScenarioPage`, persisted as `choiceLog: { scenarioId: choiceId }` in the store (§3.7.3). Never store a bare `chosen`/`selected` primitive: the route reuses one component instance across all scenarios and every scenario uses the same A/B/C/D letter ids, so a shared primitive highlights the same letter everywhere. Handlers write only their own scenario's key; reads default to blank (unselected scenarios have no entry).
- **Organize code into clearly separated modules**, grouped by feature or responsibility:
  - `src/lib/` — camera contract, semantic utilities, store, tokens (pure logic)
  - `src/components/` — reusable UI and scene components
  - `src/pages/` — route-level pages
  - `src/content/` — authored data (scenarios per life stage, copy)
  - `src/styles/` — CSS by concern (tokens, base, scene, entry, pages)
- **Shared camera contract (§3.7.2)**: scenes call the shared camera (`src/lib/useSceneCamera.ts` + `src/components/SceneFrame.tsx`); never build per-scene camera rigs. The cut-vs-ease decision lives in one place.
- **Prefer type imports (`import type`)** and explicit return types on exported functions.

### 🧪 Testing & Reliability
- **Always add Vitest tests for new features.** Tests live next to the code they test (`src/lib/*.test.ts`, `src/components/*.test.tsx`, `src/pages/*.test.tsx`, `src/content/*.test.ts`).
- Include at least: 1 test for expected use, 1 edge case, 1 failure case.
- **Run from `site/`**: `npm test` (vitest), `npm run lint` (oxlint), `npm run build` (tsc + vite). All three must pass before calling work done.
- Tests are executable guards for the spec itself: contrast ratios, camera grammar, scenario data model, entry-sequence beats, store persistence.

### ✅ Task Completion
- **Mark completed tasks in `TASK.md`** immediately after finishing them.
- Add new sub-tasks or TODOs discovered during development to `TASK.md` under a "Discovered During Work" section.

### 📎 Style & Conventions
- **TypeScript + React 19 + Vite + Three.js (R3F) + GSAP**, strict mode. Functional components only; no class components.
- **Follow the existing component conventions**: props interfaces exported, `data-testid` on behavior-bearing elements, accessible labels on controls.
- **CSS**: plain CSS files in `src/styles/`, BEM-ish class prefixes (`qf-`), CSS custom properties for tokens. No CSS frameworks, no Tailwind.
- **Write brief doc comments** on non-obvious logic with a `# Reason:`-style comment explaining the why, and cite the spec section (`§x.y`) it implements.

### 📚 Documentation & Explainability
- **Update `site/README.md`** when new features are added, dependencies change, or setup steps are modified.
- **Keep `TASK.md` current** — it is the session handoff document.
- **Comment non-obvious code** and ensure everything is understandable to a mid-level developer.

### 🧩 Animate UI (separate project in `animate-ui/`)
- `animate-ui/` is its own open-source component library + docs site (React, TypeScript, Tailwind CSS v4, Motion). **Quietfield's guardrails (four-token palette, no Tailwind, no glass beyond Amendment A) apply only to `site/` and the Quietfield spec** — do not apply them to `animate-ui/`, and do not apply Animate UI conventions to `site/`.
- Read `animate-ui/README.md` and `animate-ui/CONTRIBUTING.md` before touching it. Its rules: components are editable source (registry + CLI, never a locked package), semantic Tailwind tokens (`bg-background`, `text-foreground`, `border-border`, `ring-ring`), Motion is tasteful and always `prefers-reduced-motion`-aware, one component per file, React 19 style (no `forwardRef`).
- **Docs never drift from the registry**: docs code examples import the real sources with `?raw`; a test (`tests/registry.test.ts`) enforces registry ↔ docs consistency.
- Its scripts live at the `animate-ui/` root: `npm run dev` (docs on 5174), `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run add <component>`, `npm run list`.

### 🧠 AI Behavior Rules
- **Never assume missing context. Ask questions if uncertain.**
- **Never hallucinate libraries or functions** — only use known, verified packages that are already in `site/package.json` (or add them deliberately).
- **Never delete or overwrite existing code** unless explicitly instructed to or if part of a task from `TASK.md`.
- **Never delete or modify `docs/quietfield_3d_animation_layer.md`** — it is the project's governing spec. If it and the code disagree, flag the disagreement in `TASK.md` and ask before resolving against the spec.
