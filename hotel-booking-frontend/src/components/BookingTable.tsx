import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function BookingTable() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err: any) {
      setError(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-slate-800">All Bookings</h2>
        <button onClick={fetchBookings} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors">Refresh</button>
      </div>
      {error && <p className="text-sm text-red-600 mb-4 break-words">{error}</p>}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 tracking-wider">ID</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 tracking-wider">Guest</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 tracking-wider">Room</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 tracking-wider">Dates</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 tracking-wider">Expires At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{b.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{b.guest_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{b.room_type_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {new Date(b.check_in).toLocaleDateString()} &rarr; {new Date(b.check_out).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-md border 
                    ${b.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      b.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                      b.status === 'EXPIRED' ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                    {b.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {b.expires_at ? new Date(b.expires_at).toLocaleTimeString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
