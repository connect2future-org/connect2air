import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from './useReducedMotion';
import { useIsTouch } from './useMediaQuery';

/**
 * Drives Lenis smooth scrolling and keeps GSAP ScrollTrigger in sync with it.
 * Disabled automatically for touch devices and prefers-reduced-motion.
 */
export function useSmoothScroll() {
  const reducedMotion = useReducedMotion();
  const isTouch = useIsTouch();

  useEffect(() => {
    if (reducedMotion || isTouch) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger cached pin positions after DOM layout & images settle
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 300);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1000);

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      delete (window as unknown as { lenis?: Lenis }).lenis;
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [reducedMotion, isTouch]);
}
