"use client"

import { useState } from "react"
import { Ship, Users, ChevronDown } from "lucide-react"

// TODO: Replace with GET /api/compliance/adjusted-cb?year=2025 to fetch ship compliance balances
const initialShips = [
  { id: "Ship A", cb: 500000 },
  { id: "Ship B", cb: -300000 },
  { id: "Ship C", cb: 200000 },
  { id: "Ship D", cb: -150000 },
  { id: "Ship E", cb: -100000 },
]

interface PoolMember {
  shipId: string
  cbBefore: number
  cbAfter: number
  change: number
  status: string
}

export default function PoolingTab() {
  const [ships] = useState(initialShips)
  const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set(ships.map((s) => s.id)))
  const fmt = new Intl.NumberFormat("en-US")

  // Greedy allocation algorithm
  const greedyAllocation = (selected: typeof initialShips): PoolMember[] => {
    const surpluses = selected
      .filter((s) => s.cb > 0)
      .sort((a, b) => b.cb - a.cb)
      .map((s) => ({ ...s }))
    const deficits = selected
      .filter((s) => s.cb < 0)
      .sort((a, b) => a.cb - b.cb)
      .map((s) => ({ ...s }))
    const afterMap = new Map(selected.map((s) => [s.id, s.cb]))

    let sIdx = 0
    for (const def of deficits) {
      let need = -def.cb
      while (need > 0 && sIdx < surpluses.length) {
        const supplier = surpluses[sIdx]
        if (supplier.cb <= 0) {
          sIdx++
          continue
        }
        const give = Math.min(supplier.cb, need)
        supplier.cb -= give
        need -= give
        afterMap.set(def.id, afterMap.get(def.id)! + give)
        afterMap.set(supplier.id, afterMap.get(supplier.id)! - give)
        if (supplier.cb <= 0) sIdx++
      }
    }

    return selected.map((s) => {
      const after = afterMap.get(s.id)!
      const change = after - s.cb
      const improved = (s.cb < 0 && after >= s.cb) || (s.cb >= 0 && after <= s.cb)
      return {
        shipId: s.id,
        cbBefore: s.cb,
        cbAfter: after,
        change,
        status: improved ? "✅ Valid" : "❌ Invalid",
      }
    })
  }

  const selected = ships.filter((s) => selectedShips.has(s.id))
  const poolSum = selected.reduce((acc, s) => acc + s.cb, 0)
  const allocation = greedyAllocation(selected)

  const allValid = allocation.every((r) => {
    const rule1 = r.cbBefore < 0 ? r.cbAfter >= r.cbBefore : true
    const rule2 = r.cbBefore >= 0 ? r.cbAfter >= 0 : true
    return rule1 && rule2 && r.status.startsWith("✅")
  })

  const poolValid = poolSum >= 0 && allValid

  const errors: string[] = []
  if (poolSum < 0) {
    errors.push(`Pool sum must be ≥ 0 (current: ${fmt.format(poolSum)})`)
  }
  allocation.forEach((r) => {
    if (r.cbBefore < 0 && r.cbAfter < r.cbBefore) {
      errors.push(`${r.shipId} cannot exit worse than entry`)
    }
    if (r.cbBefore >= 0 && r.cbAfter < 0) {
      errors.push(`${r.shipId} would go negative (not allowed)`)
    }
  })

  const toggleShip = (shipId: string) => {
    const newSelected = new Set(selectedShips)
    if (newSelected.has(shipId)) {
      newSelected.delete(shipId)
    } else {
      newSelected.add(shipId)
    }
    setSelectedShips(newSelected)
  }

  // TODO: Call POST /api/pools with selected members and allocation to create pool
  const handleCreatePool = async () => {
    if (!poolValid) return

    const payload = {
      year: new Date().getFullYear(),
      members: selected,
    }

    try {
      const response = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        alert("Pool created successfully!")
      } else {
        alert("Failed to create pool")
      }
    } catch (error) {
      alert("Error creating pool: " + error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <label className="block text-xs text-gray-600 mb-1">Year</label>
          <div className="w-48 relative">
            <select className="w-full appearance-none px-3 py-2.5 rounded-md border border-gray-300 bg-white text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500">
              <option>{new Date().getFullYear()}</option>
              <option>{new Date().getFullYear() - 1}</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-[34px] text-gray-500 w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ship Selection */}
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Ship className="w-5 h-5 text-gray-700" />
            <div className="font-medium tracking-tight">Select Pool Members</div>
          </div>
          <div className="space-y-3">
            {ships.map((ship) => (
              <label
                key={ship.id}
                className="flex items-center justify-between p-3 rounded-md bg-white border border-gray-200 hover:border-gray-300 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedShips.has(ship.id)}
                    onChange={() => toggleShip(ship.id)}
                    className="peer sr-only"
                  />
                  <span className="h-5 w-5 grid place-items-center rounded border border-gray-300 peer-checked:bg-blue-600 peer-checked:border-blue-600 text-white text-sm">
                    {selectedShips.has(ship.id) && "✓"}
                  </span>
                  <span className="text-base">{ship.id}</span>
                </div>
                <div className={`text-base font-medium ${ship.cb >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {ship.cb >= 0 ? "+" : ""}
                  {fmt.format(ship.cb)} gCO₂e
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Pool Summary */}
        <div className="lg:col-span-3">
          <div
            className={`p-8 rounded-xl shadow-xl border text-center ${
              poolValid ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            }`}
          >
            <div className="text-sm text-gray-600 mb-2">Pool Sum</div>
            <div className="text-3xl font-semibold tracking-tight">
              {poolSum >= 0 ? "+" : ""}
              {fmt.format(poolSum)} gCO₂e
            </div>
            <div
              className={`mt-3 flex items-center justify-center gap-2 text-sm ${poolValid ? "text-green-800" : "text-red-800"}`}
            >
              <span>{poolValid ? "✅" : "❌"}</span>
              <span>{poolValid ? "Pool is valid - can be created" : "Pool is invalid"}</span>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              Member Count: <span className="font-medium">{selected.length}</span>
            </div>
            <div className="mt-6 p-3 rounded-md bg-white border border-gray-200 text-sm text-gray-700">
              <div className="font-medium mb-1">Allocation Logic</div>
              <div className="text-xs">
                "Greedy Allocation: Surplus ships transfer to deficit ships in order" - Sort by CB descending, transfer
                surplus to cover deficits, ensure no deficit ship exits worse, ensure no surplus ship goes negative.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-600" />
          <div className="font-medium tracking-tight">Members</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-gray-700">
                <th className="text-left px-4 py-3 font-semibold">Ship ID</th>
                <th className="text-left px-4 py-3 font-semibold">CB Before</th>
                <th className="text-left px-4 py-3 font-semibold">CB After (Projected)</th>
                <th className="text-left px-4 py-3 font-semibold">Change</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allocation.map((member) => (
                <tr key={member.shipId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{member.shipId}</td>
                  <td className={`px-4 py-3 ${member.cbBefore >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {member.cbBefore >= 0 ? "+" : ""}
                    {fmt.format(member.cbBefore)}
                  </td>
                  <td className={`px-4 py-3 ${member.cbAfter >= 0 ? "text-green-700" : "text-red-700"}`}>
                    {member.cbAfter >= 0 ? "+" : ""}
                    {fmt.format(member.cbAfter)}
                  </td>
                  <td className={`px-4 py-3 ${member.change >= 0 ? "text-green-700" : "text-orange-600"}`}>
                    {member.change >= 0 ? "+" : ""}
                    {fmt.format(member.change)}
                  </td>
                  <td className="px-4 py-3">{member.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, idx) => (
            <div key={idx} className="bg-red-50 text-red-800 border-l-4 border-red-500 p-3 rounded-r-md text-sm">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      {/* Create Pool Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCreatePool}
          disabled={!poolValid}
          className={`px-5 py-3 rounded-lg text-white text-sm font-medium outline outline-1 outline-transparent focus:outline-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            poolValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-200 text-gray-700"
          }`}
        >
          Create Pool
        </button>
      </div>
    </div>
  )
}
