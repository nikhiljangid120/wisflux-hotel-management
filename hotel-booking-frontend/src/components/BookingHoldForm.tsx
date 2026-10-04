import { useState } from 'react';
import api from '../api/axios';

export default function BookingHoldForm() {
  const [guestId, setGuestId] = useState('');
  const [roomTypeId, setRoomTypeId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        guestId: parseInt(guestId),
        roomTypeId: parseInt(roomTypeId),
        checkIn,
        checkOut
      };
      const res = await api.post('/bookings/hold', payload);
      setMessage(`Booking Hold created! ID: ${res.data.id}, Status: ${res.data.status}`);
      setGuestId(''); setRoomTypeId(''); setCheckIn(''); setCheckOut('');
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-5">Create Booking Hold</h2>
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Guest ID</label>
            <input type="number" value={guestId} onChange={e => setGuestId(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Room Type ID</label>
            <input type="number" value={roomTypeId} onChange={e => setRoomTypeId(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Check In</label>
            <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Check Out</label>
            <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <button type="submit" className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Hold Room</button>
        </div>
      </form>
      {message && <p className="mt-4 text-sm text-slate-600 break-words">{message}</p>}
    </div>
  );
}
