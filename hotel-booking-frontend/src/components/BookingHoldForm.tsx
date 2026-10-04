import React, { useState } from 'react';
import { Lock, User, BedDouble, Check, Clock } from 'lucide-react';
import type { Guest, RoomType } from '../types';
import api from '../api/axios';

interface BookingHoldFormProps {
  guests: Guest[];
  roomTypes: RoomType[];
  initialRoomId?: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  onBookingCreated: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const BookingHoldForm: React.FC<BookingHoldFormProps> = ({
  guests,
  roomTypes,
  initialRoomId,
  initialCheckIn,
  initialCheckOut,
  onBookingCreated,
  onToast,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [guestId, setGuestId] = useState<string>(
    guests.length > 0 ? guests[0].id.toString() : ''
  );
  const [roomTypeId, setRoomTypeId] = useState<string>(
    initialRoomId ? initialRoomId.toString() : roomTypes.length > 0 ? roomTypes[0].id.toString() : ''
  );
  const [checkIn, setCheckIn] = useState<string>(
    initialCheckIn || tomorrow.toISOString().split('T')[0]
  );
  const [checkOut, setCheckOut] = useState<string>(
    initialCheckOut || dayAfter.toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [latestBooking, setLatestBooking] = useState<any>(null);

  // Sync if initial props change
  React.useEffect(() => {
    if (initialRoomId) setRoomTypeId(initialRoomId.toString());
    if (initialCheckIn) setCheckIn(initialCheckIn);
    if (initialCheckOut) setCheckOut(initialCheckOut);
  }, [initialRoomId, initialCheckIn, initialCheckOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestId || !roomTypeId) {
      onToast('error', 'Missing Information', 'Please select both a guest and a room type.');
      return;
    }
    setIsSubmitting(true);
    setLatestBooking(null);

    try {
      const payload = {
        guestId: parseInt(guestId),
        roomTypeId: parseInt(roomTypeId),
        checkIn,
        checkOut,
      };
      const res = await api.post('/bookings/hold', payload);
      setLatestBooking(res.data);
      onToast(
        'success',
        'Booking Hold Created! ⏳',
        `Hold placed for Booking #${res.data.id}. Temporary hold expires in 15 mins.`
      );
      onBookingCreated();
    } catch (err: any) {
      onToast(
        'error',
        'Hold Creation Failed',
        err.response?.data?.message || err.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmNow = async () => {
    if (!latestBooking) return;
    try {
      await api.patch(`/bookings/${latestBooking.id}/confirm`);
      onToast(
        'success',
        'Stay Confirmed! 🥂',
        `Booking #${latestBooking.id} is now officially CONFIRMED.`
      );
      setLatestBooking(null);
      onBookingCreated();
    } catch (err: any) {
      onToast('error', 'Confirmation Failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 flex flex-col justify-between shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-luxury text-white">Create Booking Hold</h3>
            <p className="text-xs text-slate-400">Lock room inventory with automated expiration</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Guest Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Guest
            </label>
            <div className="relative">
              <select
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
                className="luxury-input w-full appearance-none pr-9 cursor-pointer"
                required
              >
                {guests.length === 0 ? (
                  <option value="">No guests registered yet (add in Guest Concierge)</option>
                ) : (
                  guests.map((g) => (
                    <option key={g.id} value={g.id} className="bg-slate-900 text-white">
                      {g.full_name} (ID: {g.id}) — {g.email}
                    </option>
                  ))
                )}
              </select>
              <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Room Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Suite / Room Type
            </label>
            <div className="relative">
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                className="luxury-input w-full appearance-none pr-9 cursor-pointer"
                required
              >
                {roomTypes.length === 0 ? (
                  <option value="">No room types created yet</option>
                ) : (
                  roomTypes.map((rt) => (
                    <option key={rt.id} value={rt.id} className="bg-slate-900 text-white">
                      {rt.name} (ID: {rt.id}) — ₹{rt.base_price}/night
                    </option>
                  ))
                )}
              </select>
              <BedDouble className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
                className="luxury-input w-full cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="luxury-input w-full cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !guestId || !roomTypeId}
            className="w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all mt-4"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Creating Booking Hold...
              </span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Place Temporary Room Hold</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Banner with Instant Confirmation Trigger */}
      {latestBooking && (
        <div className="mt-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Hold Active: #{latestBooking.id}
              </span>
            </div>
            <span className="text-[11px] font-mono bg-black/40 px-2 py-0.5 rounded text-amber-300">
              STATUS: {latestBooking.status}
            </span>
          </div>
          <p className="text-xs text-amber-200/80 mb-3">
            Room inventory is reserved temporarily. You can confirm it right now or let the guest review.
          </p>
          <button
            type="button"
            onClick={handleConfirmNow}
            className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Confirm Booking #{latestBooking.id} Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingHoldForm;
