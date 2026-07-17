"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"
import { 
  User, 
  Phone, 
  ArrowRight, 
  ArrowLeft,
  ChefHat,
  CheckCircle2
} from "lucide-react"

const COURTS_DATA = [
  {
    id: "pickleball",
    name: "Pickleball Arena",
    category: "PICKLEBALL",
    type: "OUTDOOR",
    price: "₹ 600",
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
    price: "₹ 700",
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
    price: "₹ 500",
    badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    btnClass: "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20",
    textColor: "text-rose-400",
    borderColor: "border-rose-500/30"
  }
]

const TIME_SLOTS = [
  { label: "06:00 AM - 07:00 AM", value: "06:00 AM" },
  { label: "07:00 AM - 08:00 AM", value: "07:00 AM" },
  { label: "08:00 AM - 09:00 AM", value: "08:00 AM" },
  { label: "09:00 AM - 10:00 AM", value: "09:00 AM" },
  { label: "10:00 AM - 11:00 AM", value: "10:00 AM" },
  { label: "04:00 PM - 05:00 PM", value: "04:00 PM" },
  { label: "05:00 PM - 06:00 PM", value: "05:00 PM" },
  { label: "06:00 PM - 07:00 PM", value: "06:00 PM" },
  { label: "07:00 PM - 08:00 PM", value: "07:00 PM" },
  { label: "08:00 PM - 09:00 PM", value: "08:00 PM" },
  { label: "09:00 PM - 10:00 PM", value: "09:00 PM" },
  { label: "10:00 PM - 11:00 PM", value: "10:00 PM" }
]

const CAFE_TIME_SLOTS = [
  "08:00 AM", "09:30 AM", "11:00 AM", "12:30 PM", "02:00 PM", 
  "04:00 PM", "05:30 PM", "07:00 PM", "08:30 PM", "10:00 PM"
]

function getNextDays() {
  const days = []
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' }
  const today = new Date()
  for (let i = 0; i < 5; i++) {
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + i)
    days.push({
      isoString: nextDay.toISOString().split("T")[0],
      formatted: nextDay.toLocaleDateString('en-US', options)
    })
  }
  return days
}

function BookingFormInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const typeParam = searchParams.get("type") || "courts"
  const courtParam = searchParams.get("courtId") || "pickleball"

  const [bookingType, setBookingType] = React.useState<"courts" | "cafe">(
    typeParam === "cafe" ? "cafe" : "courts"
  )

  // Court States
  const defaultCourt = COURTS_DATA.find((c) => c.id === courtParam) || COURTS_DATA[0]
  const [selectedCourt, setSelectedCourt] = React.useState(defaultCourt)
  const [courtDate, setCourtDate] = React.useState<string>("")
  const [courtTime, setCourtTime] = React.useState<string>("")
  const [courtName, setCourtName] = React.useState<string>("")
  const [courtPhone, setCourtPhone] = React.useState<string>("")

  // Cafe States
  const [partySize, setPartySize] = React.useState<string>("2 People")
  const [cafeDate, setCafeDate] = React.useState<string>("")
  const [cafeTime, setCafeTime] = React.useState<string>("")
  const [cafeName, setCafeName] = React.useState<string>("")
  const [cafePhone, setCafePhone] = React.useState<string>("")

  const [showToast, setShowToast] = React.useState<boolean>(false)

  // Sync with URL params on load
  React.useEffect(() => {
    if (typeParam === "cafe") {
      setBookingType("cafe")
    } else {
      setBookingType("courts")
      const matched = COURTS_DATA.find((c) => c.id === courtParam)
      if (matched) {
        setSelectedCourt(matched)
      }
    }
  }, [typeParam, courtParam])

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      // Redirect back to main page after some time
      router.push(bookingType === "courts" ? "/courts" : "/cafe")
    }, 4000)
  }

  const nextDays = getNextDays()

  // Dynamic Theme Colors
  const isCourts = bookingType === "courts"
  const accentText = isCourts ? selectedCourt.textColor : "text-amber-400"

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 xl:px-16 pt-32 pb-24 relative z-10 flex-1 flex flex-col">
      {/* Back button link */}
      <button 
        onClick={() => router.push(isCourts ? "/courts" : "/cafe")}
        className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-8 self-start"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to {isCourts ? "Arenas" : "Cafe"}</span>
      </button>

      {/* Header */}
      <div className="flex flex-col space-y-2 mb-10">
        <span className={`text-micro font-bold uppercase tracking-eyebrow ${accentText}`}>
          Unified Reservation Desk
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold font-display text-white tracking-tight">
          Secure Your Slot
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl">
          Complete your booking below. Choose between Court booking and Cafe table reservations.
        </p>
      </div>

      {/* Booking Mode Selector Tabs */}
      <div className="flex space-x-3 mb-10 max-w-md">
        <button
          type="button"
          onClick={() => setBookingType("courts")}
          className={`flex-1 py-3 px-4 rounded-xl border font-display font-extrabold uppercase tracking-wide text-xs transition-all duration-300 ${
            isCourts 
              ? "border-white bg-white text-brand-dark" 
              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800"
          }`}
        >
          Court Play
        </button>
        <button
          type="button"
          onClick={() => setBookingType("cafe")}
          className={`flex-1 py-3 px-4 rounded-xl border font-display font-extrabold uppercase tracking-wide text-xs transition-all duration-300 ${
            !isCourts 
              ? "border-white bg-white text-brand-dark" 
              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800"
          }`}
        >
          Cafe Table
        </button>
      </div>

      {/* Main split-screen container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch flex-1">
        {/* Left column: fields */}
        <div className="lg:col-span-8 space-y-8 flex flex-col justify-between">
          <div className="space-y-8">
            {isCourts ? (
              <>
                {/* Step 1: Arena Choice */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    1. Choose an Arena
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {COURTS_DATA.map((court) => {
                      const isSelected = selectedCourt.id === court.id
                      return (
                        <button
                          key={court.id}
                          type="button"
                          onClick={() => setSelectedCourt(court)}
                          className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                            isSelected 
                              ? `border-slate-300 bg-neutral-950 shadow-2xl`
                              : 'border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950/70'
                          }`}
                        >
                          {isSelected && (
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                              court.id === 'pickleball' ? 'from-lime-500 to-emerald-500' : court.id === 'skyball' ? 'from-sky-500 to-blue-500' : 'from-rose-500 to-rose-400'
                            }`} />
                          )}
                          <div>
                            <span className={`text-micro font-extrabold uppercase tracking-caps px-2 py-0.5 rounded-full border ${court.badgeClass} mb-3 inline-block`}>
                              {court.type}
                            </span>
                            <h4 className="font-bold font-display text-white text-sm tracking-tight">{court.name}</h4>
                          </div>
                          <div className="mt-4 pt-2 border-t border-neutral-900/50 flex justify-between items-center w-full">
                            <span className="text-micro text-slate-500 uppercase tracking-wide font-semibold">RATE</span>
                            <span className="text-xs font-extrabold text-white">{court.price}/hr</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 2: Date Selector */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    2. Select Play Date
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {nextDays.map((day) => {
                      const isSelected = courtDate === day.isoString
                      return (
                        <button
                          key={day.isoString}
                          type="button"
                          onClick={() => setCourtDate(day.isoString)}
                          className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                            isSelected 
                              ? `border-lime-500 bg-lime-500/10 ${selectedCourt.textColor}`
                              : 'border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950'
                          }`}
                        >
                          <span className="text-micro uppercase font-bold tracking-wide">{day.formatted.split(",")[0]}</span>
                          <span className="text-base font-extrabold mt-1">{day.formatted.split(" ")[2]}</span>
                          <span className="text-micro uppercase text-slate-500 font-semibold mt-0.5">{day.formatted.split(" ")[1]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 3: Time Slot Grid */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    3. Select Session Time
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = courtTime === slot.value
                      return (
                        <button
                          key={slot.value}
                          type="button"
                          onClick={() => setCourtTime(slot.value)}
                          className={`py-2.5 px-2 rounded-xl border text-center transition-all duration-300 text-micro font-bold ${
                            isSelected 
                              ? `border-lime-500 bg-lime-500/10 ${selectedCourt.textColor}`
                              : 'border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950'
                          }`}
                        >
                          {slot.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 4: Player Info */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    4. Player Contact Details
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Player full name"
                        value={courtName}
                        onChange={(e) => setCourtName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-court focus:ring-1 focus:ring-brand-court transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="Phone number (+91)"
                        value={courtPhone}
                        onChange={(e) => setCourtPhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-brand-court focus:ring-1 focus:ring-brand-court transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Step 1: Party Size */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    1. Party Size
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["2 People", "4 People", "6 People", "8+ Group"].map((size) => {
                      const isSelected = partySize === size
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setPartySize(size)}
                          className={`py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all duration-300 ${
                            isSelected 
                              ? "border-amber-500 bg-amber-500/10 text-amber-400"
                              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950"
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 2: Date Selector */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    2. Select Dining Date
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {nextDays.map((day) => {
                      const isSelected = cafeDate === day.isoString
                      return (
                        <button
                          key={day.isoString}
                          type="button"
                          onClick={() => setCafeDate(day.isoString)}
                          className={`py-3 px-1 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                            isSelected 
                              ? "border-amber-500 bg-amber-500/10 text-amber-400"
                              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950"
                          }`}
                        >
                          <span className="text-micro uppercase font-bold tracking-wide">{day.formatted.split(",")[0]}</span>
                          <span className="text-base font-extrabold mt-1">{day.formatted.split(" ")[2]}</span>
                          <span className="text-micro uppercase text-slate-500 font-semibold mt-0.5">{day.formatted.split(" ")[1]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 3: Time Slot Grid */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    3. Select Dining Time
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {CAFE_TIME_SLOTS.map((time) => {
                      const isSelected = cafeTime === time
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setCafeTime(time)}
                          className={`py-2.5 px-3 rounded-xl border text-center transition-all duration-300 text-xs font-bold ${
                            isSelected 
                              ? "border-amber-500 bg-amber-500/10 text-amber-400"
                              : "border-neutral-900 bg-neutral-950/40 text-slate-400 hover:border-neutral-800 hover:bg-neutral-950"
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Step 4: Contact details */}
                <div className="space-y-3.5">
                  <label className="block text-micro font-bold text-slate-500 uppercase tracking-caps">
                    4. Contact Details
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={cafeName}
                        onChange={(e) => setCafeName(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        placeholder="Phone number (+91)"
                        value={cafePhone}
                        onChange={(e) => setCafePhone(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right column: receipt info */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="border border-brand-dark-border/40 rounded-3xl p-6 bg-neutral-950/60 backdrop-blur-md text-sm space-y-5 flex flex-col justify-between h-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            
            {isCourts ? (
              <>
                <div className={`absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b ${
                  selectedCourt.id === 'pickleball' ? 'from-lime-500 to-emerald-500' : selectedCourt.id === 'skyball' ? 'from-sky-500 to-blue-500' : 'from-rose-500 to-rose-400'
                }`} />

                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-neutral-900/60">
                    <div>
                      <span className="text-micro text-slate-500 block uppercase tracking-caps font-bold">RESERVATION FOR</span>
                      <h4 className="font-extrabold font-display text-white text-base mt-0.5">{selectedCourt.name}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-micro font-extrabold uppercase border ${selectedCourt.badgeClass}`}>
                      {selectedCourt.type}
                    </span>
                  </div>

                  <div className="space-y-3 pb-4 border-b border-neutral-900/60 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Schedule Date</span>
                      <span className="font-bold text-white">{courtDate || "Select Date"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Session Time</span>
                      <span className="font-bold text-white">{courtTime || "Select Time"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Reservee</span>
                      <span className="font-bold text-white max-w-[120px] truncate text-right">{courtName || "Enter Name"}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1 text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Base rate / hr</span>
                      <span className="font-bold text-white">{selectedCourt.price}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>GST (18%)</span>
                      <span>₹ {(parseInt(selectedCourt.price.replace("₹ ", "")) * 0.18).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-white border-t border-neutral-900/60 pt-3 text-sm">
                      <span>Total Payable</span>
                      <span className={selectedCourt.textColor}>
                        ₹ {(parseInt(selectedCourt.price.replace("₹ ", "")) * 1.18).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="pt-6">
                  <button
                    type="submit"
                    disabled={!courtDate || !courtTime || !courtName || !courtPhone}
                    className={`w-full py-4 rounded-2xl font-display font-extrabold uppercase tracking-wide text-xs transition-all flex items-center justify-center space-x-2 ${
                      courtDate && courtTime && courtName && courtPhone 
                        ? `${selectedCourt.btnClass} cursor-pointer` 
                        : 'bg-neutral-900 text-slate-600 border border-neutral-850 cursor-not-allowed'
                    }`}
                  >
                    <span>Confirm & Pay Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500" />

                <div className="space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-neutral-900/60">
                    <div>
                      <span className="text-micro text-slate-500 block uppercase tracking-caps font-bold">RESERVATION AT</span>
                      <h4 className="font-extrabold font-display text-white text-base mt-0.5">Cafe Brio</h4>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-micro font-extrabold uppercase border border-amber-500/20 text-amber-400 bg-amber-500/10">
                      Gourmet
                    </span>
                  </div>

                  <div className="space-y-3 pb-4 border-b border-neutral-900/60 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Party Size</span>
                      <span className="font-bold text-white">{partySize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Dining Date</span>
                      <span className="font-bold text-white">{cafeDate || "Select Date"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Dining Time</span>
                      <span className="font-bold text-white">{cafeTime || "Select Time"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Reservee</span>
                      <span className="font-bold text-white max-w-[120px] truncate text-right">{cafeName || "Enter Name"}</span>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/10 text-micro text-slate-400 flex items-start space-x-2">
                    <ChefHat className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>No advance booking fees. Tables are held for 15 minutes past the slot reservation time.</span>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="pt-6">
                  <button
                    type="submit"
                    disabled={!cafeDate || !cafeTime || !cafeName || !cafePhone}
                    className={`w-full py-4 rounded-2xl font-display font-extrabold uppercase tracking-wide text-xs transition-all flex items-center justify-center space-x-2 ${
                      cafeDate && cafeTime && cafeName && cafePhone 
                        ? 'bg-amber-500 hover:bg-amber-400 text-brand-dark shadow-amber-500/20 cursor-pointer' 
                        : 'bg-neutral-900 text-slate-600 border border-neutral-850 cursor-not-allowed'
                    }`}
                  >
                    <span>Reserve My Table</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal / Toast Overlay */}
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
              {/* Top ambient glow */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[60px] pointer-events-none opacity-40 ${
                isCourts 
                  ? selectedCourt.id === 'pickleball' ? 'bg-lime-500' : selectedCourt.id === 'skyball' ? 'bg-sky-500' : 'bg-rose-500' 
                  : 'bg-amber-500'
              }`} />

              <div className="mx-auto w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center border border-neutral-900">
                <CheckCircle2 className={`w-8 h-8 ${accentText}`} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold font-display text-white">Booking Confirmed!</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {isCourts 
                    ? `Your slot at ${selectedCourt.name} has been secured for ${courtDate} at ${courtTime}. We look forward to seeing you on the arena.`
                    : `Your dining table for ${partySize} has been reserved for ${cafeDate} at ${cafeTime}. See you at Cafe Brio.`
                  }
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex justify-between items-center text-micro text-slate-500">
                <span>Confirmation ID: TPC-{Math.floor(100000 + Math.random() * 900000)}</span>
                <span>Agra, Uttar Pradesh</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BookingPage() {
  return (
    <main className="relative min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <div className="w-full flex-1 flex flex-col bg-brand-dark relative overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgb(var(--color-cafe-bg)/0.015)_0%,transparent_65%)] pointer-events-none" />
        
        <Navbar />

        <React.Suspense fallback={
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            Loading Reservation Desk...
          </div>
        }>
          <BookingFormInner />
        </React.Suspense>

        <Footer />
      </div>
    </main>
  )
}
