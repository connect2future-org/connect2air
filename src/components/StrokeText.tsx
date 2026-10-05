import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './StrokeText.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface StrokeTextProps {
  text?: string;
  accentText?: string;
  strokeColor?: string;
  fillColor?: string;
  accentStrokeColor?: string;
  accentFillColor?: string;
  strokeWidth?: number;
  drawDuration?: number;
  fillDelay?: number;
  repeatDelay?: number;
  stagger?: number;
  ease?: string;
  trigger?: 'mount' | 'hover' | 'scroll' | 'loop';
  fillMode?: 'fade' | 'wipe' | 'none';
  fontSize?: number | string;
  fontWeight?: number | string;
  letterSpacing?: number | string;
  reverse?: boolean;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_TEXT = 'Draw Attention';

export default function StrokeText({
  text = DEFAULT_TEXT,
  accentText = '',
  strokeColor = '#FFFFFF',
  fillColor = '#FFFFFF',
  accentStrokeColor = '#FF007F',
  accentFillColor = '#FF007F',
  strokeWidth = 2,
  drawDuration = 1.6,
  fillDelay = 0.05,
  repeatDelay = 5,
  stagger = 0.04,
  ease = 'power2.out',
  trigger = 'loop',
  fillMode = 'wipe',
  fontSize = 128,
  fontWeight = 900,
  letterSpacing = -2,
  reverse = false,
  className = '',
  style = {}
}: StrokeTextProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const strokeTextRef = useRef<SVGTextElement>(null);
  const fillWrapRef = useRef<SVGGElement | null>(null);

  const [box, setBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  // Parse characters into a single unified array with stroke/fill color metadata per character
  const charItems = useMemo(() => {
    const fullText = String(text ?? '');
    const accent = String(accentText ?? '');

    if (!accent || !fullText.includes(accent)) {
      return Array.from(fullText).map((char) => ({
        char,
        stroke: strokeColor,
        fill: fillColor,
        isAccent: false
      }));
    }

    const idx = fullText.indexOf(accent);
    const prefix = fullText.slice(0, idx);
    const suffix = fullText.slice(idx + accent.length);

    const items: { char: string; stroke: string; fill: string; isAccent: boolean }[] = [];

    Array.from(prefix).forEach((char) => {
      items.push({ char, stroke: strokeColor, fill: fillColor, isAccent: false });
    });

    Array.from(accent).forEach((char) => {
      items.push({
        char,
        stroke: accentStrokeColor || strokeColor,
        fill: accentFillColor || fillColor,
        isAccent: true
      });
    });

    Array.from(suffix).forEach((char) => {
      items.push({ char, stroke: strokeColor, fill: fillColor, isAccent: false });
    });

    return items;
  }, [text, accentText, strokeColor, fillColor, accentStrokeColor, accentFillColor]);

  const numericFontSize = typeof fontSize === 'number' ? fontSize : parseFloat(String(fontSize)) || 128;
  const dash = Math.max(numericFontSize * 8, 300);

  // Compute fallback bounding box so SVG viewBox never fails even before getBBox settles
  const fallbackBox = useMemo(() => {
    const pad = Math.max(Number(strokeWidth) || 2, numericFontSize * 0.15);
    const estimatedW = Math.max(charItems.length * numericFontSize * 0.75, 120);
    const estimatedH = numericFontSize * 1.4;
    return {
      x: -pad,
      y: -numericFontSize - pad,
      width: estimatedW + pad * 2,
      height: estimatedH + pad * 2
    };
  }, [charItems.length, numericFontSize, strokeWidth]);

  const effectiveBox = box || fallbackBox;

  const fontStyle = useMemo(
    () => ({
      fontSize: `${fontSize}px`,
      fontWeight,
      letterSpacing: `${letterSpacing}px`
    }),
    [fontSize, fontWeight, letterSpacing]
  );

  // Bounding Box Measurement
  useLayoutEffect(() => {
    let cancelled = false;

    const measure = () => {
      if (cancelled || !strokeTextRef.current) return;
      let bbox: SVGRect | undefined;
      try {
        bbox = strokeTextRef.current.getBBox();
      } catch {
        return;
      }
      if (!bbox || !bbox.width || bbox.width <= 0) return;

      const pad = Math.max(Number(strokeWidth) || 2, numericFontSize * 0.15);
      const next = {
        x: bbox.x - pad,
        y: bbox.y - pad,
        width: bbox.width + pad * 2,
        height: bbox.height + pad * 2
      };

      setBox(prev =>
        prev &&
        Math.abs(prev.x - next.x) < 0.5 &&
        Math.abs(prev.width - next.width) < 0.5 &&
        Math.abs(prev.y - next.y) < 0.5
          ? prev
          : next
      );
    };

    measure();

    const rafId = requestAnimationFrame(measure);
    const t1 = setTimeout(measure, 50);
    const t2 = setTimeout(measure, 300);

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) measure();
      }).catch(() => {});
    }

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && rootRef.current) {
      observer = new ResizeObserver(() => {
        if (!cancelled) measure();
      });
      observer.observe(rootRef.current);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      observer?.disconnect();
    };
  }, [charItems, fontSize, fontWeight, letterSpacing, strokeWidth, numericFontSize]);

  // GSAP Animation Controller: Skeleton Stroke -> Color Fill
  useEffect(() => {
    const root = rootRef.current;
    if (typeof window === 'undefined' || !root) return undefined;

    const strokes = gsap.utils.toArray(root.querySelectorAll('[data-stroke-char]'));
    const fillChars = gsap.utils.toArray(root.querySelectorAll('[data-fill-char]'));
    const fillWrap = fillWrapRef.current;
    if (!strokes.length) return undefined;

    const fillEnabled = fillMode !== 'none';
    const fillDuration = Math.max(0.5, drawDuration * 0.5);
    const staggerConfig: gsap.StaggerVars | number = reverse ? { each: stagger, from: 'end' } : stagger;

    const setStart = () => {
      gsap.killTweensOf([strokes, fillWrap, ...fillChars].filter(Boolean));
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: dash });
      if (fillWrap) {
        gsap.set(fillWrap, {
          clipPath: 'inset(0% 100% 0% 0%)',
          webkitClipPath: 'inset(0% 100% 0% 0%)',
          opacity: 1
        });
      }
      if (fillChars.length) {
        gsap.set(fillChars, { fillOpacity: 0 });
      }
    };

    const setEnd = () => {
      gsap.killTweensOf([strokes, fillWrap, ...fillChars].filter(Boolean));
      gsap.set(strokes, { strokeDasharray: dash, strokeDashoffset: 0 });
      if (fillWrap) {
        gsap.set(fillWrap, {
          clipPath: fillEnabled ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
          webkitClipPath: fillEnabled ? 'inset(0% 0% 0% 0%)' : 'inset(0% 100% 0% 0%)',
          opacity: 1
        });
      }
      if (fillChars.length) {
        gsap.set(fillChars, { fillOpacity: fillEnabled ? 1 : 0 });
      }
    };

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setEnd();
      return () => { gsap.killTweensOf([strokes, fillWrap, ...fillChars].filter(Boolean)); };
    }

    const build = () => {
      setStart();
      const tl = gsap.timeline({
        paused: true,
        repeat: trigger === 'loop' ? -1 : 0,
        repeatDelay: trigger === 'loop' ? repeatDelay : 0,
        onRepeat: () => {
          setStart();
        },
        defaults: { overwrite: 'auto' }
      });

      // Stage 1: Draw skeleton outline stroke across characters from left to right
      tl.fromTo(
        strokes,
        { strokeDasharray: dash, strokeDashoffset: dash },
        { strokeDashoffset: 0, duration: drawDuration, ease, stagger: staggerConfig },
        0
      );

      // Stage 2: ONCE skeleton structure is drawn, flood solid color fill from left to right across entire text
      if (fillEnabled) {
        const fillStartTime = Math.max(0.2, (drawDuration + (strokes.length * (typeof stagger === 'number' ? stagger : 0.04))) * 0.6) + fillDelay;

        if (fillWrap) {
          tl.fromTo(
            fillWrap,
            {
              clipPath: 'inset(0% 100% 0% 0%)',
              webkitClipPath: 'inset(0% 100% 0% 0%)'
            },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              webkitClipPath: 'inset(0% 0% 0% 0%)',
              duration: fillDuration,
              ease: 'power2.inOut'
            },
            fillStartTime
          );
        }

        if (fillChars.length) {
          tl.fromTo(
            fillChars,
            { fillOpacity: 0 },
            { fillOpacity: 1, duration: fillDuration * 0.8, ease: 'power2.out', stagger: staggerConfig },
            fillStartTime
          );
        }
      }

      return tl;
    };

    let timeline: gsap.core.Timeline | null = null;
    let scrollTrigger: ScrollTrigger | null = null;
    let removeHover: (() => void) | null = null;

    if (trigger === 'hover') {
      setEnd();
      const play = () => {
        timeline?.kill();
        timeline = build();
        timeline.play(0);
      };
      root.addEventListener('pointerenter', play);
      removeHover = () => root.removeEventListener('pointerenter', play);
    } else if (trigger === 'loop' || trigger === 'scroll') {
      timeline = build();
      scrollTrigger = ScrollTrigger.create({
        trigger: root,
        start: 'top 85%',
        once: trigger === 'scroll',
        onEnter: () => {
          timeline?.play(0);
        }
      });
      // Fallback: if already in viewport on mount, start immediately
      const rect = root.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        timeline.play(0);
      }
    } else {
      timeline = build();
      timeline.play(0);
    }

    return () => {
      removeHover?.();
      scrollTrigger?.kill();
      timeline?.kill();
      gsap.killTweensOf([strokes, fillWrap, ...fillChars].filter(Boolean));
    };
  }, [dash, drawDuration, fillDelay, repeatDelay, stagger, ease, trigger, fillMode, reverse]);

  const viewBox = `${effectiveBox.x} ${effectiveBox.y} ${effectiveBox.width} ${effectiveBox.height}`;

  return (
    <span
      ref={rootRef}
      className={`stroke-text ${trigger === 'hover' ? 'stroke-text--hover' : ''} ${className}`.trim()}
      style={{ ...style, '--stroke-text-height': `${Math.round(numericFontSize * 1.25)}px` } as CSSProperties}
      role="img"
      aria-label={String(text ?? '')}
    >
      {/* Single Unified SVG Container (100% pixel-perfect stroke and fill alignment) */}
      <svg className="stroke-text__svg" viewBox={viewBox} preserveAspectRatio="xMinYMid meet" aria-hidden="true">
        {/* Layer 1: Skeleton Stroke Outlines */}
        <text
          ref={strokeTextRef}
          className="stroke-text__stroke"
          x="0"
          y="0"
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
          style={fontStyle}
        >
          {charItems.map((item, index) => (
            <tspan
              data-stroke-char
              key={`s-${index}`}
              stroke={item.stroke}
              className={item.isAccent ? 'stroke-text__accent-stroke' : undefined}
            >
              {item.char}
            </tspan>
          ))}
        </text>

        {/* Layer 2: Solid Fill Color Layer (Floods directly inside skeleton structure) */}
        <g ref={fillWrapRef} className="stroke-text__fill-group">
          <text
            className="stroke-text__fill"
            x="0"
            y="0"
            stroke="none"
            style={fontStyle}
          >
            {charItems.map((item, index) => (
              <tspan
                data-fill-char
                key={`f-${index}`}
                fill={item.fill}
                className={item.isAccent ? 'stroke-text__accent-fill' : undefined}
                style={{ fillOpacity: 0 }}
              >
                {item.char}
              </tspan>
            ))}
          </text>
        </g>
      </svg>
    </span>
  );
}
