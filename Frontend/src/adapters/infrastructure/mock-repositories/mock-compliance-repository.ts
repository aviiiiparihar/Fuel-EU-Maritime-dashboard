import type { IComplianceRepository } from "@/core/ports/compliance-repository"
import type { ComplianceBalance, ComplianceTransaction } from "@/core/domain/entities/route"

const initialState = {
  cbBefore: 1250000,
  applied: 500000,
  cbAfter: 750000,
  banked: 2000000,
  transactions: [
    { date: "2025-03-15", action: "Bank Surplus", amount: 800000, balance: 2000000 },
    { date: "2025-04-20", action: "Apply Banked", amount: -500000, balance: 1500000 },
    { date: "2025-06-10", action: "Bank Surplus", amount: 1200000, balance: 2700000 },
  ],
}

export class MockComplianceRepository implements IComplianceRepository {
  private state = { ...initialState }

  async getBalance(): Promise<ComplianceBalance> {
    return {
      cbBefore: this.state.cbBefore,
      applied: this.state.applied,
      cbAfter: this.state.cbAfter,
      banked: this.state.banked,
    }
  }

  async bankSurplus(amount: number): Promise<ComplianceTransaction> {
    const transaction: ComplianceTransaction = {
      date: new Date().toISOString().slice(0, 10),
      action: "Bank Surplus",
      amount,
      balance: this.state.banked + amount,
    }

    this.state.banked += amount
    this.state.cbAfter -= amount
    this.state.transactions.unshift(transaction)

    return transaction
  }

  async applyBanked(amount: number): Promise<ComplianceTransaction> {
    const transaction: ComplianceTransaction = {
      date: new Date().toISOString().slice(0, 10),
      action: "Apply Banked",
      amount: -amount,
      balance: this.state.banked - amount,
    }

    this.state.banked -= amount
    this.state.cbAfter += amount
    this.state.applied = -amount
    this.state.transactions.unshift(transaction)

    return transaction
  }

  async getTransactionHistory(): Promise<ComplianceTransaction[]> {
    return this.state.transactions
  }
}
