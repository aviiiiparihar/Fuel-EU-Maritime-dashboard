// Value object for compliance calculations
export interface ComplianceCalculationInput {
  targetIntensity: number // gCO₂e/MJ
  actualIntensity: number // gCO₂e/MJ
  fuelConsumption: number // tonnes
}

export class ComplianceCalculation {
  private static readonly ENERGY_FACTOR = 41000 // MJ/t

  static calculateComplianceBalance(input: ComplianceCalculationInput): number {
    const energyInScope = input.fuelConsumption * this.ENERGY_FACTOR
    const intensityDifference = input.targetIntensity - input.actualIntensity
    return intensityDifference * energyInScope
  }

  static calculatePercentDifference(targetIntensity: number, actualIntensity: number): number {
    if (targetIntensity === 0) return 0
    return ((actualIntensity - targetIntensity) / targetIntensity) * 100
  }

  static isCompliant(complianceBalance: number): boolean {
    return complianceBalance >= 0
  }
}
