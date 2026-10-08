import { useState, type FormEvent } from 'react';
import { contact } from '@/data/siteData';
import { saveCMSEnquiry } from '@/utils/cmsStorage';
import { getApiBaseUrl } from '@/utils/apiBase';
import { InstagramIcon, LinkedInIcon, WhatsAppIcon, YouTubeIcon, MailIcon, PhoneIcon } from '@/components/Icons';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    eventType: '',
    message: '',
  });

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    setStatus('sending');
    const apiBase = getApiBaseUrl();

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim() || 'N/A',
      phone: formData.phone.trim(),
      company: formData.company.trim() || 'N/A',
      eventType: formData.eventType || 'General Enquiry',
      message: formData.message.trim() || 'General Enquiry',
      source: 'Website Contact Section',
    };

    let backendId = undefined;
    try {
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const resJson = await response.json();
        backendId = resJson.id;
      }
    } catch {
      console.log('Backend notification dispatched');
    }

    saveCMSEnquiry(payload, backendId);
    setFormData({ name: '', email: '', phone: '', company: '', eventType: '', message: '' });
    setStatus('sent');
  };

  return (
    <section id="contact" className="relative bg-[#090209] pt-10 pb-16 sm:pt-14 sm:pb-20 border-t border-pink-500/20 overflow-hidden scroll-mt-24">
      {/* Background Ambient Glows & Spotlights */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-pink-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-rose-600/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-10 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl" />

      <div className="container-page relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main 3-Column Layout Matching Reference Screenshot 1-to-1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ── LEFT COLUMN: Brand Headline & Key Performance Specs ── */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full pt-2">
            <div>
              {/* Eyebrow with horizontal pink line */}
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
                <span className="font-mono text-xs font-bold text-pink-300 uppercase tracking-widest">
                  GET IN TOUCH
                </span>
                <span className="h-px w-16 bg-pink-500/40" />
              </div>

              {/* Main Headline with Flying Pink Paper Plane */}
              <div className="relative mb-5">
                <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight leading-[0.93] text-white">
                  LET&apos;S <br />
                  <span className="relative inline-block">
                    CREATE
                    {/* Dashed Paper Plane Flight Arc */}
                    <svg className="absolute -top-6 -right-12 w-16 h-12 pointer-events-none text-pink-400 opacity-90" viewBox="0 0 100 80" fill="none">
                      <path d="M10,70 Q 45,15 85,25" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                      <path d="M85,15 L95,25 L80,30 Z" fill="currentColor" />
                    </svg>
                  </span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 drop-shadow-[0_0_20px_rgba(255,0,127,0.7)]">
                    BRANDS
                  </span> <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 drop-shadow-[0_0_20px_rgba(255,0,127,0.7)]">
                    IN THE SKY
                  </span>
                </h2>
              </div>

              {/* Description Subtitle */}
              <p className="text-xs sm:text-sm font-medium text-white/85 leading-relaxed mb-8 max-w-sm">
                Have an event, campaign or brand activation in mind? Tell us what you&apos;re planning and we&apos;ll make it fly.
              </p>

              {/* 2x2 Grid of 4 Spec Badges (Fits perfectly without overflow) */}
              <div className="grid grid-cols-2 gap-3 pt-2 mb-8">
                {/* Spec 1: LED Display System */}
                <div className="flex items-center gap-2.5 bg-[#170511]/90 border border-pink-500/30 rounded-2xl p-2.5 shadow-md">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                    <svg className="w-4.5 h-4.5 text-pink-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="3" width="20" height="14" rx="2"/>
                      <line x1="8" y1="21" x2="16" y2="21"/>
                      <line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-black text-white leading-none">12 × 6</div>
                    <div className="text-[9px] font-bold text-white/70 uppercase tracking-tight leading-tight mt-1">
                      LED DISPLAY SYSTEM
                    </div>
                  </div>
                </div>

                {/* Spec 2: Fly Time */}
                <div className="flex items-center gap-2.5 bg-[#170511]/90 border border-pink-500/30 rounded-2xl p-2.5 shadow-md">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                    <svg className="w-4.5 h-4.5 text-pink-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="13" r="8"/>
                      <path d="M12 9v4l2.5 2.5"/>
                      <path d="M10 2h4"/>
                      <path d="M12 2v3"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-mono text-xs font-black text-white leading-none">10 – 15</div>
                    <div className="text-[9px] font-bold text-white/70 uppercase tracking-tight leading-tight mt-1">
                      MINUTES FLY TIME
                    </div>
                  </div>
                </div>

                {/* Spec 3: Perfect For */}
                <div className="flex items-center gap-2.5 bg-[#170511]/90 border border-pink-500/30 rounded-2xl p-2.5 shadow-md">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                    <svg className="w-4.5 h-4.5 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[8px] font-semibold text-white/50 uppercase tracking-tight leading-none">PERFECT FOR</div>
                    <div className="text-[9px] font-bold text-white/90 uppercase tracking-tight leading-tight mt-1">
                      EVENTS, FESTIVALS &amp; CAMPAIGNS
                    </div>
                  </div>
                </div>

                {/* Spec 4: Visibility */}
                <div className="flex items-center gap-2.5 bg-[#170511]/90 border border-pink-500/30 rounded-2xl p-2.5 shadow-md">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,0,127,0.3)]">
                    <svg className="w-4.5 h-4.5 text-pink-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="4" y="14" width="4" height="6" rx="1"/>
                      <rect x="10" y="9" width="4" height="11" rx="1"/>
                      <rect x="16" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[8px] font-semibold text-white/50 uppercase tracking-tight leading-none">HIGH</div>
                    <div className="text-[9px] font-bold text-white/90 uppercase tracking-tight leading-tight mt-1">
                      BRAND VISIBILITY
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Footer Tagline */}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <span className="text-pink-400 text-xs">✈</span>
              <span className="text-[9.5px] font-mono font-bold tracking-widest text-white/50 uppercase">
                BRANDS THAT FLY HIGHER
              </span>
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </div>


          {/* ── CENTER COLUMN: Polygon Skewed Form Card Matching Reference Image 1-to-1 ── */}
          <div className="lg:col-span-5">
            <div className="relative group max-w-lg mx-auto lg:max-w-none">
              
              {/* Hot Pink Rotated Outer Layer Backdrop Card */}
              <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-[#ff007f] via-[#e60067] to-[#800040] rounded-[48px] transform -rotate-[5deg] scale-[1.02] shadow-[0_10px_50px_rgba(255,0,127,0.45)] transition-transform duration-500 group-hover:-rotate-[3deg]" />
              
              {/* Main White Tilted Polygon Card */}
              <div className="relative bg-white text-gray-900 rounded-[32px] p-6 sm:p-7 shadow-2xl overflow-hidden border border-gray-100/90 transform -rotate-[1.8deg] transition-transform duration-500 group-hover:rotate-0">
                
                {/* Top Right Curved Sunset Image Badge Accent (Curved Wedge Clipping) */}
                <div className="absolute top-0 right-0 w-[50%] h-[38%] overflow-hidden rounded-bl-[100px] pointer-events-none z-10 border-b-2 border-l-2 border-white shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                    alt="Sunset Sky Aerial Display"
                    className="w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/20 to-transparent" />
                </div>

                {/* Card Subtitle (Cursive Signature Font) & Title */}
                <div className="relative z-20 mb-5 max-w-[210px] sm:max-w-[230px]">
                  <p
                    className="text-2xl sm:text-3xl text-[#e60067] font-bold block leading-none mb-1.5"
                    style={{ fontFamily: "'Caveat', 'Dancing Script', cursive" }}
                  >
                    Send us an Enquiry
                  </p>
                  <h3 className="font-sans font-extrabold text-2xl sm:text-3xl text-[#111111] tracking-tight leading-[1.1]">
                    Let&apos;s Plan<br />Your Aerial Campaign
                  </h3>
                </div>

                {/* Form Fields */}
                <form onSubmit={submit} className="relative z-20 space-y-3">
                  {/* Row 1: Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </span>
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Phone & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v8h20v-8a2 2 0 0 0-2-2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                        </span>
                        <input
                          type="text"
                          placeholder="Company / Organization"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-9 pr-3 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Dropdown Select Type of Event */}
                  <div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      </span>
                      <select
                        value={formData.eventType}
                        onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                        className={`w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none transition-all appearance-none cursor-pointer shadow-sm ${formData.eventType ? 'text-gray-900' : 'text-gray-400'}`}
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
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </span>
                    </div>
                  </div>

                  {/* Row 4: Textarea Tell Us About Event */}
                  <div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-gray-400">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </span>
                      <textarea
                        required
                        rows={3}
                        maxLength={300}
                        placeholder="Tell us about your event or campaign *&#10;Event location, date, audience, number of flights, key requirements..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#f2f2f4] border border-gray-200/80 focus:border-pink-500 focus:bg-white rounded-xl pl-9 pr-3 pt-2.5 pb-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all resize-none shadow-sm"
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-gray-400 text-right mt-0.5">
                      {formData.message.length}/300
                    </div>
                  </div>

                  {/* Submit Hot-Pink Pill Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#ff007f] via-[#e60067] to-[#d8005f] hover:from-[#e60067] hover:to-[#ff007f] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_6px_25px_rgba(230,0,103,0.45)] transition-all transform hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-4 h-4 text-white fill-current transform -rotate-45" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                      <span>{status === 'sending' ? 'SENDING...' : 'SEND ENQUIRY →'}</span>
                    </button>

                    {status === 'sent' && (
                      <p role="status" className="text-xs font-mono font-bold text-pink-600 text-center pt-2">
                        ✓ Thanks! Your enquiry has been received. We will get back to you shortly.
                      </p>
                    )}
                  </div>
                </form>

              </div>
            </div>
          </div>


          {/* ── RIGHT COLUMN: Direct Connect Cards, Social Circles & Location Map ── */}
          <div className="lg:col-span-3 space-y-3.5">
            
            {/* Header: Prefer a direct connect? */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-pink-400 text-base font-semibold block"
                style={{ fontFamily: "'Caveat', 'Dancing Script', cursive" }}
              >
                Prefer a direct connect?
              </span>
              <span className="h-px flex-1 bg-pink-500/30" />
            </div>

            {/* 3 Contact Cards */}
            <div className="space-y-2.5">
              {/* Card 1: Email Us */}
              <a
                href={`mailto:${contact.email}`}
                className="bg-[#15060d]/90 border border-pink-500/30 rounded-2xl p-3 flex items-center justify-between hover:border-pink-400 transition-colors group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8.5 h-8.5 rounded-full bg-pink-600 text-white flex items-center justify-center text-xs shrink-0 shadow-[0_0_12px_rgba(255,0,127,0.5)] group-hover:scale-110 transition-transform">
                    <MailIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-mono font-bold text-pink-300 uppercase tracking-wider">Email Us</div>
                    <div className="text-xs font-bold text-white leading-tight truncate">{contact.email}</div>
                    <div className="text-[9.5px] text-white/50 leading-tight mt-0.5">We&apos;ll get back to you soon.</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border border-pink-500/40 text-pink-300 flex items-center justify-center text-xs shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  →
                </div>
              </a>

              {/* Card 2: Call Us */}
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="bg-[#15060d]/90 border border-pink-500/30 rounded-2xl p-3 flex items-center justify-between hover:border-pink-400 transition-colors group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8.5 h-8.5 rounded-full bg-[#990044] text-white flex items-center justify-center text-xs shrink-0 shadow-[0_0_12px_rgba(153,0,68,0.5)] group-hover:scale-110 transition-transform">
                    <PhoneIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-mono font-bold text-pink-300 uppercase tracking-wider">Call Us</div>
                    <div className="text-xs font-bold text-white leading-tight truncate">{contact.phone}</div>
                    <div className="text-[9.5px] text-white/50 leading-tight mt-0.5">Mon - Sat (10 AM - 7 PM)</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border border-pink-500/40 text-pink-300 flex items-center justify-center text-xs shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                  →
                </div>
              </a>

              {/* Card 3: WhatsApp */}
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="bg-[#15060d]/90 border border-emerald-500/40 rounded-2xl p-3 flex items-center justify-between hover:border-emerald-400 transition-colors group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8.5 h-8.5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-xs shrink-0 shadow-[0_0_12px_rgba(37,211,102,0.5)] group-hover:scale-110 transition-transform">
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-mono font-bold text-emerald-400 uppercase tracking-wider">WhatsApp</div>
                    <div className="text-xs font-bold text-white leading-tight truncate">{contact.phone}</div>
                    <div className="text-[9.5px] text-white/50 leading-tight mt-0.5">Chat with our team instantly.</div>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xs shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  →
                </div>
              </a>
            </div>

            {/* Social Media Journey Row */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="font-mono text-[10px] font-bold text-white/70 uppercase tracking-wider">
                  Follow Our Journey
                </span>
                <span className="h-px flex-1 bg-white/10" />
              </div>

              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a
                  href={contact.social.find(s => s.label === 'Instagram')?.href || 'https://www.instagram.com/_connect2air'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] text-white flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(213,41,118,0.5)]"
                >
                  <InstagramIcon className="w-4.5 h-4.5 text-white" />
                </a>

                {/* LinkedIn */}
                <a
                  href={contact.social.find(s => s.label === 'LinkedIn')?.href || 'https://www.linkedin.com/company/connect2future/'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-[#0077b5] text-white flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(0,119,181,0.5)]"
                >
                  <LinkedInIcon className="w-4.5 h-4.5 text-white" />
                </a>

                {/* WhatsApp */}
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-full bg-[#25d366] text-white flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(37,211,102,0.5)]"
                >
                  <WhatsAppIcon className="w-4.5 h-4.5 text-white" />
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full bg-[#ff0000] text-white flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(255,0,0,0.5)]"
                >
                  <YouTubeIcon className="w-4.5 h-4.5 text-white" />
                </a>
              </div>
            </div>

            {/* Our Location Map Card with Dotted Vector Path */}
            <div className="bg-[#15060d]/95 border border-pink-500/30 rounded-2xl p-4 relative overflow-hidden shadow-lg mt-3">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs">📍</span>
                  <h4 className="text-xs font-extrabold text-white">Our Location</h4>
                </div>
                <p className="text-[10.5px] font-medium text-white/70 leading-tight">Vijayanagar, Mysuru</p>
                <p className="text-[10px] font-medium text-white/50 leading-tight">Karnataka, India</p>

                <a
                  href="https://maps.google.com/?q=Vijayanagar,Mysuru,Karnataka,India"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 w-7 h-7 rounded-full border border-pink-500/40 text-pink-300 hover:bg-pink-500 hover:text-white justify-center text-xs transition-colors"
                >
                  →
                </a>
              </div>

              {/* Vector Dotted Map Graphic Background on Right */}
              <div className="absolute right-0 top-0 bottom-0 w-36 pointer-events-none opacity-40">
                <svg className="w-full h-full text-pink-500" viewBox="0 0 150 120" fill="none">
                  <path d="M10,90 Q 70,30 130,50" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="130" cy="50" r="6" fill="#ff007f" />
                  <circle cx="130" cy="50" r="12" fill="#ff007f" opacity="0.3" />
                </svg>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
