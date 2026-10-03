import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import MagneticButton from '@/components/MagneticButton';
import { contact } from '@/data/siteData';
import { WhatsAppIcon } from '@/components/Icons';
import StrokeText from '@/components/StrokeText';

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        glowRef.current,
        { scale: 0.4, opacity: 0.15 },
        {
          scale: 1,
          opacity: 0.55,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'top 30%', scrub: true },
        }
      );
      gsap.fromTo(
        headingRef.current?.querySelectorAll('[data-reveal]') ?? [],
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 70%' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[var(--color-void)] pt-4 pb-10 sm:pt-6 sm:pb-14">
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vw] w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(255,42,85,0.25), transparent 70%)' }}
      />
      <div className="pulse-dot pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400" />

      <div ref={headingRef} className="container-page relative text-center">
        <div data-reveal className="eyebrow mb-6 text-pink-300 font-bold uppercase tracking-[0.2em] text-xs sm:text-sm">
          READY WHEN YOU ARE
        </div>
        <h2 className="font-display mx-auto max-w-5xl text-[10vw] font-black uppercase leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          <span data-reveal className="block">
            <StrokeText
              text="READY TO TAKE"
              strokeColor="#ffffff"
              fillColor="#ffffff"
              strokeWidth={2}
              drawDuration={1.8}
              fillDelay={0.3}
              repeatDelay={5}
              stagger={0.06}
              ease="power2.out"
              trigger="loop"
              fillMode="wipe"
              fontSize={64}
              fontWeight={900}
              letterSpacing={-2}
            />
          </span>
          <span data-reveal className="block mt-1 sm:mt-2">
            <StrokeText
              text="YOUR BRAND HIGHER?"
              accentText="HIGHER?"
              strokeColor="#ffffff"
              fillColor="#ffffff"
              accentStrokeColor="#ff007f"
              accentFillColor="#ff007f"
              strokeWidth={2}
              drawDuration={1.8}
              fillDelay={0.05}
              repeatDelay={5}
              stagger={0.04}
              ease="power2.out"
              trigger="loop"
              fillMode="wipe"
              fontSize={64}
              fontWeight={900}
              letterSpacing={-2}
            />
          </span>
        </h2>
        <p data-reveal className="mx-auto mt-6 max-w-md text-lg font-medium text-white/90 leading-relaxed">
          Let's create something people can't help but look up for.
        </p>

        <div data-reveal className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton
            as="a"
            href="#contact"
            cursorLabel="Start"
            className="inline-flex items-center gap-2.5 rounded-full bg-white hover:bg-pink-300 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all hover:scale-105"
          >
            Start a campaign →
          </MagneticButton>
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/60 bg-emerald-500/10 px-7 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] text-emerald-300 shadow-[0_0_15px_rgba(37,211,102,0.3)] transition-all hover:bg-emerald-500/20 hover:scale-105"
          >
            <WhatsAppIcon className="h-4 w-4 fill-current text-[#25D366]" />
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  );
}
