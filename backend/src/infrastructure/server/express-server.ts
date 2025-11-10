import express, { type Express, type Request, type Response } from "express"
import routesHandler from "@/adapters/inbound/http/routes-handler"
import complianceHandler from "@/adapters/inbound/http/compliance-handler"
import bankingHandler from "@/adapters/inbound/http/banking-handler"
import poolHandler from "@/adapters/inbound/http/pool-handler"

const app: Express = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS
app.use((req: Request, res: Response, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Routes
app.use("/api/routes", routesHandler)
app.use("/api/compliance", complianceHandler)
app.use("/api/banking", bankingHandler)
app.use("/api/pooling", poolHandler)

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

export { app as expressServer }
