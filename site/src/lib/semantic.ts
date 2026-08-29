/*
 * QUIETFIELD SEMANTIC UTILITIES
 *
 * Pure functions implementing the §2 semantic language in 2D:
 *   - dolly-in  = narrowing attention (zoom up, field tightens)
 *   - dolly-out = widening context   (zoom down, field opens)
 *   - depth of field via the background blur amount
 *   - elevation of the camera = overview / reflective distance
 */

import type { CameraDirective, CameraState, DepthOfField } from './camera';

/** DOF value 0..1: 0 = deep focus (full awareness), 1 = shallow (tunnel vision). */
export function dofValue(kind: DepthOfField): number {
  return kind === 'shallow' ? 1 : 0;
}

/** Narrowing attention: push in and tighten focus. Impulsive or deliberate
 *  depending on easeKind - cut = impulse, ease = deliberation (§2). */
export function dollyIn(
  home: CameraState,
  easeKind: 'cut' | 'fast' | 'ease',
  opts: { depth?: number; durationMs?: number; meaning?: string } = {},
): CameraDirective {
  const depth = opts.depth ?? 0.6;
  return {
    to: { ...home, zoom: home.zoom * 1.5, depth },
    ease: easeKind,
    meaning: easeKind === 'ease' ? 'deliberation' : 'narrowing attention',
    durationMs: opts.durationMs,
  };
}

/** Widening context: pull back and open the field. Always eased - a widened
 *  frame is the visual signature of deliberation (§2, §4 beat 3). */
export function dollyOut(
  home: CameraState,
  opts: { zoom?: number; depth?: number; durationMs?: number } = {},
): CameraDirective {
  const depth = opts.depth ?? 0;
  return {
    to: { ...home, zoom: opts.zoom ?? home.zoom * 0.55, depth },
    ease: 'ease',
    meaning: 'widening context',
    durationMs: opts.durationMs,
  };
}

/** A deliberate crawl toward a subject: proximity as negotiated distance
 *  (scenario 1A, §5.3). Speed is the tell - slow means regulated. */
export function easeSettle(
  home: CameraState,
  opts: { zoom?: number; durationMs?: number } = {},
): CameraDirective {
  return {
    to: { ...home, zoom: opts.zoom ?? home.zoom, depth: 0 },
    ease: 'ease',
    meaning: 'settling',
    durationMs: opts.durationMs,
  };
}

/** Disengaging without resolving (§3.7.1 avoidant). No clean settle. */
export function driftAway(home: CameraState): CameraDirective {
  return {
    to: { ...home, x: home.x - 7, zoom: home.zoom * 0.88, depth: 0.3 },
    ease: 'drift',
    meaning: 'disengagement',
  };
}

/** Hard cut: impulse/reactivity (§2). Position and tight focus, no easing. */
export function snapCut(
  home: CameraState,
  opts: { x?: number; y?: number; zoom?: number; depth?: number } = {},
): CameraDirective {
  return {
    to: {
      x: opts.x ?? home.x,
      y: opts.y ?? home.y,
      zoom: opts.zoom ?? home.zoom,
      depth: opts.depth ?? 1,
    },
    ease: 'cut',
    meaning: 'impulse',
    durationMs: 0,
  };
}

/** The sequence's recurring home framing: calm, symmetric, slightly
 *  elevated (§4.2 beat 5). Elevated = reflective distance (§2). */
export function homeState(): CameraState {
  return { x: 0, y: -1.5, zoom: 1, depth: 0 };
}

/** Camera height as meaning (§2). */
export function elevatedState(
  base: CameraState,
  opts: { zoom?: number } = {},
): CameraState {
  return { ...base, y: base.y - 6, zoom: opts.zoom ?? base.zoom * 0.82, depth: 0 };
}

/** Low camera = vulnerability, smallness (§2). */
export function lowState(base: CameraState, opts: { zoom?: number } = {}): CameraState {
  return { ...base, y: base.y + 6, zoom: opts.zoom ?? base.zoom * 1.3, depth: 0.85 };
}
