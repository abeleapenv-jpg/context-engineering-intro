/*
 * QUIETFIELD BRAND TOKENS (TypeScript side)
 *
 * Mirrors src/styles/tokens.css. Source of truth:
 * docs/quietfield_3d_animation_layer.md §3.5 (+ Amendment A).
 * Exactly four color tokens exist; nothing outside them ships (§3.6.1 #4).
 * CONTRAST (spec §3.5.1): rust is never text on ink (2.56:1, fails even
 * large). tan on ink is large/UI only. Body copy on ink is cream.
 */
export const TOKENS = {
  ink: '#1e1e17',
  cream: '#efe7db',
  rust: '#904a30',
  tan: '#848177',
} as const;

/** The only accent use that is always compliant: rust on cream. */
export const RUST_ON_CREAM = TOKENS.rust;

/** hex -> rgba() with an alpha, so any glass fill/border derives from a
 *  token instead of introducing new colors (Amendment A: #3/#4 intact;
 *  pure white `rgba(255,255,255,...)` never appears). */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Token-derived glassmorphism values (Amendment A, studio-approved
 * override of §3.6.1 #8). Fill = ink at 65%, border = cream at 8%,
 * hover border brightening = cream at 32%. Corners stay <= 2px.
 */
export const GLASS = {
  blur: '12px',
  fill: withAlpha(TOKENS.ink, 0.65),
  border: withAlpha(TOKENS.cream, 0.08),
  borderHover: withAlpha(TOKENS.cream, 0.32),
} as const;

/** Scene fog matches the ink background (Amendment A: the reference value
 *  0x0e1117 was replaced by ink to honor the four-token rule). */
export const FOG = {
  color: TOKENS.ink,
  density: 0.04,
} as const;
