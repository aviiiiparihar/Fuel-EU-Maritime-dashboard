// Ship compliance domain entity
export interface ShipCompliance {
  id: string
  shipId: string
  year: number
  cbGco2eq: number // Compliance Balance in gCO₂eq
  createdAt: Date
  updatedAt: Date
}

export class ShipComplianceEntity implements ShipCompliance {
  id: string
  shipId: string
  year: number
  cbGco2eq: number
  createdAt: Date
  updatedAt: Date

  constructor(data: ShipCompliance) {
    this.id = data.id
    this.shipId = data.shipId
    this.year = data.year
    this.cbGco2eq = data.cbGco2eq
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
