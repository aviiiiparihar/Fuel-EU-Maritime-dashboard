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

  filterRoutes(routes: Route[], vesselType?: string, fuelType?: string, year?: string): Route[] {
    return routes.filter(
      (r) =>
        (!vesselType || r.vesselType === vesselType) &&
        (!fuelType || r.fuelType === fuelType) &&
        (!year || String(r.year) === year),
    )
  }
}
