"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Smartphone, Globe, Sparkles, CheckCircle2, ArrowRight, Download } from "lucide-react"

interface BookingCTAProps {
  type: "courts" | "cafe" | "corporate"
}

export default function BookingCTA({ type }: BookingCTAProps) {
  const isCourts = type === "courts"
  const isCafe = type === "cafe"
  const isCorporate = type === "corporate"

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [isInstallable, setIsInstallable] = React.useState(false)

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const handlePWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === "accepted") {
        setDeferredPrompt(null)
        setIsInstallable(false)
      }
    } else {
      // Fallback instruction modal or alert
      alert(
        "To install our Progressive Web App (PWA):\n\n" +
        "• On iOS (Safari): Tap the Share button [⎙] in the toolbar, scroll down and select 'Add to Home Screen'.\n\n" +
        "• On Android / Chrome: Tap the three dots menu icon at the top right, and choose 'Install App' or 'Add to Home screen'."
      )
    }
  }

  // Theme styling based on type
  const theme = {
    badge: isCourts ? "text-brand-court" : isCafe ? "text-amber-500" : "text-blue-500",
    border: isCourts ? "hover:border-lime-500/30" : isCafe ? "hover:border-amber-500/30" : "hover:border-blue-500/30",
    glow: isCourts ? "bg-brand-court/10" : isCafe ? "bg-amber-500/10" : "bg-blue-500/10",
    button: isCourts 
      ? "bg-brand-court hover:bg-lime-400 text-neutral-950 font-bold" 
      : isCafe 
      ? "bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold" 
      : "bg-blue-600 hover:bg-blue-500 text-white font-bold",
    accentText: isCourts ? "text-brand-court" : isCafe ? "text-amber-400" : "text-blue-400",
    accentBorder: isCourts ? "border-brand-court/20" : isCafe ? "border-amber-500/20" : "border-blue-500/20"
  }

  // PWA benefits with PWA-specific advantages
  const pwaBenefits = [
    "0 MB Storage: Install instantly in 1 click without app store downloads or updates.",
    "Full Offline Utility: View your court check-in passes, reservation receipts, and matches without internet.",
    "Real-time Push Alerts: Direct home screen push notifications for matching invites & food preparation.",
    "Add to Home Screen: Standard native app launch shortcut right on your mobile grid."
  ]

  const webBookingUrl = isCorporate ? "/book-corporate" : `/book?type=${type}`

  return (
    <section className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pb-28 pt-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-brand-dark-border/40 bg-gradient-to-br from-brand-dark-card/60 via-brand-dark-card/20 to-neutral-950/20 p-6 md:p-12 xl:p-14"
      >
        {/* Decorative background glow */}
        <div className={`absolute -right-24 -top-24 w-96 h-96 rounded-full blur-[100px] pointer-events-none ${theme.glow}`} />

        <div className="flex flex-col space-y-2 mb-10">
          <span className={`text-micro font-bold uppercase tracking-eyebrow ${theme.badge}`}>
            Reservation Hub
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Book Your Session
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl">
            Choose how you would like to book. Install our Progressive Web App (PWA) instantly for offline passes and alerts, or complete reservation via our web portal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card 1: Install PWA Mobile App */}
          <div className={`lg:col-span-7 flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-neutral-950/60 border border-neutral-900/60 backdrop-blur-md transition-all duration-500 relative overflow-hidden group ${theme.border}`}>
            {/* Ambient inner glow */}
            <div className={`absolute -left-12 -bottom-12 w-48 h-48 rounded-full blur-3xl opacity-30 ${theme.glow}`} />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${theme.glow} border ${theme.accentBorder}`}>
                  <Smartphone className={`w-5 h-5 ${theme.accentText}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    Instant App Install (PWA) <Sparkles className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  </h3>
                  <p className="text-sm text-slate-400">Unlock PWA benefits & receive 15% off first court play</p>
                </div>
              </div>

              {/* App Benefits List */}
              <div className="space-y-3.5 pt-2">
                {pwaBenefits.map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3 text-sm text-slate-300">
                    <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${theme.accentText}`} />
                    <span className="leading-normal">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PWA Installation Triggers */}
            <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-6 pt-8 mt-6 border-t border-neutral-900/40">
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <button
                  onClick={handlePWAInstall}
                  className={`py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2.5 transition-all duration-300 text-xs font-display font-extrabold uppercase tracking-wide ${theme.button}`}
                >
                  <Download className="w-4 h-4" />
                  <span>{isInstallable ? "Install App Now" : "Install Guide & Help"}</span>
                </button>
                
                {/* Micro OS Badges/Guides */}
                <div className="flex items-center space-x-3 text-micro text-slate-500 font-semibold tracking-wide uppercase">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> iOS Safari: Tap Share → Add
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" /> Android Chrome: Tap Install
                  </span>
                </div>
              </div>

              {/* PWA Installation QR Code */}
              <div className="hidden sm:flex items-center space-x-3.5 bg-neutral-950 p-3 rounded-2xl border border-neutral-900/60 ml-auto">
                <div className="w-14 h-14 bg-white/5 rounded-xl border border-white/10 flex flex-wrap p-1.5 gap-0.5 items-center justify-center relative group-hover:bg-white/10 transition-colors">
                  {/* PWA QR Dots pattern */}
                  {Array.from({ length: 49 }).map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-[4px] h-[4px] rounded-[1px] ${
                        idx % 4 === 0 || idx % 5 === 0 
                          ? isCourts 
                            ? "bg-lime-400" 
                            : isCafe 
                            ? "bg-amber-400" 
                            : "bg-blue-400"
                          : "bg-neutral-800"
                      }`} 
                    />
                  ))}
                  <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[0.5px]" />
                </div>
                <div className="text-left">
                  <span className="text-micro font-bold text-white block">Scan PWA QR</span>
                  <span className="text-micro text-slate-500 block uppercase tracking-wide mt-0.5">Install on iOS/Android</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Web Booking Page */}
          <div className={`lg:col-span-5 flex flex-col justify-between p-6 md:p-8 rounded-2xl bg-neutral-950/60 border border-neutral-900/60 backdrop-blur-md transition-all duration-500 relative overflow-hidden group ${theme.border}`}>
            {/* Ambient inner glow */}
            <div className={`absolute -right-12 -top-12 w-48 h-48 rounded-full blur-3xl opacity-20 ${theme.glow}`} />

            <div className="relative z-10 space-y-5">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${theme.glow} border ${theme.accentBorder}`}>
                  <Globe className={`w-5 h-5 ${theme.accentText}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Continue via Web</h3>
                  <p className="text-sm text-slate-400">Reserve slots instantly in your browser</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                Prefer to book online? Access our web interface to secure courts, dining spots, or submit RFP proposals in a few simple steps.
              </p>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-neutral-900/40">
              <Link href={webBookingUrl} className="block w-full">
                <button className={`w-full py-4 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 text-xs font-display font-extrabold uppercase tracking-wide ${theme.button}`}>
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
