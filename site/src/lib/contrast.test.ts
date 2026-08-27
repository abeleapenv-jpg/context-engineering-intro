/*
 * The spec's own contrast table (§3.5.1), codified so the palette can
 * never drift out of compliance without a test failing. Values computed
 * from WCAG 2.x relative luminance.
 */
import { describe, expect, it } from 'vitest';

import { TOKENS } from './tokens';

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

describe('palette contrast (spec §3.5.1)', () => {
  it('has exactly four tokens', () => {
    expect(Object.keys(TOKENS).sort()).toEqual(['cream', 'ink', 'rust', 'tan']);
  });

  it('cream on ink passes normal text (13.66:1)', () => {
    const ratio = contrast(TOKENS.cream, TOKENS.ink);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeCloseTo(13.66, 1);
  });

  it('rust on ink fails even large text (2.56:1) - rust is never text on ink', () => {
    const ratio = contrast(TOKENS.rust, TOKENS.ink);
    expect(ratio).toBeLessThan(3);
    expect(ratio).toBeCloseTo(2.56, 1);
  });

  it('tan on ink passes large text but not normal text (4.30:1)', () => {
    const ratio = contrast(TOKENS.tan, TOKENS.ink);
    expect(ratio).toBeGreaterThanOrEqual(3);
    expect(ratio).toBeLessThan(4.5);
    expect(ratio).toBeCloseTo(4.3, 1);
  });

  it('rust on cream passes normal text (5.34:1)', () => {
    const ratio = contrast(TOKENS.rust, TOKENS.cream);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(ratio).toBeCloseTo(5.34, 1);
  });

  it('tan on cream passes large text only (3.18:1)', () => {
    const ratio = contrast(TOKENS.tan, TOKENS.cream);
    expect(ratio).toBeGreaterThanOrEqual(3);
    expect(ratio).toBeLessThan(4.5);
    expect(ratio).toBeCloseTo(3.18, 1);
  });

  it('rust on tan fails outright (1.68:1)', () => {
    const ratio = contrast(TOKENS.rust, TOKENS.tan);
    expect(ratio).toBeLessThan(3);
    expect(ratio).toBeCloseTo(1.68, 1);
  });
});
