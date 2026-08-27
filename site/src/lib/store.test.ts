/*
 * Store behavior: choice/consequence flow and completion survive a
 * refresh (spec §1.1 step 1). Purely client-side, no cookies (§7.5 #16).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const PROGRESS_KEY = 'quietfield.progress.v1';

function freshStore() {
  vi.resetModules();
  return import('./store');
}

describe('progress store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('records a choice and completion idempotently', async () => {
    const store = await freshStore();
    store.recordChoice({
      scenarioId: '1a',
      choiceId: 'D',
      archetype: 'regulated',
      text: 'Ask for it back, plainly.',
    });
    store.recordChoice({
      scenarioId: '1a',
      choiceId: 'A',
      archetype: 'reactive',
      text: 'Grab the bag.',
    });
    const progress = store.getProgress();
    expect(progress.completedScenarioIds).toEqual(['1a']);
    // The most recent choice wins in the log.
    expect(progress.choiceLog['1a']).toBe('A');
  });

  it('persists across a reload (a fresh module reads localStorage)', async () => {
    const first = await freshStore();
    first.recordChoice({
      scenarioId: '1a',
      choiceId: 'C',
      archetype: 'clarifying',
      text: 'Tell them it rolled over by accident.',
    });
    const second = await freshStore();
    expect(second.getProgress().completedScenarioIds).toContain('1a');
    expect(second.getProgress().choiceLog['1a']).toBe('C');
  });

  it('marks stages complete and notifies subscribers', async () => {
    const store = await freshStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    store.markStageComplete('childhood');
    expect(store.getProgress().completedStageIds).toContain('childhood');
    expect(listener).toHaveBeenCalled();
    unsubscribe();
    store.markStageComplete('school');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('survives a corrupted stored value', async () => {
    localStorage.setItem(PROGRESS_KEY, '{not json');
    const store = await freshStore();
    const progress = store.getProgress();
    expect(progress.completedScenarioIds).toEqual([]);
    // A fresh session id is generated.
    expect(progress.sessionId.length).toBeGreaterThan(8);
  });
});
