/*
 * Skeleton - a loading placeholder with a quiet pulse.
 *
 * The pulse is a CSS animation (animate-pulse), so it costs nothing and
 * already respects prefers-reduced-motion in most setups; it is the only
 * permitted motion here.
 */
import type { ComponentProps } from 'react';

import { cn } from '../../lib/utils';

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      aria-hidden="true"
      {...props}
    />
  );
}
