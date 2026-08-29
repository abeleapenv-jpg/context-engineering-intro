/*
 * Entry sequence session gate (spec §4.2): plays once per browser session,
 * never auto-loops, never re-triggers to recapture attention.
 */

export const ENTRY_SESSION_KEY = 'quietfield.entered.v1';

export function hasEnteredThisSession(): boolean {
  try {
    return sessionStorage.getItem(ENTRY_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function markEntered(): void {
  try {
    sessionStorage.setItem(ENTRY_SESSION_KEY, '1');
  } catch {
    // Session flag is a courtesy; completion still proceeds.
  }
}
