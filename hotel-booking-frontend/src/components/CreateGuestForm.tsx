import { useState } from 'react';
import api from '../api/axios';

export default function CreateGuestForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/guests', { full_name: fullName, email, phone_number: phoneNumber });
      setMessage(`Guest created with ID: ${res.data.id}`);
      setFullName(''); setEmail(''); setPhoneNumber('');
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800 mb-5">Create Guest</h2>
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Full Name</label>
          <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-shadow" />
        </div>
        <div className="mt-auto pt-4">
          <button type="submit" className="w-full bg-slate-900 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors">Create Guest</button>
        </div>
      </form>
      {message && <p className="mt-4 text-sm text-slate-600 break-words">{message}</p>}
    </div>
  );
}
