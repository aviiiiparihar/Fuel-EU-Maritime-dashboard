import type { Route } from "../../domain/entities/route"

export interface IRouteRepository {
  findAll(): Promise<Route[]>
  findById(id: string): Promise<Route | null>
  findByFilters(filters: {
    vesselType?: string
    fuelType?: string
    year?: number
  }): Promise<Route[]>
  save(route: Route): Promise<Route>
  update(id: string, route: Partial<Route>): Promise<Route>
  delete(id: string): Promise<void>
  setBaseline(id: string): Promise<void>
}
