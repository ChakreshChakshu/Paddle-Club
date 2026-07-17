"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Navbar } from "../../components/Navbar"
import { Footer } from "../../components/Footer"
import BookingCTA from "../../components/BookingCTA"
import { 
  Coffee, 
  ArrowRight
} from "lucide-react"

const SIGNATURE_DISHES = [
  {
    id: "avocado-toast",
    name: "Brio Sourdough Avocado Toast",
    category: "SIGNATURE BRUNCH",
    description: "Artisan toasted sourdough loaded with fresh hand-mashed avocado, organic poached eggs, garden microgreens, and micro-herbs. Served with our house special berry puree.",
    price: "₹ 380",
    tag: "High Protein",
    image: "/cafe_dish.png"
  },
  {
    id: "protein-bowl",
    name: "Matchpoint Protein Bowl",
    category: "RECOVERY MEAL",
    description: "Flame-grilled chicken breast or paneer, organic quinoa, roasted sweet potatoes, avocado slices, and edamame dressed in a light toasted sesame ginger vinaigrette.",
    price: "₹ 420",
    tag: "Post-Workout Fuel",
    image: "/court4.png" // Using court image as placeholder or alternative asset
  },
  {
    id: "cold-brew",
    name: "Nitro Cascara Cold Brew",
    category: "ARTISAN BEVERAGE",
    description: "Slow-dripped nitro cold brew infused with organic sweet cascara syrup and a light touch of heavy foam. The perfect pre-match energy boost.",
    price: "₹ 240",
    tag: "Clean Energy",
    image: "/cafe_interior.png" // Using cafe image as placeholder
  }
]

const GALLERY_PHOTOS = [
  { src: "/cafe_interior.png", alt: "Cafe Brio Luxurious Lounge", size: "col-span-2 row-span-2" },
  { src: "/unnamed(14).webp", alt: "Artisan Coffee Setup", size: "col-span-1 row-span-1" },
  { src: "/unnamed(18).webp", alt: "Gourmet Dining Setup", size: "col-span-1 row-span-1" },
  { src: "/unnamed(21).webp", alt: "Post-Match Social Gathering", size: "col-span-2 row-span-1" }
]

export default function CafePage() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen flex flex-col bg-black text-slate-100 font-sans">
      <div className="w-full flex-1 flex flex-col bg-brand-dark relative">
        {/* Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.06)_0%,transparent_65%)] pointer-events-none" />
        <div className="absolute bottom-0 right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.04)_0%,transparent_65%)] pointer-events-none" />

        <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center space-x-2 text-amber-500 font-semibold tracking-wider text-xs md:text-sm uppercase mb-4"
        >
          <Coffee className="w-4 h-4 text-amber-500" />
          <span>Gourmet Social Dining</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold font-display text-white tracking-tight leading-none mb-6"
        >
          Cafe Brio
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-slate-400 text-xs md:text-sm leading-relaxed mb-8"
        >
          Agra's premium sports-dining destination. Offering crafted specialty coffees, highly nutritional recovery protein bowls, and artisan brunches in a luxury lounge.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button
            onClick={() => router.push("/book?type=cafe")}
            className="px-8 py-4 rounded-full font-display font-extrabold uppercase tracking-wider text-xs bg-amber-500 hover:bg-amber-400 text-brand-dark shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
          >
            <span>Reserve a Table</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* Beautiful Photo Gallery */}
      <section className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pb-24">
        <div className="flex flex-col space-y-2 mb-8">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.25em]">Visual Gallery</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display text-white">Lounge & Vibe</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[220px]">
          {GALLERY_PHOTOS.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl overflow-hidden border border-neutral-900 shadow-xl group ${photo.size}`}
            >
              <img 
                src={photo.src} 
                alt={photo.alt}
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-6">
                <span className="text-xs font-bold text-white tracking-wide">{photo.alt}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Signature Dishes Section */}
      <section className="w-full px-4 md:px-8 lg:px-12 xl:px-16 pb-24">
        <div className="flex flex-col space-y-2 mb-10">
          <span className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.25em]">The Kitchen Selection</span>
          <h2 className="text-2xl md:text-4xl font-extrabold font-display text-white">Signature Offerings</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SIGNATURE_DISHES.map((dish, i) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-brand-dark-card border border-brand-dark-border/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-extrabold tracking-wider uppercase px-3 py-1 rounded-full">
                    {dish.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                    {dish.category}
                  </span>
                  <h4 className="text-xl font-bold font-display text-white tracking-tight leading-tight">
                    {dish.name}
                  </h4>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                    {dish.description}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-900">
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">PRICE</span>
                  <span className="text-lg font-extrabold text-amber-400">{dish.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interactive Reservation Form */}
      <BookingCTA type="cafe" />

      {/* Rules & Info banner */}
      <section className="bg-brand-dark-card/30 border-t border-brand-dark-border/40 py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-400">
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-bold font-display text-white">Opening Hours</h4>
            <p>Mon - Sun: 7:00 AM - 11:30 PM</p>
            <p>Serving healthy pre-workout breakfast blends, high-protein social lunch plates, and gourmet organic coffee.</p>
          </div>
          <div className="flex flex-col space-y-2">
            <h4 className="text-sm font-bold font-display text-white">Corporate Luncheons & Gatherings</h4>
            <p>Planning a business mixer or corporate team tournament? Reserve our VIP dining deck and customize customized catering packages.</p>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </main>
  )
}
