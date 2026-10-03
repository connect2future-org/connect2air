import { about } from '@/data/siteData';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import StrokeText from '@/components/StrokeText';
import ElectricBorder from '@/components/ElectricBorder';

export default function About() {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <section id="about" className="relative bg-[#060105] py-12 sm:py-16 border-t border-pink-500/20 scroll-mt-20 overflow-hidden">
      {/* Background Neon Spotlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-pink-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-page relative z-10">
        <div ref={ref} className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Main Headline & Circle Dot Indicator */}
            <div data-reveal className="flex items-center justify-between gap-4">
              <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[0.95] drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                PIONEERING<br />
                <span className="text-[#ff007f] drop-shadow-[0_0_30px_rgba(255,0,127,0.7)] inline-block">
                  <StrokeText
                    text="AVIATION"
                    strokeColor="#ff007f"
                    fillColor="#ff007f"
                    strokeWidth={2}
                    drawDuration={1.8}
                    fillDelay={0.3}
                    repeatDelay={5}
                    stagger={0.06}
                    ease="power2.out"
                    trigger="loop"
                    fillMode="wipe"
                    fontSize={72}
                    fontWeight={900}
                    letterSpacing={-2}
                  />
                </span><br />
                TECHNOLOGY<span className="text-[#ff007f]">.</span>
              </h2>

              {/* Circle dot indicator next to headline */}
              <div className="w-10 h-10 rounded-full border border-white/20 bg-black/40 flex items-center justify-center shrink-0 self-center shadow-inner">
                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            {/* Sub-description Paragraph */}
            <p data-reveal className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-lg font-medium">
              {about.description}
            </p>

            {/* Strategic Venture Callout Card (Bottom-Left) */}
            <div data-reveal className="bg-[#0d0309]/90 border border-pink-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(255,0,127,0.15)] max-w-lg backdrop-blur-xl transition-all duration-300 hover:border-pink-500/60">
              <div className="text-[11px] font-mono font-bold tracking-[0.2em] text-white/50 uppercase mb-2">
                STRATEGIC VENTURE
              </div>

              <h3 className="font-display font-extrabold text-base sm:text-lg text-white uppercase tracking-wide leading-snug">
                CONNECT2AIR IS A VENTURE OF <span className="text-[#ff007f]">{about.parentCompany}.</span>
              </h3>

              <p className="text-xs text-white/70 mt-2 leading-relaxed">
                Backed by Connect2Future&apos;s innovation and technological expertise in high-impact media solutions.
              </p>

              <div className="mt-5">
                <a
                  href={about.parentLink}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-pink-500/60 bg-transparent hover:bg-pink-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(255,0,127,0.2)] hover:shadow-[0_0_25px_rgba(255,0,127,0.6)]"
                >
                  <span>VISIT CONNECT2FUTURE</span>
                  <span className="text-sm font-bold">↗</span>
                </a>
              </div>
            </div>

          </div>


          {/* ── RIGHT COLUMN (3 Cards 01, 02, 03) ── */}
          <div className="lg:col-span-6">
            <div data-reveal className="flex flex-col gap-4 sm:gap-5">
              
              {/* Card 01 */}
              <ElectricBorder color="#ff007f" speed={1} chaos={0.07} borderRadius={16}>
                <div className="bg-[#0d0309]/90 rounded-2xl p-6 shadow-[0_0_25px_rgba(255,0,127,0.15)] backdrop-blur-xl transition-all duration-300 group">
                  <div className="text-[#ff007f] font-mono text-xs font-bold tracking-widest mb-2">
                    01
                  </div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-wide uppercase leading-tight mb-2 group-hover:text-pink-300 transition-colors">
                    SYNCHRONIZED LED FORMATIONS
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                    Precision drone fleets rendering animated logos and screen content high above venue crowds.
                  </p>
                </div>
              </ElectricBorder>

              {/* Card 02 */}
              <ElectricBorder color="#ff007f" speed={1} chaos={0.07} borderRadius={16}>
                <div className="bg-[#0d0309]/90 rounded-2xl p-6 shadow-[0_0_25px_rgba(255,0,127,0.15)] backdrop-blur-xl transition-all duration-300 group">
                  <div className="text-[#ff007f] font-mono text-xs font-bold tracking-widest mb-2">
                    02
                  </div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-wide uppercase leading-tight mb-2 group-hover:text-pink-300 transition-colors">
                    END-TO-END FLIGHT OPERATIONS
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                    From creative aerial choreography to airspace permissions and precision execution.
                  </p>
                </div>
              </ElectricBorder>

              {/* Card 03 */}
              <ElectricBorder color="#ff007f" speed={1} chaos={0.07} borderRadius={16}>
                <div className="bg-[#0d0309]/90 rounded-2xl p-6 shadow-[0_0_25px_rgba(255,0,127,0.15)] backdrop-blur-xl transition-all duration-300 group">
                  <div className="text-[#ff007f] font-mono text-xs font-bold tracking-widest mb-2">
                    03
                  </div>
                  <h3 className="font-display font-extrabold text-base sm:text-lg text-white tracking-wide uppercase leading-tight mb-2 group-hover:text-pink-300 transition-colors">
                    UNMISSABLE AUDIENCE REACH
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-md">
                    Dominating venue skylines clear of billboards and physical advertising clutter.
                  </p>
                </div>
              </ElectricBorder>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
