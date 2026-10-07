import { useEffect, useRef, useState } from 'react';

import ChoiceButton from './ChoiceButton';
/*
 * Scenario (master plan section 7 tasks 6-7; UX tasks 1, 2, 4)
 *
 * Task 1 - atmospheric pacing: the ink background paints immediately; on
 * mount the illustration fades in over 400ms while the text block rises
 * (translate-y-4 -> translate-y-0). The nav/breadcrumbs hush is handled by
 * the parent (ScenarioPage) through the hush context.
 *
 * Task 2 - editorial layout: asymmetrical 12-column grid (image left, text
 * offset right with deep top padding), and an archival metadata tag above
 * the image: INDEX // SCENARIO {id} · {life stage}.
 *
 * Task 4 - the afterthought resolution: a confirmed choice fades the
 * unselected options out (opacity-0 pointer-events-none), then the
 * resolution text surfaces in high-contrast cream with a quiet Continue
 * button. No redirect until Continue.
 *
 * One-decision-per-screen (master plan section 10): resolution text renders
 * only after a choice is made, never before.
 */
export default function Scenario({
  scenario,
  stageName,
  initialChoiceKey = null,
  onDecide,
  onContinue,
  nextLabel = 'Continue',
}) {
  const resolvedFromStart = Boolean(initialChoiceKey);
  const [phase, setPhase] = useState(resolvedFromStart ? 'resolved' : 'choosing');
  const [chosenKey, setChosenKey] = useState(initialChoiceKey ?? null);
  const [entered, setEntered] = useState(false);
  const [resolutionShown, setResolutionShown] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const continueRef = useRef(null);

  // Task 1: entry beat. One frame of hidden state, then the fade/rise.
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Task 4: the resolution arrives after the unchosen options have faded.
  useEffect(() => {
    if (phase !== 'resolved') return undefined;
    const t = setTimeout(() => {
      setResolutionShown(true);
      // Keyboard users land on Continue the moment it exists.
      continueRef.current?.focus({ preventScroll: true });
    }, 420);
    return () => clearTimeout(t);
  }, [phase]);

  function decide(choiceKey) {
    setChosenKey(choiceKey);
    setPhase('resolved');
    onDecide(choiceKey);
  }

  // Task 3: number keys 1-4 trigger the matching choice while the decision
  // is open. Arrow/tab + enter still works natively on the focused button.
  useEffect(() => {
    if (phase === 'resolved') return undefined;
    function onKeyDown(event) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      ) {
        return;
      }
      const i = ['1', '2', '3', '4'].indexOf(event.key);
      if (i === -1 || i >= scenario.choices.length) return;
      decide(scenario.choices[i].key);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, scenario]);

  const chosenChoice = scenario.choices.find((c) => c.key === chosenKey) ?? null;

  return (
    <article className="mx-auto w-full max-w-6xl px-6 pb-28 pt-10 sm:px-10 lg:px-14">
      {/* Task 2: archival metadata tag directly above the image. */}
      <p className="mb-5 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        INDEX // SCENARIO {scenario.id} · {stageName.toUpperCase()}
      </p>

      <div className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-12">
        {/* Illustration column (5 of 12, flush left; the asymmetry is the point). */}
        <figure className="lg:col-span-5 lg:pt-2">
          <div
            className={[
              'overflow-hidden rounded-[2px] border border-[#848177]/20',
              'transition-opacity duration-[400ms] ease-out motion-reduce:transition-none',
              entered ? 'opacity-100' : 'opacity-0',
            ].join(' ')}
          >
            {imageFailed ? (
              /* Temporary stand-in while an illustration is still in
                 production (volume generation lands stage by stage). Same
                 frame, same ratio, honest about what it is. */
              <div
                role="img"
                aria-label={scenario.image_alt}
                className="flex aspect-[4/5] w-full items-center justify-center border border-[#848177]/20 bg-qf-ink"
              >
                <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                  FIG. {scenario.id} // IN PRODUCTION
                </span>
              </div>
            ) : (
              <img
                src={scenario.image_path}
                alt={scenario.image_alt}
                width={1200}
                height={1500}
                onError={() => setImageFailed(true)}
                className="block aspect-[4/5] w-full bg-qf-ink object-cover"
                loading="eager"
                decoding="async"
              />
            )}
          </div>
          <figcaption className="mt-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-qf-tan">
            FIG. {scenario.id}
          </figcaption>
        </figure>

        {/* Text column (6 of 12, offset start 7; generous top whitespace). */}
        <div
          className={[
            'lg:col-span-6 lg:col-start-7 lg:pt-14',
            'transition-[transform,opacity] duration-[400ms] ease-out delay-[120ms] motion-reduce:transition-none motion-reduce:delay-0',
            entered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          ].join(' ')}
        >
          <h1 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-4xl">
            {scenario.title}
          </h1>

          <p className="mt-6 max-w-prose font-body text-lg leading-relaxed text-qf-cream">
            {scenario.prompt}
          </p>

          <ul className="mt-9 space-y-3">
            {scenario.choices.map((choice, i) => {
              let state = 'idle';
              if (phase === 'resolved') {
                state = choice.key === chosenKey ? 'selected' : 'faded';
              }
              return (
                <li key={choice.key}>
                  <ChoiceButton
                    index={i}
                    choice={choice}
                    state={state}
                    onSelect={(key) => decide(key)}
                  />
                </li>
              );
            })}
          </ul>

          {/* Task 4: resolution only ever renders after a confirmed choice. */}
          {phase === 'resolved' && chosenChoice ? (
            <div
              className={[
                'mt-12 border-l-2 border-qf-rust pl-6 sm:pl-8',
                'transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none',
                resolutionShown ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
              ].join(' ')}
              aria-live="polite"
            >
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                RESOLUTION // CHOICE {chosenChoice.key}
              </p>
              <p className="mt-4 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
                {chosenChoice.resolution}
              </p>
              <button
                ref={continueRef}
                type="button"
                onClick={onContinue}
                className={[
                  'mt-9 rounded-[2px] border border-[#848177]/40 bg-transparent px-8 py-3',
                  'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
                  'cursor-pointer transition-[border-color,transform] duration-300 ease-out',
                  'hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
                  'active:translate-y-[1px] motion-reduce:transition-none',
                ].join(' ')}
              >
                {nextLabel}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
