'use client';

import * as React from 'react';
import { isEnabled } from '@paddle-club/feature-flags';
import { Button } from '@paddle-club/ui';
import { Calendar, Coffee, User, Sparkles, ChevronRight, CheckCircle2, Clock, LogOut, Sun, Moon } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function CustomerPwaDashboard() {
  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('customer-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('customer-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('customer-theme', 'light');
      }
      return next;
    });
  };
  // -------------------

  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [loginPhone, setLoginPhone] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  // References to track previous state for notifications
  const prevBookingsRef = React.useRef<any[]>([]);
  const prevOrdersRef = React.useRef<any[]>([]);

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
  const [tableNumber, setTableNumber] = React.useState('Court');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Evaluate feature flags
  const isRestaurantEnabled = isEnabled('FEATURE_RESTAURANT_MENU_BOOKING');
  const isAiEnabled = isEnabled('FEATURE_AI_AUTOMATION');

  // Image Mapping for Cafe Items
  const CAFE_IMAGES: Record<string, string> = {
    'Iced Latte': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
    'Hot Cappuccino': 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&q=80',
    'Avocado Toast': 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&q=80',
    'Protein Smoothie': 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80',
    'Truffle Fries': 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&q=80',
    'Seasonal Fruit Bowl': 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80'
  };

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

  // Fetch Auth & Initial Data
  React.useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/courts').then(r => r.json()),
      fetch('/api/menu').then(r => r.json())
    ]).then(([authData, courtsData, menuData]) => {
      setCurrentUser(authData.user || null);
      setCourtsList(courtsData.courts || []);
      setMenuItems(menuData.menuItems || []);
      if (courtsData.courts?.length === 1) {
        setSelectedCourt(courtsData.courts[0].id);
      }
      setIsAuthLoading(false);
      setIsLoading(false);
    }).catch(e => {
      console.error(e);
      toast.error('Failed to load initial data');
      setIsAuthLoading(false);
      setIsLoading(false);
    });
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) return toast.error('Please enter a valid phone number');
    
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        toast.success(`Welcome to The Paddle Club!`);
      } else {
        toast.error('Failed to login');
      }
    } catch {
      toast.error('Network error during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      setMyBookings([]);
      setMyOrders([]);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to logout');
    }
  };

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

  // Fetch Profile data (Poll continuously for notifications)
  React.useEffect(() => {
    if (!currentUser) return;

    const fetchProfileData = () => {
      Promise.all([
        fetch('/api/bookings/my').then(r => r.json()),
        fetch('/api/orders/my').then(r => r.json())
      ]).then(([bookingsData, ordersData]) => {
        const newBookings = bookingsData.bookings || [];
        const newOrders = ordersData.orders || [];

        // Diff Bookings for Notifications
        if (prevBookingsRef.current.length > 0) {
          newBookings.forEach((newB: any) => {
            const oldB = prevBookingsRef.current.find((b: any) => b.id === newB.id);
            if (oldB && oldB.status !== newB.status) {
              if (newB.status === 'CONFIRMED') {
                toast.success(`Booking Confirmed! ${newB.court?.name} is ready for you.`);
              } else if (newB.status === 'CANCELLED' && oldB.status === 'PENDING') {
                toast.error(`Booking for ${newB.court?.name} was cancelled.`);
              }
            }
          });
        }
        
        // Diff Orders for Notifications
        if (prevOrdersRef.current.length > 0) {
          newOrders.forEach((newO: any) => {
            const oldO = prevOrdersRef.current.find((o: any) => o.id === newO.id);
            if (oldO && oldO.status !== newO.status) {
              if (newO.status === 'COMPLETED') {
                toast.success(`Your Cafe Brio order is ready!`, { duration: 8000 });
              } else if (newO.status === 'PREPARING') {
                toast.info(`Cafe Brio is now preparing your order.`);
              } else if (newO.status === 'CANCELLED') {
                toast.error(`Your Cafe Brio order was cancelled.`);
              }
            }
          });
        }

        prevBookingsRef.current = newBookings;
        prevOrdersRef.current = newOrders;

        setMyBookings(newBookings);
        setMyOrders(newOrders);
      }).catch(() => {});
    };

    fetchProfileData();
    const interval = setInterval(fetchProfileData, 5000);
    return () => clearInterval(interval);
  }, [currentUser]);

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
      <div className="h-8 w-48 bg-slate-200 dark:bg-white/5 rounded-full animate-pulse" />
      <div className="h-4 w-64 bg-slate-200 dark:bg-white/5 rounded-full animate-pulse" />
      <div className="space-y-4 mt-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 w-full bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center transition-colors duration-300">
         <div className="w-10 h-10 border-4 border-brand-court/30 border-t-brand-court rounded-full animate-spin" />
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col max-w-md mx-auto relative overflow-hidden font-sans transition-colors duration-300">
        <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-center" richColors />
        
        {/* Glows hidden in light mode */}
        <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-brand-court/20 blur-[150px] pointer-events-none hidden dark:block" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-brand-cafe/10 blur-[120px] pointer-events-none hidden dark:block" />
        
        <div className="absolute top-4 right-6 z-20">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
          <div className="w-20 h-20 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm dark:shadow-[0_0_30px_rgba(0,180,216,0.2)] dark:backdrop-blur-md transition-colors duration-300">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-brand-court to-blue-400">PC</span>
          </div>
          
          <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white mb-2 text-center">The <span className="font-semibold text-brand-court">Paddle Club</span></h1>
          <p className="text-slate-500 dark:text-white/40 text-sm text-center mb-10">Enter your phone number to book courts and order from Cafe Brio.</p>

          <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 font-semibold">+91</span>
              <input 
                type="tel" 
                value={loginPhone}
                onChange={e => setLoginPhone(e.target.value)}
                placeholder="12345 67890"
                className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] dark:backdrop-blur-md text-slate-900 dark:text-white px-14 py-4 rounded-2xl font-bold tracking-wider outline-none focus:border-brand-court dark:focus:border-brand-court focus:ring-4 focus:ring-brand-court/10 dark:focus:ring-brand-court/20 transition-all shadow-sm dark:shadow-none"
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-4 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(0,180,216,0.2)] active:scale-[0.98] transition-transform bg-brand-court hover:bg-brand-court/90 border-0 text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Verifying...' : 'Continue'}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col max-w-md mx-auto relative overflow-hidden pb-28 font-sans selection:bg-brand-court/30 transition-colors duration-300">
      
      <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-center" richColors />

      {/* Atmospheric Soft Light Leaks (Hidden in Light Mode) */}
      <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] rounded-full bg-brand-court/20 blur-[120px] pointer-events-none transition-opacity duration-1000 hidden dark:block" style={{ opacity: activeTab === 'courts' ? 1 : 0 }} />
      <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-brand-cafe/20 blur-[120px] pointer-events-none transition-opacity duration-1000 hidden dark:block" style={{ opacity: activeTab === 'cafe' ? 1 : 0 }} />
      <div className="absolute top-[20%] left-[20%] w-[200px] h-[200px] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none transition-opacity duration-1000 hidden dark:block" style={{ opacity: activeTab === 'profile' ? 1 : 0 }} />

      {/* Header */}
      <header className="px-6 pt-12 pb-4 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white/90">The Paddle Club</h1>
          <p className="text-[11px] font-medium text-slate-500 dark:text-white/40 uppercase tracking-widest mt-0.5">Agra</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {isAiEnabled && (
            <div className="flex items-center space-x-1.5 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full text-slate-500 dark:text-white/60 text-[10px] font-semibold dark:backdrop-blur-md shadow-sm dark:shadow-none">
              <Sparkles className="w-3 h-3 text-brand-court" />
              <span className="hidden sm:inline">AI Active</span>
            </div>
          )}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 px-6 overflow-y-auto z-10 scrollbar-hide">
        
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <>
            {/* COURTS TAB */}
            {activeTab === 'courts' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="pt-2">
                  <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white">Reserve a <span className="font-semibold text-brand-court">Court</span></h2>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-8">
                  
                  {/* Date Selection */}
                  <div className="space-y-3 -mx-6 px-6">
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
                            className={`snap-start min-w-[72px] flex flex-col items-center justify-center py-3 px-2 rounded-2xl transition-all duration-300 active:scale-95 ${
                              isSelected 
                                ? 'bg-brand-court border border-brand-court text-white shadow-[0_8px_20px_rgba(0,180,216,0.25)]' 
                                : 'bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.06] shadow-sm dark:shadow-none dark:backdrop-blur-md'
                            }`}
                          >
                            <span className="text-[10px] font-semibold uppercase tracking-wider mb-1">{day}</span>
                            <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-800 dark:text-white/80'}`}>{dateNum}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Multiple Courts UI (if applicable) */}
                  {courtsList.length > 1 && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 gap-3">
                        {courtsList.map((court) => (
                          <div
                            key={court.id}
                            onClick={() => { setSelectedCourt(court.id); setSelectedSlot(''); }}
                            className={`p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] shadow-sm dark:shadow-none ${
                              selectedCourt === court.id
                                ? 'bg-brand-court/5 dark:bg-brand-court/10 border-brand-court/50 shadow-[0_0_20px_rgba(0,180,216,0.1)]'
                                : 'bg-white dark:bg-white/[0.03] border-slate-200 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.06] dark:backdrop-blur-md'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className={`font-semibold ${selectedCourt === court.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-white/80'}`}>{court.name}</span>
                              <span className="text-sm text-brand-court font-bold">₹{court.hourlyRate}/hr</span>
                            </div>
                            <span className="text-[11px] text-slate-400 dark:text-white/40 block mt-1 font-medium">{court.sportType} · {court.surface}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single Court Header (Premium look) */}
                  {courtsList.length === 1 && (
                    <div className="flex items-end justify-between border-b border-slate-200 dark:border-white/10 pb-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest block mb-1">Selected Court</span>
                        <span className="font-semibold text-lg text-slate-900 dark:text-white/90">{courtsList[0].name}</span>
                      </div>
                      <span className="text-sm font-bold text-brand-court bg-brand-court/10 px-3 py-1 rounded-full">₹{courtsList[0].hourlyRate}/hr</span>
                    </div>
                  )}

                  {/* Time Slots */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400 dark:text-white/40" />
                      <span className="text-xs font-semibold text-slate-500 dark:text-white/60 tracking-wide">Available Slots</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
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
                            className={`p-3.5 rounded-2xl border text-xs text-center font-semibold transition-all duration-300 active:scale-[0.96] flex flex-col items-center justify-center space-y-1 shadow-sm dark:shadow-none ${
                              !selectedCourt ? 'opacity-30 cursor-not-allowed bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] text-slate-400 dark:text-white/40' :
                              isPassed ? 'opacity-30 bg-slate-100 dark:bg-white/[0.01] border-slate-200 dark:border-white/[0.02] text-slate-400 dark:text-white/40 cursor-not-allowed line-through' :
                              isBooked ? 'bg-slate-100 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.02] text-slate-400 dark:text-white/20 cursor-not-allowed' :
                              selectedSlot === slot
                                ? 'bg-brand-court border-brand-court text-white shadow-[0_4px_15px_rgba(0,180,216,0.3)]'
                                : 'bg-white dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/[0.08] dark:backdrop-blur-md'
                            }`}
                          >
                            <span>{slot.split(' - ')[0]}</span>
                            {isBooked && !isPassed && <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Booked</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-full py-4 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(0,180,216,0.2)] active:scale-[0.98] transition-transform bg-brand-court hover:bg-brand-court/90 border-0" 
                      disabled={!selectedCourt || !selectedSlot || isSubmitting}
                    >
                      {isSubmitting ? 'Confirming...' : 'Book Court'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* CAFE TAB */}
            {activeTab === 'cafe' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="pt-2">
                  <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white">Cafe <span className="font-semibold text-brand-cafe">Brio</span></h2>
                </div>

                {!isRestaurantEnabled ? (
                  <div className="p-10 text-center bg-white dark:bg-white/[0.02] rounded-3xl border border-slate-200 dark:border-white/[0.05] dark:backdrop-blur-md shadow-sm dark:shadow-none">
                    <Coffee className="w-12 h-12 mx-auto text-slate-300 dark:text-white/20 mb-4" />
                    <h3 className="font-medium text-slate-700 dark:text-white/80">Cafe Offline</h3>
                    <p className="text-sm text-slate-400 dark:text-white/40 mt-2">Digital ordering is currently unavailable.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    
                    {/* Delivery Input */}
                    <div className="p-4 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] dark:backdrop-blur-md rounded-2xl flex justify-between items-center shadow-sm dark:shadow-none">
                      <span className="text-xs font-semibold text-slate-500 dark:text-white/50 tracking-wide">DELIVER TO</span>
                      <input 
                        type="text" 
                        value={tableNumber} 
                        onChange={e => setTableNumber(e.target.value)} 
                        className="bg-transparent text-right text-brand-cafe font-semibold outline-none w-32 placeholder-slate-300 dark:placeholder-white/20 text-sm"
                        placeholder="Court / Table"
                      />
                    </div>

                    {/* Combo Offers */}
                    <div className="-mx-6 px-6">
                      <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                        
                        <div className="snap-start min-w-[260px] p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-[#1a130a] dark:to-[#261608] border border-amber-200 dark:border-brand-cafe/20 relative overflow-hidden shadow-md dark:shadow-xl">
                          <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-cafe/20 rounded-full blur-3xl hidden dark:block" />
                          <h4 className="font-bold text-amber-900 dark:text-brand-cafe text-base mb-1 tracking-tight">Post-Match Refuel</h4>
                          <p className="text-xs text-amber-700/70 dark:text-white/50 mb-5 font-medium">Avocado Toast + Brio Latte</p>
                          <div className="flex justify-between items-end relative z-10">
                            <span className="font-bold text-amber-950 dark:text-white text-lg">₹460</span>
                            <button onClick={() => {
                              const toastItem = menuItems.find(i => i.name.includes('Avocado'));
                              const latteItem = menuItems.find(i => i.name.includes('Latte'));
                              if (toastItem) addToCart(toastItem.id);
                              if (latteItem) addToCart(latteItem.id);
                              if (toastItem || latteItem) toast.success('Added Combo to cart!');
                            }} className="bg-amber-900 dark:bg-brand-cafe text-white dark:text-black text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform">
                              Add
                            </button>
                          </div>
                        </div>

                        <div className="snap-start min-w-[260px] p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-[#0a1a14] dark:to-[#08261e] border border-emerald-200 dark:border-emerald-500/20 relative overflow-hidden shadow-md dark:shadow-xl">
                          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl hidden dark:block" />
                          <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-base mb-1 tracking-tight">Doubles Special</h4>
                          <p className="text-xs text-emerald-700/70 dark:text-white/50 mb-5 font-medium">2x Truffle Fries + 2x Lattes</p>
                          <div className="flex justify-between items-end relative z-10">
                            <span className="font-bold text-emerald-950 dark:text-white text-lg">₹800</span>
                            <button onClick={() => {
                              const friesItem = menuItems.find(i => i.name.includes('Fries'));
                              const latteItem = menuItems.find(i => i.name.includes('Latte'));
                              if (friesItem) { addToCart(friesItem.id); addToCart(friesItem.id); }
                              if (latteItem) { addToCart(latteItem.id); addToCart(latteItem.id); }
                              if (friesItem || latteItem) toast.success('Added Doubles Combo!');
                            }} className="bg-emerald-900 dark:bg-emerald-500 text-white dark:text-black text-xs font-bold px-4 py-2 rounded-xl active:scale-95 transition-transform">
                              Add
                            </button>
                          </div>
                        </div>
                        
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest block mb-2">A La Carte</span>
                      {menuItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.04] rounded-2xl dark:backdrop-blur-md shadow-sm dark:shadow-none">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 shrink-0 bg-slate-100 dark:bg-white/5 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10">
                              <img 
                                src={CAFE_IMAGES[item.name] || 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80'} 
                                alt={item.name} 
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div>
                              <span className="font-semibold text-sm block text-slate-900 dark:text-white/90">{item.name}</span>
                              <span className="text-[10px] font-medium text-slate-500 dark:text-white/40 mt-1 block">{item.category}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-center space-y-2">
                            <span className="text-sm font-semibold text-brand-cafe">₹{item.price}</span>
                            
                            {cart[item.id] ? (
                              <div className="flex items-center bg-slate-100 dark:bg-white/[0.08] rounded-full px-1 py-0.5 border border-slate-200 dark:border-white/10">
                                <button onClick={() => removeFromCart(item.id)} className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white px-2.5 active:scale-90 font-medium">-</button>
                                <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">{cart[item.id]}</span>
                                <button onClick={() => addToCart(item.id)} className="text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white px-2.5 active:scale-90 font-medium">+</button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => addToCart(item.id)}
                                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/[0.15] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white active:scale-90 transition-all"
                              >
                                <span className="text-lg leading-none mb-0.5">+</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {cartTotal > 0 && (
                      <div className="sticky bottom-4 z-20 pt-4">
                        <Button 
                          variant="secondary" 
                          className="w-full py-4 rounded-2xl font-bold text-sm shadow-[0_8px_30px_rgba(217,160,91,0.2)] active:scale-[0.98] transition-transform bg-brand-cafe hover:bg-brand-cafe/90 text-white dark:text-black border-0 flex justify-between items-center px-6" 
                          onClick={handleOrderSubmit}
                          disabled={isSubmitting}
                        >
                          <span>{isSubmitting ? 'Placing Order...' : 'Place Order'}</span>
                          <span className="font-extrabold">₹{cartTotal}</span>
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
                <div className="pt-2">
                  <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white">Your <span className="font-semibold text-brand-court">Profile</span></h2>
                </div>

                <div className="p-6 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] dark:backdrop-blur-md rounded-3xl flex items-center justify-between shadow-sm dark:shadow-lg transition-colors">
                  <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-court to-blue-600 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_20px_rgba(0,180,216,0.3)] uppercase">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <span className="font-bold text-xl block text-slate-900 dark:text-white/90 tracking-tight">{currentUser?.name || 'Player'}</span>
                      <span className="text-xs text-slate-500 dark:text-white/50 font-medium tracking-wide mt-1 block">{currentUser?.phone}</span>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="p-3 bg-slate-50 dark:bg-white/[0.05] hover:bg-red-50 dark:hover:bg-red-500/10 border border-slate-200 dark:border-white/10 hover:border-red-200 dark:hover:border-red-500/30 rounded-full text-slate-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 transition-all active:scale-90">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>

                {/* Bookings Section */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest block">Activity</span>
                  
                  {myBookings.length === 0 ? (
                    <div className="border border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-8 text-center bg-slate-50 dark:bg-white/[0.01]">
                      <Calendar className="w-8 h-8 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-500 dark:text-white/60">No courts booked yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myBookings.map(b => (
                        <div key={b.id} className="p-4 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl dark:backdrop-blur-md flex justify-between items-center shadow-sm dark:shadow-none">
                          <div>
                            <p className="font-semibold text-sm text-slate-900 dark:text-white/90">{b.court.name}</p>
                            <p className="text-slate-500 dark:text-white/50 text-xs mt-1 font-medium">
                              {new Date(b.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {new Date(b.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`font-bold px-3 py-1 rounded-full text-[10px] ${
                              b.status === 'CONFIRMED' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 
                              b.status === 'CANCELLED' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                            }`}>
                              {b.status}
                            </span>
                            {b.status === 'PENDING' && (
                              <button onClick={() => handleCancelBooking(b.id)} className="text-[10px] font-bold text-slate-400 dark:text-white/30 hover:text-red-500 dark:hover:text-red-400 transition-colors">Cancel</button>
                            )}
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

      {/* Floating Navigation Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div className="bg-white dark:bg-white/[0.05] dark:backdrop-blur-2xl border border-slate-200 dark:border-white/10 px-6 py-3 rounded-full flex items-center space-x-8 shadow-lg dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-colors">
          <button 
            onClick={() => setActiveTab('courts')} 
            className={`flex flex-col items-center justify-center w-12 transition-all active:scale-90 ${activeTab === 'courts' ? 'text-brand-court dark:drop-shadow-[0_0_10px_rgba(0,180,216,0.5)]' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70'}`}
          >
            <Calendar className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wide">Courts</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('cafe')} 
            className={`flex flex-col items-center justify-center w-12 transition-all active:scale-90 ${activeTab === 'cafe' ? 'text-brand-cafe dark:drop-shadow-[0_0_10px_rgba(217,160,91,0.5)]' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70'}`}
          >
            <Coffee className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wide">Cafe</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex flex-col items-center justify-center w-12 transition-all active:scale-90 ${activeTab === 'profile' ? 'text-slate-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/70'}`}
          >
            <User className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wide">Profile</span>
          </button>
        </div>
      </div>
    </main>
  );
}
