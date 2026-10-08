import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { getCMSMediaAsync, getVideoPosterUrl, type MediaItem } from '@/utils/cmsStorage';
import StrokeText from '@/components/StrokeText';

// Map size field → Tailwind aspect-ratio class and label
const SIZE_CONFIG: Record<string, { aspect: string; label: string }> = {
  reel:   { aspect: 'aspect-[9/16]',  label: '9:16 Reel'  },
  post:   { aspect: 'aspect-[4/5]',   label: '4:5 Post'   },
  square: { aspect: 'aspect-square',  label: '1:1 Square' },
};

function getSizeConfig(size?: string) {
  return SIZE_CONFIG[size ?? 'reel'] ?? SIZE_CONFIG['reel'];
}

// ── Individual Media Card ─────────────────────────────────────────────────────
function MediaCard({ item, index }: { item: MediaItem; index: number }) {
  const { aspect, label } = getSizeConfig(item.size);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const posterUrl = item.type === 'video' ? getVideoPosterUrl(item.url, item.coverUrl) : '';

  const handlePlayClick = () => {
    setIsPlaying(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 50);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-rose-500/20 bg-[#16060c] transition-all duration-300 hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(255,0,127,0.3)] max-w-[230px] sm:max-w-[250px] w-full mx-auto shadow-md">
      {/* ── Media ── */}
      <div className={`relative w-full max-h-[320px] sm:max-h-[350px] overflow-hidden ${aspect}`}>
        {item.type === 'video' ? (
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              src={item.url}
              poster={posterUrl || undefined}
              controls={isPlaying}
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              style={{ display: 'block' }}
              onPause={() => setIsPlaying(false)}
            />

            {/* Video Cover Page Overlay (shown before video starts playing) */}
            {!isPlaying && (
              <div
                onClick={handlePlayClick}
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 flex flex-col items-center justify-center cursor-pointer group/cover transition-all duration-300"
              >
                {/* Custom Video Cover Thumbnail Image if posterUrl is available */}
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover/cover:scale-105"
                  />
                ) : null}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                {/* Hot-pink glowing Play Button badge (Compact size) */}
                <div className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pink-500/90 border border-pink-300 text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,0,127,0.8)] transition-all duration-300 group-hover/cover:scale-110 group-hover/cover:bg-pink-400">
                  <span className="text-sm sm:text-base ml-0.5">▶</span>
                </div>
                
                <span className="relative z-10 mt-1.5 font-mono text-[8px] sm:text-[8.5px] font-extrabold uppercase tracking-widest text-pink-300 bg-black/70 border border-pink-500/30 px-2 py-0.5 rounded-full backdrop-blur-md shadow-[0_0_8px_rgba(255,0,127,0.3)]">
                  Watch Reel
                </span>
              </div>
            )}
          </div>
        ) : (
          <img
            src={item.url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}

        {/* Gradient overlay — only for images (video has native controls) */}
        {item.type === 'image' && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
        )}

        {/* Top-left badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none z-10">
          <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-pink-300 bg-pink-500/30 border border-pink-400/40 px-1.5 py-0.5 rounded-full backdrop-blur-md">
            0{index + 1}
          </span>
          <span className="font-mono text-[8px] font-bold text-white/80 bg-black/60 border border-white/15 px-1.5 py-0.5 rounded-full">
            {label}
          </span>
        </div>
      </div>

      {/* ── Info below media ── */}
      <div className="p-2 sm:p-2.5">
        <h3 className="font-display text-[11px] sm:text-xs font-bold uppercase text-white leading-tight line-clamp-1 group-hover:text-pink-300 transition-colors">
          {item.title}
        </h3>
        {item.tagline && (
          <p className="font-mono text-[9px] text-pink-300/80 font-semibold mt-0.5 line-clamp-1">
            {item.tagline}
          </p>
        )}
        {item.description && (
          <p className="text-[9px] text-white/60 mt-0.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
}

// ── View More Sheet ───────────────────────────────────────────────────────────
function ViewMoreSheet({
  items,
  onClose,
}: {
  items: MediaItem[];
  onClose: () => void;
}) {
  useBodyScrollLock(true);

  return (
    <div
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      className="fixed inset-0 z-[130] bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-3 overflow-hidden"
      onClick={onClose}
    >
      <div
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        className="relative w-full sm:max-w-4xl max-h-[85vh] bg-[#16060c] border border-rose-500/30 rounded-t-3xl sm:rounded-2xl p-4 sm:p-5 overflow-y-auto shadow-[0_0_60px_rgba(255,42,85,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 sticky top-0 bg-[#16060c] z-10">
          <div>
            <span className="eyebrow text-pink-300 font-bold uppercase text-xs">All Media</span>
            <h3 className="font-display text-base sm:text-lg font-extrabold uppercase text-white mt-0.5">
              Full Gallery ({items.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition text-xs"
          >
            ✕
          </button>
        </div>

        {/* Grid — inline playback here too */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item, i) => (
            <MediaCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Showreel Section ─────────────────────────────────────────────────────
export default function Showreel() {
  const ref = useScrollReveal<HTMLDivElement>();
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [showAll, setShowAll] = useState(false);

  const loadMedia = useCallback(async () => {
    const media = await getCMSMediaAsync();
    setMediaList(media);
  }, []);

  useEffect(() => {
    loadMedia();
    window.addEventListener('c2a_cms_updated', loadMedia);
    return () => window.removeEventListener('c2a_cms_updated', loadMedia);
  }, [loadMedia]);

  const visibleMedia = mediaList.slice(0, 4);
  const extraCount = Math.max(0, mediaList.length - 4);

  return (
    <section id="showreel" className="relative bg-[var(--color-void)] py-6 sm:py-8 scroll-mt-24">
      <div ref={ref} className="container-page">

        {/* ── Header ── */}
        <div data-reveal className="mb-4 sm:mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow mb-1 block text-pink-300 font-bold uppercase tracking-widest text-xs">
              Featured Reel &amp; Media
            </span>
            <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-tight sm:text-4xl text-white drop-shadow-[0_2px_12px_rgba(255,42,85,0.3)]">
              <StrokeText
                text="WATCH THE SKY MOVE."
                accentText="THE SKY MOVE."
                strokeColor="#ffffff"
                fillColor="#ffffff"
                accentStrokeColor="#ff007f"
                accentFillColor="#ff007f"
                strokeWidth={2}
                drawDuration={1.5}
                fillDelay={0.05}
                repeatDelay={5}
                stagger={0.04}
                ease="power2.out"
                trigger="loop"
                fillMode="wipe"
                fontSize={52}
                fontWeight={900}
                letterSpacing={-2}
              />
            </h2>
          </div>

          {extraCount > 0 && (
            <button
              onClick={() => setShowAll(true)}
              className="px-4 py-2 rounded-full border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 font-mono text-[11px] font-bold uppercase tracking-wider transition hover:scale-105 active:scale-95"
            >
              View All ({extraCount} more) →
            </button>
          )}
        </div>

        {/* ── Media Grid / Fallback ── */}
        {mediaList.length === 0 ? (
          /* Fallback when no media uploaded */
          <div
            data-reveal
            className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-r from-[#240913]/90 via-[#1a060e]/90 to-[#100308]/90 p-6 sm:p-10 text-center shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="w-10 h-10 bg-pink-500/20 border border-pink-400 text-pink-300 rounded-full flex items-center justify-center mx-auto mb-2.5 text-lg">
              🚁
            </div>
            <span className="eyebrow block text-pink-300 font-bold uppercase tracking-widest text-xs mb-1">
              Aerial Display Excellence
            </span>
            <h3 className="font-display text-lg sm:text-2xl font-extrabold uppercase text-white tracking-tight">
              High-Impact Synchronized Drone Light Performances
            </h3>
            <p className="mt-2 max-w-lg mx-auto text-xs sm:text-sm text-white/75 leading-relaxed">
              Transforming city skylines into vivid LED canvases — engineered for brand launches, live concerts, and grand celebrations.
            </p>
            <div className="mt-2.5 font-mono text-[11px] text-white/35">
              Upload media via <code className="text-pink-300">/admin</code> → Featured Media Reel
            </div>
          </div>
        ) : (
          /* 4-column responsive grid */
          <div
            data-reveal
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto justify-center items-center"
          >
            {visibleMedia.map((item, idx) => (
              <MediaCard key={item.id} item={item} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* View All Sheet */}
      {showAll && (
        <ViewMoreSheet items={mediaList} onClose={() => setShowAll(false)} />
      )}
    </section>
  );
}
