import React, { useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getCMSDronesAsync, type DroneItem } from '@/utils/cmsStorage';

const DEFAULT_DRONES: DroneItem[] = [
  {
    id: 'd1',
    name: 'C2A Swarm-Master 2.0',
    tagline: 'Industry Standard Light-Show & Ad Drone',
    badge: 'Popular Swarm',
    price: '₹2.8 Lakhs',
    specs: [
      { label: 'Flight Time', value: '28 Mins' },
      { label: 'Payload Capacity', value: '2.5 kg' },
      { label: 'Positioning', value: 'Dual RTK GPS' },
      { label: 'Wind Resistance', value: '38 km/h' },
    ],
  },
  {
    id: 'd2',
    name: 'C2A Mega-Screen 4K',
    tagline: 'High-Lumen Floating LED Matrix Screen Drone',
    badge: 'Bestseller',
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
    name: 'C2A Micro-Swarm Lite',
    tagline: 'Compact Event & Indoor Arena Display Drone',
    badge: 'Indoor & Arena',
    price: '₹1.5 Lakhs',
    specs: [
      { label: 'Flight Time', value: '20 Mins' },
      { label: 'Payload Capacity', value: '1.0 kg' },
      { label: 'Usage Area', value: 'Indoor & Covered Venues' },
      { label: 'Agility', value: 'High Precision Swarm' },
    ],
  },
];

const ACCESSORIES = [
  {
    icon: '💡',
    title: 'High-Lumen Ultra-Light LED Panel',
    price: '₹65,000',
    desc: '10,000 Nits high-brightness daylight visible screen payload with custom animation chip.',
  },
  {
    icon: '🔋',
    title: 'Multi-Battery Fast Charging Station',
    price: '₹85,000',
    desc: 'Rapid multi-charging dock station capable of refueling 12 drone batteries concurrently in 22 mins.',
  },
  {
    icon: '🎮',
    title: 'Ground Control Station (GCS) + Software',
    price: '₹1,20,000',
    desc: 'Integrated flight control console loaded with Connect2Air 3D choreography suite & live telemetry.',
  },
  {
    icon: '🪂',
    title: 'Autonomous Parachute Safety System',
    price: '₹45,000',
    desc: 'DGCA compliant automatic dual-deployment parachute system for fail-safe landing protection.',
  },
];

const INCLUDED_BENEFITS = [
  '100% Direct Hardware Ownership — No rental room or space required',
  'Ground Control Station (GCS) Software & 3D Choreography Suite Included',
  'Complete Drone Pilot Flight Training & DGCA Certification Assistance',
  '24×7 Technical Flight Engineer Support & Rapid Replacement Spares',
];

