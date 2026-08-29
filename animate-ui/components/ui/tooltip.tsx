/*
 * Tooltip - hover/focus hint, Motion fade, no portal.
 *
 * Positions relative to the trigger wrapper (top/bottom/left/right).
 * Shows after a short delay, hides on leave/blur/Esc. aria-describedby
 * wires the tooltip text to the focusable trigger. Reduced motion:
 * appears instantly with no offset animation.
 */
import { motion, useReducedMotion } from 'motion/react';
import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';

import { cn } from '../../lib/utils';

const POSITIONS = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
} as const;

const TooltipDelayContext = createContext(200);

export function TooltipProvider({
  delayDuration = 200,
  children,
}: {
  delayDuration?: number;
  children: ReactNode;
}) {
  return (
    <TooltipDelayContext.Provider value={delayDuration}>
      {children}
    </TooltipDelayContext.Provider>
  );
}

export interface TooltipProps {
  content: ReactNode;
  side?: keyof typeof POSITIONS;
  /** Seconds for the fade animation. Default 0.15. */
  duration?: number;
  /** Any focusable element (button, link, input, ...). */
  children: ReactElement<HTMLAttributes<HTMLElement>>;
}

export function Tooltip({
  content,
  side = 'top',
  duration = 0.15,
  children,
}: TooltipProps) {
  const id = useId();
  const delayDuration = useContext(TooltipDelayContext);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  const show = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delayDuration);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Clone the trigger so the focusable element owns the describedby ref
  // and the show/hide handlers, regardless of its element type.
  const trigger = cloneElement(children, {
    'aria-describedby': open ? id : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  });

  return (
    <span className="relative inline-flex">
      {trigger}
      {open ? (
        <motion.span
          id={id}
          role="tooltip"
          initial={
            reducedMotion ? false : { opacity: 0, y: side === 'bottom' ? -2 : 2 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, ease: 'easeOut' }}
          className={cn(
            'pointer-events-none absolute z-50 w-max max-w-64 rounded-md bg-foreground px-2 py-1.5 text-xs text-background',
            POSITIONS[side],
          )}
        >
          {content}
        </motion.span>
      ) : null}
    </span>
  );
}
