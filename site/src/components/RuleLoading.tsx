/*
 * QUIETFIELD RULE LOADING ORNAMENT (§3.6.1 #21)
 *
 * The real loading state for 3D scenes: the logo's thin rule with end
 * ticks, drawing itself quietly. Never a blank flash or a gray skeleton.
 */
import { RuleWithTicks } from './shapes';

export function RuleLoading() {
  return (
    <div className="qf-loading" role="status" aria-label="Loading scene">
      <span className="qf-rule-loading">
        <RuleWithTicks />
      </span>
    </div>
  );
}
