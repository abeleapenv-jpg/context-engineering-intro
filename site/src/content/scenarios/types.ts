/*
 * QUIETFIELD CONTENT MODEL
 *
 * The 25 scenarios across five life stages. The directive blocks and
 * psychology tags come from docs/quietfield_3d_animation_layer.md §5.
 * Story, context, and the four choices per scenario are authored here so
 * the 2D skeleton and the future 3D layer share one source of truth.
 *
 * Every choice carries an archetype (§3.7.1) - camera behavior attaches to
 * the archetype, not the letter - and its own short consequence beat
 * (§3: "each of the four response choices needs its own short resolution
 * beat"). Consequences never reveal a single "correct" answer; several
 * scenarios resolve to "not enough information yet" (§4.1).
 *
 * VOICE RULES (spec §3.6.1): no em dashes, no "it's not X, it's Y"
 * constructions, no emoji, plain direct sentences.
 */

import type { Archetype } from '../../lib/camera';

export type { Archetype };

export interface Choice {
  id: string;
  text: string;
  archetype: Archetype;
  consequence: string;
}

export interface Scenario {
  id: string;
  title: string;
  stageId: string;
  canonical: boolean;
  /** §3.7.3 data shape. */
  psychologyTags: string[];
  stageLanguage: string;
  /** §5 camera/light directives carried into the data layer. */
  cameraDirective: string;
  lightDirective: string;
  keyBeat: string;
  /** The situation the observer walks into. */
  context: string;
  choices: Choice[];
}

export interface Stage {
  id: string;
  name: string;
  /** §5.2 motion language for the whole stage. */
  motionLanguage: string;
}


