import React, { useState } from 'react';
import { Calculator, Sparkles } from 'lucide-react';
import type { RoomType } from '../types';

interface PricingEngineProps {
  roomTypes: RoomType[];
}

export const PricingEngine: React.FC<PricingEngineProps> = ({ roomTypes }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    roomTypes.length > 0 ? roomTypes[0].id.toString() : ''
  );
  const [occupancyRate, setOccupancyRate] = useState<number>(75);
  const [isWeekend, setIsWeekend] = useState<boolean>(true);
  const [isHolidaySeason, setIsHolidaySeason] = useState<boolean>(false);

  const selectedRoom = roomTypes.find((r) => r.id === parseInt(selectedRoomId));
  const baseRate = selectedRoom ? parseFloat(selectedRoom.base_price.toString()) : 2499;

  // Dynamic Multipliers
  let multiplier = 1.0;
  if (occupancyRate >= 80) multiplier += 0.25; // 25% surge for high occupancy
  else if (occupancyRate >= 60) multiplier += 0.10;
  if (isWeekend) multiplier += 0.15; // 15% weekend surge
  if (isHolidaySeason) multiplier += 0.30; // 30% festival/holiday surge

  const finalRate = Math.round(baseRate * multiplier);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-bold font-luxury text-white">Dynamic Pricing & Yield Rules Engine</h2>
        <p className="text-xs text-slate-400">Algorithmic revenue optimization based on occupancy, seasonal demand, and booking velocity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Interactive Simulator */}
        <div className="lg:col-span-2 glass-panel p-7 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-luxury text-white">Live Rate Simulator</h3>
              <p className="text-xs text-slate-400">Simulate algorithmic rate adjustments in real-time</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Room Category
              </label>
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="luxury-input w-full cursor-pointer"
              >
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id} className="bg-slate-900 text-white">
                    {rt.name} — Base Price: ₹{rt.base_price}/night
                  </option>
                ))}
              </select>
            </div>

            {/* Occupancy Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                <span>Estate Occupancy Level</span>
                <span className="text-[#D4AF37] font-bold">{occupancyRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={occupancyRate}
                onChange={(e) => setOccupancyRate(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Low Demand (10%)</span>
                <span>Normal (50%)</span>
                <span>Peak Surge (100%)</span>
              </div>
            </div>

            {/* Switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <span className="text-xs font-medium text-slate-300">Weekend Surge (+15%)</span>
                <input
                  type="checkbox"
                  checked={isWeekend}
                  onChange={(e) => setIsWeekend(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-white/10 cursor-pointer hover:border-white/20 transition-all">
                <span className="text-xs font-medium text-slate-300">Jaipur Heritage Festival (+30%)</span>
                <input
                  type="checkbox"
                  checked={isHolidaySeason}
                  onChange={(e) => setIsHolidaySeason(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D4AF37] accent-[#D4AF37] cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Dynamic Rate Card */}
        <div className="glass-panel-gold p-7 rounded-2xl border flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Calculated Nightly Rate
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                {multiplier > 1.0 ? `+${Math.round((multiplier - 1.0) * 100)}% Surge` : 'Standard'}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white font-sans tracking-tight">
                  ₹{finalRate.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">/ night</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-through">
                Base Price: ₹{baseRate.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Base Room Rate</span>
                <span>₹{baseRate}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Occupancy Yield Adj.</span>
                <span>+{occupancyRate >= 80 ? '25%' : occupancyRate >= 60 ? '10%' : '0%'}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Weekend Factor</span>
                <span>{isWeekend ? '+15%' : '0%'}</span>
              </div>
              <div className="flex justify-between text-amber-300">
                <span>Festival Multiplier</span>
                <span>{isHolidaySeason ? '+30%' : '0%'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Automated cron job updates room hold expirations and pricing indices continuously.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingEngine;
