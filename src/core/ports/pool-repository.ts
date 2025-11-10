// Port defining pool repository interface
import type { Pool, PoolMember } from "../domain/entities/pool"

export interface IPoolRepository {
  createPool(pool: Pool): Promise<Pool>
  getPoolById(id: string): Promise<Pool | null>
  getPoolsByYear(year: number): Promise<Pool[]>
  addMembers(poolId: string, members: PoolMember[]): Promise<PoolMember[]>
  getMembersByPoolId(poolId: string): Promise<PoolMember[]>
  updateMember(id: string, member: Partial<PoolMember>): Promise<PoolMember>
}
