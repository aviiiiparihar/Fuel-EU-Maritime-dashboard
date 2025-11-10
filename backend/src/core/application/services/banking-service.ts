import type { ComplianceTransaction } from "../../domain/entities/route"
import type { IBankingRepository } from "../ports/banking-repository"
import type { IComplianceRepository } from "../ports/compliance-repository"

export class BankingService {
  constructor(
    private readonly bankingRepository: IBankingRepository,
    private readonly complianceRepository: IComplianceRepository,
  ) {}

  async bankSurplus(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Amount must be positive")
    }

    const balance = await this.complianceRepository.getBalance()

    if (amount > balance.cbAfter) {
      throw new Error("Insufficient balance to bank")
    }

    await this.bankingRepository.bankSurplus(amount)

    // Record transaction
    await this.complianceRepository.addTransaction({
      type: "bank",
      amount,
      timestamp: new Date(),
      balanceBefore: balance.cbAfter,
      balanceAfter: balance.cbAfter - amount,
    })
  }

  async applyBanked(amount: number): Promise<void> {
    if (amount <= 0) {
      throw new Error("Amount must be positive")
    }

    const balance = await this.complianceRepository.getBalance()

    if (amount > balance.banked) {
      throw new Error("Insufficient banked balance")
    }

    await this.bankingRepository.applyBanked(amount)

    // Record transaction
    await this.complianceRepository.addTransaction({
      type: "apply",
      amount,
      timestamp: new Date(),
      balanceBefore: balance.cbAfter,
      balanceAfter: balance.cbAfter + amount,
    })
  }

  async getTransactions(): Promise<ComplianceTransaction[]> {
    return this.bankingRepository.getTransactions()
  }
}
