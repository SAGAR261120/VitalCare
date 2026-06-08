# VitalCare — Full-Stack Healthcare Platform

Enterprise-grade healthcare platform with Android mobile app, web admin panel, and Node.js API.

## Project Structure

```
VitalCare/
├── android-app/       # React Native CLI (Android)
├── admin-panel/       # React + TypeScript Admin Dashboard
├── backend-nodejs/    # Node.js + Express + MongoDB API
├── docs/              # Documentation
└── README.md
```

## Tech Stack

| Component | Technologies |
|-----------|-------------|
| Mobile App | React Native CLI, TypeScript, Zustand, React Navigation, Reanimated |
| Admin Panel | React, TypeScript, Material UI, Redux Toolkit, React Query, Recharts |
| Backend | Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO, Winston |

## Prerequisites

- Node.js 22+
- MongoDB (local or Atlas)
- Android Studio (for mobile app)
- JDK 17+

## Quick Start

### 1. Backend API

```bash
cd backend-nodejs
cp .env.example .env
npm install
npm run seed    # Seed test users
npm run dev     # Start on http://localhost:5000
```

### 2. Admin Panel

```bash
cd admin-panel
npm install
npm run dev     # Start on http://localhost:5173
```

Login with: `admin@test.com` / `Admin@123`

### 3. Android App

```bash
cd android-app
npm install
npm start       # Metro bundler
npm run android # Build & run on emulator/device
```

> Android emulator connects to API via `10.0.2.2:5000`

## Seed Users

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | SuperAdmin@123 |
| Admin | admin@test.com | Admin@123 |
| Test User | user@test.com | User@123 |

## Features

### Mobile App
- Splash, Onboarding, Login, Register, OTP, Forgot Password
- Profile management, Dashboard, Notifications, Settings
- Dark/Light theme, Offline detection, Secure token storage

### Admin Panel
- Dashboard with analytics charts
- User management (CRUD, search, filter, pagination)
- Admin management with permissions (Super Admin)
- Push notifications & broadcast messages
- Profile, application, and theme settings

### Backend API
- JWT + Refresh token authentication
- Role-based access control (RBAC)
- Password encryption (bcrypt)
- REST API with validation middleware
- Socket.IO real-time notifications
- File upload support
- Activity logging

## API Documentation

See [docs/API.md](./docs/API.md) for complete endpoint reference.

## Architecture

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## Environment Variables

### Backend (`backend-nodejs/.env`)
```
MONGODB_URI=mongodb://localhost:27017/vitalcare
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=5000
```

### Admin Panel (`admin-panel/.env`)
```
VITE_API_URL=http://localhost:5000/api/v1
```

## Development

Run all three services in separate terminals:

```bash
# Terminal 1 - Backend
cd backend-nodejs && npm run dev

# Terminal 2 - Admin Panel
cd admin-panel && npm run dev

# Terminal 3 - Mobile App
cd android-app && npm start
# Terminal 4 - Android build
cd android-app && npm run android
```

## License

MIT
