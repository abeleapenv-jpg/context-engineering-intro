import { Link } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';

export default function NotFoundPage() {
  usePageTitle('Nothing here — Quietfield');
  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-24 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        404 // NOTHING GROWS HERE
      </p>
      <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-5xl">
        This corner of the field is empty
      </h1>
      <p className="mt-8 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
        The page you asked for does not exist. The walk itself starts at the
        field index.
      </p>
      <Link
        to="/"
        className={[
          'mt-10 inline-block cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3',
          'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
          'transition-[border-color,transform] duration-300',
          'hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
          'active:translate-y-[1px]',
        ].join(' ')}
      >
        Back to the field
      </Link>
    </main>
  );
}
