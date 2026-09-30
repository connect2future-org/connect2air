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
import FranchiseBrochureModal, { type SelectedItemDetails } from '@/components/FranchiseBrochureModal';

export default function Franchise() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });
  const [drones, setDrones] = useState<DroneItem[]>(() => getCMSDrones());
  const [accessories, setAccessories] = useState<AccessoryItem[]>(() => getCMSAccessories());
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const [selectedItemForModal, setSelectedItemForModal] = useState<SelectedItemDetails | null>(null);

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
    const scrollAmount = direction === 'left' ? -360 : 360;
    refObj.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const openBrochureWithItem = (item?: SelectedItemDetails) => {
    setSelectedItemForModal(item || null);
    setBrochureModalOpen(true);
  };

  return (
    <section id="franchise" className="relative bg-[var(--color-void)] pt-8 pb-14 sm:pt-16 sm:pb-24 border-t border-rose-500/20 scroll-mt-24 overflow-hidden">
      {/* Background Cyber Lights & Glow Orbs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-pink-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-rose-500/10 blur-[140px]" />

      <div className="container-page relative z-10">
        
        {/* ── Section Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1.5 font-mono text-[11px] font-extrabold text-pink-300 uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(255,20,147,0.2)]">
            <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
            Commercial Drones & Hardware Store
          </div>

          <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight mb-3">
            Industrial <span className="text-[var(--color-signal-2)] text-glow">Drone Fleet Catalog</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/80 font-medium leading-relaxed bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-md max-w-2xl mx-auto shadow-lg">
            Direct hardware ownership of industrial LED display drones, ground control stations, fast chargers, and smart accessories with full pilot training & technical support.
          </p>
        </div>

        {/* ── 1. Drone Models Section ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(255,20,147,0.3)]">
                🚁
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide flex items-center gap-2">
                  <span>Drone Models ({drones.length})</span>
                </h3>
                <p className="text-[11px] text-pink-300/80 font-mono">Customizable payloads & flight duration specs</p>
              </div>
            </div>

            {/* Scroll Navigation Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollContainer(droneScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white border border-white/15 hover:border-pink-500/50 flex items-center justify-center transition active:scale-95 text-base font-bold shadow-md"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(droneScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white border border-white/15 hover:border-pink-500/50 flex items-center justify-center transition active:scale-95 text-base font-bold shadow-md"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={droneScrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2"
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
                  className={`w-72 sm:w-80 shrink-0 snap-center rounded-2xl bg-gradient-to-b from-[#1c0812] via-[#14050b] to-[#0d0307] border transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-xl hover:-translate-y-1.5 ${
                    drone.featured
                      ? 'border-pink-500/70 shadow-[0_0_25px_rgba(255,20,147,0.3)] hover:shadow-[0_10px_35px_rgba(255,20,147,0.4)]'
                      : 'border-rose-500/25 hover:border-pink-400/80 hover:shadow-[0_10px_30px_rgba(255,20,147,0.25)]'
                  }`}
                >
                  {/* Image Container with Zoom & Badge */}
                  <div className="w-full h-44 bg-black/60 relative overflow-hidden shrink-0 border-b border-white/10">
                    <img
                      src={displayImg}
                      alt={drone.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#14050b] via-transparent to-black/30" />
                    
                    {drone.badge && (
                      <span className="absolute top-3 right-3 font-mono text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500 text-white shadow-[0_0_12px_rgba(255,20,147,0.8)] border border-pink-300">
                        {drone.badge}
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-pink-300 bg-black/60 border border-pink-500/30 px-2 py-0.5 rounded-md backdrop-blur-md">
                        Commercial Grade
                      </span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="p-3.5 text-center border-b bg-white/[0.03] border-white/10">
                    <h4 className="font-display text-base font-black uppercase text-white tracking-wide leading-snug group-hover:text-pink-300 transition-colors">
                      {drone.name}
                    </h4>
                    {drone.tagline && (
                      <p className="text-[10px] text-pink-300/90 mt-0.5 font-mono font-medium truncate">
                        {drone.tagline}
                      </p>
                    )}
                  </div>

                  {/* Specs Grid & Description */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    {drone.specs && drone.specs.length > 0 && (
                      <div className="grid grid-cols-1 gap-1.5 text-left">
                        {drone.specs.map((spec, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px] bg-white/5 hover:bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 transition-colors font-mono">
                            <span className="text-white/60">{spec.label}</span>
                            <strong className="text-white font-semibold">{spec.value}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {drone.description && (
                      <p className="text-[10px] text-white/70 leading-relaxed line-clamp-2 bg-black/20 p-2 rounded-lg border border-white/5">
                        {drone.description}
                      </p>
                    )}

                    {/* Price Tag & Interactive Inquiry Button */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="text-left">
                        <span className="text-white/50 text-[9px] block font-mono uppercase tracking-wider">Unit Price</span>
                        <strong className="text-lg font-black text-pink-400 font-display block text-glow leading-none">
                          {drone.price}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() => openBrochureWithItem({
                          title: drone.name,
                          tagline: drone.tagline,
                          price: drone.price,
                          badge: drone.badge,
                          imageUrl: displayImg,
                          type: 'drone'
                        })}
                        data-cursor="cta"
                        className="px-3.5 py-2 rounded-xl bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/40 hover:border-pink-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center gap-1 shadow-md"
                      >
                        <span>Brochure</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 2. Setup Accessories & Add-ons Section ── */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(255,20,147,0.3)]">
                ⚡
              </div>
              <div>
                <h3 className="font-display text-lg sm:text-xl font-black uppercase text-white tracking-wide">
                  Setup Accessories & Add-ons ({accessories.length})
                </h3>
                <p className="text-[11px] text-pink-300/80 font-mono">Ground control stations, battery docks & payloads</p>
              </div>
            </div>

            {/* Scroll Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollContainer(accScrollRef, 'left')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white border border-white/15 hover:border-pink-500/50 flex items-center justify-center transition active:scale-95 text-base font-bold shadow-md"
                aria-label="Scroll left"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => scrollContainer(accScrollRef, 'right')}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/30 text-white border border-white/15 hover:border-pink-500/50 flex items-center justify-center transition active:scale-95 text-base font-bold shadow-md"
                aria-label="Scroll right"
              >
                ›
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div
            ref={accScrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-6 pt-2"
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
                  className="w-60 sm:w-64 shrink-0 snap-center rounded-2xl bg-gradient-to-b from-[#1b0811] to-[#0e0308] border border-rose-500/25 hover:border-pink-400/80 hover:shadow-[0_8px_30px_rgba(255,20,147,0.25)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-lg group"
                >
                  {/* Compact Image Frame */}
                  <div className="w-full h-36 bg-black/60 overflow-hidden border-b border-white/10 relative shrink-0">
                    <img
                      src={displayImg}
                      alt={acc.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-md border border-pink-500/40 px-2 py-0.5 rounded-lg text-sm shadow-md">
                      {acc.icon || '⚡'}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="p-3 text-center border-b bg-white/[0.02] border-white/10">
                    <h4 className="font-display text-xs sm:text-sm font-black uppercase text-white tracking-wide leading-snug group-hover:text-pink-300 transition-colors">
                      {acc.title}
                    </h4>
                  </div>

                  {/* Price & Description & Inquiry CTA */}
                  <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-white/50 text-[9px] block font-mono uppercase tracking-wider">Unit Price</span>
                      <strong className="text-base font-black text-pink-400 font-display block text-glow">
                        {acc.price}
                      </strong>
                    </div>

                    {(acc.desc || acc.description) && (
                      <div className="bg-black/30 border border-white/5 p-2 rounded-lg text-[9px] font-mono text-white/70 leading-relaxed line-clamp-2">
                        {acc.desc || acc.description}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => openBrochureWithItem({
                        title: acc.title,
                        price: acc.price,
                        desc: acc.desc || acc.description,
                        imageUrl: displayImg,
                        type: 'accessory'
                      })}
                      data-cursor="cta"
                      className="w-full py-1.5 rounded-lg bg-pink-500/15 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/30 hover:border-pink-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-95 flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Inquire / Specs</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 3. Crisp & Small Standalone Brochure Download Banner ── */}
        <div 
          ref={ref} 
          data-reveal 
          className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#220715] via-[#16060c] to-[#250817] border border-pink-500/40 shadow-[0_0_30px_rgba(255,20,147,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4"
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
            onClick={() => openBrochureWithItem()}
            data-cursor="cta"
            className="px-5 py-2.5 bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,20,147,0.35)] transition hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 shrink-0"
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
        selectedItem={selectedItemForModal}
      />
    </section>
  );
}
