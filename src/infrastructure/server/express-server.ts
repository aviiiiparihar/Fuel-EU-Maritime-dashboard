// Express server setup
import express from "express"
import type { RoutesHandler } from "../../adapters/inbound/http/routes-handler"
import type { ComplianceHandler } from "../../adapters/inbound/http/compliance-handler"
import type { BankingHandler } from "../../adapters/inbound/http/banking-handler"
import type { PoolHandler } from "../../adapters/inbound/http/pool-handler"

export function setupExpressServer(
  routesHandler: RoutesHandler,
  complianceHandler: ComplianceHandler,
  bankingHandler: BankingHandler,
  poolHandler: PoolHandler,
) {
  const app = express()
  app.use(express.json())

  // Routes endpoints
  app.get("/routes", async (req, res) => {
    try {
      const routes = await routesHandler.getAll()
      res.json(routes)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.get("/routes/comparison", async (req, res) => {
    try {
      const year = Number.parseInt(req.query.year as string)
      const comparison = await routesHandler.getComparison(year)
      res.json(comparison)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post("/routes/:id/baseline", async (req, res) => {
    try {
      const { year } = req.body
      const route = await routesHandler.setBaseline(req.params.id, year)
      res.json(route)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // Compliance endpoints
  app.get("/compliance/cb", async (req, res) => {
    try {
      const { shipId, year, actualIntensity, fuelConsumption } = req.query
      const cb = await complianceHandler.computeCB(
        shipId as string,
        Number.parseInt(year as string),
        Number.parseFloat(actualIntensity as string),
        Number.parseFloat(fuelConsumption as string),
      )
      res.json(cb)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.get("/compliance/adjusted-cb", async (req, res) => {
    try {
      const { shipId, year } = req.query
      const adjustedCb = await complianceHandler.getAdjustedCB(shipId as string, Number.parseInt(year as string))
      res.json({ adjustedCb })
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // Banking endpoints
  app.get("/banking/records", async (req, res) => {
    try {
      const { shipId, year } = req.query
      const records = await bankingHandler.getRecords(shipId as string, Number.parseInt(year as string))
      res.json(records)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post("/banking/bank", async (req, res) => {
    try {
      const { shipId, year, amount } = req.body
      const entry = await bankingHandler.bankSurplus(shipId, year, amount)
      res.json(entry)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  app.post("/banking/apply", async (req, res) => {
    try {
      const { shipId, year, amount } = req.body
      const entry = await bankingHandler.applyBanked(shipId, year, amount)
      res.json(entry)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  // Pool endpoints
  app.post("/pools", async (req, res) => {
    try {
      const { shipIds, year } = req.body
      const result = await poolHandler.createPool(shipIds, year)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: (error as Error).message })
    }
  })

  return app
}
