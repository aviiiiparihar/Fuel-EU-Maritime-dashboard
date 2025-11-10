export interface Route {
  id: string
  vesselName: string
  voyage: string
  distance: number
  fuelType: "LSMGO" | "LNG" | "Methanol" | "Ammonia"
  fuelConsumption: number
  co2Intensity: number
  complianceBalance: number
  status: "completed" | "in-progress" | "planned"
  year: number
  createdAt: Date
  updatedAt: Date
}

export class RouteEntity implements Route {
  id: string
  vesselName: string
  voyage: string
  distance: number
  fuelType: "LSMGO" | "LNG" | "Methanol" | "Ammonia"
  fuelConsumption: number
  co2Intensity: number
  complianceBalance: number
  status: "completed" | "in-progress" | "planned"
  year: number
  createdAt: Date
  updatedAt: Date

  constructor(data: Route) {
    this.id = data.id
    this.vesselName = data.vesselName
    this.voyage = data.voyage
    this.distance = data.distance
    this.fuelType = data.fuelType
    this.fuelConsumption = data.fuelConsumption
    this.co2Intensity = data.co2Intensity
    this.complianceBalance = data.complianceBalance
    this.status = data.status
    this.year = data.year
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
