"use client"

import { useState } from "react"
import { ChevronDown, Info } from "lucide-react"
import { RoutesTable } from "@/adapters/ui/components/tables/routes-table"
import type { Route } from "@/core/domain/entities/route"

interface RoutesTabProps {
  routes: Route[]
  onSetBaseline: (routeId: string) => void
  onFilterChange: (vesselType: string, fuelType: string, filterYear: string) => void
}

export function RoutesTab({ routes, onSetBaseline, onFilterChange }: RoutesTabProps) {
  const [filterVessel, setFilterVessel] = useState("")
  const [filterFuel, setFilterFuel] = useState("")
  const [filterYear, setFilterYear] = useState("")

  const handleFilterChange = (vessel: string, fuel: string, year: string) => {
    setFilterVessel(vessel)
    setFilterFuel(fuel)
    setFilterYear(year)
    onFilterChange(vessel, fuel, year)
  }

  return (
    <div className="space-y-6">
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <label className="block text-xs text-gray-600 mb-1">Vessel Type</label>
            <div className="w-48 relative">
              <select
                value={filterVessel}
                onChange={(e) => handleFilterChange(e.target.value, filterFuel, filterYear)}
                className="peer w-full appearance-none px-3 py-2.5 rounded-md border border-gray-300 bg-white text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="">All</option>
                <option>Container</option>
                <option>BulkCarrier</option>
                <option>Tanker</option>
                <option>RoRo</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[34px] text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs text-gray-600 mb-1">Fuel Type</label>
            <div className="w-48 relative">
              <select
                value={filterFuel}
                onChange={(e) => handleFilterChange(filterVessel, e.target.value, filterYear)}
                className="peer w-full appearance-none px-3 py-2.5 rounded-md border border-gray-300 bg-white text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="">All</option>
                <option>HFO</option>
                <option>LNG</option>
                <option>MGO</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[34px] text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="relative">
            <label className="block text-xs text-gray-600 mb-1">Year</label>
            <div className="w-48 relative">
              <select
                value={filterYear}
                onChange={(e) => handleFilterChange(filterVessel, filterFuel, e.target.value)}
                className="peer w-full appearance-none px-3 py-2.5 rounded-md border border-gray-300 bg-white text-sm text-gray-800 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
              >
                <option value="">All</option>
                <option>2024</option>
                <option>2025</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-[34px] text-gray-500 w-4 h-4" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
            <Info className="w-4 h-4" />
            <span>Set one baseline route at a time</span>
          </div>
        </div>
      </div>

      <RoutesTable routes={routes} onSetBaseline={onSetBaseline} />
    </div>
  )
}
