/*
 * Locked mesh & material parameters (Amendment A): high-resolution head
 * spheres, no flat shading, matte ceramic materials, grounded rigs.
 */
import * as THREE from 'three';
import { describe, expect, it } from 'vitest';

import { HEAD_SEGMENTS, createFigure } from './figures';

describe('figure meshes & materials (Amendment A)', () => {
  it('heads use SphereGeometry(r, 64, 64) with flatShading false', () => {
    for (const kind of ['standing', 'seated', 'child'] as const) {
      const rig = createFigure(kind);
      const geo = rig.head.geometry as THREE.SphereGeometry;
      expect(geo.parameters.widthSegments).toBe(HEAD_SEGMENTS);
      expect(geo.parameters.heightSegments).toBe(HEAD_SEGMENTS);
      expect(HEAD_SEGMENTS).toBe(64);
      const mat = rig.head.material as THREE.MeshStandardMaterial;
      expect(mat.flatShading).toBe(false);
    }
  });

  it('materials are tactile matte ceramic: roughness 0.6, metalness 0.08', () => {
    const rig = createFigure('standing');
    for (const mesh of rig.meshes) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      expect(mat.roughness).toBeCloseTo(0.6);
      expect(mat.metalness).toBeCloseTo(0.08);
      expect(mat.constructor.name).toMatch(/Mesh(Standard|Physical)Material/);
    }
  });

  it('rigs are grounded at the feet (group origin at the base)', () => {
    const rig = createFigure('standing');
    expect(rig.group.position.y).toBe(0);
    // Torso geometry is translated so its base sits at its position y:
    // breathing scale grows upward, never a vertical bounce (§3).
    const geo = rig.torso.geometry as THREE.BoxGeometry;
    geo.computeBoundingBox();
    const minY = geo.boundingBox!.min.y;
    const worldBase = rig.torso.position.y + minY;
    expect(worldBase).toBeCloseTo(0.88, 4); // the hip line, above the legs
  });

  it('all meshes cast soft shadows for the single key light', () => {
    const rig = createFigure('child');
    for (const mesh of rig.meshes) {
      expect(mesh.castShadow).toBe(true);
    }
  });
});
