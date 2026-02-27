import { Router } from 'express';
import { RouteRepositoryPrisma } from '../../outbound/postgres/route.repository.prisma';
import { ListRoutesUseCase } from '../../../core/application/routes/list-routes.usecase';
import { SetBaselineRouteUseCase } from '../../../core/application/routes/set-baseline-route.usecase';
import { CompareBaselineRoutesUseCase } from '../../../core/application/routes/compare-baseline-routes.usecase';
import { requireString } from './validation';

export function createRoutesRouter(): Router {
  const router = Router();

  const routeRepo = new RouteRepositoryPrisma();
  const listRoutes = new ListRoutesUseCase(routeRepo);
  const setBaseline = new SetBaselineRouteUseCase(routeRepo);
  const compare = new CompareBaselineRoutesUseCase(routeRepo);

  router.get('/', async (_req, res, next) => {
    try {
      const routes = await listRoutes.execute();
      res.json(routes);
    } catch (e) {
      next(e);
    }
  });

  router.post('/:id/baseline', async (req, res, next) => {
    try {
      const routeId = requireString(req.params.id, 'id');
      await setBaseline.execute({ routeId });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  router.get('/comparison', async (_req, res, next) => {
    try {
      const result = await compare.execute();
      res.json(result);
    } catch (e) {
      next(e);
    }
  });

  return router;
}

