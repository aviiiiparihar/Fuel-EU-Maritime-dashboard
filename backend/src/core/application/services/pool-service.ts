import type { Pool, PoolMember } from "../../domain/entities/route"
import type { IPoolRepository } from "../ports/pool-repository"
import type { IComplianceRepository } from "../ports/compliance-repository"

export class PoolService {
  constructor(
    private readonly poolRepository: IPoolRepository,
    private readonly complianceRepository: IComplianceRepository,
  ) {}

  async getPools(): Promise<Pool[]> {
    return this.poolRepository.findAll()
  }

  async getShips(): Promise<Array<{ id: string; name: string; cb: number }>> {
    return this.poolRepository.getShips()
  }

  async createPool(ships: Array<{ id: string; cb: number }>): Promise<Pool> {
    const allocation = this.poolRepository.allocatePool(ships)
    const totalCB = this.poolRepository.calculatePoolSum(ships)

    if (!this.poolRepository.isPoolValid(totalCB, allocation)) {
      throw new Error("Invalid pool configuration")
    }

    const shipsData = await this.getShips()
    const members: PoolMember[] = allocation.map((alloc) => {
      const ship = shipsData.find((s) => s.id === alloc.shipId)
      return {
        ...alloc,
        shipName: ship?.name || "Unknown",
      }
    })

    return this.poolRepository.create({
      name: `Pool ${new Date().toISOString()}`,
      members,
      totalCB,
    })
  }

  allocatePool(ships: Array<{ id: string; cb: number }>): PoolMember[] {
    return this.poolRepository.allocatePool(ships)
  }

  calculatePoolSum(ships: Array<{ id: string; cb: number }>): number {
    return this.poolRepository.calculatePoolSum(ships)
  }

  isPoolValid(sum: number, allocation: PoolMember[]): boolean {
    return this.poolRepository.isPoolValid(sum, allocation)
  }
}
