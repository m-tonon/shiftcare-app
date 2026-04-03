import { useState, useEffect } from 'react';

/** Matches Tailwind `md` breakpoint. */
export const MD_MIN_WIDTH_PX = 768;

/**
 * True when the viewport is at least `minWidthPx` wide.
 * Safe for client-only SPA: initial state reads `matchMedia` on first render.
 */
export function useMinWidth(minWidthPx: number): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(`(min-width: ${minWidthPx}px)`).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidthPx}px)`);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [minWidthPx]);

  return matches;
}

/** Desktop / tablet landscape layout (same as `md:` in Tailwind). */
export function useIsMdUp(): boolean {
  return useMinWidth(MD_MIN_WIDTH_PX);
}
