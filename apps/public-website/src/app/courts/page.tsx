"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"
import BookingCTA from "../../components/BookingCTA"
import { 
  Activity, 
  Clock, 
  Coins, 
  ArrowRight,
  ShieldCheck
} from "lucide-react"

const COURTS_DATA = [
  {
    id: "pickleball",
    name: "Pickleball Arena",
    category: "PICKLEBALL",
    type: "OUTDOOR",
    tagline: "Experience elite outdoor play on our professional pro-acrylic cushioned surface. Designed for high bounce consistency and low joint impact.",
    badge: "Championship Surface",
    price: "₹ 600",
    facilities: "1 Facility Available",
    surface: "Pro-Acrylic Cushion",
    lighting: "High-Lux Anti-Glare Floodlights",
    capacity: "2 - 4 Players",
    schedule: "6:00 AM - 11:00 PM",
    rating: "4.9 (120+ reviews)",
    image: "/court1.png",
    accentColor: "lime",
    badgeClass: "bg-lime-500/10 text-lime-400 border-lime-500/20",
    btnClass: "bg-lime-500 hover:bg-lime-400 text-brand-dark shadow-lime-500/20",
    textColor: "text-lime-400",
    borderColor: "border-lime-500/30"
  },
  {
    id: "skyball",
    name: "Skyball Arena",
    category: "SKYBALL",
    type: "OUTDOOR",
    tagline: "Agra's first suspended tile court. Built with interlocking modular flooring that absorbs shock and ensures rapid player response and safety.",
    badge: "High Impact & Speed",
    price: "₹ 700",
    facilities: "1 Facility Available",
    surface: "Suspended Modular Tiles",
    lighting: "Uniform LED Spotlight Array",
    capacity: "2 - 4 Players",
    schedule: "6:00 AM - 11:00 PM",
    rating: "4.8 (85+ reviews)",
    image: "/court2.png",
    accentColor: "sky",
    badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    btnClass: "bg-sky-500 hover:bg-sky-400 text-brand-dark shadow-sky-500/20",
    textColor: "text-sky-400",
    borderColor: "border-sky-500/30"
  },
  {
    id: "badminton",
    name: "Badminton Hall",
    category: "BADMINTON",
    type: "INDOOR",
    tagline: "Play on BWF-certified flooring featuring a kiln-dried teakwood sleeper base and non-slip PVC mats. Tall high-roof ventilation for true shuttle flight.",
    badge: "BWF Approved Court",
    price: "₹ 500",
    facilities: "3 Facilities Available",
    surface: "Teakwood Sleeper + PVC Mat",
    lighting: "Indirect Sideline LED",
    capacity: "2 - 4 Players",
    schedule: "5:00 AM - 11:00 PM",
    rating: "5.0 (210+ reviews)",
    image: "/court3.png",
    accentColor: "rose",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    btnClass: "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/30"
  }
]

interface CourtCardProps {
  court: typeof COURTS_DATA[0]
  onBook: () => void
  isFullWidth: boolean
}

