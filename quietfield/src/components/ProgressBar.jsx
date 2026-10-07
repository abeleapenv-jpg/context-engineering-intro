/*
 * ProgressBar: thin rust fill on a 1px tan hairline track. No percentage
 * bragging, no drop shadow (master plan sections 4 and 10).
 */
export default function ProgressBar({ done, total, label }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        {label ? (
          <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
            {label}
          </span>
        ) : (
          <span />
        )}
        <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-qf-tan">
          {done} OF {total}
        </span>
      </div>
      <div
        className="mt-3 h-px w-full bg-[#848177]/40"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label ? `${label}: ${done} of ${total}` : `${done} of ${total}`}
      >
        <div
          className="h-px bg-qf-rust transition-[width] duration-500 ease-out motion-reduce:transition-none"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
