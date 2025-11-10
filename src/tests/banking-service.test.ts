// Integration tests for banking service
import { BankingService } from "../core/application/services/banking-service"
import { PostgresBankingRepository } from "../adapters/infrastructure/postgres/banking-repository"
import { PostgresComplianceRepository } from "../adapters/infrastructure/postgres/compliance-repository"
import { ShipComplianceEntity } from "../core/domain/entities/compliance"

describe("BankingService", () => {
  let bankingService: BankingService
  let bankingRepository: PostgresBankingRepository
  let complianceRepository: PostgresComplianceRepository

  beforeEach(() => {
    bankingRepository = new PostgresBankingRepository()
    complianceRepository = new PostgresComplianceRepository()
    bankingService = new BankingService(bankingRepository, complianceRepository)
  })

  it("should bank surplus successfully", async () => {
    const compliance = new ShipComplianceEntity({
      id: "c1",
      shipId: "SHIP_001",
      year: 2025,
      cbGco2eq: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await complianceRepository.create(compliance)
    const banked = await bankingService.bankSurplus("SHIP_001", 2025, 250)

    expect(banked.amountGco2eq).toBe(250)
  })

  it("should reject banking more than available", async () => {
    const compliance = new ShipComplianceEntity({
      id: "c1",
      shipId: "SHIP_002",
      year: 2025,
      cbGco2eq: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await complianceRepository.create(compliance)

    await expect(bankingService.bankSurplus("SHIP_002", 2025, 200)).rejects.toThrow(
      "Cannot bank more than available surplus",
    )
  })

  it("should apply banked surplus correctly", async () => {
    const compliance = new ShipComplianceEntity({
      id: "c1",
      shipId: "SHIP_003",
      year: 2025,
      cbGco2eq: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await complianceRepository.create(compliance)
    await bankingService.bankSurplus("SHIP_003", 2025, 300)
    const applied = await bankingService.applyBanked("SHIP_003", 2025, 100)

    expect(applied.amountGco2eq).toBe(200)
  })
})
