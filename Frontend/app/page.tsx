"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/adapters/ui/components/layout/sidebar"
import { Header } from "@/adapters/ui/components/layout/header"
import { RoutesTab } from "@/adapters/ui/components/tabs/routes-tab"
import { ComparisonTab } from "@/adapters/ui/components/tabs/comparison-tab"
import { BankingTab } from "@/adapters/ui/components/tabs/banking-tab"
import { PoolingTab } from "@/adapters/ui/components/tabs/pooling-tab"
import { RouteService } from "@/core/application/services/route-service"
import { ComplianceService } from "@/core/application/services/compliance-service"
import { PoolingService } from "@/core/application/services/pooling-service"
import { MockRouteRepository } from "@/adapters/infrastructure/mock-repositories/mock-route-repository"
import { MockComplianceRepository } from "@/adapters/infrastructure/mock-repositories/mock-compliance-repository"
import { MockPoolingRepository } from "@/adapters/infrastructure/mock-repositories/mock-pooling-repository"
import type { Route, ComplianceBalance, ComplianceTransaction, PoolMember } from "@/core/domain/entities/route"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3" | "tab4">("tab1")
  const [routes, setRoutes] = useState<Route[]>([])
  const [balance, setBalance] = useState<ComplianceBalance>({
    cbBefore: 0,
    applied: 0,
    cbAfter: 0,
    banked: 0,
  })
  const [transactions, setTransactions] = useState<ComplianceTransaction[]>([])
  const [ships, setShips] = useState<Array<{ id: string; cb: number }>>([])
  const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set())
  const [allocation, setAllocation] = useState<PoolMember[]>([])
  const [loading, setLoading] = useState(true)

  // Initialize services
  const routeService = new RouteService(new MockRouteRepository())
  const complianceService = new ComplianceService(new MockComplianceRepository())
  const poolingService = new PoolingService(new MockPoolingRepository())

  useEffect(() => {
    const initializeData = async () => {
      try {
        const routesData = await routeService.getRoutes()
        setRoutes(routesData)

        const balanceData = await complianceService.getBalance()
        setBalance(balanceData)

        const transactionsData = await complianceService.getTransactionHistory()
        setTransactions(transactionsData)

        const shipsData = await poolingService.getShips()
        setShips(shipsData)
        setSelectedShips(new Set(shipsData.map((s) => s.id)))

        const allocationData = await poolingService.allocatePool(shipsData)
        setAllocation(allocationData)
      } catch (error) {
        console.error("Failed to initialize data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleSetBaseline = async (routeId: string) => {
    await routeService.setBaseline(routeId)
    const updatedRoutes = await routeService.getRoutes()
    setRoutes(updatedRoutes)
  }

  const handleFilterRoutes = (vesselType: string, fuelType: string, year: string) => {
    // Filter logic handled in component
  }

  const handleBankSurplus = async (amount: number) => {
    if (amount > balance.cbAfter) {
      throw new Error("Amount exceeds current CB After")
    }
    await complianceService.bankSurplus(amount)

    const updatedBalance = await complianceService.getBalance()
    setBalance(updatedBalance)

    const updatedTransactions = await complianceService.getTransactionHistory()
    setTransactions(updatedTransactions)
  }

  const handleApplyBanked = async (amount: number) => {
    if (amount > balance.banked) {
      throw new Error("Insufficient banked balance")
    }
    await complianceService.applyBanked(amount)

    const updatedBalance = await complianceService.getBalance()
    setBalance(updatedBalance)

    const updatedTransactions = await complianceService.getTransactionHistory()
    setTransactions(updatedTransactions)
  }

  const handleShipToggle = (shipId: string) => {
    const newSelected = new Set(selectedShips)
    if (newSelected.has(shipId)) {
      newSelected.delete(shipId)
    } else {
      newSelected.add(shipId)
    }
    setSelectedShips(newSelected)

    const selectedShipsData = ships.filter((s) => newSelected.has(s.id))
    const sum = poolingService.calculatePoolSum(selectedShipsData)
    const alloc = poolingService.allocatePool(selectedShipsData)
    setAllocation(alloc)
  }

  const handleCreatePool = async () => {
    const selectedShipsData = ships.filter((s) => selectedShips.has(s.id))
    await poolingService.createPool(selectedShipsData)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        <Header />
        <section className="max-w-7xl mx-auto px-6 py-6 space-y-10">
          {activeTab === "tab1" && (
            <RoutesTab routes={routes} onSetBaseline={handleSetBaseline} onFilterChange={handleFilterRoutes} />
          )}
          {activeTab === "tab2" && <ComparisonTab routes={routes} />}
          {activeTab === "tab3" && (
            <BankingTab
              balance={balance}
              transactions={transactions}
              onBankSurplus={handleBankSurplus}
              onApplyBanked={handleApplyBanked}
            />
          )}
          {activeTab === "tab4" && (
            <PoolingTab
              ships={ships}
              allocation={allocation}
              poolSum={poolingService.calculatePoolSum(ships.filter((s) => selectedShips.has(s.id)))}
              isPoolValid={poolingService.isPoolValid(
                poolingService.calculatePoolSum(ships.filter((s) => selectedShips.has(s.id))),
                allocation,
              )}
              errors={[]}
              onShipToggle={handleShipToggle}
              onCreatePool={handleCreatePool}
              selectedShips={selectedShips}
            />
          )}
        </section>
      </main>
    </div>
  )
}
