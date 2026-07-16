'use client';

import * as React from 'react';
import { isEnabled } from '@paddle-club/feature-flags';
import { Button, Card, CardContent } from '@paddle-club/ui';
import { Calendar, Coffee, User, Sparkles, MessageCircleCode, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function CustomerPwaDashboard() {
  const [activeTab, setActiveTab] = React.useState<'courts' | 'cafe' | 'profile'>('courts');
  const [selectedCourt, setSelectedCourt] = React.useState<string>('');
  
  // Date Carousel Logic
  const getNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };
  const dateCarousel = React.useMemo(() => getNext7Days(), []);
  const [selectedDate, setSelectedDate] = React.useState<string>(dateCarousel[0].toISOString().split('T')[0]);
  
  const [selectedSlot, setSelectedSlot] = React.useState<string>('');

  // States for fetched data
  const [courtsList, setCourtsList] = React.useState<any[]>([]);
  const [bookedSlots, setBookedSlots] = React.useState<{startTime: string, endTime: string}[]>([]);
  const [menuItems, setMenuItems] = React.useState<any[]>([]);
  const [myBookings, setMyBookings] = React.useState<any[]>([]);
  const [myOrders, setMyOrders] = React.useState<any[]>([]);

  // UI States
  const [isLoading, setIsLoading] = React.useState(true);
  const [cart, setCart] = React.useState<Record<string, number>>({});
  const [tableNumber, setTableNumber] = React.useState('Court A');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Evaluate feature flags
  const isRestaurantEnabled = isEnabled('FEATURE_RESTAURANT_MENU_BOOKING');
  const isAiEnabled = isEnabled('FEATURE_AI_AUTOMATION');
  const isWhatsappEnabled = isEnabled('FEATURE_WHATSAPP_AUTOMATION');

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

  // Helper to parse slot to check if booked
  const isSlotBooked = (slotLabel: string) => {
    const [startStr] = slotLabel.split(' - ');
    let hour = parseInt(startStr.split(':')[0]);
    const isPM = startStr.includes('PM');
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return bookedSlots.some(b => {
      const bDate = new Date(b.startTime);
      return bDate.getHours() === hour;
    });
  };

  // Helper to check if slot is in the past
  const isSlotPassed = (slotLabel: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (selectedDate !== todayStr) return false;

    const [startStr] = slotLabel.split(' - ');
    let hour = parseInt(startStr.split(':')[0]);
    const isPM = startStr.includes('PM');
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const now = new Date();
    return now.getHours() >= hour;
  };

  // Fetch initial data
  React.useEffect(() => {
    Promise.all([
      fetch('/api/courts').then(r => r.json()),
      fetch('/api/menu').then(r => r.json())
    ]).then(([courtsData, menuData]) => {
      setCourtsList(courtsData.courts || []);
      setMenuItems(menuData.menuItems || []);
      if (courtsData.courts?.length === 1) {
        setSelectedCourt(courtsData.courts[0].id);
      }
      setIsLoading(false);
    }).catch(e => {
      console.error(e);
      toast.error('Failed to load initial data');
      setIsLoading(false);
    });
  }, []);

  // Fetch available slots
  React.useEffect(() => {
    if (!selectedCourt || !selectedDate) return;

    const fetchSlots = () => {
      fetch(`/api/bookings?courtId=${selectedCourt}&date=${selectedDate}`)
        .then(r => r.json())
        .then(data => {
          setBookedSlots(data.bookings || []);
        }).catch(() => {});
    };

    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, [selectedCourt, selectedDate]);

  // Fetch Profile data
  React.useEffect(() => {
    if (activeTab !== 'profile') return;

    const fetchProfileData = () => {
      Promise.all([
        fetch('/api/bookings/my').then(r => r.json()),
        fetch('/api/orders/my').then(r => r.json())
      ]).then(([bookingsData, ordersData]) => {
        setMyBookings(bookingsData.bookings || []);
        setMyOrders(ordersData.orders || []);
      }).catch(() => {});
    };

    fetchProfileData();
    const interval = setInterval(fetchProfileData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt || !selectedSlot) return;

    setIsSubmitting(true);
    const [startStr] = selectedSlot.split(' - ');
    let hour = parseInt(startStr.split(':')[0]);
    const isPM = startStr.includes('PM');
    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    const start = new Date(selectedDate);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(hour + 1, 0, 0, 0);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courtId: selectedCourt, startTime: start.toISOString(), endTime: end.toISOString() })
      });

      if (res.ok) {
        toast.success('Court booked successfully! Waiting for Admin confirmation.');
        setSelectedSlot('');
        // refetch
        const availabilityRes = await fetch(`/api/bookings?courtId=${selectedCourt}&date=${selectedDate}`);
        const data = await availabilityRes.json();
        setBookedSlots(data.bookings || []);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to book court');
      }
    } catch {
      toast.error('Network error while booking court');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToCart = (id: string) => setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const removeFromCart = (id: string) => setCart(prev => {
    const next = { ...prev };
    if (next[id] > 1) next[id] -= 1;
    else delete next[id];
    return next;
  });

  const cartTotal = menuItems.reduce((sum, item) => sum + (item.price * (cart[item.id] || 0)), 0);

  const handleOrderSubmit = async () => {
    const items = Object.entries(cart).map(([id, quantity]) => ({ id, quantity }));
    if (items.length === 0) return toast.error('Cart is empty!');
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: items, tableNumber })
      });

      if (res.ok) {
        toast.success('Order placed successfully! Kitchen is preparing it.');
        setCart({});
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to place order');
      }
    } catch {
      toast.error('Network error while placing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch('/api/bookings/my', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId })
      });
      if (res.ok) {
        toast.success('Booking cancelled successfully.');
        setMyBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to cancel booking');
      }
    } catch {
      toast.error('Network error while cancelling');
    }
  };

  // Date Formatting Helper for Carousel
  const formatDateForCarousel = (date: Date, index: number) => {
    if (index === 0) return { day: 'Today', date: date.getDate() };
    if (index === 1) return { day: 'Tomorrow', date: date.getDate() };
    return { 
      day: date.toLocaleDateString('en-US', { weekday: 'short' }), 
      date: date.getDate() 
    };
  };

  const SkeletonLoader = () => (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-slate-800 rounded animate-pulse" />
      <div className="h-4 w-64 bg-slate-800/50 rounded animate-pulse" />
      <div className="space-y-3 mt-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 w-full bg-slate-800/60 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-dark text-slate-100 flex flex-col max-w-md mx-auto border-x border-brand-dark-border shadow-2xl relative overflow-hidden pb-20">
      
      <Toaster theme="dark" position="bottom-center" richColors />

      {/* Contextual Glow Backgrounds */}
      <div className={`absolute top-0 left-0 w-full h-[500px] blur-[100px] rounded-full opacity-20 pointer-events-none transition-colors duration-700 ease-in-out ${
        activeTab === 'courts' ? 'bg-brand-court' : activeTab === 'cafe' ? 'bg-brand-cafe' : 'bg-slate-500'
      }`} style={{ transform: 'translateY(-30%)' }} />

      {/* Top Navigation */}
      <header className="px-6 py-5 bg-brand-dark-card/50 border-b border-brand-dark-border sticky top-0 backdrop-blur-xl z-10 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold font-display text-white">THE PADDLE CLUB</span>
          <p className="text-[10px] text-brand-court font-semibold tracking-widest uppercase">Member App</p>
        </div>
        
        {isAiEnabled && (
          <div className="flex items-center space-x-1 bg-teal-950/50 border border-teal-500/30 px-2 py-1 rounded-full text-teal-300 text-[10px] font-bold shadow-[0_0_15px_rgba(45,212,191,0.2)]">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span>AI Booking Active</span>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto z-10">
        
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* COURTS TAB */}
            {activeTab === 'courts' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Book a Court</h2>
                  <p className="text-slate-400 text-xs">Reserve your pickleball or padel session</p>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-5">
                  
                  {/* Horizontal Date Carousel */}
                  <div className="space-y-2 -mx-5 px-5">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Date</label>
                    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                      {dateCarousel.map((date, idx) => {
                        const isoString = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === isoString;
                        const { day, date: dateNum } = formatDateForCarousel(date, idx);
                        
                        return (
                          <button
                            key={isoString}
                            type="button"
                            onClick={() => { setSelectedDate(isoString); setSelectedSlot(''); }}
                            className={`snap-start min-w-[70px] flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border transition-all active:scale-[0.95] ${
                              isSelected 
                                ? 'bg-brand-court/10 border-brand-court text-brand-court shadow-[0_0_15px_rgba(0,180,216,0.15)]' 
                                : 'bg-brand-dark-card border-brand-dark-border text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                          >
                            <span className="text-[10px] font-medium uppercase tracking-wider">{day}</span>
                            <span className={`text-lg font-bold mt-0.5 ${isSelected ? 'text-white' : 'text-slate-300'}`}>{dateNum}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Court Selection (Only show if multiple courts) */}
                  {courtsList.length > 1 && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Court</label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {courtsList.map((court) => (
                          <div
                            key={court.id}
                            onClick={() => { setSelectedCourt(court.id); setSelectedSlot(''); }}
                            className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all active:scale-[0.98] ${
                              selectedCourt === court.id
                                ? 'border-brand-court bg-brand-court/10 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
                                : 'border-brand-dark-border bg-brand-dark-card hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`font-semibold text-sm ${selectedCourt === court.id ? 'text-white' : 'text-slate-200'}`}>{court.name}</span>
                              <span className="text-xs text-brand-court font-bold">₹{court.hourlyRate}/hr</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">{court.sportType} Court · {court.surface}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single Court Display */}
                  {courtsList.length === 1 && (
                    <div className="p-3.5 rounded-xl border-2 border-brand-court bg-brand-court/10 shadow-[0_0_20px_rgba(0,180,216,0.1)]">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-white">{courtsList[0].name}</span>
                        <span className="text-xs text-brand-court font-bold">₹{courtsList[0].hourlyRate}/hr</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">{courtsList[0].sportType} Court · {courtsList[0].surface}</span>
                    </div>
                  )}

                  {/* Time Slot Selection */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Time Slot</label>
                      {selectedCourt && <span className="text-[10px] text-brand-court animate-pulse">Loading availability...</span>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {slotsList.map((slot) => {
                        const isBooked = isSlotBooked(slot);
                        const isPassed = isSlotPassed(slot);
                        const isDisabled = isBooked || isPassed || !selectedCourt;
                        
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-xl border text-xs text-center font-medium transition-all active:scale-[0.97] ${
                              !selectedCourt ? 'opacity-50 cursor-not-allowed bg-brand-dark-card border-brand-dark-border text-slate-600' :
                              isPassed ? 'opacity-40 bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed line-through' :
                              isBooked ? 'bg-slate-900/80 border-slate-800 text-slate-600 cursor-not-allowed' :
                              selectedSlot === slot
                                ? 'bg-brand-court border-brand-court text-white shadow-[0_0_15px_rgba(0,180,216,0.3)]'
                                : 'bg-brand-dark-card border-brand-dark-border text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                            }`}
                          >
                            {slot} 
                            {isPassed ? <span className="block text-[9px] mt-0.5 opacity-60">Lapsed</span> : isBooked ? <span className="block text-[9px] mt-0.5 opacity-60">Booked</span> : ''}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-3.5 mt-6 rounded-xl font-bold shadow-lg shadow-brand-court/20 active:scale-[0.98] transition-transform" 
                    disabled={!selectedCourt || !selectedSlot || isSubmitting}
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                  </Button>
                </form>
              </div>
            )}

            {/* CAFE TAB */}
            {activeTab === 'cafe' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Cafe Brio Order</h2>
                  <p className="text-slate-400 text-xs">Fresh, chef-curated plates served to your table or court</p>
                </div>

                {!isRestaurantEnabled ? (
                  <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
                    <Coffee className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <h3 className="font-semibold text-slate-300 text-sm">Cafe Booking Offline</h3>
                    <p className="text-xs text-slate-500 mt-1">Cafe Brio digital menu ordering is currently disabled by the club administrator.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    
                    <div className="p-4 bg-brand-cafe/10 border border-brand-cafe/20 rounded-xl text-xs text-brand-cafe font-medium flex justify-between items-center shadow-inner">
                      <div className="flex items-center space-x-2">
                        <Coffee className="w-4 h-4" />
                        <span>Deliver to:</span>
                      </div>
                      <input 
                        type="text" 
                        value={tableNumber} 
                        onChange={e => setTableNumber(e.target.value)} 
                        className="bg-transparent border-b border-brand-cafe/50 text-right text-white font-bold outline-none focus:border-brand-cafe transition-colors w-32 placeholder-slate-500"
                        placeholder="e.g. Table 5 / Court A"
                      />
                    </div>

                    {/* Combo Offers Section */}
                    <div className="py-2">
                      <h3 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Today's Combos</span>
                      </h3>
                      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                        
                        {/* Combo Card 1 */}
                        <div className="snap-start min-w-[220px] p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-600/20 border border-amber-500/30 relative overflow-hidden shadow-lg">
                          <div className="absolute -right-4 -top-4 w-16 h-16 bg-amber-500/20 rounded-full blur-xl" />
                          <h4 className="font-bold text-amber-300 text-sm mb-0.5 tracking-tight">Post-Match Refuel</h4>
                          <p className="text-[10px] text-slate-300 mb-3">Avocado Toast + Brio Latte</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-white text-sm">₹460</span>
                            </div>
                            <button onClick={() => {
                              const toastItem = menuItems.find(i => i.name.includes('Avocado'));
                              const latteItem = menuItems.find(i => i.name.includes('Latte'));
                              if (toastItem) addToCart(toastItem.id);
                              if (latteItem) addToCart(latteItem.id);
                              if (toastItem || latteItem) toast.success('Added Combo to cart!');
                            }} className="bg-amber-500 text-amber-950 text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:bg-amber-400">
                              Add Combo
                            </button>
                          </div>
                        </div>

                        {/* Combo Card 2 */}
                        <div className="snap-start min-w-[220px] p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-600/20 border border-emerald-500/30 relative overflow-hidden shadow-lg">
                          <div className="absolute -right-4 -top-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl" />
                          <h4 className="font-bold text-emerald-300 text-sm mb-0.5 tracking-tight">Doubles Special</h4>
                          <p className="text-[10px] text-slate-300 mb-3">2x Truffle Fries + 2x Lattes</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-bold text-white text-sm">₹800</span>
                            </div>
                            <button onClick={() => {
                              const friesItem = menuItems.find(i => i.name.includes('Fries'));
                              const latteItem = menuItems.find(i => i.name.includes('Latte'));
                              if (friesItem) { addToCart(friesItem.id); addToCart(friesItem.id); }
                              if (latteItem) { addToCart(latteItem.id); addToCart(latteItem.id); }
                              if (friesItem || latteItem) toast.success('Added Doubles Combo!');
                            }} className="bg-emerald-500 text-emerald-950 text-[10px] font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform shadow-[0_0_10px_rgba(16,185,129,0.3)] hover:bg-emerald-400">
                              Add Combo
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white flex items-center space-x-2 mt-2 mb-2">
                      <Coffee className="w-4 h-4 text-brand-cafe" />
                      <span>All Menu Items</span>
                    </h3>
                    <div className="space-y-3">
                      {menuItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-brand-dark-card border border-brand-dark-border rounded-xl hover:border-slate-700 transition-colors">
                          <div>
                            <span className="font-semibold text-sm block text-slate-200">{item.name}</span>
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className="text-sm font-bold text-brand-cafe">₹{item.price}</span>
                            
                            {cart[item.id] ? (
                              <div className="flex items-center space-x-3 bg-brand-cafe/20 border border-brand-cafe/30 rounded-lg px-1.5 py-1">
                                <button onClick={() => removeFromCart(item.id)} className="text-brand-cafe hover:text-white px-2 active:scale-90 font-bold">-</button>
                                <span className="text-xs font-bold w-4 text-center text-white">{cart[item.id]}</span>
                                <button onClick={() => addToCart(item.id)} className="text-brand-cafe hover:text-white px-2 active:scale-90 font-bold">+</button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addToCart(item.id)}
                                className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 hover:text-white px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
                              >
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {cartTotal > 0 && (
                      <div className="sticky bottom-[70px] z-20 animate-in slide-in-from-bottom-8">
                        <Button 
                          variant="secondary" 
                          className="w-full py-4 rounded-xl font-bold shadow-[0_10px_30px_rgba(217,160,91,0.2)] active:scale-[0.98] transition-transform flex justify-between items-center px-6" 
                          onClick={handleOrderSubmit}
                          disabled={isSubmitting}
                        >
                          <span>{isSubmitting ? 'Placing Order...' : 'Place Cafe Order'}</span>
                          <div className="flex items-center space-x-2">
                            <span className="bg-brand-cafe-dark/50 px-2 py-1 rounded-md text-white text-xs">₹{cartTotal}</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">My Account</h2>
                </div>

                <Card className="bg-brand-dark-card/60 backdrop-blur-md border-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-brand-court to-teal-700 rounded-full flex items-center justify-center font-bold text-xl text-white shadow-lg">
                        T
                      </div>
                      <div>
                        <span className="font-bold text-lg block text-white">Test Player</span>
                        <span className="text-xs text-slate-400 font-medium tracking-wide">+91 12345 67890</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings Section */}
                <div>
                  <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-brand-court" />
                    <span>Recent Bookings</span>
                  </h3>
                  
                  {myBookings.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center">
                      <div className="bg-slate-900/50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Calendar className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">No courts booked yet</p>
                      <p className="text-xs text-slate-500 mt-1">Ready for a match? Head over to the courts tab.</p>
                      <button onClick={() => setActiveTab('courts')} className="mt-4 text-xs font-bold text-brand-court hover:underline">Book a Court</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.map(b => (
                        <div key={b.id} className="p-4 bg-brand-dark-card rounded-xl text-xs flex justify-between border border-brand-dark-border hover:border-slate-700 transition-colors">
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-white">{b.court.name}</p>
                            <p className="text-slate-400 flex items-center space-x-1">
                              <span>{new Date(b.startTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              <span>·</span>
                              <span>{new Date(b.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end justify-between">
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              b.status === 'CONFIRMED' ? 'bg-emerald-950/50 text-emerald-400' : 
                              b.status === 'CANCELLED' ? 'bg-red-950/50 text-red-400' : 'bg-amber-950/50 text-amber-400'
                            }`}>
                              {b.status}
                            </span>
                            {b.status === 'PENDING' && (
                              <button onClick={() => handleCancelBooking(b.id)} className="text-[10px] font-bold text-slate-500 hover:text-red-400 transition-colors mt-2 underline">Cancel</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orders Section */}
                <div>
                  <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center space-x-2">
                    <Coffee className="w-4 h-4 text-brand-cafe" />
                    <span>Recent Cafe Orders</span>
                  </h3>
                  
                  {myOrders.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center">
                      <div className="bg-slate-900/50 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Coffee className="w-5 h-5 text-slate-600" />
                      </div>
                      <p className="text-sm font-semibold text-slate-300">No orders placed</p>
                      <p className="text-xs text-slate-500 mt-1">Grab a coffee or snack after your game.</p>
                      <button onClick={() => setActiveTab('cafe')} className="mt-4 text-xs font-bold text-brand-cafe hover:underline">View Menu</button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myOrders.map(o => (
                        <div key={o.id} className="p-4 bg-brand-dark-card rounded-xl text-xs flex justify-between border border-brand-dark-border hover:border-slate-700 transition-colors">
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-white flex items-center space-x-2">
                              <span>₹{o.totalAmount}</span>
                              <span className="text-[10px] text-slate-500 font-normal">to {o.tableNumber}</span>
                            </p>
                            <p className="text-slate-400 text-[10px]">{new Date(o.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center space-x-1 ${
                              o.status === 'COMPLETED' ? 'bg-emerald-950/50 text-emerald-400' : 
                              o.status === 'CANCELLED' ? 'bg-red-950/50 text-red-400' : 'bg-blue-950/50 text-blue-400'
                            }`}>
                              {o.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                              <span>{o.status}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}
          </>
        )}
      </div>

      {/* PWA Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/90 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center py-3 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setActiveTab('courts')} 
          className={`flex flex-col items-center space-y-1 text-[10px] font-bold transition-all active:scale-95 ${activeTab === 'courts' ? 'text-brand-court scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Calendar className="w-5 h-5" /><span>Courts</span>
        </button>
        <button 
          onClick={() => setActiveTab('cafe')} 
          className={`flex flex-col items-center space-y-1 text-[10px] font-bold transition-all active:scale-95 ${activeTab === 'cafe' ? 'text-brand-cafe scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Coffee className="w-5 h-5" /><span>Cafe Brio</span>
        </button>
        <button 
          onClick={() => setActiveTab('profile')} 
          className={`flex flex-col items-center space-y-1 text-[10px] font-bold transition-all active:scale-95 ${activeTab === 'profile' ? 'text-brand-court scale-105' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <User className="w-5 h-5" /><span>Profile</span>
        </button>
      </footer>
    </main>
  );
}
