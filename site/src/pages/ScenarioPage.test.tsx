/*
 * Scenario page: the walking skeleton's contract (spec §1.1 step 1),
 * plus the selection-isolation architecture (dictionary keyed by
 * scenarioId; see the ScenarioPage header comment):
 *   1. dictionary-based state per scenarioId
 *   2. isolated handlers (a choice writes only its own scenario's key)
 *   3. deterministic navigation rendering (no cross-talk between
 *      scenarios; persisted choices hydrate for the exact scenario)
 *   4. defensive initialization (unselected and stale entries render
 *      blank, never a fallback index or inherited value)
 *
 * The store caches module state, so each test resets it (store.test.ts
 * and ScenarioPage both import the same module instance).
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { __resetForTests, recordChoice } from '../lib/store';
import { ScenarioPage } from './ScenarioPage';

function renderScenario(scenarioId: string) {
  return render(
    <MemoryRouter initialEntries={[`/scenario/${scenarioId}`]}>
      <Routes>
        <Route path="/scenario/:scenarioId" element={<ScenarioPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

function choiceButtons() {
  return screen
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-label')?.startsWith('Choice'));
}

describe('scenario page (2D walking skeleton)', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetForTests();
    window.matchMedia = ((query: string) => ({
      matches: true, // reduced motion: instant beats, no timers
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  });

  it('renders the scenario, its context, and four choices', () => {
    renderScenario('1a');
    expect(screen.getByText('THE BALL THAT DISAPPEARED')).toBeInTheDocument();
    expect(
      screen.getByText(/Your ball rolled away from you/),
    ).toBeInTheDocument();
    expect(choiceButtons()).toHaveLength(4);
  });

  it('falls back to the 2D scene when WebGL is unavailable (spec §1)', () => {
    // jsdom provides no WebGL context, so the progressive-enhancement
    // switch must render the 2D/SVG scene, never the 3D canvas.
    renderScenario('1a');
    expect(screen.getByTestId('scene-frame')).toBeInTheDocument();
    expect(screen.queryByTestId('scene-3d')).not.toBeInTheDocument();
  });

  it('a choice reveals its own consequence beat and persists the choice', () => {
    renderScenario('1a');
    const regulated = screen.getByRole('button', {
      name: 'Choice D: Ask for it back, plainly.',
    });
    fireEvent.click(regulated);
    expect(screen.getByTestId('consequence')).toHaveTextContent(
      'You say the word yours, out loud, calmly.',
    );
    expect(screen.getByTestId('consequence')).toHaveTextContent(
      'NO SINGLE CORRECT READING.',
    );
    const raw = localStorage.getItem('quietfield.progress.v1');
    expect(raw).toContain('"1a"');
    expect(raw).toContain('"D"');
  });

  it('reactive and regulated choices take different camera paths', () => {
    renderScenario('1a');
    const reactive = screen.getByRole('button', {
      name: 'Choice A: Grab the bag.',
    });
    fireEvent.click(reactive);
    // Reactive = hard cut: the camera layer must carry the cut ease class.
    expect(screen.getByTestId('scene-camera')).toHaveAttribute(
      'data-ease',
      'cut',
    );
  });

  it('shows a stage breadcrumb trail', () => {
    renderScenario('1a');
    expect(screen.getByLabelText('Breadcrumb')).toHaveTextContent('QUIETFIELD');
    expect(screen.getByLabelText('Breadcrumb')).toHaveTextContent(
      'THE PLAYGROUND',
    );
  });

  it('renders a not-found state for unknown scenarios', () => {
    renderScenario('zzz');
    expect(screen.getByText('SCENARIO NOT FOUND')).toBeInTheDocument();
  });
});

describe('selection isolation (dictionary keyed by scenarioId)', () => {
  beforeEach(() => {
    localStorage.clear();
    __resetForTests();
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  });

  it('does not leak a selection into the next scenario (in-page navigation)', () => {
    renderScenario('1a');
    fireEvent.click(
      screen.getByRole('button', { name: 'Choice D: Ask for it back, plainly.' }),
    );
    expect(screen.getByTestId('consequence')).toHaveTextContent(
      'You say the word yours',
    );

    // Navigate to the next scenario through the in-app link. The route
    // reuses the same component instance, so any shared primitive state
    // would leak here.
    fireEvent.click(screen.getByRole('link', { name: /NEXT IN THE PLAYGROUND/ }));
    expect(screen.getByText('THE LAUGH')).toBeInTheDocument();

    // 1b has no selection of its own: nothing highlighted, no leaked
    // consequence, every choice enabled.
    expect(document.querySelector('.qf-choice-chosen')).toBeNull();
    expect(screen.getByTestId('consequence').textContent).toBe('');
    const buttons = choiceButtons();
    expect(buttons).toHaveLength(4);
    for (const button of buttons) expect(button).toBeEnabled();
  });

  it('keeps each scenario own selection when navigating back (dictionary retention)', () => {
    renderScenario('1a');
    fireEvent.click(
      screen.getByRole('button', { name: 'Choice D: Ask for it back, plainly.' }),
    );
    fireEvent.click(screen.getByRole('link', { name: /NEXT IN THE PLAYGROUND/ }));
    expect(screen.getByText('THE LAUGH')).toBeInTheDocument();

    // Back to 1a via the stage-nav index link (1a sits at index 2:
    // position 1 is the canonical Playground scenario).
    fireEvent.click(screen.getByRole('link', { name: '2' }));
    expect(screen.getByText('THE BALL THAT DISAPPEARED')).toBeInTheDocument();
    const d = screen.getByRole('button', {
      name: 'Choice D: Ask for it back, plainly.',
    });
    expect(d).toHaveClass('qf-choice-chosen');
    expect(screen.getByTestId('consequence')).toHaveTextContent(
      'You say the word yours',
    );
  });

  it('hydrates the persisted choice for the exact scenario on a fresh visit', () => {
    // A previous session persisted choices for two different scenarios.
    recordChoice({
      scenarioId: '1a',
      choiceId: 'D',
      archetype: 'regulated',
      text: 'Ask for it back, plainly.',
    });
    recordChoice({
      scenarioId: '1b',
      choiceId: 'A',
      archetype: 'reactive',
      text: 'Ask what is so funny, sharply.',
    });

    renderScenario('1a');
    const d = screen.getByRole('button', {
      name: 'Choice D: Ask for it back, plainly.',
    });
    expect(d).toHaveClass('qf-choice-chosen');
    expect(screen.getByTestId('consequence')).toHaveTextContent(
      'You say the word yours',
    );
    expect(screen.getByText('SEEN')).toBeInTheDocument();
    // 1b's persisted A must not highlight 1a's A.
    expect(
      screen.getByRole('button', { name: 'Choice A: Grab the bag.' }),
    ).not.toHaveClass('qf-choice-chosen');
  });

  it('defaults unselected scenarios to blank with every choice enabled', () => {
    renderScenario('1b');
    expect(document.querySelector('.qf-choice-chosen')).toBeNull();
    expect(screen.getByTestId('consequence').textContent).toBe('');
    for (const button of choiceButtons()) expect(button).toBeEnabled();
  });

  it('defensively renders blank when the persisted choice id is stale', () => {
    // A persisted id that no longer exists in the content model.
    recordChoice({
      scenarioId: '1a',
      choiceId: 'ZZZ',
      archetype: 'regulated',
      text: 'Stale choice from an older build.',
    });
    renderScenario('1a');
    // No fallback index highlighted, no crash, choices remain usable.
    expect(document.querySelector('.qf-choice-chosen')).toBeNull();
    expect(screen.getByTestId('consequence').textContent).toBe('');
    for (const button of choiceButtons()) expect(button).toBeEnabled();
  });
});
