import type { ComplianceBalance, ComplianceTransaction } from "../../domain/entities/route"

export interface IComplianceRepository {
  getBalance(): Promise<ComplianceBalance>
  updateBalance(balance: ComplianceBalance): Promise<void>
  getTransactionHistory(): Promise<ComplianceTransaction[]>
  addTransaction(transaction: Omit<ComplianceTransaction, "id">): Promise<ComplianceTransaction>
}
