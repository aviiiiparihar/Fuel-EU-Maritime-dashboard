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

export class RouteEntity implements Route {
  routeId: string
  vesselType: string
  fuelType: string
  year: number
  ghgIntensity: number
  fuelConsumption: number
  distance: number
  totalEmissions: number
  isBaseline: boolean

  constructor(data: Route) {
    this.routeId = data.routeId
    this.vesselType = data.vesselType
    this.fuelType = data.fuelType
    this.year = data.year
    this.ghgIntensity = data.ghgIntensity
    this.fuelConsumption = data.fuelConsumption
    this.distance = data.distance
    this.totalEmissions = data.totalEmissions
    this.isBaseline = data.isBaseline
  }

  getComplianceBalance(targetIntensity: number): number {
    const energyInScope = this.fuelConsumption * 41000 // MJ/tonne
    return (targetIntensity - this.ghgIntensity) * energyInScope
  }

  isCompliant(targetIntensity: number): boolean {
    return this.ghgIntensity <= targetIntensity
  }
}

export class ShipComplianceEntity implements ComplianceBalance {
  cbBefore: number
  applied: number
  cbAfter: number
  banked: number

  constructor(data: ComplianceBalance) {
    this.cbBefore = data.cbBefore
    this.applied = data.applied
    this.cbAfter = data.cbAfter
    this.banked = data.banked
  }
}
