import express from 'express';
import { createBankingRouter } from '../../adapters/inbound/http/banking.controller';
import { createComplianceRouter } from '../../adapters/inbound/http/compliance.controller';
import { createPoolsRouter } from '../../adapters/inbound/http/pools.controller';
import { createRoutesRouter } from '../../adapters/inbound/http/routes.controller';
import { errorHandler } from '../../adapters/inbound/http/error-handler';

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use('/routes', createRoutesRouter());
  app.use('/compliance', createComplianceRouter());
  app.use('/banking', createBankingRouter());
  app.use('/pools', createPoolsRouter());

  app.use(errorHandler);

  return app;
}

