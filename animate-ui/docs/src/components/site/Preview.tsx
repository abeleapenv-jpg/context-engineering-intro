/*
 * Preview - the live component stage used across the docs site.
 * The stage sits on a muted surface so both light and dark themes keep
 * clear figure/ground contrast.
 */
import type { ReactNode } from 'react';

export function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div className="flex min-h-56 items-center justify-center bg-muted/50 p-8 sm:p-10">
        {children}
      </div>
      <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Live preview - the real component, not a screenshot.
      </div>
    </div>
  );
}
