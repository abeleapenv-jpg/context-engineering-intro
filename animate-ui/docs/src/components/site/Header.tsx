/*
 * Docs header: wordmark, nav (desktop), search trigger, theme toggle,
 * and the mobile hamburger.
 */
import { Link, NavLink } from 'react-router-dom';

import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { to: '/components', label: 'Components' },
  { to: '/license', label: 'License' },
  { to: '/contributing', label: 'Contributing' },
];

export const GITHUB_URL =
  'https://github.com/abeleapenv-jpg/context-engineering-intro/tree/arena/01a043f1-context-engineering-intro/animate-ui';

export interface HeaderProps {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
}

export function Header({ onMenuOpen, onSearchOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-2 px-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Open menu"
            aria-expanded="false"
            aria-controls="mobile-drawer"
            className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md"
            aria-label="Animate UI home"
          >
            <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="12" fill="currentColor" opacity="0.9" />
              <g fill="var(--background)">
                <rect x="16" y="32" width="6" height="18" rx="1.5" />
                <rect x="29" y="22" width="6" height="28" rx="1.5" />
                <rect x="42" y="12" width="6" height="38" rx="1.5" />
              </g>
            </svg>
            <span className="text-sm font-semibold tracking-tight">
              animate<span className="text-muted-foreground">/</span>ui
            </span>
          </Link>
        </div>

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main"
        >
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            GitHub
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M7 7h10v10M7 17 17 7" />
            </svg>
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearchOpen}
            className="hidden items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
            aria-label="Open search"
          >
            Search
            <kbd className="rounded border border-border bg-muted/60 px-1 py-0.5 text-[10px]">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
