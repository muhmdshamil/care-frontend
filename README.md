# MindCare Hub Frontend

React + Vite app with role-based sections for Admin, Professional, and User. Aligns with backend routes mounted at `/api`.

## Structure

- `src/pages/admin`
- `src/pages/professional`
- `src/pages/user`
- `src/api/client.js` Axios instance with JWT interceptor
- `src/context/AuthContext.jsx` simple token/role storage
- `src/components/ProtectedRoute.jsx` route guard by role

## Backend endpoints mapped

- Admin
  - POST `/api/admin/login`
  - GET `/api/admin/dashboard`
  - POST `/api/admin/content`
  - PUT `/api/admin/content/:id`
  - DELETE `/api/admin/content/:id`
- Professional
  - POST `/api/professionals/register`
  - POST `/api/professionals/login`
  - GET `/api/professionals/me`
  - POST `/api/professionals/availability`
  - GET `/api/professionals/requests`
  - POST `/api/professionals/confirm/:id`
- User
  - POST `/api/users/register`
  - POST `/api/users/login`
  - GET `/api/users/me`
  - GET `/api/users/content`
  - POST `/api/users/forum`
  - GET `/api/users/forum`
  - POST `/api/users/tools/result`
  - GET `/api/users/tools/result`

## Setup

1. Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if needed (default `http://localhost:3000/api`).
2. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Notes

- Admin login defaults are available after hitting backend seed endpoint: `POST /api/admin/seed` (temporary helper).
- Tokens and role stored in `localStorage` as `token` and `role`.
