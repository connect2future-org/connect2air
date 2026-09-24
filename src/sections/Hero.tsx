import { Suspense, lazy, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { hero } from '@/data/siteData';
import MagneticButton from '@/components/MagneticButton';

const Scene = lazy(() =>
  import('@/components/three/Scene').then((m) => ({ default: m.Scene })),
);

/* Categories shown as a vertical signal tower between copy and drone. */
const BRIDGE_ITEMS = ['FESTIVALS', 'SPORTS', 'LAUNCHES'];

export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const bridgeRef = useRef<HTMLDivElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const sceneInnerRef = useRef<HTMLDivElement>(null);

  /* ---------------------------------------------------------------- */
  /* Entrance timeline                                                 */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(glowRef.current, { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0)
      .fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.3,
      )
      .fromTo(
        headlineRef.current?.querySelectorAll('.line') ?? [],
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.09 },
        0.5,
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.8,
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.0,
      )
      /* Whole bridge column fades in */
      .fromTo(
        bridgeRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.9 },
        1.15,
      )
      /* Each category slides in with a small stagger */
      .fromTo(
        bridgeRef.current?.querySelectorAll('.c2a-bridge__item') ?? [],
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
        1.4,
      )
      /* The bottom tagline appears last */
      .fromTo(
        bridgeRef.current?.querySelectorAll('.c2a-bridge__tagline') ?? [],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.75,
      )
      /* Drone scene */
      .fromTo(
        sceneInnerRef.current,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.3 },
        0.4,
      );
  }, [ready]);

  /* ---------------------------------------------------------------- */
  /* Scroll parallax                                                   */
  /* ---------------------------------------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        yPercent: -18,
        opacity: 0,
        scale: 0.94,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      /* Bridge — moves with parallax but STAYS VISIBLE (no opacity fade) */
      gsap.to(bridgeRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(sceneWrapRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(glowRef.current, {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      ScrollTrigger.refresh();
    }, section);

    return () => ctx.revert();
  }, []);

  /* ---------------------------------------------------------------- */

  return (    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] overflow-hidden bg-[var(--color-void)] lg:min-h-screen"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{
          background:
            'radial-gradient(60% 55% at 30% 50%, rgba(230,0,126,0.10) 0%, transparent 60%), radial-gradient(95% 85% at 50% 50%, rgba(4,7,14,0.15) 0%, rgba(4,7,14,0.85) 100%)',
        }}
      />

      <div className="container-page relative z-10 grid w-full grid-cols-1 gap-8 pt-28 pb-10 sm:pt-32 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.05fr)] lg:gap-8 lg:py-0">

        {/* ============================================================ */}
        {/* LEFT — copy                                                   */}
        {/* ============================================================ */}
        <div
          ref={contentRef}
          className="relative flex flex-col justify-center will-change-transform lg:self-center lg:pt-12"
        >
          <div
            ref={eyebrowRef}
            className="eyebrow mb-6 max-w-md opacity-0 text-pink-300 font-semibold tracking-widest text-sm drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] uppercase"
          >
            {hero.eyebrow}
          </div>

          <h1
            ref={headlineRef}
            className="font-display max-w-xl text-[10vw] font-black uppercase leading-[0.94] tracking-tight sm:text-[6vw] lg:text-[3.8vw] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          >
            <span className="block overflow-hidden">
              <span className="line block text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                {hero.headlineTop}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="line block text-[var(--color-signal-2)] text-glow drop-shadow-[0_0_25px_rgba(255,77,109,0.8)]">
                {hero.headlineAccent}.
              </span>
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-md text-lg sm:text-xl font-medium text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] opacity-0 leading-relaxed"
          >
            {hero.sub}
          </p>

          <div
            ref={ctaRef}
            className="mt-8 flex flex-wrap items-center gap-5 opacity-0"
          >
            <MagneticButton
              as="a"
              href="#services"
              cursorLabel="Go"
              className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-pink-300 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
            >
              {hero.ctaPrimary}
            </MagneticButton>

            <a
              href="#showreel"
              data-cursor="hover"
              className="inline-flex items-center gap-2.5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-white hover:text-pink-300 transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] group"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-500/50 bg-black/40 group-hover:bg-pink-500/20 group-hover:border-pink-300 shadow-[0_0_10px_rgba(255,77,109,0.3)] transition-all">
                ▸
              </span>
              {hero.ctaSecondary}
            </a>
          </div>
        </div>

        {/* ============================================================ */}
        {/* MIDDLE — signal tower bridge                                  */}
        {/* ============================================================ */}
        <div
          ref={bridgeRef}
          className="c2a-bridge relative opacity-0 lg:self-center lg:pt-12"
        >
          {/* Top connector line with animated shimmer */}
          <span className="c2a-bridge__line hidden lg:block" />

          {/* Top pulse dot */}
          <span className="c2a-bridge__dot c2a-bridge__dot--lg hidden lg:block" />

          {/* Categories */}
          <ul className="c2a-bridge__list">
            {BRIDGE_ITEMS.map((item, i) => (
              <li
                key={item}
                className="c2a-bridge__item"
                style={{ ['--i' as string]: i } as React.CSSProperties}
              >
                <span className="c2a-bridge__bullet" />
                <span className="c2a-bridge__label">{item}</span>
              </li>
            ))}
          </ul>

          {/* Bottom pulse dot */}
          <span className="c2a-bridge__dot hidden lg:block" />

          {/* Bottom connector line */}
          <span className="c2a-bridge__line hidden lg:block" />

          {/* Tagline */}
          <p className="c2a-bridge__tagline">
            BUILT FOR
            <br />
            THE SKY
          </p>
        </div>

        {/* ============================================================ */}
        {/* RIGHT — interactive 3D drone                                  */}
        {/* ============================================================ */}
        <div
          ref={sceneWrapRef}
          className="c2a-hero__scene relative z-20 h-[60vh] min-h-[380px] w-full lg:h-[85vh] lg:min-h-[550px] lg:self-center"
        >
          <div ref={sceneInnerRef} className="h-full w-full opacity-0">
            <Suspense fallback={null}>
              <Scene contained />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}