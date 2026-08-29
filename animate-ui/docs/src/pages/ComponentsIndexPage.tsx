/*
 * Component index: browse by category.
 */
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { CATEGORY_LABELS, COMPONENTS, type Category } from '../content/components';

const CATEGORY_ORDER: Category[] = [
  'actions',
  'disclosure',
  'layout',
  'overlay',
  'feedback',
];

export function ComponentsIndexPage() {
  useEffect(() => {
    document.title = 'Components - Animate UI';
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 text-muted-foreground">
        Pick a component to see a live preview, installation commands, and
        the exact source you will copy.
      </p>
      {CATEGORY_ORDER.map((category) => {
        const items = COMPONENTS.filter((c) => c.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-12" aria-label={CATEGORY_LABELS[category]}>
            <h2 className="text-sm font-medium text-muted-foreground">
              {CATEGORY_LABELS[category]}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((component) => (
                <Link
                  key={component.slug}
                  to={`/components/${component.slug}`}
                  className="group rounded-lg border border-border p-5 transition-colors hover:border-foreground/30"
                >
                  <h3 className="font-semibold group-hover:underline">
                    {component.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
