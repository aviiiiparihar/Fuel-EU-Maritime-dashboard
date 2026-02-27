import { Router } from 'express';
import { ComplianceRepositoryPrisma } from '../../outbound/postgres/compliance.repository.prisma';
import { PoolRepositoryPrisma } from '../../outbound/postgres/pool.repository.prisma';
import { CreatePoolForShipsUseCase } from '../../../core/application/pooling/create-pool-for-ships.usecase';
import { requireNumber, requireStringArray } from './validation';

export function createPoolsRouter(): Router {
  const router = Router();

  const complianceRepo = new ComplianceRepositoryPrisma();
  const poolRepo = new PoolRepositoryPrisma();

  const createPoolForShips = new CreatePoolForShipsUseCase(complianceRepo, poolRepo);

  router.post('/', async (req, res, next) => {
    try {
      const year = requireNumber(req.body?.year, 'year');
      if (!Number.isInteger(year)) {
        throw new Error('year must be an integer.');
      }
      const shipIds = requireStringArray(req.body?.shipIds, 'shipIds');

      const result = await createPoolForShips.execute({ year, shipIds });
      res.status(201).json({
        year: result.year,
        members: result.members.map((m) => ({
          shipId: m.shipId,
          cb_before: m.cbBefore,
          cb_after: m.cbAfter,
        })),
      });
    } catch (e) {
      next(e);
    }
  });

  return router;
}

