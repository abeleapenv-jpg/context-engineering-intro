import { supabase, SUPABASE_CONFIGURED } from './supabaseClient';
import { SCENARIOS } from './scenarios';

/*
 * Progress + choices adapter (master plan section 5 data model, section 7
 * tasks 6-7).
 *
 * Supabase mode (when env vars are set and a session exists):
 *   - `progress` upsert targets (user_id, scenario_id) - the unique
 *     constraint, not the primary key - so replays update instead of
 *     silently inserting duplicates (the bug fixed in master plan task 7).
 *   - `choices_made` upserts the same way, keeping the latest choice per
 *     scenario for the Field Notes summary.
 *
 * Local mode (no Supabase env or no session): the same shape is persisted to
 * localStorage under one key, so the walk survives refresh and the swap to a
 * real project changes configuration, not application logic.
 */

const LS_KEY = 'quietfield:field:v1';

function readLocal() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LS_KEY) ?? '{}');
    return {
      progress: Array.isArray(parsed.progress) ? parsed.progress : [],
      choices: Array.isArray(parsed.choices) ? parsed.choices : [],
    };
  } catch {
    return { progress: [], choices: [] };
  }
}

function writeLocal(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

/** Shape: { completed: string[], choices: Record<scenarioId, choiceKey>, counts } */
function normalize(progressRows, choiceRows) {
  const valid = new Set(SCENARIOS.map((s) => s.id));
  const completed = progressRows.map((r) => r.scenario_id).filter((id) => valid.has(id));
  const choices = {};
  const counts = { reactive: 0, avoidant: 0, clarifying: 0, regulated: 0 };
  for (const row of choiceRows) {
    if (!valid.has(row.scenario_id)) continue;
    // Stale choice ids resolve to blank instead of crashing (choiceByKey fails soft).
    const scenario = SCENARIOS.find((s) => s.id === row.scenario_id);
    const choice = scenario.choices.find((c) => c.key === row.choice_key);
    if (!choice) continue;
    choices[row.scenario_id] = row.choice_key;
    counts[choice.archetype] += 1;
  }
  return { completed, choices, counts };
}

/** Load the whole field state for the current user (session from App.jsx). */
export async function loadField(session) {
  if (SUPABASE_CONFIGURED && session) {
    const [progressRes, choicesRes] = await Promise.all([
      supabase.from('progress').select('scenario_id, completed_at'),
      supabase.from('choices_made').select('scenario_id, choice_key, chosen_at'),
    ]);
    if (progressRes.error) throw progressRes.error;
    if (choicesRes.error) throw choicesRes.error;
    return normalize(progressRes.data ?? [], choicesRes.data ?? []);
  }
  const state = readLocal();
  return normalize(state.progress, state.choices);
}

/**
 * Record a confirmed choice and mark the scenario complete. One call per
 * decision; the Continue button never writes, it only navigates.
 */
export async function recordDecision(session, scenarioId, choiceKey) {
  if (SUPABASE_CONFIGURED && session) {
    const progressUpsert = supabase
      .from('progress')
      .upsert(
        { user_id: session.user.id, scenario_id: scenarioId, completed_at: new Date().toISOString() },
        { onConflict: 'user_id,scenario_id' },
      );
    const choiceUpsert = supabase
      .from('choices_made')
      .upsert(
        {
          user_id: session.user.id,
          scenario_id: scenarioId,
          choice_key: choiceKey,
          chosen_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,scenario_id' },
      );
    const [a, b] = await Promise.all([progressUpsert, choiceUpsert]);
    if (a.error) throw a.error;
    if (b.error) throw b.error;
    return;
  }
  const state = readLocal();
  const now = new Date().toISOString();
  state.progress = [
    ...state.progress.filter((r) => r.scenario_id !== scenarioId),
    { scenario_id: scenarioId, completed_at: now },
  ];
  state.choices = [
    ...state.choices.filter((r) => r.scenario_id !== scenarioId),
    { scenario_id: scenarioId, choice_key: choiceKey, chosen_at: now },
  ];
  writeLocal(state);
}

/** Local mode only: clear this browser's field (used by Profile). */
export function clearLocalField() {
  localStorage.removeItem(LS_KEY);
}
