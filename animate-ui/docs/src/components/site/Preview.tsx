/*
 * Preview - the live component stage used across the docs site.
 */
import type { ReactNode } from 'react';

export function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border">
      <div className="flex min-h-48 items-center justify-center bg-background p-8">
        {children}
      </div>
      <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        Live preview - the real component, not a screenshot.
      </div>
    </div>
  );
}
