import React from 'react';
import { BookmarkCheck, Clock, CheckCircle2, Building, ArrowUpRight } from 'lucide-react';
import type { Booking, Hotel, RoomType } from '../types';

interface StatsBarProps {
  bookings: Booking[];
  hotels: Hotel[];
  roomTypes: RoomType[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ bookings, hotels, roomTypes }) => {
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmed = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const totalRooms = roomTypes.reduce((acc, rt) => acc + (rt.capacity || 1), 0);

  const stats = [
    {
      label: 'Total Bookings',
      value: total,
      sub: `${bookings.length} reservations logged`,
      icon: <BookmarkCheck className="w-5 h-5 text-[#D4AF37]" />,
      borderGlow: 'border-[#D4AF37]/30 hover:border-[#D4AF37]/60',
      badge: 'All Time',
      badgeColor: 'bg-[#D4AF37]/15 text-[#F3E5AB]',
    },
    {
      label: 'Active Holds',
      value: pending,
      sub: 'Awaiting guest confirmation',
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      borderGlow: 'border-amber-500/30 hover:border-amber-500/60',
      badge: `${pending} Pending`,
      badgeColor: 'bg-amber-500/15 text-amber-300',
    },
    {
      label: 'Confirmed Stays',
      value: confirmed,
      sub: `${total > 0 ? Math.round((confirmed / total) * 100) : 0}% conversion rate`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      borderGlow: 'border-emerald-500/30 hover:border-emerald-500/60',
      badge: 'Guaranteed',
      badgeColor: 'bg-emerald-500/15 text-emerald-300',
    },
    {
      label: 'Properties & Suites',
      value: `${hotels.length} / ${roomTypes.length}`,
      sub: `${totalRooms} total guest capacity`,
      icon: <Building className="w-5 h-5 text-cyan-400" />,
      borderGlow: 'border-cyan-500/30 hover:border-cyan-500/60',
      badge: 'Inventory',
      badgeColor: 'bg-cyan-500/15 text-cyan-300',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`glass-panel p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5 ${stat.borderGlow}`}
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-white/5 blur-2xl group-hover:bg-[#D4AF37]/10 transition-all pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {stat.label}
            </span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
              {stat.value}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${stat.badgeColor}`}>
              {stat.badge}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span>{stat.sub}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
          </p>
        </div>
      ))}
    </div>
  );
};
