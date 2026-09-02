import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ProgressBar from '../components/ProgressBar';
import { supabase, SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { clearLocalField } from '../lib/progress';
import usePageTitle from '../lib/usePageTitle';
import { SCENARIOS, STAGES, choiceByKey, scenariosForStage } from '../lib/scenarios';

/*
 * Profile: the walker's own record. In Supabase mode this is the signed-in
 * account; in local mode it is this browser's field, stated honestly.
 */
export default function ProfilePage({ session, field, refreshField }) {
  usePageTitle('Field Notes — Quietfield');
  const navigate = useNavigate();
  const [cleared, setCleared] = useState(false);

  async function handleSignOut() {
    if (SUPABASE_CONFIGURED) await supabase.auth.signOut();
    navigate('/');
  }

  function handleClearLocal() {
    clearLocalField();
    setCleared(true);
    refreshField();
  }

  const decided = Object.entries(field.choices);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 pb-28 pt-16 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        RECORD // {SUPABASE_CONFIGURED ? 'YOUR ACCOUNT' : 'THIS BROWSER'}
      </p>
      <h1 className="mt-4 font-display text-4xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
        Field Notes
      </h1>

      <p className="mt-6 max-w-prose font-body text-lg leading-relaxed text-qf-cream">
        {SUPABASE_CONFIGURED
          ? session
            ? `Signed in as ${session.user.email}. Your progress and choices are protected by Row Level Security: only this account can read them.`
            : 'You are not signed in. Sign in to keep your field across devices.'
          : 'This build runs in local mode: no Supabase project is connected, so your field is saved in this browser only (it survives refresh). Connect a project with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts.'}
      </p>

      {SUPABASE_CONFIGURED && !session ? (
        <Link
          to="/auth"
          className="mt-8 inline-block cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream transition-colors duration-300 hover:border-[#904A30]"
        >
          Sign in
        </Link>
      ) : null}

      <div className="mt-14 max-w-md">
        <ProgressBar done={field.completed.length} total={SCENARIOS.length} label="The whole field" />
      </div>

      <section className="mt-14 space-y-8">
        {STAGES.map((stage) => {
          const scenarios = scenariosForStage(stage.id);
          const done = scenarios.filter((s) => field.completed.includes(s.id)).length;
          return (
            <div key={stage.id}>
              <ProgressBar done={done} total={scenarios.length} label={`Stage ${stage.numeral} · ${stage.name}`} />
            </div>
          );
        })}
      </section>

      <section className="mt-20">
        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
          Choices made // {decided.length}
        </h2>
        {decided.length === 0 ? (
          <p className="mt-6 font-body text-lg text-qf-tan">
            Nothing recorded yet.{' '}
            <Link to="/" className="text-qf-cream underline underline-offset-4">
              Walk the first scenario
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-[#848177]/20 border-y border-[#848177]/20">
            {SCENARIOS.filter((s) => field.choices[s.id]).map((scenario) => {
              const choice = choiceByKey(scenario, field.choices[scenario.id]);
              return (
                <li
                  key={scenario.id}
                  className="grid grid-cols-[5rem_1fr_auto] items-baseline gap-4 py-4"
                >
                  <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                    {scenario.id}
                  </span>
                  <span className="font-body text-lg text-qf-cream">{choice?.text}</span>
                  <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
                    {choice ? `${choice.key} · ${choice.archetype}` : ''}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-16 border-t border-[#848177]/20 pt-8">
        {SUPABASE_CONFIGURED && session ? (
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer font-display text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 hover:text-qf-cream"
          >
            Sign out
          </button>
        ) : !SUPABASE_CONFIGURED ? (
          <>
            <button
              type="button"
              onClick={handleClearLocal}
              className="cursor-pointer font-display text-sm font-bold uppercase tracking-[0.18em] text-qf-tan transition-colors duration-300 hover:text-qf-cream"
            >
              Clear this browser's field
            </button>
            {cleared ? (
              <p className="mt-3 font-body text-lg text-qf-cream">
                Cleared. The field is empty again.
              </p>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
