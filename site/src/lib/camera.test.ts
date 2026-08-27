/*
 * The §2 camera grammar as executable rules. If any of these fail, the
 * cut = impulse / ease = deliberation contract has broken somewhere.
 */
import { describe, expect, it } from 'vitest';

import {
  ARCHETYPE_BEHAVIOR,
  type Archetype,
  type CameraState,
} from './camera';
import {
  dollyIn,
  dollyOut,
  driftAway,
  easeSettle,
  homeState,
  snapCut,
} from './semantic';

const HOME: CameraState = { x: 0, y: 0, zoom: 1, depth: 0 };

describe('archetype camera behavior (spec §3.7.1)', () => {
  it('reactive = hard cut, tight and shallow (impulse)', () => {
    const dir = ARCHETYPE_BEHAVIOR.reactive(HOME);
    expect(dir.ease).toBe('cut');
    expect(dir.to.zoom).toBeGreaterThan(1);
    expect(dir.to.depth).toBeGreaterThan(0);
  });

  it('avoidant = drift without a clean settle (disengagement)', () => {
    const dir = ARCHETYPE_BEHAVIOR.avoidant(HOME);
    expect(dir.ease).toBe('drift');
  });

  it('clarifying = eased dolly-out, depth of field opens', () => {
    const dir = ARCHETYPE_BEHAVIOR.clarifying(HOME);
    expect(dir.ease).toBe('ease');
    expect(dir.to.zoom).toBeLessThan(1);
    expect(dir.to.depth).toBe(0);
  });

  it('regulated = eased move to a calm resting distance', () => {
    const dir = ARCHETYPE_BEHAVIOR.regulated(HOME);
    expect(dir.ease).toBe('ease');
    expect(dir.to.depth).toBe(0);
  });

  it('every archetype is defined', () => {
    const archetypes: Archetype[] = ['reactive', 'avoidant', 'clarifying', 'regulated'];
    for (const a of archetypes) {
      expect(ARCHETYPE_BEHAVIOR[a]).toBeDefined();
    }
  });
});

describe('dolly semantics (spec §2)', () => {
  it('dolly-in narrows attention: zoom up, field tightens', () => {
    const dir = dollyIn(HOME, 'cut');
    expect(dir.to.zoom).toBeGreaterThan(HOME.zoom);
    expect(dir.to.depth).toBeGreaterThan(0);
  });

  it('an eased dolly-in is deliberation, not impulse', () => {
    const dir = dollyIn(HOME, 'ease');
    expect(dir.ease).toBe('ease');
    expect(dir.meaning).toContain('deliberation');
  });

  it('dolly-out widens context: zoom down, field opens, always eased', () => {
    const dir = dollyOut(HOME);
    expect(dir.to.zoom).toBeLessThan(HOME.zoom);
    expect(dir.to.depth).toBe(0);
    expect(dir.ease).toBe('ease');
  });

  it('a snap cut is an impulse and settles instantly', () => {
    const dir = snapCut(HOME, { zoom: 2 });
    expect(dir.ease).toBe('cut');
    expect(dir.durationMs).toBe(0);
  });

  it('driftAway never settles at home (avoidant, no clean resolution)', () => {
    const dir = driftAway(HOME);
    expect(dir.ease).toBe('drift');
    expect(dir.to.x).not.toBe(HOME.x);
  });

  it('easeSettle lands back at a calm resting distance', () => {
    const dir = easeSettle(HOME);
    expect(dir.ease).toBe('ease');
    expect(dir.to.zoom).toBe(HOME.zoom);
  });

  it('homeState is the calm, symmetric resting framing', () => {
    const home = homeState();
    expect(home.x).toBe(0);
    expect(home.depth).toBe(0);
  });
});
