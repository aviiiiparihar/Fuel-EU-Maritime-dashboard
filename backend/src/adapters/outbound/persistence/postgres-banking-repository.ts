// Mock repository implementation for banking
import type { BankingEntry } from "../../../core/domain/entities/banking"

export class PostgresBankingRepository {
  private entries: BankingEntry[] = []

  async findByShipId(shipId: string): Promise<BankingEntry[]> {
    return this.entries.filter((e) => e.shipId === shipId)
  }

  async save(entry: BankingEntry): Promise<void> {
    this.entries.push(entry)
  }

  async getBalance(shipId: string): Promise<number> {
    const entries = await this.findByShipId(shipId)
    return entries.reduce((sum, e) => sum + e.netBalance, 0)
  }
}
