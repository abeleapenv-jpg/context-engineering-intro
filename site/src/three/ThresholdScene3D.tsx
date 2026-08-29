/*
 * QUIETFIELD ENTRY SEQUENCE - 3D ("THRESHOLD", spec §4)
 *
 * The dimensional version of the entry sequence: same five beats, same
 * timings, same meanings. Camera grammar follows §2 and Amendment A:
 *   - glimpse:  power2.in push into a low, tight, shallow framing
 *   - pause:    all motion stops (breathing included)
 *   - question: ONE continuous power3.inOut dolly-out, context fades in
 *   - branch:   two ghost copies of the whole scene double-expose,
 *               then settle (no clean twist, §4.1)
 *   - resolution: power3.inOut settle to the home framing (elevated,
 *               calm; the recurring resting state)
 * Skip and reduced motion: instant gsap.set poses, static ghosts,
 * no breathing. WebGL-unsupported falls back to the 2D version.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';

import type { EntryBeat } from '../lib/entryBeats';
import { IdleLife, Lights } from './effects';
import { createFigure, setGroupOpacity, type FigureRig } from './figures';
import { setupRenderer } from './lighting';
import type { Pose3D } from './poses';

export interface ThresholdScene3DProps {
  beat: EntryBeat;
  skipped: boolean;
  reducedMotion: boolean;
  /** The five text beats, overlaid as DOM above the canvas. */
  words: ReactNode;
}

/** Entry-specific camera poses. Home = the recurring resting state. */
const HOME: Pose3D = { position: [0, 4.4, 11.5], target: [0, 1.2, 0] };

const BEAT_POSES: Record<EntryBeat, Pose3D> = {
  void: HOME,
  // Low, tight, shallow: vulnerability + tunnel vision (§2, §4.2 beat 1).
  glimpse: { position: [0.35, 1.55, 3.4], target: [0, 1.6, 0] },
  pause: { position: [0.35, 1.55, 3.4], target: [0, 1.6, 0] },
  // The widening: one continuous eased dolly-out, field opens (beat 3).
  question: { position: [0, 3.6, 10.6], target: [0, 1.05, 0] },
  branch: { position: [0, 3.6, 10.6], target: [0, 1.05, 0] },
  resolution: HOME,
};

interface ThresholdStage {
  group: THREE.Group;
  rigs: FigureRig[];
  contextMeshes: THREE.Mesh[];
  ghosts: THREE.Group[];
}

/** The threshold stage: one ambiguous figure, two context figures, a
 *  railing (blocking? waving over?), and a window (reaching toward?).
 *  Built fresh per call so ghost copies get independent materials. */
function buildThresholdStage(): ThresholdStage {
  const group = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.3 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  const rigs: FigureRig[] = [];
  const contextMeshes: THREE.Mesh[] = [];

  // The glimpsed figure: close, frozen mid-gesture, arm raised in a
  // deliberately ambiguous position (§4.3).
  const main = createFigure('standing', { scale: 1.25, armUp: true });
  main.group.position.set(0, 0, 0);
  group.add(main.group);
  rigs.push(main);

  // The wider context the dolly-out reveals: two figures facing the
  // first one (a small crowd? an audience? the frame stays undecided).
  for (const [x, z] of [
    [-2.7, 1.7],
    [2.7, 1.7],
  ]) {
    const ctx = createFigure('standing', { scale: 1.05 });
    ctx.group.position.set(x, 0, z);
    ctx.group.rotation.y = x < 0 ? 0.5 : -0.5;
    group.add(ctx.group);
    rigs.push(ctx);
    contextMeshes.push(...ctx.meshes);
  }

  // The railing: the arm might be waving over a barrier.
  const railMaterial = new THREE.MeshStandardMaterial({
    color: '#848177',
    roughness: 0.9,
    metalness: 0,
  });
  const rail = new THREE.Mesh(new THREE.BoxGeometry(9, 0.09, 0.12), railMaterial);
  rail.position.set(0, 0.92, 2.6);
  rail.castShadow = true;
  group.add(rail);
  contextMeshes.push(rail);
  for (const x of [-3.6, -1.8, 0, 1.8, 3.6]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.92, 0.09), railMaterial);
    post.position.set(x, 0.46, 2.6);
    group.add(post);
    contextMeshes.push(post);
  }

  // The window: the arm might be reaching toward it.
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: '#848177',
    roughness: 0.9,
    metalness: 0,
  });
  for (const [wx, wy, ww, wh] of [
    [-3.7, 2.1, 0.12, 2.2],
    [-3.7, 3.26, 1.5, 0.12],
    [-3.7, 0.94, 1.5, 0.12],
  ]) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(ww, wh, 0.1), frameMaterial);
    frame.position.set(wx, wy, -2.4);
    group.add(frame);
    contextMeshes.push(frame);
  }

  // Ghost alternates for beat 4: full copies, offset, own materials.
  const ghosts: THREE.Group[] = [];
  for (const [dx, dz, ry] of [
    [0.55, -0.35, 0.045],
    [-0.6, -0.2, -0.05],
  ]) {
    const ghost = group.clone(true);
    ghost.position.set(dx, 0, dz);
    ghost.rotation.y = ry;
    setGroupOpacity(ghost, 0);
    ghosts.push(ghost);
  }

  return { group, rigs, contextMeshes, ghosts };
}

