import React, { useState, useEffect, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import {
  getCMSDrones,
  getCMSDronesAsync,
  getCMSAccessories,
  getCMSAccessoriesAsync,
  type DroneItem,
  type AccessoryItem,
} from '@/utils/cmsStorage';
import FranchiseBrochureModal from '@/components/FranchiseBrochureModal';

export default function Franchise() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });
  const [drones, setDrones] = useState<DroneItem[]>(() => getCMSDrones());
  const [accessories, setAccessories] = useState<AccessoryItem[]>(() => getCMSAccessories());
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);

  const droneScrollRef = useRef<HTMLDivElement>(null);
  const accScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadCMSData = async () => {
      try {
        const droneData = await getCMSDronesAsync();
        setDrones(droneData);
      } catch (error) {
        console.error('Failed to load drones from API:', error);
      }

      try {
        const accData = await getCMSAccessoriesAsync();
        setAccessories(accData);
      } catch (error) {
        console.error('Failed to load accessories from API:', error);
      }
    };
    loadCMSData();

    const handleCMSUpdate = () => loadCMSData();
    window.addEventListener('c2a_cms_updated', handleCMSUpdate);
    return () => window.removeEventListener('c2a_cms_updated', handleCMSUpdate);
  }, []);

  const scrollContainer = (refObj: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (!refObj.current) return;
    const scrollAmount = direction === 'left' ? -340 : 340;
    refObj.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section id="franchise" className="relative bg-[#05020a] pt-10 pb-16 sm:pt-16 sm:pb-24 border-t border-pink-500/20 scroll-mt-24 overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[400px] w-[400px] rounded-full bg-pink-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-3xl" />

      <div className="container-page relative z-10 max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── 1. DRONE MODELS PANEL CONTAINER ── */}
        <div className="bg-[#09030d]/90 border border-pink-500/25 rounded-3xl p-4 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative mb-10 backdrop-blur-xl">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-pink-500/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500 font-extrabold text-2xl leading-none">—</span>
                <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider">
                  DRONE MODELS ({drones.length})
                </h2>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-white/50 tracking-[0.2em] uppercase mt-1">
                EXPLORE OUR HIGH-PERFORMANCE DRONES
              </p>
            </div>

            {/* Top Right Specs Badges */}
            <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-white/60 tracking-widest uppercase bg-pink-500/5 border border-pink-500/20 rounded-full px-4 py-1.5">
              <span className="text-pink-400">🛸 PRECISION</span>
              <span className="text-white/20">|</span>
              <span>POWER</span>
              <span className="text-white/20">|</span>
              <span className="text-pink-300">UNLIMITED POSSIBILITIES</span>
            </div>
          </div>

          {/* Carousel Track Wrapper with Arrow Controls (Active when > 5 cards or scrollable) */}
          <div className="relative flex items-center">
            {/* Left Scroll Arrow (Shown when > 5 items or scrollable) */}
            {drones.length > 5 && (
              <button
                type="button"
                onClick={() => scrollContainer(droneScrollRef, 'left')}
                className="absolute left-0 z-30 -translate-x-3 sm:-translate-x-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-pink-500/60 bg-[#12051a]/95 text-pink-400 hover:bg-pink-500 hover:text-white flex items-center justify-center transition active:scale-95 text-lg font-bold shadow-[0_0_20px_rgba(255,20,147,0.5)] backdrop-blur-md"
                aria-label="Scroll left"
              >
                ‹
              </button>
            )}

            {/* Static Drone Cards Scroll Track */}
            <div
              ref={droneScrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-3 px-1 w-full"
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

                const spec1 = drone.specs?.[0] || { label: 'Camera', value: '4K' };
                const spec2 = drone.specs?.[1] || { label: 'Flight Time', value: '34 Mins' };
                const spec3 = drone.specs?.[2] || { label: 'Range', value: '8 km' };

                return (
                  <div
                    key={drone.id || drone.name}
                    className="w-64 sm:w-72 shrink-0 snap-center rounded-2xl bg-gradient-to-b from-[#14071c] via-[#0d0413] to-[#08020b] border border-pink-500/30 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(255,20,147,0.35)] hover:border-pink-500/80 z-10 hover:z-30 overflow-hidden flex flex-col justify-between group p-4 shadow-xl relative select-none"
                  >
                    {/* Image Stage with Neon Pedestal */}
                    <div className="w-full h-40 sm:h-44 relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden mb-3 border border-white/5 shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-transparent opacity-80" />
                      
                      {/* Neon Pedestal Glow Floor Ring */}
                      <div className="absolute bottom-1 w-3/4 h-5 rounded-[100%] bg-pink-500/50 blur-md border border-pink-400/60 shadow-[0_0_20px_rgba(255,20,147,0.9)]" />

                      <img
                        src={displayImg}
                        alt={drone.name}
                        className="w-full h-full object-contain p-2 relative z-10 transition-transform duration-500 group-hover:scale-105"
                      />

                      {drone.badge && (
                        <span className="absolute top-2 right-2 font-mono text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500 text-white shadow-[0_0_10px_rgba(255,20,147,0.8)] border border-pink-300 z-20">
                          {drone.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Tagline */}
                    <div className="mb-2">
                      <h3 className="font-display font-bold text-sm sm:text-base text-white tracking-wide leading-snug group-hover:text-pink-300 transition-colors">
                        {drone.name}
                      </h3>
                      {drone.tagline && (
                        <p className="text-[11px] text-white/60 font-medium truncate mt-0.5">
                          {drone.tagline}
                        </p>
                      )}
                    </div>

                    {/* 3 Spec Icons Grid */}
                    <div className="grid grid-cols-3 gap-1 text-center bg-white/[0.03] border border-white/10 rounded-xl p-2 mb-3 font-mono">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs mb-0.5">📷</span>
                        <strong className="text-[11px] text-white font-bold block truncate">{spec1.value}</strong>
                        <span className="text-[9px] text-white/40 block truncate">{spec1.label}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center border-x border-white/10 px-1">
                        <span className="text-xs mb-0.5">⏱️</span>
                        <strong className="text-[11px] text-white font-bold block truncate">{spec2.value}</strong>
                        <span className="text-[9px] text-white/40 block truncate">{spec2.label}</span>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <span className="text-xs mb-0.5">📡</span>
                        <strong className="text-[11px] text-white font-bold block truncate">{spec3.value}</strong>
                        <span className="text-[9px] text-white/40 block truncate">{spec3.label}</span>
                      </div>
                    </div>

                    {/* Description Section */}
                    {drone.description && (
                      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 mb-3 text-[11px] text-white/70 leading-relaxed line-clamp-2 min-h-[42px]">
                        {drone.description}
                      </div>
                    )}

                    {/* Price Tag at Bottom */}
                    <div className="pt-1">
                      <strong className="font-display font-black text-lg sm:text-xl text-pink-500 block text-glow leading-none">
                        {drone.price}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Scroll Arrow (Shown when > 5 items or scrollable) */}
            {drones.length > 5 && (
              <button
                type="button"
                onClick={() => scrollContainer(droneScrollRef, 'right')}
                className="absolute right-0 z-30 translate-x-3 sm:translate-x-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-pink-500/60 bg-[#12051a]/95 text-pink-400 hover:bg-pink-500 hover:text-white flex items-center justify-center transition active:scale-95 text-lg font-bold shadow-[0_0_20px_rgba(255,20,147,0.5)] backdrop-blur-md"
                aria-label="Scroll right"
              >
                ›
              </button>
            )}
          </div>
        </div>

        {/* ── 2. SETUP & ACCESSORIES PANEL CONTAINER ── */}
        <div className="bg-[#09030d]/90 border border-pink-500/25 rounded-3xl p-4 sm:p-7 shadow-[0_0_60px_rgba(0,0,0,0.9)] relative backdrop-blur-xl">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-pink-500/15">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-pink-500 font-extrabold text-2xl leading-none">—</span>
                <h2 className="font-display font-black text-xl sm:text-2xl tracking-wider uppercase">
                  <span className="text-pink-500">SETUP & </span>
                  <span className="text-white">ACCESSORIES ({accessories.length})</span>
                </h2>
              </div>
              <p className="text-[10px] sm:text-xs font-mono text-white/50 tracking-[0.2em] uppercase mt-1">
                EVERYTHING YOU NEED FOR A SEAMLESS EXPERIENCE
              </p>
            </div>

            {/* Top Right Badges */}
            <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-white/60 tracking-widest uppercase bg-pink-500/5 border border-pink-500/20 rounded-full px-4 py-1.5">
              <span>⚙️ PREMIUM QUALITY</span>
              <span className="text-white/20">|</span>
              <span>🛡️ RELIABLE & DURABLE</span>
              <span className="text-white/20">|</span>
              <span className="text-pink-400">🎧 COMPLETE SUPPORT</span>
            </div>
          </div>

          {/* Carousel Track Wrapper with Arrow Controls (Active when > 5 cards or scrollable) */}
          <div className="relative flex items-center">
            {/* Left Scroll Arrow */}
            {accessories.length > 5 && (
              <button
                type="button"
                onClick={() => scrollContainer(accScrollRef, 'left')}
                className="absolute left-0 z-30 -translate-x-3 sm:-translate-x-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-pink-500/60 bg-[#12051a]/95 text-pink-400 hover:bg-pink-500 hover:text-white flex items-center justify-center transition active:scale-95 text-lg font-bold shadow-[0_0_20px_rgba(255,20,147,0.5)] backdrop-blur-md"
                aria-label="Scroll left"
              >
                ‹
              </button>
            )}

            {/* Static Accessory Cards Scroll Track */}
            <div
              ref={accScrollRef}
              className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none py-3 px-1 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {accessories.map((acc, idx) => {
                const defaultAccImgs = [
                  'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&h=800&q=80',
                  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&h=800&q=80',
                  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&h=800&q=80',
                  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&h=800&q=80',
                  'https://images.unsplash.com/photo-1521405924368-64c5b84bec60?auto=format&fit=crop&w=800&h=800&q=80',
                ];
                const displayImg = acc.imageUrl || defaultAccImgs[idx % defaultAccImgs.length];

                return (
                  <div
                    key={acc.id || acc.title}
                    className="w-60 sm:w-64 shrink-0 snap-center rounded-2xl bg-gradient-to-b from-[#14071c] via-[#0d0413] to-[#08020b] border border-pink-500/30 transition-all duration-300 hover:scale-[1.04] hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(255,20,147,0.35)] hover:border-pink-500/80 z-10 hover:z-30 overflow-hidden flex flex-col justify-between group p-4 shadow-xl relative select-none"
                  >
                    {/* Top Accessory Image Stage */}
                    <div className="w-full h-36 sm:h-40 relative flex items-center justify-center bg-black/40 rounded-xl overflow-hidden mb-3 border border-white/5 shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-transparent to-transparent opacity-80" />
                      
                      {/* Neon Pedestal Glow Floor Ring */}
                      <div className="absolute bottom-1 w-3/4 h-4 rounded-[100%] bg-pink-500/50 blur-md border border-pink-400/60 shadow-[0_0_20px_rgba(255,20,147,0.9)]" />

                      <img
                        src={displayImg}
                        alt={acc.title}
                        className="w-full h-full object-contain p-2 relative z-10 transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute top-2 left-2 bg-black/60 border border-pink-500/30 px-1.5 py-0.5 rounded text-xs">
                        {acc.icon || '⚡'}
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <div className="mb-2">
                      <h3 className="font-display font-bold text-sm text-white tracking-wide leading-snug group-hover:text-pink-300 transition-colors">
                        {acc.title}
                      </h3>
                      {acc.tagline && (
                        <p className="text-[11px] text-white/60 font-medium truncate mt-0.5">
                          {acc.tagline}
                        </p>
                      )}
                    </div>

                    {/* Description Section */}
                    {(acc.desc || acc.description) && (
                      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-2.5 mb-3 text-[11px] text-white/70 leading-relaxed line-clamp-2 min-h-[42px]">
                        {acc.desc || acc.description}
                      </div>
                    )}

                    {/* Price Tag at Bottom */}
                    <div className="pt-1">
                      <strong className="font-display font-black text-lg text-pink-500 block text-glow leading-none">
                        {acc.price}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Scroll Arrow */}
            {accessories.length > 5 && (
              <button
                type="button"
                onClick={() => scrollContainer(accScrollRef, 'right')}
                className="absolute right-0 z-30 translate-x-3 sm:translate-x-5 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-pink-500/60 bg-[#12051a]/95 text-pink-400 hover:bg-pink-500 hover:text-white flex items-center justify-center transition active:scale-95 text-lg font-bold shadow-[0_0_20px_rgba(255,20,147,0.5)] backdrop-blur-md"
                aria-label="Scroll right"
              >
                ›
              </button>
            )}
          </div>
        </div>

        {/* ── 3. Crisp Standalone Brochure Download Banner ── */}
        <div 
          ref={ref} 
          data-reveal 
          className="mt-10 max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#190616] via-[#0e0410] to-[#1a0618] border border-pink-500/40 shadow-[0_0_30px_rgba(255,20,147,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-xl shrink-0 text-pink-300 shadow-[0_0_15px_rgba(255,20,147,0.3)]">
              📄
            </div>
            <div>
              <h3 className="font-display text-sm sm:text-base font-black uppercase text-white tracking-tight leading-snug">
                Download Drone Fleet & Pricing Brochure
              </h3>
              <p className="text-[11px] text-white/75 mt-0.5 leading-normal">
                Technical fleet specs, LED payload screen options, DGCA clearance info & sales pricing.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setBrochureModalOpen(true)}
            data-cursor="cta"
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(255,20,147,0.35)] transition hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <span>Download PDF Brochure</span>
            <span>→</span>
          </button>
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
