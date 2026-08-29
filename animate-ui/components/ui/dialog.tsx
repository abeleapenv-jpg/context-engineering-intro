/*
 * Dialog - self-contained modal with portal, focus management, and Motion.
 *
 * Esc closes, backdrop click closes, focus moves into the panel on open
 * and returns to the trigger on close. Animations are 150ms fades with a
 * subtle scale, skipped under prefers-reduced-motion.
 *
 * Composition: DialogTrigger and DialogClose render where you place them;
 * DialogContent's children are slotted into the portal panel.
 */
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../../lib/utils';

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  /** Slot the portal panel renders. */
  content: ReactNode;
  setContent: (node: ReactNode) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('Dialog parts must be used inside <Dialog>.');
  return ctx;
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [content, setContent] = useState<ReactNode>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Focus + scroll management while open.
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open, onOpenChange]);

  return (
    <DialogContext.Provider
      value={{
        open,
        setOpen: onOpenChange,
        titleId,
        descriptionId,
        content,
        setContent,
      }}
    >
      {children}
      {createPortal(
        <AnimatePresence>
          {open ? (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              data-testid="dialog-root"
            >
              <motion.div
                key="backdrop"
                className="fixed inset-0 bg-black/80"
                onClick={() => onOpenChange(false)}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
              />
              <motion.div
                key="panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                tabIndex={-1}
                className="relative z-10 w-full max-w-lg rounded-lg border border-border bg-background p-6 text-foreground shadow-lg outline-none"
                initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {content}
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  const { setOpen } = useDialog();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn('inline-flex', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogClose({
  className,
  children,
  ...props
}: ComponentProps<'button'>) {
  const { setOpen } = useDialog();
  return (
    <button
      type="button"
      onClick={() => setOpen(false)}
      className={cn('inline-flex', className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogContent({ children }: { children: ReactNode }) {
  const { setContent } = useDialog();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setContent(children);
  }, [children]);
  return null;
}

export function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-1.5 text-center sm:text-left', className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<'h2'>) {
  const { titleId } = useDialog();
  return (
    <h2
      id={titleId}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<'p'>) {
  const { descriptionId } = useDialog();
  return (
    <p
      id={descriptionId}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      )}
      {...props}
    />
  );
}
