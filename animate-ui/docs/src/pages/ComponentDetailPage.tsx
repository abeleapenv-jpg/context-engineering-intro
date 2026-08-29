/*
 * Component detail: live preview, install, usage, and real source.
 */
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CodeBlock } from '../components/site/CodeBlock';
import { InstallCommand } from '../components/site/InstallCommand';
import { Preview } from '../components/site/Preview';
import { getComponent } from '../content/components';
import { PREVIEWS } from '../content/previews';

export function ComponentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const component = slug ? getComponent(slug) : undefined;

  useEffect(() => {
    document.title = component
      ? `${component.name} - Animate UI`
      : 'Component not found - Animate UI';
  }, [component]);

  if (!component) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Component not found</h1>
        <p className="mt-2 text-muted-foreground">
          That component is not in the registry.
        </p>
        <Link
          to="/components"
          className="mt-6 inline-flex h-9 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Browse components
        </Link>
      </div>
    );
  }

  const PreviewComponent = PREVIEWS[component.slug];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <Link
        to="/components"
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← Components
      </Link>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{component.name}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{component.description}</p>

      <section className="mt-10" aria-label="Live preview">
        {PreviewComponent ? <Preview>{<PreviewComponent />}</Preview> : null}
      </section>

      <section className="mt-10" aria-label="Installation">
        <h2 className="text-lg font-semibold">Installation</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The code is yours. Copy the source below, or let the CLI place it
          in your project:
        </p>
        <div className="mt-4 space-y-3">
          <InstallCommand command={`npm run add ${component.slug} --prefix animate-ui`} />
          <InstallCommand command={`npm i ${component.dependencies.join(' ')}`} />
        </div>
      </section>

      <section className="mt-10" aria-label="Usage">
        <h2 className="text-lg font-semibold">Usage</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {component.usage}
        </p>
      </section>

      <section className="mt-10" aria-label="Source">
        <h2 className="text-lg font-semibold">Source</h2>
        <div className="mt-4">
          <CodeBlock code={component.source} filename={`components/ui/${component.slug}.tsx`} />
        </div>
      </section>
    </div>
  );
}