export default function Franchise() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });
  const [drones, setDrones] = useState<DroneItem[]>(DEFAULT_DRONES);

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

  return (
    <section id="franchise" className="relative bg-[var(--color-void)] py-12 sm:py-20 border-t border-rose-500/20 scroll-mt-20 overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-rose-500/10 blur-[130px]" />

      <div className="container-page relative z-10">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1.5 font-mono text-xs font-bold text-pink-300 uppercase tracking-widest mb-4">
            <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
            Commercial Drones & Accessories Store
          </div>

          {/* Main Title */}
          <div className="bg-[#16060c] border border-rose-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_30px_rgba(255,20,147,0.15)] mb-4 inline-block w-full">
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
              Buy <span className="text-[var(--color-signal-2)] text-glow">Commercial Light-Show Drones</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-white/80 font-medium leading-relaxed bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur-md">
            Directly purchase industrial LED display drones, flight choreography ground stations, battery fast chargers, and accessories. 100% direct hardware ownership with complete pilot training & DGCA airspace clearance support.
          </p>
        </div>

        {/* ── Drone Models Catalog Grid ── */}
        <div className="mb-6">
          <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white text-center mb-6 tracking-wide">
            Available Commercial Drone Models
          </h3>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 items-stretch">
          {drones.map((drone, index) => {
            const defaultImages = [
              'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
              'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
            ];
            const displayImg = drone.imageUrl || defaultImages[index % defaultImages.length];

            return (
              <div
                key={drone.id || drone.name}
                data-reveal
                className={`relative rounded-3xl bg-[#16060c] border transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-xl h-full ${
                  drone.featured
                    ? 'border-pink-500 shadow-[0_0_35px_rgba(255,20,147,0.3)] md:-translate-y-2'
                    : 'border-rose-500/30 hover:border-pink-400'
                }`}
              >
                {/* Fixed Height Uniform Image Header */}
                <div className="w-full h-52 bg-black/60 border-b border-white/10 relative overflow-hidden shrink-0 group">
                  <img
                    src={displayImg}
                    alt={drone.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16060c] via-transparent to-transparent opacity-80" />
                  {drone.featured && (
                    <span className="absolute top-3 right-3 font-mono text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500 text-white shadow-[0_0_15px_rgba(255,20,147,0.8)] border border-pink-300">
                      ★ Featured
                    </span>
                  )}
                </div>

                {/* Header Box with Min-Height for Horizontal Alignment */}
                <div className={`p-5 text-center border-b flex flex-col justify-center min-h-[110px] shrink-0 ${
                  drone.featured ? 'bg-gradient-to-r from-pink-600/30 to-rose-700/30 text-white' : 'bg-white/5 border-white/10'
                }`}>
                  {drone.badge && (
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-black/50 border border-white/20 inline-block mb-1.5 text-pink-300 w-max mx-auto">
                      {drone.badge}
                    </span>
                  )}
                  <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide leading-snug">
                    {drone.name}
                  </h3>
                  {drone.tagline && (
                    <p className="text-[11px] text-white/75 mt-0.5 font-mono font-medium line-clamp-1">
                      {drone.tagline}
                    </p>
                  )}
                </div>

                {/* Price, Specs & Description (Flex-1 for Equal Height Distribution) */}
                <div className="p-6 space-y-4 text-center divide-y divide-white/10 text-xs sm:text-sm flex-1 flex flex-col justify-between">
                  <div className="pt-1">
                    <span className="text-white/60 text-xs block font-mono">Unit Price</span>
                    <strong className="text-3xl font-black text-pink-400 font-display block mt-0.5">
                      {drone.price}
                    </strong>
                    <span className="text-white/50 text-[10px] font-mono">per unit</span>
                  </div>

                  {drone.specs && drone.specs.length > 0 && (
                    <div className="pt-3 space-y-2 text-left flex-1">
                      {drone.specs.map((spec, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <span className="text-white/60 font-mono text-[11px]">{spec.label}</span>
                          <strong className="text-white font-semibold font-mono text-[11px]">{spec.value}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {drone.description && (
                    <div className="pt-3 text-left">
                      <p className="text-xs text-white/75 leading-relaxed line-clamp-2">
                        {drone.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Button — Pinned at Card Bottom */}
                <div className="p-5 pt-0 shrink-0">
                  <a
                    href="#contact"
                    data-cursor="cta"
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition text-center block ${
                      drone.featured
                        ? 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_0_15px_rgba(255,20,147,0.5)]'
                        : 'bg-white/10 hover:bg-pink-500/20 text-white border border-white/20'
                    }`}
                  >
                    Order {drone.name} →
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Essential Flight Accessories & Add-ons ── */}
        <div data-reveal className="mb-12 sm:mb-16">
          <div className="text-center mb-8">
            <span className="eyebrow block text-pink-300 font-bold uppercase tracking-widest text-xs mb-1">
              Payload & Hardware Add-ons
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Essential Flight Accessories
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACCESSORIES.map((acc) => (
              <div
                key={acc.title}
                className="bg-[#16060c] border border-rose-500/30 hover:border-pink-400 p-5 rounded-2xl flex flex-col justify-between transition group shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{acc.icon}</span>
                    <span className="font-mono text-sm font-black text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-lg">
                      {acc.price}
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-white uppercase group-hover:text-pink-300 transition-colors">
                    {acc.title}
                  </h4>
                  <p className="text-xs text-white/70 mt-2 leading-relaxed font-medium">
                    {acc.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10">
                  <a
                    href="#contact"
                    data-cursor="hover"
                    className="w-full py-2 bg-white/5 hover:bg-pink-500/20 text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-lg border border-white/10 transition text-center block"
                  >
                    + Add to Order
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── "What's Included with Every Drone Purchase" Card ── */}
        <div data-reveal className="bg-[#16060c] border border-rose-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_40px_rgba(255,20,147,0.15)] mb-10 max-w-4xl mx-auto">
          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-center text-white mb-8 tracking-tight">
            What's Included with Every Drone Purchase
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {INCLUDED_BENEFITS.map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white/5 border-l-4 border-pink-500 rounded-r-2xl p-4 sm:p-5 flex items-start gap-3 border-y border-r border-white/10 hover:border-pink-500/50 transition"
              >
                <span className="text-pink-400 font-bold text-lg leading-none shrink-0">✓</span>
                <p className="text-xs sm:text-sm font-semibold text-white/90 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Bottom Action Buttons ── */}
        <div data-reveal className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <a
            href="#contact"
            data-cursor="cta"
            className="w-full sm:w-1/2 py-4 bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center shadow-lg border border-purple-500/40 transition hover:scale-[1.02]"
          >
            🛒 Order Drones & Accessories
          </a>

          <a
            href="/Connect2Air_Drone_Brochure.pdf"
            download
            data-cursor="cta"
            className="w-full sm:w-1/2 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-2xl text-center shadow-lg shadow-emerald-900/40 border border-emerald-400/40 transition hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>📄 Download PDF Brochure</span>
          </a>
        </div>

      </div>
    </section>
  );
}
