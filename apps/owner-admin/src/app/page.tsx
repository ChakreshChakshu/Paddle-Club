import { getAllFlags } from '@paddle-club/feature-flags';
import { Card, CardContent, Button } from '@paddle-club/ui';
import { 
  Calendar, 
  DollarSign, 
  Coffee, 
  MessageSquare, 
  Sliders, 
  AlertCircle, 
  Clock 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const flags = getAllFlags();

  // Mock statistics
  const stats = [
    { name: 'Total Bookings', value: '48', change: '+12% from last week', icon: Calendar, color: 'text-teal-400' },
    { name: 'Court Revenue', value: '₹24,500', change: '+18% this month', icon: DollarSign, color: 'text-emerald-400' },
    { name: 'Cafe Brio Sales', value: '₹14,200', change: '+5% this week', icon: Coffee, color: 'text-amber-400', disabled: !flags.FEATURE_RESTAURANT_MENU_BOOKING },
    { name: 'WhatsApp Logs', value: '189 messages', change: '89% AI Auto-handled', icon: MessageSquare, color: 'text-blue-400', disabled: !flags.FEATURE_WHATSAPP_AUTOMATION },
  ];

  const recentBookings = [
    { id: '1', customer: 'Amit Sharma', court: 'Court A (Teal)', time: '05:00 PM - 06:00 PM', date: '16 July 2026', status: 'CONFIRMED', price: '₹450' },
    { id: '2', customer: 'Preeti Singh', court: 'Court C (Padel)', time: '07:00 PM - 08:00 PM', date: '16 July 2026', status: 'PENDING', price: '₹800' },
    { id: '3', customer: 'Rohan Gupta', court: 'Court B (Neon)', time: '08:00 PM - 09:00 PM', date: '17 July 2026', status: 'CONFIRMED', price: '₹450' },
  ];

  const recentChats = [
    { id: 'c1', phone: '+91 98989 12345', text: 'Are slots open for Court A tonight at 7 PM?', handler: 'AI Agent', time: '5 mins ago' },
    { id: 'c2', phone: '+91 97123 45678', text: 'Confirming booking for table 5', handler: 'System webhook', time: '12 mins ago' },
    { id: 'c3', phone: '+91 88123 09876', text: 'I want to cancel my court slot for tomorrow', handler: 'Requires Owner review', time: '1 hr ago' },
  ];

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
          <Button variant="outline" size="sm">
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
          {stats.map((stat, i) => {
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
                    {isCardDisabled ? 'Feature flag is disabled' : stat.change}
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-900/60 border-b border-brand-dark-border text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Court</th>
                        <th className="px-6 py-4">Time Slot</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-dark-border">
                      {recentBookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-slate-900/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">{bk.customer}</td>
                          <td className="px-6 py-4 text-xs">{bk.court}</td>
                          <td className="px-6 py-4 text-xs">
                            <span className="block">{bk.date}</span>
                            <span className="text-[10px] text-slate-400">{bk.time}</span>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-200">{bk.price}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bk.status === 'CONFIRMED' 
                                ? 'bg-emerald-950/50 border border-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-950/50 border border-amber-500/20 text-amber-400'
                            }`}>
                              {bk.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* WhatsApp Automation Interactions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white font-display">WhatsApp automation</h3>
            {!flags.FEATURE_WHATSAPP_AUTOMATION ? (
              <Card className="border-dashed flex items-center justify-center p-8 min-h-[300px] text-center">
                <CardContent className="space-y-2">
                  <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="font-semibold text-slate-300">WhatsApp Offline</h4>
                  <p className="text-xs text-slate-500">Enable `FEATURE_WHATSAPP_AUTOMATION` in feature flags to activate logs.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 space-y-4 max-h-[350px] overflow-y-auto">
                  {recentChats.map((chat) => (
                    <div key={chat.id} className="p-3 bg-slate-900/40 border border-brand-dark-border rounded-lg space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">{chat.phone}</span>
                        <span className="text-[10px] text-slate-500">{chat.time}</span>
                      </div>
                      <p className="text-xs text-slate-300 italic">"{chat.text}"</p>
                      <div className="flex justify-between items-center pt-1.5 border-t border-brand-dark-border text-[9px] font-bold text-slate-400">
                        <span>Handler:</span>
                        <span className={chat.handler.includes('AI') ? 'text-teal-400' : 'text-slate-400'}>
                          {chat.handler}
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
