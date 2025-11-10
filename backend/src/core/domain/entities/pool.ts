// Core domain entity: Compliance Pool
export interface Pool {
  id: string
  name: string
  memberShipIds: string[]
  totalComplianceBalance: number
  status: "active" | "inactive"
  createdAt: Date
}

export interface PoolMember {
  shipId: string
  cbBefore: number
  cbAfter?: number
  contribution?: number
}
