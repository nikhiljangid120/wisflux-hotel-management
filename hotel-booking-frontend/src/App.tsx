import CreateHotelForm from './components/CreateHotelForm';
import CreateRoomTypeForm from './components/CreateRoomTypeForm';
import CreateGuestForm from './components/CreateGuestForm';
import AvailabilityForm from './components/AvailabilityForm';
import BookingHoldForm from './components/BookingHoldForm';
import BookingActions from './components/BookingActions';
import BookingTable from './components/BookingTable';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold tracking-tight text-slate-800">Hotel Booking Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <CreateHotelForm />
          <CreateRoomTypeForm />
          <CreateGuestForm />
          <AvailabilityForm />
          <BookingHoldForm />
          <BookingActions />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <BookingTable />
        </div>
      </main>
    </div>
  );
}

export default App;
