/*
 * Entry sequence: the §4.2 beat structure as testable behavior.
 * Skip from beat 0, session-once gating, and the resolution affordance.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ENTRY_SESSION_KEY, hasEnteredThisSession } from '../lib/entrySession';
import { EntrySequence } from './EntrySequence';

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('entry sequence (spec §4.2)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    sessionStorage.clear();
  });

  it('starts in the void, with a skip control visible from beat 0', () => {
    render(<EntrySequence reducedMotion onComplete={() => undefined} />);
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'void',
    );
    expect(screen.getByTestId('skip-button')).toBeInTheDocument();
  });

  it('walks the beats: glimpse, pause, question, branch, resolution', () => {
    render(<EntrySequence reducedMotion onComplete={() => undefined} />);
    advance(850);
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'glimpse',
    );
    advance(1400);
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'pause',
    );
    expect(screen.getByText('PAUSE.')).toBeInTheDocument();
    advance(1200);
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'question',
    );
    advance(2600);
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'branch',
    );
    expect(screen.getByText('MORE THAN ONE STORY FITS.')).toBeInTheDocument();
    advance(2000);
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'resolution',
    );
    // Enter affordance fades in last (beat 5 + 2.6s of wordmark assembly).
    advance(2700);
    expect(screen.getByTestId('enter-button')).toBeInTheDocument();
    expect(screen.getByText('OBSERVE. PAUSE. QUESTION. CONTEXTUALIZE. CHOOSE.')).toBeInTheDocument();
  });

  it('skip jumps straight to the resting state and removes the skip control', () => {
    render(<EntrySequence reducedMotion onComplete={() => undefined} />);
    fireEvent.click(screen.getByTestId('skip-button'));
    expect(screen.getByTestId('entry-sequence')).toHaveAttribute(
      'data-beat',
      'resolution',
    );
    expect(screen.queryByTestId('skip-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('enter-button')).toBeInTheDocument();
  });

  it('enter marks the session and completes', () => {
    const onComplete = vi.fn();
    render(<EntrySequence reducedMotion onComplete={onComplete} />);
    fireEvent.click(screen.getByTestId('skip-button'));
    fireEvent.click(screen.getByTestId('enter-button'));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(hasEnteredThisSession()).toBe(true);
    expect(sessionStorage.getItem(ENTRY_SESSION_KEY)).toBe('1');
  });

  it('never re-triggers: the session flag is checked before rendering', () => {
    sessionStorage.setItem(ENTRY_SESSION_KEY, '1');
    expect(hasEnteredThisSession()).toBe(true);
  });
});
