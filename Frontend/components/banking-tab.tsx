"use client"

import { useState } from "react"
import { Scale, ArrowLeftRight, CheckCircle2, PiggyBank, Wallet, Database, History, Info } from "lucide-react"
import BankingModal from "@/components/banking-modal"
import ApplyModal from "@/components/apply-modal"

// TODO: Replace with GET /api/compliance/cb?year=2025 to fetch current compliance balance
// TODO: Replace with GET /api/banking/records?shipId&year to fetch transaction history
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

export default function BankingTab() {
  const [cbBefore, setCbBefore] = useState(initialState.cbBefore)
  const [applied, setApplied] = useState(initialState.applied)
  const [cbAfter, setCbAfter] = useState(initialState.cbAfter)
  const [banked, setBanked] = useState(initialState.banked)
  const [transactions, setTransactions] = useState(initialState.transactions)
  const [showBankModal, setShowBankModal] = useState(false)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [error, setError] = useState("")

  const fmt = new Intl.NumberFormat("en-US")

  // TODO: Call POST /api/banking/bank with amount to bank surplus
  const handleBankSurplus = (amount: number) => {
    if (amount <= 0) {
      setError("Enter a valid amount")
      return
    }
    if (amount > cbAfter) {
      setError("Amount exceeds current CB After")
      return
    }
    setBanked(banked + amount)
    setCbAfter(cbAfter - amount)
    setTransactions([
      { date: new Date().toISOString().slice(0, 10), action: "Bank Surplus", amount, balance: banked + amount },
      ...transactions,
    ])
    setShowBankModal(false)
  }

  // TODO: Call POST /api/banking/apply with amount to apply banked surplus
  const handleApplyBanked = (amount: number) => {
    if (amount <= 0) {
      setError("Enter a valid amount")
      return
    }
    if (amount > banked) {
      setError("Insufficient banked balance")
      return
    }
    setBanked(banked - amount)
    setCbAfter(cbAfter + amount)
    setApplied(-amount)
    setTransactions([
      {
        date: new Date().toISOString().slice(0, 10),
        action: "Apply Banked",
        amount: -amount,
        balance: banked - amount,
      },
      ...transactions,
    ])
    setShowApplyModal(false)
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`text-2xl md:text-3xl tracking-tight font-semibold ${cbBefore >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {cbBefore >= 0 ? "+" : ""}
                {fmt.format(cbBefore)} gCO₂e
              </div>
              <div className="text-sm text-gray-600 mt-1">Compliance Balance Before</div>
            </div>
            <div className="p-2 rounded-md bg-green-50 text-green-700 border border-green-200">
              <Scale className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`text-2xl md:text-3xl tracking-tight font-semibold ${applied >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {applied >= 0 ? "+" : ""}
                {fmt.format(applied)} gCO₂e
              </div>
              <div className="text-sm text-gray-600 mt-1">Banked Amount Applied</div>
            </div>
            <div className="p-2 rounded-md bg-red-50 text-red-700 border border-red-200">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div
                className={`text-2xl md:text-3xl tracking-tight font-semibold ${cbAfter >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {cbAfter >= 0 ? "+" : ""}
                {fmt.format(cbAfter)} gCO₂e
              </div>
              <div className="text-sm text-gray-600 mt-1">Compliance Balance After</div>
            </div>
            <div className="p-2 rounded-md bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() => setShowBankModal(true)}
          disabled={cbAfter <= 0}
          className="px-4 py-2.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 outline outline-1 outline-transparent focus:outline-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <PiggyBank className="w-4 h-4" />
          Bank Surplus
        </button>
        <button
          onClick={() => setShowApplyModal(true)}
          className="px-4 py-2.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 outline outline-1 outline-transparent focus:outline-green-300 flex items-center gap-2"
        >
          <Wallet className="w-4 h-4" />
          Apply Banked
        </button>
        <div className="text-sm text-gray-600 flex items-center gap-2 ml-auto">
          <Database className="w-4 h-4" />
          <span>
            Available banked: <span className="font-medium text-gray-800">{fmt.format(banked)}</span> gCO₂e
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-800 border-l-4 border-red-500 p-3 rounded-r-md text-sm flex items-center gap-2">
          <Info className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <History className="w-4 h-4 text-gray-600" />
          <div className="font-medium tracking-tight">Transaction History</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold">Action Type</th>
                <th className="text-left px-4 py-3 font-semibold">Amount (gCO₂e)</th>
                <th className="text-left px-4 py-3 font-semibold">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{tx.date}</td>
                  <td className="px-4 py-3">{tx.action}</td>
                  <td className={`px-4 py-3 ${tx.amount >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {tx.amount >= 0 ? "+" : ""}
                    {fmt.format(tx.amount)}
                  </td>
                  <td className="px-4 py-3">{fmt.format(tx.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BankingModal
        open={showBankModal}
        onClose={() => setShowBankModal(false)}
        onConfirm={handleBankSurplus}
        maxAmount={cbAfter}
      />
      <ApplyModal
        open={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onConfirm={handleApplyBanked}
        maxAmount={banked}
      />
    </div>
  )
}
