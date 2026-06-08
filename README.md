# VitalCare

A premium, enterprise-grade healthcare Android application built with React Native CLI.

## Features

- Animated splash screen and onboarding flow
- OTP and password authentication with form validation
- Multi-role registration (Patient, Doctor, Hospital, Yoga Teacher, Blood Bank)
- Premium dashboard with health packages, care team, and quick actions
- Custom animated bottom tab navigation with center FAB
- Drawer navigation for services and account management
- Membership plans and insurance comparison screens
- Rewards and points system
- Dark mode / Light mode support
- Offline detection with banner notification
- Secure token storage (Keychain) and fast local storage (MMKV)
- API-ready architecture with Axios interceptors

## Quick Start

```bash
npm install
npm start
npm run android
```

## Project Location

```
C:\Users\Sagar\.cursor\projects\C-Users-Sagar-AppData-Local-Temp-472f5ee8-75fe-4515-87da-10b3a04d16c9\VitalCare
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation on project structure, design system, navigation flow, and API integration.

## Tech Stack

- React Native CLI 0.85.3
- TypeScript
- React Navigation v7
- Zustand
- React Hook Form + Zod
- React Native Reanimated
- Axios + MMKV + Keychain
