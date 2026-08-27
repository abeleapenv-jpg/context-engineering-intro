/*
 * QUIETFIELD 3D EFFECTS
 *
 * Small R3F components for the living details:
 *   - Lights: the locked three-light rig (Amendment A)
 *   - IdleLife: continuous sine.inOut breathing (torso scale + micro
 *     head tilt; vertical bounce stays banned, spec §3)
 *   - HeadTurn: hover gaze, power2.out toward the previewed choice
 *   - ContextFade: depth-of-field approximation, context dims under
 *     shallow focus (tunnel vision, spec §2); instant under reduced
 *     motion (spec §3)
 */
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect } from 'react';
import * as THREE from 'three';

import type { FigureRig } from './figures';
import { buildLights } from './lighting';

export function Lights() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const rig = buildLights();
    scene.add(rig.ambient, rig.key, rig.rim);
    return () => {
      scene.remove(rig.ambient, rig.key, rig.rim);
      rig.key.dispose();
    };
  }, [scene]);
  return null;
}

export function IdleLife({ rigs, enabled }: { rigs: FigureRig[]; enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;
    const tweens: gsap.core.Tween[] = [];
    for (const rig of rigs) {
      // Torso scale grows from the grounded base (never vertical bounce).
      tweens.push(
        gsap.to(rig.torso.scale, {
          y: 1.03,
          duration: 1.7,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }),
      );
      // Micro head tilt: living presence, nothing performative.
      tweens.push(
        gsap.to(rig.headPivot.rotation, {
          z: 0.024,
          duration: 2.3,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }),
      );
    }
    return () => tweens.forEach((t) => t.kill());
  }, [rigs, enabled]);
  return null;
}

export function HeadTurn({
  head,
  focus,
  enabled,
}: {
  head: THREE.Object3D | null;
  focus: number | null;
  enabled: boolean;
}) {
  useEffect(() => {
    if (!head || !enabled) return;
    // Choices A/B sit on the left of the grid, C/D on the right; the
    // focus figure turns toward the response being previewed (§3.6.1 #28).
    const target = focus === null ? 0 : focus < 2 ? -0.55 : 0.55;
    const tween = gsap.to(head.rotation, { y: target, ease: 'power2.out', duration: 0.5 });
    return () => {
      tween.kill();
    };
  }, [head, focus, enabled]);
  return null;
}

function setMeshesOpacity(meshes: THREE.Mesh[], opacity: number): void {
  for (const mesh of meshes) {
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      m.transparent = true;
      m.opacity = opacity;
      m.needsUpdate = true;
    }
  }
}

export function ContextFade({
  meshes,
  depth,
  instant,
}: {
  meshes: THREE.Mesh[];
  depth: number;
  instant: boolean;
}) {
  useEffect(() => {
    if (meshes.length === 0) return;
    // depth 0 = deep focus (full awareness): context fully visible.
    // depth 1 = shallow (tunnel vision): context dims away.
    const opacity = 0.3 + (1 - depth) * 0.65;
    if (instant) {
      setMeshesOpacity(meshes, opacity);
      return;
    }
    const proxy = { o: 1 };
    setMeshesOpacity(meshes, proxy.o);
    const tween = gsap.to(proxy, {
      o: opacity,
      duration: 1.2,
      ease: 'power3.inOut',
      overwrite: 'auto',
      onUpdate: () => setMeshesOpacity(meshes, proxy.o),
    });
    return () => {
      tween.kill();
    };
  }, [meshes, depth, instant]);
  return null;
}
