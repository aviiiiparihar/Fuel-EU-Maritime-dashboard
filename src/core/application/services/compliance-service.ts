import type { IComplianceRepository } from "@/core/ports/compliance-repository"
import type { ComplianceBalance, ComplianceTransaction } from "@/core/domain/entities/route"

export class ComplianceService {
  private static readonly TARGET_INTENSITY_2025 = 89.3368 // gCO₂e/MJ

  constructor(private complianceRepository: IComplianceRepository) {}

  async getBalance(): Promise<ComplianceBalance> {
    return this.complianceRepository.getBalance()
  }

  async bankSurplus(amount: number): Promise<ComplianceTransaction> {
    if (amount <= 0) {
      throw new Error("Amount must be positive")
    }
    return this.complianceRepository.bankSurplus(amount)
  }

  async applyBanked(amount: number): Promise<ComplianceTransaction> {
    if (amount <= 0) {
      throw new Error("Amount must be positive")
    }
    return this.complianceRepository.applyBanked(amount)
  }

  async computeComplianceBalance(fuelConsumption: number, actualIntensity: number): Promise<number> {
    const energyInScope = fuelConsumption * 41000 // MJ/tonne
    const cb = (ComplianceService.TARGET_INTENSITY_2025 - actualIntensity) * energyInScope
    return cb
  }

  async getTransactionHistory(): Promise<ComplianceTransaction[]> {
    return this.complianceRepository.getTransactionHistory()
  }

  isCompliant(ghgIntensity: number, target: number = ComplianceService.TARGET_INTENSITY_2025): boolean {
    return ghgIntensity <= target
  }
}
