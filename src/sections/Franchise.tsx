import React, { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getCMSDronesAsync, type DroneItem } from '@/utils/cmsStorage';
import FranchiseBrochureModal from '@/components/FranchiseBrochureModal';

const DEFAULT_DRONES: DroneItem[] = [
  {
    id: 'd1',
    name: 'DJI Matrice 350 RTK',
    tagline: 'Flagship Enterprise Inspection & Mapping Drone',
    badge: 'Enterprise',
    price: '₹9.8 Lakhs',
    featured: true,
    specs: [
      { label: 'Flight Time', value: '55 Mins' },
      { label: 'Payload Capacity', value: '2.7 kg Dual/Triple' },
      { label: 'IP Rating', value: 'IP55 Weatherproof' },
      { label: 'Transmission', value: '20 km O3 Enterprise' },
    ],
  },
  {
    id: 'd2',
    name: 'C2A Mega-Screen 4K',
    tagline: 'High-Lumen Floating LED Matrix Screen Drone',
    badge: 'Light-Show',
    price: '₹4.5 Lakhs',
    featured: true,
    specs: [
      { label: 'Flight Time', value: '25 Mins' },
      { label: 'Display Brightness', value: '10,000 Nits' },
      { label: 'Screen Tech', value: 'Full Color LED Matrix' },
      { label: 'Weather Rating', value: 'IP65 Waterproof' },
    ],
  },
  {
    id: 'd3',
    name: 'DJI AGRAS T40',
    tagline: 'Heavy Spraying & Spreading Agricultural Drone',
    badge: 'Agricultural',
    price: '₹12.5 Lakhs',
    specs: [
      { label: 'Spray Tank', value: '40 Liter Capacity' },
      { label: 'Spreading Tank', value: '50 kg Payload' },
      { label: 'Radar', value: 'Active Phased Array' },
      { label: 'Flow Rate', value: '12 L/min Atomized' },
    ],
  },
  {
    id: 'd4',
    name: 'DJI Air 3S / Mini 5 Pro',
    tagline: 'Consumer 4K Travel & Lifestyle Aerial Camera',
    badge: 'Consumer',
    price: '₹1.2 Lakhs',
    specs: [
      { label: 'Flight Time', value: '45 Mins' },
      { label: 'Sensor', value: '1-inch CMOS 4K/60fps' },
      { label: 'Weight', value: 'Sub-249g / Ultra-Light' },
      { label: 'Sensing', value: 'Night-scape Omnidirectional' },
    ],
  },
  {
    id: 'd5',
    name: 'C2A Bespoke Swarm Pro',
    tagline: 'Customizable Swarm Drone & Payload Setup',
    badge: 'Customizable',
    price: 'Custom Quote',
    featured: true,
    specs: [
      { label: 'Flight Time', value: '25-40 Mins (Custom)' },
      { label: 'Payload Capacity', value: '1.0 - 10.0 kg' },
      { label: 'Choreography', value: 'Tailored 3D Suite' },
      { label: 'Screen Config', value: 'Bespoke LED Rig' },
    ],
  },
];

const ACCESSORIES = [
  {
    icon: '🔋',
    title: 'Intelligent Flight Batteries',
    price: '₹35,000',
    desc: 'High-density smart battery packs with self-heating and battery management system.',
  },
  {
    icon: '⚡',
    title: 'Fast Chargers & Charging Hubs',
    price: '₹45,000',
    desc: 'Multi-battery fast-charging stations capable of concurrent multi-dock refueling.',
  },
  {
    icon: '🎮',
    title: 'GCS & Remote Controllers',
    price: '₹85,000',
    desc: 'Integrated flight control console loaded with Connect2Air 3D choreography & live telemetry.',
  },
  {
    icon: '🛰️',
    title: 'RTK / PPK Base Stations',
    price: '₹95,000',
    desc: 'Centimeter-level precision RTK positioning towers for mapping, inspection, and light shows.',
  },
  {
    icon: '🪂',
    title: 'Autonomous Parachute & Safety Gear',
    price: '₹45,000',
    desc: 'DGCA compliant dual-deployment automatic parachute systems and landing safety gear.',
  },
  {
    icon: '📷',
    title: 'Gimbals, Thermal & RGB Payloads',
    price: '₹1,15,000',
    desc: 'Radiometric thermal cameras, optical zoom gimbals, and high-lumen LED payloads.',
  },
];

