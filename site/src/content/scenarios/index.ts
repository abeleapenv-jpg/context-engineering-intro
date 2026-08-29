/*
 * QUIETFIELD SCENARIOS INDEX
 * All 25 scenarios, assembled from per-stage modules so each life stage
 * can be built and shipped independently (spec §1.1 build order).
 */
import type { Scenario } from './types';
import { STAGES } from './stages';
import { CHILDHOOD } from './childhood';
import { SCHOOL } from './school';
import { COLLEGE } from './college';
import { OFFICE } from './office';
import { MIDDLE_AGE } from './middle-age';

export type { Scenario, Stage, Choice } from './types';
export { STAGES };

export const SCENARIOS: Scenario[] = [
  ...CHILDHOOD,
  ...SCHOOL,
  ...COLLEGE,
  ...OFFICE,
  ...MIDDLE_AGE,
];

/** §7.5 #9: distinct page titles per scenario. */
export function pageTitleFor(scenario: Scenario): string {
  return `${scenario.title} - Quietfield`;
}
