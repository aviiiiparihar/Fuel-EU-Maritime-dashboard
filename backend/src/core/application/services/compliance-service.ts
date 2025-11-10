import type { ComplianceBalance, ComplianceTransaction } from "../../domain/entities/route"
import type { IComplianceRepository } from "../ports/compliance-repository"

export class ComplianceService {
  constructor(private readonly complianceRepository: IComplianceRepository) {}

  async getBalance(): Promise<ComplianceBalance> {
    return this.complianceRepository.getBalance()
  }

  async getTransactionHistory(): Promise<ComplianceTransaction[]> {
    return this.complianceRepository.getTransactionHistory()
  }

  async calculateCompliance(ghiActual: number, ghiTarget: number, distance: number): Promise<number> {
    // Compliance Balance = (GHI Target - GHI Actual) * Distance
    return (ghiTarget - ghiActual) * distance
  }
}
