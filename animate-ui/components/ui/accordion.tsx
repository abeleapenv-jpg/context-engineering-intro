/*
 * Accordion - self-contained disclosure, animated with Motion.
 *
 * Single or multiple open items, collapsible option, full keyboard and
 * aria support. Content height animates 0 -> auto; under
 * prefers-reduced-motion items open instantly with no animation.
 */
import { AnimatePresence, motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import {
  createContext,
  useContext,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';

import { cn } from '../../lib/utils';

interface AccordionContextValue {
  openItems: Set<string>;
  toggle: (value: string) => void;
  /** Seconds for the height animation (0 = instant). */
  duration: number;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

interface AccordionItemContextValue {
  value: string;
  contentId: string;
  open: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

function useAccordion(): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error('AccordionItem must be used inside <Accordion>.');
  return ctx;
}

function useAccordionItem(): AccordionItemContextValue {
  const ctx = useContext(AccordionItemContext);
  if (!ctx)
    throw new Error(
      'AccordionTrigger and AccordionContent must be used inside <AccordionItem>.',
    );
  return ctx;
}

export interface AccordionProps
  extends Omit<ComponentProps<'div'>, 'defaultValue'> {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  /** Seconds for the open/close height animation. Default 0.2. */
  duration?: number;
}

export function Accordion({
  type = 'single',
  collapsible = true,
  defaultValue,
  duration = 0.2,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const initial =
      defaultValue === undefined
        ? []
        : Array.isArray(defaultValue)
          ? defaultValue
          : [defaultValue];
    return new Set(initial);
  });

  const toggle = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (type === 'multiple') {
        if (next.has(value)) {
          next.delete(value);
        } else {
          next.add(value);
        }
        return next;
      }
      if (next.has(value)) {
        if (collapsible) next.delete(value);
        return next;
      }
      return new Set([value]);
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggle, duration }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: ComponentProps<'div'> & { value: string }) {
  const { openItems } = useAccordion();
  const contentId = useId();
  const open = openItems.has(value);
  return (
    <AccordionItemContext.Provider value={{ value, contentId, open }}>
      <div className={cn('border-b border-border', className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  const { toggle } = useAccordion();
  const { value, contentId, open } = useAccordionItem();
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => toggle(value)}
      className={cn(
        'flex w-full flex-1 items-center justify-between gap-2 rounded-md py-4 text-left text-sm font-medium transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      data-state={open ? 'open' : 'closed'}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'shrink-0 transition-transform duration-200',
          open && 'rotate-180',
        )}
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: Omit<HTMLMotionProps<'div'>, 'children'> & { children?: ReactNode }) {
  const { contentId, open } = useAccordionItem();
  const { duration } = useAccordion();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    // A motion.div with no animation props renders as a plain div:
    // content mounts and unmounts instantly.
    return open ? (
      <motion.div
        id={contentId}
        className={cn('overflow-hidden text-sm', className)}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </motion.div>
    ) : null;
  }

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="content"
          id={contentId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration, ease: 'easeOut' }}
          className={cn('overflow-hidden text-sm', className)}
          {...props}
        >
          <div className="pb-4 pt-0">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
