"use client"

import * as React from "react"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Twitter, 
  Dribbble, 
  Globe 
} from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-neutral-900 bg-black pt-10 pb-16 md:pb-20 px-4 md:px-8 lg:px-16 z-10 relative overflow-hidden">
      {/* Centered Content Wrapper */}
      <div className="max-w-7xl mx-auto w-full flex flex-col space-y-8 relative z-10">
        
        {/* Top Section: columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* Brand Col (5 columns) */}
          <div className="lg:col-span-5 flex flex-col space-y-3.5">
            <a href="/" className="flex items-center space-x-2.5 group w-fit">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand-court to-brand-court-dark shadow-md shadow-palm-leaf-500/20">
                <span className="text-base font-bold font-display text-white italic">P</span>
              </div>
              <span className="text-lg font-extrabold tracking-tight font-display text-white">
                THE PADDLE <span className="text-brand-court">CLUB</span>
              </span>
            </a>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
              Agra's premier sports club featuring professional-grade pickleball courts, high-end indoor badminton facilities, and artisan dining at Cafe Brio. Play, dine, and socialize in a luxury environment.
            </p>
          </div>

          {/* About Us (2 columns) */}
          <div className="lg:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wide">About Us</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {["Our Story", "Meet the Coaches", "Careers", "Membership"].map((item) => (
                <li key={item}>
                  <a href="/#about" className="text-slate-400 hover:text-white hover:underline transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpful Links (2 columns) */}
          <div className="lg:col-span-2 flex flex-col space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wide">Helpful Links</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              {["FAQs", "Court Policies", "Cafe Menu", "Corporate Events"].map((item) => {
                let link = "/#about"
                if (item === "Court Policies") link = "/courts"
                if (item === "Cafe Menu") link = "/cafe"
                if (item === "Corporate Events") link = "/corporate"
                return (
                  <li key={item}>
                    <a href={link} className="text-slate-400 hover:text-white hover:underline transition-all">
                      {item}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Us (3 columns) */}
          <div className="lg:col-span-3 flex flex-col space-y-3.5">
            <h4 className="text-white font-bold text-xs uppercase tracking-wide">Contact Us</h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-slate-400">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-brand-court flex-shrink-0" />
                <a href="mailto:hello@paddleclub.in" className="hover:text-white hover:underline transition-all">
                  hello@paddleclub.in
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-brand-court flex-shrink-0" />
                <a href="tel:+919105551007" className="hover:text-white transition-all">
                  +91 91055 51007
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-brand-court flex-shrink-0 mt-0.5" />
                <span>Bankey Bihari Dham, 100 Feet Rd, DayalBagh, Agra</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="w-full h-px bg-neutral-900" />

        {/* Bottom Section: socials & copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-1">
          
          {/* Social Icons */}
          <div className="flex items-center space-x-3.5">
            {[
              { icon: Facebook, href: "https://facebook.com" },
              { icon: Instagram, href: "https://instagram.com" },
              { icon: Twitter, href: "https://twitter.com" },
              { icon: Globe, href: "https://paddleclub.in" },
              { icon: Dribbble, href: "https://dribbble.com" }
            ].map((soc, i) => {
              const IconComp = soc.icon
              return (
                <a 
                  key={i} 
                  href={soc.href} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-7 h-7 rounded-full border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-court/40 transition-all hover:scale-105"
                >
                  <IconComp className="w-3.5 h-3.5" />
                </a>
              )
            })}
          </div>

          {/* Copyright */}
          <span className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} The Paddle Club. All rights reserved.
          </span>

        </div>

      </div>

      {/* Giant Outlined Background Text (Bound to bottom-0 to prevent flex scroll overflow gap) */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none select-none z-0 overflow-hidden flex justify-center items-end h-32 sm:h-48 md:h-64">
        <span className="text-transparent font-display font-extrabold uppercase tracking-[0.12em] text-[15vw] sm:text-[18vw] leading-none opacity-[0.03] select-none pointer-events-none [-webkit-text-stroke:1px_rgb(var(--color-cafe-bg)/0.15)]">
          PADDLE
        </span>
      </div>
    </footer>
  )
}
