// Unit tests for compliance calculations
import { ComplianceCalculation } from "../core/domain/value-objects/compliance-calculation"

describe("ComplianceCalculation", () => {
  it("should calculate compliance balance correctly", () => {
    const result = ComplianceCalculation.calculateComplianceBalance({
      targetIntensity: 89.3368,
      actualIntensity: 85.2,
      fuelConsumption: 100,
    })

    const expectedDifference = 89.3368 - 85.2
    const expectedEnergy = 100 * 41000
    const expected = expectedDifference * expectedEnergy

    expect(result).toBeCloseTo(expected, 2)
  })

  it("should calculate percent difference correctly", () => {
    const result = ComplianceCalculation.calculatePercentDifference(89.3368, 92.5)
    expect(result).toBeGreaterThan(0)
  })

  it("should identify compliant routes", () => {
    expect(ComplianceCalculation.isCompliant(1000)).toBe(true)
    expect(ComplianceCalculation.isCompliant(-1000)).toBe(false)
    expect(ComplianceCalculation.isCompliant(0)).toBe(true)
  })
})
