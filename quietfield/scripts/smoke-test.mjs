/*
 * Quietfield end-to-end journey smoke test (dev-only tool, never shipped).
 *
 * Renders the REAL production bundle (dist/) in a jsdom browser environment
 * and walks the full first-visitor journey:
 *
 *   Home -> Begin -> 1A .. 5E (read, choose, resolution, Continue) -> /done
 *   -> 404 route -> stage index -> Home completion state
 *
 * Fails on: any unexpected console/runtime error, a missing scenario, a
 * missing choice/resolution/Continue, wrong next-scenario navigation, or a
 * wrong final progress count.
 *
 * Run: npm run build && npm run smoke
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { JSDOM, VirtualConsole } from 'jsdom';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const distAssets = path.join(root, 'dist', 'assets');
const bundle = readdirSync(distAssets).find((f) => /^index-.*\.js$/.test(f));
if (!bundle) throw new Error('no production bundle in dist/ — run npm run build first');
const scenarios = JSON.parse(readFileSync(path.join(root, 'src/data/scenarios.json'), 'utf8'));
// Display names mirror STAGES in src/lib/scenarios.js (dev script, kept local).
const STAGE_NAMES = {
  childhood: 'Childhood',
  school: 'School',
  college: 'College',
  office: 'Office',
  'middle-age': 'Middle Age',
};

const unexpected = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => {
  const msg = String(e?.message ?? e);
  if (!/not implemented/i.test(msg)) unexpected.push(`jsdomError: ${msg}`);
});
vc.on('error', (m) => {
  const msg = String(m);
  // React logs act() advice via console.error in non-act environments; that
  // is test-environment noise, not a site bug. Everything else fails the run.
  if (/act\(|Warning: An update to|defaultProps/i.test(msg)) return;
  unexpected.push(`console.error: ${msg}`);
});
vc.on('warn', () => {});
vc.on('log', () => {});

const dom = new JSDOM('<!doctype html><html lang="en"><head></head><body><div id="root"></div></body></html>', {
  url: 'https://quietfield.test/',
  pretendToBeVisual: true,
  runScripts: 'outside-only',
  virtualConsole: vc,
});
const w = dom.window;
w.scrollTo = () => {}; // jsdom does not implement scrolling; the app only resets it

// Expose the browser globals the bundle expects.
const globals = {
  window: w,
  document: w.document,
  localStorage: w.localStorage,
  location: w.location,
  history: w.history,
  HTMLElement: w.HTMLElement,
  HTMLInputElement: w.HTMLInputElement,
  HTMLTextAreaElement: w.HTMLTextAreaElement,
  Element: w.Element,
  Node: w.Node,
  Text: w.Text,
  Comment: w.Comment,
  Document: w.Document,
  DocumentFragment: w.DocumentFragment,
  Window: w.Window,
  SVGElement: w.SVGElement,
  MutationObserver: w.MutationObserver,
  KeyboardEvent: w.KeyboardEvent,
  Event: w.Event,
  CustomEvent: w.CustomEvent,
  MouseEvent: w.MouseEvent,
  getComputedStyle: w.getComputedStyle.bind(w),
  requestAnimationFrame: w.requestAnimationFrame?.bind(w) ?? ((cb) => setTimeout(cb, 16)),
  cancelAnimationFrame: w.cancelAnimationFrame?.bind(w) ?? clearTimeout,
};
for (const [k, v] of Object.entries(globals)) {
  Object.defineProperty(globalThis, k, { value: v, configurable: true, writable: true });
}
Object.defineProperty(globalThis, 'navigator', { value: w.navigator, configurable: true });
w.addEventListener('error', (e) => unexpected.push(`window error: ${e.message}`));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const bodyText = () => w.document.body.textContent || '';
const q = (s) => w.document.querySelector(s);
const qa = (s) => [...w.document.querySelectorAll(s)];
/** Poll until fn() is truthy (avoids fixed-sleep flakes under load). */
async function waitFor(fn, timeout = 5000, step = 100) {
  const start = Date.now();
  for (;;) {
    const v = fn();
    if (v) return v;
    if (Date.now() - start > timeout) return null;
    await sleep(step);
  }
}
async function go(hash) {
  w.location.hash = hash;
  await sleep(200);
}
async function click(el) {
  el.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true, view: w }));
  await sleep(80);
}
const fail = (msg) => {
  console.error(`FAIL  ${msg}`);
  process.exit(1);
};
const ok = (msg) => console.log(`ok    ${msg}`);

