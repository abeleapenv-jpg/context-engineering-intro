/*
 * Registry/docs consistency: every registry component has a docs page,
 * metadata, and a live preview; the docs never drift from the registry.
 */
import { describe, expect, it } from 'vitest';

import { COMPONENTS, getComponent } from '../docs/src/content/components';
import { PREVIEWS } from '../docs/src/content/previews';
import { readRegistry } from '../cli/commands';

describe('registry <-> docs consistency', () => {
  it('every registry component has docs metadata', () => {
    const registry = readRegistry();
    for (const item of registry.items.filter((i) => i.type === 'registry:component')) {
      const meta = getComponent(item.name);
      expect(meta, item.name).toBeDefined();
      expect(meta?.source.length).toBeGreaterThan(100);
    }
  });

  it('every docs component is registered', () => {
    const registry = readRegistry();
    const names = new Set(registry.items.map((i) => i.name));
    for (const meta of COMPONENTS) {
      expect(names.has(meta.slug), meta.slug).toBe(true);
    }
  });

  it('every docs component has a live preview', () => {
    for (const meta of COMPONENTS) {
      expect(PREVIEWS[meta.slug], meta.slug).toBeDefined();
    }
  });

  it('dependencies match between docs metadata and the registry', () => {
    const registry = readRegistry();
    for (const item of registry.items.filter((i) => i.type === 'registry:component')) {
      const meta = getComponent(item.name)!;
      expect([...meta.dependencies].sort()).toEqual(
        [...(item.dependencies ?? [])].sort(),
      );
    }
  });

  it('docs slugs match the registry docs paths', () => {
    const registry = readRegistry();
    for (const item of registry.items.filter((i) => i.type === 'registry:component')) {
      expect(item.docs).toBe(`/components/${item.name}`);
    }
  });
});
