export interface Route {
  id: string
  vesselName: string
  vesselType: "Container" | "Tanker" | "Bulk Carrier" | "LNG Carrier"
  fuelType: "HFO" | "VLSFO" | "MGO" | "LNG" | "Methanol" | "Ammonia"
  distance: number
  ghgIntensity: number
  complianceStatus: "Compliant" | "Non-Compliant" | "At Risk"
  isBaseline: boolean
  year: number
  departurePort: string
  arrivalPort: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ComplianceBalance {
  cbBefore: number
  applied: number
  cbAfter: number
  banked: number
}

export interface ComplianceTransaction {
  id: string
  type: "bank" | "apply"
  amount: number
  timestamp: Date
  balanceBefore: number
  balanceAfter: number
}

export interface PoolMember {
  shipId: string
  shipName: string
  cb: number
  allocation: number
}

export interface Pool {
  id: string
  name: string
  members: PoolMember[]
  totalCB: number
  createdAt: Date
}
