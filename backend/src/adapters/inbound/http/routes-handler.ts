import { Router, type Request, type Response } from "express"

export class RoutesHandler {
  private router: Router

  constructor(private routeService: any) {
    this.router = Router()
    this.setupRoutes()
  }

  private setupRoutes() {
    this.router.get("/", async (req: Request, res: Response) => {
      try {
        const routes = await this.routeService.getAllRoutes()
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

    this.router.get("/:id", async (req: Request, res: Response) => {
      try {
        const route = await this.routeService.getRouteById(req.params.id)
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

    this.router.post("/", async (req: Request, res: Response) => {
      try {
        await this.routeService.createRoute(req.body)
        res.status(201).json({
          success: true,
          data: req.body,
        })
      } catch (error: any) {
        res.status(400).json({
          success: false,
          error: error.message,
        })
      }
    })
  }

  getRouter(): Router {
    return this.router
  }
}
