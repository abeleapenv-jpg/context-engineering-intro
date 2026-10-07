/*
 * ChoiceButton (UX task 3 - tactile interactions)
 *
 * Unselected: 1px hairline border (tan at 20% alpha) on a transparent field.
 * Hover/focus: the border transitions to the rust accent over 300ms.
 * Keyboard: the parent Scenario listens for 1-4; each button also carries
 * aria-keyshortcuts and an active depression state (active:translate-y-[1px]).
 *
 * States:
 *   idle     - waiting to be chosen
 *   selected - the confirmed choice; stays on screen as the record
 *   faded    - the unchosen options after a decision (opacity-0, no pointer)
 */
export default function ChoiceButton({ index, choice, state = 'idle', onSelect }) {
  const faded = state === 'faded';
  const selected = state === 'selected';
  const interactive = state === 'idle';

  return (
    <button
      type="button"
      onClick={interactive ? () => onSelect(choice.key) : undefined}
      aria-keyshortcuts={String(index + 1)}
      aria-disabled={!interactive}
      className={[
        'group flex w-full items-baseline gap-4 rounded-[2px] border bg-transparent px-5 py-4 text-left',
        'transition-[border-color,opacity,transform] duration-300 ease-out',
        'motion-reduce:transition-none',
        interactive
          ? 'cursor-pointer border-[#848177]/20 hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none active:translate-y-[1px]'
          : '',
        selected ? 'cursor-default border-[#904A30]' : '',
        faded ? 'pointer-events-none opacity-0' : 'opacity-100',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Number-key hint. Tan on ink stays compliant: 14px bold (section 4). */}
      <span className="w-4 shrink-0 font-mono text-sm font-bold leading-8 text-qf-tan">
        {index + 1}
      </span>
      <span className="flex-1 font-body text-lg leading-relaxed text-qf-cream">
        {choice.text}
      </span>
      {/* Letter key, archival echo of the data model. */}
      <span className="shrink-0 font-mono text-sm font-bold leading-8 text-qf-tan">
        {choice.key}
      </span>
    </button>
  );
}
