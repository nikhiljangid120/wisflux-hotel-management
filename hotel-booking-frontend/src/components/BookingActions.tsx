import { useState } from 'react';
import api from '../api/axios';

export default function BookingActions() {
  const [bookingId, setBookingId] = useState('');
  const [message, setMessage] = useState('');

  const handleAction = async (action: 'confirm' | 'cancel') => {
    if (!bookingId) {
      setMessage('Please enter a booking ID');
      return;
    }
    try {
      const res = await api.patch(`/bookings/${bookingId}/${action}`);
      setMessage(`Success: Booking ${bookingId} is now ${res.data.status}`);
      setBookingId('');
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-5">Booking Actions</h2>
      <div className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Booking ID</label>
          <input type="number" value={bookingId} onChange={e => setBookingId(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
          <button onClick={() => handleAction('confirm')} className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Confirm</button>
          <button onClick={() => handleAction('cancel')} className="w-full bg-white border border-slate-300 text-slate-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Cancel</button>
        </div>
      </div>
      {message && <p className="mt-4 text-sm text-slate-600 break-words">{message}</p>}
    </div>
  );
}
