import { Link, useParams } from 'react-router-dom';

import ProgressBar from '../components/ProgressBar';
import usePageTitle from '../lib/usePageTitle';
import { STAGES, scenariosForStage, stageById } from '../lib/scenarios';
import NotFoundPage from './NotFoundPage';

/*
 * LifeStageIndex: one life stage, its five scenarios, and where the walker
 * stands inside it. Completed scenarios stay linked - the walk is revisit-able.
 */
const STAGE_BLURBS = {
  childhood:
    'The playground. Fast, bouncy, abrupt. The first life stage: possession, laughter, and the first closed circles.',
  school:
    'The classroom. Repeated, simultaneous gestures across the group; independent judgment breaks the sync.',
  college:
    'The cafe. Distance opens only as fast as disclosure is actually reciprocated.',
  office:
    'The meeting room. Competing focal planes that resolve into one clean focus once clarity is reached.',
  'middle-age':
    'The dinner table. Slow, warm, mostly still. Presence is expressed by declining to perform.',
};

export default function LifeStageIndexPage({ field }) {
  const { stageId } = useParams();
  const stage = stageById(stageId);
  usePageTitle(stage ? `${stage.name} — Quietfield` : 'Not found — Quietfield');

  if (!stage) return <NotFoundPage />;

  const scenarios = scenariosForStage(stage.id);
  const done = scenarios.filter((s) => field.completed.includes(s.id)).length;
  const stageIndex = STAGES.findIndex((s) => s.id === stage.id);
  const prevStage = stageIndex > 0 ? STAGES[stageIndex - 1] : null;
  const nextStage = stageIndex < STAGES.length - 1 ? STAGES[stageIndex + 1] : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-28 pt-16 sm:px-10 lg:px-14">
      <nav aria-label="Breadcrumb" className="mb-10">
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
          <li
            aria-current="page"
            className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-cream"
          >
            {stage.name}
          </li>
        </ol>
      </nav>

      <header className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
            LIFE STAGE {stage.numeral} OF V
          </p>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[0.04em] text-qf-cream sm:text-5xl">
            {stage.name}
          </h1>
          <p className="mt-6 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
            {STAGE_BLURBS[stage.id]}
          </p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pt-4">
          <ProgressBar done={done} total={scenarios.length} label="This stage" />
        </div>
      </header>

      <ul className="mt-16 divide-y divide-[#848177]/20 border-y border-[#848177]/20">
        {scenarios.map((scenario) => {
          const isDone = field.completed.includes(scenario.id);
          const choiceKey = field.choices[scenario.id];
          return (
            <li key={scenario.id}>
              <Link
                to={`/scenario/${scenario.id}`}
                className="group grid grid-cols-[5rem_1fr_auto] items-baseline gap-6 py-6 transition-colors duration-300 hover:bg-[#848177]/5 focus-visible:bg-[#848177]/5 focus-visible:outline-none sm:grid-cols-[7rem_1fr_auto]"
              >
                <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                  {scenario.id}
                </span>
                <span className="font-display text-xl font-extrabold uppercase tracking-[0.04em] text-qf-cream transition-colors duration-300 group-hover:text-qf-cream sm:text-2xl">
                  {scenario.title}
                </span>
                <span className="flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                  {isDone ? (
                    <>
                      {choiceKey ? `CHOSE ${choiceKey}` : ''} <span aria-hidden="true">·</span> DONE
                    </>
                  ) : (
                    'WALK'
                  )}
                  <span
                    aria-hidden="true"
                    className={['inline-block h-2 w-2', isDone ? 'bg-qf-rust' : 'bg-[#848177]/40'].join(' ')}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <nav
        aria-label="Stage navigation"
        className="mt-14 flex items-baseline justify-between gap-6"
      >
        {prevStage ? (
          <Link
            to={`/stage/${prevStage.id}`}
            className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 hover:text-qf-cream"
          >
            ← {prevStage.name}
          </Link>
        ) : (
          <span />
        )}
        {nextStage ? (
          <Link
            to={`/stage/${nextStage.id}`}
            className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 hover:text-qf-cream"
          >
            {nextStage.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
