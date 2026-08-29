/*
 * QUIETFIELD SCENE FRAME (2D)
 *
 * Composition: a blurred background copy of the stage carries the depth
 * of field; the camera layer carries the sharp stage and the framing;
 * overlays (text beats, consequence panels) live outside the camera so
 * UI chrome never rides along with a dolly.
 */
import type { ReactNode } from 'react';

import type { CameraState } from '../lib/camera';
import { cameraTransform } from '../lib/useSceneCamera';

export interface SceneFrameProps {
  /** The stage SVG, rendered twice (background copy is blurred). */
  stage: ReactNode;
  /** Current camera state (from useSceneCamera). */
  camera: CameraState;
  easeClass: string;
  durationMs: number;
  reducedMotion: boolean;
  /** Foreground content, outside the camera's framing. */
  overlay?: ReactNode;
  /** Optional class for the whole frame (e.g. entry sequence beats). */
  className?: string;
}

export function SceneFrame({
  stage,
  camera,
  easeClass,
  durationMs,
  reducedMotion,
  overlay,
  className,
}: SceneFrameProps) {
  return (
    <div
      className={`scene-frame ${className ?? ''}`}
      style={
        {
          '--cam-dof': `${camera.depth * 3}px`,
          '--cam-blur-ms': `${durationMs}ms`,
        } as React.CSSProperties
      }
      data-testid="scene-frame"
    >
      {/* Background copy: carries the depth-of-field blur. */}
      <div className="qf-layer-bg" aria-hidden="true">
        {stage}
      </div>
      {/* Camera layer: the framing, the dolly, the cut-vs-ease meaning. */}
      <div
        className={`scene-cam ${reducedMotion ? 'qf-instant' : ''}`}
        data-ease={easeClass}
        style={cameraTransform(camera)}
        data-testid="scene-camera"
        data-zoom={camera.zoom.toFixed(2)}
        data-depth={camera.depth.toFixed(2)}
      >
        {stage}
      </div>
      {overlay ? <div className="scene-overlay">{overlay}</div> : null}
    </div>
  );
}
