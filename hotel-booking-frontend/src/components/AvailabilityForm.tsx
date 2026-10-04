import { useState } from 'react';
import api from '../api/axios';

export default function AvailabilityForm() {
  const [roomTypeId, setRoomTypeId] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const res = await api.get('/availability/search', {
        params: { roomTypeId, checkIn, checkOut }
      });
      setResult(res.data);
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-5">Check Availability</h2>
      <form onSubmit={handleSearch} className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Room Type ID</label>
          <input type="number" value={roomTypeId} onChange={e => setRoomTypeId(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
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
          <button type="submit" className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Search</button>
        </div>
      </form>
      {error && <p className="mt-4 text-sm text-red-600 break-words">{error}</p>}
      {result && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Available:</span> <span>{result.available ? 'Yes' : 'No'}</span>
            <span className="font-medium">Capacity:</span> <span>{result.capacity}</span>
            <span className="font-medium">Occupied:</span> <span>{result.occupied}</span>
            <span className="font-medium">Remaining:</span> <span>{result.remaining}</span>
          </div>
        </div>
      )}
    </div>
  );
}
