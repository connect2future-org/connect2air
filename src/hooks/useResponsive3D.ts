import { useEffect, useState } from 'react';

export type Quality = 'high' | 'medium' | 'low';

export interface Responsive3D {
  width: number;
  height: number;
  aspect: number;
  isMobile: boolean;
  isTablet: boolean;
  quality: Quality;
  dpr: number;
  postProcessing: boolean;
}

function measure(): Responsive3D {
  const width = typeof window === 'undefined' ? 1440 : window.innerWidth;
  const height = typeof window === 'undefined' ? 900 : window.innerHeight;

  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const quality: Quality = isMobile ? 'low' : isTablet ? 'medium' : 'high';

  const dpr = isMobile ? 1.25 : isTablet ? 1.5 : 2;

  return {
    width,
    height,
    aspect: height > 0 ? width / height : 1,
    isMobile,
    isTablet,
    quality,
    dpr,
    // Post-processing is the first thing we drop on low-power devices.
    postProcessing: !isMobile,
  };
}

/**
 * Lightweight, allocation-free responsive probe for the 3D scene.
 * Recomputes on resize / orientation change using a rAF throttle.
 */
export function useResponsive3D(): Responsive3D {
  const [state, setState] = useState<Responsive3D>(() => measure());

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setState(measure()));
    };

    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('orientationchange', update, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  return state;
}