import { Router, type Request, type Response } from "express"
import { RouteService } from "@/core/application/services/route-service"
import { mockRouteRepository } from "@/adapters/infrastructure/mock-repositories/mock-route-repository"

const router = Router()
const routeService = new RouteService(mockRouteRepository)

router.get("/", async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? Number.parseInt(req.query.year as string) : undefined
    const routes = await routeService.getRoutes(year)
    res.json({
      success: true,
      data: routes,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const route = await routeService.getRouteById(req.params.id)
    if (!route) {
      return res.status(404).json({
        success: false,
        error: "Route not found",
      })
    }
    res.json({
      success: true,
      data: route,
    })
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

router.post("/", async (req: Request, res: Response) => {
  try {
    const route = await routeService.createRoute(req.body)
    res.status(201).json({
      success: true,
      data: route,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

export default router
