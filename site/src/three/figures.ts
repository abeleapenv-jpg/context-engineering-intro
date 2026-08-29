/*
 * QUIETFIELD 3D FIGURE RIGS
 *
 * Abstracted, low-poly, faceless figures (spec §3). Grounded at the feet:
 * the group origin sits at the base, so the rig can be dropped on any
 * floor at y = 0.
 *
 * Material & mesh parameters (locked by Amendment A):
 *   - heads: SphereGeometry(r, 64, 64), flatShading false (no facets)
 *   - bodies: MeshStandardMaterial, roughness 0.6, metalness 0.08
 *     (tactile matte ceramic; broad highlights, no blown-out white)
 *   - all meshes cast soft PCF shadows (one shadow light per scene)
 *
 * Breathing: torso scaleY (geometry is translated so scale grows from the
 * base, never vertical bounce) plus micro head tilt via the head pivot
 * (spec §3: "use torso scale, shoulder rotation, head/gaze changes").
 */
import * as THREE from 'three';

import { TOKENS } from '../lib/tokens';

/** Locked resolution: no polygon facets visible on heads (Amendment A). */
export const HEAD_SEGMENTS = 64;

const CREAM = TOKENS.cream;

function figureMaterial(color: string = CREAM): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.6,
    metalness: 0.08,
  });
}

interface BoxOpts {
  w: number;
  h: number;
  d: number;
  x?: number;
  y?: number;
  z?: number;
  color?: string;
}

/** A box whose base sits exactly at its position y (grounded geometry). */
function box(o: BoxOpts, material?: THREE.MeshStandardMaterial): THREE.Mesh {
  const geo = new THREE.BoxGeometry(o.w, o.h, o.d);
  geo.translate(0, o.h / 2, 0); // origin at the bottom face
  const mesh = new THREE.Mesh(geo, material ?? figureMaterial(o.color));
  mesh.position.set(o.x ?? 0, o.y ?? 0, o.z ?? 0);
  mesh.castShadow = true;
  return mesh;
}

export interface FigureRig {
  group: THREE.Group;
  /** Torso mesh: scale its y for breathing (grows from the base). */
  torso: THREE.Mesh;
  /** Pivot at the neck: micro-tilt for idle life, y-rotation for gaze. */
  headPivot: THREE.Group;
  /** The high-res head sphere. */
  head: THREE.Mesh;
  /** Every mesh in the rig (shadows, opacity helpers). */
  meshes: THREE.Mesh[];
}

export type FigureKind = 'standing' | 'seated' | 'child';

export interface FigureOptions {
  /** Raised right arm: deliberately ambiguous gesture (§4.2 beat 1). */
  armUp?: boolean;
  /** Uniform scale (e.g. distant context figures). */
  scale?: number;
  color?: string;
}

const DIMS: Record<FigureKind, {
  legH: number;
  legW: number;
  torsoW: number;
  torsoH: number;
  headR: number;
  headGap: number;
  armL: number;
}> = {
  standing: { legH: 0.88, legW: 0.15, torsoW: 0.44, torsoH: 0.72, headR: 0.17, headGap: 0.2, armL: 0.6 },
  child: { legH: 0.52, legW: 0.13, torsoW: 0.3, torsoH: 0.42, headR: 0.145, headGap: 0.17, armL: 0.36 },
  // seated uses custom geometry below
  seated: { legH: 0.55, legW: 0.15, torsoW: 0.42, torsoH: 0.6, headR: 0.15, headGap: 0.19, armL: 0.5 },
};

export function createFigure(kind: FigureKind, opts: FigureOptions = {}): FigureRig {
  const group = new THREE.Group();
  const meshes: THREE.Mesh[] = [];
  const add = (m: THREE.Mesh) => {
    group.add(m);
    meshes.push(m);
  };
  const dims = DIMS[kind];

  let torso: THREE.Mesh;
  let headPivot: THREE.Group;
  let head: THREE.Mesh;

  if (kind === 'seated') {
    const seatY = 0.62;
    // Thighs forward, shins down: a grounded seated pose.
    for (const side of [-1, 1]) {
      add(box({ w: 0.15, h: 0.16, d: 0.42, x: side * 0.13, y: seatY, z: 0.2 }));
      add(box({ w: 0.15, h: 0.55, d: 0.16, x: side * 0.13, y: 0.07, z: 0.36 }));
    }
    torso = box({ w: dims.torsoW, h: dims.torsoH, d: 0.3, y: seatY + 0.12, z: 0.1 });
    add(torso);
    const neckY = seatY + 0.12 + dims.torsoH;
    headPivot = new THREE.Group();
    headPivot.position.set(0, neckY, 0.1);
    const headMaterial = figureMaterial(opts.color);
    headMaterial.flatShading = false;
    head = new THREE.Mesh(
      new THREE.SphereGeometry(dims.headR, HEAD_SEGMENTS, HEAD_SEGMENTS),
      headMaterial,
    );
    head.position.y = dims.headGap;
    head.castShadow = true;
    headPivot.add(head);
    group.add(headPivot);
    meshes.push(head);
    // Arms resting forward on the lap.
    for (const side of [-1, 1]) {
      add(box({ w: 0.12, h: 0.16, d: 0.34, x: side * 0.29, y: seatY + 0.1, z: 0.18 }));
    }
  } else {
    // Standing / child: legs, torso, head, arms.
    for (const side of [-1, 1]) {
      add(box({ w: dims.legW, h: dims.legH, d: 0.17, x: side * 0.13, y: 0, z: 0 }));
    }
    const hipY = dims.legH;
    torso = box({ w: dims.torsoW, h: dims.torsoH, d: 0.28, y: hipY });
    add(torso);
    const neckY = hipY + dims.torsoH;
    headPivot = new THREE.Group();
    headPivot.position.set(0, neckY, 0);
    const headMaterial = figureMaterial(opts.color);
    headMaterial.flatShading = false;
    head = new THREE.Mesh(
      new THREE.SphereGeometry(dims.headR, HEAD_SEGMENTS, HEAD_SEGMENTS),
      headMaterial,
    );
    head.position.y = dims.headGap;
    head.castShadow = true;
    headPivot.add(head);
    group.add(headPivot);
    meshes.push(head);
    // Arms: shoulder pivots so a raised arm stays poseable.
    const shoulderY = hipY + dims.torsoH - 0.06;
    for (const side of [-1, 1]) {
      const shoulder = new THREE.Group();
      shoulder.position.set(side * (dims.torsoW / 2 + 0.05), shoulderY, 0);
      const arm = box({ w: 0.13, h: dims.armL, d: 0.13, y: 0.02 });
      shoulder.add(arm);
      meshes.push(arm);
      if (side === 1 && opts.armUp) {
        // Raised arm: reaching? waving? blocking? The pose must not decide.
        shoulder.rotation.z = -2.35;
        shoulder.rotation.x = -0.15;
      } else {
        shoulder.rotation.z = side * 0.12;
      }
      group.add(shoulder);
    }
  }

  group.scale.setScalar(opts.scale ?? 1);
  return { group, torso, headPivot, head, meshes };
}

/** Recursively set opacity on every material in a group (transparent
 *  materials are pre-flagged so fades are cheap). */
export function setGroupOpacity(group: THREE.Object3D, opacity: number): void {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!(mesh as unknown as { isMesh?: boolean }).isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      m.transparent = true;
      m.opacity = opacity;
      m.needsUpdate = true;
    }
  });
}
