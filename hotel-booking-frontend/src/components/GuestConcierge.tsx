import React, { useState } from 'react';
import { Users, UserPlus, Mail, Phone } from 'lucide-react';
import type { Guest } from '../types';
import api from '../api/axios';

interface GuestConciergeProps {
  guests: Guest[];
  onRefresh: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const GuestConcierge: React.FC<GuestConciergeProps> = ({
  guests,
  onRefresh,
  onToast,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/guests', {
        full_name: fullName.trim(),
        email: email.trim(),
        phone_number: phoneNumber.trim(),
      });
      onToast(
        'success',
        'VIP Guest Registered! 🥂',
        `"${res.data.full_name}" registered with ID #${res.data.id}`
      );
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      onRefresh();
    } catch (err: any) {
      onToast('error', 'Registration Failed', err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-luxury text-white">VIP Guest Concierge & Profiles</h2>
          <p className="text-xs text-slate-400">Manage client directory, contact records, and reservation privileges</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
          {guests.length} Registered Guests
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Guest Registration Form */}
        <div className="glass-panel p-7 rounded-2xl border border-white/10 shadow-2xl h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-luxury text-white">Register VIP Guest</h3>
              <p className="text-xs text-slate-400">Add a new guest record to the database</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Maharani Gayatri Devi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="luxury-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. guest@royalpalace.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="luxury-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="luxury-input w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full gold-gradient-btn py-3 px-4 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Enrolling VIP Guest...
                </span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Guest Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Guest Directory Cards */}
        <div className="lg:col-span-2">
          {guests.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl border border-white/10 text-center text-slate-400">
              <Users className="w-10 h-10 text-[#D4AF37] mx-auto mb-3 opacity-60" />
              <p className="text-base font-medium text-slate-300">No guest profiles enrolled yet</p>
              <p className="text-xs text-slate-500 mt-1">Use the registration form on the left to add your first guest.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guests.map((g) => (
                <div
                  key={g.id}
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-bold text-[#D4AF37]">
                        {g.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-wide text-sm">{g.full_name}</h4>
                        <span className="text-[11px] font-mono text-[#D4AF37]">Guest ID: #{g.id}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
                      VIP Guest
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{g.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{g.phone_number}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestConcierge;
