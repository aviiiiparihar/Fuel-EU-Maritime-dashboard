// Bank entry domain entity
export interface BankEntry {
  id: string
  shipId: string
  year: number
  amountGco2eq: number // Banked surplus
  createdAt: Date
  updatedAt: Date
}

export class BankEntryEntity implements BankEntry {
  id: string
  shipId: string
  year: number
  amountGco2eq: number
  createdAt: Date
  updatedAt: Date

  constructor(data: BankEntry) {
    this.id = data.id
    this.shipId = data.shipId
    this.year = data.year
    this.amountGco2eq = data.amountGco2eq
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}
