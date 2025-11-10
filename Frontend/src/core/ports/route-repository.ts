import type { Route } from "@/core/domain/entities/route"

export interface IRouteRepository {
  getRoutes(): Promise<Route[]>
  setBaseline(routeId: string): Promise<void>
  getComparison(baselineId: string, comparisonId: string): Promise<{ baseline: Route; comparison: Route }>
}
