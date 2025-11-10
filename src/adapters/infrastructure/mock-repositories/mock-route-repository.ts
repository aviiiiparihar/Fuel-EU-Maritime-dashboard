import type { IRouteRepository } from "@/core/ports/route-repository"
import type { Route } from "@/core/domain/entities/route"

const MOCK_ROUTES: Route[] = [
  {
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  },
  {
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
  {
    routeId: "R003",
    vesselType: "Tanker",
    fuelType: "MGO",
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    isBaseline: false,
  },
  {
    routeId: "R004",
    vesselType: "RoRo",
    fuelType: "HFO",
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
    isBaseline: false,
  },
  {
    routeId: "R005",
    vesselType: "Container",
    fuelType: "LNG",
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
    isBaseline: false,
  },
]

export class MockRouteRepository implements IRouteRepository {
  private routes = [...MOCK_ROUTES]

  async getRoutes(): Promise<Route[]> {
    return this.routes
  }

  async setBaseline(routeId: string): Promise<void> {
    this.routes = this.routes.map((r) => ({
      ...r,
      isBaseline: r.routeId === routeId,
    }))
  }

  async getComparison(baselineId: string, comparisonId: string) {
    const baseline = this.routes.find((r) => r.routeId === baselineId)
    const comparison = this.routes.find((r) => r.routeId === comparisonId)

    if (!baseline || !comparison) {
      throw new Error("Route not found")
    }

    return { baseline, comparison }
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    return this.routes.find((r) => r.routeId === routeId) || null
  }

  async getRoutesByYear(year: number): Promise<Route[]> {
    return this.routes.filter((r) => r.year === year)
  }

  async getBaseline(year: number): Promise<Route | null> {
    return this.routes.find((r) => r.year === year && r.isBaseline) || null
  }

  async create(route: Route): Promise<Route> {
    this.routes.push(route)
    return route
  }

  async update(routeId: string, updates: Partial<Route>): Promise<Route> {
    const index = this.routes.findIndex((r) => r.routeId === routeId)
    if (index === -1) throw new Error("Route not found")

    const updated = { ...this.routes[index], ...updates }
    this.routes[index] = updated
    return updated
  }
}
