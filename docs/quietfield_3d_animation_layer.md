# QUIETFIELD — 3D ANIMATION & ENTRY SEQUENCE LAYER
## Dimensional Staging System for the 25-Scenario Bible & Website Entry Sequence
### Companion to: Quietfield_Expanded_25_Scenario_Story_Animation_Bible.md — For an AI Coding Agent / Musterfield Labs

---

# 0. PURPOSE

This is a **second expansion layer**, sitting on top of the existing 25-scenario Story & Animation Bible.

Do **not** replace the SVG/2D semantic animation system already specified there. That system remains the content source of truth — every psychological beat, choice, and consequence it defines stays exactly as written.

This layer does two things:

1. Translates each of the 25 scenarios' existing 2D animation notes into a **3D staging language** (camera, depth, light) that an AI coding agent can build directly.
2. Specifies a **3D entry sequence** — the first thing a visitor sees when entering the site — built out of the same social-psychology principles the rest of Quietfield teaches, so the intro isn't decoration; it's the first lesson.

Everything here is written to be **copy-pasted to your coding agent**, either whole or scenario-by-scenario.

---

# 0.5 QUICK REFERENCE — READ THIS FIRST

If you're an agent picking this file up mid-project (a new session, a new phase, a context reset), this is the whole system in one glance. Everything below is derived from and expanded on elsewhere in this doc — when in doubt, the full section wins, but this should be enough to stay consistent without re-reading everything.

**Tokens:** `--qf-ink #1E1E17` (background) · `--qf-cream #EFE7DB` (primary text/figures) · `--qf-rust #904A30` (single signal accent — shapes only, see 3.5.1 for why never text-on-ink) · `--qf-tan #848177` (secondary/UI labels, large sizes only on ink — see 3.5.1).

**The one test every motion, hover, and color choice must pass:** does this carry psychological meaning, or would the scene work identically without it? If the latter, cut it.

**Camera grammar (never break this across any of the 25 scenes):** hard cut = impulse/reactivity · eased move = deliberation · dolly-in = narrowing attention · dolly-out = widening context · shallow depth of field = tunnel vision · deep focus = full awareness. Full table in Section 2.

**Geometry:** corners ≤2px, no drop shadows (use a 1px `--qf-tan` hairline instead), no stock icons, no default AI-startup typefaces. Full list in Section 3.6.

**Build order:** 2D baseline for one scenario first, then entry sequence, then 3D stage-by-stage. Never 3D before the 2D skeleton is confirmed working. See 1.1.

---

# 1. HOW THIS LAYER WORKS

