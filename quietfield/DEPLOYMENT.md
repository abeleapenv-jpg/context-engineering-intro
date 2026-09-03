# Quietfield — deployment guide

The app is a fully static build. It uses a hash router (`#/scenario/1A`), so
**no server rewrite rules are needed on any host** — the server only ever
serves `index.html`. Illustrations and content are locked as-is (owner
approval 2026-09-03); there is nothing else to generate.

## Build

```bash
cd quietfield
npm install
npm run build        # -> dist/  (index.html + hashed js/css + fonts + 25 images)
```

`dist/` is the entire site. A ready-made export is `quietfield-dist-v1.0.0.zip`
(same contents); when in doubt, rebuild — the zip is a convenience, not the
source of truth.

## Option A — Vercel (the master plan's host), via dashboard

1. Push the repo to GitHub (already on `abeleapenv-jpg/context-engineering-intro`,
   branch `arena/01a062a9-context-engineering-intro`; merge/PR to `main` first
   if you want `main` to be the deploy source).
2. vercel.com → **Add New… → Project** → import that GitHub repo.
3. **Root Directory: `quietfield`** (critical — the repo holds several
   projects; the app lives in this subfolder).
4. Framework preset auto-detects **Vite** → Build Command `npm run build`,
   Output Directory `dist`. Defaults are correct.
5. Deploy. Every push to the chosen branch redeploys automatically.

No environment variables are required to launch — without them the site runs
in local mode (progress saved in each visitor's browser). Add Supabase later
without touching code (see below); it only needs a redeploy after setting vars.

## Option B — Vercel CLI (from your machine)

```bash
npm i -g vercel
cd quietfield
vercel          # first run: link project, confirm build/output defaults
vercel --prod
```

## Option C — any static host / manual export

Unzip `quietfield-dist-v1.0.0.zip` (or copy `dist/`) and serve it:

- **Netlify Drop** — drag the `dist` folder onto app.netlify.com/drop. Done.
- **GitHub Pages / S3 + CloudFront / nginx** — upload the contents; hash
  routing means deep links always resolve to `index.html`.
- Local check of a built copy: `npx serve dist` or `python3 -m http.server`
  inside the folder.

## Optional, post-launch: Supabase (accounts + cross-device progress)

1. Create a project at supabase.com.
2. SQL Editor → run `supabase/schema.sql`.
3. **Verify the RLS policies in Authentication → Policies** (master plan
   section 8, risk 5: verify in the dashboard, never assume).
4. Copy the project URL + anon key into Vercel → Project → Settings →
   Environment Variables as `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY`, then redeploy. The service key stays secret and
   must never appear in frontend code.

## Post-publish notes

- Custom 404 page: built in (client-side route), no host config needed.
- Page titles, alt text (all 25), and the favicon ship inside the build.
- If analytics are ever added: privacy-respecting only, and add the cookie
  consent step from the master plan's pre-launch checklist.
