import { useEffect } from 'react';

/** Unique page titles per route (pre-launch checklist #5). */
export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);
}
