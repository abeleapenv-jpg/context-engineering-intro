/*
 * CLI behavior: registry resolution, copy, dependency reporting,
 * failure modes.
 */
import { mkdtempSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  addComponents,
  findItem,
  listComponents,
  readRegistry,
  repoRoot,
} from '../cli/commands';

let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(path.join(tmpdir(), 'animate-ui-test-'));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('registry', () => {
  it('contains the six components plus utils, all with real files', () => {
    const registry = readRegistry();
    const components = registry.items.filter((i) => i.type === 'registry:component');
    expect(components.map((c) => c.name).sort()).toEqual([
      'accordion',
      'button',
      'card',
      'dialog',
      'skeleton',
      'tooltip',
    ]);
    for (const item of registry.items) {
      for (const file of item.files) {
        expect(existsSync(path.join(repoRoot(), file.path)), file.path).toBe(true);
      }
    }
  });

  it('finds items by name', () => {
    expect(findItem('button')?.name).toBe('button');
    expect(findItem('does-not-exist')).toBeNull();
  });
});

describe('list', () => {
  it('lists components', () => {
    expect(listComponents()).toBe(true);
  });
});

describe('add', () => {
  it('copies the component and its cn() dependency, then reports deps', async () => {
    const target = path.join(tmp, 'src', 'components', 'ui');
    const ok = await addComponents(['button'], target);
    expect(ok).toBe(true);
    expect(existsSync(path.join(target, 'button.tsx'))).toBe(true);
    expect(existsSync(path.join(target, 'utils.ts'))).toBe(true);
  });

  it('copies multiple components in one call', async () => {
    const target = path.join(tmp, 'ui');
    const ok = await addComponents(['card', 'skeleton'], target);
    expect(ok).toBe(true);
    expect(existsSync(path.join(target, 'card.tsx'))).toBe(true);
    expect(existsSync(path.join(target, 'skeleton.tsx'))).toBe(true);
  });

  it('fails cleanly on unknown components', async () => {
    const ok = await addComponents(['nope'], path.join(tmp, 'ui'));
    expect(ok).toBe(false);
  });

  it('the theme snippet it prints contains the semantic token mapping', async () => {
    const { THEME_SNIPPET } = await import('../cli/commands');
    expect(THEME_SNIPPET).toContain('--color-background: var(--background)');
    expect(THEME_SNIPPET).toContain('--color-ring: var(--ring)');
  });

  it('copied source is identical to the repository source', async () => {
    const target = path.join(tmp, 'ui');
    await addComponents(['accordion'], target);
    const copied = readFileSync(path.join(target, 'accordion.tsx'), 'utf8');
    const original = readFileSync(
      path.join(repoRoot(), 'components', 'ui', 'accordion.tsx'),
      'utf8',
    );
    expect(copied).toBe(original);
  });
});
