/*
 * Animate UI CLI - registry resolution, copy, and reporting.
 */
import { readFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(CLI_DIR, '..');

export function repoRoot() {
  return ROOT;
}

export function readRegistry() {
  const raw = readFileSync(path.join(ROOT, 'registry', 'registry.json'), 'utf8');
  return JSON.parse(raw);
}

export function findItem(name) {
  return readRegistry().items.find((item) => item.name === name) ?? null;
}

function relativeToCwd(target) {
  return path.isAbsolute(target) ? target : path.resolve(process.cwd(), target);
}

async function copyFileTo(source, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  const target = path.join(targetDir, path.basename(source));
  copyFileSync(source, target);
  return target;
}

export function printHelp() {
  console.log(
    [
      'Animate UI - copy components into your project.',
      '',
      'Usage:',
      '  node cli/index.js add <component...> [--dir <target>]',
      '  node cli/index.js list',
      '',
      'Commands:',
      '  add    Copy components (and the cn() util when needed) into --dir.',
      '         Default target: ./components/ui relative to the current directory.',
      '  list   Print every component in the registry.',
      '',
      'Examples:',
      '  node cli/index.js add button accordion',
      '  node cli/index.js add dialog --dir src/components/ui',
    ].join('\n'),
  );
}

export function listComponents() {
  const registry = readRegistry();
  const components = registry.items.filter(
    (item) => item.type === 'registry:component',
  );
  if (components.length === 0) {
    console.log('Registry is empty.');
    return false;
  }
  const width = Math.max(...components.map((c) => c.name.length));
  console.log('Available components:');
  for (const item of components) {
    console.log(`  ${item.name.padEnd(width)}  ${item.description}`);
  }
  return true;
}

/** One install transaction: resolve items, copy files, report deps. */
export async function addComponents(names, targetDir) {
  const registry = readRegistry();
  const resolved = [];
  const missing = [];

  for (const name of names) {
    const item = registry.items.find((i) => i.name === name);
    if (!item) {
      missing.push(name);
      continue;
    }
    resolved.push(item);
  }

  if (missing.length > 0) {
    console.error(`Unknown component${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
    listComponents();
    return false;
  }

  // Pull in the cn() util for anything that depends on it.
  const namesSet = new Set(resolved.map((r) => r.name));
  for (const item of resolved) {
    for (const dep of item.registryDependencies ?? []) {
      if (!namesSet.has(dep)) {
        const depItem = registry.items.find((i) => i.name === dep);
        if (depItem) resolved.push(depItem);
        namesSet.add(dep);
      }
    }
  }

  const target = relativeToCwd(targetDir);
  const installed = [];
  for (const item of resolved) {
    for (const file of item.files) {
      const source = path.join(ROOT, file.path);
      if (!existsSync(source)) {
        console.error(`Registry error: ${file.path} is missing from the repository.`);
        return false;
      }
      const targetFile = await copyFileTo(source, target);
      installed.push({ name: item.name, file: path.relative(process.cwd(), targetFile) });
    }
  }

  const dependencies = [
    ...new Set(resolved.flatMap((item) => item.dependencies ?? [])),
  ].sort();

  console.log(`Installed ${resolved.length} item${resolved.length > 1 ? 's' : ''}:`);
  for (const { name, file } of installed) console.log(`  - ${name} -> ${file}`);

  if (dependencies.length > 0) {
    console.log('\nInstall dependencies:');
    console.log(`  npm i ${dependencies.join(' ')}`);
  }

  console.log(
    '\nThese components use semantic Tailwind tokens (bg-background,',
    'text-foreground, border-border, ring-ring, ...). Add the theme',
    'block below to your index.css so those utilities resolve:\n',
  );
  console.log(THEME_SNIPPET);
  return true;
}

export const THEME_SNIPPET = `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: oklch(0.985 0 0);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}`;
