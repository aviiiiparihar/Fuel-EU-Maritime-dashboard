// Port defining banking repository interface
import type { BankEntry } from "../domain/entities/bank-entry"

export interface IBankingRepository {
  getByShipAndYear(shipId: string, year: number): Promise<BankEntry | null>
  getByShip(shipId: string): Promise<BankEntry[]>
  create(entry: BankEntry): Promise<BankEntry>
  update(id: string, entry: Partial<BankEntry>): Promise<BankEntry>
}
