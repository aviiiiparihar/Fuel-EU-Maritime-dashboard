import type { IPoolingRepository } from "@/core/ports/pooling-repository"
import type { PoolMember } from "@/core/domain/entities/route"

const initialShips = [
  { id: "Ship A", cb: 500000 },
  { id: "Ship B", cb: -300000 },
  { id: "Ship C", cb: 200000 },
  { id: "Ship D", cb: -150000 },
  { id: "Ship E", cb: -100000 },
]

export class MockPoolingRepository implements IPoolingRepository {
  private ships = [...initialShips]

  async getShips(): Promise<Array<{ id: string; cb: number }>> {
    return this.ships
  }

  async allocatePool(ships: Array<{ id: string; cb: number }>): Promise<PoolMember[]> {
    const surpluses = ships
      .filter((s) => s.cb > 0)
      .sort((a, b) => b.cb - a.cb)
      .map((s) => ({ ...s }))
    const deficits = ships
      .filter((s) => s.cb < 0)
      .sort((a, b) => a.cb - b.cb)
      .map((s) => ({ ...s }))
    const afterMap = new Map(ships.map((s) => [s.id, s.cb]))

    let sIdx = 0
    for (const def of deficits) {
      let need = -def.cb
      while (need > 0 && sIdx < surpluses.length) {
        const supplier = surpluses[sIdx]
        if (supplier.cb <= 0) {
          sIdx++
          continue
        }
        const give = Math.min(supplier.cb, need)
        supplier.cb -= give
        need -= give
        afterMap.set(def.id, afterMap.get(def.id)! + give)
        afterMap.set(supplier.id, afterMap.get(supplier.id)! - give)
        if (supplier.cb <= 0) sIdx++
      }
    }

    return ships.map((s) => {
      const after = afterMap.get(s.id)!
      const change = after - s.cb
      const improved = (s.cb < 0 && after >= s.cb) || (s.cb >= 0 && after <= s.cb)
      return {
        shipId: s.id,
        cbBefore: s.cb,
        cbAfter: after,
        change,
        status: improved ? "✅ Valid" : "❌ Invalid",
      }
    })
  }

  async createPool(members: Array<{ id: string; cb: number }>): Promise<void> {
    // Mock implementation - in production would call API
    console.log("Pool created with members:", members)
  }
}
