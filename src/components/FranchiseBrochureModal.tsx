import React, { useState, useEffect } from 'react';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { saveCMSEnquiry } from '@/utils/cmsStorage';
import { getApiBaseUrl } from '@/utils/apiBase';
import { downloadFranchiseBrochure } from '@/utils/generateBrochure';

export interface SelectedItemDetails {
  title: string;
  subtitle?: string;
  tagline?: string;
  price?: string;
  badge?: string;
  imageUrl?: string;
  desc?: string;
  description?: string;
  specs?: { label: string; value: string }[];
  type?: 'drone' | 'accessory' | 'general';
}

interface FranchiseBrochureModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem?: SelectedItemDetails | null;
}

export const FranchiseBrochureModal: React.FC<FranchiseBrochureModalProps> = ({ isOpen, onClose, selectedItem }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setSubmitting(true);
    const apiBase = getApiBaseUrl();
    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || 'N/A',
      company: formData.city.trim() ? `City: ${formData.city.trim()}` : 'N/A',
      message: selectedItem ? `Requested Brochure & Details for: ${selectedItem.title}` : 'Requested Drone & Franchise Sales Brochure Download',
      source: selectedItem ? `Brochure Request - ${selectedItem.title}` : 'Drone Sales Brochure Lead',
    };

    let backendId = undefined;
    try {
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const resJson = await res.json();
        backendId = resJson.id;
      }
    } catch (err) {
      console.log('Backend offline, saving lead locally');
    }

    saveCMSEnquiry(payload, backendId);

    // Trigger brochure document download & display window
    downloadFranchiseBrochure({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
    });

    setSubmitting(false);
    setDownloaded(true);
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#13050a] border border-pink-500/30 rounded-2xl p-4 sm:p-6 shadow-[0_0_50px_rgba(255,20,147,0.25)] my-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-cursor="hover"
          className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/10 hover:bg-pink-500/30 text-white flex items-center justify-center transition text-xs font-bold z-10 border border-white/10"
          aria-label="Close modal"
        >
          ✕
        </button>

        {!downloaded ? (
          <>
            {/* Header */}
            <div className="text-center mb-4 pr-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                Connect2Air Commercial Fleet
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-snug">
                Download Drone Fleet Brochure
              </h2>
              <p className="text-[11px] sm:text-xs text-white/70 mt-1 leading-relaxed max-w-xs mx-auto">
                Get full technical specs, LED screen payloads, battery docks, pricing tiers & pilot training details.
              </p>
            </div>

            {/* Selected Item Preview Box if clicked from a specific card */}
            {selectedItem && (
              <div className="mb-4 bg-gradient-to-r from-pink-950/40 via-[#1e0811] to-pink-950/30 border border-pink-500/30 rounded-xl p-2.5 flex items-center gap-3 shadow-inner">
                {selectedItem.imageUrl ? (
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-12 h-12 object-cover rounded-lg border border-pink-500/20 shrink-0" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-lg shrink-0">
                    🚁
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-display text-xs font-black uppercase text-white truncate">
                      {selectedItem.title}
                    </h4>
                    {selectedItem.badge && (
                      <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-pink-300 bg-pink-500/20 border border-pink-500/40 px-1.5 py-0.2 rounded-md">
                        {selectedItem.badge}
                      </span>
                    )}
                  </div>
                  {(selectedItem.subtitle || selectedItem.tagline) && (
                    <p className="text-[10px] text-pink-300/80 font-mono truncate">
                      {selectedItem.subtitle || selectedItem.tagline}
                    </p>
                  )}
                  {selectedItem.price && (
                    <span className="font-display text-xs font-black text-pink-400 block mt-0.5">
                      {selectedItem.price}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Compact Feature Tags */}
            <div className="grid grid-cols-2 gap-1.5 mb-4">
              {[
                '✓ 100% Hardware Ownership',
                '✓ High Event ROI',
                '✓ Pilot Training Included',
                '✓ Technical Support',
              ].map((feature) => (
                <div
                  key={feature}
                  className="bg-white/5 border border-pink-500/20 rounded-lg px-2.5 py-1.5 text-center text-[10px] font-semibold text-pink-200 font-mono"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-pink-200 mb-0.5">
                  Full Name <span className="text-pink-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  data-cursor="hover"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-pink-500/20 focus:border-pink-400 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-pink-200 mb-0.5">
                  Phone Number <span className="text-pink-400">*</span>
                </label>
                <input
                  type="tel"
                  required
                  data-cursor="hover"
                  placeholder="+91 Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-pink-500/20 focus:border-pink-400 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-pink-200 mb-0.5">
                    Email <span className="text-white/40 font-normal">(Opt)</span>
                  </label>
                  <input
                    type="email"
                    data-cursor="hover"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-pink-500/20 focus:border-pink-400 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-pink-200 mb-0.5">
                    City <span className="text-white/40 font-normal">(Opt)</span>
                  </label>
                  <input
                    type="text"
                    data-cursor="hover"
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white/5 border border-pink-500/20 focus:border-pink-400 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/30 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                data-cursor="cta"
                className="w-full mt-3 py-2.5 bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500 hover:from-pink-400 hover:to-rose-500 font-bold text-xs text-white uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(255,20,147,0.35)] transition hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span>{submitting ? 'Generating Brochure...' : '📄 Download PDF Brochure'}</span>
                <span>→</span>
              </button>
            </form>
          </>
        ) : (
          /* Download Success State */
          <div className="text-center py-4 space-y-3">
            <div className="w-12 h-12 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full flex items-center justify-center mx-auto text-xl shadow-[0_0_15px_rgba(255,20,147,0.4)]">
              ✓
            </div>
            <h3 className="font-display text-lg font-black uppercase text-white">
              Brochure Downloaded!
            </h3>
            <p className="text-xs text-white/80 max-w-xs mx-auto leading-relaxed">
              Thank you, <strong className="text-pink-300">{formData.name}</strong>! Your Connect2Air Commercial Drone Fleet Brochure has been generated and downloaded.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => downloadFranchiseBrochure(formData)}
                data-cursor="cta"
                className="w-full py-2.5 bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center justify-center gap-1.5"
              >
                <span>📄 Re-Download PDF Brochure</span>
              </button>
              <button
                onClick={onClose}
                data-cursor="hover"
                className="w-full py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-lg transition"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseBrochureModal;
