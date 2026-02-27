import { Router } from 'express';
import { BankRepositoryPrisma } from '../../outbound/postgres/bank.repository.prisma';
import { ComplianceRepositoryPrisma } from '../../outbound/postgres/compliance.repository.prisma';
import { GetBankRecordUseCase } from '../../../core/application/banking/get-bank-record.usecase';
import { BankSurplusForShipUseCase } from '../../../core/application/banking/bank-surplus-for-ship.usecase';
import { ApplyBankedForShipUseCase } from '../../../core/application/banking/apply-banked-for-ship.usecase';
import {
  requireIntFromQuery,
  requireNumber,
  requireString,
  requireStringFromQuery,
} from './validation';

export function createBankingRouter(): Router {
  const router = Router();

  const bankRepo = new BankRepositoryPrisma();
  const complianceRepo = new ComplianceRepositoryPrisma();

  const getBankRecord = new GetBankRecordUseCase(bankRepo);
  const bankSurplusForShip = new BankSurplusForShipUseCase(complianceRepo, bankRepo);
  const applyBankedForShip = new ApplyBankedForShipUseCase(complianceRepo, bankRepo);

  router.get('/records', async (req, res, next) => {
    try {
      const shipId = requireStringFromQuery(req.query.shipId, 'shipId');
      const year = requireIntFromQuery(req.query.year, 'year');
      const record = await getBankRecord.execute({ shipId, year });
      res.json(record);
    } catch (e) {
      next(e);
    }
  });

  router.post('/bank', async (req, res, next) => {
    try {
      const shipId = requireString(req.body?.shipId, 'shipId');
      const year = requireNumber(req.body?.year, 'year');
      if (!Number.isInteger(year)) {
        throw new Error('year must be an integer.');
      }

      const entry = await bankSurplusForShip.execute({ shipId, year });
      res.status(201).json(entry);
    } catch (e) {
      next(e);
    }
  });

  router.post('/apply', async (req, res, next) => {
    try {
      const shipId = requireString(req.body?.shipId, 'shipId');
      const year = requireNumber(req.body?.year, 'year');
      if (!Number.isInteger(year)) {
        throw new Error('year must be an integer.');
      }
      const amount = requireNumber(req.body?.amount, 'amount');

      const result = await applyBankedForShip.execute({ shipId, year, amount });
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

