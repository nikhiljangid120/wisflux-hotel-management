import React from 'react';
import { 
  Crown, 
  LayoutDashboard, 
  CalendarDays, 
  Building2, 
  Users, 
  TrendingUp, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export type TabType = 'dashboard' | 'reservations' | 'properties' | 'guests' | 'pricing';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onRefreshAll: () => void;
  isRefreshing: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onRefreshAll,
  isRefreshing,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'reservations', label: 'Availability & Holds', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'properties', label: 'Hotels & Suites', icon: <Building2 className="w-4 h-4" /> },
    { id: 'guests', label: 'Guest Concierge', icon: <Users className="w-4 h-4" /> },
    { id: 'pricing', label: 'Dynamic Pricing', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#090D16]/85 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#AA8010] to-[#593E05] p-[1px] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-[#0B0F19] flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-wider font-luxury text-white">AURA GRAND</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
                  ENTERPRISE OS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Hotel & Reservation Intelligence Suite</p>
            </div>
          </div>

          {/* Cloud System Health Indicators */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <a 
              href="https://wisflux-hotel-service.onrender.com" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-medium">Render API: Live</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/30 text-indigo-300">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-medium">Neon PostgreSQL SSL</span>
            </div>

            <button
              onClick={onRefreshAll}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-white/10 hover:border-white/20 transition-all text-xs font-medium cursor-pointer"
              title="Refresh all data from cloud backend"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 scrollbar-none border-t border-white/5 pt-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/10 to-transparent text-[#FFF7D6] border border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#D4AF37]' : 'text-slate-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
