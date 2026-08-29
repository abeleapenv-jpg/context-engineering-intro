/*
 * Tabs - accessible tab primitives (WAI-ARIA tabs pattern).
 *
 * ArrowLeft/ArrowRight move between tabs (with wrapping), Home/End jump
 * to the ends. Panels are hidden with the `hidden` attribute so inactive
 * content is neither visible nor focusable.
 */
import {
  createContext,
  useContext,
  useRef,
  type ComponentProps,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

import { cn } from '../../lib/utils';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs parts must be used inside <Tabs>.');
  return ctx;
}

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  baseId?: string;
  children: ReactNode;
}

export function Tabs({ value, onValueChange, baseId = 'tabs', children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange, baseId }}>
      {children}
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: ComponentProps<'div'>) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { value, setValue } = useTabs();

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const triggers = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    if (triggers.length === 0) return;
    const current = triggers.findIndex((t) => t.dataset.value === value);
    let next = current;
    if (event.key === 'ArrowRight') next = (current + 1) % triggers.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + triggers.length) % triggers.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = triggers.length - 1;
    event.preventDefault();
    const target = triggers[next];
    setValue(target.dataset.value ?? value);
    target.focus();
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Component documentation"
      onKeyDown={onKeyDown}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  value,
  className,
  ...props
}: ComponentProps<'button'> & { value: string }) {
  const { value: active, setValue, baseId } = useTabs();
  const selected = value === active;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      data-value={value}
      onClick={() => setValue(value)}
      className={cn(
        'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        selected
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  value,
  className,
  ...props
}: ComponentProps<'div'> & { value: string }) {
  const { value: active, baseId } = useTabs();
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      hidden={value !== active}
      className={cn('mt-4 outline-none', className)}
      {...props}
    />
  );
}
