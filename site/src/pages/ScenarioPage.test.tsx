/*
 * Scenario page: the walking skeleton's contract (spec §1.1 step 1).
 * Choices branch, consequences reveal, and the choice log persists.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

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

describe('scenario page (2D walking skeleton)', () => {
  beforeEach(() => {
    localStorage.clear();
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
    const buttons = screen.getAllByRole('button').filter((b) =>
      b.getAttribute('aria-label')?.startsWith('Choice'),
    );
    expect(buttons).toHaveLength(4);
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
