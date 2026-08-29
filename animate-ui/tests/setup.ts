/* Test setup: jest-dom matchers + jsdom polyfills. Motion animations run
 * for real here; exit completions are asserted with
 * waitForElementToBeRemoved (jsdom provides requestAnimationFrame, so
 * Motion's short exits finish on their own). */
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
