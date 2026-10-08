import { useEffect } from 'react';

let lockCount = 0;
let previousOverflow = '';

/** Keeps page scrolling locked until every mounted modal has released its lock. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
        const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis;
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
      }
    };
  }, [locked]);
}
