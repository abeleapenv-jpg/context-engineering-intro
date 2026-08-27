/*
 * QUIETFIELD ENTRY SEQUENCE - "THRESHOLD" (spec §4)
 *
 * The first thing a visitor sees: one real round of Notice -> Pause ->
 * Widen -> Choose before any navigation appears (§4.1). It must not
 * resolve into a clean twist; it ends in comfortable uncertainty.
 *
 * WebGL-capable browsers get the 3D scene (ThresholdScene3D); everything
 * else gets the 2D/SVG version. Both share the same beat timeline.
 *
 * Beat structure (§4.2):
 *   0 Void (0-0.8)      darkness, no motion
 *   1 Glimpse (0.8-2.2) one figure, close, ambiguous gesture, shallow DOF
 *   2 Pause (2.2-3.4)   all motion stops, "PAUSE." fades in
 *   3 Widening (3.4-6)  one continuous eased dolly-out, "QUESTION."
 *   4 Branch (6-8)      alternate readings ghost over the scene,
 *                       "MORE THAN ONE STORY FITS."
 *   5 Resolution (8-11) ease to the home camera state, wordmark assembles,
 *                       five-step line, small Enter affordance
 *
 * Session-once (sessionStorage), never auto-loops, skip visible from
 * beat 0. Reduced motion: same beats, same text timing, crossfades only.
 */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';

import { FIVE_STEPS } from '../content/cta';
import type { CameraState } from '../lib/camera';
import { markEntered } from '../lib/entrySession';
import { useSceneCamera } from '../lib/useSceneCamera';
import { useWebGL } from '../three/useWebGL';
import { RuleLoading } from './RuleLoading';
import { SceneFrame } from './SceneFrame';
import { ThresholdStage } from './scenes';
import { Monogram, RuleWithTicks } from './shapes';

const ThresholdScene3D = lazy(() =>
  import('../three/ThresholdScene3D').then((m) => ({ default: m.ThresholdScene3D })),
);

export interface EntrySequenceProps {
  reducedMotion: boolean;
  onComplete: () => void;
}

type Beat = 'void' | 'glimpse' | 'pause' | 'question' | 'branch' | 'resolution';

const BEAT_TIMES: Array<[Beat, number]> = [
  ['void', 0],
  ['glimpse', 800],
  ['pause', 2200],
  ['question', 3400],
  ['branch', 6000],
  ['resolution', 8000],
];

/** 2D camera states per beat (§4.2). The 3D scene has its own poses. */
const BEAT_CAMERA: Record<Beat, CameraState> = {
  void: { x: 0, y: 0, zoom: 1, depth: 0 },
  // Low, tight, shallow: vulnerability + tunnel vision (§2, beat 1).
  glimpse: { x: 6, y: 4, zoom: 1.85, depth: 1 },
  pause: { x: 6, y: 4, zoom: 1.85, depth: 1 },
  // The widening: one continuous eased dolly-out, field opens (beat 3).
  question: { x: 0, y: 0, zoom: 0.62, depth: 0 },
  branch: { x: 0, y: 0, zoom: 0.62, depth: 0 },
  // Home: calm, symmetrical, slightly elevated (reflective distance, §2).
  resolution: { x: 0, y: -3, zoom: 0.8, depth: 0 },
};

