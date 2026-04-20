# Daily Tracker - Agent Instructions

## Project Structure

Two separate packages that must run simultaneously:
- `client/` - React + Vite + Tailwind CSS frontend (port 5173)
- `server/` - Express backend (port 3000)

## Commands

```bash
# Backend (run first)
cd server && cp .env.example .env && npm install && npm run dev

# Frontend (run second)
cd client && cp .env.example .env && npm install && npm run dev
```

Both require their own `.env` files from `.env.example` with Firebase credentials.

## Architecture Notes

- Server-side auth via Firebase Admin SDK (server/.env)
- Client-side auth via Firebase Client SDK (client/.env)
- All API routes use Firebase UID for user identification
- No JWT tokens - Firebase ID tokens passed in headers

## Testing

No test framework configured. Do not add tests.

## Linting

Client has ESLint: `cd client && npm run lint`
Server has no linter.

## API Endpoints (server-side truth)

- `/api/auth/register` - POST
- `/api/auth/login` - POST
- `/api/auth/me` - GET
- `/api/foods?date=YYYY-MM-DD` - GET/POST/PUT/DELETE
- `/api/workouts?date=YYYY-MM-DD` - GET/POST/DELETE
- `/api/workouts/personal-records` - GET
- `/api/sleep?date=YYYY-MM-DD` - GET/POST/DELETE
- `/api/sleep/stats` - GET