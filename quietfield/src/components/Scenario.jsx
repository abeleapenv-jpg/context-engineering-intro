import { Fragment, useEffect, useRef, useState } from 'react';

import ChoiceButton from './ChoiceButton';
import { SCENARIOS } from '../lib/scenarios';

/*
 * Named Phase 1 constants: one place for the cascade timing and easing so
 * later work reuses them by name. EASE is a complete Tailwind class string
 * (the scanner reads the full utility from this file). The word stagger
 * keeps the whole reveal inside roughly MAX_WORD_SPREAD_MS.
 */
const EASE = 'ease-[cubic-bezier(0.22,1,0.36,1)]';
const REVEAL_START_MS = 160;
const WORD_STEP_MS = 45;
const MAX_WORD_SPREAD_MS = 1100;
const CHOICE_STEP_MS = 80;

/*
 * Alternating editorial layout: even scenario index puts the image left,
 * odd puts it right. Complete class strings only, never fragments.
 */
const LAYOUT = {
  imageLeft: { image: 'lg:col-start-1', text: 'lg:col-start-7' },
  imageRight: { image: 'lg:col-start-8', text: 'lg:col-start-1' },
};

/*
 * Engagement Phase 2: the prompt's final question sentence stands on its
 * own line under a small DECIDE label, so skimmers can find the decision
 * point without reading the setup twice. The boundary is the last
 * sentence-ending punctuation before the final question (closing quotes
 * stay with the setup). Returns null when the prompt does not end in a
 * question, and the caller then renders the prompt exactly as before.
 */
