# Fuel EU Maritime Compliance - Backend API Documentation

## Overview

This document outlines all API routes, database schema, and backend implementation for the Fuel EU Maritime Compliance Dashboard.

---

## Database Schema

### Routes Table
\`\`\`sql
CREATE TABLE routes (
  id BIGSERIAL PRIMARY KEY,
  route_id VARCHAR(50) UNIQUE NOT NULL,
  vessel_type VARCHAR(50) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  ghg_intensity DECIMAL(10, 4) NOT NULL,
  fuel_consumption INT NOT NULL,
  distance INT NOT NULL,
  total_emissions INT NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Ship Compliance Table
\`\`\`sql
CREATE TABLE ship_compliance (
  id BIGSERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  cb_gco2eq BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(ship_id, year)
);
\`\`\`

### Bank Entries Table
\`\`\`sql
CREATE TABLE bank_entries (
  id BIGSERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INT NOT NULL,
  amount_gco2eq BIGINT NOT NULL,
  transaction_type VARCHAR(20) NOT NULL, -- 'BANK' or 'APPLY'
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Pools Table
\`\`\`sql
CREATE TABLE pools (
  id BIGSERIAL PRIMARY KEY,
  year INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Pool Members Table
\`\`\`sql
CREATE TABLE pool_members (
  id BIGSERIAL PRIMARY KEY,
  pool_id BIGINT NOT NULL REFERENCES pools(id),
  ship_id VARCHAR(50) NOT NULL,
  cb_before BIGINT NOT NULL,
  cb_after BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (pool_id) REFERENCES pools(id) ON DELETE CASCADE
);
\`\`\`

---

## API Endpoints

### Routes Management

#### `GET /api/routes`
Fetch all routes with optional filters.

**Query Parameters:**
- `vesselType` (optional): Filter by vessel type
- `fuelType` (optional): Filter by fuel type
- `year` (optional): Filter by year

**Response:**
\`\`\`json
{
  "routes": [
    {
      "routeId": "R001",
      "vesselType": "Container",
      "fuelType": "HFO",
      "year": 2024,
      "ghgIntensity": 91.0,
      "fuelConsumption": 5000,
      "distance": 12000,
      "totalEmissions": 4500,
      "isBaseline": true
    }
  ]
}
\`\`\`

**TODO:** Implement filtering logic, add pagination.

---

#### `POST /api/routes/:id/baseline`
Set a specific route as the baseline for comparison.

**Request:**
\`\`\`json
{
  "routeId": "R001"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "message": "Route R001 set as baseline"
}
\`\`\`

**TODO:** Verify route exists, update is_baseline flag, invalidate old baseline.

---

#### `GET /api/routes/comparison`
Get baseline and all comparison routes with compliance status.

**Response:**
\`\`\`json
{
  "baseline": {
    "routeId": "R001",
    "ghgIntensity": 91.0,
    "compliant": false
  },
  "comparisons": [
    {
      "routeId": "R002",
      "ghgIntensity": 88.0,
      "percentDiff": -3.3,
      "compliant": true
    }
  ],
  "targetIntensity": 89.3368
}
\`\`\`

**TODO:** Calculate percentDiff, determine compliance status based on target.

---

### Compliance Balance

#### `GET /api/compliance/cb`
Fetch current compliance balance for a ship in a given year.

**Query Parameters:**
- `shipId` (required): Ship identifier
- `year` (required): Year

**Response:**
\`\`\`json
{
  "shipId": "Ship A",
  "year": 2024,
  "cbBefore": 1250000,
  "cbAfter": 750000,
  "applied": -500000
}
\`\`\`

**Calculation:**
\`\`\`
Energy in scope (MJ) = fuelConsumption * 41,000
Compliance Balance = (targetIntensity - actualIntensity) * energyInScope
\`\`\`

**TODO:** Implement CB calculation formula, cache results, handle year validation.

---

#### `GET /api/compliance/adjusted-cb`
Get adjusted compliance balance after banking transactions for a ship.

**Query Parameters:**
- `shipId` (required): Ship identifier
- `year` (required): Year

**Response:**
\`\`\`json
{
  "shipId": "Ship A",
  "year": 2024,
  "baselineCb": 1250000,
  "bankedApplied": 500000,
  "adjustedCb": 1750000
}
\`\`\`

**TODO:** Apply banked entries to base CB, validate amount constraints.

---

### Banking Operations

#### `GET /api/banking/records`
Fetch transaction history for a ship.

**Query Parameters:**
- `shipId` (required): Ship identifier
- `year` (required): Year

**Response:**
\`\`\`json
{
  "transactions": [
    {
      "date": "2025-03-15",
      "action": "Bank Surplus",
      "amount": 800000,
      "balance": 2000000
    },
    {
      "date": "2025-04-20",
      "action": "Apply Banked",
      "amount": -500000,
      "balance": 1500000
    }
  ]
}
\`\`\`

**TODO:** Query bank_entries table, calculate running balance, sort by date descending.

---

#### `POST /api/banking/bank`
Bank a positive compliance balance surplus.

**Request:**
\`\`\`json
{
  "shipId": "Ship A",
  "year": 2024,
  "amount": 500000
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "newBalance": 750000,
  "bankedAmount": 500000
}
\`\`\`

**Validation:**
- `amount > 0`
- `amount <= currentCbAfter`
- `cbAfter > 0`

**TODO:** Insert transaction, update ship_compliance, validate constraints, handle concurrency.

---

#### `POST /api/banking/apply`
Apply banked surplus to offset a deficit.

**Request:**
\`\`\`json
{
  "shipId": "Ship A",
  "year": 2024,
  "amount": 250000
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "newBalance": 1000000,
  "bankedRemaining": 1750000
}
\`\`\`

**Validation:**
- `amount > 0`
- `amount <= availableBanked`

**TODO:** Deduct from banked pool, apply to CB, insert transaction, validate balance constraints.

---

### Pooling Operations

#### `POST /api/pools`
Create a new compliance pool with member allocations.

**Request:**
\`\`\`json
{
  "year": 2024,
  "members": [
    { "id": "Ship A", "cb": 500000 },
    { "id": "Ship B", "cb": -300000 },
    { "id": "Ship C", "cb": 200000 }
  ]
}
\`\`\`

**Response:**
\`\`\`json
{
  "poolId": 1,
  "year": 2024,
  "sumCb": 400000,
  "memberAllocations": [
    {
      "shipId": "Ship A",
      "cbBefore": 500000,
      "cbAfter": 400000,
      "change": -100000,
      "status": "valid"
    }
  ]
}
\`\`\`

**Allocation Algorithm (Greedy):**
1. Sort members by CB descending
2. Iterate deficit members (ascending CB)
3. For each deficit, transfer surplus from available surplus members
4. Validate: No deficit exits worse, no surplus goes negative
5. Return allocation result

**Validation Rules:**
- `sum(cb) >= 0` (pool sum must be non-negative)
- `cbAfter >= cbBefore` for all members where cbBefore < 0 (deficit cannot exit worse)
- `cbAfter >= 0` for all members where cbBefore >= 0 (surplus cannot go negative)

**TODO:** Implement greedy allocation, validate pool constraints, insert pool and pool_members records.

---

## Formulas & Constants

### GHG Intensity Comparison
\`\`\`
percentDifference = ((comparisonIntensity / baselineIntensity) - 1) * 100
\`\`\`

### Compliance Balance (CB)
\`\`\`
Energy in Scope (MJ) = fuelConsumption(t) * 41,000 MJ/t
CB = (targetIntensity - actualIntensity) * Energy in Scope
\`\`\`

### Target Intensity (2025)
\`\`\`
Target = 89.3368 gCO₂e/MJ
\`\`\`

---

## Error Handling

All endpoints should return appropriate HTTP status codes:

- `200 OK` - Successful operation
- `400 Bad Request` - Validation error (missing fields, invalid values)
- `404 Not Found` - Resource not found
- `409 Conflict` - Business logic violation (e.g., insufficient banked balance)
- `500 Internal Server Error` - Server error

**Standard Error Response:**
\`\`\`json
{
  "error": "Insufficient banked balance",
  "code": "INSUFFICIENT_BALANCE",
  "details": {
    "requested": 500000,
    "available": 250000
  }
}
\`\`\`

---

## Seed Data

Insert the following routes into the database:

\`\`\`sql
INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
VALUES
  ('R001', 'Container', 'HFO', 2024, 91.0, 5000, 12000, 4500, TRUE),
  ('R002', 'BulkCarrier', 'LNG', 2024, 88.0, 4800, 11500, 4200, FALSE),
  ('R003', 'Tanker', 'MGO', 2024, 93.5, 5100, 12500, 4700, FALSE),
  ('R004', 'RoRo', 'HFO', 2025, 89.2, 4900, 11800, 4300, FALSE),
  ('R005', 'Container', 'LNG', 2025, 90.5, 4950, 11900, 4400, FALSE);
\`\`\`

---

## Implementation Checklist

- [ ] Database migrations and seed data loaded
- [ ] Route handlers implemented for all endpoints
- [ ] CB calculation function implemented
- [ ] Greedy allocation algorithm implemented
- [ ] Input validation for all endpoints
- [ ] Error handling and status codes
- [ ] Transaction logging (banking)
- [ ] Pool creation and member allocation
- [ ] API response formatting
- [ ] Unit tests for calculations and algorithms
- [ ] Integration tests for HTTP endpoints

---

## Notes

- All monetary values are in gCO₂eq (grams of CO2 equivalent)
- Dates are in ISO 8601 format (YYYY-MM-DD)
- Use database transactions for multi-step operations (banking, pooling)
- Cache compliance balance results to avoid recalculation
- Consider implementing audit logging for compliance transactions