await import(pathToFileURL(path.join(distAssets, bundle)).href);
await sleep(400); // boot: session check + field load

// ---------------------------------------------------- pre-journey guards
// Skipping: visiting a scenario and leaving without choosing must record
// nothing (the walk is never a gate).
await go('#/scenario/3A');
if (!bodyText().includes('The Cafe')) fail('skip check: 3A did not render');
if (!bodyText().includes(`0 OF ${scenarios.length} EXPLORED`))
  fail('skip check: exploration counter missing or wrong at 0');
await go('#/about');
const skipStore = JSON.parse(
  w.localStorage.getItem('quietfield:field:v1') ?? '{"progress":[],"choices":[]}',
);
if ((skipStore.progress ?? []).length !== 0 || (skipStore.choices ?? []).length !== 0)
  fail('skip check: navigating away without choosing recorded something');
await go('#/');
ok('skipping a scenario records nothing; counter reads 0 OF 25 on first visit');

// ------------------------------------------------------------------ journey
// 1. Home, as a brand-new visitor.
let t = bodyText();
for (const s of ['OBSERVE. PAUSE. QUESTION. CONTEXTUALIZE. CHOOSE.', 'A Masterfield Labs project', 'Begin']) {
  if (!t.includes(s)) fail(`home is missing expected text: "${s}"`);
}
ok('home renders: five steps, studio credit, Begin card');

