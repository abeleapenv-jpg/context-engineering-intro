/*
 * QUIETFIELD FIGURES & MARKS
 *
 * Every mark is custom-drawn at the M-monogram's stroke weight (§3.6.1 #2).
 * No icon library, no emoji, no stock shapes. Figures are abstracted and
 * faceless - ambiguity of expression is load-bearing (§3).
 *
 * Figures ground at the feet: origin at the base of the bounding box.
 */

export interface FigureProps {
  fill?: string;
  /** Optional CSS class for breath/sway animation (torso origin, no bounce). */
  className?: string;
  opacity?: number;
}

/** A seated figure, grounded at the chair base. Head tilt expresses gaze. */
export function FigureSeated({
  fill = '#efe7db',
  className,
  opacity = 1,
}: FigureProps) {
  return (
    <svg
      viewBox="0 0 120 150"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <g opacity={opacity}>
        <g className={className}>
          {/* torso */}
          <path
            d="M52 58 L52 104 Q52 112 60 112 L68 112 Q76 112 76 104 L76 58"
            fill={fill}
          />
          {/* head */}
          <circle cx="64" cy="42" r="16" fill={fill} />
          {/* legs, seated, grounded */}
          <path
            d="M52 106 L34 106 Q26 106 26 114 L26 124 Q26 132 34 132 L58 132 L70 132 L94 132 Q102 132 102 124 L102 114 Q102 106 94 106 L76 106"
            fill={fill}
          />
          {/* chair: same stroke weight language as the monogram */}
          <g stroke={fill} strokeWidth="5" fill="none">
            <path d="M30 138 L30 132 M98 138 L98 132" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** A standing figure. Arm up-left = deliberately ambiguous gesture
 *  (reaching? waving? blocking?) per §4.2 beat 1. */
export function FigureStanding({
  fill = '#efe7db',
  className,
  opacity = 1,
  armUp = true,
}: FigureProps & { armUp?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 170"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <g opacity={opacity}>
        <g className={className}>
          {/* legs, grounded at the feet */}
          <path
            d="M48 112 L44 152 Q44 160 52 160 L60 160 L68 160 L76 160 Q84 160 84 152 L80 112"
            fill={fill}
          />
          {/* torso */}
          <path d="M46 56 L46 116 Q46 124 54 124 L74 124 Q82 124 82 116 L82 56" fill={fill} />
          {/* head */}
          <circle cx="64" cy="38" r="17" fill={fill} />
          {/* arms */}
          <path d="M48 66 L34 84 L26 80 L40 62" fill={fill} />
          {armUp ? (
            <path d="M80 66 L90 40 L98 44 L88 70" fill={fill} />
          ) : (
            <path d="M80 66 L92 86 L100 82 L88 62" fill={fill} />
          )}
        </g>
      </g>
    </svg>
  );
}

/** A small child figure, same construction language, scaled-down proportions. */
export function FigureChild({
  fill = '#efe7db',
  className,
  opacity = 1,
  armUp = false,
}: FigureProps & { armUp?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 130"
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <g opacity={opacity}>
        <g className={className}>
          <path
            d="M50 88 L46 118 Q46 126 54 126 L62 126 L70 126 L78 126 Q86 126 86 118 L82 88"
            fill={fill}
          />
          <path d="M48 44 L48 92 Q48 100 56 100 L72 100 Q80 100 80 92 L80 44" fill={fill} />
          <circle cx="64" cy="28" r="15" fill={fill} />
          <path d="M50 52 L36 66 L29 61 L43 47" fill={fill} />
          {armUp ? (
            <path d="M78 52 L88 28 L96 32 L86 56" fill={fill} />
          ) : (
            <path d="M78 52 L90 68 L97 63 L85 47" fill={fill} />
          )}
        </g>
      </g>
    </svg>
  );
}

export interface MonogramProps {
  /** The single permitted rust accent: the square notch (§3.5). */
  rust?: boolean;
}

/** The M monogram: two peaks meeting at a shared base point, with the
 *  square notch where the strokes meet. Same mark as the source logo. */
export function Monogram({ rust = true }: MonogramProps) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path
        d="M6 6 L6 58 L58 58 L58 26 L36 26 L36 42 L26 42 L26 22 L42 22 L42 6 Z"
        fill="var(--qf-cream)"
      />
      {rust ? <rect x="26" y="26" width="8" height="8" fill="var(--qf-rust)" /> : null}
    </svg>
  );
}

/** The logo's thin rule with end-ticks (§3.5) - the brand's only
 *  permitted "stripe" (§3.6.1 #11). */
export function RuleWithTicks() {
  return (
    <svg viewBox="0 0 200 10" aria-hidden="true" focusable="false" style={{ overflow: 'visible' }}>
      <line
        x1="6"
        y1="5"
        x2="194"
        y2="5"
        stroke="var(--qf-tan)"
        strokeWidth="1"
      />
      <rect x="0" y="0" width="6" height="6" fill="var(--qf-tan)" />
      <rect x="194" y="0" width="6" height="6" fill="var(--qf-tan)" />
    </svg>
  );
}

/** Wordmark lockup: monogram, rule with ticks, "QUIETFIELD" in the logo's
 *  caps setting (§4.3). */
export function Wordmark({ showRule = true }: { showRule?: boolean }) {
  return (
    <span className="qf-wordmark">
      <Monogram />
      {showRule ? <RuleWithTicks /> : null}
      <span className="qf-display qf-wordmark-text">QUIETFIELD</span>
    </span>
  );
}