const CourtCard: React.FC<CourtCardProps> = ({ court, onBook, isFullWidth }) => {
  // Split name for stylized bold text: e.g. "Pickleball Arena" -> "Pickleball" + "Arena"
  const nameParts = court.name.split(" ")
  const firstWord = nameParts[0]
  const secondWord = nameParts.slice(1).join(" ")

  return (
    <div className="w-full mb-8">
      {/* 1. Spaced-out uppercase tagline above the card */}
      <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold text-slate-500 mb-4 block pl-1">
        {court.category} &bull; {court.type}
      </span>

      {/* 2. Main card container */}
      <div className={`relative flex flex-col ${isFullWidth ? "md:flex-row" : "xl:flex-row"} items-stretch w-full rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900 shadow-2xl group`}>
        {/* Left Side: Vertical image */}
        <div className={`relative w-full ${isFullWidth ? "md:w-[42%]" : "xl:w-[45%]"} min-h-[280px] ${isFullWidth ? "md:min-h-[440px]" : "xl:min-h-[380px]"} overflow-hidden flex-shrink-0`}>
          <img 
            src={court.image} 
            alt={court.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
          />
          <div className={`absolute inset-0 ${isFullWidth ? "bg-gradient-to-t md:bg-gradient-to-r" : "bg-gradient-to-t xl:bg-gradient-to-r"} from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none`} />
          
          <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-neutral-950/80 border border-neutral-800 text-slate-300 backdrop-blur-md">
            {court.badge}
          </span>
        </div>

        {/* Right Side: Content Area */}
        <div className={`w-full ${isFullWidth ? "md:w-[58%]" : "xl:w-[55%]"} p-6 md:p-10 xl:p-12 flex flex-col justify-start ${isFullWidth ? "md:justify-center" : "xl:justify-center"} relative bg-neutral-950`}>
          
          {/* Title — no straddle for full-width card, straddle only for half-width */}
          <h3 className={`text-3xl ${isFullWidth ? "md:text-5xl lg:text-6xl" : "md:text-4xl xl:text-5xl"} font-display font-light text-white tracking-tight leading-none mb-6 ${isFullWidth ? "" : "xl:ml-[-22%]"} z-20 relative drop-shadow-md`}>
            {firstWord} <span className="font-extrabold text-white">{secondWord}</span>
          </h3>

          {/* Button + Description & Specs row */}
          <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 ${isFullWidth ? "" : "xl:ml-[-22%]"} z-20 relative`}>
            
            {/* Straddling Circle Arrow Button */}
            <button
              onClick={onBook}
              className="w-14 h-14 rounded-full border border-slate-700 bg-neutral-950 hover:bg-white hover:text-neutral-950 flex items-center justify-center text-white hover:border-white transition-all duration-300 flex-shrink-0 shadow-2xl group/btn"
            >
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {/* Description and metadata */}
            <div className="flex-1 min-w-0">
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-md">
                {court.tagline}
              </p>
              
              {/* Quick specs grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-4 border-t border-neutral-900 pt-4 text-[9px] uppercase tracking-widest text-slate-500 font-semibold">
                <div>
                  <span className="text-slate-600 block text-[8px]">FACILITY RATE</span>
                  <span className="text-white font-bold">{court.price} / hr</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[8px]">SESSIONS</span>
                  <span className="text-brand-court font-bold">{court.facilities}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[8px]">FLOOR SYSTEM</span>
                  <span className="text-slate-300 font-bold">{court.surface}</span>
                </div>
                <div>
                  <span className="text-slate-600 block text-[8px]">LIGHT INTENSITY</span>
                  <span className="text-slate-300 font-bold">{court.lighting}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default function CourtsPage() {
  const router = useRouter()

  const handleCourtBookClick = (courtId: string) => {
    router.push(`/book?type=courts&courtId=${courtId}`)
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <div className="w-full flex-1 flex flex-col bg-brand-dark relative">
        {/* Background Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.08)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.05)_0%,transparent_65%)] pointer-events-none" />

        {/* Fixed Navigation */}
        <Navbar />

      {/* Banner / Header Area */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 text-brand-court font-semibold tracking-wider text-xs md:text-sm uppercase mb-4"
        >
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Professional Arenas</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-none mb-6"
        >
          Our Elite Playfields
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-slate-400 text-xs md:text-sm leading-relaxed"
        >
          Book state-of-the-art playing fields in Agra. Kiln-dried wood subfloors, professional cushion layers, and non-glare LED spot setups.
        </motion.p>
      </section>

      {/* List of Court Cards in a 2-in-a-row then 1 layout */}
      <section className="pb-24 w-full px-4 md:px-8 lg:px-12 xl:px-16">
        {/* Row 1: 2 cards side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CourtCard 
            court={COURTS_DATA[0]} 
            onBook={() => handleCourtBookClick(COURTS_DATA[0].id)} 
            isFullWidth={false}
          />
          <CourtCard 
            court={COURTS_DATA[1]} 
            onBook={() => handleCourtBookClick(COURTS_DATA[1].id)} 
            isFullWidth={false}
          />
        </div>
        
        {/* Row 2: 1 card full width */}
        <div className="w-full">
          <CourtCard 
            court={COURTS_DATA[2]} 
            onBook={() => handleCourtBookClick(COURTS_DATA[2].id)} 
            isFullWidth={true}
          />
        </div>
      </section>

      {/* Unified Booking Desk Section */}
      <BookingCTA type="courts" />

      {/* Rules & General policies banner */}
      <section className="bg-brand-dark-card/30 border-t border-brand-dark-border/40 py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-brand-court font-semibold text-sm uppercase">
              <ShieldCheck className="w-5 h-5" />
              <span>Safety & Gear</span>
            </div>
            <h4 className="text-xl font-bold font-display text-white">Non-Marking Shoes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              To keep our professional athletic floors pristine, clean non-marking indoor shoes are strictly mandatory. Gear rental packages (rackets, shuttles, balls) are available at the counter.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-brand-court font-semibold text-sm uppercase">
              <Clock className="w-5 h-5" />
              <span>Timings & Slots</span>
            </div>
            <h4 className="text-xl font-bold font-display text-white">60-Min Sessions</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All bookings are allocated in fixed 60-minute blocks. Please report to the check-in desk 10 minutes prior to your slot time. Extensions depend on real-time court availability.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2 text-brand-court font-semibold text-sm uppercase">
              <Coins className="w-5 h-5" />
              <span>Rescheduling</span>
            </div>
            <h4 className="text-xl font-bold font-display text-white">Cancellation Policy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bookings are non-refundable but can be fully rescheduled to any other open slot up to 6 hours before the reserved session time via your booking panel.
            </p>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </main>
  )
}
