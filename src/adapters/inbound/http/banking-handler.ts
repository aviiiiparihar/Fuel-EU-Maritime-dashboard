// HTTP handler for banking endpoints
import type { BankingService } from "../../../core/application/services/banking-service"

export class BankingHandler {
  constructor(private bankingService: BankingService) {}

  async getRecords(shipId: string, year: number) {
    return this.bankingService.getRecords(shipId, year)
  }

  async bankSurplus(shipId: string, year: number, amount: number) {
    return this.bankingService.bankSurplus(shipId, year, amount)
  }

  async applyBanked(shipId: string, year: number, amount: number) {
    return this.bankingService.applyBanked(shipId, year, amount)
  }
}
