/*
 * QUIETFIELD STAGE INDEX
 *
 * One life stage's five scenarios as a vertical narrative path
 * (spec §3.6.1 #6). The canonical scenario heads the path.
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Breadcrumbs, CompletedMark, SiteFooter } from '../components/Controls';
import { SCENARIOS, STAGES } from '../content/scenarios';
import { getProgress, subscribe } from '../lib/store';

export function StageIndexPage() {
  const { stageId } = useParams<{ stageId: string }>();
  const [, forceRender] = useState(0);

  useEffect(() => {
    document.title = 'Quietfield';
    return subscribe(() => forceRender((n) => n + 1));
  }, []);

  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) {
    return (
      <main className="qf-wrap">
        <h1 className="qf-display">STAGE NOT FOUND</h1>
        <p className="qf-body">That life stage is not in the field.</p>
        <Link className="qf-btn" to="/">
          BACK TO QUIETFIELD
        </Link>
      </main>
    );
  }

  const scenarios = SCENARIOS.filter((s) => s.stageId === stage.id);
  const progress = getProgress();

  return (
    <main className="qf-wrap qf-stage-page" data-testid="stage-page">
      <Breadcrumbs
        trail={[
          { label: 'QUIETFIELD', to: '/' },
          { label: stage.name.toUpperCase(), to: `/stages/${stage.id}` },
        ]}
      />

      <header className="qf-stage-header">
        <h1 className="qf-display qf-stage-title">{stage.name}</h1>
        <p className="qf-tagline">{stage.motionLanguage}</p>
      </header>

      <section className="qf-stage-path" aria-label="Scenarios in this stage">
        {scenarios.map((scenario, i) => {
          const done = progress.completedScenarioIds.includes(scenario.id);
          return (
            <Link
              key={scenario.id}
              to={`/scenario/${scenario.id}`}
              className={`qf-path-step ${scenario.canonical ? 'qf-path-canonical' : ''}`}
            >
              <span className="qf-label qf-path-index">
                {scenario.canonical ? 'CANONICAL' : `${i + 1}`}
              </span>
              <span className="qf-path-title qf-display">{scenario.title}</span>
              <CompletedMark done={done} />
            </Link>
          );
        })}
      </section>

      <SiteFooter />
    </main>
  );
}
