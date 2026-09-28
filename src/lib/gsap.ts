import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Prevent ScrollTrigger from auto-refreshing on every micro layout change.
  // Only refresh on real viewport resizes, not on CSS animation / transition reflows.
  ScrollTrigger.config({
    ignoreMobileResize: true,
    // Limit auto-refresh events to viewport resize only (not load/DOMContentLoaded
    // which can cascade with async CMS data loading).
    autoRefreshEvents: 'visibilitychange,resize',
  });
}

export { gsap, ScrollTrigger };
