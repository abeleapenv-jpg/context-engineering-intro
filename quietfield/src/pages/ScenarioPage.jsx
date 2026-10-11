import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Scenario from '../components/Scenario';
import { useHush } from '../lib/hush';
import usePageTitle from '../lib/usePageTitle';
import { readTheirChoices } from '../lib/walkCode';
import {
  STAGES,
  firstUncompletedId,
  nextScenarioId,
  scenarioById,
  scenariosForStage,
  stageById,
  TOTAL,
} from '../lib/scenarios';
import NotFoundPage from './NotFoundPage';

/*
 * ScenarioPage: route shell around the Scenario component. Owns the hush
 * state (UX task 1), the breadcrumbs (dimmed with the nav while the decision
 * is open), and the Continue destination (next uncompleted scenario, or the
 * completion page after 5E - master plan section 7, task 7).
 */
export default function ScenarioPage({ field, onDecide, refreshField }) {
  const { id } = useParams();
  const scenario = scenarioById(id);
  const navigate = useNavigate();
  const { hushed, setHushed } = useHush();
  const storedChoiceRef = useRef(null);

  storedChoiceRef.current = field.choices[id] ?? null;
  const stage = scenario ? stageById(scenario.life_stage) : null;

  usePageTitle(scenario ? `${scenario.title} — Quietfield` : 'Not found — Quietfield');

  // Walk-together (engagement Phase 3): the inviter's choices, read once
  // per scenario. Null without an invitation - Phase 2 behavior unchanged.
  const theirs = useMemo(() => readTheirChoices(), [id]);

  // Hush on entry (unless this scenario was already completed and hydrated),
  // unhush on unmount. Resolution unhush happens in handleDecide below.
  useEffect(() => {
    if (!scenario) return undefined;
    setHushed(!storedChoiceRef.current);
    return () => setHushed(false);
  }, [scenario?.id, setHushed, scenario]);

  const handleDecide = useCallback(
    (choiceKey) => {
      setHushed(false); // task 1: restore nav/breadcrumbs once the scenario completes
      onDecide(id, choiceKey);
    },
    [id, onDecide, setHushed],
  );

  const handleContinue = useCallback(() => {
    // Re-query after each Continue (master plan section 7, task 7), then go
    // to the first uncompleted scenario - skipping anything finished earlier.
    refreshField();
    const completedNow = field.completed.includes(id)
      ? field.completed
      : [...field.completed, id];
    const nextId = firstUncompletedId(completedNow);
    // Stage-complete interstitial (engagement Phase 2): only when this
    // scenario closed out a whole stage that is not the final one. The final
    // stage keeps going straight to /done, and a stage with gaps still sends
    // the walker to the next unfinished scenario, never to a page that
    // would bounce them back.
    const stageScenarios = stage ? scenariosForStage(stage.id) : [];
    const closesStage =
      stageScenarios.length > 0 &&
      stageScenarios[stageScenarios.length - 1].id === id &&
      stageScenarios.every((s) => completedNow.includes(s.id)) &&
      stage.id !== STAGES[STAGES.length - 1].id;
    if (closesStage) {
      navigate(`/stage/${stage.id}/complete`);
      return;
    }
    if (nextId) {
      navigate(`/scenario/${nextId}`);
    } else {
      navigate('/done');
    }
  }, [field.completed, id, navigate, refreshField, stage]);

  if (!scenario) return <NotFoundPage />;
  if (!stage) return <Navigate to="/" replace />;

  const nextId = nextScenarioId(scenario.id);

  return (
    <main>
      {/* Orientation row: breadcrumbs plus the exploration counter. The whole
          row dims with the nav during the decision (hush) and restores on
          hover/focus or once the scenario resolves. The counter is pure
          participation - scenarios explored, never correctness (Phase 2). */}
      <nav
        aria-label="Breadcrumb"
        className={[
          'mx-auto flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-x-4 gap-y-2 px-6 pb-2 pt-8 sm:px-10 lg:px-14',
          'transition-opacity duration-700 ease-out motion-reduce:transition-none',
          hushed
            ? 'opacity-30 hover:opacity-100 focus-within:opacity-100'
            : 'opacity-100',
        ].join(' ')}
      >
        <BreadcrumbTrail stageId={scenario.life_stage} scenarioId={scenario.id} />
        <p className="shrink-0 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
          {field.completed.length} OF {TOTAL} EXPLORED
        </p>
      </nav>
      <Scenario
        key={scenario.id}
        scenario={scenario}
        stageName={stage.name}
        initialChoiceKey={field.choices[scenario.id] ?? null}
        theirChoiceKey={theirs?.[scenario.id] ?? null}
        onDecide={handleDecide}
        onContinue={handleContinue}
        nextLabel={nextId ? 'Continue' : 'Finish the walk'}
      />
    </main>
  );
}

/*
 * Plain breadcrumb list. The hush dimming is applied by the parent
 * orientation row so the crumbs and the exploration counter dim and
 * restore together.
 */
function BreadcrumbTrail({ stageId, scenarioId }) {
  const stage = stageById(stageId);
  return (
    <ol className="flex flex-wrap items-center gap-3">
      <li>
        <Link
          to="/"
          className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 hover:text-qf-cream"
        >
          The Field
        </Link>
      </li>
      <li aria-hidden="true" className="font-mono text-sm font-bold text-qf-tan">
        /
      </li>
      <li>
        <Link
          to={`/stage/${stageId}`}
          className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 hover:text-qf-cream"
        >
          {stage ? stage.name : stageId}
        </Link>
      </li>
      <li aria-hidden="true" className="font-mono text-sm font-bold text-qf-tan">
        /
      </li>
      <li
        aria-current="page"
        className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-cream"
      >
        Scenario {scenarioId}
      </li>
    </ol>
  );
}
