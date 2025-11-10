// PostgreSQL implementation of banking repository
import { type BankEntry, BankEntryEntity } from "../../../core/domain/entities/bank-entry"
import type { IBankingRepository } from "../../../core/ports/banking-repository"

// Mock implementation
export class PostgresBankingRepository implements IBankingRepository {
  private entries: BankEntry[] = []

  async getByShipAndYear(shipId: string, year: number): Promise<BankEntry | null> {
    return this.entries.find((e) => e.shipId === shipId && e.year === year) || null
  }

  async getByShip(shipId: string): Promise<BankEntry[]> {
    return this.entries.filter((e) => e.shipId === shipId)
  }

  async create(entry: BankEntry): Promise<BankEntry> {
    const entity = new BankEntryEntity(entry)
    this.entries.push(entity)
    return entity
  }

  async update(id: string, updates: Partial<BankEntry>): Promise<BankEntry> {
    const entry = this.entries.find((e) => e.id === id)
    if (!entry) throw new Error("Bank entry not found")
    Object.assign(entry, updates, { updatedAt: new Date() })
    return entry
  }
}