// 2. Begin -> first scenario, then walk all 25 in order.
await go('#/scenario/1A');
for (let i = 0; i < scenarios.length; i++) {
  const sc = scenarios[i];
  t = bodyText();
  if (!t.includes(sc.title)) fail(`scenario ${sc.id}: title "${sc.title}" not rendered`);
  if (!t.includes(sc.prompt.slice(0, 40))) fail(`scenario ${sc.id}: prompt not rendered`);
  if (!t.includes(`SCENARIO ${sc.id}`)) fail(`scenario ${sc.id}: archival tag missing`);
  const buttons = qa('button');
  const choices = buttons.filter((b) => b.textContent.includes(sc.choices[0].text.slice(0, 12)) || /^[1-4]/.test(b.textContent.trim()));
  if (choices.length !== 4) fail(`scenario ${sc.id}: expected 4 choice buttons, found ${choices.length}`);

  // 3. Make a choice (the second option every time). The second click of a
  // rapid double-click must be a no-op (no double counting).
  const chosen = sc.choices[1];
  choices[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  choices[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const cont = await waitFor(
    () =>
      bodyText().includes('RESOLUTION // CHOICE') &&
      bodyText().includes(chosen.resolution.slice(0, 40)) &&
      qa('button').filter((b) => /Continue|Finish the walk/.test(b.textContent)).at(-1),
  );
  if (!cont) fail(`scenario ${sc.id}: resolution or Continue button missing after choice`);
  // Progressive disclosure a11y: the chosen trigger is expanded and points at
  // the outcome region; the region exists and carries the resolution.
  const selectedBtn = qa('button').find((b) => b.getAttribute('aria-expanded') === 'true');
  if (!selectedBtn) fail(`scenario ${sc.id}: no button exposes aria-expanded="true" after reveal`);
  const regionId = selectedBtn?.getAttribute('aria-controls');
  if (!regionId || !w.document.getElementById(regionId))
    fail(`scenario ${sc.id}: aria-controls does not resolve to the outcome region`);

  // 4. Continue -> correct next destination. Closing out one of stages I-IV
  // detours through the stage-complete interstitial first; its Continue
  // lands on the same next scenario the walk would have gone to.
  await click(cont);
  await sleep(300);
  if (i < scenarios.length - 1) {
    const next = scenarios[i + 1];
    const stage = sc.life_stage;
    const closesStage = next.life_stage !== stage && stage !== scenarios[scenarios.length - 1].life_stage;
    if (closesStage) {
      const inter = `#/stage/${stage}/complete`;
      if (w.location.hash !== inter)
        fail(`after ${sc.id}: expected ${inter}, landed on ${w.location.hash}`);
      if (!bodyText().includes(`The ${STAGE_NAMES[stage]} is walked`))
        fail(`interstitial after ${sc.id}: heading text missing`);
      if (!bodyText().includes('STAGE ') || !bodyText().includes('COMPLETE //'))
        fail(`interstitial after ${sc.id}: stage label missing`);
      const interCont = await waitFor(() =>
        qa('button').filter((b) => /Continue|Finish the walk/.test(b.textContent)).at(-1),
      );
      if (!interCont) fail(`interstitial after ${sc.id}: Continue button missing`);
      await click(interCont);
      await sleep(300);
    }
    const want = `#/scenario/${next.id}`;
    if (w.location.hash !== want)
      fail(`after ${sc.id}: expected ${want}, landed on ${w.location.hash}`);
  }
}
ok('all 25 scenarios: title, prompt, archival tag, 4 choices, resolution, Continue, next-route chain');

// 5. Completion.
t = bodyText();
if (!t.includes('The field is quiet')) fail('completion page did not render after 5E');
const stored = JSON.parse(w.localStorage.getItem('quietfield:field:v1') ?? '{"progress":[]}');
if (stored.progress.length !== 25) fail(`expected 25 stored decisions, found ${stored.progress.length}`);
const uniqueDone = new Set(stored.progress.map((r) => r.scenario_id));
if (uniqueDone.size !== 25)
  fail(`double-count: ${stored.progress.length} rows for ${uniqueDone.size} scenarios`);
ok(`completion page renders; ${stored.progress.length} of 25 decisions persisted, no duplicates`);

// 5b. The exploration counter reflects the full walk on a scenario screen.
await go('#/scenario/1A');
if (!bodyText().includes(`25 OF ${scenarios.length} EXPLORED`))
  fail('exploration counter does not read 25 OF 25 after the full walk');
ok('exploration counter reads 25 OF 25 after the walk');

// 6. 404.
await go('#/no-such-page');
t = bodyText();
if (!t.includes('This corner of the field is empty')) fail('404 page did not render for an unknown route');
ok('unknown route renders the on-brand 404 page');

// 7. Stage index + progress counts after a full walk.
await go('#/stage/childhood');
t = bodyText();
if (!t.includes('LIFE STAGE I OF V')) fail('stage index header missing');
if (!t.includes('5 OF 5')) fail('stage progress count wrong after full walk (expected 5 OF 5)');
ok('stage index renders with correct completed count');

// 8. Home reflects completion.
await go('#/');
t = bodyText();
if (!t.includes('COMPLETE // 25 OF 25')) fail('home does not reflect the completed field');
ok('home shows the completed-field state (25 of 25)');

// ------------------------------------------- Phase 3: walk it together
// No invitation was ever stored during the journey above: nothing about
// the walk may change, and a resolution screen must not show THEY CHOSE.
if (w.localStorage.getItem('quietfield:compare:v1') !== null)
  fail('phase 3: a compare code exists without any invitation being opened');
await go('#/scenario/1A');
if (!(await waitFor(() => bodyText().includes('RESOLUTION // CHOICE'))))
  fail('phase 3: 1A revisit did not render its resolution');
if (bodyText().includes('THEY CHOSE'))
  fail('phase 3: THEY CHOSE rendered with no invitation stored');
ok('no invitation stored: resolutions carry no THEY CHOSE (Phase 2 behavior)');

// A valid invitation renders the compare page; viewing saves nothing. The
// journey above left the field at 25 of 25, so the primary action reads
// Continue here; the Begin label is asserted below after the field clear.
const inviteCode = 'A'.repeat(25);
await go(`#/compare/${inviteCode}`);
t = bodyText();
if (!t.includes('A WALK TO COMPARE')) fail('compare page: A WALK TO COMPARE missing');
if (!t.includes('Someone walked the field before you')) fail('compare page: heading missing');
if (!t.includes('THEY WALKED 25 OF 25')) fail('compare page: inviter count missing');
if (!qa('button').some((b) => b.textContent.trim() === 'Continue'))
  fail('compare page: Continue action missing for a completed field');
if (w.localStorage.getItem('quietfield:compare:v1') !== null)
  fail('compare page: viewing saved the code (saving must happen on click only)');
ok('valid invitation renders the compare page (Continue for a finished field); nothing saved by viewing');

// A cut-off code gets the incomplete page, never the valid one.
await go('#/compare/ABC');
t = bodyText();
if (!t.includes('THIS LINK IS INCOMPLETE')) fail('compare page: short code must show THIS LINK IS INCOMPLETE');
if (t.includes('A WALK TO COMPARE')) fail('compare page: short code rendered the valid invitation');
ok('invalid code renders INVITATION // THIS LINK IS INCOMPLETE');

// Fresh walk behind an invitation: clear the field through the app's own
// profile control (also refreshes the in-memory field), Begin, walk 1A.
await go('#/profile');
const clearField = qa('button').find((b) => b.textContent.includes("Clear this browser's field"));
if (!clearField) fail('phase 3: clear-field button missing on profile');
await click(clearField);
if (!(await waitFor(() => w.localStorage.getItem('quietfield:field:v1') === null)))
  fail('phase 3: field storage was not cleared');
ok('field cleared through the profile page');

await go(`#/compare/${inviteCode}`);
const beginWalk = await waitFor(() =>
  qa('button').find((b) => b.textContent.trim() === 'Begin'),
);
if (!beginWalk) fail('compare page: Begin missing after clearing the field');
await click(beginWalk);
await sleep(300);
if (w.location.hash !== '#/scenario/1A')
  fail(`compare Begin: expected #/scenario/1A, landed on ${w.location.hash}`);
if (w.localStorage.getItem('quietfield:compare:v1') !== inviteCode)
  fail('compare Begin: invitation code not saved on click');
ok('Begin saves the invitation and lands on #/scenario/1A');

// The resolution now shows what the inviter chose (they chose A; we pick B).
const invited = scenarios[0];
const invitedBtns = qa('button').filter(
  (b) =>
    b.textContent.includes(invited.choices[0].text.slice(0, 12)) ||
    /^[1-4]/.test(b.textContent.trim()),
);
if (invitedBtns.length !== 4) fail(`invitation walk: expected 4 choice buttons, found ${invitedBtns.length}`);
invitedBtns[1].dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
if (!(await waitFor(() => bodyText().includes('RESOLUTION // CHOICE'))))
  fail('invitation walk: resolution missing after choice');
t = bodyText();
if (!t.includes('THEY CHOSE // A')) fail('invitation walk: THEY CHOSE // A missing');
if (!t.includes('· A DIFFERENT PATH')) fail('invitation walk: different-path marker missing');
if (!t.includes(invited.choices[0].text)) fail('invitation walk: the inviter choice text missing');
if (!(await waitFor(() => bodyText().includes('1 OF 25 EXPLORED'))))
  fail('invitation walk: exploration counter did not update');
ok('invitation walk: resolution shows THEY CHOSE // A and their choice text');

// Together: only the one shared scenario, spoiler-safe.
await go('#/together');
await sleep(300);
t = bodyText();
if (!t.includes('WHERE YOU DIFFERED')) fail('together: WHERE YOU DIFFERED missing');
if (!t.includes('Two readings of the same field')) fail('together: heading missing');
if (!t.includes('On the 1 situations you have both walked')) fail('together: summary count wrong');
if (!t.includes('same path 0 times')) fail('together: same count wrong');
if (!t.includes('a different one 1 times')) fail('together: different count wrong');
if (!t.includes(invited.title)) fail('together: the shared scenario row missing');
if (t.includes(scenarios[5].title)) fail('together: an unwalked scenario leaked (spoiler)');
if (!t.includes('24 situations still unread by you')) fail('together: hidden-count line missing');
const continueTogether = qa('a').find((a) => a.textContent.trim() === 'Continue the walk');
if (!continueTogether || continueTogether.getAttribute('href') !== '#/scenario/1B')
  fail('together: Continue the walk link missing or wrong');
ok('together: one shared scenario, spoilers hidden, Continue the walk to 1B');

// Stop comparing clears the invitation and returns home.
const stopCompare = qa('button').find((b) => b.textContent.trim() === 'Stop comparing');
if (!stopCompare) fail('together: Stop comparing missing');
await click(stopCompare);
await sleep(300);
if (w.location.hash !== '#/') fail(`stop comparing: expected #/, landed on ${w.location.hash}`);
if (w.localStorage.getItem('quietfield:compare:v1') !== null)
  fail('stop comparing: invitation code not cleared');
ok('stop comparing clears the invitation and returns to the field');

// -------------------------------------------------------------------- result
if (unexpected.length) {
  for (const e of unexpected) console.error(`FAIL  ${e}`);
  process.exit(1);
}
console.log('PASS  full visitor journey green, no unexpected console or runtime errors');
