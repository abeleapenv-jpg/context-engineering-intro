import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { supabase } from '../lib/supabaseClient';
import usePageTitle from '../lib/usePageTitle';

/*
 * Auth (master plan section 7, task 4): email/password login + signup
 * toggle, wired to supabase.auth. Only mounted when Supabase is configured;
 * local mode never shows this screen.
 */
export default function Auth() {
  usePageTitle('Sign in — Quietfield');
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const from = location.state?.from ?? '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { error: authError } =
        mode === 'login'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (mode === 'signup') {
        setError(null);
        setMode('check');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Try again.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass = [
    'w-full rounded-[2px] border border-[#848177]/30 bg-transparent px-4 py-3',
    'font-body text-lg text-qf-cream placeholder:text-qf-tan',
    'transition-colors duration-300',
    'focus:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
  ].join(' ');

  return (
    <main className="mx-auto w-full max-w-xl px-6 pb-28 pt-20 sm:px-10">
      <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
        GATE // {mode === 'signup' ? 'NEW WALKER' : 'RETURNING WALKER'}
      </p>
      <h1 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-[0.04em] text-qf-cream">
        {mode === 'signup' ? 'Begin a field' : 'Enter the field'}
      </h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-qf-cream">
        Your progress and choices are saved to your own account. Row Level
        Security keeps them visible to you alone.
      </p>

      {mode === 'check' ? (
        <div className="mt-10 rounded-[2px] border border-[#848177]/20 p-6">
          <p className="font-body text-lg leading-relaxed text-qf-cream">
            Check your inbox for the confirmation link, then sign in. The field
            will be where you left it.
          </p>
          <button
            type="button"
            onClick={() => setMode('login')}
            className="mt-6 cursor-pointer font-display text-sm font-bold uppercase tracking-[0.18em] text-qf-tan underline-offset-4 hover:text-qf-cream hover:underline"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <label className="block">
            <span className="mb-2 block font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
              Email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
              Password
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </label>

          {error ? (
            <p role="alert" className="font-body text-lg text-qf-cream">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className={[
              'cursor-pointer rounded-[2px] border border-[#848177]/40 px-8 py-3',
              'font-display text-sm font-bold uppercase tracking-[0.2em] text-qf-cream',
              'transition-[border-color,transform] duration-300',
              'hover:border-[#904A30] focus-visible:border-[#904A30] focus-visible:outline-none',
              'active:translate-y-[1px] disabled:cursor-wait disabled:opacity-50',
            ].join(' ')}
          >
            {busy ? 'One moment' : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>

          <p className="font-body text-lg text-qf-tan">
            {mode === 'login' ? 'No field yet? ' : 'Already have one? '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="cursor-pointer font-bold text-qf-cream underline underline-offset-4"
            >
              {mode === 'login' ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>
        </form>
      )}

      <p className="mt-14 font-body text-lg text-qf-tan">
        Just walking through?{' '}
        <Link to="/" className="text-qf-cream underline underline-offset-4">
          Return to the field index
        </Link>
        .
      </p>
    </main>
  );
}
