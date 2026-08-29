/*
 * CopyButton - one-click copy with animated feedback.
 *
 * The label swaps between "Copy" and a checkmark "Copied" with a quick
 * Motion pop; reduced motion keeps the swap instant (opacity only).
 */
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy code'}
      className="inline-flex min-w-16 items-center justify-center rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.12 }}
            className="inline-flex items-center gap-1 text-emerald-500"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={false}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
