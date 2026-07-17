'use client';

import * as React from 'react';
import { Button } from '@paddle-club/ui';
import { Menu, X, ArrowRight, Activity, Coffee, ShieldCheck, Building2 } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-4 left-0 right-0 z-50 px-4 transition-all duration-300"
    >
      <div
        id="navbar-container"
        className={`max-w-7xl mx-auto px-8 py-3 rounded-full transition-all duration-300 border backdrop-blur-md shadow-xl ${
          scrolled
            ? 'bg-brand-dark-card/95 border-brand-dark-border/80 shadow-palm-leaf-950/10'
            : 'bg-brand-dark-card/80 border-brand-dark-border/50'
        } flex items-center justify-between`}
      >
        {/* Brand Logo */}
        <a id="navbar-logo" href="/" className="flex items-center space-x-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-brand-court to-brand-court-dark shadow-md shadow-palm-leaf-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-lg font-bold font-display text-white italic">P</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight font-display text-white transition-colors duration-300 group-hover:text-brand-court-light">
            THE PADDLE <span className="text-brand-court">CLUB</span>
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <div id="navbar-links" className="hidden md:flex items-center space-x-1 bg-brand-dark-card/40 p-1.5 rounded-full border border-brand-dark-border/50 backdrop-blur-sm">
          <a
            href="/courts"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-full hover:bg-brand-dark-card/50 transition-all"
          >
            <Activity className="w-3.5 h-3.5 text-brand-court" />
            <span>The Courts</span>
          </a>
          <a
            href="/cafe"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-full hover:bg-brand-dark-card/50 transition-all"
          >
            <Coffee className="w-3.5 h-3.5 text-brand-cafe" />
            <span>Cafe Brio</span>
          </a>
          <a
            href="/corporate"
            className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-full hover:bg-brand-dark-card/50 transition-all"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Corporate</span>
          </a>

        </div>

        {/* CTA Button */}
        <div id="navbar-cta" className="hidden md:flex items-center space-x-4">
          <a href="/courts">
            <Button
              variant="primary"
              size="sm"
              className="relative overflow-hidden group shadow-lg shadow-palm-leaf-500/20 px-5 py-2.5"
            >
              <span className="relative z-10 flex items-center">
                Book Court <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-court to-brand-court-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Button>
          </a>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-brand-dark-card border border-transparent hover:border-brand-dark-border transition-all"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-brand-dark/95 backdrop-blur-lg z-40 transition-all duration-300 border-t border-brand-dark-border ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 pointer-events-none invisible'
        }`}
      >
        <div className="p-6 space-y-6 flex flex-col h-full justify-between">
          <div className="space-y-4">
            <a
              href="/courts"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-4 rounded-xl bg-brand-dark-card/50 border border-brand-dark-border/40 hover:border-brand-court/30 transition-all"
            >
              <div className="p-2 bg-brand-court/10 rounded-lg">
                <Activity className="w-5 h-5 text-brand-court" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">The Courts</h4>
                <p className="text-xs text-slate-400">Elite acrylic & padel playing fields</p>
              </div>
            </a>
 
            <a
              href="/cafe"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-4 rounded-xl bg-brand-dark-card/50 border border-brand-dark-border/40 hover:border-brand-cafe/30 transition-all"
            >
              <div className="p-2 bg-brand-cafe/10 rounded-lg">
                <Coffee className="w-5 h-5 text-brand-cafe" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Cafe Brio</h4>
                <p className="text-xs text-slate-400">Artisan food & refreshing social drinks</p>
              </div>
            </a>

            <a
              href="/corporate"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 p-4 rounded-xl bg-brand-dark-card/50 border border-brand-dark-border/40 hover:border-blue-500/30 transition-all"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Corporate</h4>
                <p className="text-xs text-slate-400">Bespoke tournament setups & packages</p>
              </div>
            </a>
 

          </div>

          <div className="space-y-4 pb-12">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-brand-court/20 border border-brand-court/10 text-brand-court-light text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Agra's Premium Sports & Dining destination</span>
            </div>
            <a href="/courts" onClick={() => setIsOpen(false)} className="block w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full shadow-lg shadow-brand-court/20"
              >
                Book Court Slot
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
