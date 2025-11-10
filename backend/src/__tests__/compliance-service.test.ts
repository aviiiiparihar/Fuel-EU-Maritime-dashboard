// Unit tests for compliance service
import { ComplianceService } from "../core/application/services/compliance-service"

describe("ComplianceService", () => {
  describe("calculateGHGIntensity", () => {
    it("should calculate GHG intensity correctly", () => {
      const input = {
        fuelConsumption: 1000,
        distance: 5000,
        cargoCapacity: 20000,
        year: 2025,
      }
      const result = ComplianceService.calculateGHGIntensity(input)
      expect(result).toBeGreaterThan(0)
    })
  })

  describe("getRequiredIntensity", () => {
    it("should return correct reference intensity for 2025", () => {
      const result = ComplianceService.getRequiredIntensity(2025)
      expect(result).toBe(89.34)
    })

    it("should return correct reference intensity for 2030", () => {
      const result = ComplianceService.getRequiredIntensity(2030)
      expect(result).toBe(80.25)
    })
  })

  describe("calculateComplianceBalance", () => {
    it("should calculate positive balance for compliant ships", () => {
      const result = ComplianceService.calculateComplianceBalance(85, 89.34, 5000, 20000)
      expect(result).toBeGreaterThan(0)
    })

    it("should calculate negative balance for non-compliant ships", () => {
      const result = ComplianceService.calculateComplianceBalance(95, 89.34, 5000, 20000)
      expect(result).toBeLessThan(0)
    })
  })

  describe("isCompliant", () => {
    it("should return true for compliant intensity", () => {
      expect(ComplianceService.isCompliant(85, 89.34)).toBe(true)
    })

    it("should return false for non-compliant intensity", () => {
      expect(ComplianceService.isCompliant(95, 89.34)).toBe(false)
    })
  })

  describe("calculatePenalty", () => {
    it("should return 0 penalty for positive balance", () => {
      const result = ComplianceService.calculatePenalty(1000000)
      expect(result).toBe(0)
    })

    it("should calculate penalty for negative balance", () => {
      const result = ComplianceService.calculatePenalty(-1000000)
      expect(result).toBeGreaterThan(0)
    })
  })
})
