import type { PoolMember } from "@/core/domain/entities/route"

export interface IPoolingRepository {
  getShips(): Promise<Array<{ id: string; cb: number }>>
  createPool(members: Array<{ id: string; cb: number }>): Promise<void>
  allocatePool(ships: Array<{ id: string; cb: number }>): Promise<PoolMember[]>
}
