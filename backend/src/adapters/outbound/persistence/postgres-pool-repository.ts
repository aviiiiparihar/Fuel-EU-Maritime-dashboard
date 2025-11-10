// Mock repository implementation for pools
import type { Pool } from "../../../core/domain/entities/pool"

export class PostgresPoolRepository {
  private pools: Pool[] = []

  async findAll(): Promise<Pool[]> {
    return this.pools
  }

  async findById(id: string): Promise<Pool | null> {
    return this.pools.find((p) => p.id === id) || null
  }

  async save(pool: Pool): Promise<void> {
    this.pools.push(pool)
  }

  async update(id: string, data: Partial<Pool>): Promise<void> {
    const index = this.pools.findIndex((p) => p.id === id)
    if (index !== -1) {
      this.pools[index] = { ...this.pools[index], ...data }
    }
  }
}
