export interface Route {
  routeId: string
  vesselType: string
  fuelType: string
  year: number
  ghgIntensity: number
  fuelConsumption: number
  distance: number
  totalEmissions: number
  isBaseline: boolean
}

export interface ComplianceBalance {
  cbBefore: number
  applied: number
  cbAfter: number
  banked: number
}

export interface ComplianceTransaction {
  date: string
  action: string
  amount: number
  balance: number
}

export interface PoolMember {
  shipId: string
  cbBefore: number
  cbAfter: number
  change: number
  status: string
}
