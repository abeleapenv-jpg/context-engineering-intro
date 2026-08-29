/*
 * DocsLayout - two-column docs layout: sticky sidebar (desktop) with the
 * page content beside it.
 */
import type { ReactNode } from 'react';

import { Sidebar } from './Sidebar';

export function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <Sidebar />
      <div className="min-w-0 pb-24">{children}</div>
    </div>
  );
}
