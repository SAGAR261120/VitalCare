# VitalCare — Full-Stack Platform Documentation

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Android App    │────▶│  Backend API    │────▶│    MongoDB      │
│  (React Native) │     │  (Express.js)   │     │                 │
└─────────────────┘     └────────▲────────┘     └─────────────────┘
                                   │
                          ┌────────┴────────┐
                          │   Admin Panel   │
                          │  (React + MUI)  │
                          └─────────────────┘
```

## Modules (from reference analysis)

| Module | Mobile | Admin CMS | API |
|--------|--------|-----------|-----|
| Authentication | Login, OTP, Register | — | `/auth/*` |
| Home Dashboard | Dynamic banners, packages | Banners, Packages | `/content/home` |
| Health Packages | Listing cards | CRUD | `/content/health-packages` |
| Specialists | Care team | CRUD | `/content/specialists` |
| Membership | Plans screen | CRUD | `/content/membership-plans` |
| Insurance | Plans screen | CRUD | `/content/insurance-plans` |
| Appointments | List view | — | `/content/appointments` |
| Rewards | Points & tasks | CRUD | `/content/rewards` |
| Search | Global search | — | `/content/search` |
| Profile | User details | User mgmt | `/users/profile` |
| Notifications | Bell icon | Send/manage | `/notifications` |
| Settings | Theme, prefs | App config | `/settings` |
| Onboarding | Slides | CRUD | `/content/onboarding-slides` |

## Quick Start

```bash
# 1. Seed database
cd database-seed && npm install && npm run seed

# 2. Start backend
cd backend-nodejs && npm run dev

# 3. Start admin panel
cd admin-panel && npm run dev

# 4. Start mobile app
cd android-app && npm start
cd android-app && npm run android
```

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | SuperAdmin@123 |
| Admin | admin@test.com | Admin@123 |
| User | user@test.com | User@123 |

## API Documentation

See [API.md](./API.md) for complete endpoint reference.

## Design System

- **Primary:** Violet `#7C3AED` (premium healthcare brand)
- **Secondary:** Emerald `#10B981` (health/success)
- **Typography:** System font with weight scale (Display → Caption)
- **Components:** Glass cards, gradient heroes, skeleton loaders, empty states
- **Themes:** Light / Dark / System via MMKV persistence
