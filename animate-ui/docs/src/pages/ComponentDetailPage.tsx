/*
 * Component detail: breadcrumbs, tabbed documentation (Preview / Code /
 * Props API), installation, accessibility notes, and previous/next
 * navigation.
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CodeBlock } from '../components/site/CodeBlock';
import { DocsLayout } from '../components/site/DocsLayout';
import { InstallCommand } from '../components/site/InstallCommand';
import { Preview } from '../components/site/Preview';
import { PropsTable } from '../components/site/PropsTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/site/Tabs';
import { ACCESSIBILITY, PROPS_API } from '../content/api';
import { COMPONENTS, getComponent } from '../content/components';
import { PREVIEWS } from '../content/previews';

export function ComponentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const component = slug ? getComponent(slug) : undefined;
  const [tab, setTab] = useState('preview');

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
  const apiDoc = PROPS_API[component.slug];
  const a11yRows = ACCESSIBILITY[component.slug] ?? [];

  const index = COMPONENTS.findIndex((c) => c.slug === component.slug);
  const prev = index > 0 ? COMPONENTS[index - 1] : null;
  const next = index < COMPONENTS.length - 1 ? COMPONENTS[index + 1] : null;

  return (
    <DocsLayout>
      <div className="py-10">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <Link
            to="/components"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Components
          </Link>
          <span aria-hidden="true" className="text-muted-foreground">
            /
          </span>
          <span aria-current="page" className="text-foreground">
            {component.name}
          </span>
        </nav>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {component.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {component.description}
        </p>

        {/* Tabs: Preview / Code / Props API */}
        <section className="mt-10" aria-label="Documentation">
          <Tabs value={tab} onValueChange={setTab} baseId="component-docs">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="props">Props API</TabsTrigger>
            </TabsList>
            <TabsContent value="preview">
              {PreviewComponent ? <Preview>{<PreviewComponent />}</Preview> : null}
            </TabsContent>
            <TabsContent value="code">
              <CodeBlock
                code={component.source}
                filename={`components/ui/${component.slug}.tsx`}
              />
            </TabsContent>
            <TabsContent value="props">
              {apiDoc ? <PropsTable doc={apiDoc} /> : null}
            </TabsContent>
          </Tabs>
        </section>

        {/* Installation */}
        <section className="mt-12" aria-label="Installation">
          <h2 className="text-lg font-semibold">Installation</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The code is yours. Copy the source above, or let the CLI place
            it in your project:
          </p>
          <div className="mt-4 space-y-3">
            <InstallCommand
              command={`npm run add ${component.slug} --prefix animate-ui`}
            />
            <InstallCommand command={`npm i ${component.dependencies.join(' ')}`} />
          </div>
        </section>

        {/* Usage */}
        <section className="mt-12" aria-label="Usage">
          <h2 className="text-lg font-semibold">Usage</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {component.usage}
          </p>
        </section>

        {/* Accessibility */}
        <section className="mt-12" aria-labelledby="accessibility-heading">
          <h2 id="accessibility-heading" className="text-lg font-semibold">
            Accessibility &amp; Keyboard Interactions
          </h2>
          <dl className="mt-4 divide-y divide-border rounded-lg border border-border">
            {a11yRows.map((row) => (
              <div
                key={row.feature}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-4"
              >
                <dt className="text-sm font-medium">{row.feature}</dt>
                <dd className="text-sm text-muted-foreground">{row.behavior}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Previous / next */}
        <nav
          aria-label="Pagination"
          className="mt-12 grid gap-4 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              to={`/components/${prev.slug}`}
              className="group rounded-lg border border-border p-4 transition-colors hover:border-foreground/30"
            >
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="mt-1 font-medium group-hover:underline">
                {prev.name}
              </p>
            </Link>
          ) : (
            <Link
              to="/components"
              className="group rounded-lg border border-border p-4 transition-colors hover:border-foreground/30"
            >
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="mt-1 font-medium group-hover:underline">
                Components index
              </p>
            </Link>
          )}
          {next ? (
            <Link
              to={`/components/${next.slug}`}
              className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-foreground/30"
            >
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="mt-1 font-medium group-hover:underline">
                {next.name}
              </p>
            </Link>
          ) : (
            <Link
              to="/components"
              className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-foreground/30"
            >
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="mt-1 font-medium group-hover:underline">
                Components index
              </p>
            </Link>
          )}
        </nav>
      </div>
    </DocsLayout>
  );
}
