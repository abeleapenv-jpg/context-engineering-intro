import { Link } from 'react-router-dom';

import ProgressBar from '../components/ProgressBar';
import StageRing from '../components/StageRing';
import usePageTitle from '../lib/usePageTitle';
import {
  CLOSING_LINE,
  FIVE_STEPS,
  SCENARIOS,
  STAGES,
  scenarioById,
  scenariosForStage,
} from '../lib/scenarios';

/*
 * Home: the field index. Surfaces the silent resume logic as a quiet card
 * naming the next scenario (master plan section 10), the five life stages
 * with progress rings, and the closing lesson.
 */
const STAGE_LINES = {
  childhood: 'Possession, laughter, and the first closed circles.',
  school: 'Votes, threads, and the cost of the popular answer.',
  college: 'Disclosure, silence, and the depth knob.',
  office: 'Credit, interruption, and the plan nobody questions.',
  'middle-age': 'Listening, old stories, and presence over advice.',
};

export default function HomePage({ field }) {
  usePageTitle('Quietfield — twenty-five small social situations');

  const started = field.completed.length > 0;
  const nextId = SCENARIOS.find((s) => !field.completed.includes(s.id))?.id ?? null;
  const next = nextId ? scenarioById(nextId) : null;
  const nextStage = next ? STAGES.find((s) => s.id === next.life_stage) : null;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-28 pt-16 sm:px-10 lg:px-14 lg:pt-24">
      {/* Masthead. Asymmetry: the title block owns the left two thirds. */}
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        A Musterfield Labs project
      </p>
      <h1 className="mt-6 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-[0.06em] text-qf-cream sm:text-7xl">
        Quiet&shy;field
      </h1>
      <p className="mt-8 max-w-xl font-mono text-base font-bold uppercase tracking-[0.18em] leading-loose text-qf-tan">
        {FIVE_STEPS}
      </p>
      <p className="mt-8 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
        Twenty-five small social situations, five life stages, one decision at a
        time. Each scenario is a single illustration and a single question:
        someone else has done something, and the only thing you control is what
        you do next.
      </p>

      {/* Resume card (section 10): the quiet, visible version of resume logic. */}
      <div className="mt-14 max-w-xl rounded-[2px] border border-[#848177]/20 p-6 sm:p-8">
        {next ? (
          <>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
              {started ? 'RESUME // THE FIELD WAITS WHERE YOU LEFT IT' : 'BEGIN // THE FIRST SITUATION'}
            </p>
            <p className="mt-4 font-display text-2xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
              {started ? `Scenario ${next.id} — ${next.title}` : `${next.title}`}
            </p>
            <p className="mt-2 font-body text-lg text-qf-tan">
              {nextStage ? `Life stage ${nextStage.numeral} · ${nextStage.name}` : ''}
              {started ? ` · ${field.completed.length} of 25 walked` : ''}
            </p>
            <Link
              to={`/scenario/${next.id}`}
              className={[
                'mt-6 inline-block cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3',
                'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
                'transition-[border-color,transform] duration-300',
                'hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
                'active:translate-y-[1px]',
              ].join(' ')}
            >
              {started ? 'Continue' : 'Begin'}
            </Link>
          </>
        ) : (
          <>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
              COMPLETE // 25 OF 25
            </p>
            <p className="mt-4 font-display text-2xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
              The field is quiet.
            </p>
            <Link
              to="/done"
              className="mt-6 inline-block cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream transition-colors duration-300 hover:border-[#904A30]"
            >
              Closing note
            </Link>
          </>
        )}
      </div>

      {/* Stage index with rings. */}
      <section aria-labelledby="stage-index" className="mt-24">
        <h2
          id="stage-index"
          className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan"
        >
          Index // Five life stages
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-px bg-[#848177]/20 sm:grid-cols-2 lg:grid-cols-3">
          {STAGES.map((stage) => {
            const stageScenarios = scenariosForStage(stage.id);
            const done = stageScenarios.filter((s) =>
              field.completed.includes(s.id),
            ).length;
            return (
              <li key={stage.id} className="bg-qf-ink">
                <Link
                  to={`/stage/${stage.id}`}
                  className={[
                    'group flex h-full items-start gap-5 bg-qf-ink p-6 sm:p-8',
                    'transition-colors duration-300',
                    'border border-transparent hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
                  ].join(' ')}
                >
                  <StageRing done={done} total={stageScenarios.length} />
                  <span className="block">
                    <span className="block font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                      Stage {stage.numeral}
                    </span>
                    <span className="mt-2 block font-display text-2xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
                      {stage.name}
                    </span>
                    <span className="mt-3 block font-body text-lg leading-relaxed text-qf-tan">
                      {STAGE_LINES[stage.id]}
                    </span>
                    <span className="mt-4 block font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                      {done} OF {stageScenarios.length}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Closing lesson + overall progress. */}
      <section className="mt-24 grid grid-cols-1 gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <blockquote className="border-l-2 border-qf-rust pl-6 sm:pl-8">
            <p className="max-w-prose font-body text-2xl leading-relaxed text-qf-cream">
              {CLOSING_LINE}
            </p>
          </blockquote>
          <p className="mt-8 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
            <Link to="/about" className="transition-colors duration-300 hover:text-qf-cream">
              About the project
            </Link>
            {' · '}
            <Link to="/contact" className="transition-colors duration-300 hover:text-qf-cream">
              Contact
            </Link>
          </p>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <ProgressBar
            done={field.completed.length}
            total={SCENARIOS.length}
            label="The whole field"
          />
        </div>
      </section>
    </main>
  );
}
