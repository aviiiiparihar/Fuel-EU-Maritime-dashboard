// Application service for banking operations
import { type BankEntry, BankEntryEntity } from "../../domain/entities/bank-entry"
import type { IBankingRepository } from "../../ports/banking-repository"
import type { IComplianceRepository } from "../../ports/compliance-repository"

export class BankingService {
  constructor(
    private bankingRepository: IBankingRepository,
    private complianceRepository: IComplianceRepository,
  ) {}

  async getRecords(shipId: string, year: number): Promise<BankEntry[]> {
    return this.bankingRepository.getByShip(shipId)
  }

  async bankSurplus(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const compliance = await this.complianceRepository.getByShipAndYear(shipId, year)
    if (!compliance) {
      throw new Error(`No compliance record for ship ${shipId}`)
    }

    if (amount > compliance.cbGco2eq) {
      throw new Error("Cannot bank more than available surplus")
    }

    const existing = await this.bankingRepository.getByShipAndYear(shipId, year)
    if (existing) {
      return this.bankingRepository.update(existing.id, {
        amountGco2eq: existing.amountGco2eq + amount,
      })
    }

    const bankEntry = new BankEntryEntity({
      id: `bank-${shipId}-${year}-${Date.now()}`,
      shipId,
      year,
      amountGco2eq: amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return this.bankingRepository.create(bankEntry)
  }

  async applyBanked(shipId: string, year: number, amount: number): Promise<BankEntry> {
    const bankEntry = await this.bankingRepository.getByShipAndYear(shipId, year)
    if (!bankEntry) {
      throw new Error(`No banked surplus for ship ${shipId}`)
    }

    if (amount > bankEntry.amountGco2eq) {
      throw new Error("Cannot apply more than available banked amount")
    }

    return this.bankingRepository.update(bankEntry.id, {
      amountGco2eq: bankEntry.amountGco2eq - amount,
    })
  }
}
