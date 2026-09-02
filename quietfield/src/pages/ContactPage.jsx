import { Link } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';

export default function ContactPage() {
  usePageTitle('Contact — Quietfield');
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-16 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        CONTACT // MUSTERFIELD LABS
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
        Write to the studio
      </h1>
      <div className="mt-10 max-w-prose space-y-8 font-body text-xl leading-relaxed text-qf-cream">
        <p>
          Quietfield is built by Musterfield Labs, an independent creative
          studio. Questions, corrections, accessibility reports, and scenario
          suggestions are all read.
        </p>
        <p>
          Reach the studio through its main channels, or open an issue on the
          project repository if you came in through the code.
        </p>
        <p className="font-mono text-base font-bold uppercase tracking-[0.18em] leading-loose text-qf-tan">
          <Link to="/about" className="text-qf-cream underline underline-offset-4">
            About the project
          </Link>
        </p>
      </div>
    </main>
  );
}
