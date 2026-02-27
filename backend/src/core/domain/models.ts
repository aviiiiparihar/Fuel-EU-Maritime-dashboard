export interface Route {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
}

export interface ComplianceBalance {
  shipId: string;
  year: number;
  cbValue: number;
}

export interface BankEntry {
  shipId: string;
  year: number;
  amount: number;
}

export interface PoolMember {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

