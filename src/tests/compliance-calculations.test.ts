// Unit tests for compliance calculations
import { ComplianceCalculations } from "@/shared/utils/calculations"

describe("ComplianceCalculations", () => {
  it("should calculate compliance balance correctly", () => {
    const result = ComplianceCalculations.calculateComplianceBalance(100, 85.2)
    const expected = (89.3368 - 85.2) * (100 * 41000)
    expect(result).toBeCloseTo(expected, 2)
  })

  it("should identify compliant routes", () => {
    expect(ComplianceCalculations.isCompliant(85.2)).toBe(true)
    expect(ComplianceCalculations.isCompliant(92.5)).toBe(false)
  })

  it("should calculate percent difference", () => {
    const result = ComplianceCalculations.calculatePercentDifference(89.3368, 85.2)
    expect(result).toBeLessThan(0)
  })

  it("should allocate pool members correctly", () => {
    const members = [
      { shipId: "SHIP_001", cbBefore: 500 },
      { shipId: "SHIP_002", cbBefore: -300 },
    ]
    const result = ComplianceCalculations.calculatePoolAllocation(members)
    expect(result.some((r) => r.cbAfter >= 0)).toBe(true)
  })
})
