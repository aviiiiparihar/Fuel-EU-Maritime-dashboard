// HTTP handler for routes endpoints
import type { RouteService } from "../../../core/application/services/route-service"

export class RoutesHandler {
  constructor(private routeService: RouteService) {}

  async getAll() {
    return this.routeService.getAllRoutes()
  }

  async getComparison(year: number) {
    return this.routeService.getComparison(year)
  }

  async setBaseline(routeId: string, year: number) {
    return this.routeService.setBaseline(routeId, year)
  }
}
