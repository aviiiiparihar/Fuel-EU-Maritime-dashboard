# FuelEU Maritime Compliance Dashboard

## Tech Stack
- Frontend: React + TypeScript + Tailwind + React Query + Recharts
- Backend: Node.js + TypeScript + Express + Prisma + PostgreSQL (Supabase)
- Architecture: Hexagonal Architecture

## Features
- Route management + baseline selection
- Route comparison + compliance visualization
- Compliance balance calculation
- Banking surplus compliance
- Pooling ships compliance

## Setup Instructions

Backend:
```bash
cd backend
npm install
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

