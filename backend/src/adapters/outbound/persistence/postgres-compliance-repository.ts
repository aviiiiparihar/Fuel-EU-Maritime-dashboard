// Mock repository implementation for compliance
import type { Compliance } from "../../../core/domain/entities/compliance"

export class PostgresComplianceRepository {
  private compliance: Compliance[] = []

  async findByShipId(shipId: string): Promise<Compliance[]> {
    return this.compliance.filter((c) => c.shipId === shipId)
  }

  async save(data: Compliance): Promise<void> {
    this.compliance.push(data)
  }

  async update(id: string, data: Partial<Compliance>): Promise<void> {
    const index = this.compliance.findIndex((c) => c.id === id)
    if (index !== -1) {
      this.compliance[index] = { ...this.compliance[index], ...data }
    }
  }
}
