'use client';

import * as React from 'react';
import { getAllFlags } from '@paddle-club/feature-flags';
import { Card, CardContent, Button } from '@paddle-club/ui';
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
  XCircle,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';

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

export default function AdminDashboardPage() {
  const flags = getAllFlags();

  const [stats, setStats] = React.useState<Stats | null>(null);
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loadingStats, setLoadingStats] = React.useState(true);
  const [loadingBookings, setLoadingBookings] = React.useState(true);
  const [loadingOrders, setLoadingOrders] = React.useState(true);
  const [updatingBookingId, setUpdatingBookingId] = React.useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

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

  const fetchAll = React.useCallback(() => {
    setLoadingStats(true);
    setLoadingBookings(true);
    setLoadingOrders(true);
    setError(null);
    fetchStats();
    fetchBookings();
    fetchOrders();
  }, [fetchStats, fetchBookings, fetchOrders]);

  React.useEffect(() => {
    fetchAll();
    
    // Auto-refresh every 5 seconds to simulate real-time socket connection
    const interval = setInterval(() => {
      // We don't want to show the full-page loading spinner on background polls
      fetch('/api/admin/stats').then(res => res.json()).then(setStats).catch(() => {});
      fetch('/api/admin/bookings').then(res => res.json()).then(setBookings).catch(() => {});
      fetch('/api/admin/orders').then(res => res.json()).then(setOrders).catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchAll]);

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
    } catch (e) {
      alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
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
    } catch (e) {
      alert(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
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
    { name: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: Calendar, color: 'text-teal-400' },
    { name: 'Court Revenue', value: `₹${(stats?.courtRevenue ?? 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'text-emerald-400' },
    { name: 'Cafe Brio Sales', value: `₹${(stats?.cafeRevenue ?? 0).toLocaleString('en-IN')}`, icon: Coffee, color: 'text-amber-400', disabled: !flags.FEATURE_RESTAURANT_MENU_BOOKING },
    { name: 'WhatsApp Logs', value: '—', icon: MessageSquare, color: 'text-blue-400', disabled: !flags.FEATURE_WHATSAPP_AUTOMATION },
  ];

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      CONFIRMED: 'bg-emerald-950/50 border border-emerald-500/20 text-emerald-400',
      PENDING: 'bg-amber-950/50 border border-amber-500/20 text-amber-400',
      CANCELLED: 'bg-red-950/50 border border-red-500/20 text-red-400',
      PREPARING: 'bg-blue-950/50 border border-blue-500/20 text-blue-400',
      COMPLETED: 'bg-emerald-950/50 border border-emerald-500/20 text-emerald-400',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[status] ?? 'bg-slate-800 text-slate-400'}`}>
        {status}
      </span>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-dark text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-brand-dark-border bg-brand-dark-card/50 backdrop-blur px-8 py-5 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold font-display tracking-tight text-white">
            THE PADDLE CLUB <span className="text-brand-court">ADMIN</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-brand-dark-border text-slate-400 text-[10px] font-semibold tracking-wider">
            OWNER PORTAL
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={fetchAll}>
            Refresh Data
          </Button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8">

        {/* Header Title */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white font-display">Dashboard</h1>
            <p className="text-slate-400 text-sm">Real-time overview of The Paddle Club Agra operations</p>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-brand-dark-card px-3.5 py-1.5 rounded-lg border border-brand-dark-border">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Last sync: Just now</span>
          </div>
        </div>

        {/* Global Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">Dismiss</button>
          </div>
        )}

        {/* Feature Flags Status Banner */}
        <div className="p-4 rounded-xl border border-brand-dark-border bg-brand-dark-card/30 flex flex-wrap gap-6 items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-4 h-4 text-brand-court" />
            <span className="text-xs font-semibold text-slate-300">Feature Toggle Status:</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-medium">
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${flags.FEATURE_AI_AUTOMATION ? 'bg-teal-400' : 'bg-slate-600'}`} />
              <span className="text-slate-400">AI Automations: {flags.FEATURE_AI_AUTOMATION ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${flags.FEATURE_RESTAURANT_MENU_BOOKING ? 'bg-teal-400' : 'bg-slate-600'}`} />
              <span className="text-slate-400">Cafe Ordering: {flags.FEATURE_RESTAURANT_MENU_BOOKING ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${flags.FEATURE_WHATSAPP_AUTOMATION ? 'bg-teal-400' : 'bg-slate-600'}`} />
              <span className="text-slate-400">WhatsApp Automation: {flags.FEATURE_WHATSAPP_AUTOMATION ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loadingStats
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-2">
                      <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
                      <div className="h-5 w-5 bg-slate-800 rounded animate-pulse" />
                    </div>
                    <div className="h-9 w-20 bg-slate-800 rounded animate-pulse mt-2" />
                    <div className="h-3 w-32 bg-slate-800 rounded animate-pulse mt-3" />
                  </CardContent>
                </Card>
              ))
            : statCards.map((stat, i) => {
                const Icon = stat.icon;
                const isCardDisabled = stat.disabled;
                return (
                  <Card key={i} className={isCardDisabled ? 'opacity-40 cursor-not-allowed border-dashed' : ''}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</span>
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                      </div>
                      <span className="text-3xl font-bold text-white block tracking-tight font-display">
                        {isCardDisabled ? 'OFFLINE' : stat.value}
                      </span>
                      <span className="text-xs text-slate-400 mt-1 block">
                        {isCardDisabled ? 'Feature flag is disabled' : '\u00A0'}
                      </span>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {/* Bottom Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Court Bookings */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-white font-display">Recent Bookings</h3>
            <Card>
              <CardContent className="p-0">
                {loadingBookings ? (
                  <LoadingSpinner />
                ) : bookings.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-sm">No bookings yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead className="bg-slate-900/60 border-b border-brand-dark-border text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4">Customer</th>
                          <th className="px-6 py-4">Court</th>
                          <th className="px-6 py-4">Time Slot</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-dark-border">
                        {bookings.map((bk) => (
                          <tr key={bk.id} className="hover:bg-slate-900/30 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-semibold text-white block">{bk.user.name ?? 'Unknown'}</span>
                              <span className="text-[10px] text-slate-500">{bk.user.phone}</span>
                            </td>
                            <td className="px-6 py-4 text-xs">{bk.court.name}</td>
                            <td className="px-6 py-4 text-xs">
                              <span className="block">{formatDate(bk.startTime)}</span>
                              <span className="text-[10px] text-slate-400">{formatTime(bk.startTime, bk.endTime)}</span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-200">₹{bk.totalAmount.toLocaleString('en-IN')}</td>
                            <td className="px-6 py-4">{statusBadge(bk.status)}</td>
                            <td className="px-6 py-4 text-right">
                              {bk.status === 'PENDING' && (
                                <div className="flex items-center justify-end space-x-2">
                                  <button
                                    onClick={() => updateBookingStatus(bk.id, 'CONFIRMED')}
                                    disabled={updatingBookingId === bk.id}
                                    className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                                    title="Confirm"
                                  >
                                    {updatingBookingId === bk.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                                    disabled={updatingBookingId === bk.id}
                                    className="p-1.5 rounded-lg bg-red-950/50 border border-red-500/20 text-red-400 hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                    title="Cancel"
                                  >
                                    {updatingBookingId === bk.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              )}
                              {bk.status === 'CONFIRMED' && (
                                <button
                                  onClick={() => updateBookingStatus(bk.id, 'CANCELLED')}
                                  disabled={updatingBookingId === bk.id}
                                  className="p-1.5 rounded-lg bg-red-950/50 border border-red-500/20 text-red-400 hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                  title="Cancel"
                                >
                                  {updatingBookingId === bk.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Orders + WhatsApp */}
          <div className="space-y-8">

            {/* Cafe Brio Orders */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-display flex items-center space-x-2">
                <UtensilsCrossed className="w-5 h-5 text-brand-cafe" />
                <span>Cafe Brio Orders</span>
              </h3>
              {!flags.FEATURE_RESTAURANT_MENU_BOOKING ? (
                <Card className="border-dashed flex items-center justify-center p-8 text-center">
                  <CardContent className="space-y-2">
                    <Coffee className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="font-semibold text-slate-300">Cafe Offline</h4>
                    <p className="text-xs text-slate-500">Enable FEATURE_RESTAURANT_MENU_BOOKING to activate ordering.</p>
                  </CardContent>
                </Card>
              ) : loadingOrders ? (
                <Card>
                  <LoadingSpinner />
                </Card>
              ) : orders.length === 0 ? (
                <Card>
                  <div className="py-12 text-center text-slate-500 text-sm">No orders yet.</div>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                    {orders.map((order) => {
                      let parsedItems: { name: string; quantity: number }[] = [];
                      try {
                        parsedItems = JSON.parse(order.items);
                      } catch {
                        parsedItems = [];
                      }

                      return (
                        <div key={order.id} className="p-3 bg-slate-900/40 border border-brand-dark-border rounded-lg space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-200">{order.user.name ?? 'Unknown'}</span>
                            {statusBadge(order.status)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {order.tableNumber && (
                              <span className="text-brand-cafe font-semibold">{order.tableNumber} · </span>
                            )}
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="text-xs text-slate-300">
                            {parsedItems.map((item, idx) => (
                              <span key={idx}>
                                {item.name} × {item.quantity}{idx < parsedItems.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-brand-dark-border">
                            <span className="text-sm font-bold text-brand-cafe">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                            <div className="flex items-center space-x-1.5">
                              {order.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                    disabled={updatingOrderId === order.id}
                                    className="p-1.5 rounded-lg bg-blue-950/50 border border-blue-500/20 text-blue-400 hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                                    title="Start Preparing"
                                  >
                                    {updatingOrderId === order.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <ChefHat className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <button
                                    onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                                    disabled={updatingOrderId === order.id}
                                    className="p-1.5 rounded-lg bg-red-950/50 border border-red-500/20 text-red-400 hover:bg-red-900/50 transition-colors disabled:opacity-50"
                                    title="Cancel Order"
                                  >
                                    {updatingOrderId === order.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <XCircle className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </>
                              )}
                              {order.status === 'PREPARING' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                                  disabled={updatingOrderId === order.id}
                                  className="p-1.5 rounded-lg bg-emerald-950/50 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-900/50 transition-colors disabled:opacity-50"
                                  title="Mark Completed"
                                >
                                  {updatingOrderId === order.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* WhatsApp Automation Interactions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white font-display">WhatsApp automation</h3>
              {!flags.FEATURE_WHATSAPP_AUTOMATION ? (
                <Card className="border-dashed flex items-center justify-center p-8 text-center">
                  <CardContent className="space-y-2">
                    <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="font-semibold text-slate-300">WhatsApp Offline</h4>
                    <p className="text-xs text-slate-500">Enable FEATURE_WHATSAPP_AUTOMATION to activate logs.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4 text-center py-12">
                    <p className="text-xs text-slate-500">No WhatsApp messages yet.</p>
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