export default function Franchise() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });
  const [drones, setDrones] = useState<DroneItem[]>(DEFAULT_DRONES);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  const droneScrollRef = useRef<HTMLDivElement>(null);
  const accScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDrones = async () => {
      const data = await getCMSDronesAsync();
      if (data && data.length > 0) {
        setDrones(data);
      }
    };
    loadDrones();

    const handleCMSUpdate = () => loadDrones();
    window.addEventListener('c2a_cms_updated', handleCMSUpdate);
    return () => window.removeEventListener('c2a_cms_updated', handleCMSUpdate);
  }, []);

  const scrollContainer = (refObj: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!refObj.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    refObj.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="franchise" className="relative bg-[var(--color-void)] py-10 sm:py-16 border-t border-rose-500/20 scroll-mt-24 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-rose-500/10 blur-[130px]" />

      <div className="container-page relative z-10">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1.5 font-mono text-xs font-bold text-pink-300 uppercase tracking-widest mb-3">
            <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
            Commercial Drones & Accessories Store
          </div>

          <div className="bg-[#16060c] border border-rose-500/30 rounded-2xl p-4 sm:p-5 shadow-[0_0_30px_rgba(255,20,147,0.15)] mb-3 inline-block w-full">
            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
              Commercial <span className="text-[var(--color-signal-2)] text-glow">Drone Fleet Catalog</span>
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-md">
            Directly purchase industrial LED display drones, ground control stations, fast chargers, and accessories with 100% direct hardware ownership & pilot training.
          </p>
        </div>

        {/* ── 1. Commercial Drone Models Horizontal Slider with Controls ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide flex items-center gap-2">
              <span>🚁 Drone Models ({drones.length})</span>
              <span className="text-[10px] font-mono text-pink-300 bg-pink-500/20 px-2 py-0.5 rounded-full border border-pink-500/30">
                Incl. Customizable Drone
              </span>
            </h3>

            {/* Scroll Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollContainer(droneScrollRef, 'left')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-500/30 text-white border border-white/20 flex items-center justify-center transition active:scale-95 text-sm font-bold"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(droneScrollRef, 'right')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-500/30 text-white border border-white/20 flex items-center justify-center transition active:scale-95 text-sm font-bold"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={droneScrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {drones.map((drone, index) => {
              const defaultImages = [
                'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
              ];
              const displayImg = drone.imageUrl || defaultImages[index % defaultImages.length];

              return (
                <div
                  key={drone.id || drone.name}
                  className={`w-72 sm:w-80 shrink-0 snap-center rounded-2xl bg-[#16060c] border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-lg ${
                    drone.featured
                      ? 'border-pink-500/70 shadow-[0_0_20px_rgba(255,20,147,0.25)]'
                      : 'border-rose-500/30 hover:border-pink-400'
                  }`}
                >
                  {/* Compact Header Image */}
                  <div className="w-full h-44 bg-black/60 border-b border-white/10 relative overflow-hidden shrink-0 group">
                    <img
                      src={displayImg}
                      alt={drone.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16060c] via-transparent to-transparent opacity-80" />
                    {drone.badge && (
                      <span className="absolute top-2.5 right-2.5 font-mono text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-pink-500 text-white shadow-[0_0_10px_rgba(255,20,147,0.8)] border border-pink-300">
                        {drone.badge}
                      </span>
                    )}
                  </div>

                  {/* Header Info */}
                  <div className="p-3 text-center border-b bg-white/5 border-white/10">
                    <h4 className="font-display text-base font-black uppercase text-white tracking-wide leading-snug">
                      {drone.name}
                    </h4>
                    {drone.tagline && (
                      <p className="text-[10px] text-pink-300 mt-0.5 font-mono font-medium truncate">
                        {drone.tagline}
                      </p>
                    )}
                  </div>

                  {/* Price & Specs & Description (Pure Details, No buttons inside) */}
                  <div className="p-4 space-y-3 text-center divide-y divide-white/10 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-white/50 text-[10px] block font-mono">Unit Price</span>
                      <strong className="text-xl font-black text-pink-400 font-display block mt-0.5">
                        {drone.price}
                      </strong>
                    </div>

                    {drone.specs && drone.specs.length > 0 && (
                      <div className="pt-2.5 space-y-1 text-left flex-1">
                        {drone.specs.map((spec, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            <span className="text-white/60 font-mono">{spec.label}</span>
                            <strong className="text-white font-semibold font-mono">{spec.value}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {drone.description && (
                      <div className="pt-2 text-left">
                        <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2">
                          {drone.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. Major Accessories (6 Items) Horizontal Slider with Controls ── */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide">
              ⚡ 6 Major Setup Accessories & Add-ons
            </h3>

            {/* Scroll Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollContainer(accScrollRef, 'left')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-500/30 text-white border border-white/20 flex items-center justify-center transition active:scale-95 text-sm font-bold"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(accScrollRef, 'right')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-pink-500/30 text-white border border-white/20 flex items-center justify-center transition active:scale-95 text-sm font-bold"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={accScrollRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 pt-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {ACCESSORIES.map((acc) => (
              <div
                key={acc.title}
                className="w-64 sm:w-72 shrink-0 snap-center bg-[#16060c] border border-rose-500/30 hover:border-pink-400 p-4 rounded-2xl flex flex-col justify-between transition shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{acc.icon}</span>
                    <span className="font-mono text-[11px] font-black text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded-lg">
                      {acc.price}
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-white uppercase leading-snug">
                    {acc.title}
                  </h4>
                  <p className="text-[11px] text-white/70 mt-2 leading-relaxed font-medium line-clamp-3">
                    {acc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 3. Standalone Brochure Download Section (With Form Popup) ── */}
        <div ref={ref} data-reveal className="max-w-2xl mx-auto bg-gradient-to-r from-[#200713] via-[#16060c] to-[#200713] border border-rose-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(255,20,147,0.2)]">
          <div className="w-12 h-12 bg-pink-500/20 border border-pink-400/40 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 text-pink-300">
            📄
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
            Download Complete Drone & Pricing Brochure
          </h3>
          <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-lg mx-auto leading-relaxed">
            Get full technical fleet specs, ground control station details, LED payload screen options, DGCA clearance info, and commercial sales pricing.
          </p>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => setBrochureModalOpen(true)}
              data-cursor="cta"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(255,20,147,0.4)] transition hover:scale-[1.03] active:scale-95"
            >
              <span>📄 Fill Form & Download PDF Brochure</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Brochure & Lead Contact Modal */}
      <FranchiseBrochureModal
        isOpen={brochureModalOpen}
        onClose={() => setBrochureModalOpen(false)}
      />
    </section>
  );
}


