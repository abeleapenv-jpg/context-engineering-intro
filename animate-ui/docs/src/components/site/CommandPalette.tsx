/*
 * CommandPalette - global Cmd+K / Ctrl+K fuzzy search.
 *
 * Navigates between components and guide pages. Full keyboard support
 * (arrows, Enter, Escape), aria combobox + listbox semantics, portal
 * rendering, and a Motion entrance that respects reduced motion.
 */
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import { matchIndices, searchItems, type SearchItem } from '../../lib/search';
import { cn } from '../../lib/utils';

function Highlighted({ text, query }: { text: string; query: string }) {
  const indices = new Set(matchIndices(text, query));
  if (query.trim() === '' || indices.size === 0) return <>{text}</>;
  return (
    <>
      {text.split('').map((char, i) =>
        indices.has(i) ? (
          <mark
            key={i}
            className="bg-transparent font-semibold text-foreground"
          >
            {char}
          </mark>
        ) : (
          <span key={i} className="text-muted-foreground">
            {char}
          </span>
        ),
      )}
    </>
  );
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchItems(query), [query]);

  // Reset and focus the input each time the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = (item: SearchItem) => {
    onClose();
    navigate(item.path);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
      return;
    }
    if (event.key === 'Enter' && results[active]) {
      go(results[active]);
    }
  };

  const listId = 'command-palette-list';

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/60"
            onClick={onClose}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            aria-hidden="true"
          />
          <motion.div
            key="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Search documentation"
            className="relative z-10 w-full max-w-md overflow-hidden rounded-lg border border-border bg-card text-foreground shadow-lg"
            initial={reducedMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-2 border-b border-border px-3">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="shrink-0 text-muted-foreground"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={
                  results[active] ? `search-option-${active}` : undefined
                }
                aria-label="Search documentation"
                placeholder="Search components and pages..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onKeyDown}
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline">
                esc
              </kbd>
            </div>
            <ul
              id={listId}
              role="listbox"
              aria-label="Search results"
              className="max-h-72 overflow-y-auto p-1.5"
            >
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No results for "{query}".
                </li>
              ) : (
                results.map((item, index) => (
                  <li key={item.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      id={`search-option-${index}`}
                      aria-selected={index === active}
                      onClick={() => go(item)}
                      onMouseEnter={() => setActive(index)}
                      className={cn(
                        'flex w-full flex-col items-start gap-0.5 rounded-md px-3 py-2 text-left',
                        index === active
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground',
                      )}
                    >
                      <span className="text-sm">
                        <Highlighted text={item.label} query={query} />
                        <span className="ml-2 text-xs text-muted-foreground">
                          {item.group}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="flex items-center gap-3 border-t border-border px-3 py-2 text-[11px] text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
