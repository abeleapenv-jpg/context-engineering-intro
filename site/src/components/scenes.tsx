/*
 * QUIETFIELD SCENE BACKGROUNDS (2D/SVG)
 *
 * Custom-drawn stage sets in the four-token palette. Faceless figures
 * only (§3): ambiguity of expression is intentional. No gradients, no
 * stock assets, corners stay near-sharp.
 *
 * The DOF blur filter is defined once, here, and referenced by the
 * background layer in every scene.
 */
import type { ReactNode } from 'react';

import {
  FigureChild,
  FigureSeated,
  FigureStanding,
} from './shapes';

interface StageSetProps {
  children: ReactNode;
  /** Extra elements like shadows/lines drawn in the stage's own language. */
  extras?: ReactNode;
}

function StageSet({ children, extras }: StageSetProps) {
  return (
    <svg
      viewBox="0 0 1000 667"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
    >
      {extras}
      {children}
    </svg>
  );
}

/* ------------------------------ CHILDHOOD ------------------------------ */

/** The playground: hard midday sun, hard shadows, wide flat park light
 *  (§5.3 canonical). Figures: the two children and the rope between them. */
export function PlaygroundStage() {
  return (
    <StageSet
      extras={
        <g>
          {/* ground line, hard shadow beneath the figures */}
          <line x1="0" y1="560" x2="1000" y2="560" stroke="#efe7db" strokeWidth="3" opacity="0.5" />
          {/* hard shadows - midday sun (§5.3 light directive) */}
          <ellipse cx="360" cy="572" rx="95" ry="10" fill="#1e1e17" opacity="0.35" />
          <ellipse cx="640" cy="572" rx="95" ry="10" fill="#1e1e17" opacity="0.35" />
          {/* the disputed object: a skipping rope, center stage */}
          <g transform="translate(500 540)">
            <path
              d="M-46 10 Q-24 34 0 10 Q24 -14 46 10"
              fill="none"
              stroke="#efe7db"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <rect x="-9" y="2" width="18" height="6" rx="1" fill="#efe7db" />
          </g>
        </g>
      }
    >
      {/* the two children, grounded at the feet */}
      <g transform="translate(240 380)">
        <g transform="scale(1.6)">
          <FigureChild className="qf-figure-breathe" />
        </g>
      </g>
      <g transform="translate(660 380)">
        <g transform="scale(1.6) scale(-1, 1)">
          <FigureChild className="qf-figure-breathe" armUp />
        </g>
      </g>
      {/* distant figures: playground context */}
      <g transform="translate(80 420) scale(0.9)" opacity="0.45">
        <FigureChild />
      </g>
      <g transform="translate(880 420) scale(0.9)" opacity="0.45">
        <FigureChild armUp />
      </g>
      {/* tree: vertical rule language, not a stock clip-art blob */}
      <g transform="translate(140 120)">
        <rect x="0" y="0" width="12" height="120" fill="#efe7db" opacity="0.3" />
        <rect x="-34" y="20" width="80" height="46" rx="2" fill="#efe7db" opacity="0.2" />
      </g>
      <g transform="translate(850 160)">
        <rect x="0" y="0" width="10" height="90" fill="#efe7db" opacity="0.3" />
        <rect x="-26" y="10" width="62" height="38" rx="2" fill="#efe7db" opacity="0.2" />
      </g>
    </StageSet>
  );
}

/* ------------------------------ SCHOOL ------------------------------ */

/** The classroom: even light, no hierarchy (§5.4 canonical), desks in
 *  synchronized rows. The dark form at front = the figure being mocked. */
