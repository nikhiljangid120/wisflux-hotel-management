import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import type { TabType } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { BookingTable } from './components/BookingTable';
import { AvailabilityForm } from './components/AvailabilityForm';
import { BookingHoldForm } from './components/BookingHoldForm';
import { PropertyManager } from './components/PropertyManager';
import { GuestConcierge } from './components/GuestConcierge';
import { PricingEngine } from './components/PricingEngine';
import { ToastContainer } from './components/Toast';
import type { ToastMessage } from './components/Toast';
import type { Booking, Guest, Hotel, RoomType } from './types';
import api from './api/axios';
import { Crown, ExternalLink } from 'lucide-react';

function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Pre-fill hold form state when selecting room from availability
  const [holdInitialRoomId, setHoldInitialRoomId] = useState<number | undefined>();
  const [holdInitialCheckIn, setHoldInitialCheckIn] = useState<string | undefined>();
  const [holdInitialCheckOut, setHoldInitialCheckOut] = useState<string | undefined>();

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchAllData = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const [bookingsRes, hotelsRes, roomTypesRes, guestsRes] = await Promise.allSettled([
        api.get('/bookings'),
        api.get('/hotels'),
        api.get('/room-types'),
        api.get('/guests'),
      ]);

      if (bookingsRes.status === 'fulfilled') setBookings(bookingsRes.value.data);
      if (hotelsRes.status === 'fulfilled') setHotels(hotelsRes.value.data);
      if (roomTypesRes.status === 'fulfilled') setRoomTypes(roomTypesRes.value.data);
      if (guestsRes.status === 'fulfilled') setGuests(guestsRes.value.data);

      if (!silent) {
        addToast('success', 'System Synchronized', 'Latest data loaded from cloud database.');
      }
    } catch (err: any) {
      addToast('error', 'Sync Failed', err.message || 'Could not reach backend');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData(true);
  }, [fetchAllData]);

  const handleSelectForHold = (roomId: number, checkIn: string, checkOut: string) => {
    setHoldInitialRoomId(roomId);
    setHoldInitialCheckIn(checkIn);
    setHoldInitialCheckOut(checkOut);
    setCurrentTab('reservations');
    addToast('info', 'Dates & Suite Populated', 'Proceed with guest selection to complete room hold.');
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white relative">
      {/* Background Luxury Ambient Glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onRefreshAll={() => fetchAllData(false)}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Key Performance Indicators */}
        <StatsBar bookings={bookings} hotels={hotels} roomTypes={roomTypes} />

        {/* Tab 1: Executive Dashboard */}
        {currentTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <BookingTable
              bookings={bookings}
              guests={guests}
              roomTypes={roomTypes}
              onRefresh={() => fetchAllData(true)}
              isRefreshing={isRefreshing}
              onToast={addToast}
            />

            {/* Quick Reservation Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              <AvailabilityForm
                roomTypes={roomTypes}
                onSelectForHold={handleSelectForHold}
                onToast={addToast}
              />
              <BookingHoldForm
                guests={guests}
                roomTypes={roomTypes}
                initialRoomId={holdInitialRoomId}
                initialCheckIn={holdInitialCheckIn}
                initialCheckOut={holdInitialCheckOut}
                onBookingCreated={() => fetchAllData(true)}
                onToast={addToast}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Availability & Holds */}
        {currentTab === 'reservations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <AvailabilityForm
              roomTypes={roomTypes}
              onSelectForHold={handleSelectForHold}
              onToast={addToast}
            />
            <BookingHoldForm
              guests={guests}
              roomTypes={roomTypes}
              initialRoomId={holdInitialRoomId}
              initialCheckIn={holdInitialCheckIn}
              initialCheckOut={holdInitialCheckOut}
              onBookingCreated={() => fetchAllData(true)}
              onToast={addToast}
            />
          </div>
        )}

        {/* Tab 3: Properties & Suites */}
        {currentTab === 'properties' && (
          <div className="animate-in fade-in duration-300">
            <PropertyManager
              hotels={hotels}
              roomTypes={roomTypes}
              onRefresh={() => fetchAllData(true)}
              onToast={addToast}
            />
          </div>
        )}

        {/* Tab 4: Guest Concierge */}
        {currentTab === 'guests' && (
          <div className="animate-in fade-in duration-300">
            <GuestConcierge
              guests={guests}
              onRefresh={() => fetchAllData(true)}
              onToast={addToast}
            />
          </div>
        )}

        {/* Tab 5: Dynamic Pricing */}
        {currentTab === 'pricing' && (
          <div className="animate-in fade-in duration-300">
            <PricingEngine roomTypes={roomTypes} />
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-white/10 bg-[#070A12]/80 backdrop-blur-xl py-8 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-luxury font-bold text-white tracking-wider">AURA GRAND RESORTS</span>
            <span className="text-slate-600">•</span>
            <span>Wisflux Tech Labs Internship 3rd Assignment</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/nikhiljangid120/wisflux-hotel-management"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700">|</span>
            <a
              href="https://wisflux-hotel-service.onrender.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"
            >
              <span>Render Backend</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500">Nikhil Jangid</span>
          </div>
        </div>
      </footer>

      {/* Floating Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
