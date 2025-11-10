import type { Route } from "@/core/domain/entities/route"

export interface IRouteRepository {
  getRoutes(): Promise<Route[]>
  setBaseline(routeId: string): Promise<void>
  getComparison(baselineId: string, comparisonId: string): Promise<{ baseline: Route; comparison: Route }>
  getRouteById(routeId: string): Promise<Route | null>
  getRoutesByYear(year: number): Promise<Route[]>
  getBaseline(year: number): Promise<Route | null>
  create(route: Route): Promise<Route>
  update(routeId: string, updates: Partial<Route>): Promise<Route>
}