export function EntrySequence({ reducedMotion, onComplete }: EntrySequenceProps) {
  const [beat, setBeat] = useState<Beat>('void');
  const [skipped, setSkipped] = useState(false);
  const timers = useRef<number[]>([]);
  const webgl = useWebGL();
  const mode3d = webgl;

  const home = BEAT_CAMERA.void;
  const camera = useSceneCamera(home, reducedMotion);
  const { target, ease, durationMs } = camera;

  // Schedule the beats once. Skip tears everything down.
  useEffect(() => {
    if (skipped) return;
    timers.current = BEAT_TIMES.map(([b, t]) =>
      window.setTimeout(() => setBeat(b), t),
    );
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, [skipped]);

  // Drive the 2D camera per beat (the 3D scene drives its own).
  useEffect(() => {
    if (skipped) return;
    const state = BEAT_CAMERA[beat];
    if (beat === 'void') {
      camera.apply(null);
      return;
    }
    if (beat === 'glimpse') {
      camera.apply({ to: state, ease: 'fast', meaning: 'narrowing attention', durationMs: 600 });
      return;
    }
    if (beat === 'pause') {
      camera.apply({ to: state, ease: 'cut', meaning: 'stillness', durationMs: 0 });
      return;
    }
    if (beat === 'question') {
      camera.apply({
        to: state,
        ease: 'ease',
        meaning: 'widening context',
        durationMs: reducedMotion ? 0 : 2600,
      });
      return;
    }
    if (beat === 'branch') {
      camera.apply({ to: state, ease: 'cut', meaning: 'stillness', durationMs: 0 });
      return;
    }
    if (beat === 'resolution') {
      camera.apply({
        to: state,
        ease: 'ease',
        meaning: 'settling',
        durationMs: reducedMotion ? 0 : 2600,
      });
      return;
    }
    // camera.apply is intentionally recreated per render; including it in
    // the deps would re-run this effect every render. Beat changes drive it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, skipped, reducedMotion]);

  // Beat 5 text and affordance sequence (quiet fades, no bounce §4.3).
  const [showWordmark, setShowWordmark] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [showEnter, setShowEnter] = useState(false);

  useEffect(() => {
    if (beat !== 'resolution' || skipped) return;
    const t1 = window.setTimeout(() => setShowWordmark(true), 400);
    const t2 = window.setTimeout(() => setShowSteps(true), 1500);
    const t3 = window.setTimeout(() => setShowEnter(true), 2600);
    return () => [t1, t2, t3].forEach((t) => window.clearTimeout(t));
  }, [beat, skipped]);

  const skip = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setSkipped(true);
    setBeat('resolution');
    setShowWordmark(true);
    setShowSteps(true);
    setShowEnter(true);
    camera.apply(
      { to: BEAT_CAMERA.resolution, ease: 'cut', meaning: 'settling', durationMs: 0 },
      undefined,
    );
  };

  const enter = () => {
    markEntered();
    onComplete();
  };

  const beatsVisible: Beat[] = ['glimpse', 'pause', 'question', 'branch', 'resolution'];
  const stageVisible = beatsVisible.includes(beat) || skipped;
  const wordVisible: Partial<Record<Beat, boolean>> = {
    pause: beat === 'pause',
    question: beat === 'question',
    branch: beat === 'branch',
    resolution: beat === 'resolution',
  };

  const words = (
    <div className="qf-entry-words">
      <p
        className={`qf-display qf-beat-word qf-fade-in ${
          wordVisible.pause ? 'qf-fade-show' : ''
        }`}
      >
        PAUSE.
      </p>
      <p
        className={`qf-display qf-beat-word qf-fade-in ${
          wordVisible.question ? 'qf-fade-show' : ''
        }`}
      >
        QUESTION.
      </p>
      <p
        className={`qf-display qf-beat-word qf-beat-word-wide qf-fade-in ${
          wordVisible.branch ? 'qf-fade-show' : ''
        }`}
      >
        MORE THAN ONE STORY FITS.
      </p>
    </div>
  );

  const stage2d = (
    <div
      className={`qf-entry-stage ${stageVisible ? 'qf-entry-stage-on' : ''}`}
      style={reducedMotion ? { transition: 'none' } : undefined}
    >
      <ThresholdStage />
      {beat === 'branch' && !reducedMotion ? (
        <>
          {/* Beat 4: two alternate readings ghost over the scene
              (light double-exposure §4.2), then settle. */}
          <div className="qf-ghost qf-ghost-on qf-ghost-a">
            <ThresholdStage />
          </div>
          <div
            className="qf-ghost qf-ghost-on qf-ghost-b"
            style={{ animationDelay: '0.4s' }}
          >
            <ThresholdStage />
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <div className="qf-entry" data-beat={beat} data-testid="entry-sequence">
      <div className="qf-entry-scene">
        {mode3d ? (
          <Suspense
            fallback={
              <div className="scene-frame qf-loading-frame">
                <RuleLoading />
              </div>
            }
          >
            <ThresholdScene3D
              beat={beat}
              skipped={skipped}
              reducedMotion={reducedMotion}
              words={words}
            />
          </Suspense>
        ) : (
          <SceneFrame
            stage={stage2d}
            camera={target}
            easeClass={ease}
            durationMs={durationMs}
            reducedMotion={reducedMotion}
            overlay={words}
          />
        )}
      </div>

      <div className="qf-entry-resolution" aria-live="polite">
        <div
          className={`qf-entry-wordmark qf-fade-in ${showWordmark ? 'qf-fade-show' : ''}`}
        >
          <span className="qf-entry-monogram">
            <Monogram />
          </span>
          <span className={`qf-draw-rule qf-entry-rule ${showWordmark ? 'qf-fade-show' : ''}`}>
            <RuleWithTicks />
          </span>
          <span className="qf-display qf-entry-wordmark-text">QUIETFIELD</span>
        </div>
        <p
          className={`qf-tagline qf-entry-steps qf-fade-in ${showSteps ? 'qf-fade-show' : ''}`}
        >
          {FIVE_STEPS}
        </p>
        <button
          type="button"
          className={`qf-btn qf-entry-enter qf-fade-in ${showEnter ? 'qf-fade-show' : ''}`}
          onClick={enter}
          data-testid="enter-button"
        >
          Enter
        </button>
      </div>

      {!skipped ? (
        <button
          type="button"
          className="qf-btn-quiet qf-entry-skip"
          onClick={skip}
          data-testid="skip-button"
        >
          Skip
        </button>
      ) : null}
    </div>
  );
}
