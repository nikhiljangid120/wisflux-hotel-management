# 🏨 Hotel Booking Dashboard — Frontend

A modern, responsive React dashboard for managing hotel bookings, built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Linting**: ESLint + TypeScript ESLint

## 🌟 Features

- **Create Hotel** — Register new hotels in the system
- **Create Room Type** — Define room categories with amenities & pricing
- **Register Guest** — Add new guests to the platform
- **Check Availability** — Query available rooms for specific dates
- **Hold a Room** — Place a temporary booking hold
- **Booking Actions** — Confirm or cancel existing bookings
- **Bookings Table** — View all bookings in a sortable table

## 📁 Project Structure

```
src/
├── api/
│   └── axios.ts          # Axios instance (base URL config)
├── components/
│   ├── AvailabilityForm.tsx      # Room availability checker
│   ├── BookingActions.tsx        # Confirm/Cancel booking
│   ├── BookingHoldForm.tsx       # Place booking hold
│   ├── BookingTable.tsx          # All bookings overview
│   ├── CreateGuestForm.tsx       # Guest registration
│   ├── CreateHotelForm.tsx       # Hotel creation
│   └── CreateRoomTypeForm.tsx    # Room type creation
├── App.tsx               # Main application layout
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## ⚙️ Setup & Installation

```bash
git clone https://github.com/nikhiljangid120/wisflux-hotel-management.git
cd wisflux-hotel-management/hotel-booking-frontend
npm install
npm run dev
```

App runs at: **`http://localhost:5173`**

> **Note**: Make sure the backend (`hotel-booking-platform`) is running on `http://localhost:3000` before using the frontend.

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 🌐 Deployment

The frontend is deployed on **Vercel**. Environment variable for production API:
```
VITE_API_BASE_URL=https://your-backend-url.com
```

## 👨‍💻 Author

**Nikhil Jangid** — Intern at Wisflux Tech Labs, Jaipur  
GitHub: [@nikhiljangid120](https://github.com/nikhiljangid120)
