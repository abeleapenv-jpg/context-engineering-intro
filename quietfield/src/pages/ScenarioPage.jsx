import { useCallback, useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import Scenario from '../components/Scenario';
import { useHush } from '../lib/hush';
import usePageTitle from '../lib/usePageTitle';
import { firstUncompletedId, nextScenarioId, scenarioById, stageById } from '../lib/scenarios';
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
  const { setHushed } = useHush();
  const storedChoiceRef = useRef(null);

  storedChoiceRef.current = field.choices[id] ?? null;
  const stage = scenario ? stageById(scenario.life_stage) : null;

  usePageTitle(scenario ? `${scenario.title} — Quietfield` : 'Not found — Quietfield');

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
    const nextId = firstUncompletedId(field.completed.includes(id) ? field.completed : [...field.completed, id]);
    if (nextId) {
      navigate(`/scenario/${nextId}`);
    } else {
      navigate('/done');
    }
  }, [field.completed, id, navigate, refreshField]);

  if (!scenario) return <NotFoundPage />;
  if (!stage) return <Navigate to="/" replace />;

  const nextId = nextScenarioId(scenario.id);

  return (
    <main>
      {/* Breadcrumbs (checklist #3): dim with the nav during the decision,
          restore on hover/focus or once the scenario resolves. */}
      <nav
        aria-label="Breadcrumb"
        className={[
          'mx-auto w-full max-w-6xl px-6 pb-2 pt-8 sm:px-10 lg:px-14',
          'transition-opacity duration-700 ease-out motion-reduce:transition-none',
        ].join(' ')}
        data-hush-anchor="breadcrumbs"
      >
        <BreadcrumbTrail stageId={scenario.life_stage} scenarioId={scenario.id} />
      </nav>
      <Scenario
        key={scenario.id}
        scenario={scenario}
        stageName={stage.name}
        initialChoiceKey={field.choices[scenario.id] ?? null}
        onDecide={handleDecide}
        onContinue={handleContinue}
        nextLabel={nextId ? 'Continue' : 'Finish the walk'}
      />
    </main>
  );
}

/*
 * The dimming lives here so the hush class can be applied to the whole
 * breadcrumb block: opacity-30 while hushed, restored on hover/focus.
 */
function BreadcrumbTrail({ stageId, scenarioId }) {
  const { hushed } = useHush();
  const stage = stageById(stageId);
  return (
    <ol
      className={[
        'flex flex-wrap items-center gap-3',
        'transition-opacity duration-700 ease-out motion-reduce:transition-none',
        hushed
          ? 'opacity-30 hover:opacity-100 focus-within:opacity-100'
          : 'opacity-100',
      ].join(' ')}
    >
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