function splitFinalQuestion(prompt) {
  const text = prompt.trimEnd();
  if (!text.endsWith('?')) return null;
  let start = 0;
  for (let i = text.length - 2; i >= 0; i -= 1) {
    const ch = text[i];
    if (ch !== '.' && ch !== '!' && ch !== '?') continue;
    let j = i + 1;
    while (j < text.length && /["')\]]/.test(text[j])) j += 1;
    if (text[j] === ' ' && j + 1 < text.length && /[A-Z0-9"(']/.test(text[j + 1])) {
      start = j + 1;
      break;
    }
  }
  const setup = text.slice(0, start).trimEnd();
  const question = text.slice(start);
  if (!setup || !question) return null;
  return { setup, question };
}
/*
 * Scenario (master plan section 7 tasks 6-7; UX tasks 1, 2, 4)
 *
 * Task 1 - atmospheric pacing: the ink background paints immediately; on
 * mount the illustration fades in over 400ms while the text block rises
 * (translate-y-4 -> translate-y-0) and the prompt cascades word by word.
 * The nav/breadcrumbs hush is handled by the parent (ScenarioPage) through
 * the hush context.
 *
 * Task 2 - editorial layout: asymmetrical 12-column grid, ALTERNATING per
 * scenario index - even index: image left / text right; odd index: image
 * right / text left. Both columns carry explicit lg:col-start-* AND
 * lg:row-start-1 so grid auto-placement never drops a leftward item onto a
 * second row. DOM order stays image first, so mobile still shows the image
 * on top. Archival tag above the image right-aligns when the image is on
 * the right.
 *
 * Task 4 - the afterthought resolution: a confirmed choice fades the
 * unselected options out (opacity-0 pointer-events-none), then the
 * resolution text surfaces in high-contrast cream with a quiet Continue
 * button. No redirect until Continue.
 *
 * Engagement rules (Tailwind v4): the translate-* and scale-* utilities set
 * the standalone CSS properties, so every transition list names
 * `translate`/`scale`, never `transform`. Revisits (initialChoiceKey set)
 * skip every reveal: all visible immediately, delays 0. Per-word staggering
 * uses CSS transition-delay only - no timers.
 *
 * One-decision-per-screen (master plan section 10): resolution text renders
 * only after a choice is made, never before.
 */
export default function Scenario({
  scenario,
  stageName,
  initialChoiceKey = null,
  theirChoiceKey = null,
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
  const [otherPathsOpen, setOtherPathsOpen] = useState(false);
  const [otherPathsShown, setOtherPathsShown] = useState(false);
  const continueRef = useRef(null);

  // Task 1: entry beat. One frame of hidden state, then the fade/rise.
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 30);
    return () => clearTimeout(t);
  }, []);

  // "See the other paths" (engagement Phase 2): one quiet beat after the
  // region un-hides before the entries fade in - the same mount beat the
  // page entry uses, so the 90ms stagger stays CSS transition-delay only.
  useEffect(() => {
    if (!otherPathsOpen) return undefined;
    const t = setTimeout(() => setOtherPathsShown(true), 30);
    return () => clearTimeout(t);
  }, [otherPathsOpen]);

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
  /** id of the outcome region this scenario's chosen button controls */
  const outcomeId = `qf-outcome-${scenario.id}`;

  // Walk-together (engagement Phase 3): what the inviter chose here, when
  // an invitation is active. Optional - without one, nothing changes.
  const theirChoice = scenario.choices.find((c) => c.key === theirChoiceKey) ?? null;

  // "See the other paths": the unchosen choices, in key order. Collapsed by
  // default (fresh state on every keyed remount, revisits included).
  const unchosenChoices = scenario.choices.filter((c) => c.key !== chosenKey);
  /** id of the other-paths region the disclosure button controls */
  const otherPathsId = `qf-other-paths-${scenario.id}`;

  // Purely presentational disclosure: it never decides, never writes.
  function toggleOtherPaths() {
    if (otherPathsOpen) {
      setOtherPathsOpen(false);
      setOtherPathsShown(false);
    } else {
      setOtherPathsOpen(true);
    }
  }

  // Alternating layout: even index image-left, odd index image-right.
  const scenarioIndex = SCENARIOS.findIndex((s) => s.id === scenario.id);
  const imageRight = scenarioIndex % 2 === 1;
  const layout = imageRight ? LAYOUT.imageRight : LAYOUT.imageLeft;

  // Word cascade (fresh visits only; revisits skip every reveal).
  const skipReveal = resolvedFromStart;
  const revealed = skipReveal || entered;
  const words = scenario.prompt.split(' ');
  const wordStep = Math.min(WORD_STEP_MS, MAX_WORD_SPREAD_MS / Math.max(words.length, 1));
  const cascadeMs = REVEAL_START_MS + Math.max(words.length - 1, 0) * wordStep;
  const choicesStartMs = Math.round(cascadeMs * 0.6);

  // Setup vs question: one word array, one running cascade index. When
  // there is no final question sentence, setupWords is the whole prompt
  // and questionWords stays empty (the pre-Phase-2 rendering).
  const split = splitFinalQuestion(scenario.prompt);
  const questionStart = split ? split.setup.split(' ').length : 0;
  const setupWords = questionStart > 0 ? words.slice(0, questionStart) : words;
  const questionWords = questionStart > 0 ? words.slice(questionStart) : [];

  // One cascade renderer for both parts: same EASE, same rise, delays from
  // the running word index so setup and question read as one reveal.
  // Spaces stay real text nodes; only visibility moves.
  const renderCascadeWord = (word, i, withSpace) => (
    <Fragment key={i}>
      {withSpace ? ' ' : null}
      <span
        className={['inline-block transition-[translate,opacity] duration-[600ms] motion-reduce:transition-none', EASE].join(' ')}
        style={{
          opacity: revealed ? 1 : 0,
          translate: revealed ? '0 0' : '0 0.35em',
          transitionDelay: revealed && !skipReveal ? `${REVEAL_START_MS + i * wordStep}ms` : '0ms',
        }}
      >
        {word}
      </span>
    </Fragment>
  );

  return (
    <article className="mx-auto w-full max-w-6xl px-6 pb-28 pt-10 sm:px-10 lg:px-14">
      {/* Task 2: archival metadata tag directly above the image. When the
          image sits on the right, the tag right-aligns with its column. */}
      <p
        className={[
          'mb-5 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan',
          imageRight ? 'lg:text-right' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        INDEX // SCENARIO {scenario.id} · {stageName.toUpperCase()}
      </p>

      <div className="grid grid-cols-1 gap-x-14 gap-y-12 lg:grid-cols-12">
        {/* Illustration column (5 of 12). Alternates sides; row-start-1
            keeps both columns on one grid row regardless of DOM order. */}
        <figure
          className={[
            'lg:col-span-5 lg:row-start-1 lg:pt-2',
            layout.image,
          ].join(' ')}
        >
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

        {/* Text column (6 of 12). Alternates sides with the illustration. */}
        <div
          className={[
            'lg:col-span-6 lg:row-start-1 lg:pt-14',
            layout.text,
            'transition-[translate,opacity] duration-[400ms] ease-out delay-[120ms] motion-reduce:transition-none motion-reduce:delay-0',
            revealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          ].join(' ')}
        >
          <h1 className="font-display text-3xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-4xl">
            {scenario.title}
          </h1>

          {/* Prompt: word-by-word cascade. The full prompt is always in the
              DOM (spaces are real text nodes); only visibility moves. */}
          <p className="mt-6 max-w-prose font-body text-lg leading-relaxed text-qf-cream">
            {setupWords.map((word, i) => renderCascadeWord(word, i, i > 0))}
          </p>
          {questionWords.length > 0 ? (
            /* The final question, set apart: same cascade, one line down,
               under a small DECIDE label that arrives with its first word. */
            <p className="mt-5 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
              <span
                className={[
                  'mr-3 inline-block font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan',
                  'transition-[translate,opacity] duration-[600ms] motion-reduce:transition-none',
                  EASE,
                ].join(' ')}
                style={{
                  opacity: revealed ? 1 : 0,
                  translate: revealed ? '0 0' : '0 0.35em',
                  transitionDelay:
                    revealed && !skipReveal
                      ? `${REVEAL_START_MS + setupWords.length * wordStep}ms`
                      : '0ms',
                }}
              >
                DECIDE //
              </span>
              {questionWords.map((word, j) =>
                renderCascadeWord(word, setupWords.length + j, j > 0),
              )}
            </p>
          ) : null}

          <ul className="mt-9 space-y-3">
            {scenario.choices.map((choice, i) => {
              let state = 'idle';
              if (phase === 'resolved') {
                state = choice.key === chosenKey ? 'selected' : 'faded';
              }
              return (
                <li
                  key={choice.key}
                  className={['transition-[translate,opacity] duration-[600ms] motion-reduce:transition-none', EASE].join(' ')}
                  style={{
                    opacity: revealed ? 1 : 0,
                    translate: revealed ? '0 0' : '0 0.5rem',
                    transitionDelay:
                      revealed && !skipReveal ? `${choicesStartMs + i * CHOICE_STEP_MS}ms` : '0ms',
                  }}
                >
                  <ChoiceButton
                    index={i}
                    choice={choice}
                    state={state}
                    onSelect={(key) => decide(key)}
                    controlsId={outcomeId}
                  />
                </li>
              );
            })}
          </ul>

          {/* Task 4: resolution only ever renders after a confirmed choice. */}
          {phase === 'resolved' && chosenChoice ? (
            <div
              id={outcomeId}
              className={[
                'mt-12 border-l-2 border-qf-rust pl-6 sm:pl-8',
                'transition-[translate,opacity] duration-500 ease-out motion-reduce:transition-none',
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

              {/* What the inviter chose (walk-together). Inside the
                  resolution block, so it can never render before the
                  walker has chosen. An observation, not a verdict. */}
              {theirChoiceKey ? (
                <div className="mt-7 border-t border-[#848177]/20 pt-5">
                  <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                    THEY CHOSE // {theirChoiceKey}
                    {theirChoiceKey === chosenKey ? ' · THE SAME PATH' : ' · A DIFFERENT PATH'}
                  </p>
                  {theirChoice ? (
                    <p className="mt-3 font-body text-lg leading-relaxed text-qf-cream/80">
                      {theirChoice.text}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <button
                ref={continueRef}
                type="button"
                onClick={onContinue}
                className={[
                  'mt-9 rounded-[2px] border border-[#848177]/40 bg-transparent px-8 py-3',
                  'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
                  'cursor-pointer transition-[border-color,translate] duration-300 ease-out',
                  'hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
                  'active:translate-y-[1px] motion-reduce:transition-none',
                ].join(' ')}
              >
                {nextLabel}
              </button>

              {/* The other paths (engagement Phase 2): a quiet secondary
                  action under Continue. Plain divs, never choice buttons -
                  it must not decide, only show what the other choices
                  would have resolved to. */}
              <button
                type="button"
                aria-expanded={otherPathsOpen}
                aria-controls={otherPathsId}
                onClick={toggleOtherPaths}
                className={[
                  'mt-8 cursor-pointer font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan',
                  'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  'hover:text-qf-cream focus-visible:text-qf-cream focus-visible:outline-none',
                  'motion-reduce:transition-none',
                ].join(' ')}
              >
                {otherPathsOpen ? 'Hide the other paths' : 'See the other paths'}
              </button>
              <div
                id={otherPathsId}
                hidden={!otherPathsOpen}
                className="mt-6 max-w-prose space-y-8"
              >
                {unchosenChoices.map((choice, i) => (
                  <div
                    key={choice.key}
                    className={['transition-[translate,opacity] duration-[600ms] motion-reduce:transition-none', EASE].join(' ')}
                    style={{
                      opacity: otherPathsShown ? 1 : 0,
                      translate: otherPathsShown ? '0 0' : '0 0.35em',
                      transitionDelay: otherPathsShown ? `${i * 90}ms` : '0ms',
                    }}
                  >
                    <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                      {choice.key} · {choice.archetype}
                    </p>
                    <p className="mt-2 font-body text-lg leading-relaxed text-qf-cream">
                      {choice.text}
                    </p>
                    <p className="mt-3 border-l border-[#848177]/40 pl-5 font-body text-lg leading-relaxed text-qf-cream/80">
                      {choice.resolution}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
