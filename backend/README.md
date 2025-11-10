# Fuel EU Maritime Backend

Express.js API server with hexagonal architecture for the Fuel EU Maritime Compliance Dashboard.

## Architecture

**Hexagonal Architecture (Ports & Adapters)**

\`\`\`
src/
├── core/
│   ├── domain/entities/      # Pure domain entities
│   └── application/
│       ├── services/          # Business logic services
│       └── ports/             # Repository interfaces
├── adapters/
│   ├── inbound/http/          # HTTP handlers (REST API)
│   └── outbound/persistence/  # Repository implementations
└── infrastructure/            # Server setup, middleware
\`\`\`

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Start production server
npm start
\`\`\`

## API Endpoints

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID
- `POST /api/routes` - Create new route

### Compliance
- `GET /api/compliance/:shipId` - Get compliance data
- `POST /api/compliance/calculate` - Calculate compliance

### Banking
- `GET /api/banking/:shipId` - Get banking history
- `POST /api/banking/transaction` - Create transaction

### Pools
- `GET /api/pools` - Get all pools
- `GET /api/pools/:poolId` - Get pool by ID
- `POST /api/pools` - Create new pool
- `POST /api/pools/:poolId/allocate` - Allocate pool

## Environment Variables

See `.env.example` for required environment variables.

## Testing

\`\`\`bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
