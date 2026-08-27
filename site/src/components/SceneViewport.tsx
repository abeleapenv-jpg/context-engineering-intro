/*
 * QUIETFIELD SCENE VIEWPORT
 *
 * The progressive-enhancement switch (spec §1): WebGL-capable browsers
 * get the 3D stage scene; everything else gets the existing 2D/SVG scene.
 * Both consume the same CameraDirective values, so the §2 grammar is
 * identical across renderers.
 */
import { lazy, Suspense, type ReactNode } from 'react';

import type { CameraDirective } from '../lib/camera';
import { useWebGL } from '../three/useWebGL';
import { RuleLoading } from './RuleLoading';

const StageScene3D = lazy(() =>
  import('../three/StageScene3D').then((m) => ({ default: m.StageScene3D })),
);

export interface SceneViewportProps {
  stageId: string;
  /** The complete 2D fallback (SceneFrame with stage + camera). */
  fallback2d: ReactNode;
  directive: CameraDirective | null;
  /** 0..1 depth of field: shallow focus dims the wider context (§2). */
  depth: number;
  reducedMotion: boolean;
  onSettled?: () => void;
  /** Index of the hovered choice (0..3) or null. */
  focus: number | null;
}

export function SceneViewport({
  stageId,
  fallback2d,
  directive,
  depth,
  reducedMotion,
  onSettled,
  focus,
}: SceneViewportProps) {
  const webgl = useWebGL();
  if (!webgl) {
    return <>{fallback2d}</>;
  }
  return (
    <Suspense
      fallback={
        <div className="scene-frame qf-loading-frame">
          <RuleLoading />
        </div>
      }
    >
      <StageScene3D
        stageId={stageId}
        directive={directive}
        depth={depth}
        reducedMotion={reducedMotion}
        onSettled={onSettled}
        focus={focus}
      />
    </Suspense>
  );
}
