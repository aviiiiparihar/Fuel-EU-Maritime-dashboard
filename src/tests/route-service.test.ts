// Unit tests for route service
import { RouteService } from "../core/application/services/route-service"
import { PostgresRouteRepository } from "../adapters/infrastructure/postgres/route-repository"
import { RouteEntity } from "../core/domain/entities/route"

describe("RouteService", () => {
  let routeService: RouteService
  let routeRepository: PostgresRouteRepository

  beforeEach(() => {
    routeRepository = new PostgresRouteRepository()
    routeService = new RouteService(routeRepository)
  })

  it("should get all routes", async () => {
    const route = new RouteEntity({
      id: "1",
      routeId: "ROUTE_001",
      year: 2025,
      ghgIntensity: 89.3368,
      isBaseline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await routeRepository.create(route)
    const routes = await routeService.getAllRoutes()

    expect(routes).toHaveLength(1)
    expect(routes[0].routeId).toBe("ROUTE_001")
  })

  it("should calculate comparison with baseline", async () => {
    const baseline = new RouteEntity({
      id: "1",
      routeId: "ROUTE_001",
      year: 2025,
      ghgIntensity: 89.3368,
      isBaseline: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const other = new RouteEntity({
      id: "2",
      routeId: "ROUTE_002",
      year: 2025,
      ghgIntensity: 85.2,
      isBaseline: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await routeRepository.create(baseline)
    await routeRepository.create(other)

    const comparison = await routeService.getComparison(2025)

    expect(comparison).toHaveLength(2)
    expect(comparison.some((c) => (c as any).compliant === true)).toBe(true)
  })
})
