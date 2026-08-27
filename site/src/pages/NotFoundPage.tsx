/*
 * QUIETFIELD 404 (spec §7.5 #2)
 * On-brand, in the site's restrained voice. Not a generic "oops" page.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Not Found - Quietfield';
  }, []);

  return (
    <main className="qf-wrap qf-notfound" data-testid="not-found">
      <h1 className="qf-display">THIS PAGE IS NOT IN THE FIELD</h1>
      <p className="qf-body">
        The address does not match any scenario or stage. The field is quiet here.
      </p>
      <Link className="qf-btn" to="/">
        BACK TO QUIETFIELD
      </Link>
    </main>
  );
}
