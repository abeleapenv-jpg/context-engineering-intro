/*
 * Fuzzy search for the docs: subsequence matching over component and
 * guide pages, scored by label-priority, match position, and consecutive
 * runs.
 */
import { COMPONENTS } from '../content/components';

export interface SearchItem {
  id: string;
  label: string;
  description: string;
  path: string;
  group: 'Components' | 'Pages';
}

const PAGES: SearchItem[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Landing page and motion standards',
    path: '/',
    group: 'Pages',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Browse every component by category',
    path: '/components',
    group: 'Pages',
  },
  {
    id: 'license',
    label: 'License',
    description: 'MIT license text',
    path: '/license',
    group: 'Pages',
  },
  {
    id: 'contributing',
    label: 'Contributing',
    description: 'How to contribute components to the registry',
    path: '/contributing',
    group: 'Pages',
  },
];

export function buildSearchIndex(): SearchItem[] {
  const components: SearchItem[] = COMPONENTS.map((component) => ({
    id: component.slug,
    label: component.name,
    description: component.description,
    path: `/components/${component.slug}`,
    group: 'Components' as const,
  }));
  return [...PAGES, ...components];
}

function normalize(value: string): string {
  return value.toLowerCase();
}

/** Subsequence match: every query char appears in order. */
export function fuzzyMatch(text: string, query: string): boolean {
  const t = normalize(text);
  const q = normalize(query).trim();
  if (!q) return true;
  let i = 0;
  for (const ch of q) {
    const idx = t.indexOf(ch, i);
    if (idx === -1) return false;
    i = idx + 1;
  }
  return true;
}

/** Indices of the matched characters (for highlighting). */
export function matchIndices(text: string, query: string): number[] {
  const t = normalize(text);
  const q = normalize(query).trim();
  const out: number[] = [];
  let i = 0;
  for (const ch of q) {
    const idx = t.indexOf(ch, i);
    if (idx === -1) return out;
    out.push(idx);
    i = idx + 1;
  }
  return out;
}

function scoreItem(item: SearchItem, query: string): number {
  const q = normalize(query).trim();
  const labelIndices = matchIndices(item.label, q);
  if (labelIndices.length === q.length) {
    // Label matches: early match and consecutive runs win.
    let score = 1000 - labelIndices[0] * 4 - item.label.length;
    let runs = 0;
    for (let k = 1; k < labelIndices.length; k++) {
      if (labelIndices[k] === labelIndices[k - 1] + 1) runs++;
    }
    return score + runs * 10;
  }
  const descriptionIndices = matchIndices(item.description, q);
  if (descriptionIndices.length === q.length) {
    return 400 - descriptionIndices[0] * 2 - item.description.length / 10;
  }
  return -1;
}

export function searchItems(query: string, limit = 8): SearchItem[] {
  const q = normalize(query).trim();
  const index = buildSearchIndex();
  if (!q) return index.slice(0, limit);
  return index
    .filter(
      (item) =>
        fuzzyMatch(item.label, q) ||
        fuzzyMatch(item.description, q) ||
        fuzzyMatch(item.group, q),
    )
    .sort((a, b) => scoreItem(b, q) - scoreItem(a, q))
    .slice(0, limit);
}
