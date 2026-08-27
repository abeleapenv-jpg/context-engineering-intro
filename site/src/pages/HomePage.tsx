/*
 * QUIETFIELD HOME
 *
 * The resting state after the entry sequence. The 25 scenarios present as
 * one vertical narrative path grouped by life stage (spec §3.6.1 #6),
 * never a marketing grid.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CompletedMark, SiteFooter } from '../components/Controls';
import { Monogram, RuleWithTicks } from '../components/shapes';
import { FIVE_STEPS } from '../content/cta';
import { SCENARIOS, STAGES } from '../content/scenarios';
import { getProgress, subscribe, totalCompleted } from '../lib/store';

export function HomePage() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    document.title = 'Quietfield';
    return subscribe(() => forceRender((n) => n + 1));
  }, []);

  const progress = getProgress();
  const doneCount = totalCompleted();
  const total = SCENARIOS.length;

  return (
    <main className="qf-wrap qf-home" data-testid="home-page">
      <header className="qf-home-header">
        <span className="qf-home-monogram">
          <Monogram />
        </span>
        <span className="qf-rule-draw-anim qf-home-rule" data-testid="home-rule">
          <RuleWithTicks />
        </span>
        <h1 className="qf-display qf-home-title">QUIETFIELD</h1>
        <p className="qf-tagline qf-home-steps">{FIVE_STEPS}</p>
      </header>

      <section className="qf-home-intro" aria-label="About">
        <p className="qf-body">
          Quietfield is a field for learning how people read other people. You step through
          twenty-five everyday situations, one life stage at a time, and you choose.
          Every choice moves the frame. No choice is graded.
        </p>
        <p className="qf-label qf-home-progress" data-testid="home-progress">
          {doneCount} OF {total} SCENARIOS SEEN
        </p>
      </section>

      <section className="qf-home-stages" aria-label="Life stages">
        {STAGES.map((stage, stageIndex) => {
          const stageScenarios = SCENARIOS.filter((s) => s.stageId === stage.id);
          const stageDone = stageScenarios.filter((s) =>
            progress.completedScenarioIds.includes(s.id),
          ).length;
          const canonicalDone = stageScenarios.some(
            (s) => s.canonical && progress.completedScenarioIds.includes(s.id),
          );
          return (
            <div key={stage.id} className="qf-stage-card qf-glass">
              <Link to={`/stages/${stage.id}`} className="qf-stage-head">
                <span className="qf-label">STAGE {stageIndex + 1}</span>
                <h2 className="qf-display qf-stage-name">{stage.name}</h2>
                <CompletedMark done={canonicalDone} />
              </Link>
              <p className="qf-body qf-stage-motion">{stage.motionLanguage}</p>
              <p className="qf-label">
                {stageDone} OF {stageScenarios.length} SCENARIOS
              </p>
            </div>
          );
        })}
      </section>

      <SiteFooter />
    </main>
  );
}
