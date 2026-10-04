import React, { useState } from 'react';
import { 
  Search, 
  Check, 
  X, 
  Clock, 
  RefreshCw, 
  Calendar, 
  User, 
  BedDouble, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import type { Booking, BookingStatus, Guest, RoomType } from '../types';
import api from '../api/axios';

interface BookingTableProps {
  bookings: Booking[];
  guests: Guest[];
  roomTypes: RoomType[];
  onRefresh: () => void;
  isRefreshing: boolean;
  onToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  guests,
  roomTypes,
  onRefresh,
  isRefreshing,
  onToast,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Helper maps for quick lookup
  const guestMap = new Map(guests.map((g) => [g.id, g.full_name]));
  const roomMap = new Map(roomTypes.map((rt) => [rt.id, rt.name]));
  const roomPriceMap = new Map(roomTypes.map((rt) => [rt.id, rt.base_price]));

  const handleAction = async (bookingId: number, action: 'confirm' | 'cancel') => {
    setProcessingId(bookingId);
    try {
      const res = await api.patch(`/bookings/${bookingId}/${action}`);
      const newStatus = res.data.status;
      onToast(
        'success',
        action === 'confirm' ? 'Reservation Confirmed! 🥂' : 'Booking Hold Cancelled',
        `Booking #${bookingId} status is now ${newStatus}`
      );
      onRefresh();
    } catch (err: any) {
      onToast(
        'error',
        `Failed to ${action} booking`,
        err.response?.data?.message || err.message
      );
    } finally {
      setProcessingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const guestName = guestMap.get(b.guest_id) || '';
    const roomName = roomMap.get(b.room_type_id) || '';
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      b.id.toString().includes(query) ||
      guestName.toLowerCase().includes(query) ||
      roomName.toLowerCase().includes(query) ||
      b.status.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            CONFIRMED
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse">
            <Clock className="w-3 h-3 text-amber-400" />
            HOLD PENDING
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            CANCELLED
          </span>
        );
      case 'EXPIRED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            EXPIRED
          </span>
        );
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-luxury text-white">Reservation Ledger</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-[#D4AF37]/15 text-[#F3E5AB] font-semibold border border-[#D4AF37]/30">
              {bookings.length} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time synchronization with Render backend & Neon cloud database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, guest, room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="luxury-input pl-9 pr-4 py-2 w-full text-xs"
            />
          </div>

          {/* Status Filter Pills */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 text-xs">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  filterStatus === st
                    ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 border-b border-white/5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">ID</th>
              <th className="py-4 px-6">Guest Profile</th>
              <th className="py-4 px-6">Suite / Room</th>
              <th className="py-4 px-6">Dates of Stay</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Hold Expiry</th>
              <th className="py-4 px-6 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-200">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-white/10 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <p className="text-base font-medium text-slate-300">No reservations found</p>
                    <p className="text-xs text-slate-500 max-w-sm">
                      {searchQuery
                        ? `No bookings matched "${searchQuery}". Try clearing filters.`
                        : 'Create your first room hold or reservation to populate the ledger.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => {
                const guestName = guestMap.get(b.guest_id) || `Guest #${b.guest_id}`;
                const roomName = roomMap.get(b.room_type_id) || `Room Type #${b.room_type_id}`;
                const price = roomPriceMap.get(b.room_type_id);
                const isProcessing = processingId === b.id;

                const checkInDate = new Date(b.check_in).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const checkOutDate = new Date(b.check_out).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Booking ID */}
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-[#D4AF37]">
                      #{b.id}
                    </td>

                    {/* Guest Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300">
                          <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="font-semibold text-white tracking-wide">{guestName}</p>
                          <p className="text-[11px] text-slate-400">ID: {b.guest_id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Suite / Room */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <BedDouble className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-200">{roomName}</p>
                          {price && (
                            <p className="text-[11px] text-[#D4AF37]">₹{price} / night</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Dates of Stay */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{checkInDate}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="font-medium">{checkOutDate}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">{getStatusBadge(b.status)}</td>

                    {/* Hold Expiry */}
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {b.expires_at ? (
                        <div className="flex items-center gap-1.5 font-mono">
                          <Clock className="w-3 h-3 text-amber-400/80" />
                          <span>{new Date(b.expires_at).toLocaleTimeString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>

                    {/* Direct Row Actions */}
                    <td className="py-4 px-6 text-right">
                      {b.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAction(b.id, 'confirm')}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Confirm Booking"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirm</span>
                          </button>
                          <button
                            onClick={() => handleAction(b.id, 'cancel')}
                            disabled={isProcessing}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Release Hold"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Release</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No actions needed</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;
