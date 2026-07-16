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
  title: 'The Paddle Club | Owner Portal',
  description: 'Manage court bookings, Cafe Brio menu, and WhatsApp automations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${displayFont.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-brand-dark text-slate-100">
        {children}
      </body>
    </html>
  );
}
