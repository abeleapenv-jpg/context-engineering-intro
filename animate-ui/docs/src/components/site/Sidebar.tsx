/*
 * Sidebar - the docs left rail (desktop only): components grouped by
 * category, then guide pages.
 */
import { NavLink } from 'react-router-dom';

import {
  CATEGORY_LABELS,
  COMPONENTS,
  type Category,
} from '../../content/components';
import { cn } from '../../lib/utils';

const CATEGORY_ORDER: Category[] = [
  'actions',
  'disclosure',
  'layout',
  'overlay',
  'feedback',
];

const GUIDE_PAGES = [
  { label: 'License', to: '/license' },
  { label: 'Contributing', to: '/contributing' },
];

function SidebarLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'block rounded-md px-3 py-1.5 text-sm transition-colors',
          isActive
            ? 'bg-accent font-medium text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
        )
      }
    >
      {children}
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside
      className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4 lg:block"
      aria-label="Documentation"
    >
      <nav className="flex flex-col gap-6">
        <div>
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Components
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {CATEGORY_ORDER.map((category) => {
              const items = COMPONENTS.filter((c) => c.category === category);
              if (items.length === 0) return null;
              return (
                <div key={category} className="mt-2">
                  <p className="px-3 pb-1 text-xs text-muted-foreground/70">
                    {CATEGORY_LABELS[category]}
                  </p>
                  {items.map((component) => (
                    <SidebarLink
                      key={component.slug}
                      to={`/components/${component.slug}`}
                    >
                      {component.name}
                    </SidebarLink>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pages
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {GUIDE_PAGES.map((page) => (
              <SidebarLink key={page.to} to={page.to}>
                {page.label}
              </SidebarLink>
            ))}
          </div>
        </div>
      </nav>
    </aside>
  );
}
