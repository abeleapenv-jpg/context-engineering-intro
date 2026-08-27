/*
 * QUIETFIELD PROGRESS STORE
 *
 * Zero-dependency persistence so choice/consequence flow and completion
 * survive a refresh (spec §1.1 step 1: "the state survives a refresh").
 * Purely client-side: a session id + localStorage. No cookies, no server,
 * nothing to consent to (§7.5 #11/#16).
 */

const PROGRESS_KEY = 'quietfield.progress.v1';

export interface ProgressState {
  /** Anonymous per-browser identity so later features can key off it. */
  sessionId: string;
  /** Scenario ids completed at least once. */
  completedScenarioIds: string[];
  /** The most recent choice per scenario. */
  choiceLog: Record<string, string>;
  /** Life-stage ids whose canonical scenario is completed. */
  completedStageIds: string[];
  lastVisitedAt: string;
}

export interface ChoiceRecord {
  scenarioId: string;
  choiceId: string;
  /** The four archetypes drive camera behavior (§3.7.1). */
  archetype: 'reactive' | 'avoidant' | 'clarifying' | 'regulated';
  text: string;
}

const EMPTY: ProgressState = {
  sessionId: '',
  completedScenarioIds: [],
  choiceLog: {},
  completedStageIds: [],
  lastVisitedAt: '',
};

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<ProgressState>) };
  } catch {
    return { ...EMPTY };
  }
}

function save(state: ProgressState): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // Persistence is a convenience; the lesson still works without it.
  }
}

let current = load();

if (!current.sessionId) {
  current.sessionId = crypto.randomUUID();
  save(current);
}

export function getProgress(): ProgressState {
  return current;
}

/** Record a scenario completion and its choice. Idempotent for repeat runs. */
export function recordChoice(record: ChoiceRecord): ProgressState {
  current = {
    ...current,
    completedScenarioIds: Array.from(
      new Set([...current.completedScenarioIds, record.scenarioId]),
    ),
    choiceLog: { ...current.choiceLog, [record.scenarioId]: record.choiceId },
    lastVisitedAt: new Date().toISOString(),
  };
  save(current);
  notify();
  return current;
}

/** Mark a life stage complete once its canonical scenario is finished. */
export function markStageComplete(stageId: string): ProgressState {
  current = {
    ...current,
    completedStageIds: Array.from(
      new Set([...current.completedStageIds, stageId]),
    ),
    lastVisitedAt: new Date().toISOString(),
  };
  save(current);
  notify();
  return current;
}

export function totalCompleted(): number {
  return current.completedScenarioIds.length;
}

export function subscribe(listener: () => void): () => void {
  const wrapped = () => listener();
  window.addEventListener('quietfield-progress', wrapped);
  return () => window.removeEventListener('quietfield-progress', wrapped);
}

export function notify(): void {
  window.dispatchEvent(new Event('quietfield-progress'));
}
