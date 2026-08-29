/*
 * Home: hero, features, component grid, motion standards.
 * Entrance animations are quick, staggered fades that Motion strips to
 * opacity-only under reduced motion.
 */
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { InstallCommand } from '../components/site/InstallCommand';
import { CATEGORY_LABELS, COMPONENTS } from '../content/components';

const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export function HomePage() {
  useEffect(() => {
    document.title = 'Animate UI - Components that move well';
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-20 text-center">
        <motion.span
          {...FADE_UP}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
        >
          v0.1.0 · MIT licensed · React + Tailwind + Motion
        </motion.span>
        <motion.h1
          {...FADE_UP}
          transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
          className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Components that move well.
        </motion.h1>
        <motion.p
          {...FADE_UP}
          transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
          className="max-w-xl text-muted-foreground"
        >
          Beautifully animated, accessible React components. Copy them,
          install them, or fetch them with the CLI - the code is yours,
          never a locked package.
        </motion.p>
        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/components"
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse components
          </Link>
          <Link
            to="/contributing"
            className="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Contributing
          </Link>
        </motion.div>
        <motion.div
          {...FADE_UP}
          transition={{ duration: 0.3, delay: 0.2, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <InstallCommand command="npm i clsx tailwind-merge class-variance-authority motion" />
        </motion.div>
      </section>

      {/* Features */}
      <motion.section
        {...FADE_UP}
        transition={{ duration: 0.3, delay: 0.25, ease: 'easeOut' }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Features"
      >
        {[
          {
            title: 'Editable code',
            body: 'Components ship as source files. Modify them in your own codebase, no patches, no forks.',
          },
          {
            title: 'Motion built in',
            body: 'Presses, disclosures, and modals animate with Motion - and respect reduced motion.',
          },
          {
            title: 'TypeScript first',
            body: 'Typed props and variant APIs with class-variance-authority throughout.',
          },
          {
            title: 'Accessible',
            body: 'ARIA states, keyboard support, and focus management are part of every component.',
          },
        ].map((feature) => (
          <div key={feature.title} className="rounded-lg border border-border p-5">
            <h2 className="text-sm font-semibold">{feature.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{feature.body}</p>
          </div>
        ))}
      </motion.section>

      {/* Component grid */}
      <motion.section
        {...FADE_UP}
        transition={{ duration: 0.3, delay: 0.3, ease: 'easeOut' }}
        className="mt-20"
        aria-label="Components"
      >
        <h2 className="text-lg font-semibold">Components</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COMPONENTS.map((component) => (
            <Link
              key={component.slug}
              to={`/components/${component.slug}`}
              className="group rounded-lg border border-border p-5 transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-foreground/30"
            >
              <p className="text-xs text-muted-foreground">
                {CATEGORY_LABELS[component.category]}
              </p>
              <h3 className="mt-1 font-semibold group-hover:underline">
                {component.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {component.description}
              </p>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Motion standards */}
      <motion.section
        {...FADE_UP}
        transition={{ duration: 0.3, delay: 0.35, ease: 'easeOut' }}
        className="mt-20 rounded-lg border border-border p-6"
        aria-label="Motion standards"
      >
        <h2 className="text-lg font-semibold">Motion standards</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>Every animation must answer: does it communicate state, or would the UI be identical without it?</li>
          <li>Micro-interactions stay at or under 200ms; springs are for tactile feedback only.</li>
          <li>prefers-reduced-motion disables transforms and transitions everywhere, including previews.</li>
          <li>Not every component moves. Card and Skeleton are deliberately calm.</li>
        </ul>
      </motion.section>
    </div>
  );
}
