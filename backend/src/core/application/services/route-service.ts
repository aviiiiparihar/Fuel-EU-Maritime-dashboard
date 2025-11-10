import type { Route } from "../../domain/entities/route"
import type { IRouteRepository } from "../ports/route-repository"

export class RouteService {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async getRoutes(filters?: {
    vesselType?: string
    fuelType?: string
    year?: number
  }): Promise<Route[]> {
    if (filters && Object.keys(filters).length > 0) {
      return this.routeRepository.findByFilters(filters)
    }
    return this.routeRepository.findAll()
  }

  async getRouteById(id: string): Promise<Route | null> {
    return this.routeRepository.findById(id)
  }

  async createRoute(route: Omit<Route, "id">): Promise<Route> {
    const newRoute: Route = {
      ...route,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return this.routeRepository.save(newRoute)
  }

  async setBaseline(id: string): Promise<void> {
    await this.routeRepository.setBaseline(id)
  }

  private generateId(): string {
    return `route_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}
