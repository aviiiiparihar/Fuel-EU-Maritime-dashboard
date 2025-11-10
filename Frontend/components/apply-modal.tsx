"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ApplyModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (amount: number) => void
  maxAmount: number
}

export default function ApplyModal({ open, onClose, onConfirm, maxAmount }: ApplyModalProps) {
  const [amount, setAmount] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!open) {
      setAmount("")
      setError("")
    }
  }, [open])

  const handleConfirm = () => {
    const num = Number(amount)
    if (!amount || num <= 0) {
      setError("Enter a valid amount")
      return
    }
    if (num > maxAmount) {
      setError("Insufficient banked balance")
      return
    }
    onConfirm(num)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white w-[90%] max-w-md rounded-lg shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="font-semibold tracking-tight">Apply Banked Amount</div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 outline outline-1 outline-transparent focus:outline-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            Available banked: <span className="font-medium text-gray-800">{maxAmount.toLocaleString()}</span> gCO₂e
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Amount to apply (gCO₂e)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 150000"
              min="0"
              className="w-full px-3 py-2.5 rounded-md border border-gray-300 bg-white text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500"
            />
          </div>
          {error && (
            <div className="bg-red-50 text-red-800 border-l-4 border-red-500 p-2 rounded-r-md text-sm">{error}</div>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-md border border-gray-300 bg-white text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2.5 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
