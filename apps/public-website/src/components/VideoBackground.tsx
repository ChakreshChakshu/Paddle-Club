'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export function VideoBackground() {
  // Track vertical page scroll
  const { scrollY } = useScroll();

  const transformProgress = useTransform(scrollY, [0, 1000], [0, 1]);

  // Apply spring physics to smooth out visual transforms
  const smoothProgress = useSpring(transformProgress, {
    damping: 45,
    stiffness: 80,
    mass: 0.6,
    restDelta: 0.001
  });

  // Visual transformations: opacity and blur on scroll (utilizing the smoothed progress)
  const opacityVal = useTransform(smoothProgress, [0, 1], [0.85, 0.1]);
  const blurVal = useTransform(smoothProgress, [0, 1], [0, 16]);
  const blur = useTransform(blurVal, (v) => `blur(${v}px)`);

  // Fade the dark overlay from a soft shadow (0.4) to solid (0.95) within the first 30% of hero scroll
  const overlayOpacity = useTransform(smoothProgress, [0, 0.3], [0.4, 0.95]);

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-brand-dark">
      {/* Scroll-controlled wrapper */}
      <motion.div
        style={{ filter: blur, opacity: opacityVal }}
        className="w-full h-full origin-center absolute inset-0"
      >
        {/* Static Background Image (hero.png) - Scaled and translated right */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover"
          style={{ 
            backgroundImage: "url('/hero.png')",
            backgroundPosition: "center",
            transform: "scale(1.35) translateX(13%) translateY(-8%)"
          }}
        />
      </motion.div>
      
      {/* Premium dark gradient overlay that fades in on scroll */}
      <motion.div 
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-brand-dark/95 via-brand-dark/50 to-transparent" 
      />
    </div>
  );
}
