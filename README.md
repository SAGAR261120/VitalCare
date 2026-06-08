# VitalCare — Full-Stack Healthcare Platform

Enterprise-grade healthcare ecosystem with **fully dynamic, API-driven content** — no hardcoded data in mobile or admin UI.

## Project Structure

```
VitalCare/
├── android-app/        # React Native CLI mobile app
├── admin-panel/        # React + TypeScript admin dashboard
├── backend-nodejs/     # Node.js + Express + MongoDB API
├── database-seed/      # Comprehensive seed scripts
├── documentation/      # Platform documentation
└── docs/               # Legacy API docs
```

## Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)
- Android Studio (for mobile)

## Quick Start

### 1. Start MongoDB
Ensure MongoDB is running on `mongodb://localhost:27017`

### 2. Seed Database
```bash
cd database-seed
npm install
npm run seed          # First time
npm run seed:reset    # Reset & re-seed all data
```

### 3. Start Backend
```bash
cd backend-nodejs
npm install
npm run dev           # http://localhost:5000
```

### 4. Start Admin Panel
```bash
cd admin-panel
npm install
npm run dev           # http://localhost:5173
```

### 5. Start Mobile App
```bash
cd android-app
npm install
npm start             # Terminal 1 - Metro
npm run android       # Terminal 2 - Build
```

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | SuperAdmin@123 |
| Admin | admin@test.com | Admin@123 |
| User | user@test.com | User@123 |

Also seeds: 3 additional admins, 50 users, categories, banners, health packages, specialists, membership/insurance plans, rewards, FAQs, cities, notifications, activity logs.

## What's Dynamic

Everything in the mobile app and admin panel is fetched from MongoDB via REST APIs:

- Home banners, health packages, specialists, insurance
- Onboarding slides, drawer menu items, app settings
- Membership & insurance plans, reward tasks
- Appointments, user rewards, activity history
- Search results, support phone/WhatsApp numbers
- Admin CMS for all content types

## Admin Panel CMS

Manage content at:
- `/content/banners` — Promotional banners
- `/content/packages` — Health checkup packages
- `/content/specialists` — Doctor profiles
- `/content/membership` — Membership plans
- `/content/insurance` — Insurance plans
- `/content/categories` — Content categories
- `/content/onboarding` — Onboarding slides
- `/content/rewards` — Reward tasks

## Documentation

- [documentation/README.md](./documentation/README.md) — Architecture & modules
- [documentation/API.md](./documentation/API.md) — Extended API reference
- [docs/API.md](./docs/API.md) — Auth & user management APIs

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Mobile | React Native CLI, TypeScript, Zustand, Reanimated, Axios, MMKV |
| Admin | React, TypeScript, MUI, Redux Toolkit, React Query, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO, Winston |

## License

MIT
