/*
 * QUIETFIELD 3D CAMERA POSES & MOTION CURVES
 *
 * The §2 semantic language mapped to 3D:
 *   - impulse          -> instant set (the hard cut; unchanged meaning)
 *   - deliberation     -> power3.inOut on position AND target
 *   - widening context -> dolly-out pose (camera pulls back, field opens)
 *   - narrowing        -> dolly-in pose (tight framing)
 *   - disengagement    -> lateral drift, long power1.out, no clean settle
 *
 * Framing (user-requested): the home pose puts figures and tables in the
 * upper 55-60% of the viewport. Camera sits elevated, looking gently
 * down at the scene's mid-height, so standing figures (0 to ~2 world
 * units) occupy the upper-middle band and the floor/table area reads
 * lower. Layout clearance is structural: the scene frame, context copy,
 * and choice cards stack in normal flow and never overlap.
 */
import type { CameraDirective, CameraEaseKind } from '../lib/camera';

export interface Pose3D {
  position: [number, number, number];
  target: [number, number, number];
}

export const FRAMING = {
  fov: 42,
  /** Home framing: elevated, calm, figures in the upper band. */
  home: {
    position: [0, 4.2, 10.2],
    target: [0, 1.15, 0],
  } satisfies Pose3D,
} as const;

export interface Motion {
  ease: string;
  duration: number;
  /** instant = gsap.set, the 3D hard cut. */
  instant: boolean;
}

/** Ease kind -> GSAP curve. The cut-vs-ease distinction is meaning,
 *  never style (spec §2, §7). */
export function gsapEaseFor(ease: CameraEaseKind, durationMs?: number): Motion {
  switch (ease) {
    case 'cut':
      return { ease: 'none', duration: 0, instant: true };
    case 'fast':
      return { ease: 'power2.in', duration: Math.min(durationMs ?? 600, 600), instant: false };
    case 'drift':
      return { ease: 'power1.out', duration: durationMs ?? 3400, instant: false };
    case 'ease':
      return { ease: 'power3.inOut', duration: durationMs ?? 2400, instant: false };
  }
}

/** The semantic meaning picks the pose; the ease kind picks the curve
 *  (spec §3.7.1: camera rules attach to the archetype, not the scene). */
export function poseFor(meaning: CameraDirective['meaning'], home: Pose3D = FRAMING.home): Pose3D {
  const [hx, hy, hz] = home.position;
  switch (meaning) {
    case 'narrowing attention':
    case 'impulse':
      return { position: [hx * 0.6, hy * 0.82, hz * 0.52], target: home.target };
    case 'widening context':
      return { position: [hx, hy * 1.08, hz * 1.62], target: home.target };
    case 'disengagement':
      return { position: [hx - 1.7, hy * 1.02, hz * 1.18], target: [hx, home.target[1], home.target[2]] };
    case 'settling':
    case 'deliberation':
    case 'stillness':
      return home;
  }
}
