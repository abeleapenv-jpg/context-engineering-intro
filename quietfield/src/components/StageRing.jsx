/*
 * StageRing: per-life-stage "3 of 5" ring for the home index. Thin rust
 * fill, 1px tan hairline track, no shadow, no number inside the ring
 * (master plan section 10: stage progress rings).
 */
export default function StageRing({ done, total }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? done / total : 0;
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="18" cy="18" r={r} fill="none" stroke="#848177" strokeWidth="1" />
      <circle
        cx="18"
        cy="18"
        r={r}
        fill="none"
        stroke="#904A30"
        strokeWidth="2"
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="butt"
        transform="rotate(-90 18 18)"
      />
    </svg>
  );
}
