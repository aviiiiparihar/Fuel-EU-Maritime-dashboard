# Fuel EU Maritime Compliance Dashboard

A minimal yet structured implementation of the Fuel EU Maritime compliance module built with hexagonal architecture principles.

## Overview

This application helps shipping companies manage their GHG compliance under the EU Fuel Maritime Regulation. It provides features for:

- **Route Management**: Track vessel routes and their compliance status
- **Compliance Banking**: Bank surplus compliance balance and apply banked amounts
- **Comparison Analysis**: Compare routes and fuel alternatives
- **Pooling Management**: Create and manage compliance pools across multiple ships

## Project Structure

\`\`\`
├── frontend/          # Next.js React application
├── backend/           # Express.js API server
├── shared/            # Shared domain entities and constants
└── package.json       # Root monorepo configuration
\`\`\`

## Architecture Summary

### Hexagonal Architecture (Ports & Adapters)

The project follows Clean Architecture principles with clear separation of concerns:

\`\`\`
Frontend:
frontend/
  src/
    adapters/ui/      # React components
    core/             # Business logic (shared)
    shared/           # Utilities (shared)

Backend:
backend/
  src/
    core/
      domain/         # Business entities
      application/    # Application services
      ports/          # Repository interfaces
    adapters/
      inbound/http/   # HTTP handlers
      infrastructure/ # Database implementations
    infrastructure/   # Server setup
    shared/           # Utilities and constants
\`\`\`

**Key Principles:**
- **Domain Layer** is framework-agnostic and contains pure business logic
- **Application Layer** orchestrates use cases via ports (interfaces)
- **Adapters** connect external systems (HTTP, DB) to the core
- **Infrastructure** handles technical details (server, DB connection)

## Tech Stack

### Frontend
- React 19 with TypeScript
- Next.js 16 (App Router)
- TailwindCSS v4
- Recharts for data visualization
- Radix UI components

### Backend
- Node.js with TypeScript
- Express.js
- PostgreSQL
- Pure dependency injection (no frameworks)

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
\`\`\`bash
git clone <repository-url>
cd fuel-eu-maritime-dashboard
\`\`\`

2. **Install dependencies**
\`\`\`bash
# Install root dependencies
npm install

# This will automatically install dependencies for both frontend and backend workspaces
\`\`\`

3. **Configure environment variables**

Create `.env` file in backend/:
\`\`\`env
DATABASE_URL=postgresql://user:password@localhost:5432/fueleu
PORT=3001
\`\`\`

Create `.env.local` file in frontend/:
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001
\`\`\`

4. **Setup database**
\`\`\`bash
cd backend
npm run migrate  # Run migrations
npm run seed     # Seed with sample data
\`\`\`

### Development

**Option 1: Run both together (from root):**
\`\`\`bash
npm run dev  # Starts both frontend and backend
\`\`\`

**Option 2: Run separately:**

Backend (Terminal 1):
\`\`\`bash
cd backend
npm run dev  # Starts on http://localhost:3001
\`\`\`

Frontend (Terminal 2):
\`\`\`bash
cd frontend
npm run dev  # Starts on http://localhost:3000
\`\`\`

Access the application at: `http://localhost:3000`

### Building

\`\`\`bash
# Build all projects
npm run build

# Or build individually
npm run build:frontend
npm run build:backend
\`\`\`

## Frontend

Next.js application with React components, Tailwind CSS, and Radix UI components.

**Location:** `frontend/`

\`\`\`bash
cd frontend
npm run dev
\`\`\`

Runs on `http://localhost:3000`

## Backend

Express.js API with Node.js, TypeScript, and PostgreSQL.

**Location:** `backend/`

\`\`\`bash
cd backend
npm run dev
\`\`\`

Runs on `http://localhost:3001`

### Database Setup

\`\`\`bash
# Run migrations
npm run migrate

# Seed sample data
npm run seed
\`\`\`

## API Endpoints

### Routes
- `GET /api/routes` - List all routes
- `POST /api/routes/:id/baseline` - Set baseline for route

### Compliance Banking
- `GET /api/banking/balance` - Get current compliance balance
- `POST /api/banking/bank` - Bank surplus compliance
- `POST /api/banking/apply` - Apply banked compliance
- `GET /api/banking/transactions` - Get transaction history

### Pooling
- `GET /api/pools/ships` - List available ships
- `POST /api/pools` - Create a new pool
- `POST /api/pools/allocate` - Calculate pool allocation

## Sample Requests/Responses

### Get Balance
\`\`\`bash
curl http://localhost:3001/api/banking/balance
\`\`\`

Response:
\`\`\`json
{
  "cbBefore": 1250.5,
  "applied": 0,
  "cbAfter": 1250.5,
  "banked": 500.0
}
\`\`\`

### Bank Surplus
\`\`\`bash
curl -X POST http://localhost:3001/api/banking/bank \
  -H "Content-Type: application/json" \
  -d '{"amount": 200}'
\`\`\`

## Project Structure Highlights

### Domain-Driven Design
- **Entities**: Route, ComplianceBalance, Pool
- **Value Objects**: GHI (GHG Intensity), FuelType, VesselType
- **Aggregates**: Route with associated compliance data

### Dependency Flow
\`\`\`
Infrastructure → Adapters → Application → Domain
                    ↓
                 Ports (Interfaces)
\`\`\`

Dependencies point inward - the domain never depends on external layers.

## Testing

### Backend Tests
\`\`\`bash
cd backend
npm test
\`\`\`

Runs unit tests for:
- Domain entities and value objects
- Application services
- Repository implementations

### Frontend Tests
\`\`\`bash
cd frontend
npm test
\`\`\`

Runs component and integration tests.

## Contributing

When adding features:
1. Start with domain entities in `backend/src/core/domain/`
2. Define ports in `backend/src/core/application/ports/`
3. Implement use cases in `backend/src/core/application/services/`
4. Add adapters in `backend/src/adapters/inbound/` or `backend/src/adapters/outbound/`
5. Wire up infrastructure in `backend/src/infrastructure/`

## License

MIT
