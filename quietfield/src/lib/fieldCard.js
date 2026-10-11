import { ARCHETYPE_ORDER, TOTAL } from './scenarios';

/*
 * Field card (engagement Phase 2, feature 4): a 4:5 PNG of the walker's
 * pattern sentence and archetype counts, drawn on a canvas with the four
 * brand colors only. No emails, ids, or timestamps - nothing beyond the
 * note and the counts the completion page already shows.
 *
 * The studio credit is passed in by the caller (the exact footer string);
 * nothing about the studio is hardcoded in this file.
 */

const CARD_W = 1080;
const CARD_H = 1350;
const HAIRLINE_INSET = 48;
const MARGIN = 96; // content margin inside the hairline
const CONTENT_W = CARD_W - MARGIN * 2;

const INK = '#1e1e17';
const CREAM = '#efe7db';
const RUST = '#904a30';
const TAN = '#848177';
const TAN_40 = 'rgba(132, 129, 119, 0.4)';

/* Same stacks as the @theme tokens; the canvas falls back the same way. */
const MONO_STACK = '"IBM Plex Mono", ui-monospace, "SFMono-Regular", Menlo, monospace';
const SERIF_STACK = '"Fraunces Variable", "Fraunces", Georgia, serif';

/**
 * Canvas availability probe. jsdom (the smoke test) has no 2d context;
 * callers hide the card UI entirely rather than showing an error.
 */
export function canvasAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return typeof canvas.getContext === 'function' && canvas.getContext('2d') !== null;
  } catch {
    return false;
  }
}

/** Word-wrap via measureText; a single overlong word overflows, never breaks. */
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth || !line) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Wait for the brand faces so the card never renders in a fallback.
 * IBM Plex Mono ships in weights 400-600, so 600 is the boldest real face.
 */
async function waitForFonts() {
  try {
    if (typeof document.fonts?.load !== 'function') return;
    await document.fonts.load('800 28px "Archivo Variable"');
    await document.fonts.load('400 44px "Fraunces Variable"');
    await document.fonts.load('600 30px "IBM Plex Mono"');
    await document.fonts.ready;
  } catch {
    /* fonts stay as installed fallbacks; the card still draws */
  }
}

function drawLabel(ctx, text, x, y, size) {
  ctx.font = `600 ${size}px ${MONO_STACK}`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${size * 0.18}px`;
  ctx.fillText(text, x, y);
  if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
}

/**
 * Build the 1080x1350 field card. Returns a Promise<Blob> (image/png).
 * Draws only after the brand fonts resolve, uses only the four brand
 * colors, and puts the note and counts on the canvas - nothing else.
 */
export async function buildFieldCard({ note, counts, studioCredit }) {
  await waitForFonts();

  const canvas = document.createElement('canvas');
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');

  // Ink ground with a 1px tan hairline inset 48px.
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, CARD_W, CARD_H);
  ctx.strokeStyle = TAN;
  ctx.lineWidth = 1;
  ctx.strokeRect(HAIRLINE_INSET + 0.5, HAIRLINE_INSET + 0.5, CARD_W - HAIRLINE_INSET * 2 - 1, CARD_H - HAIRLINE_INSET * 2 - 1);

  // Top: the wordmark.
  ctx.fillStyle = TAN;
  ctx.textBaseline = 'alphabetic';
  drawLabel(ctx, 'QUIETFIELD', MARGIN, 150, 30);

  // Middle: the pattern sentence, cream serif, wrapped to the content width
  // and settled in the quiet zone between wordmark and tally.
  ctx.font = `400 44px ${SERIF_STACK}`;
  const lineHeight = 44 * 1.4;
  const lines = wrapText(ctx, String(note ?? ''), CONTENT_W);
  const zoneTop = 260;
  const zoneBottom = 810;
  let y = zoneTop + (zoneBottom - zoneTop - lines.length * lineHeight) / 2 + 44;
  ctx.fillStyle = CREAM;
  for (const line of lines) {
    ctx.fillText(line, MARGIN, y);
    y += lineHeight;
  }

  // The four archetype rows across the whole field: mono tan label, thin
  // tan track, rust fill proportional to the count (squares would need 25).
  let rowY = 900;
  for (const archetype of ARCHETYPE_ORDER) {
    const count = Number(counts?.[archetype] ?? 0);
    ctx.fillStyle = TAN;
    drawLabel(ctx, archetype.toUpperCase(), MARGIN, rowY, 26);
    const barY = rowY + 20;
    ctx.fillStyle = TAN_40;
    ctx.fillRect(MARGIN, barY, CONTENT_W, 8);
    ctx.fillStyle = RUST;
    ctx.fillRect(MARGIN, barY, (CONTENT_W * count) / TOTAL, 8);
    rowY += 96;
  }

  // Bottom: the studio credit, exactly as the footer shows it.
  ctx.fillStyle = TAN;
  drawLabel(ctx, String(studioCredit ?? '').toUpperCase(), MARGIN, 1258, 26);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('field card export failed'));
    }, 'image/png');
  });
}
