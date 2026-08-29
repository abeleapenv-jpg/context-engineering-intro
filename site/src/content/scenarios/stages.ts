import type { Stage } from './types';

/*
 * The five life stages and their §5.2 motion languages.
 */
export const STAGES: Stage[] = [
  {
    id: 'childhood',
    name: 'The Playground',
    motionLanguage:
      'Fast, bouncy, abrupt. Hard cuts read as reactivity; the first eased move a scenario makes is the visual signal that the Observer paused.',
  },
  {
    id: 'school',
    name: 'The Classroom',
    motionLanguage:
      'Repeated, simultaneous gestures across the group; independent judgment breaks the sync with a distinct move for one element.',
  },
  {
    id: 'college',
    name: 'The Café',
    motionLanguage:
      'Alternating shot/reverse-shot rhythm; camera distance opens gradually and only at the rate disclosure is actually reciprocated.',
  },
  {
    id: 'office',
    name: 'The Meeting Room',
    motionLanguage:
      'Overlapping, competing focal planes that resolve into a single clean rack-focus once clarity is reached. Clarity arrives via focus-pull, not loudness.',
  },
  {
    id: 'middle-age',
    name: 'The Dinner Table',
    motionLanguage:
      'Slow, mostly locked-off camera, minimal cuts, warm natural light. Presence is expressed by the camera declining to perform.',
  },
];
