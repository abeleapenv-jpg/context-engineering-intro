/*
 * Locked cinematic parameters (Amendment A): ACES tone mapping + 0.85
 * exposure (highlight roll-off, no blown-out white), ink fog, and the
 * three-light rig with exactly ONE shadow-casting light (the §3 budget).
 */
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';

import { TOKENS } from '../lib/tokens';
import { LIGHTING, RENDERER, buildLights, setupRenderer } from './lighting';

describe('renderer configuration (Amendment A)', () => {
  it('uses ACESFilmic tone mapping at 0.85 exposure', () => {
    expect(RENDERER.toneMapping).toBe(THREE.ACESFilmicToneMapping);
    expect(RENDERER.toneMappingExposure).toBe(0.85);
  });

  it('uses PCFSoftShadowMap for the key light', () => {
    expect(RENDERER.shadowMapType).toBe(THREE.PCFSoftShadowMap);
  });

  it('applies tone mapping, exposure, shadows, ink clear color and fog', () => {
    const gl = {
      toneMapping: undefined as unknown,
      toneMappingExposure: 0,
      shadowMap: { enabled: false, type: THREE.PCFShadowMap },
      setClearColor: (c: THREE.ColorRepresentation) => {
        expect(String(c)).toBe(TOKENS.ink);
      },
    };
    const scene = new THREE.Scene();
    setupRenderer(gl as never, scene);
    expect(gl.toneMapping).toBe(THREE.ACESFilmicToneMapping);
    expect(gl.toneMappingExposure).toBe(0.85);
    expect(gl.shadowMap.enabled).toBe(true);
    expect(gl.shadowMap.type).toBe(THREE.PCFSoftShadowMap);
    expect(scene.fog).toBeInstanceOf(THREE.FogExp2);
    const fog = scene.fog as THREE.FogExp2;
    expect(fog.color.getHexString()).toBe(TOKENS.ink.replace('#', ''));
    expect(fog.density).toBe(0.04);
  });
});

describe('lighting rig (Amendment A)', () => {
  it('ambient fill at 0.35, rim/backlight at 0.6', () => {
    expect(LIGHTING.ambientIntensity).toBe(0.35);
    expect(LIGHTING.rimIntensity).toBe(0.6);
  });

  it('builds ambient + key + rim with exactly ONE shadow-casting light', () => {
    const rig = buildLights();
    const directional = [rig.key, rig.rim];
    expect(directional.filter((l) => l.castShadow)).toHaveLength(1);
    expect(rig.key.castShadow).toBe(true);
    expect(rig.rim.castShadow).toBe(false);
    // The rim is tan-tinted: cold relative to the warm cream key, and
    // token-bound (spec §3.5: temperature shifts on the ink/cream base).
    expect(rig.rim.color.getHexString()).toBe(TOKENS.tan.replace('#', ''));
    expect(rig.key.color.getHexString()).toBe(TOKENS.cream.replace('#', ''));
  });

  it('keeps the key intensity below blowout territory', () => {
    // ACES + exposure 0.85 + roughness 0.6 already roll off highlights;
    // a modest key keeps the cream figures from going white.
    expect(LIGHTING.keyIntensity).toBeLessThan(2);
  });
});
