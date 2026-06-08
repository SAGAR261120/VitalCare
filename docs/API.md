# VitalCare API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login with email or phone + password | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout and revoke refresh token | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/otp/send` | Send OTP to phone | No |
| POST | `/auth/otp/verify` | Verify OTP and login | No |
| GET | `/auth/me` | Get current user | Yes |

### Login Request
```json
{
  "email": "admin@test.com",
  "password": "Admin@123"
}
```

### Login Response
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "email": "...", "role": "admin" },
    "token": "access_token",
    "refreshToken": "refresh_token"
  }
}
```

## Users (Admin)

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | `/users/manage` | List users (paginated) | users.read |
| GET | `/users/manage/:id` | Get user details | users.read |
| POST | `/users/manage` | Create user | users.write |
| PUT | `/users/manage/:id` | Update user | users.write |
| DELETE | `/users/manage/:id` | Delete user | users.delete |
| PATCH | `/users/manage/:id/toggle-status` | Activate/deactivate | users.write |

Query params: `page`, `limit`, `search`, `role`, `isActive`

## Users (Mobile)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get profile |
| PUT | `/users/profile` | Update profile |
| POST | `/users/profile/avatar` | Upload avatar |

## Admins (Super Admin only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admins` | List admins |
| POST | `/admins` | Create admin |
| PUT | `/admins/:id` | Update admin |
| DELETE | `/admins/:id` | Delete admin |
| GET | `/admins/permissions` | List available permissions |

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard analytics |

## Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| POST | `/notifications/send` | Send notification (admin) |
| PATCH | `/notifications/:id/read` | Mark as read |

## Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get all settings |
| PUT | `/settings` | Update settings (admin) |

## Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health status |

## Roles

- `super_admin` — Full system access
- `admin` — Permission-based access
- `user` — Mobile app users

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@test.com | SuperAdmin@123 |
| Admin | admin@test.com | Admin@123 |
| User | user@test.com | User@123 |

## Socket.IO

Connect to `ws://localhost:5000` with auth token:

```javascript
const socket = io('http://localhost:5000', { auth: { token: 'access_token' } });
socket.emit('join', { role: 'admin', userId: '...' });
socket.on('notification', (data) => console.log(data));
socket.on('broadcast', (data) => console.log(data));
```