export function ClassroomStage() {
  return (
    <StageSet
      extras={
        <g>
          <line x1="0" y1="480" x2="1000" y2="480" stroke="#efe7db" strokeWidth="2" opacity="0.4" />
          <line x1="0" y1="600" x2="1000" y2="600" stroke="#efe7db" strokeWidth="2" opacity="0.4" />
          {/* chalkboard rule */}
          <rect x="260" y="70" width="480" height="2" fill="#848177" />
          <rect x="240" y="60" width="520" height="90" fill="none" stroke="#848177" strokeWidth="2" />
        </g>
      }
    >
      {/* synchronized rows of seated figures */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <g
            key={`${row}-${col}`}
            transform={`translate(${150 + col * 210} ${260 + row * 115})`}
            opacity="0.5"
          >
            <g transform="scale(0.85)">
              <FigureSeated className="qf-figure-breathe" />
            </g>
          </g>
        )),
      )}
      {/* the figure at the front: compresses toward the background (§5.4 2D) */}
      <g transform="translate(430 180) scale(0.75)" opacity="0.75">
        <FigureSeated fill="#904a30" />
      </g>
      {/* the teacher, at the board */}
      <g transform="translate(490 96) scale(0.7)">
        <FigureStanding fill="#848177" />
      </g>
    </StageSet>
  );
}

/* ------------------------------ COLLEGE ------------------------------ */

/** The café: warm intimate light, two chairs, a table between them
 *  (§5.5 canonical). The second figure is the one the two-shot plays against. */
export function CafeStage() {
  return (
    <StageSet
      extras={
        <g>
          <line x1="0" y1="560" x2="1000" y2="560" stroke="#efe7db" strokeWidth="2" opacity="0.4" />
          {/* table between the two chairs */}
          <rect x="470" y="430" width="120" height="10" fill="#efe7db" opacity="0.7" />
          <rect x="490" y="440" width="8" height="90" fill="#efe7db" opacity="0.5" />
          <rect x="565" y="440" width="8" height="90" fill="#efe7db" opacity="0.5" />
          {/* window, evening */}
          <rect x="70" y="90" width="220" height="300" fill="none" stroke="#848177" strokeWidth="2" />
          <line x1="180" y1="90" x2="180" y2="390" stroke="#848177" strokeWidth="2" />
        </g>
      }
    >
      <g transform="translate(300 380)">
        <g transform="scale(1.5)">
          <FigureSeated className="qf-figure-breathe" />
        </g>
      </g>
      <g transform="translate(690 380)">
        <g transform="scale(1.5) scale(-1, 1)">
          <FigureSeated className="qf-figure-breathe" />
        </g>
      </g>
      {/* barista figure in the back, soft */}
      <g transform="translate(120 300) scale(1.1)" opacity="0.4">
        <FigureStanding armUp={false} />
      </g>
    </StageSet>
  );
}

/* ------------------------------ OFFICE ------------------------------ */

/** The meeting room: neutral light, the table long, several figures at
 *  competing planes (§5.6 canonical). The two figures at the table's
 *  head are the subjects of the credit debate. */
export function MeetingRoomStage() {
  return (
    <StageSet
      extras={
        <g>
          <line x1="0" y1="520" x2="1000" y2="520" stroke="#efe7db" strokeWidth="2" opacity="0.4" />
          {/* conference table */}
          <path d="M120 470 L880 470 L860 500 L140 500 Z" fill="#efe7db" opacity="0.25" />
          <path d="M120 470 L880 470 L860 500 L140 500 Z" fill="none" stroke="#848177" strokeWidth="2" />
        </g>
      }
    >
      {/* the presenter figure, up front */}
      <g transform="translate(620 250) scale(1.15)">
        <FigureStanding />
      </g>
      {/* competing focal planes: several seated figures at the table */}
      <g transform="translate(220 330) scale(1.05)" opacity="0.6">
        <FigureSeated className="qf-figure-breathe" />
      </g>
      <g transform="translate(400 350) scale(0.95)" opacity="0.6">
        <FigureSeated className="qf-figure-breathe" />
      </g>
      <g transform="translate(760 360) scale(0.9)" opacity="0.6">
        <FigureSeated className="qf-figure-breathe" />
      </g>
      {/* the colleague who gets the credit: a highlight plane */}
      <g transform="translate(520 340) scale(1)" opacity="0.95">
        <FigureSeated className="qf-figure-breathe" />
      </g>
    </StageSet>
  );
}

/* ------------------------------ MIDDLE AGE ------------------------------ */

