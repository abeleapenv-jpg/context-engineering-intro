/*
 * CSS palette guardrails (spec §3.6.1 #3/#4, Amendment A):
 * every hex color and every rgba triple in the stylesheet traces back to
 * the four tokens. Pure white never appears, even in glass borders.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Vitest runs from the package root (site/), where the styles live.
const stylesDir = path.resolve(process.cwd(), 'src', 'styles');
const css = readdirSync(stylesDir)
  .filter((f: string) => f.endsWith('.css'))
  .map((f: string) => readFileSync(path.join(stylesDir, f), 'utf8'))
  .join('\n');

/** Token hexes and their rgb triples. */
const TOKEN_HEX = new Set(['#1e1e17', '#efe7db', '#904a30', '#848177']);
const TOKEN_RGB = new Set([
  '30,30,23', // ink
  '239,231,219', // cream
  '144,74,48', // rust
  '132,129,119', // tan
]);

describe('stylesheet palette guardrails', () => {
  it('every hex color is one of the four tokens', () => {
    const hexes = css.match(/#[0-9a-fA-F]{6}/g) ?? [];
    for (const hex of hexes) {
      expect(TOKEN_HEX.has(hex.toLowerCase()), hex).toBe(true);
    }
  });

  it('pure white never appears, in any notation', () => {
    expect(css.toLowerCase()).not.toMatch(/#fff\b|#ffffff\b/);
    expect(css).not.toMatch(/rgba?\(\s*255\s*,\s*255\s*,\s*255/);
  });

  it('every rgba triple is token-derived (glass fill/borders are ink/cream)', () => {
    const triples = [...css.matchAll(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g)];
    for (const [, r, g, b] of triples) {
      expect(TOKEN_RGB.has(`${r},${g},${b}`), `rgba(${r},${g},${b})`).toBe(true);
    }
  });

  it('glassmorphism values match Amendment A (ink 65% fill, cream 8% border)', () => {
    expect(css).toContain('rgba(30, 30, 23, 0.65)');
    expect(css).toContain('rgba(239, 231, 219, 0.08)');
    expect(css).toContain('backdrop-filter: blur(var(--qf-glass-blur))');
    expect(css).toContain('--qf-glass-blur: 12px');
  });
});
