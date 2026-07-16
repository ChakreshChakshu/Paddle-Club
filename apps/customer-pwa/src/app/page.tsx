'use client';

import * as React from 'react';
import { isEnabled } from '@paddle-club/feature-flags';
import { Button, Card, CardContent } from '@paddle-club/ui';
import { Calendar, Coffee, User, Sparkles, MessageCircleCode } from 'lucide-react';

export default function CustomerPwaDashboard() {
  const [activeTab, setActiveTab] = React.useState<'courts' | 'cafe' | 'profile'>('courts');
  const [selectedCourt, setSelectedCourt] = React.useState<string>('');
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = React.useState<string>('');

  // Evaluate feature flags (since we are on client side, these read process.env/defaults)
  const isRestaurantEnabled = isEnabled('FEATURE_RESTAURANT_MENU_BOOKING');
  const isAiEnabled = isEnabled('FEATURE_AI_AUTOMATION');
  const isWhatsappEnabled = isEnabled('FEATURE_WHATSAPP_AUTOMATION');

  const courtsList = [
    { id: '1', name: 'Court A (Teal Signature)', type: 'Pickleball', price: 450 },
    { id: '2', name: 'Court B (Neon Signature)', type: 'Pickleball', price: 450 },
    { id: '3', name: 'Court C (Padel Elite)', type: 'Padel', price: 800 }
  ];

  const slotsList = [
    '07:00 AM - 08:00 AM',
    '08:00 AM - 09:00 AM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
    '08:00 PM - 09:00 PM',
    '09:00 PM - 10:00 PM',
    '10:00 PM - 11:00 PM'
  ];

  const menuItems = [
    { id: 'm1', name: 'Brio Specialty Latte', price: 180, category: 'Beverage' },
    { id: 'm2', name: 'Avocado Toast & Sourdough', price: 280, category: 'Snacks' },
    { id: 'm3', name: 'Pistachio Croissant', price: 160, category: 'Snacks' },
    { id: 'm4', name: 'Truffle Fries', price: 220, category: 'Snacks' }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Court reservation submitted!\nCourt: ${selectedCourt}\nDate: ${selectedDate}\nSlot: ${selectedSlot}`);
  };

  return (
    <main className="min-h-screen bg-brand-dark text-slate-100 flex flex-col max-w-md mx-auto border-x border-brand-dark-border shadow-2xl relative pb-20">
      
      {/* Top Navigation / Brand */}
      <header className="px-6 py-5 bg-brand-dark-card/50 border-b border-brand-dark-border sticky top-0 backdrop-blur-md z-10 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold font-display text-white">THE PADDLE CLUB</span>
          <p className="text-[10px] text-brand-court font-semibold tracking-widest uppercase">Member App</p>
        </div>
        
        {isAiEnabled && (
          <div className="flex items-center space-x-1 bg-teal-950/50 border border-teal-500/30 px-2 py-1 rounded-full text-teal-300 text-[10px] font-bold">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>AI Booking Active</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto">
        {activeTab === 'courts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Book a Court</h2>
              <p className="text-slate-400 text-xs">Reserve your pickleball or padel session</p>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              {/* Select Court */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Court</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {courtsList.map((court) => (
                    <div
                      key={court.id}
                      onClick={() => setSelectedCourt(court.id)}
                      className={`p-3 rounded-lg border-2 text-left cursor-pointer transition-all ${
                        selectedCourt === court.id
                          ? 'border-brand-court bg-brand-court/10'
                          : 'border-brand-dark-border bg-brand-dark-card hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{court.name}</span>
                        <span className="text-xs text-brand-court font-semibold">₹{court.price}/hr</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{court.type} Court</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Date */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-brand-dark-card border border-brand-dark-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-brand-court"
                />
              </div>

              {/* Select Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {slotsList.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-lg border text-xs text-center font-medium transition-all ${
                        selectedSlot === slot
                          ? 'bg-brand-court border-brand-court text-white'
                          : 'bg-brand-dark-card border-brand-dark-border text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 mt-4"
                disabled={!selectedCourt || !selectedSlot}
              >
                Proceed to Payment (Razorpay)
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'cafe' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Cafe Brio Order</h2>
              <p className="text-slate-400 text-xs">Fresh, chef-curated plates served to your table or court</p>
            </div>

            {!isRestaurantEnabled ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800">
                <Coffee className="w-8 h-8 mx-auto text-slate-600 mb-3" />
                <h3 className="font-semibold text-slate-300">Cafe Booking Offline</h3>
                <p className="text-xs text-slate-500 mt-1">Cafe Brio digital menu ordering is currently disabled by the club administrator.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-brand-cafe/10 border border-brand-cafe/20 rounded-lg text-xs text-brand-cafe-dark font-medium flex justify-between">
                  <span>☕ Ordering table-side or court-side</span>
                  <span className="font-bold underline">Table 5</span>
                </div>

                <div className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3.5 bg-brand-dark-card border border-brand-dark-border rounded-lg">
                      <div>
                        <span className="font-semibold text-sm block">{item.name}</span>
                        <span className="text-[10px] text-slate-400">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-brand-cafe">₹{item.price}</span>
                        <Button size="sm" variant="secondary" className="px-2.5 py-1">Add</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="secondary" className="w-full py-3 mt-6">
                  Place Cafe Order
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white font-display">My Account</h2>
              <p className="text-slate-400 text-xs">Manage bookings, settings, and contact support</p>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center font-bold text-lg text-slate-300">
                    C
                  </div>
                  <div>
                    <span className="font-bold text-base block">Chakresh (Client)</span>
                    <span className="text-xs text-slate-400">+91 98765 43210</span>
                  </div>
                </div>

                <div className="border-t border-brand-dark-border pt-4 mt-4 space-y-3 text-sm">
                  <div className="flex justify-between text-slate-300">
                    <span>Loyalty Points</span>
                    <span className="font-bold text-brand-court">120 pts</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Primary Sport</span>
                    <span>Pickleball</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isWhatsappEnabled && (
              <Card className="border-teal-500/20 bg-teal-950/10">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-3">
                    <MessageCircleCode className="w-5 h-5 text-teal-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-teal-200">WhatsApp Automation Active</h4>
                      <p className="text-[11px] text-teal-400/80 mt-0.5">You can also schedule courts, check slots, and query Cafe Brio menu directly by sending a WhatsApp message to our business number.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* PWA Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900 border-t border-slate-900 flex justify-around items-center py-2.5 z-20">
        <button
          onClick={() => setActiveTab('courts')}
          className={`flex flex-col items-center space-y-1 text-[10px] font-semibold transition-all ${
            activeTab === 'courts' ? 'text-brand-court' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Courts</span>
        </button>

        <button
          onClick={() => setActiveTab('cafe')}
          className={`flex flex-col items-center space-y-1 text-[10px] font-semibold transition-all ${
            activeTab === 'cafe' ? 'text-brand-cafe' : 'text-slate-400'
          }`}
        >
          <Coffee className="w-5 h-5" />
          <span>Cafe Brio</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 text-[10px] font-semibold transition-all ${
            activeTab === 'profile' ? 'text-brand-court' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </footer>
    </main>
  );
}
