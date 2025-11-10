// Application entry point
import { setupExpressServer } from "./infrastructure/server/express-server"
import { RoutesHandler } from "./adapters/inbound/http/routes-handler"
import { ComplianceHandler } from "./adapters/inbound/http/compliance-handler"
import { BankingHandler } from "./adapters/inbound/http/banking-handler"
import { PoolHandler } from "./adapters/inbound/http/pool-handler"
import { RouteService } from "./core/application/services/route-service"
import { ComplianceService } from "./core/application/services/compliance-service"
import { BankingService } from "./core/application/services/banking-service"
import { PoolService } from "./core/application/services/pool-service"
import { PostgresRouteRepository } from "./adapters/infrastructure/postgres/route-repository"
import { PostgresComplianceRepository } from "./adapters/infrastructure/postgres/compliance-repository"
import { PostgresBankingRepository } from "./adapters/infrastructure/postgres/banking-repository"
import { PostgresPoolRepository } from "./adapters/infrastructure/postgres/pool-repository"

// Initialize repositories
const routeRepository = new PostgresRouteRepository()
const complianceRepository = new PostgresComplianceRepository()
const bankingRepository = new PostgresBankingRepository()
const poolRepository = new PostgresPoolRepository()

// Initialize services
const routeService = new RouteService(routeRepository)
const complianceService = new ComplianceService(complianceRepository, bankingRepository)
const bankingService = new BankingService(bankingRepository, complianceRepository)
const poolService = new PoolService(poolRepository, complianceRepository)

// Initialize handlers
const routesHandler = new RoutesHandler(routeService)
const complianceHandler = new ComplianceHandler(complianceService, bankingService)
const bankingHandler = new BankingHandler(bankingService)
const poolHandler = new PoolHandler(poolService)

// Setup server
const app = setupExpressServer(routesHandler, complianceHandler, bankingHandler, poolHandler)

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
