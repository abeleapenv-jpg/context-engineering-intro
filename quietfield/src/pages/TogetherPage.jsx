import { Link, Navigate, useNavigate } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';
import { SCENARIOS, TOTAL, choiceByKey, firstUncompletedId } from '../lib/scenarios';
import { clearCompareCode, readTheirChoices } from '../lib/walkCode';

/*
 * TogetherPage (engagement Phase 3): where two readings of the same field
 * differ. Spoiler-safe - only scenarios the viewer has already walked AND
 * the inviter chose are listed; everything else stays hidden. Differences
 * are observations: no scores, no percentages, no judgments.
 */
export default function TogetherPage({ field }) {
  usePageTitle('Together — Quietfield');
  const navigate = useNavigate();

  const theirs = readTheirChoices();
  if (!theirs) return <Navigate to="/" replace />;

  // Only the shared ground: walked by the viewer, chosen by the inviter.
  const rows = SCENARIOS.filter(
    (s) => field.completed.includes(s.id) && field.choices[s.id] && theirs[s.id],
  ).map((s) => {
    const you = field.choices[s.id];
    const them = theirs[s.id];
    return { scenario: s, you, them, differ: you !== them };
  });
  const same = rows.filter((r) => !r.differ).length;
  const diff = rows.length - same;

  const nextId = firstUncompletedId(field.completed);
  const unread = TOTAL - field.completed.length;

  function handleStop() {
    clearCompareCode();
    navigate('/');
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-24 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        TOGETHER // WHERE YOU DIFFERED
      </p>
      <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-5xl">
        Two readings of the same field
      </h1>

      <p className="mt-8 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
        On the {rows.length} situations you have both walked, you chose the same path {same} times
        and a different one {diff} times.
      </p>

      {rows.length > 0 ? (
        <ul className="mt-14 divide-y divide-[#848177]/20 border-y border-[#848177]/20">
          {rows.map(({ scenario, you, them, differ }) => (
            <li key={scenario.id} className="py-5">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
                <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                  {scenario.id}
                </span>
                <span className="font-display text-xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
                  {scenario.title}
                </span>
                <span className="ml-auto flex items-center gap-4 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                  YOU {you} · THEM {them}
                  {differ ? (
                    <span aria-hidden="true" className="inline-block h-2 w-2 bg-qf-rust" />
                  ) : (
                    <span>SAME PATH</span>
                  )}
                </span>
              </div>
              {differ ? (
                /* The two readings, side by side, in a quieter cream. */
                <div className="mt-3 space-y-2">
                  <p className="font-body text-lg leading-relaxed text-qf-cream/80">
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                      YOU {you} ·{' '}
                    </span>
                    {choiceByKey(scenario, you)?.text}
                  </p>
                  <p className="font-body text-lg leading-relaxed text-qf-cream/80">
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                      THEM {them} ·{' '}
                    </span>
                    {choiceByKey(scenario, them)?.text}
                  </p>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {unread > 0 ? (
        <p className="mt-10 max-w-prose font-body text-lg leading-relaxed text-qf-tan">
          {unread} situations still unread by you stay hidden until you walk them.{' '}
          {nextId ? (
            <Link to={`/scenario/${nextId}`} className="text-qf-cream underline underline-offset-4">
              Continue the walk
            </Link>
          ) : null}
        </p>
      ) : null}

      <p className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        <button
          type="button"
          onClick={handleStop}
          className="cursor-pointer transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-qf-cream focus-visible:text-qf-cream motion-reduce:transition-none"
        >
          Stop comparing
        </button>
        {' · '}
        <Link
          to="/"
          className="transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-qf-cream focus-visible:text-qf-cream motion-reduce:transition-none"
        >
          Back to the field
        </Link>
      </p>
    </main>
  );
}
