/*
 * QUIETFIELD 3D CAMERA RIG (shared contract §3.7.2)
 *
 * The 3D implementation of the shared camera: scenes supply geometry;
 * this owns cut-vs-ease, dolly direction, and settle timing. The same
 * CameraDirective values drive both renderers, so the §2 grammar cannot
 * drift between the 2D fallback and the 3D layer.
 *
 * Motion (Amendment A): power3.inOut for eased moves, instant gsap.set
 * for cuts, power2.in for fast whips, power1.out for avoidant drift.
 */
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import type { CameraDirective } from '../lib/camera';
import { FRAMING, gsapEaseFor, poseFor } from './poses';

export interface CameraRig3DProps {
  directive: CameraDirective | null;
  reducedMotion: boolean;
  onSettled?: () => void;
}

export function CameraRig3D({ directive, reducedMotion, onSettled }: CameraRig3DProps) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const target = useRef<THREE.Vector3>(new THREE.Vector3(...FRAMING.home.target));

  useEffect(() => {
    const pose = directive ? poseFor(directive.meaning) : FRAMING.home;
    const motion = gsapEaseFor(directive?.ease ?? 'ease', directive?.durationMs);
    const toCam = { x: pose.position[0], y: pose.position[1], z: pose.position[2] };
    const toTarget = { x: pose.target[0], y: pose.target[1], z: pose.target[2] };

    // Hard cuts and reduced motion settle instantly (spec §3, §2).
    if (motion.instant || reducedMotion) {
      gsap.set(camera.position, toCam);
      gsap.set(target.current, toTarget);
      onSettled?.();
      return;
    }

    const tl = gsap.timeline({ onComplete: () => onSettled?.() });
    tl.to(camera.position, { ...toCam, duration: motion.duration, ease: motion.ease, overwrite: 'auto' }, 0)
      .to(target.current, { ...toTarget, duration: motion.duration, ease: motion.ease, overwrite: 'auto' }, 0);
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [directive, reducedMotion]);

  useFrame(() => {
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();
  });

  return null;
}
