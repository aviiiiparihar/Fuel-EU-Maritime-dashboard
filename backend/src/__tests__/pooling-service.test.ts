// Unit tests for pooling service
import { PoolingService } from "../core/application/services/pooling-service"
import type { PoolMember } from "../core/domain/entities/pool"

describe("PoolingService", () => {
  describe("calculatePoolAllocation", () => {
    it("should allocate surplus to deficit ships", () => {
      const members: PoolMember[] = [
        { shipId: "SHIP_001", cbBefore: 1000 },
        { shipId: "SHIP_002", cbBefore: -500 },
      ]
      const result = PoolingService.calculatePoolAllocation(members)

      expect(result[0].cbAfter).toBeLessThan(result[0].cbBefore)
      expect(result[1].cbAfter).toBeGreaterThan(result[1].cbBefore)
    })

    it("should maintain total pool balance", () => {
      const members: PoolMember[] = [
        { shipId: "SHIP_001", cbBefore: 2000 },
        { shipId: "SHIP_002", cbBefore: -800 },
        { shipId: "SHIP_003", cbBefore: -400 },
      ]
      const result = PoolingService.calculatePoolAllocation(members)

      const totalBefore = members.reduce((sum, m) => sum + m.cbBefore, 0)
      const totalAfter = result.reduce((sum, m) => sum + (m.cbAfter || 0), 0)

      expect(totalAfter).toBeCloseTo(totalBefore, 2)
    })
  })

  describe("calculatePoolBalance", () => {
    it("should calculate total pool balance", () => {
      const members: PoolMember[] = [
        { shipId: "SHIP_001", cbBefore: 1000 },
        { shipId: "SHIP_002", cbBefore: -300 },
      ]
      const result = PoolingService.calculatePoolBalance(members)
      expect(result).toBe(700)
    })
  })

  describe("isPoolViable", () => {
    it("should return true for positive total balance", () => {
      expect(PoolingService.isPoolViable(500)).toBe(true)
    })

    it("should return false for negative total balance", () => {
      expect(PoolingService.isPoolViable(-500)).toBe(false)
    })
  })
})
