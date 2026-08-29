# Contributing to Animate UI

Thanks for contributing. Animate UI follows the shadcn/ui paradigm:
components are **editable source code**, not a locked package. Every change
you make to `components/` is what users copy or install - treat those files
as public API.

## Repository layout

```
animate-ui/
├── components/ui/     # the distributable components (source of truth)
├── lib/utils.ts       # the cn() helper every component depends on
├── registry/          # shadcn-style registry consumed by the CLI
├── cli/               # minimal add/list CLI (plain Node ESM, no deps)
└── docs/              # the documentation site (Vite workspace)
```

## Conventions

- **One component per file**, named like the component (`button.tsx`).
- **React 19 style**: function components, `ref` as a prop (no `forwardRef`).
- **Semantic Tailwind tokens** only (`bg-background`, `text-foreground`,
  `border-border`, `ring-ring`, ...). Never hardcode hex colors in
  components - hosts define the tokens via the theme block the CLI prints.
- **Motion is tasteful, never decorative.** Every animation must pass:
  would the component still be fully usable and clear without it? If yes,
  keep it subtle. If the animation is load-bearing, reconsider the design.
- **Respect `prefers-reduced-motion`** in every animated component
  (Motion's `useReducedMotion` or equivalent).
- **Accessibility first**: aria states, keyboard support, focus management.

## Adding a component

1. Create `components/ui/<name>.tsx`.
2. Add a registry item in `registry/registry.json` with its files,
   dependencies, and `docs` path.
3. Add metadata + a live preview in `docs/src/content/`.
4. Add tests: rendering, interaction, and reduced-motion behavior.
5. Run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`.

## Scripts

```bash
npm run dev         # docs site at http://localhost:5174
npm test            # vitest
npm run lint        # oxlint
npm run typecheck   # tsc across docs + components
npm run build       # production docs build
npm run add button  # CLI: copy a component into ./components/ui of the cwd
npm run list        # CLI: list the registry
```

## Commit style

Short imperative subject. Mention the component or area (`feat(accordion): ...`).