- **3D is progressive enhancement, not a replacement.** The 2D/SVG system stays as the fallback for low-power devices, `prefers-reduced-motion`, and WebGL-unsupported browsers. Every 3D scene below must degrade to its existing 2D counterpart.
- **The camera replaces the SVG camera-widening/framing tricks already in the bible** (Section 12's semantic table) with real dimensional depth — the psychology doesn't change, only the medium.
- **Stack assumption:** these prompts default to **Three.js**, via **React Three Fiber** if the site is React-based, with **GSAP or Framer Motion** for timeline easing. If your agent's actual stack differs, tell it to adapt — the camera/light/beat language below is framework-agnostic; only the technical requirements in Section 3 are stack-specific.

## 1.1 Recommended Build Order

Don't start with the entry sequence, even though it's the most exciting part to build. It's also the riskiest — WebGL support, mobile performance, and reduced-motion fallback are all unproven on your actual stack until something is running. Validate the boring 80% before spending budget on the hard 20%:

1. **One scenario, 2D/SVG only** (the canonical Childhood scene is a good first pick). Confirm the choice/consequence flow actually branches and the state survives a refresh before any 3D work starts. This is the walking skeleton everything else stacks on.
2. **The entry sequence** (Section 4), once the skeleton is confirmed — it sets the camera/lighting grammar every later 3D scene reuses.
3. **One life stage's worth of 3D scenes at a time** (Sections 5.3–5.7, in order), confirming the pattern holds before scaling to the next stage.

---

# 2. THE 3D SEMANTIC LANGUAGE

Just as the original bible maps 2D motion to psychological meaning (Section 12), every 3D device used across all 25 scenes must map to one of these meanings. Never use camera movement, depth, or light decoratively.

| 3D Device | Psychological Meaning |
|---|---|
| Dolly-in (camera moves closer) | Narrowing attention, rising urgency, threat focus |
| Dolly-out / pull-back | Widening context, reframing, alternative interpretation |
| Shallow depth of field | Tunnel vision, rumination, fixation |
| Deep focus (everything sharp) | Full contextual awareness, clarity |
| Distance between camera and subject | Felt intimacy vs. social distance |
| Low camera height, looking up | Vulnerability, smallness, power imbalance |
| Eye-level camera | Equality, groundedness, agency |
| Elevated camera, looking down | Overview, reflective distance |
| Slow orbital drift | Processing time, reflection |
| Locked static camera | Presence without performance |
| Particle/crowd convergence | Synchronization, conformity, social pressure |
| Particle/crowd divergence | Individuality, independent judgment |
| Fog / atmospheric haze | Ambiguity, uncertainty |
| Haze clearing | Interpretive clarity emerging |
| Rim light isolating one figure | A clear signal emerging from noise |
| Flat, even lighting | An undifferentiated, ambiguous social field |
| Hard cut | Impulse, reactivity |
| Eased camera move | Deliberation, regulation |

This table is the single reference your agent should check against before writing any camera or lighting code for any scene.

---

# 3. TECHNICAL RULES FOR 3D IMPLEMENTATION

Mirrors Section 11 of the original bible, adapted for three dimensions:

- **Ground every character rig at the feet**, not the center — origin at the base, same rule as the SVG system. Never fake breathing with vertical bounce; use torso scale, shoulder rotation, chest expansion, and gaze/head movement instead.
- **Characters stay abstracted and low-poly, with no rendered facial detail.** This is deliberate, not a budget shortcut — ambiguity of expression is load-bearing for the lesson in nearly every scenario. Do not "upgrade" this later without revisiting the psychology.
- **Cuts vs. eases are meaningful, not stylistic.** A hard cut always means impulse/reactivity; an eased move always means deliberation. This distinction must be consistent across all 25 scenes or it stops teaching anything.
- **Performance budget:** target 60fps on mid-range mobile. Keep triangle counts modest, use one dynamic light per scene maximum, bake or fake secondary lighting.
- **`prefers-reduced-motion` fallback:** replace camera movement and particle motion with instant opacity/state crossfades. Keep the semantic beat (reveal, resolve, widen) but make it immediate rather than animated.
- **WebGL-unsupported or low-power fallback:** load the existing 2D/SVG scene for that scenario instead. 3D is additive.
- **Each of the four response choices (A/B/C/D) needs its own short resolution beat** inside the same camera language — never just a static image swap per choice.

---

# 3.5 MUSTERFIELD LABS BRAND REFERENCE

Extracted directly from the studio's logo files (pixel-sampled, not eyeballed). Treat these as close working values — JPEG export may have shifted them slightly, so confirm against your original vector/source file before locking production tokens. This replaces any placeholder color language used elsewhere in this document.

**Color tokens**

| Role | Approx. hex | Description |
|---|---|---|
| `--qf-ink` | `#1E1E17` | Near-black warm charcoal — primary background |
| `--qf-cream` | `#EFE7DB` | Warm ivory/cream — wordmark, primary text, the M monogram |
| `--qf-rust` | `#904A30` | Burnt terracotta/rust — the single accent color |
| `--qf-tan` | `#848177` | Muted warm taupe — secondary labels, tagline text, thin rule lines |

## 3.5.1 Contrast & Accessibility (Computed, Not Assumed)

Actual WCAG contrast ratios between the four tokens, calculated directly rather than eyeballed — some of these are tighter than the palette's restrained look suggests:

| Pair | Ratio | Normal text (needs 4.5:1) | Large text/UI (needs 3:1) |
|---|---|---|---|
| Cream on ink | 13.66:1 | Pass | Pass |
| Rust on ink | 2.56:1 | **Fail** | **Fail** |
| Tan on ink | 4.30:1 | **Fail** (just under) | Pass |
| Rust on cream | 5.34:1 | Pass | Pass |
| Tan on cream | 3.18:1 | **Fail** | Pass |
| Rust on tan | 1.68:1 | **Fail** | **Fail** |

**Resulting rules:**
- **Rust is never used as text on ink.** It fails contrast even at large sizes (2.56:1). This confirms and hardens the "rust is a signal color, not UI color" rule from 3.6 — use it for shapes, accents, and the single point of emphasis described throughout this doc, never for a rust-colored word or label on the dark background.
- **Tan on ink is large-text/UI only** (≥18px regular or ≥14px bold, or non-text UI elements like the rule lines). Don't set small body copy in tan-on-ink — it's a hair under the AA threshold.
- **If rust needs to appear as text anywhere** (unlikely, but e.g. a printed/exported context on a cream surface), it's compliant on cream at 5.34:1 — never on ink or on tan.
- **Never pair rust directly against tan** for anything text-like — 1.68:1 fails outright.

---

**Logo mark**

- A bold, geometric **"M" monogram** in cream, two peaks meeting at a shared base point.
- A **solid rust square** fills the small notch where the M's strokes meet at the base — the mark's only saturated color, used as a single, deliberate point of emphasis rather than a spread accent.
- A **thin horizontal rule** with small square tick marks at each end, sometimes centered under a tiny compass-point/dot ornament, in the muted tan tone.
- Wordmark: **"MUSTERFIELD"** (bold cream small caps, letterspaced) + **"LABS"** (smaller, set in rust).
- Tagline, set in muted tan small caps: **"UI / UX · BRANDING · ILLUSTRATION"** / **"INDEPENDENT CREATIVE STUDIO."**

**How this governs the rest of this document**

- **Rust is a signal color, not a palette color.** Across all 25 scenes and the entry sequence, rust should appear the way it does in the mark — as one small, isolated point of emphasis (a rim light, a single glowing element, a resolved focal point) — never as a wash across a whole scene. If a beat below calls for something to "become clear" or "resolve," rust is the natural color for that single clarified point.
- **Ink and cream are the base relationship** for every scene's background/figure contrast; the "flat bright," "cold blue," "warm," etc. lighting notes throughout Section 5 describe temperature shifts layered on top of this ink/cream base — not a full palette swap per scene.
- **Tan carries UI, not drama** — dialogue-bubble chrome, labels, rule lines, and the tagline-style microcopy (per Section 13 of the original bible) should sit in `--qf-tan`, leaving cream and rust free for the things that actually matter psychologically in a given beat.

---

# 3.6 DESIGN GUARDRAILS — AVOID GENERIC "VIBECODED" PATTERNS

Applies to every page of the site, not just the 3D layer. Same underlying test as Section 2's motion rule: if a pattern exists because "that's what AI-generated sites look like" rather than because it serves Quietfield specifically, it's cut — no exceptions for convenience or a library's default.

## 3.6.1 Full Checklist — All 30 Patterns, Explicitly Addressed

Status vocabulary: **Enforce** (must hold by design rule) · **Structurally impossible** (prevented by the four-token system) · **Not applicable** (no action) · **Low priority** (due before public launch). Nuance lives in the Rule column.

| # | Pattern | Status | Rule |
|---|---|---|---|
| 1 | Harsh gradients | Structurally impossible | Backgrounds are flat `--qf-ink` or `--qf-cream`. The only permitted gradient is the near-invisible vignette already specified in the 3D lighting language — never a visible two-tone hero gradient. |
| 2 | Lucide / stock icon sets | Enforce | No imported icon library. Every icon is custom-drawn at the M-monogram's stroke weight and geometry — same ratio of stroke to glyph height as the mark. |
| 3 | Pure white background | Structurally impossible | `#FFFFFF` never appears in the codebase. Base surfaces are `--qf-ink` #1E1E17 or `--qf-cream` #EFE7DB only. |
| 4 | Rainbow coloring | Structurally impossible | Exactly 4 color tokens exist. Nothing outside them ships. |
| 5 | Drop shadows | Enforce | No soft/glassy box-shadows for elevation. Where depth is needed, use a 1px `--qf-tan` hairline border — echoing the logo's thin rule — instead. |
| 6 | 3 feature cards in a row | Enforce | The 25 scenarios present as one vertical narrative path grouped by life stage — never a 3-up marketing grid. |
| 7 | Emojis | Enforce | Zero emoji anywhere in UI or copy. The whole visual language (faceless characters, restrained palette) depends on this. |
| 8 | Liquid glass / glassmorphism | Enforce | All surfaces matte/flat except the §9 (Amendment A) glass surfaces: home stage cards, scenario/stage page headers, and choice cards, token-derived only (ink fill 65%, cream border 8%, blur 12px). No other blur-behind or translucency effects. |
| 9 | Em dashes (in copy) | Enforce | Site microcopy edited for plain, direct sentences. Flag and rewrite any em-dash-heavy line before it ships. |
| 10 | Inter / Geist / Space Grotesk | Enforce | Display type: bold geometric sans matching the logo's caps. Body type: something with more editorial character than the default trio — worth trialing a warm serif (e.g. Fraunces, Canela, GT Sectra) or a distinctive sans (Neue Montreal, Söhne) as a direction, not a locked choice. |
| 11 | Colored left stripe | Enforce | No decorative accent bars on cards. The only permitted "stripe" is the logo's actual rule-with-ticks motif, used sparingly as a section divider — never as a card-border trick. |
| 12 | Fake testimonials | Not applicable | None planned. If added later, they're real or they're cut. |
| 13 | Bento grids | Enforce | No dashboard-style mixed-size tile layouts. Layout follows the narrative path structure. |
| 14 | Terminal window | Not applicable | No code/terminal motif anywhere — irrelevant to the subject matter. |
| 15 | "It's not X, it's Y" copy | Enforce | Banned construction, site-wide. |
| 16 | Checkmark bullets | Enforce | Lists use the brand's tick-mark rule-line ornament instead of generic checkmark icons. |
| 17 | 3 pricing tiers | Not applicable | Not a paid product. Skip entirely. |
| 18 | No real product demos | Enforce | Inverted: the entry sequence and scenario previews must be the real, working experience — never a screenshot or staged mock standing in for it. |
| 19 | Soft corner radius | Enforce | Cap border-radius at 2px site-wide — near-sharp, matching the mark's square accent. No 12–24px "friendly SaaS" rounding anywhere. |
| 20 | Purple and black | Structurally impossible | No purple in the token set. |
| 21 | No skeleton loaders | Enforce | Inverted: build a real loading state — a subtle animated version of the rule-line ornament — for any scene with load time. Never a blank flash or a generic gray skeleton box. |
| 22 | Radial orbs | Structurally impossible | No blurred gradient-orb decorative background elements. |
| 23 | Dot grids | Structurally impossible | No decorative dot-grid textures. If a background texture is ever wanted, reference the logo's compass/tick motif, not a generic dot pattern. |
| 24 | Sparkle icons | Structurally impossible | No sparkle/magic-wand iconography anywhere, including near any future "smart" features. |
| 25 | Animated arrows | Enforce | Covered by Section 2's motion rule: an arrow moves only if the movement encodes a specific psychological beat. A bouncing "scroll down" arrow fails that test and is banned. |
| 26 | No TOS | Low priority | Add a real terms page before public launch. Not urgent for this animation layer. |
| 27 | No privacy policy | Low priority | Same as above — especially once any user progress is stored. |
| 28 | Hover animations | Enforce | Same test as #25: a hover state changes something only if it reveals real information or reflects a real state change (e.g. previewing a scenario's stage). Scale/glow/bounce-on-hover with no informational purpose is banned. |
| 29 | Neon colors | Structurally impossible | None of the 4 tokens are neon. |
| 30 | Basic pastel colors | Structurally impossible | None of the 4 tokens are pastel. The palette is deliberately warm/muted, not soft/candy. |

## 3.6.2 Pre-Ship Checklist

Run this against any phase before calling it done:

- [ ] Does every color on screen trace back to one of the 4 tokens?
- [ ] Does every icon look hand-drawn at the mark's stroke weight, not imported from a library?
- [ ] Does every animation, hover, and transition pass the "does this carry psychological meaning" test from Section 2?
- [ ] Is border-radius at or under 2px everywhere?
- [ ] Has the copy been scanned for em dashes and "it's not X, it's Y" constructions?
- [ ] Would this screen be indistinguishable from a template if the logo were swapped out? If yes, it isn't done yet.

---

# 3.7 DATA MODEL & SHARED CAMERA CONTRACT

Everything above describes what each scene should *look* like. This section describes how to make sure 25 separately-generated scenes actually *stay consistent* with each other in code — the camera grammar in Section 2 is only as reliable as the architecture that enforces it.

## 3.7.1 Response Archetypes

Rather than hand-coding camera behavior per scenario per choice, tag every choice (A/B/C/D, across all 25 scenarios) with one shared archetype. The camera/light rules attach to the archetype, not to the letter — so the grammar can't drift scenario to scenario the way it would if each scene's camera logic were written from scratch.

| Archetype | Typical meaning | Camera behavior |
|---|---|---|
| `reactive` | Impulsive, unregulated response | Hard cut, tight/shallow framing, fast |
| `avoidant` | Disengaging without resolving | Camera drifts away or fades without settling — no clean resolution beat |
| `clarifying` | Asks a question, gathers information | Eased dolly-out, depth of field opens |
| `regulated` | Deliberate, values-aligned response | Eased move, camera settles at a calm resting distance |

This is a proposed convention, not something already encoded in the original 25-scenario bible — reconcile it against each scenario's actual choice psychology as you tag them. In most of the per-scenario directives in Section 5, choice A already reads as `reactive` and C/D as `regulated`; that pattern generalizes, but verify per scenario rather than assuming.

## 3.7.2 Shared Camera Component

Build one reusable component that every scene calls, rather than 25 bespoke camera rigs:

```
<SceneCamera
  archetype={chosenResponseArchetype}   // 'reactive' | 'avoidant' | 'clarifying' | 'regulated'
  homeState={sceneRestingCameraState}   // this scene's calm default framing
  reducedMotion={userPrefersReducedMotion}
  onSettled={() => showConsequenceText()}
/>
```

`SceneCamera` owns the cut-vs-ease decision, the dolly direction, and the depth-of-field transition for a given archetype — individual scene components only supply their own geometry, lighting, and `homeState`. This is what actually guarantees Section 2's grammar holds across all 25 scenes instead of depending on 25 separate generations remembering the rule correctly.

## 3.7.3 Minimum Data Shapes

Concrete enough to hand to Emergent as-is; adjust field names to match whatever's already in the codebase.

```
Scenario {
  id, stageId, title, canonical: bool,
  psychologyTags: [string],
  choices: [
    { id, text, archetype, consequenceBeat, resultingCameraState }
  ]
}

UserProgress {
  sessionId | userId,
  completedScenarioIds: [string],
  choiceLog: { scenarioId: choiceId },
  currentStageId,
  lastVisitedAt
}
```

`resultingCameraState` on each choice is what lets `SceneCamera` know where to settle after the beat — keeping the "where does this scene end up" decision in data, not hardcoded per scene.

---

# 4. THE ENTRY SEQUENCE — "THRESHOLD"

## 4.1 Concept

Quietfield's whole thesis is:

> **You cannot always control what other people do. You can control how carefully you observe, interpret, communicate, and choose.**

The entry sequence should not be a logo reveal with music behind it. It should put the visitor through **one real round of Notice → Pause → Widen → Choose** before any navigation appears — so the site's lesson starts in the first eight seconds, not after the first scenario.

This draws on three well-established ideas from social psychology, used loosely as design principles rather than cited as claims:

- **Thin-slicing** — people form confident impressions from very brief, minimal exposure (Ambady & Rosenthal's research on snap judgments from short clips).
- **The fundamental attribution error** — the tendency to explain someone's behavior by their character before considering their situation.
- **Figure–ground reframing** (Gestalt perception) — what looks obvious in a tight frame can read completely differently once more of the scene is visible.

The sequence should **not resolve into a clean twist.** If it did, it would teach the opposite lesson — that there's a clever "correct" reading to find. It should end in comfortable, undramatic uncertainty, the same way several in-scenario correct answers are "not enough information yet."

## 4.2 Beat Structure (~8–11 seconds, always skippable)

| Beat | Time | What happens |
|---|---|---|
| 0 — Void | 0.0–0.8s | Dark, neutral field. No motion. Establishes stillness before any stimulus. |
| 1 — The Glimpse | 0.8–2.2s | A single abstracted, faceless humanoid figure appears close to camera, frozen mid-gesture — arm partly raised, deliberately ambiguous (reaching? waving? blocking?). Shallow depth of field, slightly low camera angle. |
| 2 — The Pause | 2.2–3.4s | All motion stops. Camera doesn't move. First text cue fades in, small and understated: **"PAUSE."** |
| 3 — The Widening | 3.4–6.0s | Slow, continuous dolly-out (never a cut) reveals the full scene — more figures, more context. Depth of field opens from shallow to deep across the move. The gesture is recontextualized but still not fully resolved. Second text cue: **"QUESTION."** |
| 4 — The Branch | 6.0–8.0s | Two or three faint, semi-transparent alternate versions of the scene ghost briefly over one another (light double-exposure), representing multiple plausible interpretations, then settle back into one grounded version. Third text cue: **"MORE THAN ONE STORY FITS."** |
| 5 — Resolution | 8.0–11s | Camera settles at a calm, symmetrical, slightly elevated resting position — this becomes the site's recurring "home" camera state. QUIETFIELD wordmark assembles quietly (no bounce, no pop-in — clarity arriving, not an ad dropping), followed by: **"OBSERVE. PAUSE. QUESTION. CONTEXTUALIZE. CHOOSE."** A small, calm "Enter" affordance fades in last. |

A **Skip** control is visible from Beat 0 onward. The sequence plays once per session, never auto-loops, and never re-triggers to recapture attention — consistent with a site whose subject is exactly the ethics of how attention and interpretation get used on people.

## 4.3 Agent-Ready Prompt (copy-paste as-is)

```
You are building the entry sequence for Quietfield, an interactive site that
teaches social observation and interpretation through 25 life-stage scenarios.
The site's core lesson: you can't control what others do, only how carefully
you observe, interpret, and choose. This entry sequence must demonstrate that
lesson in miniature before the visitor reaches any navigation — it is not a
logo animation, it is the first scenario.

STACK: Three.js (React Three Fiber if the codebase is React-based) with GSAP
or Framer Motion for timeline easing. If the existing site uses a different
stack, adapt to it — the beat structure and meaning below are what must be
preserved, not the specific libraries.

SEQUENCE (~8–11 seconds total, skip control visible throughout, plays once
per session, never auto-replays):

BEAT 0 (0.0–0.8s) — Void. Dark neutral field, no motion, no geometry yet.

BEAT 1 (0.8–2.2s) — A single abstracted, low-poly, faceless humanoid
appears close to camera, frozen mid-gesture, arm partially raised in a
genuinely ambiguous position (could read as reaching, waving, or blocking —
do not design it to lean toward any one reading). Shallow depth of field.
Camera slightly below eye level.

BEAT 2 (2.2–3.4s) — Everything stops. No camera movement. Fade in the first text cue,
small and understated: "PAUSE." Do not animate this cue in with bounce or
scale — a simple opacity fade only.

BEAT 3 (3.4–6.0s) — A single continuous eased dolly-out (never a hard cut)
reveals more of the scene: additional faceless figures and environment that
recontextualize the original gesture without fully resolving it. Depth of
field opens from shallow to deep over this beat. Fade in the second text cue: "QUESTION."

BEAT 4 (6.0–8.0s) — Briefly overlay two or three translucent, slightly
offset alternate versions of the scene (light double-exposure effect)
representing different plausible interpretations, then let them settle back
into one grounded version. Fade in the third text cue: "MORE THAN ONE STORY FITS."

BEAT 5 (8.0–11s) — Camera eases to a calm, symmetrical, slightly elevated
resting position — store this as the reusable "home" camera state for later
use elsewhere on the site. The QUIETFIELD wordmark assembles with a quiet,
non-bouncy reveal (simple fade/assemble, not a pop or spring). Below it,
fade in: "OBSERVE. PAUSE. QUESTION. CONTEXTUALIZE. CHOOSE." Then fade in a
small, calm "Enter" affordance — not a large or urgent-looking button.

REQUIREMENTS:
- A visible, always-clickable Skip control from Beat 0 onward, which jumps
  straight to the Beat 5 resting state.
- Respect prefers-reduced-motion: replace the dolly and double-exposure
  entirely with simple opacity crossfades between the same beats, same
  text timing, no camera movement.
- Play once per browser session only. Never auto-loop. Never re-trigger to
  recapture attention if the user has already seen it.
- No rendered facial detail on any figure — ambiguity is intentional, not a
  placeholder to be improved later.
- Target 60fps on mid-range mobile; keep geometry and lighting simple
  (one dynamic light, low poly counts, baked secondary light where possible).
- If WebGL is unavailable, fall back to a simple CSS/2D crossfade version
  carrying the same five text beats without the 3D scene.
- Color the sequence with the Musterfield Labs palette: `--qf-ink` #1E1E17
  background throughout, `--qf-cream` #EFE7DB for the figures and the five
  text beats, `--qf-tan` #848177 for the smaller "OBSERVE. PAUSE.
  QUESTION. CONTEXTUALIZE. CHOOSE." line. Reserve `--qf-rust` #904A30 for
  exactly one thing: a single point of emphasis at the very end of Beat 5
  (e.g. the small square accent inside the assembled M monogram, or the
  "Enter" affordance) — it should not appear anywhere earlier in the
  sequence. This mirrors how rust is used in the logo itself: one square,
  never a wash. This is a pause, not a reveal.
- Assemble the Beat 5 wordmark as the actual Musterfield/Quietfield mark:
  the M monogram with its rust square base-notch, the thin tan rule with
  end-ticks beneath it, then "QUIETFIELD" set the way "MUSTERFIELD LABS"
  is set in the source logo (bold cream small caps, letterspaced).
```

---

# 5. PER-SCENARIO 3D DIRECTIVES

## 5.1 Reusable Master Template

Fill this in with each scenario's directive block below, then paste to your agent.

```
You are implementing the 3D animation for one scenario on the Quietfield
website. Every animation in this system must answer one question: what
psychological information is this motion communicating? Never add motion
that doesn't carry meaning. Check every camera/light choice against the
site's 3D semantic table before implementing.

SCENARIO: {{SCENE_ID}} — "{{SCENE_TITLE}}" ({{LIFE_STAGE}})
STAGE MOTION LANGUAGE: {{STAGE_LANGUAGE}}
PSYCHOLOGICAL CONCEPTS IN THIS SCENE: {{PSYCH_CONCEPTS}}

CAMERA & DEPTH:
{{CAMERA_DIRECTIVE}}

LIGHT / ATMOSPHERE:
{{LIGHT_DIRECTIVE}}

KEY BEAT (where the user's choice visibly changes the scene):
{{KEY_BEAT}}

TECHNICAL REQUIREMENTS:
- Stack: Three.js / React Three Fiber (or match the site's existing 3D
  stack if one is already established).
- Characters: abstracted, low-poly, faceless humanoid forms. Ambiguity of
  expression is intentional — do not add facial detail.
- Rig grounded at the feet; no vertical-bounce breathing — use torso
  scale, shoulder rotation, head/gaze changes instead.
- Camera moves ease unless the stage language calls for a hard cut
  (impulse/reactivity) — keep the cut/ease distinction consistent with the
  rest of the site.
- Respect prefers-reduced-motion with instant crossfades that preserve the
  beat but remove the animation.
- 60fps target on mid-range mobile; one dynamic light max.
- Falls back to the existing 2D/SVG version of this scenario if 3D is
  unsupported or disabled.
- Each of the four response choices (A/B/C/D) gets its own short
  resolution beat within this same camera language.

Build as its own component/scene so it can be swapped in for this
scenario without touching the site's routing or state logic.
```

## 5.2 Stage Motion Languages (reference for `{{STAGE_LANGUAGE}}`)

- **Childhood — Impulse:** Fast, bouncy, abrupt. Hard cuts read as reactivity; the first eased move a scenario makes is the visual signal that the Observer paused.
- **School — Synchronization:** Repeated, simultaneous gestures across the group (particle/crowd convergence); independent judgment breaks the sync with a distinct move for one element.
- **College — Reciprocity:** Alternating shot/reverse-shot rhythm; camera distance opens gradually and only at the rate disclosure is actually reciprocated.
- **Office — Competition → Signal:** Overlapping, competing focal planes and rapid camera movement that resolve into a single clean rack-focus once clarity is reached — clarity arrives via focus-pull, not loudness.
- **Middle Age — Rhythm:** Slow, mostly locked-off camera, minimal cuts, warm natural light. Presence is expressed by the camera declining to perform.

## 5.3 Directive Blocks — Stage 1: Childhood (The Playground)

**Canonical — THE PLAYGROUND**
*(This scene lives in your original master spec, not the uploaded bible — align the beat below with its actual story once you have those details.)*
- Psych: possession, negotiation, group dynamics around a shared object.
- Camera: low, child's-eye-height tracking shot, quick whip-pans on moving objects, occasional hard cut on impulsive action.
- Light: bright, high-contrast midday sun, hard shadows.
- Beat: camera whips toward the disputed object, holds a beat of stillness on the pause, then eases (not cuts) into the outcome — the first scene to demonstrate the cut→ease grammar the rest of the site reuses.

**1A — THE BALL THAT DISAPPEARED**
- Psych: boundary-setting, ownership, escalation, clarification.
- Camera: ground-level whip-pan follows the ball's roll; snap-zoom as the group's attention lands on it.
- Light: flat, bright park light.
- Beat: hard cut on a grab (A); an eased dolly-in for C/D, settling at a respectful mid-distance from the group afterward — proximity as negotiated distance.

**1B — THE LAUGH**
- Psych: attribution, ambiguity, personalization, attentional bias.
- Camera: static wide two-shot on the laughing children; rack-focus to blur on the Observer during the freeze (shallow DOF = tunnel vision).
- Light: even classroom light, no dramatic shift.
- Beat: camera dollies out to reveal a second plausible cause of laughter off to the side — directly enacting "a wider frame changes an interpretation."

**1C — THE INVITATION**
- Psych: belonging, rejection sensitivity, direct communication, social uncertainty.
- Camera: slow orbit around the closed circle from outside it, Observer kept at the frame's edge.
- Light: soft overcast, neutral.
- Beat: on a direct request (C/D) the orbit eases inward and the circle's spacing widens slightly — no snap-cut, no magical instant acceptance.

**1D — THE TEACHER'S QUESTION**
- Psych: social inhibition, uncertainty, confidence, turn-taking.
- Camera: locked wide shot of the room, then a slow push-in on the Observer as silence lengthens.
- Light: deep focus throughout (nobody isolated) until the hand rises, then a soft rim light picks the Observer out.
- Beat: push-in speed is the tell — a fast push would read impulsive; this one is a deliberate crawl.

## 5.4 Directive Blocks — Stage 2: School (The Classroom)

**Canonical — THE CLASSROOM**
- Psych: groupthink, conformity.
- Camera: symmetrical, slightly elevated panoramic view exposing synchronized behavior at a glance.
- Light: even deep focus across all desks — conformity has no visual hierarchy.
- Beat: one desk's framing breaks alignment with subtle independent parallax when independent judgment occurs.

**2A — THE GROUP CHAT**
- Psych: conformity, online disinhibition, social proof, attribution error.
- Camera: fast vertical push toward a floating stack of message-cards multiplying and layering in depth as criticism escalates.
- Light: cold blue screen-glow.
- Beat: the Observer's own card enters late, on a different depth plane; a clarifying question decelerates and thins the stack.

**2B — THE POPULAR ANSWER**
- Psych: normative influence, informational influence, independent judgment.
- Camera: repeated, near-identical dolly-ins on each raised hand, edited to feel like an echo/loop.
- Light: even, undifferentiated.
- Beat: the echo breaks — one hand-raise gets a distinct orbit instead of the repeated dolly when independent reasoning or an evidence-question is chosen.

**2C — THE FRIEND WHO OVERSHARES**
- Psych: confidentiality, social boundaries, gossip, trust.
- Camera: a "whisper" tracking shot follows a soft glowing particle-trail from the friend toward the Observer, sharp against a soft background.
- Light: intimate, low-key.
- Beat: the trail shrinks and stops at the Observer rather than continuing outward — depth-based containment rather than a cut or a lecture.

**2D — THE PUBLIC MISTAKE**
- Psych: social threat, embarrassment, empathy, bystander behavior.
- Camera: quick multi-angle cuts across the laughing classmates, handheld energy.
- Light: the mistaken student compresses toward the background of the frame.
- Beat: cuts settle into one calm, steady mid-shot on the Observer, then a slow pan redirects toward the teacher/board — redirection, not lingering.

## 5.5 Directive Blocks — Stage 3: College (The Café)

**Canonical — THE CAFÉ**
- Psych: paced, reciprocal self-disclosure.
- Camera: classic shot/reverse-shot rhythm, each reverse slightly wider as trust builds.
- Light: warm, intimate café light.
- Beat: camera distance is the pacing meter — it only widens at the rate disclosure is reciprocated.

**3A — THE FIRST CONVERSATION**
- Psych: self-disclosure, reciprocity, impression formation.
- Camera: opens on a tight, closed two-shot; each reciprocal exchange eases the camera a few degrees further apart.
- Light: warm café light, gently brightening as the exchange balances.
- Beat: a monologue-style answer (A) plays as one uninterrupted long take with no reverse shot — visually there's no room for the other person; the reciprocal answer restores the rhythm.

**3B — THE UNANSWERED MESSAGE**
- Psych: uncertainty, rejection sensitivity, attribution, rumination.
- Camera: static shot on a foregrounded phone screen while background light shifts through a day/night cycle; Observer stays soft-focus behind it.
- Light: time-lapse shift, cool to warm.
- Beat: anxious follow-ups (A) snap the camera back to the phone each cycle; the regulated response (C/D) lets the phone recede out of focus as the Observer's own life sharpens instead.

**3C — THE PERSONAL QUESTION**
- Psych: boundaries, self-disclosure, trust, vulnerability.
- Camera: slow push-in matched to a translucent "disclosure" volume expanding between the two characters.
- Light: soft, with a visible glowing boundary plane at partial expansion.
- Beat: full immediate disclosure (A) blows the volume open with a fast dolly; a held boundary keeps the push-in gentle and incomplete.

**3D — THE PARTY CROWD**
- Psych: conformity, self-presentation, belonging, autonomy.
- Camera: begins embedded in a tightly synchronized, jostling crowd; glides out as the Observer disengages, settling on a calmer wide shot of a smaller secondary group.
- Light: crowd is saturated/strobing; secondary group is warm and steady.
- Beat: one continuous glide, no judgment cut between groups — leaving reads as redirection, not rejection.

## 5.6 Directive Blocks — Stage 4: Office (The Meeting Room)

**Canonical — THE MEETING ROOM**
- Psych: credit and recognition dynamics.
- Camera: multiple competing focal planes early (restless rack-focus across several sharp subjects), resolving into one clean rack-focus on whoever's contribution is finally credited.
- Light: even, then a single clarifying highlight.
- Beat: resolution is a focus-pull, not a cut — clarity arrives, it isn't announced.

**4A — THE INTERRUPTER**
- Psych: conversational dominance, turn-taking, assertiveness, status.
- Camera: two speech-volumes visually overlap and collide in the mid-ground; camera holds still, doesn't dodge.
- Light: neutral.
- Beat: on the deliberate response (C/D) the volumes separate onto distinct depth planes and a locked, unwavering camera axis represents steady eye contact.

**4B — THE EMAIL THAT SOUNDS COLD**
- Psych: ambiguity, threat perception, catastrophizing, uncertainty.
- Camera: environment edges compress inward (subtle vignette tightening) as anxiety builds.
- Light: cooling, narrowing.
- Beat: the regulated response (C/D) releases the vignette and pulls the camera back to normal field of view — the camera literally expanding as alternative explanations appear.

**4C — THE DISAGREEMENT**
- Psych: confirmation bias, motivated reasoning, conflict, epistemic humility.
- Camera: two proposal-objects face off across the frame on a collision trajectory, slow-motion micro-collision on contact.
- Light: neutral, then individually lit components as they separate.
- Beat: a clarifying question splits each proposal into separate, individually lit components floating apart — analysis replacing conflict.

**4D — THE MEETING GOES SILENT**
- Psych: pluralistic ignorance, social inhibition, uncertainty, psychological safety.
- Camera: locked static wide on the table; ambient motion (drifting dust, a ticking clock hand) keeps drifting so stillness doesn't read as a frozen frame.
- Light: neutral, steady.
- Beat: the Observer's gaze becomes the only camera motion (a slow pan) until one specific concern is raised, then a controlled, gentle push-in settles on the group's attention.

## 5.7 Directive Blocks — Stage 5: Middle Age (The Dinner Table)

**Canonical — THE DINNER TABLE**
- Psych: advice-giving, listening.
- Camera: almost entirely locked-off, wide, patient; any movement is a nearly imperceptible drift.
- Light: warm, low, natural — practicals (lamps, candles) rather than a rig look.
- Beat: presence is expressed by the camera's refusal to perform; stillness itself is the answer.

**5A — THE FAMILY ARGUMENT**
- Psych: triangulation, perspective-taking, conflict, active listening.
- Camera: two conversational "streams" (soft light trails) pull toward opposite frame edges with the Observer locked centered between them.
- Light: warm, low.
- Beat: the streams slow their pull-rate — not stop abruptly — as each person is heard in turn.

**5B — THE OLD STORY**
- Psych: identity, self-consciousness, social memory, boundaries.
- Camera: stays anchored on the present-day Observer throughout.
- Light: a soft, translucent, slightly desaturated memory-overlay appears near the Observer and dissolves.
- Beat: the overlay drifts through frame; the camera never chases it — the present stays grounded.

**5C — THE UNSOLICITED ADVICE**
- Psych: active listening, advice-giving, autonomy, support.
- Camera: three small solution-objects hover near the Observer at eye level.
- Light: warm, even.
- Beat: as the objects lower, focus and framing shift to widen around the speaker instead — attention visibly relocates, not just a cut.

**5D — THE SUCCESS QUESTION**
- Psych: social comparison, identity, meaning, self-evaluation, perspective-taking.
- Camera: environment's motion slows to near-stillness.
- Light: faint comparison-imagery flickers briefly at the frame's edges and fades.
- Beat: a slow, exhale-paced push-in on the Observer's posture relaxing, camera settling at the same height/distance held in the canonical Dinner Table scene — closing the loop on the full life-stage arc.

---

# 6. WORKED EXAMPLE — TEMPLATE FULLY ASSEMBLED

This is what Section 5.1's template looks like once filled in for scenario 1A, ready to paste straight to your agent:

```
You are implementing the 3D animation for one scenario on the Quietfield
website. Every animation in this system must answer one question: what
psychological information is this motion communicating? Never add motion
that doesn't carry meaning. Check every camera/light choice against the
site's 3D semantic table before implementing.

SCENARIO: 1A — "The Ball That Disappeared" (Childhood)
STAGE MOTION LANGUAGE: Fast, bouncy, abrupt. Hard cuts read as reactivity;
the first eased move a scenario makes is the visual signal that the
Observer paused.
PSYCHOLOGICAL CONCEPTS IN THIS SCENARIO: boundary-setting, ownership,
escalation, clarification.

CAMERA & DEPTH:
Ground-level whip-pan follows the ball's roll; snap-zoom as the group's
attention lands on it.

LIGHT / ATMOSPHERE:
Flat, bright park light, no dramatic shift.

KEY BEAT (where the user's choice visibly changes the scene):
A hard cut on a grab (choice A); an eased dolly-in for choices C/D,
settling at a respectful mid-distance from the group afterward — proximity
as negotiated distance.

TECHNICAL REQUIREMENTS:
- Stack: Three.js / React Three Fiber (or match the site's existing 3D
  stack if one is already established).
- Characters: abstracted, low-poly, faceless humanoid forms. Ambiguity of
  expression is intentional — do not add facial detail.
- Rig grounded at the feet; no vertical-bounce breathing — use torso
  scale, shoulder rotation, head/gaze changes instead.
- Camera moves ease unless the stage language calls for a hard cut
  (impulse/reactivity) — keep the cut/ease distinction consistent with the
  rest of the site.
- Respect prefers-reduced-motion with instant crossfades that preserve the
  beat but remove the animation.
- 60fps target on mid-range mobile; one dynamic light max.
- Falls back to the existing 2D/SVG version of this scenario if 3D is
  unsupported or disabled.
- Each of the four response choices (A/B/C/D) gets its own short
  resolution beat within this same camera language.

Build as its own component/scene so it can be swapped in for this
scenario without touching the site's routing or state logic.
```

Repeat this assembly for each of the 24 remaining scenarios using their directive blocks in Section 5.

---

# 7. INTEGRATION & QA NOTES

- **Progressive enhancement order:** 2D/SVG system first (already fully specified in the original bible), 3D layered on top scene-by-scene as it's built — the site should never be blocked on all 25 3D scenes being finished at once.
- **Consistency check before shipping any scene:** does every camera move, light change, and depth cue map to something in the Section 2 semantic table? If a move exists "because it looks good," cut it — this mirrors the original bible's own rule (Section 12): never add motion simply because the page feels empty.
- **Accessibility:** `prefers-reduced-motion` fallback and the entry sequence's Skip control are not optional extras — build them alongside the primary experience, not after.
- **Cross-scenario grammar:** the cut = impulse / ease = deliberation rule and the dolly-in = narrowing / dolly-out = widening rule must stay identical across all 25 scenes and the entry sequence. If any single scene breaks this pattern, the whole system stops teaching anything — it just becomes a nice-looking website.

---

# 7.5 PRE-LAUNCH CHECKLIST (19-POINT PASS)

Run this once the 3D layer is functionally complete. Status vocabulary: **Enforce** (required) · **Conditional** (required only if the stated condition is met) · **Not applicable** (no action). Nuance lives in the Note column.

| # | Item | Status | Note |
|---|---|---|---|
| 1 | Internal links | Enforce | Every scenario links to its life-stage index and at least one related scenario — orientation and SEO in one move. |
| 2 | Custom 404 page | Enforce | On-brand (ink/cream/rust), in the site's restrained voice — not a generic "oops" page. |
| 3 | Breadcrumbs | Enforce | Stage > Scenario trail, styled with the brand's thin-rule motif rather than a default breadcrumb component. |
| 4 | CTA above the fold | Enforce | The entry sequence's "Enter" affordance already serves this — confirm it's visible without scrolling once Beat 5 resolves. |
| 5 | FAQs | Conditional | A short "how this works" explainer is worth having; keep it in the site's actual voice, not a generic corporate FAQ block. |
| 6 | Thank-you / completion page | Enforce | A reflective closing screen after all 25 scenarios, tying to Section 8's closing line — not a generic "thanks for visiting." |
| 7 | Alt text on images | Enforce | Every character/scene illustration and the 2D/SVG fallback, not just the 3D layer. |
| 8 | Real reviews | Not applicable | No testimonials planned (matches 3.6, item 12) — skip unless real feedback exists later. |
| 9 | Unique page titles | Enforce | Distinct `<title>` per scenario, e.g. "The Ball That Disappeared — Quietfield." |
| 10 | Navigation bar | Enforce | Minimal, respecting 3.6's guardrails — a narrative path, not a SaaS-style menu. |
| 11 | Site analytics | Conditional | Fine to add, privacy-respecting only — turning this on is what makes item 16 below non-optional. |
| 12 | Team photo | Enforce | Reframed: Musterfield Labs is solo — an "about the maker" note/photo fits better than a generic team photo. |
| 13 | RLS on all endpoints | Conditional | If user progress or accounts are stored, row-level access control is required, not optional. |
| 14 | SEO optimization | Enforce | Covered by items 1, 3, and 9 together — no separate action needed beyond those three. |
| 15 | Waitlist page | Not applicable | Nothing here is gated — skip. |
| 16 | Cookie consent | Conditional | Only needed if analytics/cookies are added — see item 11. |
| 17 | About page | Enforce | Studio credit ("A Musterfield Labs project") plus the site's actual framing — same tone rules as everywhere else. |
| 18 | Contact page | Enforce | Minimal, on-brand. |
| 19 | Site favicon | Enforce | The M-monogram with its rust base-notch — check it at actual 16×16 size, most detail will disappear there and it shouldn't turn to mud. |

---

# 8. CLOSING

The 2D bible ends on:

> **You cannot always control what other people do. You can control how carefully you observe, interpret, communicate, and choose.**

The 3D layer's job is to make sure the very first thing a visitor experiences — before any scenario, any choice, any UI — is already an example of that sentence, not just a statement of it.

---

# 9. AMENDMENT A — 2026-08-27 (STUDIO-APPROVED OVERRIDES & 3D PARAMETERS)

Recorded during the 3D visual-polish pass, with the studio's explicit approval. These values are locked in code (`site/src/three/`, `site/src/lib/tokens.ts`) and enforced by tests.

## A.1 Glassmorphism override

- §3.6.1 #8 (liquid glass / glassmorphism "structurally impossible") is **overridden** for a defined, narrow set of UI surfaces: home stage cards, scenario/stage page headers, and interactive choice cards.
- The override is **token-derived**: fill = ink at 65% alpha, border = cream at 8% alpha, hover border brightening = cream at 32%, blur 12px. Corners remain capped at 2px (guardrail #19 intact).
- Pure white remains banned (guardrail #3 intact): the border uses cream, never `rgba(255,255,255,…)`. No color outside the four tokens ships (guardrail #4 intact).
- Hover border brightening is informational (it previews the response being considered) and satisfies #28.

## A.2 3D material & lighting parameters (locked)

- **Heads:** `SphereGeometry(r, 64, 64)`, `flatShading: false` — no visible polygon facets.
- **Figures:** `MeshStandardMaterial` with `roughness: 0.6`, `metalness: 0.08` (tactile matte ceramic). Highlight roll-off comes from ACES + exposure 0.85 + broad roughness + a moderate key intensity; blown-out white silhouettes are prevented by construction.
- **Renderer:** `ACESFilmicToneMapping`, `toneMappingExposure = 0.85`, `PCFSoftShadowMap`.
- **Fog:** `FogExp2(ink #1E1E17, 0.04)` — token-derived. The reference value `0x0e1117` was replaced by ink to honor #4.
- **Rig:** ambient fill `0.35` (static, no shadow) · directional key with soft PCF shadows (the warm cream light) · cold tan-tinted rim/backlight `0.6` (static, no shadow). The §3 "one dynamic light" budget is read as **one shadow-casting light** (the key); ambient and rim are static fills in the spirit of "bake or fake secondary lighting."
- **Framing:** the home camera is elevated and looks gently down, keeping all figures and tables in the upper 55–60% of the viewport. Clearance is structural: scene frame, context copy, and choice cards stack in normal document flow and never overlap.

## A.3 Motion language (GSAP curves, added to §2's medium-specific bindings)

- `power3.inOut` (camera position AND target transitions) = deliberation/regulation — the eased move.
- Instant `gsap.set` = impulse/reactivity — the hard cut, meaning unchanged.
- `power2.out` = responsive preview and head-turn (hover states, informational only, §3.6.1 #28).
- `sine.inOut` idle loops = living presence: breathing via torso scale + micro head tilt. Vertical bounce stays banned (§3).
- All of the above are disabled or replaced with instant crossfades under `prefers-reduced-motion`, per §3.

## A.4 3D stage sets

One 3D stage set per life stage (playground, classroom, café, meeting room, dinner table), shared by all 25 scenarios. The 2D/SVG scenes remain the WebGL-unsupported and reduced-motion fallback path (§1). Figures stay abstracted, low-poly, and faceless (§3). The rust candle in the dinner-table set is the stage's single permitted rust accent.
