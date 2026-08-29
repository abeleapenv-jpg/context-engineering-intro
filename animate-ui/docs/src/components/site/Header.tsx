/*
 * Docs header: wordmark, nav, theme toggle.
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

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Animate UI home">
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
        <nav className="flex items-center gap-1" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground'
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
            className="ml-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            GitHub
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 7h10v10M7 17 17 7" />
            </svg>
          </a>
          <span className="ml-2">
            <ThemeToggle />
          </span>
        </nav>
      </div>
    </header>
  );
}
