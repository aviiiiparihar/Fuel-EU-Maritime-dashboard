// Unit tests for banking service
import { BankingService } from "../core/application/services/banking-service"

describe("BankingService", () => {
  describe("canBank", () => {
    it("should return true for positive balance", () => {
      expect(BankingService.canBank(1000)).toBe(true)
    })

    it("should return false for negative balance", () => {
      expect(BankingService.canBank(-1000)).toBe(false)
    })
  })

  describe("canBorrow", () => {
    it("should allow borrowing within 1 year advance", () => {
      expect(BankingService.canBorrow(2025, 2026)).toBe(true)
    })

    it("should not allow borrowing more than 1 year advance", () => {
      expect(BankingService.canBorrow(2025, 2027)).toBe(false)
    })
  })

  describe("calculateBanking", () => {
    it("should calculate banking correctly", () => {
      const result = BankingService.calculateBanking(5000, {
        type: "bank",
        amount: 2000,
        year: 2025,
      })
      expect(result.banked).toBe(2000)
      expect(result.borrowed).toBe(0)
      expect(result.net).toBe(5000)
    })

    it("should calculate borrowing correctly", () => {
      const result = BankingService.calculateBanking(5000, {
        type: "borrow",
        amount: 1000,
        year: 2025,
      })
      expect(result.banked).toBe(0)
      expect(result.borrowed).toBe(1000)
      expect(result.net).toBe(4000)
    })
  })

  describe("applyBankedBalance", () => {
    it("should add banked amount to compliance balance", () => {
      const result = BankingService.applyBankedBalance(-500, 1000)
      expect(result).toBe(500)
    })
  })
})
