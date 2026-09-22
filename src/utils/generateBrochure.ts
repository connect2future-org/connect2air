/**
 * Utility to generate and trigger the download of the official Connect2Air Commercial Drone & Fleet Sales Brochure.
 */

export interface LeadInfo {
  name: string;
  phone: string;
  email?: string;
  city?: string;
}

export function downloadFranchiseBrochure(lead: LeadInfo) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Connect2Air - Commercial Drone & Accessories Catalog</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Space+Grotesk:wght@600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #0d0307;
      color: #ffffff;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .page {
      max-width: 880px;
      margin: 0 auto;
      background: #16060c;
      border: 1px solid rgba(255, 20, 147, 0.3);
      border-radius: 20px;
      padding: 48px;
      box-shadow: 0 0 50px rgba(255, 20, 147, 0.15);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-b: 2px solid #ff1493;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .brand-title span {
      color: #ff1493;
    }
    .brand-sub {
      font-size: 12px;
      color: #ffb3d9;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .doc-badge {
      background: rgba(255, 20, 147, 0.15);
      border: 1px solid #ff1493;
      color: #ffb3d9;
      padding: 6px 16px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .hero-banner {
      background: linear-gradient(135deg, #280917 0%, #120309 100%);
      border: 1px solid rgba(255, 20, 147, 0.25);
      border-radius: 14px;
      padding: 24px;
      margin-bottom: 32px;
    }
    .hero-banner h1 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 24px;
      color: #ffffff;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .hero-banner p {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.85);
    }
    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: #ff1493;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 20, 147, 0.25);
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .drone-card {
      background: #0d0307;
      border: 1px solid rgba(255, 20, 147, 0.3);
      border-radius: 14px;
      padding: 20px;
    }
    .drone-name {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      text-transform: uppercase;
      border-b: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    .drone-sub {
      font-size: 11px;
      color: #ffb3d9;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .drone-price {
      font-size: 22px;
      font-weight: 900;
      color: #ff1493;
      margin-bottom: 12px;
    }
    .spec-line {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 6px;
      background: rgba(255, 255, 255, 0.04);
      padding: 4px 8px;
      border-radius: 4px;
    }
    .acc-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    .acc-card {
      background: #0d0307;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 16px;
      border-radius: 12px;
    }
    .acc-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
    }
    .acc-price {
      color: #ff1493;
      font-weight: 900;
    }
    .acc-desc {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
    }
    .checklist {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-bottom: 32px;
    }
    .check-item {
      background: rgba(255, 20, 147, 0.08);
      border: 1px solid rgba(255, 20, 147, 0.2);
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #ffffff;
    }
    .footer-note {
      border-t: 1px solid rgba(255, 255, 255, 0.15);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }
    .lead-box {
      background: rgba(255, 20, 147, 0.1);
      border: 1px dashed #ff1493;
      border-radius: 10px;
      padding: 14px;
      margin-bottom: 24px;
      font-size: 12px;
      color: #ffb3d9;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <div class="brand-title">CONNECT<span>2</span>AIR</div>
        <div class="brand-sub">Commercial Drone & Accessories Sales Catalog</div>
      </div>
      <div class="doc-badge">Official Drone Catalog</div>
    </div>

    <div class="lead-box">
      <strong>Customer Inquiry:</strong> ${lead.name} (${lead.phone}) ${lead.city ? `| Location: ${lead.city}` : ''} | Issued: ${dateStr}
    </div>

    <div class="hero-banner">
      <h1>Commercial Light-Show Drones & Hardware</h1>
      <p>Directly purchase industrial LED display drones, flight choreography ground stations, battery fast chargers, and accessories. 100% direct hardware ownership with full pilot training and DGCA airspace support.</p>
    </div>

    <div class="section-title">01. Commercial Drone Models Available to Buy</div>
    <div class="grid-3">
      <div class="drone-card">
        <div class="drone-name">C2A Swarm-Master 2.0</div>
        <div class="drone-sub">Industry Standard Light-Show Drone</div>
        <div class="drone-price">₹2.8 Lakhs</div>
        <div class="spec-line">⏱ Flight Time: <strong>28 Mins</strong></div>
        <div class="spec-line">📦 Payload Cap: <strong>2.5 kg</strong></div>
        <div class="spec-line">📡 Positioning: <strong>Dual RTK GPS</strong></div>
        <div class="spec-line">⚡ Wind Resistance: <strong>38 km/h</strong></div>
      </div>

      <div class="drone-card">
        <div class="drone-name">C2A Mega-Screen 4K</div>
        <div class="drone-sub">High-Lumen Floating LED Display Drone</div>
        <div class="drone-price">₹4.5 Lakhs</div>
        <div class="spec-line">⏱ Flight Time: <strong>25 Mins</strong></div>
        <div class="spec-line">💡 Brightness: <strong>10,000 Nits</strong></div>
        <div class="spec-line">📺 Screen Res: <strong>Full Color LED</strong></div>
        <div class="spec-line">🛡️ Rating: <strong>IP65 Weatherproof</strong></div>
      </div>

      <div class="drone-card">
        <div class="drone-name">C2A Micro-Swarm Lite</div>
        <div class="drone-sub">Compact Arena & Indoor Display Drone</div>
        <div class="drone-price">₹1.5 Lakhs</div>
        <div class="spec-line">⏱ Flight Time: <strong>20 Mins</strong></div>
        <div class="spec-line">📦 Payload Cap: <strong>1.0 kg</strong></div>
        <div class="spec-line">🏢 Usage: <strong>Indoor / Arena</strong></div>
        <div class="spec-line">🔄 Agility: <strong>High Precision</strong></div>
      </div>
    </div>

    <div class="section-title">02. Essential Flight Accessories & Add-ons</div>
    <div class="acc-grid">
      <div class="acc-card">
        <div class="acc-title"><span>💡 High-Lumen Ultra-Light LED Panel</span> <span class="acc-price">₹65,000</span></div>
        <div class="acc-desc">10,000 Nits high-brightness daylight visible screen payload with custom animation chip.</div>
      </div>
      <div class="acc-card">
        <div class="acc-title"><span>🔋 Multi-Battery Fast Charger Dock</span> <span class="acc-price">₹85,000</span></div>
        <div class="acc-desc">Rapid multi-charging dock station capable of refueling 12 drone batteries concurrently in 22 mins.</div>
      </div>
      <div class="acc-card">
        <div class="acc-title"><span>🎮 Ground Control Station (GCS) + Software</span> <span class="acc-price">₹1,20,000</span></div>
        <div class="acc-desc">Integrated flight control console loaded with Connect2Air 3D choreography suite & live telemetry.</div>
      </div>
      <div class="acc-card">
        <div class="acc-title"><span>🪂 Autonomous Parachute Safety System</span> <span class="acc-price">₹45,000</span></div>
        <div class="acc-desc">DGCA compliant automatic dual-deployment parachute system for fail-safe landing protection.</div>
      </div>
    </div>

    <div class="section-title">03. Included with Every Drone Purchase</div>
    <div class="checklist">
      <div class="check-item">✓ 100% Direct Hardware & Equipment Ownership</div>
      <div class="check-item">✓ Complete Drone Pilot Flight Training & Certification</div>
      <div class="check-item">✓ DGCA Airspace Permission & Flight Clearance Support</div>
      <div class="check-item">✓ 24×7 Technical Flight Engineer & Spares Assistance</div>
    </div>

    <div class="footer-note">
      <div>Connect2Air is a venture of <strong>Connect2Future</strong></div>
      <div>Sales Hotline: +91 90359 99272 | hr@connect2future.com</div>
    </div>
  </div>
</body>
</html>`;

  // Create downloadable file blob
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Trigger immediate download
  const link = document.createElement('a');
  link.href = url;
  link.download = `Connect2Air_Commercial_Drone_Catalog_${lead.name.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  // Also open print/view window
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
