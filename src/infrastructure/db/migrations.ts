// Database migration definitions
export const migrations = {
  createRoutesTable: `
    CREATE TABLE IF NOT EXISTS routes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      route_id VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      ghg_intensity DECIMAL(10, 4) NOT NULL,
      is_baseline BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(route_id, year)
    );
  `,

  createShipComplianceTable: `
    CREATE TABLE IF NOT EXISTS ship_compliance (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ship_id VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      cb_gco2eq DECIMAL(15, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(ship_id, year)
    );
  `,

  createBankEntriesTable: `
    CREATE TABLE IF NOT EXISTS bank_entries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      ship_id VARCHAR(255) NOT NULL,
      year INTEGER NOT NULL,
      amount_gco2eq DECIMAL(15, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(ship_id, year)
    );
  `,

  createPoolsTable: `
    CREATE TABLE IF NOT EXISTS pools (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      year INTEGER NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,

  createPoolMembersTable: `
    CREATE TABLE IF NOT EXISTS pool_members (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      pool_id UUID NOT NULL REFERENCES pools(id),
      ship_id VARCHAR(255) NOT NULL,
      cb_before DECIMAL(15, 2) NOT NULL,
      cb_after DECIMAL(15, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
}
