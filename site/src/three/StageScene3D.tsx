/*
 * QUIETFIELD 3D SCENE (scenario pages)
 *
 * The 3D implementation of a scenario scene: Canvas + locked renderer
 * settings + the stage set + idle life + hover gaze + the shared camera
 * rig. It consumes the same CameraDirective values as the 2D fallback,
 * so the §2 grammar is shared (spec §3.7.2).
 */
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

import type { CameraDirective } from '../lib/camera';
import { CameraRig3D } from './CameraRig3D';
import { ContextFade, HeadTurn, IdleLife, Lights } from './effects';
import { setupRenderer } from './lighting';
import { FRAMING } from './poses';
import { buildStage } from './stages';

export interface StageScene3DProps {
  stageId: string;
  directive: CameraDirective | null;
  /** 0..1 depth of field: shallow focus dims the wider context (§2). */
  depth: number;
  reducedMotion: boolean;
  onSettled?: () => void;
  /** Index of the hovered choice (0..3) or null. */
  focus: number | null;
}

export function StageScene3D({
  stageId,
  directive,
  depth,
  reducedMotion,
  onSettled,
  focus,
}: StageScene3DProps) {
  const stage = useMemo(() => buildStage(stageId), [stageId]);

  return (
    <div className="scene-frame qf-canvas-frame" data-testid="scene-3d">
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        dpr={[1, 2]}
        camera={{
          fov: FRAMING.fov,
          position: FRAMING.home.position,
          near: 0.1,
          far: 90,
        }}
        onCreated={({ gl, scene }) => setupRenderer(gl, scene)}
      >
        <Lights />
        <primitive object={stage.group} />
        <ContextFade meshes={stage.context} depth={depth} instant={reducedMotion} />
        <IdleLife rigs={stage.rigs} enabled={!reducedMotion} />
        <HeadTurn head={stage.focus} focus={focus} enabled={!reducedMotion} />
        <CameraRig3D directive={directive} reducedMotion={reducedMotion} onSettled={onSettled} />
      </Canvas>
    </div>
  );
}
