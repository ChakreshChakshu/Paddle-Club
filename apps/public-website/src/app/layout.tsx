import type { Metadata } from 'next';
import React from 'react';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "The Paddle Club | Agra's Premium Pickleball & Social Destination",
  description: "Experience Agra's most aesthetic pickleball courts and Cafe Brio open-air dining. Play, dine, and socialise at DayalBagh, Agra.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${displayFont.variable}`}>
      <body className="font-sans antialiased min-h-screen text-slate-100">
        <div className="w-full min-h-screen overflow-x-clip relative">
          {children}
        </div>
      </body>
    </html>
  );
}
