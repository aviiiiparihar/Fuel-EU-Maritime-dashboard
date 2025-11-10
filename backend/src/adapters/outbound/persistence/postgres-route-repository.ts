// Mock repository implementation for routes
import type { Route } from "../../../core/domain/entities/route"

export class PostgresRouteRepository {
  private routes: Route[] = []

  async findAll(): Promise<Route[]> {
    return this.routes
  }

  async findById(id: string): Promise<Route | null> {
    return this.routes.find((r) => r.id === id) || null
  }

  async save(route: Route): Promise<void> {
    this.routes.push(route)
  }

  async delete(id: string): Promise<void> {
    this.routes = this.routes.filter((r) => r.id !== id)
  }
}
