import React, { useState } from 'react';
import { Building2, Plus, BedDouble, MapPin } from 'lucide-react';
import type { Hotel, RoomType } from '../types';
import api from '../api/axios';

interface PropertyManagerProps {
  hotels: Hotel[];
  roomTypes: RoomType[];
  onRefresh: () => void;
  onToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const PropertyManager: React.FC<PropertyManagerProps> = ({
  hotels,
  roomTypes,
  onRefresh,
  onToast,
}) => {
  // Hotel form state
  const [hotelName, setHotelName] = useState('');
  const [hotelCity, setHotelCity] = useState('');
  const [hotelAddress, setHotelAddress] = useState('');
  const [isSubmittingHotel, setIsSubmittingHotel] = useState(false);

  // Room type form state
  const [selectedHotelId, setSelectedHotelId] = useState<string>(
    hotels.length > 0 ? hotels[0].id.toString() : ''
  );
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('2');
  const [roomPrice, setRoomPrice] = useState('2499');
  const [isSubmittingRoom, setIsSubmittingRoom] = useState(false);

  const handleCreateHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingHotel(true);
    try {
      const res = await api.post('/hotels', {
        name: hotelName.trim(),
        city: hotelCity.trim(),
        address: hotelAddress.trim(),
      });
      onToast(
        'success',
        'Hotel Created! 🏨',
        `"${res.data.name}" registered with ID #${res.data.id}`
      );
      setHotelName('');
      setHotelCity('');
      setHotelAddress('');
      onRefresh();
    } catch (err: any) {
      onToast('error', 'Failed to create hotel', err.response?.data?.message || err.message);
    } finally {
      setIsSubmittingHotel(false);
    }
  };

  const handleCreateRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelId) {
      onToast('error', 'Select a Hotel', 'Please pick a parent hotel for this room type.');
      return;
    }
    setIsSubmittingRoom(true);
    try {
      const payload = {
        hotel_id: parseInt(selectedHotelId),
        name: roomName.trim(),
        description: roomDesc.trim(),
        capacity: parseInt(roomCapacity),
        base_price: parseFloat(roomPrice),
      };
      const res = await api.post('/room-types', payload);
      onToast(
        'success',
        'Room Type Configured! 🛏️',
        `"${res.data.name}" added with base price ₹${res.data.base_price}`
      );
      setRoomName('');
      setRoomDesc('');
      setRoomCapacity('2');
      setRoomPrice('2499');
      onRefresh();
    } catch (err: any) {
      onToast('error', 'Failed to create room type', err.response?.data?.message || err.message);
    } finally {
      setIsSubmittingRoom(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Existing Inventory Showcase */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold font-luxury text-white">Registered Properties & Suites</h2>
            <p className="text-xs text-slate-400">Live view of configured hotel estates and room categories</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30">
            {hotels.length} Estates • {roomTypes.length} Suites
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hotels.map((h) => {
            const hotelSuites = roomTypes.filter((r) => r.hotel_id === h.id);
            return (
              <div
                key={h.id}
                className="glass-panel-gold p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base font-luxury tracking-wide">{h.name}</h3>
                      <p className="text-xs text-[#D4AF37] font-mono">Hotel ID: #{h.id}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{h.address}, {h.city}</span>
                </div>

                {/* Suites Inside Hotel */}
                <div className="border-t border-white/10 pt-3">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Room Categories ({hotelSuites.length})
                  </span>
                  {hotelSuites.length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No room types assigned yet</p>
                  ) : (
                    <div className="space-y-1.5">
                      {hotelSuites.map((rt) => (
                        <div
                          key={rt.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-black/20 text-xs text-slate-300 border border-white/5"
                        >
                          <div className="flex items-center gap-1.5">
                            <BedDouble className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span className="font-medium text-white">{rt.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-400">Cap: {rt.capacity}</span>
                            <span className="font-bold text-[#F3E5AB]">₹{rt.base_price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Creation Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form 1: Create Hotel */}
        <div className="glass-panel p-7 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-luxury text-white">Register New Hotel Property</h3>
              <p className="text-xs text-slate-400">Add an estate destination into the management registry</p>
            </div>
          </div>

          <form onSubmit={handleCreateHotel} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Hotel Name
              </label>
              <input
                type="text"
                placeholder="e.g. Wisflux Palace & Spa"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
                className="luxury-input w-full"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur"
                  value={hotelCity}
                  onChange={(e) => setHotelCity(e.target.value)}
                  required
                  className="luxury-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. C-Scheme, Tonk Road"
                  value={hotelAddress}
                  onChange={(e) => setHotelAddress(e.target.value)}
                  required
                  className="luxury-input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingHotel}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-wide bg-slate-800 hover:bg-slate-700 text-white border border-white/10 hover:border-white/25 flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
            >
              {isSubmittingHotel ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Registering Estate...
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Create Hotel Property</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Form 2: Create Room Type */}
        <div className="glass-panel p-7 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-luxury text-white">Configure Suite / Room Type</h3>
              <p className="text-xs text-slate-400">Define capacity, base pricing, and amenities</p>
            </div>
          </div>

          <form onSubmit={handleCreateRoomType} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Target Hotel Estate
              </label>
              <select
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
                required
                className="luxury-input w-full cursor-pointer"
              >
                {hotels.length === 0 ? (
                  <option value="">No hotels registered yet</option>
                ) : (
                  hotels.map((h) => (
                    <option key={h.id} value={h.id} className="bg-slate-900 text-white">
                      {h.name} (#{h.id}) — {h.city}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Room Type Name
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Maharaja Suite"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                className="luxury-input w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Description & Amenities
              </label>
              <input
                type="text"
                placeholder="e.g. King canopy bed, palace balcony, jacuzzi bath"
                value={roomDesc}
                onChange={(e) => setRoomDesc(e.target.value)}
                className="luxury-input w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Guest Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(e.target.value)}
                  required
                  className="luxury-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Base Price (₹ / night)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={roomPrice}
                  onChange={(e) => setRoomPrice(e.target.value)}
                  required
                  className="luxury-input w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingRoom || !selectedHotelId}
              className="w-full gold-gradient-btn py-3 px-4 rounded-xl text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all mt-4"
            >
              {isSubmittingRoom ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Configuring Category...
                </span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Room Type</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PropertyManager;
