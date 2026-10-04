import { useState } from 'react';
import api from '../api/axios';

export default function CreateHotelForm() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/hotels', { name, city, address });
      setMessage(`Hotel created with ID: ${res.data.id}`);
      setName(''); setCity(''); setAddress('');
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-5">Create Hotel</h2>
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">City</label>
          <input type="text" value={city} onChange={e => setCity(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Address</label>
          <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div className="mt-auto pt-4">
          <button type="submit" className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Create Hotel</button>
        </div>
      </form>
      {message && <p className="mt-4 text-sm text-slate-600 break-words">{message}</p>}
    </div>
  );
}
