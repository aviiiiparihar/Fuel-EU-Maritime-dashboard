import { ComplianceRepositoryPort } from '../../../core/ports/repositories';
import { ComplianceBalance } from '../../../core/domain/models';
import { prisma } from '../../../infrastructure/db/prisma';

export class ComplianceRepositoryPrisma implements ComplianceRepositoryPort {
  async findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null> {
    const row = await prisma.shipCompliance.findUnique({
      where: {
        shipId_year: {
          shipId,
          year,
        },
      },
    });

    if (!row) return null;

    return {
      shipId: row.shipId,
      year: row.year,
      cbValue: row.cbGco2eq,
    };
  }

  async save(balance: ComplianceBalance): Promise<void> {
    await prisma.shipCompliance.upsert({
      where: {
        shipId_year: {
          shipId: balance.shipId,
          year: balance.year,
        },
      },
      create: {
        shipId: balance.shipId,
        year: balance.year,
        cbGco2eq: balance.cbValue,
      },
      update: {
        cbGco2eq: balance.cbValue,
      },
    });
  }
}

