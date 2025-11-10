import type { ComplianceTransaction } from "../../domain/entities/route"

export interface IBankingRepository {
  bankSurplus(amount: number): Promise<void>
  applyBanked(amount: number): Promise<void>
  getTransactions(): Promise<ComplianceTransaction[]>
}
