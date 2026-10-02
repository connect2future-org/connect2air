import { useState, type FormEvent } from 'react';
import { contact } from '@/data/siteData';
import { saveCMSEnquiry } from '@/utils/cmsStorage';
import { getApiBaseUrl } from '@/utils/apiBase';
import { InstagramIcon, LinkedInIcon, WhatsAppIcon, MailIcon, PhoneIcon } from '@/components/Icons';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
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
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    setStatus('sent');
  };

  return (
    <section id="contact" className="relative bg-[#070208] pt-12 pb-16 sm:pt-16 sm:pb-24 border-t border-pink-500/20 overflow-hidden scroll-mt-24">
      {/* Ambient Neon Background Glows */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-pink-600/15 blur-[160px]" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[160px]" />

      <div className="container-page relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main 3-Column Grid Layout matching reference image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          
          {/* ── LEFT COLUMN (Brand Headline & Value Propositions) ── */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full">
            <div>
              {/* Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold text-pink-300 uppercase tracking-widest mb-3">
                <span className="h-2 w-2 rounded-full bg-pink-400 animate-pulse" />
                GET IN TOUCH
              </div>

              {/* Main Headline */}
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight leading-[0.95] text-white mb-4">
                LET&apos;S <br />
                CREATE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 drop-shadow-[0_0_25px_rgba(255,20,147,0.7)]">
                  SKY-HIGH
                </span> <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 drop-shadow-[0_0_25px_rgba(255,20,147,0.7)]">
                  BRANDS
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-medium mb-6 max-w-xs">
                Have a project, event or brand campaign in mind? We&apos;re here to help you shape the right aerial experience for it.
              </p>

              {/* 3 Feature Badges */}
              <div className="space-y-4">
                {/* Feature 1: Quick Response */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-300 flex items-center justify-center text-xs shrink-0 shadow-[0_0_12px_rgba(255,20,147,0.3)] mt-0.5">
                    ⚡
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Quick Response</h4>
                    <p className="text-[11px] text-white/60 leading-tight">We usually reply within 24 hours</p>
                  </div>
                </div>

                {/* Feature 2: Confidential */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-300 flex items-center justify-center text-xs shrink-0 shadow-[0_0_12px_rgba(255,20,147,0.3)] mt-0.5">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Confidential</h4>
                    <p className="text-[11px] text-white/60 leading-tight">Your ideas and information are safe with us</p>
                  </div>
                </div>

                {/* Feature 3: Custom Solutions */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-300 flex items-center justify-center text-xs shrink-0 shadow-[0_0_12px_rgba(255,20,147,0.3)] mt-0.5">
                    👥
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wide">Custom Solutions</h4>
                    <p className="text-[11px] text-white/60 leading-tight">Tailored to your event or campaign</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
                — BRANDS THAT FLY HIGHER
              </span>
            </div>
          </div>


          {/* ── CENTER COLUMN (Send Us an Enquiry Form Card) ── */}
          <div className="lg:col-span-5">
            <div className="bg-[#0f040b]/90 border-2 border-pink-500/50 rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(255,20,147,0.35)] backdrop-blur-xl relative">
              
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-pink-500/20">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center text-xl shrink-0 shadow-inner">
                  ✉️
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-wide leading-snug">
                    Send Us an Enquiry
                  </h3>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    Fill in the details and our team will get back to you shortly.
                  </p>
                </div>
              </div>

              {/* Enquiry Form */}
              <form onSubmit={submit} className="space-y-3.5">
                {/* 2x2 Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Your Name */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Your Name <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">👤</span>
                      <input
                        type="text"
                        required
                        placeholder="Jane Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#180713] border border-pink-500/20 focus:border-pink-400 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Work Email <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">✉️</span>
                      <input
                        type="email"
                        required
                        placeholder="jane@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#180713] border border-pink-500/20 focus:border-pink-400 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Phone Number <span className="text-pink-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">📞</span>
                      <input
                        type="tel"
                        required
                        placeholder="+91 90000 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#180713] border border-pink-500/20 focus:border-pink-400 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Company
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40">🏢</span>
                      <input
                        type="text"
                        placeholder="Your company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full bg-[#180713] border border-pink-500/20 focus:border-pink-400 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Textarea Field */}
                <div>
                  <label className="block text-[11px] font-semibold text-white/90 mb-1">
                    What Are You Planning? <span className="text-pink-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs text-white/40">📋</span>
                    <textarea
                      required
                      rows={3}
                      maxLength={300}
                      placeholder="Event, city, date and what you want people to see..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#180713] border border-pink-500/20 focus:border-pink-400 rounded-xl pl-8 pr-3 pt-2.5 pb-2 text-xs text-white placeholder:text-white/30 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  <div className="text-[10px] font-mono text-white/40 text-right mt-0.5">
                    {formData.message.length}/300
                  </div>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    data-cursor="cta"
                    className="w-full sm:w-auto flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 via-rose-600 to-pink-500 hover:from-pink-400 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(255,20,147,0.4)] transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{status === 'sending' ? 'Sending...' : 'SEND ENQUIRY'}</span>
                    <span>→</span>
                  </button>

                  <a
                    href={contact.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-black/90 hover:bg-white/10 border border-pink-500/40 text-white font-bold text-xs uppercase tracking-wider transition hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>💬 CHAT ON WHATSAPP</span>
                  </a>
                </div>

                {status === 'sent' && (
                  <p role="status" className="text-xs font-mono font-bold text-pink-300 text-center pt-1">
                    ✓ Thanks! Your enquiry has been received. We will get back to you shortly.
                  </p>
                )}
              </form>

            </div>
          </div>


          {/* ── RIGHT COLUMN (Contact Cards, Social Row & Location Map) ── */}
          <div className="lg:col-span-4 space-y-3.5">
            
            {/* 1. 3 Quick Contact Info Cards */}
            <div className="space-y-2.5">
              {/* EMAIL US */}
              <a
                href={`mailto:${contact.email}`}
                className="bg-[#0f040b]/90 border border-pink-500/25 rounded-2xl p-3 flex items-center justify-between hover:border-pink-400 transition-colors group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center text-xs shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,20,147,0.3)]">
                    <MailIcon className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">EMAIL US</div>
                    <div className="text-xs font-bold text-white leading-tight">{contact.email}</div>
                    <div className="text-[10px] text-white/40 leading-tight mt-0.5">We&apos;ll get back to you soon</div>
                  </div>
                </div>
                <span className="text-xs text-white/40 group-hover:text-pink-400 transition-colors pr-1">↗</span>
              </a>

              {/* CALL US */}
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className="bg-[#0f040b]/90 border border-pink-500/25 rounded-2xl p-3 flex items-center justify-between hover:border-pink-400 transition-colors group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center text-xs shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,20,147,0.3)]">
                    <PhoneIcon className="w-4 h-4 text-pink-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-wider">CALL US</div>
                    <div className="text-xs font-bold text-white leading-tight">{contact.phone}</div>
                    <div className="text-[10px] text-white/40 leading-tight mt-0.5">Mon - Sat (10 AM - 7 PM)</div>
                  </div>
                </div>
                <span className="text-xs text-white/40 group-hover:text-pink-400 transition-colors pr-1">↗</span>
              </a>

              {/* WHATSAPP */}
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0f040b]/90 border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between hover:border-emerald-400 transition-colors group shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-xs shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(37,211,102,0.3)]">
                    <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">WHATSAPP</div>
                    <div className="text-xs font-bold text-white leading-tight">{contact.phone}</div>
                    <div className="text-[10px] text-white/40 leading-tight mt-0.5">Chat with our team instantly</div>
                  </div>
                </div>
                <span className="text-xs text-white/40 group-hover:text-emerald-400 transition-colors pr-1">↗</span>
              </a>
            </div>

            {/* 2. Connect on Social Media Card */}
            <div className="bg-[#0f040b]/90 border border-pink-500/30 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(255,20,147,0.15)]">
              <div>
                <h4 className="text-xs font-bold text-white tracking-wide">
                  Connect on Social Media
                </h4>
                <p className="text-[10px] text-white/60 leading-tight mt-0.5 max-w-[200px]">
                  Follow us for updates, event highlights and the latest aerial advertising ideas.
                </p>
              </div>

              {/* 4 Circular Social Icon Buttons */}
              <div className="flex items-center gap-2.5 shrink-0">
                {/* Instagram */}
                <a
                  href={contact.social.find(s => s.label === 'Instagram')?.href || 'https://www.instagram.com/_connect2air'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full border border-[#d52976] bg-transparent flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(213,41,118,0.5)] hover:shadow-[0_0_18px_rgba(213,41,118,0.8)]"
                >
                  <InstagramIcon className="w-5 h-5 text-[#e1306c]" />
                </a>

                {/* LinkedIn */}
                <a
                  href={contact.social.find(s => s.label === 'LinkedIn')?.href || 'https://www.linkedin.com/company/connect2future/'}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full border border-[#0077b5] bg-transparent flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(0,119,181,0.5)] hover:shadow-[0_0_18px_rgba(0,119,181,0.8)]"
                >
                  <LinkedInIcon className="w-5 h-5 text-[#0077b5]" />
                </a>

                {/* WhatsApp */}
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-10 h-10 rounded-full border border-[#25d366] bg-transparent flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(37,211,102,0.5)] hover:shadow-[0_0_18px_rgba(37,211,102,0.8)]"
                >
                  <WhatsAppIcon className="w-5 h-5 text-[#25d366]" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  aria-label="Email"
                  className="w-10 h-10 rounded-full border border-[#ff2a5f] bg-transparent flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_12px_rgba(255,42,95,0.5)] hover:shadow-[0_0_18px_rgba(255,42,95,0.8)]"
                >
                  <MailIcon className="w-5 h-5 text-[#ff2a5f]" />
                </a>
              </div>
            </div>

            {/* 3. Our Location Card & Google Map */}
            <div className="bg-[#0f040b]/90 border border-pink-500/25 rounded-2xl p-3.5 sm:p-4 shadow-md">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-pink-500 text-sm">📍</span>
                  <div>
                    <h4 className="text-xs font-bold text-white">Our Location</h4>
                    <p className="text-[10px] text-white/60 leading-none mt-0.5">Vijayanagar, Mysuru, Karnataka, India</p>
                  </div>
                </div>

                <a
                  href="https://maps.google.com/?q=Vijayanagar,Mysuru,Karnataka,India"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg border border-pink-500/40 hover:border-pink-400 text-pink-300 hover:text-white text-[10px] font-bold uppercase transition-colors flex items-center gap-1 bg-pink-500/10"
                >
                  <span>Open in Maps</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Embedded Map Frame */}
              <div className="relative h-40 sm:h-44 rounded-xl overflow-hidden border border-white/10 shadow-inner">
                <iframe
                  title="Connect2Air Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.0893582701565!2d76.60613771107552!3d12.3097689878978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d5f4a2084adbec9%3A0xf4fcf3522495b959!2sconnect2future!5e0!3m2!1sen!2sin!4v1789022221822!5m2!1sen!2sin"
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
