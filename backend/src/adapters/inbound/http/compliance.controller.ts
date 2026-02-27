import { Router } from 'express';
import { ComplianceRepositoryPrisma } from '../../outbound/postgres/compliance.repository.prisma';
import { RouteRepositoryPrisma } from '../../outbound/postgres/route.repository.prisma';
import { BankRepositoryPrisma } from '../../outbound/postgres/bank.repository.prisma';
import { ComputeCbAndStoreUseCase } from '../../../core/application/compliance/compute-cb-and-store.usecase';
import { GetAdjustedCbUseCase } from '../../../core/application/compliance/get-adjusted-cb.usecase';
import { requireIntFromQuery, requireStringFromQuery } from './validation';

export function createComplianceRouter(): Router {
  const router = Router();

  const routeRepo = new RouteRepositoryPrisma();
  const complianceRepo = new ComplianceRepositoryPrisma();
  const bankRepo = new BankRepositoryPrisma();

  const computeAndStore = new ComputeCbAndStoreUseCase(routeRepo, complianceRepo);
  const getAdjusted = new GetAdjustedCbUseCase(complianceRepo, bankRepo);

  router.get('/cb', async (req, res, next) => {
    try {
      const shipId = requireStringFromQuery(req.query.shipId, 'shipId');
      const year = requireIntFromQuery(req.query.year, 'year');
      const balance = await computeAndStore.execute({ shipId, year });
      res.json(balance);
    } catch (e) {
      next(e);
    }
  });

  router.get('/adjusted-cb', async (req, res, next) => {
    try {
      const shipId = requireStringFromQuery(req.query.shipId, 'shipId');
      const year = requireIntFromQuery(req.query.year, 'year');
      const result = await getAdjusted.execute({ shipId, year });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

