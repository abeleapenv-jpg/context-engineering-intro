/*
 * Registry/docs consistency: every registry component has a docs page,
 * metadata, and a live preview; the docs never drift from the registry.
 */
import { describe, expect, it } from 'vitest';

import { ACCESSIBILITY, PROPS_API } from '../docs/src/content/api';
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

  it('every component has a props API doc and accessibility notes', () => {
    for (const meta of COMPONENTS) {
      const api = PROPS_API[meta.slug];
      expect(api, `${meta.slug} props`).toBeDefined();
      expect(api?.props.length, `${meta.slug} props`).toBeGreaterThan(0);
      for (const row of api!.props) {
        expect(row.name.length).toBeGreaterThan(0);
        expect(row.type.length).toBeGreaterThan(0);
        expect(row.defaultValue.length).toBeGreaterThan(0);
        expect(row.description.length).toBeGreaterThan(0);
      }
      const a11y = ACCESSIBILITY[meta.slug];
      expect(a11y?.length ?? 0, `${meta.slug} a11y`).toBeGreaterThan(0);
    }
  });
});
