/*
 * ChoiceButton (UX task 3 - tactile interactions)
 *
 * Unselected: 1px hairline border (tan at 20% alpha) on a transparent field.
 * Hover/focus: the border transitions to the rust accent over 300ms and the
 * field takes a 5% tan wash. The number key slides 4px right and turns
 * cream; the letter key slides 4px left and turns cream. Press: the button
 * dips 1px and scales to 0.995, and the number nudges on group-active so
 * touch devices get feedback (hover is ignored on touch).
 *
 * Tailwind v4: the translate-* and scale-* utilities set the standalone
 * CSS properties, so the transition lists name `translate`/`scale`, never
 * `transform`.
 *
 * Keyboard: the parent Scenario listens for 1-4; each button also carries
 * aria-keyshortcuts.
 *
 * Progressive disclosure: each choice is a reveal trigger for the outcome
 * region. The chosen button exposes aria-expanded/aria-controls once the
 * outcome it opened exists in the DOM.
 *
 * States:
 *   idle     - waiting to be chosen (shifts and washes apply only here)
 *   selected - the confirmed choice; rust border, cream number, no shifts
 *   faded    - the unchosen options after a decision (opacity-0, no pointer)
 */
export default function ChoiceButton({ index, choice, state = 'idle', onSelect, controlsId }) {
  const faded = state === 'faded';
  const selected = state === 'selected';
  const interactive = state === 'idle';

  return (
    <button
      type="button"
      onClick={interactive ? () => onSelect(choice.key) : undefined}
      aria-keyshortcuts={String(index + 1)}
      aria-disabled={!interactive}
      aria-expanded={selected}
      aria-controls={selected ? controlsId : undefined}
      className={[
        'group flex w-full items-baseline gap-4 rounded-[2px] border bg-transparent px-5 py-4 text-left',
        'transition-[border-color,background-color,opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'motion-reduce:transition-none',
        interactive
          ? 'cursor-pointer border-[#848177]/20 hover:border-[#904A30] hover:bg-[#848177]/5 focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:bg-[#848177]/5 focus-visible:outline-none active:translate-y-[1px] active:scale-[0.995]'
          : '',
        selected ? 'cursor-default border-[#904A30]' : '',
        faded ? 'pointer-events-none opacity-0' : 'opacity-100',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Number-key hint. Tan on ink stays compliant: 14px bold (section 4).
          Idle only: slides right and turns cream on hover/focus/press. */}
      <span
        className={[
          'w-4 shrink-0 font-mono text-sm font-bold leading-8',
          'transition-[translate,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          selected ? 'text-qf-cream' : 'text-qf-tan',
          interactive
            ? 'group-hover:translate-x-1 group-hover:text-qf-cream group-focus-visible:translate-x-1 group-focus-visible:text-qf-cream group-active:translate-x-1 group-active:text-qf-cream'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {index + 1}
      </span>
      <span className="flex-1 font-body text-lg leading-relaxed text-qf-cream">
        {choice.text}
      </span>
      {/* Letter key, archival echo of the data model. Idle only: slides
          left and turns cream on hover/focus. */}
      <span
        className={[
          'shrink-0 font-mono text-sm font-bold leading-8',
          'transition-[translate,color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          selected ? 'text-qf-cream' : 'text-qf-tan',
          interactive
            ? 'group-hover:-translate-x-1 group-hover:text-qf-cream group-focus-visible:-translate-x-1 group-focus-visible:text-qf-cream'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {choice.key}
      </span>
    </button>
  );
}
