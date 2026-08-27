/*
 * QUIETFIELD SHARED CONTROLS
 *
 * Breadcrumbs use the brand's tick motif rather than a default breadcrumb
 * component (§7.5 #3). All hover states reveal real information
 * (§3.6.1 #28): the archetype label tells the visitor what kind of
 * response the choice is before they commit to it.
 */
import { Link } from 'react-router-dom';

export function Tick({ ariaHidden = true }: { ariaHidden?: boolean }) {
  return (
    <span className="qf-tick" aria-hidden={ariaHidden}>
      <svg viewBox="0 0 6 6" width="6" height="6">
        <rect width="6" height="6" fill="var(--qf-tan)" />
      </svg>
    </span>
  );
}

export interface Crumb {
  label: string;
  to: string;
}

/** Stage > Scenario trail, styled with the brand's thin-rule motif. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="qf-breadcrumbs" aria-label="Breadcrumb">
      {trail.map((crumb, i) => (
        <span key={crumb.to} className="qf-crumb">
          {i > 0 ? <Tick /> : null}
          {i === trail.length - 1 ? (
            <span className="qf-label qf-crumb-current" aria-current="page">
              {crumb.label}
            </span>
          ) : (
            <Link to={crumb.to} className="qf-label qf-crumb-link">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Completion marker: a quiet rust square, the brand's single accent. */
export function CompletedMark({ done }: { done: boolean }) {
  return (
    <span
      className={`qf-done-mark ${done ? 'qf-done-mark-on' : ''}`}
      aria-label={done ? 'Completed' : 'Not yet attempted'}
      title={done ? 'Completed' : 'Not yet attempted'}
      data-testid="done-mark"
    />
  );
}

/** "A Musterfield Labs project" footer per §7.5 #17. */
export function SiteFooter() {
  return (
    <footer className="qf-footer">
      <p className="qf-label">A MUSTERFIELD LABS PROJECT</p>
      <p className="qf-label qf-footer-rule">UI / UX · BRANDING · ILLUSTRATION</p>
      <p className="qf-label">INDEPENDENT CREATIVE STUDIO.</p>
    </footer>
  );
}
