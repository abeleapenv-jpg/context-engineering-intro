# Quietfield — site

The application for Quietfield. Governed by `../docs/quietfield_3d_animation_layer.md` (read it, including §9 Amendment A, before touching scenes, camera behavior, glassmorphism, or tokens).

## Stack

- React 19 + TypeScript (strict) + Vite 8
- Three.js (via React Three Fiber 9) + GSAP for the 3D layer
- React Router (HashRouter, static-host friendly)
- Fonts: Archivo Variable (display, the logo's geometric caps language) + Fraunces Variable (body, editorial warmth) — §3.6.1 #10
- No UI library, no icon library, no CSS framework. Four tokens only (§3.5).

## Commands

```bash
npm install
npm run dev      # dev server on http://localhost:5173
npm test         # vitest run
npm run lint     # oxlint
npm run build    # tsc -b && vite build → dist/
npm run preview  # serve the production build
```

## Architecture notes

- **Camera contract (§3.7.2):** both renderers consume the same `CameraDirective` values from `src/lib/camera.ts`.
  - 2D: `src/lib/useSceneCamera.ts` + `src/components/SceneFrame.tsx` (CSS camera + background blur DOF).
  - 3D: `src/three/CameraRig3D.tsx` + `src/three/poses.ts` (meaning → pose, ease kind → GSAP curve: cut = instant set, ease = power3.inOut, fast = power2.in, drift = power1.out).
- **Progressive enhancement (§1):** `src/components/SceneViewport.tsx` switches on WebGL (`src/three/useWebGL.ts`); the 2D/SVG scene is the fallback (and what tests exercise, since jsdom has no WebGL).
- **3D stage sets:** `src/three/stages.tsx` — one set per life stage, shared by all 25 scenarios. Figures come from `src/three/figures.ts` (64×64 heads, matte ceramic, grounded at the feet).
- **Locked cinematic parameters (Amendment A):** `src/three/lighting.ts` (ACES 0.85, PCFSoft, ink FogExp2 0.04, ambient 0.35 + key + tan rim 0.6, one shadow-casting light) and `src/three/poses.ts` (upper-band home framing).
- **Entry sequence:** `src/components/EntrySequence.tsx` (shared beat state machine) + `src/three/ThresholdScene3D.tsx` (3D) — session-once via `src/lib/entrySession.ts`, skip from beat 0, reduced-motion crossfades.
- **Effects:** `src/three/effects.tsx` — idle breathing (sine.inOut torso scale + head tilt), choice-hover head-turn (power2.out), DOF context fade.
- **Content:** `src/content/scenarios/` holds the 25 scenarios, split per life stage. Choice archetypes drive the camera through `ARCHETYPE_BEHAVIOR`.
- **State:** `src/lib/store.ts` is client-side only (localStorage). No cookies, no backend, nothing to consent to (§7.5 #11/#16).
- **Glassmorphism (Amendment A.1):** token-derived only (ink 65% fill, cream 8% border, cream 32% hover, blur 12px) on stage cards, page headers, and choice cards. Everything else stays matte.
