import { RouteRepositoryPort } from '../../ports/repositories';
import { CompareRoutesUseCase } from '../compare-routes.usecase';
import { Route } from '../../domain/models';

export interface RouteComparisonItem {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
}

export class CompareBaselineRoutesUseCase {
  constructor(private readonly routeRepo: RouteRepositoryPort) {}

  async execute(): Promise<RouteComparisonItem[]> {
    const baseline = await this.routeRepo.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route is set.');
    }

    const routes = await this.routeRepo.findAll();
    const comparer = new CompareRoutesUseCase();

    return routes.map((route: Route) => {
      const comparison = comparer.execute(baseline, route);
      return {
        routeId: route.routeId,
        ghgIntensity: route.ghgIntensity,
        percentDiff: route.routeId === baseline.routeId ? 0 : comparison.percentDiff,
        compliant: comparison.isCompliant,
      };
    });
  }
}

