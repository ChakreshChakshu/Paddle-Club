'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 'courts',
    image: '/mobile_hero_pickleball.png',
    badge: 'Championship Play',
    badgeColor: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    activeBg: 'bg-emerald-400',
    title: 'The Courts',
    subtitle: 'Professional pickleball courts with floodlights — play until 11 PM.',
    cta: { label: 'Book a Court', href: '/book' },
    gradient: 'from-black/80 via-black/40 to-transparent',
    accentGradient: 'from-emerald-600/30 via-transparent to-transparent',
    overlayPosition: 'items-end',
  },
  {
    id: 'cafe',
    image: '/mobile_hero_cafe.png',
    badge: 'Social & Dine',
    badgeColor: 'text-amber-400',
    dotColor: 'bg-amber-400',
    activeBg: 'bg-amber-400',
    title: 'Cafe Brio',
    subtitle: "Agra's finest open-air dining — artisan coffee, fresh plates, warm vibes.",
    cta: { label: 'Explore Cafe', href: '/cafe' },
    gradient: 'from-black/80 via-black/40 to-transparent',
    accentGradient: 'from-amber-700/30 via-transparent to-transparent',
    overlayPosition: 'items-end',
  },
];

const SLIDE_DURATION = 4500;

export function MobileHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number, dir?: number) => {
    setDirection(dir ?? (index > current ? 1 : -1));
    setCurrent(index);
  }, [current]);

  const advance = useCallback(() => {
    const next = (current + 1) % slides.length;
    setDirection(1);
    setCurrent(next);
  }, [current]);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(advance, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [advance]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goTo((current + 1) % slides.length, 1);
      } else {
        goTo((current - 1 + slides.length) % slides.length, -1);
      }
    }
    touchStartX.current = null;
  };

  const slide = slides[current];

  const variants = {
    enter: (d: number) => ({ x: d * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d * -40, opacity: 0 }),
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-black"
      style={{ height: '100svh' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Background image layer ── */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={slide.id + '-bg'}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: `${d * 6}%`, scale: 1.06, opacity: 0 }),
            center: { x: '0%', scale: 1, opacity: 1 },
            exit: (d: number) => ({ x: `${d * -6}%`, scale: 1.06, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
            draggable={false}
          />
          {/* Gradient overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`} />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.accentGradient}`} />
        </motion.div>
      </AnimatePresence>

      {/* ── Content overlay ── */}
      <div className={`absolute inset-0 flex flex-col justify-between px-6 pt-16 pb-10 z-10`}>
        {/* Top: spacer (badge removed) */}
        <div />

        {/* Bottom: title + subtitle + CTA + dots */}
        <div className="flex flex-col gap-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-text'}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1], delay: 0.05 }}
              className="flex flex-col gap-2"
            >
              <h1 className="text-4xl font-extrabold font-display text-white tracking-tight leading-none drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA button */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + '-cta'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <a
                href={slide.cta.href}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm font-display uppercase tracking-wide text-white shadow-lg active:scale-95 transition-transform ${
                  slide.id === 'courts'
                    ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30'
                }`}
              >
                {slide.cta.label}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicator dots + progress bar */}
          <div className="flex items-center gap-3">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className="relative flex items-center"
                aria-label={`Go to slide ${i + 1}`}
              >
                {i === current ? (
                  <span className={`relative block h-2 rounded-full overflow-hidden ${
                    s.id === 'courts' ? 'bg-emerald-500/30 w-10' : 'bg-amber-500/30 w-10'
                  }`}>
                    <motion.span
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        s.id === 'courts' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                      key={current}
                    />
                  </span>
                ) : (
                  <span className="block w-2 h-2 rounded-full bg-white/30 hover:bg-white/60 transition-colors" />
                )}
              </button>
            ))}

            <span className="ml-auto text-white/40 text-xs font-mono tabular-nums">
              {current + 1} / {slides.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
