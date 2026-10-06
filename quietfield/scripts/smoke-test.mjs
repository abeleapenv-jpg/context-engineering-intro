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

  // 3. Make a choice (the second option every time).
  const chosen = sc.choices[1];
  await click(choices[1]);
  const cont = await waitFor(
    () =>
      bodyText().includes('RESOLUTION // CHOICE') &&
      bodyText().includes(chosen.resolution.slice(0, 40)) &&
      qa('button').filter((b) => /Continue|Finish the walk/.test(b.textContent)).at(-1),
  );
  if (!cont) fail(`scenario ${sc.id}: resolution or Continue button missing after choice`);

  // 4. Continue -> correct next destination.
  await click(cont);
  await sleep(300);
  if (i < scenarios.length - 1) {
    const want = `#/scenario/${scenarios[i + 1].id}`;
    if (w.location.hash !== want) fail(`after ${sc.id}: expected ${want}, landed on ${w.location.hash}`);
  }
}
ok('all 25 scenarios: title, prompt, archival tag, 4 choices, resolution, Continue, next-route chain');

// 5. Completion.
t = bodyText();
if (!t.includes('The field is quiet')) fail('completion page did not render after 5E');
const stored = JSON.parse(w.localStorage.getItem('quietfield:field:v1') ?? '{"progress":[]}');
if (stored.progress.length !== 25) fail(`expected 25 stored decisions, found ${stored.progress.length}`);
ok(`completion page renders; ${stored.progress.length} of 25 decisions persisted`);

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

// -------------------------------------------------------------------- result
if (unexpected.length) {
  for (const e of unexpected) console.error(`FAIL  ${e}`);
  process.exit(1);
}
console.log('PASS  full visitor journey green, no unexpected console or runtime errors');
