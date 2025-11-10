import { Router, type Request, type Response } from "express"
import { ComplianceService } from "@/core/application/services/compliance-service"
import { mockComplianceRepository } from "@/adapters/infrastructure/mock-repositories/mock-compliance-repository"

const router = Router()
const complianceService = new ComplianceService(mockComplianceRepository)

router.get("/", async (req: Request, res: Response) => {
  try {
    const year = req.query.year ? Number.parseInt(req.query.year as string) : undefined
    const compliance = await complianceService.getCompliance(year)
    res.json({
      success: true,
      data: compliance,
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
    const compliance = await complianceService.createCompliance(req.body)
    res.status(201).json({
      success: true,
      data: compliance,
    })
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
})

export default router
