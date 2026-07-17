"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"
import { 
  User, 
  Phone, 
  Mail, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Briefcase
} from "lucide-react"

export default function BookCorporatePage() {
  const router = useRouter()

  const [companyName, setCompanyName] = React.useState<string>("")
  const [contactName, setContactName] = React.useState<string>("")
  const [email, setEmail] = React.useState<string>("")
  const [phone, setPhone] = React.useState<string>("")
  const [headcount, setHeadcount] = React.useState<string>("10-25 Guests")
  const [eventType, setEventType] = React.useState<string>("Corporate Tournament")
  const [eventDate, setEventDate] = React.useState<string>("")
  const [duration, setDuration] = React.useState<string>("Half Day (4 hrs)")
  const [catering, setCatering] = React.useState<string>("Yes (Cafe Brio Buffet)")
  const [showToast, setShowToast] = React.useState<boolean>(false)

  const handleRFPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName || !contactName || !email || !phone || !eventDate) {
      alert("Please fill in all required fields.")
      return
    }
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      router.push("/corporate")
    }, 4500)
  }

  return (
    <main className="relative min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <div className="w-full flex-1 flex flex-col bg-brand-dark relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,transparent_65%)] pointer-events-none" />
        
        <Navbar />

        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pt-32 pb-24 relative z-10 flex-1 flex flex-col">
          {/* Back button */}
          <button 
            onClick={() => router.push("/corporate")}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8 self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Corporate Events</span>
          </button>

          {/* Header */}
          <div className="flex flex-col space-y-2 mb-10">
            <span className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.25em]">
              Bespoke Event Desk
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              Request RFP Proposal
            </h1>
            <p className="text-slate-400 text-xs md:text-sm max-w-xl">
              Provide basic headcount, preferred schedule date, and catering details to receive a custom executive estimate.
            </p>
          </div>

          {/* Main split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch flex-1">
            {/* Left: Form */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Company Name
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Corporation"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Contact Person Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone number (+91)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Estimated Guests
                  </label>
                  <select
                    value={headcount}
                    onChange={(e) => setHeadcount(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="10-25 Guests">10 - 25 Guests</option>
                    <option value="25-50 Guests">25 - 50 Guests</option>
                    <option value="50-100 Guests">50 - 100 Guests</option>
                    <option value="100+ Exclusive">100+ Exclusive Takeover</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Event Type Format
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  >
                    <option value="Corporate Tournament">Corporate Tournament</option>
                    <option value="Play & Dine Mixer">Play & Dine Mixer</option>
                    <option value="Brand Launch Social">Brand Launch Social</option>
                    <option value="Custom Event">Custom Event</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Preferred Event Date
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Reservation Duration
                  </label>
                  <div className="flex space-x-3">
                    {["Half Day (4 hrs)", "Full Day (8 hrs)"].map((dur) => {
                      const isSelected = duration === dur
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setDuration(dur)}
                          className={`flex-1 py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all duration-300 ${
                            isSelected 
                              ? "border-blue-500 bg-blue-500/10 text-blue-400"
                              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950"
                          }`}
                        >
                          {dur}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Cafe Brio Catering Requested
                  </label>
                  <div className="flex space-x-3">
                    {["Yes (Cafe Brio Buffet)", "No Catering Required"].map((cat) => {
                      const isSelected = catering === cat
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCatering(cat)}
                          className={`flex-1 py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all duration-300 ${
                            isSelected 
                              ? "border-blue-500 bg-blue-500/10 text-blue-400"
                              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950"
                          }`}
                        >
                          {cat.split(" ")[0]}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary Invoice Card */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div className="border border-brand-dark-border/40 rounded-3xl p-6 bg-neutral-950/60 backdrop-blur-md text-xs space-y-5 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-neutral-900/60">
                    <div>
                      <span className="text-[8px] text-slate-500 block uppercase tracking-widest font-bold">RFP PROPOSAL FOR</span>
                      <h4 className="font-extrabold font-display text-white text-base mt-0.5">{companyName || "Your Company"}</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase border border-blue-500/20 text-blue-400 bg-blue-500/10">
                      Corporate
                    </span>
                  </div>

                  <div className="space-y-3 pb-4 border-b border-neutral-900/60 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Event Format</span>
                      <span className="font-bold text-white text-right">{eventType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Preferred Date</span>
                      <span className="font-bold text-white">{eventDate || "Select Date"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Duration</span>
                      <span className="font-bold text-white">{duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Headcount</span>
                      <span className="font-bold text-white">{headcount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Brio Food</span>
                      <span className="font-bold text-white text-right">{catering.includes("Yes") ? "Requested" : "None"}</span>
                    </div>
                  </div>

                  <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10 text-[10px] text-slate-400 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>Our event directors review RFP inquiries and issue formal proposals within 2 hours.</span>
                  </div>
                </div>

                <form onSubmit={handleRFPSubmit} className="pt-6">
                  <button
                    type="submit"
                    disabled={!companyName || !contactName || !email || !phone || !eventDate}
                    className={`w-full py-4 rounded-2xl font-display font-extrabold uppercase tracking-wider text-xs transition-all flex items-center justify-center space-x-2 ${
                      companyName && contactName && email && phone && eventDate
                        ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/20 cursor-pointer' 
                        : 'bg-neutral-900 text-slate-600 border border-neutral-850 cursor-not-allowed'
                    }`}
                  >
                    <span>Submit Proposal Inquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-dark border border-neutral-800/80 p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-40 bg-blue-500" />

              <div className="mx-auto w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-900">
                <CheckCircle2 className="w-8 h-8 text-blue-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold font-display text-white">Proposal Request Sent!</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We have received your RFP request for {companyName}. An event hosting specialist will contact you at {email} within 2 hours with customized plans.
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-[10px] text-slate-500">
                <span>RFP Ref: RFP-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span>The Paddle Club Agra</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
