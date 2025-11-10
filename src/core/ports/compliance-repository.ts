import type { ComplianceBalance, ComplianceTransaction } from "@/core/domain/entities/route"

export interface IComplianceRepository {
  getBalance(): Promise<ComplianceBalance>
  bankSurplus(amount: number): Promise<ComplianceTransaction>
  applyBanked(amount: number): Promise<ComplianceTransaction>
  getTransactionHistory(): Promise<ComplianceTransaction[]>
}

export interface IBankingRepository {
  getRecordsByShip(shipId: string): Promise<ComplianceTransaction[]>
  getRecordsByYear(year: number): Promise<ComplianceTransaction[]>
  create(transaction: ComplianceTransaction): Promise<ComplianceTransaction>
  getBalance(shipId: string, year: number): Promise<number>
}
