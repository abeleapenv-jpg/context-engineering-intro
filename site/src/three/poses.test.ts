/*
 * 3D camera grammar (spec §2 + Amendment A): the same CameraDirective
 * meanings map to 3D poses, and the GSAP curves preserve the
 * cut = impulse / ease = deliberation distinction.
 */
import { describe, expect, it } from 'vitest';

import { FRAMING, gsapEaseFor, poseFor } from './poses';

describe('framing (user-requested upper-band composition)', () => {
  it('the home camera is elevated and looks gently down at the scene', () => {
    // Elevated camera + downward lookAt pushes standing figures (y 0..2)
    // into the upper band of the frame; the floor/table area reads lower.
    expect(FRAMING.home.position[1]).toBeGreaterThan(3);
    expect(FRAMING.home.target[1]).toBeLessThan(FRAMING.home.position[1]);
    // Clearance is structural: the scene frame, context copy, and choice
    // cards stack in normal flow (qf-canvas-frame comment, pages.css).
  });
});

describe('meaning -> pose (spec §2)', () => {
  it('narrowing attention / impulse pushes in tight', () => {
    const pose = poseFor('impulse');
    expect(pose.position[2]).toBeLessThan(FRAMING.home.position[2]);
  });

  it('widening context pulls back', () => {
    const pose = poseFor('widening context');
    expect(pose.position[2]).toBeGreaterThan(FRAMING.home.position[2]);
  });

  it('settling / deliberation / stillness return home', () => {
    expect(poseFor('settling')).toEqual(FRAMING.home);
    expect(poseFor('deliberation')).toEqual(FRAMING.home);
    expect(poseFor('stillness')).toEqual(FRAMING.home);
  });

  it('disengagement drifts laterally and never lands on home', () => {
    const pose = poseFor('disengagement');
    expect(pose.position[0]).not.toBe(FRAMING.home.position[0]);
    expect(pose.position[2]).toBeGreaterThan(FRAMING.home.position[2]);
  });
});

describe('ease kind -> GSAP curve (Amendment A)', () => {
  it('cut is instant: the 3D hard cut keeps the impulse meaning', () => {
    expect(gsapEaseFor('cut').instant).toBe(true);
    expect(gsapEaseFor('cut').duration).toBe(0);
  });

  it('ease is power3.inOut: deliberation', () => {
    const motion = gsapEaseFor('ease', 2600);
    expect(motion.ease).toBe('power3.inOut');
    expect(motion.instant).toBe(false);
    expect(motion.duration).toBe(2600);
  });

  it('fast is a driven power2.in whip', () => {
    expect(gsapEaseFor('fast').ease).toBe('power2.in');
  });

  it('drift is a long power1.out with no clean settle', () => {
    const motion = gsapEaseFor('drift');
    expect(motion.ease).toBe('power1.out');
    expect(motion.duration).toBeGreaterThanOrEqual(3400);
  });
});
