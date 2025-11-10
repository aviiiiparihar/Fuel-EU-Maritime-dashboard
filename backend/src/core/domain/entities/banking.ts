// Core domain entity: Banking Entry
export interface BankingEntry {
  id: string
  shipId: string
  year: number
  complianceBalance: number
  bankedBalance: number
  borrowedBalance: number
  netBalance: number
  createdAt: Date
}

export interface BankingTransaction {
  type: "bank" | "borrow"
  amount: number
  year: number
}
