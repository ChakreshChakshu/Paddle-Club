"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"
import BookingCTA from "../../components/BookingCTA"
import { 
  Building2, 
  Trophy, 
  UtensilsCrossed, 
  ArrowRight
} from "lucide-react"

const EVENT_PACKAGES = [
  {
    icon: Trophy,
    title: "Corporate Tournament Takeover",
    description: "Full booking of our Pickleball, Skyball, and Badminton courts. Includes official tournament referees, scoreboard management, and custom champion trophies.",
    highlight: "Best for Team Bonding"
  },
  {
    icon: UtensilsCrossed,
    title: "Play & Dine Executive Mixer",
    description: "Combine court sessions with premium reserved dining decks at Cafe Brio. Custom-tailored catering menus ranging from high-protein lunch bowls to gourmet sit-down dinners.",
    highlight: "Premium Catering Included"
  },
  {
    icon: Building2,
    title: "Custom Brand & Networking Events",
    description: "Launch your sports brand or host a networking meet. High-visibility logo branding spots, sound systems, professional photography, and active media coordination.",
    highlight: "Bespoke Corporate Setup"
  }
]

export default function CorporateBookingPage() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <div className="w-full flex-1 flex flex-col bg-brand-dark relative">
        {/* Background Glows (Blue/Indigo theme) */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.04)_0%,transparent_65%)] pointer-events-none" />

        <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 text-blue-500 font-semibold tracking-wider text-xs md:text-sm uppercase mb-4"
        >
          <Building2 className="w-4 h-4 text-blue-500" />
          <span>Executive Tournaments & Socials</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-none mb-6"
        >
          Corporate Bookings
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-slate-400 text-xs md:text-sm leading-relaxed mb-8"
        >
          Elevate your team events at Agra's premier sports club. Host bespoke team-building tournaments, product launch socials, and networking meets backed by professional coordination and gourmet catering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => router.push("/book-corporate")}
            className="px-8 py-4 rounded-full font-display font-extrabold uppercase tracking-wider text-xs bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-2"
          >
            <span>Request Event Proposal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Package Offerings */}
      <section className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pb-24">
        <div className="flex flex-col space-y-2 mb-12 text-center items-center">
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.25em]">Event Formats</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display text-white">Elite Corporate Packages</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {EVENT_PACKAGES.map((pkg, i) => {
            const IconComponent = pkg.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-brand-dark-card border border-brand-dark-border/40 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold font-display text-white tracking-tight">{pkg.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{pkg.description}</p>
                </div>

                <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">FEATURES</span>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">{pkg.highlight}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Interactive Request RFP Form */}
      <BookingCTA type="corporate" />

      {/* Policies / Customization details */}
      <section className="bg-brand-dark-card/30 border-t border-brand-dark-border/40 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-400">
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-bold font-display text-white">Court Layouts & Capacities</h4>
            <p>Our facility holds up to 150 guests simultaneously across our pickleball, skyball, and indoor badminton court spaces, supporting custom scheduling formats.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-bold font-display text-white">Event Support Services</h4>
            <p>Dedicated tournament directors handle brackets seeding, timing, and player refereeing to deliver professional-grade tournaments for your teams.</p>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </main>
  )
}
