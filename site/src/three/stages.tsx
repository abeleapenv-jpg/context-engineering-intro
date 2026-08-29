/*
 * QUIETFIELD 3D STAGE SETS
 *
 * One stage per life stage, shared by all 25 scenarios (the same sets the
 * 2D layer illustrates). Low-poly, faceless, four tokens only.
 *
 * Each stage returns:
 *   - group:   the whole scene (shadow floor included)
 *   - rigs:    figure rigs for idle life (breathing, micro tilt)
 *   - focus:   the head pivot that responds to choice hover (the figure
 *              the scenario is about turns toward the response being
 *              previewed, §3.6.1 #28)
 *   - context: meshes that fade with depth of field (tunnel vision vs
 *              full awareness, §2): shallow DOF dims the wider scene
 */
import * as THREE from 'three';

import { TOKENS } from '../lib/tokens';
import { createFigure, type FigureRig } from './figures';

export interface Stage3D {
  group: THREE.Group;
  rigs: FigureRig[];
  focus: THREE.Object3D;
  context: THREE.Mesh[];
}

const STRUCTURE = new THREE.MeshStandardMaterial({
  color: TOKENS.tan,
  roughness: 0.9,
  metalness: 0,
});

const CREAM_BASIC = new THREE.MeshBasicMaterial({ color: TOKENS.cream });

function floor(): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.3 }),
  );
  m.rotation.x = -Math.PI / 2;
  m.receiveShadow = true;
  return m;
}

function table(
  w: number,
  d: number,
  h: number,
  x = 0,
  z = 0,
  material: THREE.Material = STRUCTURE,
): THREE.Group {
  const g = new THREE.Group();
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), material);
  top.position.set(x, h, z);
  top.castShadow = true;
  top.receiveShadow = true;
  g.add(top);
  for (const [lx, lz] of [
    [-w / 2 + 0.08, -d / 2 + 0.08],
    [w / 2 - 0.08, -d / 2 + 0.08],
    [-w / 2 + 0.08, d / 2 - 0.08],
    [w / 2 - 0.08, d / 2 - 0.08],
  ]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, 0.08), material);
    leg.position.set(x + lx, h / 2, z + lz);
    g.add(leg);
  }
  return g;
}

function wallBox(w: number, h: number, z: number, color = TOKENS.ink): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), new THREE.MeshBasicMaterial({ color }));
  m.position.set(0, h / 2, z);
  return m;
}

/* ------------------------------ CHILDHOOD ------------------------------ */

function playground(): Stage3D {
  const group = new THREE.Group();
  group.add(floor());
  const rigs: FigureRig[] = [];
  const context: THREE.Mesh[] = [];

  // The two children and the disputed rope (§5.3 canonical).
  const left = createFigure('child', { scale: 1.15 });
  left.group.position.set(-1.15, 0, 0);
  left.group.rotation.y = 0.7;
  group.add(left.group);
  rigs.push(left);

  const right = createFigure('child', { scale: 1.15, armUp: true });
  right.group.position.set(1.15, 0, 0);
  right.group.rotation.y = -0.7;
  group.add(right.group);
  rigs.push(right);

  // The skipping rope: a slack curve on the ground between them.
  const ropeCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.85, 0.06, 0.1),
    new THREE.Vector3(0, 0.16, 0.42),
    new THREE.Vector3(0.85, 0.06, 0.1),
  ]);
  const rope = new THREE.Mesh(
    new THREE.TubeGeometry(ropeCurve, 20, 0.045, 8),
    new THREE.MeshStandardMaterial({ color: TOKENS.cream, roughness: 0.7, metalness: 0 }),
  );
  rope.castShadow = true;
  group.add(rope);

  // Distant park figures: tunnel-vision context that fades with DOF.
  for (const [x, z] of [
    [-3.9, -1.2],
    [3.9, -1.4],
  ]) {
    const far = createFigure('child', { scale: 0.85 });
    far.group.position.set(x, 0, z);
    group.add(far.group);
    rigs.push(far);
    context.push(...far.meshes);
  }

  // Two spare tree trunks (flat geometric, not clip-art).
  for (const [x, z, h] of [
    [-5, -3, 2.6],
    [5.2, -3.4, 2.2],
  ]) {
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.18, h, 0.18), new THREE.MeshBasicMaterial({ color: TOKENS.cream }));
    trunk.position.set(x, h / 2, z);
    trunk.material.transparent = true;
    trunk.material.opacity = 0.35;
    group.add(trunk);
    context.push(trunk);
  }

  return { group, rigs, focus: left.headPivot, context };
}

/* ------------------------------- SCHOOL ------------------------------- */

