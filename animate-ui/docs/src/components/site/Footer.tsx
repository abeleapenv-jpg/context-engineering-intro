/*
 * Docs footer: project links and credits. Every link resolves.
 */
import { Link } from 'react-router-dom';

import { GITHUB_URL } from './Header';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          Built with React, TypeScript, Tailwind CSS, and Motion. MIT
          licensed.
        </p>
        <nav className="flex flex-wrap items-center gap-4" aria-label="Footer">
          <Link to="/components" className="transition-colors hover:text-foreground">
            Components
          </Link>
          <Link to="/license" className="transition-colors hover:text-foreground">
            License
          </Link>
          <Link to="/contributing" className="transition-colors hover:text-foreground">
            Contributing
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={`${GITHUB_URL}/issues`}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-foreground"
          >
            Issues
          </a>
        </nav>
      </div>
    </footer>
  );
}
