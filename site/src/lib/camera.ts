/*
 * QUIETFIELD SHARED CAMERA CONTRACT (spec §3.7)
 *
 * The 2D/SVG implementation of the §2 semantic language. Every camera move,
 * depth change, and cut must map to one of these meanings. The 3D layer
 * will implement the same contract in Three.js; the meanings do not change,
 * only the medium (§1).
 *
 * HARD RULE: cut = impulse/reactivity, ease = deliberation (§2, §3, §7).
 * If any scene breaks this, the whole system stops teaching.
 */

export type CameraEaseKind =
  | 'cut' // impulse / reactivity - no transition at all
  | 'fast' // driven whip-pan - impulsive but continuous
  | 'ease' // deliberation, regulation - the visual signal of a pause
  | 'drift'; // avoidant - disengages without resolving

export type DepthOfField = 'shallow' | 'deep';

/** Response archetypes (§3.7.1). Camera behavior attaches to the archetype,
 *  not to the choice letter. */
export type Archetype = 'reactive' | 'avoidant' | 'clarifying' | 'regulated';

/** Camera state in 2D space. The 3D layer maps this to its own rig. */
export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  /** 0 = fully deep focus (background sharp), 1 = fully shallow (blurred). */
  depth: number;
}

export interface CameraDirective {
  /** Which state to move to, which movement carries the meaning, and how
   *  long the move takes (longer = more deliberate). */
  to: CameraState;
  ease: CameraEaseKind;
  /** Meaningful, not decorative (§2). Maps to the semantic table. */
  meaning:
    | 'narrowing attention'
    | 'widening context'
    | 'deliberation'
    | 'impulse'
    | 'settling'
    | 'disengagement'
    | 'stillness';
  durationMs?: number;
}

/** Archetype -> camera behavior (§3.7.1). Scene components pass their own
 *  geometry and homeState; this owns the cut-vs-ease decision and the
 *  depth-of-field transition, so grammar cannot drift per scene. */
export const ARCHETYPE_BEHAVIOR: Record<
  Archetype,
  (home: CameraState) => CameraDirective
> = {
  reactive: (home) => ({
    to: { ...home, zoom: home.zoom * 1.42, depth: 1 },
    ease: 'cut',
    meaning: 'impulse',
    durationMs: 180,
  }),
  avoidant: (home) => ({
    to: { ...home, x: home.x - 6, zoom: home.zoom * 0.9 },
    ease: 'drift',
    meaning: 'disengagement',
  }),
  clarifying: (home) => ({
    to: { ...home, zoom: home.zoom * 0.72, depth: 0 },
    ease: 'ease',
    meaning: 'widening context',
    durationMs: 2600,
  }),
  regulated: (home) => ({
    to: { ...home, zoom: home.zoom * 0.9, depth: 0 },
    ease: 'ease',
    meaning: 'settling',
    durationMs: 2400,
  }),
};