/** Camera driver for the entry beats. */
function EntryCamera({ beat, skipped, reducedMotion }: {
  beat: EntryBeat;
  skipped: boolean;
  reducedMotion: boolean;
}) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const target = useRef(new THREE.Vector3(...HOME.target));

  useEffect(() => {
    const pose = BEAT_POSES[beat];
    const toCam = { x: pose.position[0], y: pose.position[1], z: pose.position[2] };
    const toTarget = { x: pose.target[0], y: pose.target[1], z: pose.target[2] };
    const instant = skipped || reducedMotion;

    if (instant) {
      gsap.set(camera.position, toCam);
      gsap.set(target.current, toTarget);
      return;
    }
    if (beat === 'question' || beat === 'resolution' || beat === 'glimpse') {
      const duration = beat === 'question' ? 2.6 : beat === 'resolution' ? 2.2 : 0.6;
      const ease = beat === 'glimpse' ? 'power2.in' : 'power3.inOut';
      const tl = gsap.timeline();
      tl.to(camera.position, { ...toCam, duration, ease, overwrite: 'auto' }, 0)
        .to(target.current, { ...toTarget, duration, ease, overwrite: 'auto' }, 0);
      return () => {
        tl.kill();
      };
    }
    // void / pause / branch: stillness, camera does not move (§4.2).
    gsap.set(camera.position, toCam);
    gsap.set(target.current, toTarget);
  }, [beat, skipped, reducedMotion, camera]);

  useFrame(() => {
    camera.lookAt(target.current);
    camera.updateProjectionMatrix();
  });

  return null;
}

export function ThresholdScene3D({ beat, skipped, reducedMotion, words }: ThresholdScene3DProps) {
  const stage = useMemo(() => buildThresholdStage(), []);

  // Context visibility: hidden until the widening reveals it (beat 3).
  useEffect(() => {
    const visible = beat === 'question' || beat === 'branch' || beat === 'resolution';
    const opacity = visible ? 0.55 : 0;
    if (skipped || reducedMotion) {
      for (const mesh of stage.contextMeshes) setGroupOpacity(mesh, opacity);
      return;
    }
    if (beat === 'question') {
      const proxy = { o: 0 };
      for (const mesh of stage.contextMeshes) setGroupOpacity(mesh, 0);
      const tween = gsap.to(proxy, {
        o: opacity,
        duration: 2.6,
        ease: 'power3.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          for (const mesh of stage.contextMeshes) setGroupOpacity(mesh, proxy.o);
        },
      });
      return () => {
        tween.kill();
      };
    }
    for (const mesh of stage.contextMeshes) setGroupOpacity(mesh, opacity);
  }, [beat, skipped, reducedMotion, stage]);

  // Beat 4: ghost alternates double-expose, then settle back (§4.2).
  useEffect(() => {
    if (beat !== 'branch') {
      stage.ghosts.forEach((g) => setGroupOpacity(g, 0));
      return;
    }
    if (skipped || reducedMotion) {
      // Reduced motion: static double-exposure crossfade, no cycle.
      stage.ghosts.forEach((g) => setGroupOpacity(g, 0.3));
      return;
    }
    const proxy = { o: 0 };
    const tl = gsap.timeline();
    tl.to(proxy, { o: 0.34, duration: 0.9, ease: 'power2.out' })
      .to(proxy, { o: 0.26, duration: 0.6, ease: 'none' })
      .to(proxy, { o: 0, duration: 0.9, ease: 'power2.in' });
    tl.eventCallback('onUpdate', () => {
      stage.ghosts.forEach((g) => setGroupOpacity(g, proxy.o));
    });
    return () => {
      tl.kill();
      stage.ghosts.forEach((g) => setGroupOpacity(g, 0));
    };
  }, [beat, skipped, reducedMotion, stage]);

  const breathingEnabled = !reducedMotion && !skipped && beat !== 'pause' && beat !== 'void';

  return (
    <div className="scene-frame qf-entry-frame" data-testid="entry-3d">
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        dpr={[1, 2]}
        camera={{ fov: 42, position: HOME.position, near: 0.1, far: 90 }}
        onCreated={({ gl, scene }) => setupRenderer(gl, scene)}
      >
        <Lights />
        {beat !== 'void' ? <primitive object={stage.group} /> : null}
        {beat === 'branch'
          ? stage.ghosts.map((g, i) => <primitive key={i} object={g} />)
          : null}
        <IdleLife rigs={stage.rigs} enabled={breathingEnabled} />
        <EntryCamera beat={beat} skipped={skipped} reducedMotion={reducedMotion} />
      </Canvas>
      {words}
    </div>
  );
}
