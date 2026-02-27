import { BankRepositoryPort } from '../../../core/ports/repositories';
import { BankEntry } from '../../../core/domain/models';
import { prisma } from '../../../infrastructure/db/prisma';

export class BankRepositoryPrisma implements BankRepositoryPort {
  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry | null> {
    const row = await prisma.bankEntry.findUnique({
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
      amount: row.amountGco2eq,
    };
  }

  async save(entry: BankEntry): Promise<void> {
    await prisma.bankEntry.upsert({
      where: {
        shipId_year: {
          shipId: entry.shipId,
          year: entry.year,
        },
      },
      create: {
        shipId: entry.shipId,
        year: entry.year,
        amountGco2eq: entry.amount,
      },
      update: {
        amountGco2eq: entry.amount,
      },
    });
  }
}

