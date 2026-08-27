/*
 * QUIETFIELD SCENE CAMERA STATE MACHINE (2D)
 *
 * The shared camera contract from spec §3.7.2, implemented in 2D. Scene
 * components supply geometry and a home state; this owns the cut-vs-ease
 * decision, the dolly direction, the depth-of-field transition, and the
 * settle timing. The §2 grammar cannot drift scene to scene because it
 * only exists here.
 */
import { useEffect, useRef, useState } from 'react';

import type { CameraDirective, CameraEaseKind, CameraState } from './camera';

export interface SceneCameraModel {
  /** Where the frame currently is. */
  target: CameraState;
  /** How the frame got there / is getting there (meaning, not style). */
  ease: CameraEaseKind;
  durationMs: number;
  phase: 'idle' | 'moving' | 'settled';
  apply: (directive: CameraDirective | null, onSettled?: () => void) => void;
}

/**
 * @param home This scene's calm resting framing.
 * @param reducedMotion Crossfades only; no easing, no settling delays.
 */
export function useSceneCamera(
  home: CameraState,
  reducedMotion: boolean,
): SceneCameraModel {
  const [target, setTarget] = useState<CameraState>(home);
  const [ease, setEase] = useState<CameraEaseKind>('ease');
  const [durationMs, setDurationMs] = useState(2400);
  const [phase, setPhase] = useState<'idle' | 'moving' | 'settled'>('idle');
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const apply = (directive: CameraDirective | null, onSettled?: () => void) => {
    window.clearTimeout(timer.current);
    const to = directive ? directive.to : home;
    const easeKind: CameraEaseKind =
      reducedMotion ? 'cut' : (directive?.ease ?? 'ease');
    const ms = reducedMotion ? 0 : (directive?.durationMs ?? 2400);

    setTarget(to);
    setEase(easeKind);
    setDurationMs(ms);
    setPhase('moving');

    // Hard cuts and reduced motion settle immediately (spec §3).
    if (reducedMotion || !directive || directive.ease === 'cut') {
      setPhase('settled');
      onSettled?.();
      return;
    }
    timer.current = window.setTimeout(() => {
      setPhase('settled');
      onSettled?.();
    }, Math.max(ms, 800));
  };

  return { target, ease, durationMs, phase, apply };
}

/** CSS transform for the camera layer. */
export function cameraTransform(state: CameraState): React.CSSProperties {
  return {
    transform: `translate(${state.x}%, ${state.y}%) scale(${state.zoom})`,
  } as React.CSSProperties;
}
