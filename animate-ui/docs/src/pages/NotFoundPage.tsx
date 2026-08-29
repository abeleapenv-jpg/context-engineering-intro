/*
 * 404 - short, on-brand, links home.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Not found - Animate UI';
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">This page does not exist</h1>
      <p className="max-w-sm text-muted-foreground">
        The route you followed is not part of Animate UI. Check the
        components index instead.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex h-9 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Back home
      </Link>
    </div>
  );
}
