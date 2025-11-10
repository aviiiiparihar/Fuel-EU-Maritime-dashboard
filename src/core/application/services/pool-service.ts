// Application service for pool operations
import { type Pool, type PoolMember, PoolEntity, PoolMemberEntity } from "../../domain/entities/pool"
import type { IPoolRepository } from "../../ports/pool-repository"
import type { IComplianceRepository } from "../../ports/compliance-repository"

export class PoolService {
  constructor(
    private poolRepository: IPoolRepository,
    private complianceRepository: IComplianceRepository,
  ) {}

  async createPool(shipIds: string[], year: number): Promise<{ pool: Pool; members: PoolMember[] }> {
    // Fetch compliance balances for all members
    const membersData = await Promise.all(
      shipIds.map(async (shipId) => {
        const compliance = await this.complianceRepository.getByShipAndYear(shipId, year)
        return {
          shipId,
          cbBefore: compliance?.cbGco2eq || 0,
        }
      }),
    )

    // Validate: sum of CB must be >= 0
    const totalCB = membersData.reduce((sum, m) => sum + m.cbBefore, 0)
    if (totalCB < 0) {
      throw new Error("Pool total compliance balance cannot be negative")
    }

    // Create pool
    const pool = new PoolEntity({
      id: `pool-${year}-${Date.now()}`,
      year,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const createdPool = await this.poolRepository.createPool(pool)

    // Sort by CB descending for greedy allocation
    const sorted = membersData.sort((a, b) => b.cbBefore - a.cbBefore)

    // Greedy allocation: transfer surplus to deficits
    const allocations = sorted.map((m) => ({ ...m, cbAfter: m.cbBefore }))

    for (let i = 0; i < allocations.length; i++) {
      const surplusMember = allocations[i]
      if (surplusMember.cbAfter <= 0) break

      for (let j = i + 1; j < allocations.length; j++) {
        const deficitMember = allocations[j]
        if (deficitMember.cbAfter >= 0) continue

        const transferAmount = Math.min(surplusMember.cbAfter, -deficitMember.cbAfter)

        // Validate: deficit ship cannot exit worse
        if (deficitMember.cbAfter + transferAmount < deficitMember.cbBefore - Math.abs(deficitMember.cbBefore)) {
          continue
        }

        // Validate: surplus ship cannot exit negative
        if (surplusMember.cbAfter - transferAmount < 0) {
          continue
        }

        surplusMember.cbAfter -= transferAmount
        deficitMember.cbAfter += transferAmount
      }
    }

    // Create pool members
    const poolMembers = allocations.map(
      (alloc) =>
        new PoolMemberEntity({
          id: `member-${createdPool.id}-${alloc.shipId}-${Date.now()}`,
          poolId: createdPool.id,
          shipId: alloc.shipId,
          cbBefore: alloc.cbBefore,
          cbAfter: alloc.cbAfter,
          createdAt: new Date(),
        }),
    )

    const createdMembers = await this.poolRepository.addMembers(createdPool.id, poolMembers)

    return { pool: createdPool, members: createdMembers }
  }
}
