import type { IPoolingRepository } from "@/core/ports/pooling-repository"
import type { PoolMember } from "@/core/domain/entities/route"

export class PoolingService {
  constructor(private poolingRepository: IPoolingRepository) {}

  async getShips(): Promise<Array<{ id: string; cb: number }>> {
    return this.poolingRepository.getShips()
  }

  async allocatePool(ships: Array<{ id: string; cb: number }>): Promise<PoolMember[]> {
    return this.poolingRepository.allocatePool(ships)
  }

  async createPool(members: Array<{ id: string; cb: number }>): Promise<void> {
    const poolSum = members.reduce((acc, s) => acc + s.cb, 0)
    if (poolSum < 0) {
      throw new Error("Pool sum must be non-negative")
    }
    return this.poolingRepository.createPool(members)
  }

  calculatePoolSum(ships: Array<{ id: string; cb: number }>): number {
    return ships.reduce((acc, s) => acc + s.cb, 0)
  }

  isPoolValid(poolSum: number, members: PoolMember[]): boolean {
    if (poolSum < 0) return false

    return members.every((m) => {
      const rule1 = m.cbBefore < 0 ? m.cbAfter >= m.cbBefore : true
      const rule2 = m.cbBefore >= 0 ? m.cbAfter >= 0 : true
      return rule1 && rule2
    })
  }
}
