// PostgreSQL implementation of route repository
import { type Route, RouteEntity } from "../../../core/domain/entities/route"
import type { IRouteRepository } from "../../../core/ports/route-repository"

// Mock implementation for now - replace with actual DB calls
export class PostgresRouteRepository implements IRouteRepository {
  private routes: Route[] = []

  async getAll(): Promise<Route[]> {
    return this.routes
  }

  async getById(id: string): Promise<Route | null> {
    return this.routes.find((r) => r.id === id) || null
  }

  async getByYear(year: number): Promise<Route[]> {
    return this.routes.filter((r) => r.year === year)
  }

  async getBaseline(year: number): Promise<Route | null> {
    return this.routes.find((r) => r.year === year && r.isBaseline) || null
  }

  async create(route: Route): Promise<Route> {
    const entity = new RouteEntity(route)
    this.routes.push(entity)
    return entity
  }

  async setBaseline(id: string, year: number): Promise<Route> {
    const route = this.routes.find((r) => r.id === id)
    if (!route) throw new Error("Route not found")
    route.isBaseline = true
    route.updatedAt = new Date()
    return route
  }

  async update(id: string, updates: Partial<Route>): Promise<Route> {
    const route = this.routes.find((r) => r.id === id)
    if (!route) throw new Error("Route not found")
    Object.assign(route, updates, { updatedAt: new Date() })
    return route
  }
}
