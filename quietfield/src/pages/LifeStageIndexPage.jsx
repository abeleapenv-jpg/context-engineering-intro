import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import ProgressBar from '../components/ProgressBar';
import usePageTitle from '../lib/usePageTitle';
import { STAGES, scenariosForStage, stageById } from '../lib/scenarios';
import NotFoundPage from './NotFoundPage';

/*
 * LifeStageIndex: one life stage, its five scenarios, and where the walker
 * stands inside it. Completed scenarios stay linked - the walk is revisit-able.
 *
 * Engagement layer: on desktop (lg+) a sticky preview panel mirrors the
 * hovered/focused row's illustration; on mobile each row carries a small
 * thumbnail instead (hidden from lg up, so desktop never downloads it). The
 * active id is DERIVED from the hover id against this stage's scenarios, so
 * switching stages can never show another stage's illustration.
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

/**
 * Guarded matchMedia hook. jsdom (smoke test) has no matchMedia; return
 * false there instead of throwing. The listener is added and removed in the
 * effect cleanup.
 */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(query);
    const onChange = (event) => setMatches(event.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export default function LifeStageIndexPage({ field }) {
  const { stageId } = useParams();
  const stage = stageById(stageId);
  usePageTitle(stage ? `${stage.name} — Quietfield` : 'Not found — Quietfield');

  // Hooks first: everything below runs for every render, valid stage or not.
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [hoverId, setHoverId] = useState(null);
  const [failedIds, setFailedIds] = useState(() => new Set());

  // Stable updater: returns the SAME Set when the id is already present,
  // so a repeated onError never re-renders.
  const onFail = useCallback((id) => {
    setFailedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const scenarios = stage ? scenariosForStage(stage.id) : [];

  if (!stage) return <NotFoundPage />;

  const done = scenarios.filter((s) => field.completed.includes(s.id)).length;
  const stageIndex = STAGES.findIndex((s) => s.id === stage.id);
  const prevStage = stageIndex > 0 ? STAGES[stageIndex - 1] : null;
  const nextStage = stageIndex < STAGES.length - 1 ? STAGES[stageIndex + 1] : null;

  // Derived, never stored: the default is the first uncompleted scenario in
  // this stage (else the first), and a hover id only counts if it belongs to
  // this stage. Not reset on mouse leave - the panel stays on the last row
  // touched.
  const defaultId =
    scenarios.find((s) => !field.completed.includes(s.id))?.id ?? scenarios[0]?.id ?? null;
  const activeId = scenarios.some((s) => s.id === hoverId) ? hoverId : defaultId;

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

      <div className="mt-16 grid grid-cols-1 gap-x-14 lg:grid-cols-12">
        <ul className="divide-y divide-[#848177]/20 border-y border-[#848177]/20 lg:col-span-7">
          {scenarios.map((scenario) => {
            const isDone = field.completed.includes(scenario.id);
            const choiceKey = field.choices[scenario.id];
            return (
              <li key={scenario.id}>
                <Link
                  to={`/scenario/${scenario.id}`}
                  onMouseEnter={() => setHoverId(scenario.id)}
                  onFocus={() => setHoverId(scenario.id)}
                  className={[
                    'group grid grid-cols-[auto_1fr_auto] items-center gap-4 py-5 transition-colors duration-300',
                    'hover:bg-[#848177]/5 focus-visible:bg-[#848177]/5 focus-visible:outline-none',
                    'lg:grid-cols-[7rem_1fr_auto] lg:gap-6 lg:py-6',
                  ].join(' ')}
                >
                  {/* Mobile thumbnail: display:none from lg up, so desktop
                      never downloads it. */}
                  <img
                    src={scenario.image_path}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/5] w-12 rounded-[2px] border border-[#848177]/20 object-cover sm:w-14 lg:hidden"
                  />
                  {/* Below lg the id and title stack; from lg the wrapper
                      becomes grid columns 1 and 2. */}
                  <span className="lg:contents">
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                      {scenario.id}
                    </span>
                    <span className="mt-1 block font-display text-xl font-extrabold uppercase tracking-[0.04em] text-qf-cream transition-[translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:translate-x-1 sm:text-2xl lg:mt-0">
                      {scenario.title}
                    </span>
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

        {/* Desktop preview panel: decorative (the scenario page carries the
            real alt text), sticky, sized so the 4:5 frame never overflows a
            short laptop screen. */}
        {isDesktop ? (
          <aside
            aria-hidden="true"
            className="sticky top-28 ml-auto hidden lg:col-span-5 lg:block"
            style={{ width: 'min(100%, calc((100svh - 11rem) * 0.8))' }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] border border-[#848177]/20">
              {scenarios.map((scenario) => {
                const isActive = scenario.id === activeId;
                if (failedIds.has(scenario.id)) {
                  return (
                    <div
                      key={scenario.id}
                      className={[
                        'absolute inset-0 flex items-center justify-center bg-qf-ink',
                        'transition-[opacity,scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.025]',
                      ].join(' ')}
                    >
                      <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                        FIG. {scenario.id} // IN PRODUCTION
                      </span>
                    </div>
                  );
                }
                return (
                  <img
                    key={scenario.id}
                    src={scenario.image_path}
                    alt=""
                    loading="eager"
                    decoding="async"
                    fetchPriority={scenario.id === defaultId ? 'high' : 'low'}
                    onError={() => onFail(scenario.id)}
                    className={[
                      'absolute inset-0 h-full w-full object-cover',
                      'transition-[opacity,scale] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                      isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.025]',
                    ].join(' ')}
                  />
                );
              })}
            </div>
            <p className="mt-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-qf-tan">
              FIG. {activeId}
              {field.choices[activeId] ? ` // CHOSE ${field.choices[activeId]}` : ''}
            </p>
          </aside>
        ) : null}
      </div>

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
