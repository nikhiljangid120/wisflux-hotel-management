# 🏨 Hotel Booking Platform — Backend

A robust REST API backend for the Hotel Booking Management System, built with **NestJS**, **TypeORM**, and **PostgreSQL**.

## 🛠️ Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Scheduling**: @nestjs/schedule
- **API Docs**: Swagger UI (`/api`)
- **Containerization**: Docker / Docker Compose

## 📁 Module Structure

```
src/
├── modules/
│   ├── hotels/         # Hotel CRUD operations
│   ├── room-types/     # Room type definitions & pricing
│   ├── guests/         # Guest registration & management
│   ├── bookings/       # Booking lifecycle management
│   ├── availability/   # Real-time availability queries
│   ├── pricing/        # Dynamic pricing rules engine
│   └── jobs/           # Cron jobs (auto-expire holds)
├── config/             # Database & app configuration
├── common/             # Shared DTOs, guards, interceptors
└── database/           # Database migrations & seeds
```

## ⚙️ Setup & Installation

### 1. Clone and install
```bash
git clone https://github.com/nikhiljangid120/wisflux-hotel-management.git
cd wisflux-hotel-management/hotel-booking-platform
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=hotel_booking_db

NODE_ENV=development
```

### 3. Start PostgreSQL (via Docker)
```bash
docker-compose up -d
```

### 4. Run the application
```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 📚 API Documentation

Once running, open: **`http://localhost:3000/api`** (Swagger UI)

### Key Endpoints

| Method | Endpoint                    | Description                    |
|--------|-----------------------------|--------------------------------|
| POST   | `/hotels`                   | Create a hotel                 |
| GET    | `/hotels`                   | List all hotels                |
| POST   | `/room-types`               | Create a room type             |
| GET    | `/room-types`               | List all room types            |
| POST   | `/guests`                   | Register a guest               |
| GET    | `/availability`             | Check room availability        |
| POST   | `/bookings/hold`            | Place a booking hold           |
| POST   | `/bookings/:id/confirm`     | Confirm a booking              |
| POST   | `/bookings/:id/cancel`      | Cancel a booking               |
| GET    | `/bookings`                 | List all bookings              |

## 🔄 Automated Jobs

The `JobsModule` runs scheduled cron tasks to:
- Auto-expire booking holds after a configurable timeout
- Clean up stale/cancelled bookings

## 👨‍💻 Author

**Nikhil Jangid** — Intern at Wisflux Tech Labs, Jaipur
