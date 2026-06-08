# VitalCare API — Extended Documentation

Base URL: `http://localhost:5000/api/v1`

## Public Content APIs (Mobile)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/content/home` | Home feed (banners, packages, specialists, insurance, settings) |
| GET | `/content/config` | App config (onboarding slides, menu items, settings) |
| GET | `/content/search?q=` | Global search |
| GET | `/content/health-packages` | List health packages |
| GET | `/content/specialists` | List specialists |
| GET | `/content/membership-plans` | List membership plans |
| GET | `/content/insurance-plans` | List insurance plans |
| GET | `/content/banners` | List banners |
| GET | `/content/onboarding-slides` | List onboarding slides |
| GET | `/content/cities?search=` | Search cities |
| GET | `/content/rewards` | List reward tasks |
| GET | `/content/pages/slug/:slug` | Get content page (about-us, privacy-policy) |
| GET | `/content/faqs` | List FAQs |

## Authenticated Mobile APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/content/appointments` | User appointments |
| POST | `/content/appointments` | Book appointment |
| GET | `/content/rewards` | User reward balance & transactions |
| POST | `/content/rewards/withdraw` | Withdraw points |
| POST | `/content/rewards/wallet` | Connect wallet |
| GET | `/content/activity?type=` | User activity history |

## Admin CMS APIs

All require `admin` or `super_admin` role with appropriate permissions.

| Method | Endpoint | Permission |
|--------|----------|------------|
| GET/POST/PUT/DELETE | `/cms/{resource}` | content.read/write/delete |
| PATCH | `/cms/{resource}/:id/toggle` | content.write |
| POST | `/cms/media/upload` | media.manage |
| DELETE | `/cms/media/:filename` | media.manage |

Resources: `categories`, `subcategories`, `banners`, `health-packages`, `specialists`, `membership-plans`, `insurance-plans`, `onboarding-slides`, `faqs`, `pages`, `menu-items`, `cities`, `rewards`

## Auth, Users, Dashboard

See existing [docs/API.md](../docs/API.md) for authentication, user management, dashboard, notifications, and settings endpoints.
