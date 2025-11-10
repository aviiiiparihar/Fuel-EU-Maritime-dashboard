// PostgreSQL implementation of pool repository
import { type Pool, type PoolMember, PoolEntity, PoolMemberEntity } from "../../../core/domain/entities/pool"
import type { IPoolRepository } from "../../../core/ports/pool-repository"

// Mock implementation
export class PostgresPoolRepository implements IPoolRepository {
  private pools: Pool[] = []
  private members: PoolMember[] = []

  async createPool(pool: Pool): Promise<Pool> {
    const entity = new PoolEntity(pool)
    this.pools.push(entity)
    return entity
  }

  async getPoolById(id: string): Promise<Pool | null> {
    return this.pools.find((p) => p.id === id) || null
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    return this.pools.filter((p) => p.year === year)
  }

  async addMembers(poolId: string, members: PoolMember[]): Promise<PoolMember[]> {
    const entities = members.map((m) => new PoolMemberEntity(m))
    this.members.push(...entities)
    return entities
  }

  async getMembersByPoolId(poolId: string): Promise<PoolMember[]> {
    return this.members.filter((m) => m.poolId === poolId)
  }

  async updateMember(id: string, updates: Partial<PoolMember>): Promise<PoolMember> {
    const member = this.members.find((m) => m.id === id)
    if (!member) throw new Error("Pool member not found")
    Object.assign(member, updates)
    return member
  }
}
