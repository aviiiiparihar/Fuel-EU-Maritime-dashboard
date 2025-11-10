// PostgreSQL implementation of compliance repository
import { type ShipCompliance, ShipComplianceEntity } from "../../../core/domain/entities/compliance"
import type { IComplianceRepository } from "../../../core/ports/compliance-repository"

// Mock implementation
export class PostgresComplianceRepository implements IComplianceRepository {
  private compliances: ShipCompliance[] = []

  async getByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
    return this.compliances.find((c) => c.shipId === shipId && c.year === year) || null
  }

  async getByShip(shipId: string): Promise<ShipCompliance[]> {
    return this.compliances.filter((c) => c.shipId === shipId)
  }

  async create(compliance: ShipCompliance): Promise<ShipCompliance> {
    const entity = new ShipComplianceEntity(compliance)
    this.compliances.push(entity)
    return entity
  }

  async update(id: string, updates: Partial<ShipCompliance>): Promise<ShipCompliance> {
    const compliance = this.compliances.find((c) => c.id === id)
    if (!compliance) throw new Error("Compliance record not found")
    Object.assign(compliance, updates, { updatedAt: new Date() })
    return compliance
  }
}
