/*
 * MobileDrawer - slide-over navigation for small screens.
 *
 * Opens from the hamburger, closes on link selection, Escape, or
 * backdrop click. Focus moves into the drawer on open and back to the
 * trigger on close.
 */
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { cn } from '../../lib/utils';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'License', to: '/license' },
  { label: 'Contributing', to: '/contributing' },
];

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const reducedMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden" id="mobile-drawer">
          <motion.div
            key="drawer-backdrop"
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            aria-hidden="true"
          />
          <motion.aside
            key="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-y-0 left-0 z-10 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background p-4"
            initial={reducedMotion ? false : { x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold tracking-tight">
                animate<span className="text-muted-foreground">/</span>ui
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-accent font-medium text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
