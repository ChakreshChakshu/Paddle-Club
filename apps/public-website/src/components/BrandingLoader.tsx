'use client';

import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export function BrandingLoader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Run the animation after a short delay to let the page settle
    const timer = setTimeout(() => {
      const target = document.getElementById('navbar-logo');
      const source = document.getElementById('loader-logo-container');
      const bg = document.getElementById('preloader-bg');
      const container = document.getElementById('navbar-container');

      if (bg) {
        if (target && source && container) {
          const targetRect = target.getBoundingClientRect();
          const sourceRect = source.getBoundingClientRect();

          // Calculate exact center coordinates of the landing logo
          const centerX = targetRect.left + targetRect.width / 2;
          const centerY = targetRect.top + targetRect.height / 2;

          // Calculate scale and offsets for logo flight
          const scale = targetRect.width / sourceRect.width;
          const x = targetRect.left - sourceRect.left;
          const y = targetRect.top - sourceRect.top;

          // Setup the initial state of the main content circle mask
          gsap.set('#main-content', {
            clipPath: `circle(0% at ${centerX}px ${centerY}px)`
          });
          gsap.set('#navbar-container', { opacity: 0 });
          gsap.set('#navbar-logo', { opacity: 0 });
          gsap.set('#navbar-links', { opacity: 0, scale: 0.9 });
          gsap.set('#navbar-cta', { opacity: 0, scale: 0.9 });

          const tl = gsap.timeline({
            onComplete: () => {
              // Remove preloader elements from DOM entirely at the very end
              bg.style.display = 'none';
              source.style.display = 'none';
              // Clear clipPath to prevent scroll performance hitches
              gsap.set('#main-content', { clearProps: 'clipPath' });
            }
          });

          // 1. Fade out the full-screen loader background only
          tl.to(bg, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.7,
            ease: 'power2.inOut'
          }, 0.25);

          // 2. Animate the logo container: fly to navbar, shrink to scale
          tl.to(source, {
            x: x,
            y: y,
            scale: scale,
            transformOrigin: 'top left',
            duration: 0.85,
            ease: 'power3.inOut',
            onComplete: () => {
              // Seamlessly swap the logos the instant flight completes
              target.style.opacity = '1';
              source.style.opacity = '0';
            }
          }, 0);

          // 3. Expand the navbar container background and borders from the left
          tl.fromTo(container, {
            opacity: 0,
            scaleX: 0.3,
            transformOrigin: 'left center'
          }, {
            opacity: 1,
            scaleX: 1,
            duration: 0.7,
            ease: 'power3.out'
          }, 0.25);

          // 4. Wave Reveal: Expand circular mask from logo center
          tl.to('#main-content', {
            clipPath: `circle(150% at ${centerX}px ${centerY}px)`,
            duration: 1.3,
            ease: 'power2.inOut'
          }, 0.15);

          // 5. Reveal navbar links and CTA
          tl.to('#navbar-links', {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.2)'
          }, 0.6);

          tl.to('#navbar-cta', {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.2)'
          }, 0.65);
        } else {
          // Fallback: Safely fade out the loader overlay so the page is fully interactive
          gsap.to(bg, {
            opacity: 0,
            pointerEvents: 'none',
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              bg.style.display = 'none';
              if (source) source.style.display = 'none';
              const mainContent = document.getElementById('main-content');
              if (mainContent) {
                mainContent.style.clipPath = 'none';
              }
            }
          });
        }
      }
    }, 600); // 600ms initial branding presentation

    return () => clearTimeout(timer);
  }, [mounted]);

  // Render the preloader immediately during SSR and on client first paint
  return (
    <>
      {/* Background Overlay - sibling of logo */}
      <div 
        id="preloader-bg" 
        className="fixed inset-0 bg-brand-dark z-[9998] pointer-events-auto"
        style={{ opacity: 1 }}
      />
      
      {/* Centering wrapper - sibling of background */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none select-none">
        {/* Actual Logo element - this is measured and animated */}
        <div 
          id="loader-logo-container" 
          className="flex items-center space-x-3.5 origin-center"
        >
          <div 
            id="loader-logo-p" 
            className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-brand-court to-brand-court-dark shadow-2xl shadow-palm-leaf-500/30"
          >
            <span className="text-3xl md:text-4xl font-bold font-display text-white italic">P</span>
          </div>
          <span 
            id="loader-logo-text" 
            className="text-3xl md:text-5xl font-extrabold tracking-tight font-display text-white"
          >
            THE PADDLE <span className="text-brand-court">CLUB</span>
          </span>
        </div>
      </div>
    </>
  );
}
