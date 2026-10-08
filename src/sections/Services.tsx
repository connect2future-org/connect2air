import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import StrokeText from '@/components/StrokeText';
import ElectricBorder from '@/components/ElectricBorder';
import {
  getCMSServices,
  getCMSPricing,
  getCMSServicesAsync,
  getCMSPricingAsync,
  type ServiceItem,
  type PricingItem,
} from '@/utils/cmsStorage';

const DEFAULT_PRICING_ITEMS: PricingItem[] = [
  {
    id: 'p1',
    step: 'ONE FLY',
    price: '₹15,000',
    duration: '10 MINS',
    badge: '1 FLIGHT',
    timeline: 'SINGLE DISPLAY',
    description: '1 Flight duration of 10 minutes over the venue crowd.',
  },
  {
    id: 'p2',
    step: 'TWO FLIES',
    price: '₹30,000',
    duration: '20 MINS',
    badge: '2 FLIGHTS',
    timeline: '2 SESSIONS',
    description: '2 Flights totaling 20 minutes with 1 hour interval.',
  },
  {
    id: 'p3',
    step: 'THREE FLIES',
    price: '₹45,000',
    duration: '30 MINS',
    badge: '3 FLIGHTS',
    timeline: '3 SESSIONS',
    description: '3 Flights totaling 30 minutes with 1 hour intervals.',
  },
  {
    id: 'p4',
    step: 'CUSTOM DISPLAY',
    price: 'Variable Price',
    duration: 'Custom Duration',
    badge: 'BASED ON DURATION',
    timeline: 'AS PER REQUIREMENT',
    description: 'A Custom type Drone LED Display can be made as per the Client requirements.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  const [servicesList, setServicesList] = useState<ServiceItem[]>(getCMSServices());
  const [pricingList, setPricingList] = useState<PricingItem[]>(getCMSPricing());
  const [selectedPricing, setSelectedPricing] = useState<PricingItem | null>(null);

  // Load backend MongoDB state & listen for CMS updates from Admin Page
  useEffect(() => {
    const loadData = async () => {
      const servicesData = await getCMSServicesAsync();
      const pricingData = await getCMSPricingAsync();
      if (servicesData) setServicesList(servicesData);
      if (pricingData) setPricingList(pricingData);
    };
    loadData();
    window.addEventListener('c2a_cms_updated', loadData);
    return () => window.removeEventListener('c2a_cms_updated', loadData);
  }, []);

  // Lock body scroll when pricing modal is active
  useEffect(() => {
    if (selectedPricing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedPricing]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      panelRefs.current.forEach((panel, i) => {
        const next = panelRefs.current[i + 1];
        if (!panel || !next) return;
        const innerCard = panel.querySelector('.group');
        if (!innerCard) return;
        gsap.to(innerCard, {
          scale: 0.96,
          opacity: 0.6,
          ease: 'none',
          scrollTrigger: {
            trigger: next,
            start: 'top 80%',
            end: 'top 120px',
            scrub: true,
          },
        });
      });
    }, section);
    return () => ctx.revert();
  }, [servicesList, pricingList]);

  const displayPricing = (pricingList && pricingList.length > 0) ? pricingList : DEFAULT_PRICING_ITEMS;

  return (
    <section id="services" ref={sectionRef} className="relative bg-[var(--color-void)] py-10 sm:py-16">
      <div id="pricing" ref={headingRef} className="container-page mb-8 sm:mb-12 scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Left Column: Heading & Tagline (Always 100% visible) */}
          <div className="lg:col-span-4">
            <div className="eyebrow mb-4 text-pink-300 font-bold uppercase tracking-widest">Services & Packages</div>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl text-white drop-shadow-[0_2px_12px_rgba(255,42,85,0.3)]">
              One sky.
              <br />
              <span className="text-[var(--color-signal-2)] text-glow drop-shadow-[0_0_20px_rgba(255,77,109,0.7)] inline-block">
                <StrokeText
                  text="ENDLESS POSSIBILITIES."
                  accentText="ENDLESS POSSIBILITIES."
                  strokeColor="#ff007f"
                  fillColor="#ffffff"
                  strokeWidth={2}
                  drawDuration={1.8}
                  fillDelay={0.3}
                  repeatDelay={5}
                  stagger={0.06}
                  ease="power2.out"
                  trigger="loop"
                  fillMode="wipe"
                  fontSize={52}
                  fontWeight={900}
                  letterSpacing={-2}
                />
              </span>
            </h2>
            <p className="mt-4 text-base sm:text-lg font-medium text-white/90 leading-relaxed">
              Aerial advertising engineered for moments people remember. Multi-flight display packages tailored to your event schedule.
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 font-mono text-xs font-bold text-pink-300 shadow-[0_0_15px_rgba(255,42,85,0.2)]">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              <span>Same Ground, Bigger Possibilities</span>
            </div>
          </div>

          {/* Right Column: Pricing Flight Cards (3 Columns in Row 1, 1 Column in Row 2) */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 lg:gap-4">
              {displayPricing.map((pkg, idx) => (
                <ElectricBorder key={pkg.id || pkg.step} color="#ffffff" speed={1} chaos={0.07} borderRadius={16}>
                  <div
                    onClick={() => setSelectedPricing(pkg)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-b from-[#14050e]/95 via-[#0d0309]/95 to-[#070104]/95 p-3.5 sm:p-4 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(255,0,127,0.3)] hover:-translate-y-1 cursor-pointer h-full border border-pink-500/20"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-pink-500 opacity-10 blur-xl transition-opacity duration-500 group-hover:opacity-25" />
                    
                    <div className="space-y-1.5">
                      {/* Top Header Badge & Index */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono text-[8.5px] sm:text-[9px] font-bold uppercase tracking-widest text-pink-300 bg-pink-500/20 border border-pink-400/40 px-2.5 py-0.5 rounded-full shadow-[0_0_6px_rgba(255,20,147,0.25)]">
                          {pkg.badge || 'Flight Package'}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-white/40">0{idx + 1}</span>
                      </div>

                      {/* Package Title */}
                      <div className="font-display text-xs sm:text-sm font-black uppercase text-white tracking-wide group-hover:text-pink-300 transition-colors leading-tight">
                        {pkg.step}
                      </div>

                      {/* Package Price */}
                      <div className="font-display text-xl sm:text-2xl font-black text-pink-300 text-glow drop-shadow-[0_0_12px_rgba(255,20,147,0.7)] leading-none pt-0.5">
                        {pkg.price}
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1.5 text-white pt-0.5">
                        <ClockIcon className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        <span className="font-mono text-[10.5px] sm:text-xs font-extrabold tracking-wider">{pkg.duration}</span>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] sm:text-[11px] font-medium text-white/80 leading-snug pt-0.5">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Video Camera Add-On Banner Box (Exact match to reference image) */}
                    <div className="my-2.5 bg-[#1c0514]/95 border border-pink-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 sm:gap-3 shadow-[0_0_15px_rgba(255,0,127,0.15)]">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#ff007f] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,0,127,0.5)]">
                        <VideoCameraIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs sm:text-sm font-black text-[#ff4d8d] leading-none tracking-wide">
                          + ₹3,000
                        </div>
                        <div className="text-[10px] sm:text-[10.5px] font-bold text-white leading-tight mt-1">
                          for drone shots &amp; video shoot
                        </div>
                        <div className="text-[9.5px] sm:text-[10px] font-medium text-white/75 leading-tight">
                          (if required).
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="pt-2.5 border-t border-white/15 flex items-center justify-between mt-auto">
                      <span className="font-mono text-[9px] sm:text-[9.5px] font-extrabold uppercase tracking-wider text-white truncate">{pkg.timeline}</span>
                      <span className="font-mono text-[9px] sm:text-[9.5px] font-bold text-pink-400 flex items-center gap-0.5 group-hover:text-pink-300 transition-colors shrink-0">
                        Details <span className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                      </span>
                    </div>
                  </div>
                </ElectricBorder>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Overlapping Sticky Cards with 3D & Color Effects */}
      <div className="relative mt-8 pb-12">
        {servicesList.map((service, i) => (
          <div
            key={service.id || service.number}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="sticky origin-top py-4"
            style={{ top: `${90 + i * 16}px`, zIndex: i + 10 }}
          >
            <div className="container-page">
              <ServiceCard service={service} index={i} />
            </div>
          </div>
        ))}
      </div>

      {/* POPUP MODAL FOR PRICING CARD DETAILS */}
      {selectedPricing && (
        <div
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="fixed inset-0 z-[140] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-hidden"
          onClick={() => setSelectedPricing(null)}
        >
          <div
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="relative w-full max-w-lg bg-[#16060c] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,42,85,0.35)] animate-fadeIn overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPricing(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-pink-300 bg-pink-500/20 border border-pink-400/30 px-3 py-1 rounded-full">
                {selectedPricing.badge || 'Flight Package'}
              </span>
              <span className="font-mono text-xs font-semibold text-white/60">
                {selectedPricing.timeline}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white mt-1">
              {selectedPricing.step}
            </h3>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-4xl font-black text-pink-300 text-glow">
                {selectedPricing.price}
              </span>
              <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30 flex items-center gap-1">
                <ClockIcon className="h-3.5 w-3.5" />
                {selectedPricing.duration} total duration
              </span>
            </div>

            {/* LED Screen Size Spec & Flight Specs */}
            <div className="mt-6 space-y-3 bg-white/5 border border-pink-500/25 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">📐</span>
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase text-pink-300">LED Screen Display Height / Size</span>
                  <span className="text-sm font-extrabold text-white">12 × 6 FT High-Brightness LED Screen Array</span>
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="flex items-center gap-3">
                <span className="text-xl">🚁</span>
                <div>
                  <span className="block text-[10px] font-mono font-bold uppercase text-pink-300">Flight Altitude & Range</span>
                  <span className="text-xs font-bold text-white/90">Up to 120 FT operating height over venue crowd</span>
                </div>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="mt-5">
              <h4 className="font-mono text-xs font-bold uppercase text-pink-300 mb-1.5">Package Details & Scope</h4>
              <p className="text-xs text-white/90 leading-relaxed font-medium">
                {selectedPricing.description}
              </p>
              <ul className="mt-3 space-y-2 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Synchronized LED display grid rendering brand graphics
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> On-site certified pilot & flight safety operations crew
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Complete airspace flight clearances & venue coordination
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">✓</span> Weather monitoring & redundant failsafe safety systems
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <a
                href={`https://wa.me/919035999272?text=Hi%20Connect2Air%20team!%20I%20am%20interested%20in%20booking%20the%20${encodeURIComponent(selectedPricing.step)}%20package%20(${selectedPricing.price}).%20Please%20share%20availability.`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(255,20,147,0.4)] text-center transition"
              >
                Book Package via WhatsApp →
              </a>
              <button
                onClick={() => setSelectedPricing(null)}
                className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

function ClockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function VideoCameraIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
      <rect width="14" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}

function ServiceCard({ service, index }: { service: ServiceItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
    setMousePos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <ElectricBorder color="#ff007f" speed={1} chaos={0.07} borderRadius={24}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out',
        }}
        className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#240913]/95 via-[#1a060e]/95 to-[#100308]/95 p-7 sm:p-11 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,0,127,0.4)] border border-pink-500/20 cursor-pointer"
      >
        {/* Dynamic interactive spotlight glow tracking cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,0,127,0.18), transparent 45%)`,
          }}
        />

        {/* Ambient background glow elements */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl transition-all duration-700 group-hover:bg-pink-500/35 group-hover:scale-125" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-red-600/15 blur-3xl transition-all duration-700 group-hover:bg-pink-600/35" />

        {/* Shimmer laser top accent edge line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-pink-500/60 to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center sm:gap-12">
          {/* Service Number & Category with live radar beacon */}
          <div className="flex items-center gap-4 sm:w-1/3">
            <span className="font-mono text-3xl sm:text-4xl font-black text-pink-400 text-glow drop-shadow-[0_0_15px_rgba(255,77,109,0.7)] group-hover:scale-110 transition-transform duration-300">
              {service.number}
            </span>
            <div className="h-8 w-px bg-pink-500/30" />
            <div className="flex items-center gap-2 bg-pink-500/15 border border-pink-400/30 px-3.5 py-1.5 rounded-full shadow-[0_0_12px_rgba(255,42,85,0.25)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
              </span>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-pink-300">
                {service.category}
              </span>
            </div>
          </div>

          {/* Title & Description & Animated Glowing Progress Bar */}
          <div className="sm:w-2/3">
            <h3 className="font-display text-2xl sm:text-4xl font-black uppercase leading-[1.08] tracking-tight text-white group-hover:text-pink-200 transition-colors drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {service.title}
            </h3>
            <p className="mt-4 text-base font-medium text-white/90 leading-relaxed max-w-xl">
              {service.description}
            </p>

            {/* Glowing Accent Progress Line */}
            <div className="mt-6 relative h-1 w-full max-w-lg bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-pink-500 via-rose-400 to-red-500 transition-all duration-700 ease-out group-hover:w-full shadow-[0_0_15px_rgba(255,0,127,0.9)]" />
            </div>
          </div>
        </div>
      </div>
    </ElectricBorder>
  );
}
