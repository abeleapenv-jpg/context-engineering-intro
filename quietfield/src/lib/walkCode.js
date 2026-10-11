import { SCENARIOS } from './scenarios';

/*
 * Walk-together invitation codes (engagement Phase 3): an invitation is a
 * link whose hash carries the inviter's 25 choice letters and nothing else
 * - no name, no email, no id, no timestamp. One character per scenario in
 * canonical SCENARIOS order; '-' marks an unwalked scenario.
 *
 * decodeWalk's strict format check is the ONLY gate on URL input; the raw
 * code is never rendered in a page.
 */

const LS_KEY = 'quietfield:compare:v1';
const VALID_KEYS = new Set(['A', 'B', 'C', 'D']);
const CODE_PATTERN = /^[ABCD-]+$/;

/** The inviter's choices as one character per scenario ('-' when unwalked). */
export function encodeWalk(choices) {
  let code = '';
  for (const scenario of SCENARIOS) {
    const key = choices?.[scenario.id];
    code += typeof key === 'string' && VALID_KEYS.has(key) ? key : '-';
  }
  return code;
}

/**
 * URL input back to a choices map. Strict: anything that is not exactly
 * SCENARIOS.length characters of A-D or '-' decodes to null. The returned
 * map contains only the non-'-' entries.
 */
export function decodeWalk(code) {
  if (
    typeof code !== 'string' ||
    code.length !== SCENARIOS.length ||
    !CODE_PATTERN.test(code)
  ) {
    return null;
  }
  const choices = {};
  SCENARIOS.forEach((scenario, i) => {
    if (code[i] !== '-') choices[scenario.id] = code[i];
  });
  return choices;
}

/** The shareable invitation link (origin + path + hash route). */
export function buildWalkLink(choices) {
  return `${window.location.origin}${window.location.pathname}#/compare/${encodeWalk(choices)}`;
}

/*
 * Local storage for the accepted invitation. Every access is guarded:
 * storage can be unavailable (private modes, blocked cookies) and the walk
 * must never break because of it - failures are silent.
 */

export function readCompareCode() {
  try {
    return localStorage.getItem(LS_KEY);
  } catch {
    return null;
  }
}

export function saveCompareCode(code) {
  try {
    localStorage.setItem(LS_KEY, code);
  } catch {
    /* silent: comparing is a gift, not a requirement */
  }
}

export function clearCompareCode() {
  try {
    localStorage.removeItem(LS_KEY);
  } catch {
    /* silent */
  }
}

/** The inviter's choices when an invitation is active, else null. */
export function readTheirChoices() {
  return decodeWalk(readCompareCode());
}
