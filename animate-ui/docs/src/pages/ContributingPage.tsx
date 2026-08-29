/*
 * Contributing page: renders the repository's actual CONTRIBUTING.md.
 */
import { useEffect } from 'react';

import contributingText from '../../../CONTRIBUTING.md?raw';

export function ContributingPage() {
  useEffect(() => {
    document.title = 'Contributing - Animate UI';
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Contributing</h1>
      <p className="mt-2 text-muted-foreground">
        Components are editable source code, not a locked package - every
        change you make is what users copy. Read the full guide below.
      </p>
      <pre className="mt-8 overflow-x-auto whitespace-pre-wrap rounded-lg border border-border bg-card p-6 text-[13px] leading-relaxed text-muted-foreground">
        {contributingText}
      </pre>
    </div>
  );
}
