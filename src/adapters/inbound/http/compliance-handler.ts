// HTTP handler for compliance endpoints
import type { ComplianceService } from "../../../core/application/services/compliance-service"
import type { BankingService } from "../../../core/application/services/banking-service"

export class ComplianceHandler {
  constructor(
    private complianceService: ComplianceService,
    private bankingService: BankingService,
  ) {}

  async computeCB(shipId: string, year: number, actualIntensity: number, fuelConsumption: number) {
    return this.complianceService.computeComplianceBalance(shipId, year, actualIntensity, fuelConsumption)
  }

  async getAdjustedCB(shipId: string, year: number) {
    return this.complianceService.getAdjustedCB(shipId, year)
  }
}
