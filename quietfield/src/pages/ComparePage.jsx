import { useNavigate, useParams, Link } from 'react-router-dom';

import usePageTitle from '../lib/usePageTitle';
import { TOTAL, firstUncompletedId } from '../lib/scenarios';
import { decodeWalk, saveCompareCode } from '../lib/walkCode';

/*
 * ComparePage (engagement Phase 3): the landing page behind an invitation
 * link. The code in the URL is decoded strictly and never rendered; the
 * page only says how much of the field the inviter walked. Saving the
 * invitation happens on Begin/Continue click only - never on merely
 * viewing. Not behind the Supabase gate: an invitation opens for anyone.
 */
export default function ComparePage({ field }) {
  const { code } = useParams();
  const navigate = useNavigate();
  usePageTitle('An invitation — Quietfield');

  const theirChoices = decodeWalk(code ?? '');

  if (!theirChoices) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-24 sm:px-10">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
          INVITATION // THIS LINK IS INCOMPLETE
        </p>
        <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-5xl">
          The link looks cut off
        </h1>
        <p className="mt-8 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
          The invitation did not survive the copy. Ask the person who shared it to send it again.
        </p>
        <div className="mt-12">
          <button
            type="button"
            onClick={() => navigate('/')}
            className={[
              'cursor-pointer rounded-[2px] border border-[#848177]/40 bg-transparent px-8 py-3',
              'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
              'transition-[border-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
              'active:translate-y-[1px] motion-reduce:transition-none',
            ].join(' ')}
          >
            Back to the field
          </button>
        </div>
      </main>
    );
  }

  const walked = Object.keys(theirChoices).length;

  function handleBegin() {
    saveCompareCode(code);
    const nextId = firstUncompletedId(field.completed);
    if (nextId) {
      navigate(`/scenario/${nextId}`);
    } else {
      navigate('/together');
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-24 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        INVITATION // A WALK TO COMPARE
      </p>
      <h1 className="mt-6 font-display text-4xl font-extrabold uppercase leading-tight tracking-[0.04em] text-qf-cream sm:text-5xl">
        Someone walked the field before you
      </h1>
      <p className="mt-8 max-w-prose font-body text-xl leading-relaxed text-qf-cream">
        Walk the same twenty-five situations at your own pace. After each choice you will see what
        they chose. At the end, you can see where you read things differently. There are no scores
        and no right answers.
      </p>
      <p className="mt-8 font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        THEY WALKED {walked} OF {TOTAL}
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-6">
        <button
          type="button"
          onClick={handleBegin}
          className={[
            'cursor-pointer rounded-[2px] border border-[#848177]/40 bg-transparent px-8 py-3',
            'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
            'transition-[border-color,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
            'hover:border-[#904A30] focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
            'active:translate-y-[1px] motion-reduce:transition-none',
          ].join(' ')}
        >
          {field.completed.length > 0 ? 'Continue' : 'Begin'}
        </button>
        <Link
          to="/"
          className="cursor-pointer font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-qf-cream focus-visible:text-qf-cream motion-reduce:transition-none"
        >
          Not now
        </Link>
      </div>
    </main>
  );
}
