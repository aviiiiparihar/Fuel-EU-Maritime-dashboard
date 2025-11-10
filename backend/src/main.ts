import express from "express"
import cors from "cors"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

// Import domain services
import { RouteService } from "./core/application/services/route-service"
import { ComplianceService } from "./core/application/services/compliance-service"
import { BankingService } from "./core/application/services/banking-service"
import { PoolService } from "./core/application/services/pool-service"

// Import repositories (adapters)
import { PostgresRouteRepository } from "./adapters/outbound/persistence/postgres-route-repository"
import { PostgresComplianceRepository } from "./adapters/outbound/persistence/postgres-compliance-repository"
import { PostgresBankingRepository } from "./adapters/outbound/persistence/postgres-banking-repository"
import { PostgresPoolRepository } from "./adapters/outbound/persistence/postgres-pool-repository"

// Import HTTP handlers (adapters)
import { RoutesHandler } from "./adapters/inbound/http/routes-handler"
import { ComplianceHandler } from "./adapters/inbound/http/compliance-handler"
import { BankingHandler } from "./adapters/inbound/http/banking-handler"
import { PoolHandler } from "./adapters/inbound/http/pool-handler"

// Initialize app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

// Initialize repositories (Outbound adapters)
const routeRepository = new PostgresRouteRepository()
const complianceRepository = new PostgresComplianceRepository()
const bankingRepository = new PostgresBankingRepository()
const poolRepository = new PostgresPoolRepository()

// Initialize services (Application layer)
const routeService = new RouteService(routeRepository)
const complianceService = new ComplianceService(complianceRepository)
const bankingService = new BankingService(bankingRepository, complianceRepository)
const poolService = new PoolService(poolRepository, complianceRepository)

// Initialize handlers (Inbound adapters)
const routesHandler = new RoutesHandler(routeService)
const complianceHandler = new ComplianceHandler(complianceService)
const bankingHandler = new BankingHandler(bankingService)
const poolHandler = new PoolHandler(poolService)

// Register routes
app.use("/api/routes", routesHandler.getRouter())
app.use("/api/compliance", complianceHandler.getRouter())
app.use("/api/banking", bankingHandler.getRouter())
app.use("/api/pools", poolHandler.getRouter())

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[v0] Error:", err)
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message,
  })
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`[v0] Backend server running on http://localhost:${PORT}`)
  console.log(`[v0] Health check: http://localhost:${PORT}/health`)
  console.log(`[v0] API endpoints:`)
  console.log(`[v0]   - GET  /api/routes`)
  console.log(`[v0]   - GET  /api/compliance/:shipId`)
  console.log(`[v0]   - GET  /api/banking/:shipId`)
  console.log(`[v0]   - GET  /api/pools`)
})

export default app