/** The dinner table: warm, low, practical light (§5.7 canonical), a long
 *  table with a few figures, the Observer among them. */
export function DinnerTableStage() {
  return (
    <StageSet
      extras={
        <g>
          <line x1="0" y1="540" x2="1000" y2="540" stroke="#efe7db" strokeWidth="2" opacity="0.4" />
          {/* the table, long and low */}
          <path d="M60 430 L940 430 L920 470 L80 470 Z" fill="#efe7db" opacity="0.3" />
          <path d="M60 430 L940 430 L920 470 L80 470 Z" fill="none" stroke="#848177" strokeWidth="2" />
          {/* practicals: a candle between the figures */}
          <rect x="496" y="404" width="8" height="26" fill="#efe7db" />
          <rect x="494" y="392" width="12" height="10" rx="2" fill="#904a30" />
        </g>
      }
    >
      {/* family figures around the table, warm register */}
      <g transform="translate(200 360) scale(1.1)" opacity="0.85">
        <FigureSeated className="qf-figure-breathe" />
      </g>
      <g transform="translate(760 360) scale(1.1)" opacity="0.85">
        <FigureSeated className="qf-figure-breathe" />
      </g>
      {/* the Observer's chair, facing us */}
      <g transform="translate(490 300) scale(1.3)">
        <FigureSeated className="qf-figure-breathe" />
      </g>
      {/* lamp: practical, warm */}
      <g transform="translate(880 180)">
        <rect x="0" y="120" width="6" height="120" fill="#efe7db" opacity="0.6" />
        <path d="M-40 120 L46 120 L20 60 L-14 60 Z" fill="#efe7db" opacity="0.35" />
        <rect x="12" y="40" width="10" height="20" rx="2" fill="#904a30" />
      </g>
    </StageSet>
  );
}

/* ------------------------- ENTRY SEQUENCE (THRESHOLD) ------------------------- */

/** Beat 1: the glimpsed figure, close, frozen mid-gesture (§4.2).
 *  Beat 3's dolly-out reveals this same figure was not alone. */
export function ThresholdStage() {
  return (
    <StageSet
      extras={
        <g>
          <line x1="0" y1="620" x2="1000" y2="620" stroke="#efe7db" strokeWidth="2" opacity="0.25" />
        </g>
      }
    >
      {/* the ambiguous figure: close, mid-gesture, arm up.
          Reaching? Waving? Blocking? The pose must not decide (§4.3). */}
      <g transform="translate(470 330) scale(1.8)">
        <FigureStanding className="qf-figure-sway" armUp />
      </g>
      {/* the wider context revealed by the dolly-out (beat 3):
          figures in a loose group, facing the first figure.
          This recontextualizes the gesture without resolving it. */}
      <g transform="translate(180 380) scale(1.4)" opacity="0.55">
        <FigureStanding armUp={false} />
      </g>
      <g transform="translate(760 380) scale(1.4)" opacity="0.55">
        <FigureStanding />
      </g>
      {/* a railing, so the raised arm might be a wave over a barrier */}
      <g transform="translate(0 470)">
        <rect x="0" y="0" width="1000" height="8" fill="#848177" opacity="0.6" />
        <rect x="80" y="-40" width="8" height="48" fill="#848177" opacity="0.6" />
        <rect x="240" y="-40" width="8" height="48" fill="#848177" opacity="0.6" />
        <rect x="400" y="-40" width="8" height="48" fill="#848177" opacity="0.6" />
        <rect x="560" y="-40" width="8" height="48" fill="#848177" opacity="0.6" />
        <rect x="720" y="-40" width="8" height="48" fill="#848177" opacity="0.6" />
        <rect x="880" y="-40" width="8" height="48" fill="#848177" opacity="0.6" />
      </g>
      {/* a window behind, so the arm might be reaching toward it */}
      <g transform="translate(760 120)">
        <rect x="0" y="0" width="160" height="200" fill="none" stroke="#848177" strokeWidth="2" />
        <line x1="80" y1="0" x2="80" y2="200" stroke="#848177" strokeWidth="2" />
      </g>
    </StageSet>
  );
}
