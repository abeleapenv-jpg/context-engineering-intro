/*
 * License page: renders the repository's actual LICENSE file.
 */
import { useEffect } from 'react';

import licenseText from '../../../LICENSE?raw';

export function LicensePage() {
  useEffect(() => {
    document.title = 'License - Animate UI';
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">License</h1>
      <p className="mt-2 text-muted-foreground">
        Animate UI is MIT licensed. Components you copy into your project
        are yours to use, modify, and redistribute under the same terms.
      </p>
      <pre className="mt-8 overflow-x-auto rounded-lg border border-border bg-card p-6 text-[13px] leading-relaxed text-muted-foreground">
        {licenseText}
      </pre>
    </div>
  );
}
