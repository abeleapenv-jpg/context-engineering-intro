import { useEffect, useRef } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';
import {
  ARCHETYPE_ORDER,
  archetypeCountsForStage,
  firstUncompletedId,
  scenariosForStage,
  stageById,
  stageNotesSentence,
} from '../lib/scenarios';
import NotFoundPage from './NotFoundPage';

/*
 * Stage-complete interstitial (engagement Phase 2, feature 3): five stages
 * of five scenarios read as one long list, so the walk gets a punctuation
 * mark between them. An observation, never a score - which archetypes
 * showed up in this stage, as squares, no percentages.
 *
 * Reached only from ScenarioPage's Continue when a walker closes out a
 * whole non-final stage. Anyone who arrives with the stage incomplete is
 * sent back to the stage index; unknown stages render the 404 page.
 */
export default function StageCompletePage({ field }) {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const stage = stageById(stageId);
  const continueRef = useRef(null);

  usePageTitle(stage ? `${stage.name} walked — Quietfield` : 'Not found — Quietfield');

  // Keyboard users land on Continue the moment the page opens.
  useEffect(() => {
    continueRef.current?.focus({ preventScroll: true });
  }, []);

  if (!stage) return <NotFoundPage />;

  const stageScenarios = scenariosForStage(stage.id);
  const stageComplete = stageScenarios.every((s) => field.completed.includes(s.id));
  if (!stageComplete) return <Navigate to={`/stage/${stage.id}`} replace />;

  const counts = archetypeCountsForStage(stage.id, field.choices);
  const note = stageNotesSentence(counts);
  const nextId = firstUncompletedId(field.completed);

  function handleContinue() {
    if (nextId) {
      navigate(`/scenario/${nextId}`);
    } else {
      navigate('/done');
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-24 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        STAGE {stage.numeral} COMPLETE // {stage.name.toUpperCase()}
      </p>
      <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-5xl">
        The {stage.name} is walked
      </h1>

      {note ? (
        <p className="mt-10 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
          {note}
        </p>
      ) : null}

      {/* Archetype tally for this stage: five squares per row, filled rust
          for each choice of that archetype. Plain squares, no numbers - an
          observation, not a score. */}
      <ul className="mt-14 max-w-md space-y-4">
        {ARCHETYPE_ORDER.map((archetype) => (
          <li key={archetype} className="flex items-center gap-5">
            <span className="w-32 shrink-0 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
              {archetype}
            </span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              {stageScenarios.map((_, i) => (
                <span
                  key={i}
                  className={[
                    'inline-block h-2 w-2',
                    i < counts[archetype] ? 'bg-qf-rust' : 'bg-[#848177]/40',
                  ].join(' ')}
                />
              ))}
            </span>
            <span className="sr-only">
              {counts[archetype]} of {stageScenarios.length}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-center gap-6">
        <button
          ref={continueRef}
          type="button"
          onClick={handleContinue}
          className={[
            'cursor-pointer rounded-[2px] border border-[#848177]/40 bg-transparent px-8 py-3',
            'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
            'transition-[border-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
            'active:translate-y-[1px] motion-reduce:transition-none',
          ].join(' ')}
        >
          Continue
        </button>
        <Link
          to={`/stage/${stage.id}`}
          className="cursor-pointer font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-qf-cream focus-visible:text-qf-cream motion-reduce:transition-none"
        >
          Review this stage
        </Link>
      </div>
    </main>
  );
}
