'use client';

import * as React from 'react';
import { Menu, X, ArrowRight, Activity, Coffee, ShieldCheck, Building2 } from 'lucide-react';

/* ─── Liquid Glass CSS injected once ─── */
const GLASS_STYLE = `
  .glass-pill {
    background: linear-gradient(
      135deg,
      rgba(242,235,220,0.06) 0%,
      rgba(125,140,130,0.04) 50%,
      rgba(22,38,28,0.08) 100%
    );
    backdrop-filter: blur(40px) saturate(180%) brightness(1.08);
    -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(1.08);
    border: 1px solid rgba(242,235,220,0.12);
    box-shadow:
      0 0 0 0.5px rgba(242,235,220,0.06) inset,
      0 1.5px 0 0 rgba(242,235,220,0.10) inset,
      0 -1px 0 0 rgba(1,13,0,0.25) inset,
      0 8px 32px rgba(1,13,0,0.55),
      0 2px 8px rgba(1,13,0,0.35);
    transition: box-shadow 0.35s ease, background 0.35s ease;
  }
  .glass-pill.scrolled {
    background: linear-gradient(
      135deg,
      rgba(242,235,220,0.09) 0%,
      rgba(125,140,130,0.06) 50%,
      rgba(5,38,10,0.18) 100%
    );
    box-shadow:
      0 0 0 0.5px rgba(242,235,220,0.08) inset,
      0 1.5px 0 0 rgba(242,235,220,0.14) inset,
      0 -1px 0 0 rgba(1,13,0,0.35) inset,
      0 12px 40px rgba(1,13,0,0.65),
      0 4px 12px rgba(1,13,0,0.4);
  }

  /* Inner pill for nav links — nested glass */
  .glass-links {
    background: rgba(242,235,220,0.04);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(242,235,220,0.08);
    box-shadow:
      0 1px 0 rgba(242,235,220,0.06) inset,
      0 -1px 0 rgba(1,13,0,0.15) inset;
  }

  /* Liquid glass drawer panel */
  .glass-drawer {
    background: linear-gradient(
      160deg,
      rgba(22,38,28,0.72) 0%,
      rgba(5,38,10,0.85) 60%,
      rgba(1,13,0,0.92) 100%
    );
    backdrop-filter: blur(60px) saturate(160%) brightness(1.05);
    -webkit-backdrop-filter: blur(60px) saturate(160%) brightness(1.05);
    border-bottom: 1px solid rgba(242,235,220,0.10);
    box-shadow:
      0 1.5px 0 rgba(242,235,220,0.08) inset,
      0 32px 80px rgba(1,13,0,0.7),
      0 8px 24px rgba(1,13,0,0.5);
  }

  /* Card links inside drawer */
  .glass-drawer-card {
    background: rgba(242,235,220,0.04);
    border: 1px solid rgba(242,235,220,0.07);
    transition: background 0.2s ease, border-color 0.2s ease;
  }
  .glass-drawer-card:hover {
    background: rgba(242,235,220,0.07);
    border-color: rgba(242,235,220,0.14);
  }
  .glass-drawer-card:active {
    transform: scale(0.985);
  }
`;

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  /* Text on dark glass — use bright cream/sage for legibility */
  const cream      = '#F2EBDC';             /* warm cream — primary text  */
  const creamMuted = '#b8c4bc';             /* lighter sage — muted text  */
  const creamFaint = 'rgba(242,235,220,0.6)'; /* faint — inactive links   */

  return (
    <>
      {/* Inject glass CSS once */}
      <style>{GLASS_STYLE}</style>

      {/* ─── Liquid Glass Pill Bar ─── */}
      <nav className="fixed top-3 left-0 right-0 z-[100] px-3 sm:top-4 sm:px-4">
        <div
          id="navbar-container"
          className={`glass-pill${scrolled ? ' scrolled' : ''} max-w-7xl mx-auto px-4 sm:px-6 py-2.5 rounded-full flex items-center justify-between gap-2`}
        >
          {/* ── Logo ── */}
          <a id="navbar-logo" href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            {/* Icon badge */}
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #16261C 0%, #05260A 100%)',
                border: '1px solid rgba(242,235,220,0.18)',
                boxShadow: '0 1px 0 rgba(242,235,220,0.12) inset, 0 4px 12px rgba(1,13,0,0.5)',
              }}
            >
              <span
                className="text-base sm:text-lg font-bold font-display italic"
                style={{ color: cream }}
              >P</span>
            </div>
            {/* Wordmark — sm+ */}
            <span
              className="hidden sm:block text-base md:text-[1.1rem] font-extrabold tracking-tight font-display whitespace-nowrap transition-colors duration-300"
              style={{ color: cream }}
            >
              THE PADDLE{' '}
              <span style={{ color: creamMuted }}>CLUB</span>
            </span>
          </a>

          {/* ── Desktop Nav Links — lg+ ── */}
          <div id="navbar-links" className="glass-links hidden lg:flex items-center gap-0.5 p-1.5 rounded-full">
            {[
              { href: '/courts',    icon: <Activity  className="w-3.5 h-3.5" style={{ color: creamMuted }} />, label: 'The Courts' },
              { href: '/cafe',      icon: <Coffee    className="w-3.5 h-3.5" style={{ color: creamMuted }} />, label: 'Cafe Brio'  },
              { href: '/corporate', icon: <Building2 className="w-3.5 h-3.5" style={{ color: creamMuted }} />, label: 'Corporate'  },
            ].map(({ href, icon, label }) => (
              <a
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-white/[0.06]"
                style={{ color: creamFaint }}
                onMouseEnter={e => (e.currentTarget.style.color = cream)}
                onMouseLeave={e => (e.currentTarget.style.color = creamFaint)}
              >
                {icon}
                <span>{label}</span>
              </a>
            ))}
          </div>

          {/* ── Right: CTA + hamburger ── */}
          <div id="navbar-cta" className="flex items-center gap-2 flex-shrink-0">
            {/* Desktop CTA */}
            <a href="/book" className="hidden lg:block">
              <button
                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold font-display uppercase tracking-wide transition-all duration-200 active:scale-95 group"
                style={{
                  background: 'linear-gradient(135deg, rgba(242,235,220,0.15) 0%, rgba(242,235,220,0.06) 100%)',
                  border: '1px solid rgba(242,235,220,0.20)',
                  boxShadow: '0 1px 0 rgba(242,235,220,0.10) inset',
                  color: cream,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(242,235,220,0.22) 0%, rgba(242,235,220,0.10) 100%)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,235,220,0.32)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(242,235,220,0.15) 0%, rgba(242,235,220,0.06) 100%)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(242,235,220,0.20)';
                }}
              >
                Book Court
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </a>

            {/* Mobile compact book pill */}
            <a
              href="/book"
              className="lg:hidden inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-xs font-bold font-display uppercase tracking-wide transition-all active:scale-95"
              style={{
                background: 'rgba(242,235,220,0.12)',
                border: '1px solid rgba(242,235,220,0.18)',
                color: cream,
              }}
            >
              Book
              <ArrowRight className="w-3 h-3" />
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="lg:hidden p-2 rounded-xl transition-all duration-200"
              style={{
                color: creamMuted,
                background: 'rgba(242,235,220,0.05)',
                border: '1px solid rgba(242,235,220,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = cream;
                (e.currentTarget as HTMLElement).style.background = 'rgba(242,235,220,0.10)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = creamMuted;
                (e.currentTarget as HTMLElement).style.background = 'rgba(242,235,220,0.05)';
              }}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Backdrop ─── */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-[98] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(1,13,0,0.55)', backdropFilter: 'blur(4px)' }}
      />

      {/* ─── Liquid Glass Drawer ─── */}
      <div
        className={`glass-drawer lg:hidden fixed top-0 left-0 right-0 z-[99] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 pt-5 pb-4"
          style={{ borderBottom: '1px solid rgba(242,235,220,0.08)' }}
        >
          <a href="/" onClick={close} className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #16261C 0%, #05260A 100%)',
                border: '1px solid rgba(242,235,220,0.15)',
              }}
            >
              <span className="text-base font-bold font-display italic" style={{ color: cream }}>P</span>
            </div>
            <span className="text-base font-extrabold font-display" style={{ color: cream }}>
              THE PADDLE <span style={{ color: creamMuted }}>CLUB</span>
            </span>
          </a>
          <button
            onClick={close}
            className="p-2 rounded-xl transition-all"
            style={{ color: creamMuted, background: 'rgba(242,235,220,0.05)', border: '1px solid rgba(242,235,220,0.08)' }}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <div className="px-4 py-4 space-y-2">
          {[
            { href: '/courts',    Icon: Activity,  label: 'The Courts', sub: 'Elite acrylic pickleball courts' },
            { href: '/cafe',      Icon: Coffee,    label: 'Cafe Brio',  sub: 'Open-air artisan dining & drinks' },
            { href: '/corporate', Icon: Building2, label: 'Corporate',  sub: 'Bespoke tournament packages' },
          ].map(({ href, Icon, label, sub }) => (
            <a
              key={href}
              href={href}
              onClick={close}
              className="glass-drawer-card flex items-center gap-3.5 p-4 rounded-2xl"
            >
              <div
                className="p-2.5 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(242,235,220,0.06)', border: '1px solid rgba(242,235,220,0.08)' }}
              >
                <Icon className="w-5 h-5" style={{ color: creamMuted }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm" style={{ color: cream }}>{label}</div>
                <div className="text-xs mt-0.5" style={{ color: creamMuted }}>{sub}</div>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(242,235,220,0.25)' }} />
            </a>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="px-4 pb-7 pt-2 space-y-3">
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(242,235,220,0.04)', border: '1px solid rgba(242,235,220,0.08)' }}
          >
            <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: creamMuted }} />
            <span className="text-xs font-semibold" style={{ color: creamMuted }}>Agra's #1 Sports & Dining destination</span>
          </div>
          <a href="/book" onClick={close} className="block w-full">
            <button
              className="w-full py-3.5 rounded-2xl text-sm font-bold font-display uppercase tracking-wide transition-all active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(242,235,220,0.14) 0%, rgba(242,235,220,0.07) 100%)',
                border: '1px solid rgba(242,235,220,0.20)',
                boxShadow: '0 1px 0 rgba(242,235,220,0.10) inset, 0 8px 24px rgba(1,13,0,0.4)',
                color: cream,
              }}
            >
              Book a Court Slot
            </button>
          </a>
        </div>
      </div>
    </>
  );
}
