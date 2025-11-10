import type { Pool, PoolMember } from "../../domain/entities/route"

export interface IPoolRepository {
  findAll(): Promise<Pool[]>
  findById(id: string): Promise<Pool | null>
  create(pool: Omit<Pool, "id" | "createdAt">): Promise<Pool>
  getShips(): Promise<Array<{ id: string; name: string; cb: number }>>
  allocatePool(ships: Array<{ id: string; cb: number }>): PoolMember[]
  calculatePoolSum(ships: Array<{ id: string; cb: number }>): number
  isPoolValid(sum: number, allocation: PoolMember[]): boolean
}
