/*
 * Animate UI - cn() helper.
 *
 * The one utility every component shares: clsx for conditional classes,
 * tailwind-merge so host overrides win over variant defaults. Ships with
 * every component via the registry's `utils` dependency.
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
