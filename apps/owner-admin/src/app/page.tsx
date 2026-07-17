'use client';

import * as React from 'react';
import { getAllFlags } from '@paddle-club/feature-flags';
import {
  Calendar,
  DollarSign,
  Coffee,
  MessageSquare,
  Sliders,
  AlertCircle,
  Clock,
  Loader2,
  CheckCircle,
  ChefHat,
  LayoutDashboard,
  Settings,
  Users,
  Shield,
  Smartphone,
  Mail,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface Stats {
  totalBookings: number;
  courtRevenue: number;
  totalOrders: number;
  cafeRevenue: number;
}

interface BookingUser {
  name: string | null;
  phone: string;
}

interface BookingCourt {
  name: string;
  sportType: string;
}

interface Booking {
  id: string;
  courtId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
  user: BookingUser;
  court: BookingCourt;
}

interface OrderUser {
  name: string | null;
  phone: string;
}

interface Order {
  id: string;
  userId: string;
  items: string;
  totalAmount: number;
  status: string;
  tableNumber: string | null;
  createdAt: string;
  user: OrderUser;
}

interface Member {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  role: string;
  createdAt: string;
}

const LiveTimer = ({ createdAt }: { createdAt: string }) => {
  const [elapsed, setElapsed] = React.useState(0);
  
  React.useEffect(() => {
    const start = new Date(createdAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
    tick(); // initial tick
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  
  const isWarning = mins >= 10 && mins < 15;
  const isOverdue = mins >= 15;

  return (
    <span className={`font-mono text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full ${
      isOverdue ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400 animate-pulse shadow-sm dark:shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
      isWarning ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
      'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-white/40'
    }`}>
      {mins}:{secs.toString().padStart(2, '0')}
    </span>
  );
};

export default function AdminDashboardPage() {
  const flags = getAllFlags();

  // --- THEME STATE ---
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Initial load
    const savedTheme = localStorage.getItem('admin-theme');
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
        localStorage.setItem('admin-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('admin-theme', 'light');
      }
      return next;
    });
  };
  // -------------------

  const [stats, setStats] = React.useState<Stats | null>(null);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [members, setMembers] = React.useState<Member[]>([]);
  
  const [loadingStats, setLoadingStats] = React.useState(true);
  const [loadingBookings, setLoadingBookings] = React.useState(true);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [loadingMembers, setLoadingMembers] = React.useState(true);
  
  const [updatingBookingId, setUpdatingBookingId] = React.useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [activeNav, setActiveNav] = React.useState<'dashboard' | 'members' | 'settings'>('dashboard');

  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = React.useState<Member | null>(null);
  const [loginPhone, setLoginPhone] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [isAuthLoading, setIsAuthLoading] = React.useState(true);

  // --- KDS ENHANCEMENTS STATE ---
  const prevOrdersCountRef = React.useRef(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [menuItems, setMenuItems] = React.useState<any[]>([]);
  const [showInventory, setShowInventory] = React.useState(false);
  const [loadingInventory, setLoadingInventory] = React.useState(false);

  React.useEffect(() => {
    const savedUser = localStorage.getItem('admin-user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone.length !== 10) return toast.error('Enter a valid 10-digit phone number');
    
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: loginPhone })
      });
      
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        localStorage.setItem('admin-user', JSON.stringify(data.user));
        toast.success(`Welcome back, ${data.user.name}`);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Login failed');
      }
    } catch {
      toast.error('Network error during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('admin-user');
  };
  // ------------------

  // --- KDS EFFECTS & INVENTORY API ---
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'); // Mock Base64 Ding
    }
    
    const pendingCount = orders.filter(o => o.status === 'PENDING').length;
    if (pendingCount > prevOrdersCountRef.current && audioRef.current) {
      audioRef.current.play().catch(() => console.log('Audio autoplay blocked'));
    }
    prevOrdersCountRef.current = pendingCount;
  }, [orders]);

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const res = await fetch('/api/admin/menu');
      if (res.ok) setMenuItems(await res.json());
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  const toggleMenuItem = async (id: string, currentAvailable: boolean) => {
    try {
      const res = await fetch(`/api/admin/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !currentAvailable })
      });
      if (res.ok) {
        setMenuItems(prev => prev.map(m => m.id === id ? { ...m, available: !currentAvailable } : m));
        toast.success('Inventory updated');
      }
    } catch {
      toast.error('Failed to update inventory');
    }
  };
  // -----------------------------------

  const fetchStats = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      const data = await res.json();
      setStats(data);
    } catch {
      setError('Failed to load stats');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchBookings = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const data = await res.json();
      setBookings(data);
    } catch {
      setError('Failed to load bookings');
    } finally {
      setLoadingBookings(false);
    }
  }, []);

  const fetchOrders = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch {
      setError('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  const fetchMembers = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/members');
      if (!res.ok) throw new Error('Failed to fetch members');
      const data = await res.json();
      setMembers(data);
    } catch {
      setError('Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  const fetchAll = React.useCallback(() => {
    setLoadingStats(true);
    setLoadingBookings(true);
    setLoadingOrders(true);
    setLoadingMembers(true);
    setError(null);
    fetchStats();
    fetchBookings();
    fetchOrders();
    fetchMembers();
  }, [fetchStats, fetchBookings, fetchOrders, fetchMembers]);

  React.useEffect(() => {
    if (!currentUser) return;
    fetchAll();
    
    const interval = setInterval(() => {
      if (activeNav === 'dashboard') {
        fetch('/api/admin/stats').then(res => res.json()).then(setStats).catch(() => {});
        fetch('/api/admin/bookings').then(res => res.json()).then(setBookings).catch(() => {});
        fetch('/api/admin/orders').then(res => res.json()).then(setOrders).catch(() => {});
      } else if (activeNav === 'members') {
        fetch('/api/admin/members').then(res => res.json()).then(setMembers).catch(() => {});
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAll, activeNav, currentUser]);

  const updateBookingStatus = async (id: string, status: string) => {
    setUpdatingBookingId(id);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Update failed');
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
      fetchStats();
      toast.success(`Booking ${status.toLowerCase()}`);
    } catch (e) {
      toast.error(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setUpdatingOrderId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || 'Update failed');
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
      fetchStats();
      toast.success(`Order marked as ${status.toLowerCase()}`);
    } catch (e) {
      toast.error(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const fmt = (dt: Date) =>
      dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${fmt(s)} - ${fmt(e)}`;
  };

  const statCards = [
    { name: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: Calendar, color: 'text-brand-court', bg: 'bg-brand-court/10 dark:bg-brand-court/20' },
    { name: 'Court Revenue', value: `₹${(stats?.courtRevenue ?? 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-brand-court', bg: 'bg-brand-court/10 dark:bg-brand-court/20' },
    { name: 'Cafe Sales', value: `₹${(stats?.cafeRevenue ?? 0).toLocaleString('en-IN')}`, icon: Coffee, color: 'text-brand-cafe', bg: 'bg-brand-cafe/10 dark:bg-brand-cafe/20', disabled: !flags.FEATURE_RESTAURANT_MENU_BOOKING },
    { name: 'WhatsApp Logs', value: '—', icon: MessageSquare, color: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-white/10', disabled: !flags.FEATURE_WHATSAPP_AUTOMATION },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]',
      PENDING: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 dark:shadow-[0_0_10px_rgba(245,158,11,0.1)]',
      CANCELLED: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 dark:shadow-[0_0_10px_rgba(239,68,68,0.1)]',
      PREPARING: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 dark:shadow-[0_0_10px_rgba(59,130,246,0.1)]',
      COMPLETED: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 dark:shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold border uppercase tracking-wider ${styles[status] ?? 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/50'}`}>
        {status}
      </span>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 text-slate-300 dark:text-white/20 animate-spin" />
    </div>
  );

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center transition-colors duration-300">
         <div className="w-10 h-10 border-4 border-brand-court/30 border-t-brand-court rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 flex flex-col max-w-md mx-auto relative overflow-hidden font-sans transition-colors duration-300">
        <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-center" richColors />
        
        <div className="absolute top-[-10%] left-[-20%] w-[400px] h-[400px] rounded-full bg-brand-court/20 blur-[150px] pointer-events-none hidden dark:block" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[300px] h-[300px] rounded-full bg-brand-cafe/10 blur-[120px] pointer-events-none hidden dark:block" />
        
        <div className="absolute top-4 right-6 z-20">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-white dark:bg-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/10 shadow-sm dark:shadow-none transition-colors">
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 z-10">
          <div className="w-20 h-20 bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl flex items-center justify-center mb-8 shadow-sm dark:shadow-[0_0_30px_rgba(0,180,216,0.2)] dark:backdrop-blur-md transition-colors duration-300">
            <Shield className="w-10 h-10 text-brand-court" />
          </div>
          
          <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-white mb-2 text-center">Staff <span className="font-semibold text-brand-court">Portal</span></h1>
          <p className="text-slate-500 dark:text-white/40 text-sm text-center mb-10">Enter your authorized phone number to access the dashboard.</p>

          <form onSubmit={handleLoginSubmit} className="w-full space-y-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/40 font-semibold">+91</span>
              <input 
                type="tel" 
                value={loginPhone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setLoginPhone(val);
                }}
                maxLength={10}
                placeholder="12345 67890"
                className="w-full bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] dark:backdrop-blur-md text-slate-900 dark:text-white px-14 py-4 rounded-2xl font-bold tracking-wider outline-none focus:border-brand-court dark:focus:border-brand-court focus:ring-4 focus:ring-brand-court/10 dark:focus:ring-brand-court/20 transition-all shadow-sm dark:shadow-none"
                autoFocus
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full py-4 rounded-2xl font-bold text-sm shadow-[0_8px_20px_rgba(0,180,216,0.2)] active:scale-[0.98] transition-transform bg-brand-court hover:bg-brand-court/90 border-0 text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Verifying...' : 'Login securely'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // --- KITCHEN DISPLAY SYSTEM VIEW FOR CHEFS ---
  if (currentUser.role === 'CHEF') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
        <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-right" richColors />
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-cafe/10 blur-[150px] pointer-events-none hidden dark:block" />

        <header className="h-16 md:h-20 border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] dark:backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 z-10 transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <Coffee className="w-6 h-6 md:w-8 md:h-8 text-brand-cafe" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white/90 tracking-tight">Kitchen Display System</h1>
              <p className="text-[10px] md:text-xs text-brand-cafe font-semibold uppercase tracking-wider">{currentUser.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={() => { setShowInventory(true); fetchInventory(); }} className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-amber-50 dark:bg-brand-cafe/10 text-amber-700 dark:text-brand-cafe font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl hover:bg-amber-100 dark:hover:bg-brand-cafe/20 transition-colors border border-amber-200 dark:border-brand-cafe/20">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Inventory</span>
            </button>
            <button onClick={toggleTheme} className="p-1.5 md:p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={handleLogout} className="p-1.5 md:p-2 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto z-10">
          {!flags.FEATURE_RESTAURANT_MENU_BOOKING ? (
            <div className="bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] border border-dashed rounded-3xl p-8 md:p-12 text-center flex flex-col items-center max-w-2xl mx-auto mt-10">
              <Coffee className="w-10 h-10 md:w-16 md:h-16 text-slate-300 dark:text-white/20 mb-4" />
              <h4 className="font-bold text-slate-500 dark:text-white/60 text-lg md:text-xl">Cafe Module Offline</h4>
              <p className="text-sm text-slate-400 dark:text-white/40 mt-2">The system is currently disabled by the administrator.</p>
            </div>
          ) : loadingOrders ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-3xl p-8 md:p-16 text-center text-slate-400 dark:text-white/30 text-sm md:text-base font-medium max-w-2xl mx-auto mt-10">
              No food orders in the queue. You're all caught up!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {orders.map((order) => {
                let parsedItems: { name: string; quantity: number }[] = [];
                try { parsedItems = JSON.parse(order.items); } catch {}

                return (
                  <div key={order.id} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm dark:shadow-lg dark:backdrop-blur-xl relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${order.status === 'PENDING' ? 'bg-amber-400' : order.status === 'PREPARING' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                    
                    <div className="flex justify-between items-start mb-4 pl-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-extrabold text-slate-900 dark:text-white/90 block text-sm">
                            {order.tableNumber ? `Deliver to: ${order.tableNumber.replace('Court A', 'Court')}` : 'Takeaway'}
                          </span>
                          <LiveTimer createdAt={order.createdAt} />
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-white/40 font-medium">{order.user.name || 'Unknown'} · {formatDate(order.createdAt)}</span>
                      </div>
                      {statusBadge(order.status)}
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/[0.04] mb-4">
                      <ul className="space-y-3">
                        {parsedItems.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-slate-700 dark:text-white/80">{item.name}</span>
                            <span className="font-bold text-slate-500 dark:text-white/60 bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent px-2 py-1 rounded text-xs shadow-sm dark:shadow-none">x{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 pl-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-brand-cafe">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                      
                      <div className="flex items-center space-x-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateOrderStatus(order.id, 'CANCELLED')} disabled={updatingOrderId === order.id} className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl active:scale-95 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-200 dark:border-red-500/20 disabled:opacity-50">
                              {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                              <span>Decline</span>
                            </button>
                            <button onClick={() => updateOrderStatus(order.id, 'PREPARING')} disabled={updatingOrderId === order.id} className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-cafe text-white font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl active:scale-95 hover:bg-brand-cafe/90 transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(140,126,115,0.3)] disabled:opacity-50">
                              {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <ChefHat className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                              <span>Accept</span>
                            </button>
                          </>
                        )}
                        {order.status === 'PREPARING' && (
                          <button onClick={() => updateOrderStatus(order.id, 'COMPLETED')} disabled={updatingOrderId === order.id} className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-court text-white font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl active:scale-95 hover:bg-brand-court/90 transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(155,159,96,0.3)] disabled:opacity-50">
                            {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                            <span>Ready</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
        
        {/* INVENTORY MODAL */}
        {showInventory && (
          <div className="fixed inset-0 bg-slate-900/50 dark:bg-[#070b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/[0.02]">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Menu Inventory</h3>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-1">Toggle items to mark them out of stock (86'd).</p>
                </div>
                <button onClick={() => setShowInventory(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/50 transition-colors">
                  <AlertCircle className="w-5 h-5 rotate-45" /> {/* Mock X icon */}
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {loadingInventory ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-4">
                    {menuItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white/90">{item.name}</p>
                          <p className="text-[10px] text-slate-500 dark:text-white/40 font-semibold uppercase">{item.category}</p>
                        </div>
                        <button
                          onClick={() => toggleMenuItem(item.id, item.available)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.available ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                        >
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.available ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- OWNER VIEW (Standard Dashboard) ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col md:flex-row text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-court/20 dark:selection:bg-brand-court/30 transition-colors duration-300">
      
      <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-right" richColors />

      {/* Atmospheric Glows for Dark Mode */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-court/10 blur-[150px] pointer-events-none hidden dark:block" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-cafe/10 blur-[150px] pointer-events-none hidden dark:block" />

      {/* DESKTOP Sidebar Navigation */}
      <aside className="hidden md:flex w-64 border-r border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl flex-col z-20 transition-colors duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-white/[0.05] flex justify-between items-center">
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white/90">Paddle<span className="text-brand-court">Club</span></span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-brand-court/10 border border-brand-court/20 text-brand-court text-[8px] font-bold tracking-widest uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleTheme}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white/90 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveNav('dashboard')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeNav === 'dashboard' ? 'bg-slate-50 dark:bg-brand-court/10 text-brand-court font-semibold shadow-sm dark:shadow-none border border-slate-100 dark:border-brand-court/20' : 'text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white/80'}`}>
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <button onClick={() => setActiveNav('members')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeNav === 'members' ? 'bg-slate-50 dark:bg-brand-court/10 text-brand-court font-semibold shadow-sm dark:shadow-none border border-slate-100 dark:border-brand-court/20' : 'text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white/80'}`}>
            <Users className="w-4 h-4" />
            <span>Members</span>
          </button>

          <button onClick={() => setActiveNav('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeNav === 'settings' ? 'bg-slate-50 dark:bg-brand-court/10 text-brand-court font-semibold shadow-sm dark:shadow-none border border-slate-100 dark:border-brand-court/20' : 'text-slate-500 dark:text-white/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white/80'}`}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/[0.05]">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-court to-emerald-600 flex items-center justify-center font-bold text-xs text-white shadow-sm dark:shadow-[0_0_20px_rgba(155,159,96,0.3)]">O</div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white/90">Owner Portal</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-court shadow-[0_0_4px_rgba(155,159,96,0.4)] dark:shadow-[0_0_5px_rgba(155,159,96,0.5)]"></span>
                <p className="text-[9px] text-slate-500 dark:text-white/40 uppercase tracking-wider font-semibold">System Online</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden z-10 pb-20 md:pb-0">
        
        {/* Top Header */}
        <header className="h-16 md:h-20 border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.01] dark:backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 transition-colors duration-300">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white/90 tracking-tight capitalize">
              {activeNav === 'dashboard' ? 'Overview' : activeNav}
            </h1>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button onClick={handleLogout} className="md:hidden p-1.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
            <button 
              onClick={toggleTheme}
              className="md:hidden p-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {activeNav === 'dashboard' && (
              <div className="flex items-center space-x-2 text-[10px] md:text-xs text-slate-500 dark:text-white/40 bg-slate-50 dark:bg-white/[0.03] px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-slate-200 dark:border-white/[0.05] shadow-sm dark:shadow-none">
                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-brand-court" />
                <span className="font-semibold hidden sm:inline">Live sync active</span>
                <span className="font-semibold sm:hidden">Live</span>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8">

          {/* Global Error */}
          {error && (
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs md:text-sm flex items-center space-x-2 md:space-x-3 dark:backdrop-blur-md">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError(null)} className="ml-auto px-2 py-1 md:px-3 md:py-1 bg-red-100 dark:bg-red-500/20 rounded-md hover:bg-red-200 dark:hover:bg-red-500/30 font-bold">Dismiss</button>
            </div>
          )}

          {/* =========================================
              DASHBOARD TAB 
              ========================================= */}
          {activeNav === 'dashboard' && (
            <>
              {/* Feature Flags Banner */}
              <div className="p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.02] dark:backdrop-blur-xl flex flex-col md:flex-row gap-4 md:gap-6 md:items-center justify-between shadow-sm dark:shadow-lg transition-colors duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 md:p-2 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10">
                    <Sliders className="w-3 h-3 md:w-4 md:h-4 text-slate-600 dark:text-white/70" />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-800 dark:text-white/80">Active Modules</span>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-4 text-[10px] md:text-xs font-semibold">
                  <div className={`flex items-center space-x-1.5 md:space-x-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border ${flags.FEATURE_AI_AUTOMATION ? 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40'}`}>
                    <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${flags.FEATURE_AI_AUTOMATION ? 'bg-teal-500 dark:bg-teal-400 dark:shadow-[0_0_5px_rgba(45,212,191,0.5)]' : 'bg-slate-300 dark:bg-white/20'}`} />
                    <span>AI</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 md:space-x-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border ${flags.FEATURE_RESTAURANT_MENU_BOOKING ? 'bg-amber-50 dark:bg-brand-cafe/10 border-amber-200 dark:border-brand-cafe/20 text-amber-700 dark:text-brand-cafe' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40'}`}>
                    <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${flags.FEATURE_RESTAURANT_MENU_BOOKING ? 'bg-amber-500 dark:bg-brand-cafe dark:shadow-[0_0_5px_rgba(217,160,91,0.5)]' : 'bg-slate-300 dark:bg-white/20'}`} />
                    <span>Cafe</span>
                  </div>
                  <div className={`flex items-center space-x-1.5 md:space-x-2 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border ${flags.FEATURE_WHATSAPP_AUTOMATION ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/40'}`}>
                    <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${flags.FEATURE_WHATSAPP_AUTOMATION ? 'bg-purple-500 dark:bg-purple-400 dark:shadow-[0_0_5px_rgba(192,132,252,0.5)]' : 'bg-slate-300 dark:bg-white/20'}`} />
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {loadingStats
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] shadow-sm dark:backdrop-blur-xl">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <div className="h-2 md:h-3 w-16 md:w-24 bg-slate-100 dark:bg-white/5 rounded-full animate-pulse" />
                          <div className="h-6 w-6 md:h-8 md:w-8 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                        </div>
                        <div className="h-6 md:h-10 w-16 md:w-28 bg-slate-100 dark:bg-white/5 rounded-lg animate-pulse" />
                      </div>
                    ))
                  : statCards.map((stat, i) => {
                      const Icon = stat.icon;
                      const isCardDisabled = stat.disabled;
                      return (
                        <div key={i} className={`p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-xl dark:backdrop-blur-xl transition-all duration-300 ${isCardDisabled ? 'opacity-50 bg-slate-50 dark:bg-white/[0.01]' : 'hover:shadow-md dark:hover:bg-white/[0.05] hover:border-slate-300'}`}>
                          <div className="flex justify-between items-start md:items-center mb-2 md:mb-4 flex-col-reverse md:flex-row gap-2 md:gap-0">
                            <span className="text-[9px] md:text-xs font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">{stat.name}</span>
                            <div className={`p-1.5 md:p-2 rounded-lg md:rounded-xl ${isCardDisabled ? 'bg-slate-100 dark:bg-white/5' : stat.bg}`}>
                              <Icon className={`w-3.5 h-3.5 md:w-5 md:h-5 ${isCardDisabled ? 'text-slate-400 dark:text-white/20' : stat.color}`} />
                            </div>
                          </div>
                          <span className="text-xl md:text-4xl font-extrabold text-slate-900 dark:text-white dark:font-light tracking-tight">
                            {isCardDisabled ? 'OFF' : stat.value}
                          </span>
                        </div>
                      );
                    })}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
                
                {/* Court Bookings */}
                <div className="xl:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white/90">Court Schedule</h3>
                    <div className="text-[10px] md:text-xs font-semibold text-slate-500 dark:text-white/40 bg-white dark:bg-white/5 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none">{bookings.length} active</div>
                  </div>
                  
                  {/* DESKTOP TABLE VIEW */}
                  <div className="hidden md:block bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl dark:rounded-3xl overflow-hidden shadow-sm dark:shadow-2xl dark:backdrop-blur-xl transition-colors duration-300">
                    {loadingBookings ? (
                      <LoadingSpinner />
                    ) : bookings.length === 0 ? (
                      <div className="py-20 text-center text-slate-400 dark:text-white/30 text-sm font-medium">No bookings found for today.</div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/[0.05]">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Player</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Time Slot</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Payment</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                          {bookings.map((bk) => (
                            <tr key={bk.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-white border border-slate-200 dark:border-transparent">
                                    {bk.user.name?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-white/90 block">{bk.user.name ?? 'Unknown Player'}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-[10px] text-slate-500 dark:text-white/40 font-medium tracking-wide">{bk.user.phone}</span>
                                      {bk.isPublic && <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Open</span>}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-semibold text-slate-800 dark:text-white/90 block text-sm">{formatDate(bk.startTime)}</span>
                                <span className="text-[11px] text-slate-500 dark:text-white/50">{formatTime(bk.startTime, bk.endTime)}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                                  bk.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                  bk.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                  'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/40'
                                }`}>
                                  {bk.paymentStatus || 'PENDING'}
                                </span>
                              </td>
                              <td className="px-6 py-4">{statusBadge(bk.status)}</td>
                              <td className="px-6 py-4 text-right">
                                {bk.status === 'PENDING' && (
                                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => updateBookingStatus(bk.id, 'CONFIRMED')}
                                      disabled={updatingBookingId === bk.id}
                                      className="px-3 py-1.5 rounded-lg bg-brand-court/10 dark:bg-brand-court/20 border border-brand-court/20 dark:border-brand-court/30 text-brand-court hover:bg-brand-court/20 dark:hover:bg-brand-court/30 transition-colors disabled:opacity-50 text-xs font-bold"
                                    >
                                      {updatingBookingId === bk.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                                    </button>
                                    <button
                                      onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                                      disabled={updatingBookingId === bk.id}
                                      className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50 text-xs font-bold"
                                    >
                                      {updatingBookingId === bk.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Decline'}
                                    </button>
                                  </div>
                                )}
                                {bk.status === 'CONFIRMED' && (
                                  <button
                                    onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                                    disabled={updatingBookingId === bk.id}
                                    className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors disabled:opacity-50 text-xs font-bold opacity-0 group-hover:opacity-100"
                                  >
                                    {updatingBookingId === bk.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Cancel'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* MOBILE CARD VIEW */}
                  <div className="md:hidden space-y-3">
                    {loadingBookings ? (
                      <LoadingSpinner />
                    ) : bookings.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 dark:text-white/30 text-xs font-medium">No bookings found for today.</div>
                    ) : (
                      bookings.map((bk) => (
                        <div key={bk.id} className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-4 shadow-sm dark:backdrop-blur-md">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                               <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-transparent flex items-center justify-center font-bold text-[10px] text-slate-600 dark:text-white">
                                 {bk.user.name?.charAt(0) || 'U'}
                               </div>
                               <div>
                                 <span className="font-bold text-slate-900 dark:text-white/90 block text-sm">{bk.user.name ?? 'Unknown'}</span>
                                 <div className="flex items-center space-x-2 mt-0.5">
                                   <span className="text-[9px] text-slate-500 dark:text-white/40 tracking-wide">{bk.user.phone}</span>
                                   {bk.isPublic && <span className="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Open</span>}
                                 </div>
                               </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              {statusBadge(bk.status)}
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold tracking-wider ${
                                  bk.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                  bk.paymentStatus === 'PARTIAL' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                  'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/40'
                                }`}>
                                  {bk.paymentStatus || 'PENDING'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-slate-50 dark:bg-white/[0.01] rounded-xl p-3 mb-3 border border-slate-100 dark:border-white/[0.02]">
                            <span className="text-slate-800 dark:text-white/80 font-bold text-xs block">{formatDate(bk.startTime)}</span>
                            <span className="text-slate-500 dark:text-white/40 text-[10px] font-medium">{formatTime(bk.startTime, bk.endTime)}</span>
                          </div>

                          <div className="flex justify-end space-x-2">
                            {bk.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                                  disabled={updatingBookingId === bk.id}
                                  className="flex-1 py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 active:scale-95 transition-all text-xs font-bold"
                                >
                                  {updatingBookingId === bk.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Decline'}
                                </button>
                                <button
                                  onClick={() => updateBookingStatus(bk.id, 'CONFIRMED')}
                                  disabled={updatingBookingId === bk.id}
                                  className="flex-1 py-2.5 rounded-xl bg-brand-court/10 dark:bg-brand-court/20 border border-brand-court/20 dark:border-brand-court/30 text-brand-court active:scale-95 transition-all text-xs font-bold"
                                >
                                  {updatingBookingId === bk.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Confirm'}
                                </button>
                              </>
                            )}
                            {bk.status === 'CONFIRMED' && (
                              <button
                                onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                                disabled={updatingBookingId === bk.id}
                                className="w-full py-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 active:scale-95 transition-all text-xs font-bold"
                              >
                                {updatingBookingId === bk.id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Cancel Booking'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Kitchen Display System (KDS) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white/90">Kitchen Display System</h3>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => { setShowInventory(true); fetchInventory(); }} className="flex items-center space-x-1.5 px-2 py-1 md:px-3 md:py-1.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 font-bold text-[10px] md:text-xs rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                        <Settings className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Inventory</span>
                      </button>
                      {flags.FEATURE_RESTAURANT_MENU_BOOKING && (
                        <div className="text-[10px] md:text-xs font-bold text-amber-700 dark:text-brand-cafe bg-amber-50 dark:bg-brand-cafe/10 px-2 py-1 md:px-3 md:py-1.5 rounded-full border border-amber-200 dark:border-brand-cafe/20">{orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length} pending</div>
                      )}
                    </div>
                  </div>
                  
                  {!flags.FEATURE_RESTAURANT_MENU_BOOKING ? (
                    <div className="bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.05] border border-dashed rounded-3xl p-8 md:p-12 text-center flex flex-col items-center">
                      <Coffee className="w-10 h-10 md:w-12 md:h-12 text-slate-300 dark:text-white/20 mb-4" />
                      <h4 className="font-bold text-slate-500 dark:text-white/60 text-sm md:text-base">Cafe Module Offline</h4>
                      <p className="text-[10px] md:text-xs text-slate-400 dark:text-white/40 mt-2 max-w-[200px]">Enable FEATURE_RESTAURANT_MENU_BOOKING to process orders.</p>
                    </div>
                  ) : loadingOrders ? (
                    <LoadingSpinner />
                  ) : orders.length === 0 ? (
                    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-3xl p-8 md:p-12 text-center text-slate-400 dark:text-white/30 text-xs md:text-sm font-medium shadow-sm dark:shadow-none">
                      No food orders in the queue.
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4 max-h-[600px] md:max-h-[800px] overflow-y-auto scrollbar-hide md:pr-2">
                      {orders.map((order) => {
                        let parsedItems: { name: string; quantity: number }[] = [];
                        try { parsedItems = JSON.parse(order.items); } catch {}

                        return (
                          <div key={order.id} className="bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.08] rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm dark:shadow-lg dark:backdrop-blur-xl relative overflow-hidden group hover:shadow-md transition-shadow">
                            
                            {/* Status Line */}
                            <div className={`absolute top-0 left-0 w-1 md:w-1.5 h-full ${order.status === 'PENDING' ? 'bg-amber-400' : order.status === 'PREPARING' ? 'bg-blue-400' : 'bg-emerald-400'}`} />

                            <div className="flex justify-between items-start mb-3 md:mb-4">
                              <div className="pl-2">
                                <div className="flex items-center space-x-2 mb-0.5">
                                  <span className="font-extrabold text-slate-900 dark:text-white/90 block text-xs md:text-sm">
                                    {order.tableNumber 
                                      ? `Deliver to: ${order.tableNumber.replace('Court A', 'Court')}` 
                                      : 'Takeaway'}
                                  </span>
                                  <LiveTimer createdAt={order.createdAt} />
                                </div>
                                <span className="text-[9px] md:text-[11px] text-slate-500 dark:text-white/40 font-medium">{order.user.name || 'Unknown'} · {formatDate(order.createdAt)}</span>
                              </div>
                              {statusBadge(order.status)}
                            </div>

                            {/* Order Items */}
                            <div className="p-3 md:p-4 bg-slate-50 dark:bg-white/[0.02] rounded-xl md:rounded-2xl border border-slate-100 dark:border-white/[0.04] mb-3 md:mb-4">
                              <ul className="space-y-2">
                                {parsedItems.map((item, idx) => (
                                  <li key={idx} className="flex justify-between items-center text-xs md:text-sm">
                                    <span className="font-semibold text-slate-700 dark:text-white/80">{item.name}</span>
                                    <span className="font-bold text-slate-500 dark:text-white/60 bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent px-1.5 py-0.5 rounded text-[10px] md:text-xs shadow-sm dark:shadow-none">x{item.quantity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Footer & Actions */}
                            <div className="flex items-center justify-between pt-2">
                              <span className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-brand-cafe pl-2">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                              
                              <div className="flex items-center space-x-2">
                                {order.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                      disabled={updatingOrderId === order.id}
                                      className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl active:scale-95 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all disabled:opacity-50"
                                    >
                                      {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <AlertCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                                      <span>Decline</span>
                                    </button>
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                      disabled={updatingOrderId === order.id}
                                      className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-cafe text-white font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl active:scale-95 hover:bg-brand-cafe/90 transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(140,126,115,0.3)] disabled:opacity-50"
                                    >
                                      {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <ChefHat className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                                      <span>Accept</span>
                                    </button>
                                  </>
                                )}
                                {order.status === 'PREPARING' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                    disabled={updatingOrderId === order.id}
                                    className="flex items-center space-x-1.5 md:space-x-2 px-3 py-1.5 md:px-4 md:py-2 bg-brand-court text-white font-bold text-[10px] md:text-xs rounded-lg md:rounded-xl active:scale-95 hover:bg-brand-court/90 transition-all shadow-sm dark:shadow-[0_4px_15px_rgba(155,159,96,0.3)] disabled:opacity-50"
                                  >
                                    {updatingOrderId === order.id ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                                    <span>Ready</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

          {/* =========================================
              MEMBERS TAB 
              ========================================= */}
          {activeNav === 'members' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl dark:backdrop-blur-xl transition-colors duration-300">
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-white/[0.05] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white/90">Member Directory</h3>
                    <p className="text-xs text-slate-500 dark:text-white/50 mt-1">Manage and view all registered users at the club.</p>
                  </div>
                  <div className="flex items-center bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-lg">
                    <Users className="w-4 h-4 text-slate-400 dark:text-white/40 mr-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-white/80">{members.length} Total Users</span>
                  </div>
                </div>

                {loadingMembers ? (
                  <LoadingSpinner />
                ) : members.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 dark:text-white/30 text-sm font-medium">No members found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/[0.05]">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">User</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Contact</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Role</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-widest">Joined Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                        {members.map((member) => (
                          <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-white border border-slate-200 dark:border-transparent">
                                  {member.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 dark:text-white/90 block">{member.name ?? 'Unknown'}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-1">
                                <span className="flex items-center text-xs font-medium text-slate-700 dark:text-white/80">
                                  <Smartphone className="w-3 h-3 mr-1.5 text-slate-400 dark:text-white/40" />
                                  {member.phone}
                                </span>
                                {member.email && (
                                  <span className="flex items-center text-xs text-slate-500 dark:text-white/50">
                                    <Mail className="w-3 h-3 mr-1.5 text-slate-300 dark:text-white/30" />
                                    {member.email}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${
                                member.role === 'OWNER' 
                                  ? 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400' 
                                  : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/50'
                              }`}>
                                {member.role === 'OWNER' && <Shield className="w-3 h-3 mr-1" />}
                                {member.role}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-xs text-slate-500 dark:text-white/50 font-medium">
                                {formatDate(member.createdAt)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =========================================
              SETTINGS TAB 
              ========================================= */}
          {activeNav === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-2xl shadow-sm dark:shadow-xl dark:backdrop-blur-xl overflow-hidden transition-colors duration-300">
                <div className="p-4 md:p-6 border-b border-slate-100 dark:border-white/[0.05]">
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white/90">Feature Flags</h3>
                  <p className="text-xs text-slate-500 dark:text-white/50 mt-1">Manage global system modules and capabilities.</p>
                </div>
                <div className="p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white/90 text-sm">Restaurant & Cafe Module</h4>
                      <p className="text-xs text-slate-500 dark:text-white/50 mt-1">Enable Cafe Brio food ordering and Kitchen Display System.</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${flags.FEATURE_RESTAURANT_MENU_BOOKING ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40'}`}>
                      {flags.FEATURE_RESTAURANT_MENU_BOOKING ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white/90 text-sm">WhatsApp Bot Automation</h4>
                      <p className="text-xs text-slate-500 dark:text-white/50 mt-1">Enable automated push notifications via WhatsApp.</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${flags.FEATURE_WHATSAPP_AUTOMATION ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40'}`}>
                      {flags.FEATURE_WHATSAPP_AUTOMATION ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white/90 text-sm">AI Copilot</h4>
                      <p className="text-xs text-slate-500 dark:text-white/50 mt-1">Enable AI-assisted scheduling and analytics.</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${flags.FEATURE_AI_AUTOMATION ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40'}`}>
                      {flags.FEATURE_AI_AUTOMATION ? 'ENABLED' : 'DISABLED'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* MOBILE Floating Navigation Dock */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-sm">
        <div className="bg-white dark:bg-white/[0.08] dark:backdrop-blur-3xl border border-slate-200 dark:border-white/10 px-4 py-2.5 rounded-full flex justify-between items-center shadow-lg dark:shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-colors duration-300">
          <button 
            onClick={() => setActiveNav('dashboard')} 
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-90 ${activeNav === 'dashboard' ? 'text-brand-court dark:drop-shadow-[0_0_10px_rgba(0,180,216,0.5)]' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/60'}`}
          >
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wide">Dash</span>
          </button>
          
          <button 
            onClick={() => setActiveNav('members')} 
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-90 ${activeNav === 'members' ? 'text-brand-court dark:drop-shadow-[0_0_10px_rgba(0,180,216,0.5)]' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/60'}`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wide">Users</span>
          </button>
          
          <button 
            onClick={() => setActiveNav('settings')} 
            className={`flex flex-col items-center justify-center w-16 transition-all active:scale-90 ${activeNav === 'settings' ? 'text-slate-900 dark:text-white dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-slate-400 dark:text-white/40 hover:text-slate-600 dark:hover:text-white/60'}`}
          >
            <Settings className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-bold tracking-wide">Settings</span>
          </button>
        </div>
      </div>

    </div>
  );
}
