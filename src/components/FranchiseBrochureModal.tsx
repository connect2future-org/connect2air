import React, { useState, useEffect } from 'react';
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

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
      className="fixed inset-0 z-[1000] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#16060c] border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(255,20,147,0.3)] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          data-cursor="hover"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-sm font-bold z-10"
        >
          ✕
        </button>

        {!downloaded ? (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <span className="eyebrow block text-pink-300 font-bold uppercase tracking-widest text-xs mb-1.5">
                Connect2Air Commercial Drone Sales
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                Download Drone Fleet Brochure
              </h2>
              <p className="text-xs sm:text-sm text-white/75 mt-2 leading-relaxed">
                Get full technical specs for industrial light-show drones, LED payload screens, battery docks, pricing tiers, pilot training, and revenue models.
              </p>
            </div>

            {/* Selected Item Preview Box if clicked from a specific card */}
            {selectedItem && (
              <div className="mb-5 bg-gradient-to-r from-pink-500/20 to-rose-500/10 border border-pink-500/40 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
                {selectedItem.imageUrl ? (
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-xl shrink-0">
                    🛸
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {selectedItem.badge && (
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-pink-300 bg-black/40 border border-pink-500/30 px-2 py-0.5 rounded-full inline-block mb-1">
                      {selectedItem.badge}
                    </span>
                  )}
                  <h4 className="font-display text-base font-black uppercase text-white truncate">
                    {selectedItem.title}
                  </h4>
                  {(selectedItem.subtitle || selectedItem.tagline) && (
                    <p className="text-[11px] text-pink-300/80 font-mono truncate">
                      {selectedItem.subtitle || selectedItem.tagline}
                    </p>
                  )}
                  {selectedItem.price && (
                    <span className="font-display text-sm font-black text-pink-400 block mt-0.5">
                      {selectedItem.price}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Feature Pills */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              {[
                '✓ 100% Hardware Ownership',
                '✓ High Event ROI',
                '✓ Flight Pilot Training',
                '✓ Technical & Lead Support',
              ].map((feature) => (
                <div
                  key={feature}
                  className="bg-pink-500/10 border border-pink-500/30 rounded-xl px-3 py-2 text-center text-xs font-semibold text-pink-300 font-mono"
                >
                  {feature}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">
                  Full Name <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  data-cursor="hover"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-pink-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">
                  Phone Number <span className="text-pink-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  data-cursor="hover"
                  placeholder="+91 Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/5 border border-pink-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">
                  Email Address <span className="text-white/40">(Optional)</span>
                </label>
                <input
                  type="email"
                  data-cursor="hover"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-pink-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-200 mb-1">
                  City / Location <span className="text-white/40">(Optional)</span>
                </label>
                <input
                  type="text"
                  data-cursor="hover"
                  placeholder="e.g. Bengaluru, Mumbai, Delhi"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-white/5 border border-pink-500/30 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                data-cursor="cta"
                className="w-full mt-2 py-3.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 font-bold text-xs sm:text-sm text-white uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,20,147,0.4)] transition hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {submitting ? 'Preparing Brochure...' : '📄 Submit & Download Drone Brochure'}
              </button>
            </form>
          </>
        ) : (
          /* Download Success State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              ✓
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white">
              Brochure Downloaded!
            </h3>
            <p className="text-xs sm:text-sm text-white/80 max-w-sm mx-auto leading-relaxed">
              Thank you, <strong className="text-pink-300">{formData.name}</strong>! Your official Connect2Air Commercial Drone & Fleet Brochure has been generated and downloaded. Our team will contact you shortly.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => downloadFranchiseBrochure(formData)}
                data-cursor="cta"
                className="w-full py-3 bg-pink-500 hover:bg-pink-400 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                📄 Re-Download Brochure Document
              </button>
              <button
                onClick={onClose}
                data-cursor="hover"
                className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
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
