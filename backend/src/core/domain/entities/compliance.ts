// Core domain entity: Compliance
export interface Compliance {
  id: string
  shipId: string
  voyageId: string
  ghgIntensity: number
  requiredIntensity: number
  complianceBalance: number
  status: "compliant" | "non-compliant"
  penalties?: number
  createdAt: Date
}

export interface ComplianceCalculationInput {
  fuelConsumption: number
  distance: number
  cargoCapacity: number
  year: number
}
