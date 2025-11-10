import type { ComplianceBalance, ComplianceTransaction } from "@/core/domain/entities/route"

export interface IComplianceRepository {
  getBalance(): Promise<ComplianceBalance>
  bankSurplus(amount: number): Promise<ComplianceTransaction>
  applyBanked(amount: number): Promise<ComplianceTransaction>
  getTransactionHistory(): Promise<ComplianceTransaction[]>
}
