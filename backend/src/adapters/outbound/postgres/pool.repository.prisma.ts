import { PoolRepositoryPort } from '../../../core/ports/repositories';
import { PoolMember } from '../../../core/domain/models';
import { prisma } from '../../../infrastructure/db/prisma';

export class PoolRepositoryPrisma implements PoolRepositoryPort {
  async savePool(year: number, members: PoolMember[]): Promise<void> {
    await prisma.pool.create({
      data: {
        year,
        members: {
          create: members.map((m) => ({
            shipId: m.shipId,
            cbBefore: m.cbBefore,
            cbAfter: m.cbAfter,
          })),
        },
      },
    });
  }
}

