import { useEffect, useRef, useState } from 'react';

import { buildWalkLink } from '../lib/walkCode';

/*
 * InviteButton (engagement Phase 3): share an invitation link that carries
 * only the walker's 25 choice letters - no name, no email, nothing else.
 * navigator.share where the platform allows it, clipboard next, and a
 * selectable read-only input if neither channel works; never a silent
 * failure. Renders nothing until the walker has made at least one choice.
 */
export default function InviteButton({ choices }) {
  const [flash, setFlash] = useState(null); // 'Link copied' | 'Shared'
  const [manualLink, setManualLink] = useState(null);
  const timerRef = useRef(null);

  // The flash label is momentary; its timer never outlives the page.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (Object.keys(choices ?? {}).length === 0) return null;

  function flashLabel(label) {
    setFlash(label);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFlash(null), 2400);
  }

  async function handleInvite() {
    const url = buildWalkLink(choices);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'Quietfield',
          text: 'Walk the same twenty-five situations and see where we read them differently.',
          url,
        });
        flashLabel('Shared');
        return;
      } catch (err) {
        if (err?.name === 'AbortError') return; // they changed their mind
        /* any other share failure falls through to the clipboard */
      }
    }
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        flashLabel('Link copied');
        return;
      } catch {
        /* fall through to the selectable link below */
      }
    }
    setManualLink(url); // neither channel worked: let them copy by hand
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleInvite}
        className={[
          'cursor-pointer rounded-[2px] border border-[#848177]/40 bg-transparent px-8 py-3',
          'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
          'transition-[border-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
          'active:translate-y-[1px] motion-reduce:transition-none',
        ].join(' ')}
      >
        {flash ?? 'Invite someone to walk it'}
      </button>
      <p className="mt-3 font-body text-lg text-qf-tan">
        The link holds only your choices: no name, no email.
      </p>
      {manualLink ? (
        /* Fallback when neither share nor clipboard is available: the full
           link, selectable, instead of failing silently. */
        <input
          type="text"
          readOnly
          aria-label="Invitation link"
          value={manualLink}
          onFocus={(event) => event.target.select()}
          className="mt-4 w-full max-w-md rounded-[2px] border border-[#848177]/40 bg-transparent px-4 py-3 font-mono text-sm text-qf-cream"
        />
      ) : null}
    </div>
  );
}
