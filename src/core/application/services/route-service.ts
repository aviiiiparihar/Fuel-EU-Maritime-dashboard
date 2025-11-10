import type { IRouteRepository } from "@/core/ports/route-repository"
import type { Route } from "@/core/domain/entities/route"

export class RouteService {
  constructor(private routeRepository: IRouteRepository) {}

  async getRoutes(): Promise<Route[]> {
    return this.routeRepository.getRoutes()
  }

  async setBaseline(routeId: string): Promise<void> {
    return this.routeRepository.setBaseline(routeId)
  }

  async getComparison(baselineId: string, comparisonId: string) {
    return this.routeRepository.getComparison(baselineId, comparisonId)
  }

  async getRoutesByYear(year: number): Promise<Route[]> {
    return this.routeRepository.getRoutesByYear(year)
  }

  async getBaseline(year: number): Promise<Route | null> {
    return this.routeRepository.getBaseline(year)
  }

  async calculateComparisonMetrics(baseline: Route, comparison: Route) {
    const percentDiff = ((comparison.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100
    const isCompliant = comparison.ghgIntensity <= baseline.ghgIntensity

    return {
      ...comparison,
      percentDiff,
      isCompliant,
      baselineIntensity: baseline.ghgIntensity,
    }
  }

  filterRoutes(routes: Route[], vesselType?: string, fuelType?: string, year?: string): Route[] {
    return routes.filter(
      (r) =>
        (!vesselType || r.vesselType === vesselType) &&
        (!fuelType || r.fuelType === fuelType) &&
        (!year || String(r.year) === year),
    )
  }
}
