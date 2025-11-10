import { Router, type Request, type Response } from "express"
import { BankingService } from "@/core/application/services/banking-service"
import { mockBankingRepository } from "@/adapters/infrastructure/mock-repositories/mock-banking-repository"

const router = Router()
const bankingService = new BankingService(mockBankingRepository)

router.get("/", async (req: Request, res: Response) => {
  try {
    const banking = await bankingService.getBanking()
    res.json({
      success: true,
      data: banking,
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
    const entry = await bankingService.createBankingEntry(req.body)
    res.status(201).json({
      success: true,
      data: entry,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

export default router
