# Animate UI

Beautifully animated, accessible React components built with **TypeScript**,
**Tailwind CSS**, and **Motion**. Modeled on the shadcn/ui paradigm:
components are **editable source code you copy into your project**, not a
locked npm package.

> v0.1.0 - MVP distribution. Docs, six components, and a minimal CLI.

## Components

| Component | Category | Motion |
|---|---|---|
| Button | Actions | Tactile press scale (spring) |
| Accordion | Disclosure | Height 0 → auto (200ms) |
| Dialog | Overlay | Fade + subtle scale (150ms) |
| Tooltip | Feedback | Delay + fade (150ms) |
| Card | Layout | Deliberately static |
| Skeleton | Feedback | CSS pulse only |

Every animated component honors `prefers-reduced-motion` with instant
state changes.

## Install

Components are plain source files. Copy what you need, or use the CLI:

```bash
# copy into ./components/ui of your project
npm run add button accordion

# list everything in the registry
npm run list
```

The CLI also copies the shared `cn()` helper when needed and prints:

1. the npm dependencies to install, and
2. the semantic Tailwind theme block (the `bg-background` /
   `text-foreground` / `border-border` tokens) to add to your CSS.

The registry lives in [`registry/registry.json`](registry/registry.json).

## Documentation site

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # production build in docs/dist
npm test           # vitest across components, CLI, registry, and docs
npm run lint       # oxlint
npm run typecheck  # tsc across docs + components
```

The docs site imports component sources with `?raw`, so the code examples
are always the exact files users copy - docs and registry cannot drift.

### Docs features

- **Search**: global Cmd+K / Ctrl+K fuzzy palette over components and
  guide pages (arrows, Enter, Escape, aria combobox + listbox).
- **Navigation**: sticky sidebar grouped by category (desktop), mobile
  slide-over drawer, breadcrumbs, and previous/next pagination.
- **Component pages**: tabbed Preview / Code / Props API with live
  controls driving real props (variants, sizes, type, collapsible,
  `duration`, tooltip delay), animated copy feedback, TypeScript props
  reference tables, and Accessibility & Keyboard Interactions notes.
- **Theme**: dark/light toggle with localStorage persistence, animated
  icon swap, and a pre-paint script to avoid theme flash.
- **Motion standards**: entrance animations are quick staggered fades
  (≤300ms) and everything respects `prefers-reduced-motion`.

## Motion standards

1. Every animation answers: does it communicate state, or would the UI be
   identical without it?
2. Micro-interactions stay at or under 200ms; springs are for tactile
   feedback only.
3. `prefers-reduced-motion` disables transforms and transitions
   everywhere.
4. Not every component moves. Card and Skeleton are deliberately calm.

## Project status and links

This MVP lives inside the `context-engineering-intro` repository (branch
`arena/01a043f1-context-engineering-intro`):

- Code: `animate-ui/` in [the repository](https://github.com/abeleapenv-jpg/context-engineering-intro/tree/arena/01a043f1-context-engineering-intro/animate-ui)
- Issues: [repository issues](https://github.com/abeleapenv-jpg/context-engineering-intro/issues)

When Animate UI moves to its own repository, update the links in
`docs/src/components/site/Header.tsx` (`GITHUB_URL`) and this README.

### Roadmap

- [x] Six components with Motion, TypeScript, and accessibility
- [x] Docs site with live previews, install commands, and real source
- [x] Minimal CLI (`add` / `list`) with registry resolution
- [x] Docs UX: Cmd+K palette, sidebar + mobile drawer, tabs, props API
      tables, accessibility sections, breadcrumbs, prev/next, animated
      copy feedback, theme persistence
- [x] `duration` props on Accordion/Dialog/Tooltip; dialog focus trap
- [x] Tests: component behavior, CLI, registry/docs consistency, routes,
      palette, drawer, tabs, theme (43 tests)
- [ ] Component expansion (tabs, toast, popover, dropdown menu, ...)
- [ ] Published registry over HTTP so `npx animate-ui add` works from any project
- [ ] Registry schema versioning and dependency resolution across releases

## License

MIT - see [LICENSE](LICENSE). Components you copy into your project are
yours to use, modify, and redistribute.
