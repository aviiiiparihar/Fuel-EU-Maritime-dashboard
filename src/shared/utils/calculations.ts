// Shared calculation utilities
export class ComplianceCalculations {
  static readonly TARGET_INTENSITY = 89.3368

  static calculateComplianceBalance(
    fuelConsumption: number,
    actualIntensity: number,
    targetIntensity: number = this.TARGET_INTENSITY,
  ): number {
    const energyInScope = fuelConsumption * 41000 // MJ/tonne
    return (targetIntensity - actualIntensity) * energyInScope
  }

  static calculatePercentDifference(baseline: number, actual: number): number {
    if (baseline === 0) return 0
    return ((actual - baseline) / baseline) * 100
  }

  static isCompliant(actualIntensity: number, targetIntensity: number = this.TARGET_INTENSITY): boolean {
    return actualIntensity <= targetIntensity
  }

  static calculatePoolAllocation(members: { shipId: string; cbBefore: number }[]) {
    const totalCB = members.reduce((sum, m) => sum + m.cbBefore, 0)

    if (totalCB < 0) {
      throw new Error("Pool total compliance balance cannot be negative")
    }

    // Greedy allocation: sort by CB descending and transfer
    const sorted = [...members].sort((a, b) => b.cbBefore - a.cbBefore)
    const allocations = sorted.map((m) => ({ ...m, cbAfter: m.cbBefore }))

    for (let i = 0; i < allocations.length; i++) {
      const surplusMember = allocations[i]
      if (surplusMember.cbAfter <= 0) break

      for (let j = i + 1; j < allocations.length; j++) {
        const deficitMember = allocations[j]
        if (deficitMember.cbAfter >= 0) continue

        const transferAmount = Math.min(surplusMember.cbAfter, -deficitMember.cbAfter)
        surplusMember.cbAfter -= transferAmount
        deficitMember.cbAfter += transferAmount
      }
    }

    return allocations
  }
}
