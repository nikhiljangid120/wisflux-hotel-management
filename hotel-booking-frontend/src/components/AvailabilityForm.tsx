import React, { useState } from 'react';
import { Search, BedDouble, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import type { RoomType } from '../types';
import api from '../api/axios';

interface AvailabilityFormProps {
  roomTypes: RoomType[];
  onSelectForHold?: (roomTypeId: number, checkIn: string, checkOut: string) => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  roomTypes,
  onSelectForHold,
  onToast,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    roomTypes.length > 0 ? roomTypes[0].id.toString() : ''
  );
  const [checkIn, setCheckIn] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [checkOut, setCheckOut] = useState<string>(dayAfter.toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId) {
      onToast('error', 'Select a Room Type', 'Please pick a room type to check availability.');
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const res = await api.get('/availability/search', {
        params: {
          roomTypeId: selectedRoomId,
          checkIn,
          checkOut,
        },
      });
      setResult(res.data);
      if (res.data.available) {
        onToast(
          'success',
          'Rooms Available! ✨',
          `${res.data.remaining} rooms currently available for selected dates.`
        );
      } else {
        onToast(
          'info',
          'No Vacancy',
          'Selected room type is fully occupied for these dates.'
        );
      }
    } catch (err: any) {
      onToast(
        'error',
        'Search Failed',
        err.response?.data?.message || err.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const currentRoom = roomTypes.find((r) => r.id === parseInt(selectedRoomId));

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
      {/* Decorative luxury gradient */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <Search className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-luxury text-white">Live Availability Engine</h3>
              <p className="text-xs text-slate-400">Query real-time capacity and occupancy rules</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Room Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Suite / Room Type
            </label>
            <div className="relative">
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="luxury-input w-full appearance-none pr-9 cursor-pointer"
              >
                {roomTypes.length === 0 ? (
                  <option value="">No room types created yet</option>
                ) : (
                  roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id} className="bg-slate-900 text-white">
                      {rt.name} (ID: {rt.id}) — Capacity: {rt.capacity} guests • ₹{rt.base_price}/night
                    </option>
                  ))
                )}
              </select>
              <BedDouble className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {currentRoom && (
              <p className="text-[11px] text-slate-400 mt-1 italic">
                "{currentRoom.description || 'Standard luxury accommodation'}"
              </p>
            )}
          </div>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Check In Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="luxury-input w-full cursor-pointer"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Check Out Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="luxury-input w-full cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedRoomId}
            className="w-full gold-gradient-btn py-3 px-4 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all mt-4"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Querying Inventory...
              </span>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Search Real-Time Availability</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <div className="mt-6 pt-5 border-t border-white/10 animate-in fade-in duration-300">
          <div
            className={`p-4 rounded-xl border backdrop-blur-md ${
              result.available
                ? 'bg-emerald-950/40 border-emerald-500/30'
                : 'bg-rose-950/40 border-rose-500/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {result.available ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span
                  className={`text-sm font-bold tracking-wide ${
                    result.available ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {result.available ? 'Available for Booking' : 'Fully Booked / Unavailable'}
                </span>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono">
                {result.remaining} / {result.capacity} Remaining
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className={`h-full transition-all duration-500 ${
                  result.remaining > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(((result.capacity - result.remaining) / (result.capacity || 1)) * 100)
                  )}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-slate-300 text-center mb-3">
              <div className="p-2 rounded-lg bg-black/20">
                <span className="block text-[10px] uppercase text-slate-400">Total</span>
                <span className="font-bold text-white text-sm">{result.capacity}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <span className="block text-[10px] uppercase text-slate-400">Occupied</span>
                <span className="font-bold text-amber-300 text-sm">{result.occupied}</span>
              </div>
              <div className="p-2 rounded-lg bg-black/20">
                <span className="block text-[10px] uppercase text-slate-400">Available</span>
                <span className="font-bold text-emerald-300 text-sm">{result.remaining}</span>
              </div>
            </div>

            {result.available && onSelectForHold && (
              <button
                type="button"
                onClick={() =>
                  onSelectForHold(parseInt(selectedRoomId), checkIn, checkOut)
                }
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>Hold This Room Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityForm;
