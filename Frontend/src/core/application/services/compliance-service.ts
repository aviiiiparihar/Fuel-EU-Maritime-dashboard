import type { IComplianceRepository } from "@/core/ports/compliance-repository"
import type { ComplianceBalance, ComplianceTransaction } from "@/core/domain/entities/route"

export class ComplianceService {
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

  async getTransactionHistory(): Promise<ComplianceTransaction[]> {
    return this.complianceRepository.getTransactionHistory()
  }

  isCompliant(ghgIntensity: number, target: number): boolean {
    return ghgIntensity < target
  }
}
