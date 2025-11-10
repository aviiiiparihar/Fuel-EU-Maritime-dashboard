"use client"
import { Ship, Users, ChevronDown } from "lucide-react"
import type { PoolMember } from "@/core/domain/entities/route"

interface PoolingTabProps {
  ships: Array<{ id: string; cb: number }>
  allocation: PoolMember[]
  poolSum: number
  isPoolValid: boolean
  errors: string[]
  onShipToggle: (shipId: string) => void
  onCreatePool: () => void
  selectedShips: Set<string>
}

export function PoolingTab({
  ships,
  allocation,
  poolSum,
  isPoolValid,
  errors,
  onShipToggle,
  onCreatePool,
  selectedShips,
}: PoolingTabProps) {
  const fmt = new Intl.NumberFormat("en-US")

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
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
                    onChange={() => onShipToggle(ship.id)}
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

        <div className="lg:col-span-3">
          <div
            className={`p-8 rounded-xl shadow-xl border text-center ${
              isPoolValid ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            }`}
          >
            <div className="text-sm text-gray-600 mb-2">Pool Sum</div>
            <div className="text-3xl font-semibold tracking-tight">
              {poolSum >= 0 ? "+" : ""}
              {fmt.format(poolSum)} gCO₂e
            </div>
            <div
              className={`mt-3 flex items-center justify-center gap-2 text-sm ${isPoolValid ? "text-green-800" : "text-red-800"}`}
            >
              <span>{isPoolValid ? "✅" : "❌"}</span>
              <span>{isPoolValid ? "Pool is valid - can be created" : "Pool is invalid"}</span>
            </div>
            <div className="mt-4 text-sm text-gray-700">
              Member Count: <span className="font-medium">{allocation.length}</span>
            </div>
            <div className="mt-6 p-3 rounded-md bg-white border border-gray-200 text-sm text-gray-700">
              <div className="font-medium mb-1">Allocation Logic</div>
              <div className="text-xs">
                Greedy Allocation: Surplus ships transfer to deficit ships in order - Sort by CB descending, transfer
                surplus to cover deficits, ensure no deficit ship exits worse, ensure no surplus ship goes negative.
              </div>
            </div>
          </div>
        </div>
      </div>

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

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, idx) => (
            <div key={idx} className="bg-red-50 text-red-800 border-l-4 border-red-500 p-3 rounded-r-md text-sm">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onCreatePool}
          disabled={!isPoolValid}
          className={`px-5 py-3 rounded-lg text-white text-sm font-medium outline outline-1 outline-transparent focus:outline-green-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            isPoolValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-200 text-gray-700"
          }`}
        >
          Create Pool
        </button>
      </div>
    </div>
  )
}
