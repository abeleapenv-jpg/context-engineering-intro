# Quietfield — the illustration-based build

The Quietfield experience, rebuilt per `QUIETFIELD — ILLUSTRATION-BASED REBUILD
MASTER PLAN` (which replaces the discontinued 3D/animation approach). One
carefully crafted static illustration per scenario; every scenario ships
finished, not animated.

## Stack

- React 19 + Vite 8 + Tailwind CSS v4 (four brand tokens in `src/index.css`)
- Supabase (Postgres + Auth, RLS on) — optional; the site runs in **local
  mode** (localStorage) until `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
  are set
- React Router (HashRouter, static-host friendly) — deployable to Vercel as-is
- Fonts: Archivo Variable (display) · Fraunces Variable (body) · IBM Plex Mono
  (archival metadata)

## Commands

```bash
npm install
npm run dev          # dev server on http://localhost:5175
npm run build        # production build -> dist/
npm run preview      # serve the production build
npm run verify:data  # validate scenarios.json (25 scenarios, 4 choices each,
                     #   real alt text, image_path naming, files on disk)
```

Illustration tooling (Python 3 + Pillow):

```bash
python3 scripts/normalize-images.py   # enforce exact 1200x1500 (4:5)
python3 scripts/check-palette.py      # four-token palette hull audit
```

## Architecture

```
src/
  components/  Scenario, ChoiceButton, Nav, ProgressBar, StageRing, Auth
  pages/       Home, LifeStageIndex, Scenario, Profile, About, Contact,
               ThankYou, NotFound
  lib/         supabaseClient.js, progress.js (data adapter), scenarios.js,
               hush.jsx (nav/breadcrumb dimming context), usePageTitle.js
  data/        scenarios.json  (25 scenarios; the only content source)
public/
  assets/images/   25 illustrations, {scenario_id}-{slug}.png, 1200x1500
supabase/
  schema.sql        progress + choices_made, RLS, upsert-safe constraints
```

### The decision engine (`Scenario.jsx` + `ChoiceButton.jsx`)

- **Entry pacing** — ink paints instantly; the illustration fades in over
  400ms while the text block rises (`translate-y-4 -> 0`).
- **Hush state** — nav + breadcrumbs drop to `opacity-30` during the decision;
  they restore on hover/focus and permanently once the choice is made.
- **Editorial layout** — asymmetrical 12-column grid; archival tag
  `INDEX // SCENARIO {id} · {stage}` in mono/uppercase/tracked tan above the
  image.
- **Tactile choices** — 1px tan-alpha hairline, rust border on hover/focus
  (300ms), number keys 1–4 to choose, `active:translate-y-[1px]` depression.
- **Afterthought resolution** — unchosen options fade to
  `opacity-0 pointer-events-none`; the resolution surfaces in cream with a
  quiet Continue; no redirect until Continue.
- Reduced motion: every transition collapses via `motion-reduce:` variants and
  one global `prefers-reduced-motion` rule (the hook stays for future motion).

### Data + persistence

`scenarios.json` is static content. `progress.js` is the only persistence
layer: Supabase `progress`/`choices_made` (upserts target
`(user_id, scenario_id)`) when configured and signed in; the same shape in
localStorage otherwise. Resume = first uncompleted scenario in canonical order,
re-queried after every Continue.

## Supabase setup

1. Create a project, run `supabase/schema.sql` in the SQL editor.
2. Verify the RLS policies in Authentication → Policies (never assume).
3. Copy `.env.example` to `.env`, fill the URL + anon key, redeploy.

The service key must never appear in frontend code.
