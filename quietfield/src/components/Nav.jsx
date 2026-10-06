import { Link, NavLink } from 'react-router-dom';

import { SUPABASE_CONFIGURED } from '../lib/supabaseClient';
import { useHush } from '../lib/hush';

/*
 * Nav (UX task 1 - hush state): while a scenario is being decided the whole
 * bar dims to opacity-30 and restores on hover or keyboard focus. The dim is
 * lifted permanently the moment the scenario resolves (ScenarioPage flips
 * the hush context). Pure opacity - the bar never stops being interactive.
 */
export default function Nav({ session }) {
  const { hushed } = useHush();

  const linkClass = ({ isActive }) =>
    [
      'font-display text-sm font-bold uppercase tracking-[0.18em]',
      'transition-colors duration-300',
      isActive ? 'text-qf-cream' : 'text-qf-tan hover:text-qf-cream',
    ].join(' ');

  return (
    <header
      className={[
        'sticky top-0 z-40 border-b border-[#848177]/20 bg-qf-ink',
        'transition-opacity duration-700 ease-out motion-reduce:transition-none',
        hushed
          ? 'opacity-30 hover:opacity-100 focus-within:opacity-100'
          : 'opacity-100',
      ].join(' ')}
      data-hush={hushed ? 'on' : 'off'}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-10 lg:px-14"
      >
        <Link to="/" aria-label="Quietfield home" className="group flex items-baseline gap-3">
          {/* Rust square: the one accent, used as a shape, never as text. */}
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 translate-y-[-1px] bg-qf-rust"
          />
          <span className="font-display text-base font-extrabold uppercase tracking-[0.22em] text-qf-cream">
            Quietfield
          </span>
          <span className="hidden font-mono text-sm font-bold uppercase tracking-[0.14em] text-qf-tan sm:inline">
            Masterfield Labs
          </span>
        </Link>

        {/* Mobile: the wordmark above is the home link, so "The Field" is
            redundant below sm; the row wraps instead of overflowing. */}
        <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 sm:gap-x-7">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `${linkClass({ isActive })} hidden sm:inline-flex`}
          >
            The Field
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          {SUPABASE_CONFIGURED ? (
            <NavLink to={session ? '/profile' : '/auth'} className={linkClass}>
              {session ? 'Profile' : 'Sign in'}
            </NavLink>
          ) : (
            <NavLink to="/profile" className={linkClass}>
              Field Notes
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
}
