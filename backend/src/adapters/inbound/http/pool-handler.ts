import { Router, type Request, type Response } from "express"
import { PoolService } from "@/core/application/services/pool-service"
import { mockPoolingRepository } from "@/adapters/infrastructure/mock-repositories/mock-pooling-repository"

const router = Router()
const poolService = new PoolService(mockPoolingRepository)

router.get("/", async (req: Request, res: Response) => {
  try {
    const pooling = await poolService.getPooling()
    res.json({
      success: true,
      data: pooling,
      timestamp: new Date().toISOString(),
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
    const pool = await poolService.createPool(req.body)
    res.status(201).json({
      success: true,
      data: pool,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

export default router
