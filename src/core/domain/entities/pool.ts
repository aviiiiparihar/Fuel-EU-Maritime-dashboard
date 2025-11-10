// Pool domain entity
export interface Pool {
  id: string
  year: number
  createdAt: Date
  updatedAt: Date
}

export interface PoolMember {
  id: string
  poolId: string
  shipId: string
  cbBefore: number
  cbAfter: number
  createdAt: Date
}

export class PoolEntity implements Pool {
  id: string
  year: number
  createdAt: Date
  updatedAt: Date

  constructor(data: Pool) {
    this.id = data.id
    this.year = data.year
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }
}

export class PoolMemberEntity implements PoolMember {
  id: string
  poolId: string
  shipId: string
  cbBefore: number
  cbAfter: number
  createdAt: Date

  constructor(data: PoolMember) {
    this.id = data.id
    this.poolId = data.poolId
    this.shipId = data.shipId
    this.cbBefore = data.cbBefore
    this.cbAfter = data.cbAfter
    this.createdAt = data.createdAt
  }
}
