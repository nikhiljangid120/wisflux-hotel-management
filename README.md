# 🏨 Hotel Booking Management System

> **3rd Assignment** — Internship at **Wisflux Tech Labs, Jaipur**

A full-stack Hotel Booking Management System built with **NestJS** (backend) and **React + TypeScript + Vite** (frontend), featuring real-time availability tracking, dynamic pricing, booking hold management, and automated job scheduling.

---

## 📁 Project Structure

```
wisflux-3rd-assignment/
├── hotel-booking-platform/    # Backend — NestJS + PostgreSQL + TypeORM
└── hotel-booking-frontend/    # Frontend — React + TypeScript + Vite + Tailwind CSS
```

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Backend    | NestJS, TypeORM, PostgreSQL, Swagger            |
| Frontend   | React 19, TypeScript, Vite, Tailwind CSS v4     |
| Database   | PostgreSQL (via Docker or local)                |
| Scheduling | @nestjs/schedule (cron jobs)                    |
| API Docs   | Swagger UI (`/api`)                             |

---

## ✨ Features

- 🏨 **Hotel Management** — Create and manage hotels
- 🛏️ **Room Type Management** — Define room types with pricing and capacity
- 👤 **Guest Management** — Register and manage guests
- 📅 **Availability Checking** — Real-time room availability queries
- 🔒 **Booking Holds** — Temporarily hold rooms before confirming
- ✅ **Booking Actions** — Confirm or cancel bookings
- 💰 **Dynamic Pricing** — Pricing rules engine per room type
- ⚙️ **Automated Jobs** — Cron jobs to auto-expire stale holds
- 📊 **Booking Dashboard** — Full booking overview table on the frontend

---

## 🛠️ Quick Start

### Prerequisites
- Node.js >= 18
- PostgreSQL (or Docker)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/nikhiljangid120/wisflux-hotel-management.git
cd wisflux-hotel-management
```

### 2. Start the Backend
```bash
cd hotel-booking-platform
cp .env.example .env        # Fill in your DB credentials
npm install
npm run start:dev
```
Backend runs at: `http://localhost:3000`  
Swagger API docs: `http://localhost:3000/api`

### 3. Start the Frontend
```bash
cd hotel-booking-frontend
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🌐 Live Demo

- **Frontend**: [Deployed on Vercel](#) *(link after deployment)*
- **Backend API Docs**: [Swagger UI](#) *(link after deployment)*

---

## 👨‍💻 Author

**Nikhil Jangid**  
Intern at **Wisflux Tech Labs, Jaipur**  
GitHub: [@nikhiljangid120](https://github.com/nikhiljangid120)  
Email: nikhilverse58@gmail.com

---

## 📄 License

This project is for educational/internship purposes.
