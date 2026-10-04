import { useState } from 'react';
import api from '../api/axios';

export default function CreateRoomTypeForm() {
  const [hotelId, setHotelId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        hotel_id: parseInt(hotelId),
        name: name.trim(),
        description: description.trim(),
        capacity: parseInt(capacity),
        base_price: parseFloat(basePrice)
      };
      const res = await api.post('/room-types', payload);
      setMessage(`Room Type created with ID: ${res.data.id}`);
      setHotelId(''); setName(''); setDescription(''); setCapacity(''); setBasePrice('');
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-5">Create Room Type</h2>
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Hotel ID</label>
            <input type="number" value={hotelId} onChange={e => setHotelId(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Capacity</label>
            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Description</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Base Price</label>
          <input type="number" step="0.01" value={basePrice} onChange={e => setBasePrice(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div className="mt-auto pt-4">
          <button type="submit" className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Create Room Type</button>
        </div>
      </form>
      {message && <p className="mt-4 text-sm text-slate-600 break-words">{message}</p>}
    </div>
  );
}
