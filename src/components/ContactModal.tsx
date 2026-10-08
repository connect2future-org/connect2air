import React, { useState, useEffect } from 'react';
import { contact } from '@/data/siteData';
import { saveCMSEnquiry } from '@/utils/cmsStorage';
import { getApiBaseUrl } from '@/utils/apiBase';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export const ContactModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    eventType: '',
    message: ''
  });

  useBodyScrollLock(isOpen);

  useEffect(() => {
    // Show modal shortly after opening site if not previously closed in this session
    const hasClosed = sessionStorage.getItem('c2a_contact_modal_closed');
    if (!hasClosed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('c2a_contact_modal_closed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    const apiBase = getApiBaseUrl();
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || 'N/A',
      phone: formData.phone.trim(),
      company: formData.company.trim() || 'N/A',
      eventType: formData.eventType || 'General Enquiry',
      message: formData.message.trim() || 'Quick Enquiry from pop-up modal',
      source: 'Quick Enquiry Modal',
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
    } catch {
      console.log('Backend API offline, saving to local store');
    }

    saveCMSEnquiry(payload, backendId);

    setFormData({ name: '', email: '', phone: '', company: '', eventType: '', message: '' });
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
      setSubmitted(false);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn">
      {/* 3D Angled Polygon Card Container */}
      <div className="relative w-full max-w-md sm:max-w-lg group my-auto">
        
        {/* Hot Pink Rotated Outer Layer Backdrop Card */}
        <div className="absolute -inset-3 sm:-inset-5 bg-gradient-to-br from-[#ff007f] via-[#e60067] to-[#800040] rounded-[44px] transform -rotate-[4deg] scale-[1.02] shadow-[0_10px_50px_rgba(255,0,127,0.5)] transition-transform duration-500 group-hover:-rotate-[2deg]" />

        {/* Main White Tilted Polygon Form Card */}
        <div className="relative bg-white text-gray-900 rounded-[32px] p-6 sm:p-7 shadow-2xl overflow-hidden border border-gray-100 transform -rotate-[1.5deg] transition-transform duration-500 group-hover:rotate-0">
          
          {/* Top Right Close Button (X) */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-gray-100/90 hover:bg-pink-100 text-gray-600 hover:text-pink-600 flex items-center justify-center transition-all border border-gray-200/80 shadow-sm cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Top Right Curved Sunset Image Badge Accent */}
          <div className="absolute top-0 right-0 w-[45%] h-[34%] overflow-hidden rounded-bl-[90px] pointer-events-none z-10 border-b-2 border-l-2 border-white shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
              alt="Sunset Sky Aerial Display"
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 to-transparent" />
          </div>

          {submitted ? (
            <div className="py-10 text-center space-y-4 relative z-20">
              <div className="w-16 h-16 bg-pink-500/10 border-2 border-pink-500 text-pink-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(255,0,127,0.3)]">
                <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Enquiry Received!</h3>
              <p className="text-gray-600 text-xs max-w-xs mx-auto">
                Thanks! Our aerial display team will get back to you shortly with custom flight plans.
              </p>
            </div>
          ) : (
            <>
              {/* Card Subtitle (Cursive Signature Font) & Title */}
              <div className="relative z-20 mb-4 max-w-[200px] sm:max-w-[220px]">
                <p
                  className="text-2xl sm:text-3xl text-[#e60067] font-bold block leading-none mb-1"
                  style={{ fontFamily: "'Caveat', 'Dancing Script', cursive" }}
                >
                  Send us an Enquiry
                </p>
                <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-[#111111] tracking-tight leading-[1.1]">
                  Let&apos;s Plan<br />Your Aerial Campaign
                </h3>
              </div>

              {/* Form Fields matching the Contact Section UI 1-to-1 */}
              <form onSubmit={handleSubmit} className="relative z-20 space-y-3">
                {/* Row 1: Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Your Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-8 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      </span>
                      <input
                        type="email"
                        required
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-8 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Phone & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </span>
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number *"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-8 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Company / Organization"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-8 pr-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Dropdown Select Type of Event */}
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </span>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                      className={`w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-8 pr-8 py-2 text-xs focus:outline-none transition-all appearance-none cursor-pointer shadow-sm ${formData.eventType ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      <option value="" disabled hidden>Type of Event *</option>
                      <option value="Brand Launch">Brand Launch</option>
                      <option value="Store Opening">Store Opening / Activation</option>
                      <option value="Corporate Event">Corporate Event / Summit</option>
                      <option value="Concert / Festival">Concert &amp; Music Festival</option>
                      <option value="Sports Display">Sports &amp; Stadium Show</option>
                      <option value="Public Event">Public / City Event</option>
                      <option value="Real Estate">Real Estate Promotion</option>
                      <option value="Custom Campaign">Custom Aerial Display</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </div>
                </div>

                {/* Row 4: Textarea Tell Us About Event */}
                <div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    </span>
                    <textarea
                      required
                      rows={2.5}
                      maxLength={300}
                      placeholder="Tell us about your event or campaign *&#10;Event location, date, audience, number of flights, key requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-8 pr-3 pt-2 pb-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all resize-none shadow-sm"
                    />
                  </div>
                  <div className="text-[10px] font-mono font-bold text-gray-400 text-right mt-0.5">
                    {formData.message.length}/300
                  </div>
                </div>

                {/* Submit Hot-Pink Pill Button & Instant WhatsApp Link */}
                <div className="pt-1.5 flex items-center justify-between gap-3">
                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Chat on WhatsApp
                  </a>

                  <button
                    type="submit"
                    className="py-3 px-6 rounded-full bg-gradient-to-r from-[#ff007f] via-[#e60067] to-[#d8005f] hover:from-[#e60067] hover:to-[#ff007f] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_6px_25px_rgba(230,0,103,0.45)] transition-all transform hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-white fill-current transform -rotate-45" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                    <span>SEND ENQUIRY →</span>
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
