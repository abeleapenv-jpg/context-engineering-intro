import raw from '../data/scenarios.json';

/*
 * Scenario data access (master plan section 5: scenarios.json is static
 * content; progress and choices live in the database).
 */

export const SCENARIOS = raw;

export const STAGES = [
  { id: 'childhood', name: 'Childhood', numeral: 'I' },
  { id: 'school', name: 'School', numeral: 'II' },
  { id: 'college', name: 'College', numeral: 'III' },
  { id: 'office', name: 'Office', numeral: 'IV' },
  { id: 'middle-age', name: 'Middle Age', numeral: 'V' },
];

export const TOTAL = SCENARIOS.length;

export const FIVE_STEPS = 'OBSERVE. PAUSE. QUESTION. CONTEXTUALIZE. CHOOSE.';

export const CLOSING_LINE =
  'You cannot always control what other people do. You can control how carefully you observe, interpret, communicate, and choose.';

export function scenarioById(id) {
  return SCENARIOS.find((s) => s.id === id) ?? null;
}

export function scenariosForStage(stageId) {
  return SCENARIOS.filter((s) => s.life_stage === stageId);
}

export function stageById(stageId) {
  return STAGES.find((s) => s.id === stageId) ?? null;
}

/** Array order is the canonical walk order (1A .. 5E). */
export function nextScenarioId(id) {
  const i = SCENARIOS.findIndex((s) => s.id === id);
  if (i === -1 || i + 1 >= SCENARIOS.length) return null;
  return SCENARIOS[i + 1].id;
}

/**
 * First scenario in canonical order that is not in the completed set.
 * Null means every scenario is complete (master plan section 7, task 7).
 */
export function firstUncompletedId(completedIds) {
  const done = new Set(completedIds);
  return SCENARIOS.find((s) => !done.has(s.id))?.id ?? null;
}

/** Choice lookup that fails soft: unknown ids resolve to null, never throw. */
export function choiceByKey(scenario, key) {
  return scenario?.choices.find((c) => c.key === key) ?? null;
}

/**
 * Field Notes pattern sentence (master plan section 10): the most frequent
 * choice archetype across the walk, phrased as an observation, not a score.
 */
const ARCHETYPE_NOTES = {
  reactive: 'Across the field, you often moved first and learned from contact.',
  avoidant: 'Across the field, you often stepped back, and watched the cost arrive later.',
  clarifying: 'Across the field, you often asked before concluding; the question did most of the work.',
  regulated: 'Across the field, you often held the pause, and let it carry the weight.',
};

export function fieldNotesSentence(archetypeCounts) {
  const entries = Object.entries(archetypeCounts).filter(([, n]) => n > 0);
  if (entries.length === 0) return null;
  entries.sort((a, b) => b[1] - a[1]);
  return ARCHETYPE_NOTES[entries[0][0]] ?? null;
}