function classroom(): Stage3D {
  const group = new THREE.Group();
  group.add(floor());
  group.add(wallBox(14, 5.5, -4.2));
  const rigs: FigureRig[] = [];
  const context: THREE.Mesh[] = [];

  // The board on the back wall.
  const board = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.2, 0.08), CREAM_BASIC);
  board.position.set(0, 2.3, -4.06);
  board.material = board.material.clone();
  (board.material as THREE.MeshBasicMaterial).opacity = 0.92;
  board.material.transparent = true;
  group.add(board);

  // Synchronized desk rows (§5.4 canonical): deep focus, no hierarchy.
  let focusPivot: THREE.Object3D | null = null;
  for (let row = 0; row < 3; row++) {
    for (let col = -1; col <= 1; col++) {
      const gx = col * 2.5;
      const gz = -1.6 + row * 1.3;
      group.add(table(0.95, 0.6, 0.55, gx, gz));
      const student = createFigure('seated', { scale: 0.92 });
      student.group.position.set(gx, 0, gz - 0.38);
      student.group.rotation.y = Math.PI;
      group.add(student.group);
      rigs.push(student);
      if (row === 0 && col === 0) focusPivot = student.headPivot;
    }
  }

  // The teacher, at the board.
  const teacher = createFigure('standing', { scale: 1 });
  teacher.group.position.set(1.7, 0, -3.5);
  teacher.group.rotation.y = -0.5;
  group.add(teacher.group);
  rigs.push(teacher);

  return { group, rigs, focus: focusPivot ?? teacher.headPivot, context };
}

/* ------------------------------ COLLEGE ------------------------------ */

function cafe(): Stage3D {
  const group = new THREE.Group();
  group.add(floor());
  group.add(wallBox(14, 5, -3.4));
  const rigs: FigureRig[] = [];
  const context: THREE.Mesh[] = [];

  // Window frame on the back wall (thin boxes).
  for (const [wx, wy, ww, wh] of [
    [-2.6, 1.9, 0.12, 2.6],
    [2.6, 1.9, 0.12, 2.6],
    [-1.3, 3.12, 2.7, 0.12],
    [-1.3, 0.62, 2.7, 0.12],
  ]) {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(ww, wh, 0.1), STRUCTURE);
    frame.position.set(wx, wy, -3.32);
    group.add(frame);
  }

  // The table and the two chairs of the two-shot (§5.5 canonical).
  group.add(table(1.5, 0.9, 0.6, 0, 0));
  const nearer = createFigure('seated', { scale: 1 });
  nearer.group.position.set(0, 0, 0.78);
  group.add(nearer.group);
  rigs.push(nearer);

  const partner = createFigure('seated', { scale: 1 });
  partner.group.position.set(0, 0, -0.78);
  partner.group.rotation.y = Math.PI;
  group.add(partner.group);
  rigs.push(partner);

  // Barista in the back: the wider context the dolly-out reveals.
  const barista = createFigure('standing', { scale: 0.9 });
  barista.group.position.set(-3.6, 0, -2.6);
  group.add(barista.group);
  rigs.push(barista);
  context.push(...barista.meshes);

  return { group, rigs, focus: partner.headPivot, context };
}

/* ------------------------------- OFFICE ------------------------------- */

function meetingRoom(): Stage3D {
  const group = new THREE.Group();
  group.add(floor());
  group.add(wallBox(14, 5, -3.8));
  const rigs: FigureRig[] = [];
  const context: THREE.Mesh[] = [];

  // The long table, several competing focal planes (§5.6 canonical).
  group.add(table(2.9, 1.15, 0.62, 0, 0.3));
  for (const [x, z, ry] of [
    [-1.05, -0.35, Math.PI],
    [1.05, -0.35, Math.PI],
    [-1.05, 0.95, 0],
    [1.05, 0.95, 0],
  ]) {
    const s = createFigure('seated', { scale: 0.95 });
    s.group.position.set(x, 0, z);
    s.group.rotation.y = ry;
    group.add(s.group);
    rigs.push(s);
  }

  // The presenter whose contribution gets credited (the focus-pull).
  const presenter = createFigure('standing', { scale: 1 });
  presenter.group.position.set(0, 0, -1.55);
  group.add(presenter.group);
  rigs.push(presenter);

  return { group, rigs, focus: presenter.headPivot, context };
}

/* ------------------------------ MIDDLE AGE ------------------------------ */

function dinnerTable(): Stage3D {
  const group = new THREE.Group();
  group.add(floor());
  const rigs: FigureRig[] = [];
  const context: THREE.Mesh[] = [];

  // Long, low table with practical warmth (§5.7 canonical).
  group.add(table(2.7, 1.05, 0.66, 0, -0.25));

  // The single rust accent of the stage: the candle.
  const candle = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.2, 0.07), STRUCTURE);
  candle.position.set(0, 0.66 + 0.1, -0.25);
  group.add(candle);
  const flame = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 0.1, 0.05),
    new THREE.MeshBasicMaterial({ color: TOKENS.rust }),
  );
  flame.position.set(0, 0.66 + 0.25, -0.25);
  group.add(flame);

  // Family around the table; the observer faces us in the near seat.
  for (const [x, z, ry] of [
    [-1.0, -0.85, Math.PI],
    [1.0, -0.85, Math.PI],
  ]) {
    const s = createFigure('seated', { scale: 1 });
    s.group.position.set(x, 0, z);
    s.group.rotation.y = ry;
    group.add(s.group);
    rigs.push(s);
  }
  const observer = createFigure('seated', { scale: 1.05 });
  observer.group.position.set(0, 0, 0.62);
  observer.group.rotation.y = Math.PI;
  group.add(observer.group);
  rigs.push(observer);

  return { group, rigs, focus: observer.headPivot, context };
}

const BUILDERS: Record<string, () => Stage3D> = {
  childhood: playground,
  school: classroom,
  college: cafe,
  office: meetingRoom,
  'middle-age': dinnerTable,
};

export function buildStage(stageId: string): Stage3D {
  const build = BUILDERS[stageId] ?? playground;
  return build();
}
