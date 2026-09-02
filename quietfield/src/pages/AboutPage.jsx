import { Link } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';
import { CLOSING_LINE, FIVE_STEPS } from '../lib/scenarios';

export default function AboutPage() {
  usePageTitle('About — Quietfield');
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-16 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        ABOUT // A MUSTERFIELD LABS PROJECT
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
        One illustration, one decision
      </h1>

      <div className="mt-10 max-w-prose space-y-8 font-body text-xl leading-relaxed text-qf-cream">
        <p>
          Quietfield is a walk through twenty-five everyday social situations,
          five for each of five life stages. Every scenario is a single
          carefully crafted illustration and a single question. There is no
          score, no clock, and no correct answer to look up.
        </p>
        <p>
          The figures in the illustrations are deliberately abstracted and
          faceless. The ambiguity of other people's expressions and intentions
          is the point of every scene: you are given a situation, not a
          verdict. Composition, spacing, and light carry the psychological
          weight - who is at the edge of the frame, who is crowded, who is
          lit differently than the rest.
        </p>
        <p>
          Each choice leads to its own short resolution, written so that
          several reasonable choices cost something and none of them win the
          scenario outright. The lesson underneath all twenty-five is the same:
        </p>
        <blockquote className="border-l-2 border-qf-rust pl-6 sm:pl-8">
          <p className="font-body text-2xl leading-relaxed text-qf-cream">{CLOSING_LINE}</p>
        </blockquote>
        <p className="font-mono text-base font-bold uppercase tracking-[0.18em] leading-loose text-qf-tan">
          {FIVE_STEPS}
        </p>
        <p>
          The site stores only what you decide: which scenarios you have walked
          and which choice you made. Nothing else is collected.{' '}
          <Link to="/contact" className="text-qf-cream underline underline-offset-4">
            Contact the studio
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
