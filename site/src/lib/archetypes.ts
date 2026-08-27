/*
 * One-word reads of the §3.7.1 response archetypes, shown on choice
 * hover/focus as real information about the response being previewed
 * (§3.6.1 #28).
 */
import type { Archetype } from './camera';

export const ARCHETYPE_WORDS: Record<Archetype, string> = {
  reactive: 'IMPULSE',
  avoidant: 'STEP BACK',
  clarifying: 'CLARIFY',
  regulated: 'DELIBERATE',
};
