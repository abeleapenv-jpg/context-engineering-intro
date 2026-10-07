/*
 * Data integrity check for src/data/scenarios.json (npm run verify:data).
 * Guards the master plan's content model: 25 scenarios, five per life stage,
 * four choices each (A-D), real alt text, exact image_path naming, and a
 * matching illustration file in public/assets/images.
 */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const STAGES = ['childhood', 'school', 'college', 'office', 'middle-age'];
const ARCHETYPES = ['reactive', 'avoidant', 'clarifying', 'regulated'];

const raw = JSON.parse(await readFile(path.join(root, 'src/data/scenarios.json'), 'utf8'));

const errors = [];
const warnings = [];

if (raw.length !== 25) errors.push(`expected 25 scenarios, found ${raw.length}`);

const ids = new Set();
const paths = new Set();
const perStage = Object.fromEntries(STAGES.map((s) => [s, 0]));

for (const s of raw) {
  const where = `scenario ${s.id ?? '(missing id)'}`;
  if (!s.id || !/^[1-5][A-E]$/.test(s.id)) errors.push(`${where}: id must match [1-5][A-E]`);
  if (ids.has(s.id)) errors.push(`${where}: duplicate id`);
  ids.add(s.id);

  if (!STAGES.includes(s.life_stage)) errors.push(`${where}: unknown life_stage "${s.life_stage}"`);
  else perStage[s.life_stage] += 1;

  if (!s.title) errors.push(`${where}: missing title`);
  if (!s.prompt || s.prompt.length < 20) errors.push(`${where}: prompt too short`);

  const slug = String(s.title)
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const expectedPath = `/assets/images/${s.id}-${slug}.png`;
  if (s.image_path !== expectedPath) {
    errors.push(`${where}: image_path "${s.image_path}" should be "${expectedPath}"`);
  }
  if (paths.has(s.image_path)) errors.push(`${where}: duplicate image_path`);
  paths.add(s.image_path);

  if (!existsSync(path.join(root, 'public', s.image_path))) {
    warnings.push(`${where}: illustration missing at public${s.image_path}`);
  }

  if (!s.image_alt || s.image_alt.length < 60) {
    errors.push(`${where}: image_alt must describe the social situation (60+ chars)`);
  }

  if (!Array.isArray(s.choices) || s.choices.length !== 4) {
    errors.push(`${where}: expected exactly 4 choices`);
    continue;
  }
  s.choices.forEach((c, i) => {
    const expectedKey = 'ABCD'[i];
    if (c.key !== expectedKey) errors.push(`${where}: choice ${i} key should be ${expectedKey}`);
    if (!c.text) errors.push(`${where}: choice ${c.key} missing text`);
    if (!c.resolution || c.resolution.length < 20) errors.push(`${where}: choice ${c.key} resolution too short`);
    if (!ARCHETYPES.includes(c.archetype)) errors.push(`${where}: choice ${c.key} bad archetype "${c.archetype}"`);
  });
}

for (const stage of STAGES) {
  if (perStage[stage] !== 5) errors.push(`life stage ${stage}: expected 5 scenarios, found ${perStage[stage]}`);
}

for (const w of warnings) console.warn(`WARN  ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`FAIL  ${e}`);
  process.exit(1);
}
console.log(`OK    25 scenarios valid · ${warnings.length} illustration warning(s)`);
