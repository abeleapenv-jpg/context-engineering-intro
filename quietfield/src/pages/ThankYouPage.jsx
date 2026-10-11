import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import InviteButton from '../components/InviteButton';
import usePageTitle from '../lib/usePageTitle';
import { buildFieldCard, canvasAvailable } from '../lib/fieldCard';
import { readTheirChoices } from '../lib/walkCode';
import { SCENARIOS, CLOSING_LINE, STUDIO_CREDIT, fieldNotesSentence } from '../lib/scenarios';

/*
 * Thank-you / completion page (pre-launch checklist #9). No stats brag, no
 * emoji grid, no leaderboard: one generated sentence from the walker's own
 * pattern, copyable (master plan section 10).
 */
export default function ThankYouPage({ field }) {
  usePageTitle('The field is quiet — Quietfield');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimerRef = useRef(null);
  // jsdom (smoke test) has no canvas: the card button hides entirely there.
  const cardSupported = useMemo(() => canvasAvailable(), []);

  // The "Saved" label is momentary; its timer never outlives the page.
  useEffect(() => () => clearTimeout(savedTimerRef.current), []);

  if (field.completed.length < SCENARIOS.length) {
    // Not everything is walked yet - this page is only for the finished walk.
    return <Navigate to="/" replace />;
  }

  const note = fieldNotesSentence(field.counts) ?? CLOSING_LINE;

  async function copyNote() {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

  // Field card (engagement Phase 2): share where the platform allows,
  // download otherwise. Quiet on any failure - no error surfaces here.
  async function saveCard() {
    try {
      const blob = await buildFieldCard({ note, counts: field.counts, studioCredit: STUDIO_CREDIT });
      const file = new File([blob], 'quietfield-field-card.png', { type: 'image/png' });
      let shared = false;
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file] });
          shared = true;
        } catch (err) {
          if (err?.name === 'AbortError') return; // the walker changed their mind
          /* any other share failure falls through to the plain download */
        }
      }
      if (!shared) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quietfield-field-card.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 0);
      }
      setSaved(true);
      clearTimeout(savedTimerRef.current);
      savedTimerRef.current = setTimeout(() => setSaved(false), 2400);
    } catch {
      /* stay quiet: the card is a gift, not a requirement */
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-24 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        COMPLETE // 25 OF 25 DECISIONS
      </p>
      <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-5xl">
        The field is quiet
      </h1>

      <blockquote className="mt-14 max-w-prose border-l-2 border-qf-rust pl-6 sm:pl-8">
        <p className="font-body text-2xl leading-relaxed text-qf-cream">{note}</p>
      </blockquote>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={copyNote}
          className={[
            'cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3',
            'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
            'transition-[border-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
            'active:translate-y-[1px] motion-reduce:transition-none',
          ].join(' ')}
        >
          {copied ? 'Copied' : 'Copy this note'}
        </button>
        {cardSupported ? (
          <button
            type="button"
            onClick={saveCard}
            className={[
              'cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3',
              'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
              'transition-[border-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
              'active:translate-y-[1px] motion-reduce:transition-none',
            ].join(' ')}
          >
            {saved ? 'Saved' : 'Save your field card'}
          </button>
        ) : null}
      </div>

      {/* Walk-together (engagement Phase 3): invite a friend, or - when the
          visitor arrived through an invitation - see where you differed. */}
      <InviteButton choices={field.choices} />
      {readTheirChoices() !== null ? (
        <p className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
          <Link
            to="/together"
            className="transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-qf-cream focus-visible:text-qf-cream motion-reduce:transition-none"
          >
            See where you differed
          </Link>
        </p>
      ) : null}

      <p className="mt-14 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
        {CLOSING_LINE}
      </p>

      <p className="mt-14 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        <Link to="/" className="transition-colors duration-300 hover:text-qf-cream">
          Walk it again
        </Link>
        {' · '}
        <Link to="/profile" className="transition-colors duration-300 hover:text-qf-cream">
          Your field notes
        </Link>
      </p>
    </main>
  );
}
