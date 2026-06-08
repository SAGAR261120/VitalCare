# VitalCare — Architecture Documentation

## Overview

VitalCare is a full-stack healthcare platform consisting of:

- **android-app/** — React Native CLI mobile application
- **admin-panel/** — React + TypeScript admin dashboard
- **backend-nodejs/** — Node.js + Express + MongoDB API server

The mobile app is built with **React Native CLI 0.85.3** and **TypeScript**, following a modular, scalable architecture designed for production use.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native CLI 0.85.3 |
| Language | TypeScript 5.8 |
| Navigation | React Navigation v7 (Stack, Tabs, Drawer) |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Animations | React Native Reanimated 3 |
| Gestures | React Native Gesture Handler |
| HTTP | Axios with interceptors |
| Storage | MMKV (app data) + Keychain (tokens) |
| Network | @react-native-community/netinfo |
| Styling | Custom design system (theme tokens) |

## Project Structure

```
src/
├── animations/       # Reanimated spring/timing configs
├── assets/           # Images, fonts, static files
├── components/
│   ├── buttons/      # Button, IconButton
│   ├── cards/        # HealthPackage, Specialist, Membership, Insurance
│   ├── common/       # Text, Loader, GlassCard, ScreenContainer, etc.
│   ├── forms/        # TextInput, OtpInput, SelectField, RoleSelector
│   └── modals/       # AlertModal
├── constants/        # App config, mock data, API endpoints
├── hooks/            # usePressAnimation, useFadeIn
├── navigation/       # Root, Auth, Drawer, Tab navigators
├── screens/
│   ├── auth/         # Login, OTP, Register, LocationPicker
│   ├── onboarding/   # Splash, Onboarding
│   ├── home/         # Dashboard
│   ├── appointments/ # Appointment list
│   ├── search/       # Search screen
│   ├── rewards/      # Rewards & points
│   ├── profile/      # User profile & settings
│   └── services/     # Membership, Insurance
├── services/
│   ├── api.ts        # Axios client with auth interceptors
│   ├── storage.ts    # MMKV + Keychain secure storage
│   └── network.ts    # NetInfo offline monitoring
├── store/
│   ├── authStore.ts  # Authentication state
│   └── appStore.ts   # App-level state (location, search)
├── theme/
│   ├── colors.ts     # Light/dark color palettes
│   ├── typography.ts # Type scale
│   ├── spacing.ts    # Spacing, radius, hitSlop
│   ├── shadows.ts    # Elevation system
│   └── index.ts      # useTheme hook
├── types/            # TypeScript interfaces
└── utils/            # format, validation, responsive helpers
```

## Design System

### Color Palette
- **Primary**: Violet (#7C3AED) — brand identity
- **Secondary**: Emerald (#10B981) — health/success
- **Accent**: Cyan (#06B6D4) — interactive highlights
- **Warm**: Coral (#F97316) — discounts, urgency

### Theme Modes
- Light, Dark, and System (auto) via `useThemeStore`
- All components consume `useTheme()` for dynamic styling

### Typography Scale
Display → H1 → H2 → H3 → H4 → Body → Caption → Overline

## Navigation Flow

```
Splash → Onboarding → Auth (Login/OTP/Register) → Main (Drawer)
                                                    └── Tabs (Home, Appointments, Search, Rewards, Profile)
                                                    └── Membership, Insurance (Drawer screens)
```

## State Management

### Auth Store (`authStore.ts`)
- User authentication lifecycle
- Token persistence via Keychain
- Demo mode fallback when API unavailable

### App Store (`appStore.ts`)
- Location data
- Search queries
- Notification count

### Network Store (`network.ts`)
- Real-time connectivity monitoring
- Offline banner display

## API Integration

The `api.ts` service provides:
- Request interceptor (auto-attach Bearer token)
- Response interceptor (normalized error handling)
- Modular endpoint groups: `auth`, `user`, `health`, `membership`, `insurance`

Configure `API_CONFIG.BASE_URL` in `constants/index.ts` for your backend.

## Security

- **Tokens**: Stored in iOS Keychain / Android Keystore via `react-native-keychain`
- **App data**: Encrypted MMKV storage
- **Form validation**: Zod schemas with React Hook Form

## Running the App

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android
```

## Requirements

- Node.js >= 20
- Android Studio with SDK 34+
- JDK 17
- Android emulator or physical device
