import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';
import { SCENARIOS, CLOSING_LINE, fieldNotesSentence } from '../lib/scenarios';

/*
 * Thank-you / completion page (pre-launch checklist #9). No stats brag, no
 * emoji grid, no leaderboard: one generated sentence from the walker's own
 * pattern, copyable (master plan section 10).
 */
export default function ThankYouPage({ field }) {
  usePageTitle('The field is quiet — Quietfield');
  const [copied, setCopied] = useState(false);

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

      <div className="mt-8">
        <button
          type="button"
          onClick={copyNote}
          className={[
            'cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3',
            'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
            'transition-[border-color,transform] duration-300',
            'hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
            'active:translate-y-[1px]',
          ].join(' ')}
        >
          {copied ? 'Copied' : 'Copy this note'}
        </button>
      </div>

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
