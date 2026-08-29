/* Vitest setup: jest-dom matchers plus minimal jsdom polyfills for the
 * browser APIs the app touches (media queries, scroll). */
import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList;
  }
  if (!window.scrollTo) {
    window.scrollTo = () => undefined;
  }
}
