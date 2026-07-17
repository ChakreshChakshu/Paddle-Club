'use client';

import React from 'react';
import { isEnabled } from '@paddle-club/feature-flags';
import { Button } from '@paddle-club/ui';
import { Coffee } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TypewriterTitle } from '../components/TypewriterTitle';
import { VideoBackground } from '../components/VideoBackground';
import { BrandingLoader } from '../components/BrandingLoader';
import ExpandableGallery from '../components/ui/gallery-animation';
import { MobileHeroSlider } from '../components/MobileHeroSlider';
import { motion } from 'framer-motion';

import SpecularButton from '../components/SpecularButton';
import { ContainerStagger, ContainerAnimated, GalleryGrid, GalleryGridCell } from '@/components/ui/cta-section-with-gallery';
import { Button as ShadcnButton } from '@/components/ui/button';

const courtImages = [
  '/court1.png',
  '/court2.png',
  '/court3.png',
  '/court4.png',
  '/court5.png'
];

export default function HomePage() {
  const showCafeBooking = isEnabled('FEATURE_RESTAURANT_MENU_BOOKING');

  return (
    <main className="relative flex flex-col items-center min-h-screen text-slate-100">
      {/* Page Preloader Branding Animation */}
      <BrandingLoader />

      {/* Main content wrapper for radial wave reveal */}
      <div id="main-content" className="w-full flex-1 flex flex-col items-center bg-brand-dark" style={{ clipPath: 'circle(0% at 0px 0px)' }}>
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-court/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-brand-cafe/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Navbar — fixed z-[100], renders for both mobile & desktop */}
        <Navbar />

        {/* ── MOBILE HERO: Image Slider (visible below md) ── */}
        <div className="block md:hidden w-full">
          <MobileHeroSlider />
        </div>

        {/* ── DESKTOP HERO: Video Background + Content (md and above) ── */}
        <div className="hidden md:flex relative w-full h-screen flex-col justify-between overflow-hidden">
          {/* Full-bleed Video Background */}
          <VideoBackground />

          {/* Hero Content */}
          <section className="relative w-full max-w-7xl mx-auto px-6 h-full flex items-center justify-start z-10 flex-grow pt-24 pb-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 max-w-lg flex flex-col space-y-6 text-left"
            >
              <TypewriterTitle />
              
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Experience elite pickleball play on professional, illuminated courts followed by artisan food at Cafe Brio. A true gem in DayalBagh, Agra.
              </p>

              <div className="pt-2 w-full">
                <a href="/courts" className="inline-block w-full sm:w-auto">
                  <SpecularButton
                    size="lg"
                    radius={24}
                    tint="var(--color-cafe-bg)"
                    tintOpacity={0.05}
                    blur={4}
                    textColor="var(--color-cafe-bg)"
                    lineColor="var(--color-lime-light)"
                    baseColor="var(--color-neutral-800)"
                    intensity={1.2}
                    shineSize={12}
                    shineFade={45}
                    thickness={1.5}
                    speed={0.3}
                    followMouse
                    proximity={250}
                    className="w-full sm:w-auto font-display font-bold uppercase tracking-wide shadow-lg"
                  >
                    Book Court Session
                  </SpecularButton>
                </a>
              </div>
            </motion.div>
          </section>
        </div>

      {/* Dedicated Sections */}
      <div className="w-full max-w-7xl px-6 py-20 flex flex-col space-y-32 z-10">
        
        {/* Section: The Courts */}
        <section className="flex flex-col items-center space-y-10 lg:space-y-14 w-full">
          {/* Section Header (Very Top) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center space-y-3"
          >
            <div className="inline-flex items-center space-x-2 text-brand-court font-semibold tracking-wide text-xs md:text-sm uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-court animate-pulse" />
              <span>Championship Play</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight leading-none">
              The Courts
            </h2>
          </motion.div>

          {/* Visual card for courts with ExpandableGallery (Centered full width in the middle) */}
          <div className="w-full overflow-visible">
            <ExpandableGallery
              images={courtImages}
              className="w-full"
            />
          </div>

          {/* Text block & bullet points / CTA in a horizontal split below the cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start w-full border-t border-brand-dark-border/30 pt-10"
          >
            {/* Left Column: Description */}
            <div className="flex flex-col space-y-4">
              <p className="text-slate-300 leading-relaxed text-base md:text-lg">
                Play on professional-grade pickleball courts. Featuring pristine surfaces, premium net systems, and elite evening floodlights for play up to 11:00 PM.
              </p>
            </div>

            {/* Right Column: Features list and CTA button */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center lg:items-start xl:items-center justify-between gap-6 w-full h-full lg:pt-2 xl:pt-0">
              <ul className="space-y-4 flex-grow">
                {[
                  "Premium Acrylic Court Surface",
                  "Beginner-Friendly Coaching Classes",
                  "Dynamic Open-Play Slots"
                ].map((item, idx) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-3 text-slate-300"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-court/20 flex items-center justify-center text-brand-court text-micro font-bold shadow-md shadow-palm-leaf-500/10">✓</span>
                    <span className="font-semibold text-sm md:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <a href="/courts" className="block w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg shadow-palm-leaf-500/20 group relative overflow-hidden px-8 py-4">
                    <span className="relative z-10 flex items-center justify-center font-display font-bold uppercase tracking-wide text-xs md:text-sm">
                      Book Court Now
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-court to-brand-court-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section: Cafe Brio */}
        <section className="w-full">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 py-12 md:grid-cols-2">
            <ContainerStagger className="flex flex-col space-y-6 animate-fade-in">
              <ContainerAnimated className="inline-flex items-center space-x-2 text-brand-cafe font-semibold tracking-wide text-xs md:text-sm uppercase">
                <Coffee className="w-4 h-4 text-brand-cafe animate-pulse" />
                <span>Social & Dine</span>
              </ContainerAnimated>
              <ContainerAnimated className="text-4xl md:text-5xl font-bold font-display text-white tracking-tight leading-none">
                Cafe Brio
              </ContainerAnimated>
              <ContainerAnimated className="text-slate-300 leading-relaxed text-base md:text-lg">
                Agra's highly-acclaimed open-air dining experience. Enjoy coffee, mocktails, and fresh plates crafted by our expert chef in a lively, aesthetic social environment.
              </ContainerAnimated>
              
              <ContainerAnimated className="space-y-4">
                {[
                  { text: "Open-Air Garden Ambience" },
                  { text: "Curated Specialty Coffee & Shakes" },
                  { text: showCafeBooking ? 'Table reservation active' : 'Table reservation coming soon' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-cafe/10 flex items-center justify-center text-brand-cafe">
                      <Coffee className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-semibold text-sm md:text-base">{item.text}</span>
                  </div>
                ))}
              </ContainerAnimated>

              <ContainerAnimated className="pt-2">
                <a href={showCafeBooking ? '/cafe#book' : '/cafe'}>
                  <ShadcnButton className="bg-brand-cafe hover:bg-brand-cafe/90 text-white font-display font-bold uppercase tracking-wide px-8 py-6 rounded-xl shadow-lg shadow-brand-cafe/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    {showCafeBooking ? 'Book a Table' : 'Cafe Gallery'}
                  </ShadcnButton>
                </a>
              </ContainerAnimated>
            </ContainerStagger>

            <GalleryGrid>
              {[
                "/cafe_interior.png",
                "/cafe_dish.png",
                "/unnamed(14).webp",
                "/unnamed(18).webp"
              ].map((imageUrl, index) => (
                <GalleryGridCell index={index} key={index}>
                  <img
                    className="size-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    width="100%"
                    height="100%"
                    src={imageUrl}
                    alt="Cafe Brio food and vibe"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent pointer-events-none" />
                </GalleryGridCell>
              ))}
            </GalleryGrid>
          </div>
        </section>
      </div>



      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
