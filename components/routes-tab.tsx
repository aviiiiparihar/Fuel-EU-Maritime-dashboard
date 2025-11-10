"use client"

import { useState } from "react"
import { ChevronDown, Info } from "lucide-react"
import RoutesTable from "@/components/routes-table"

// TODO: Replace with GET /api/routes to fetch real routes data
const MOCK_ROUTES = [
  {
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true,
  },
  {
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    isBaseline: false,
  },
  {
    routeId: "R003",
    vesselType: "Tanker",
    fuelType: "MGO",
    year: 2024,
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    isBaseline: false,
  },
  {
    routeId: "R004",
    vesselType: "RoRo",
    fuelType: "HFO",
    year: 2025,
    ghgIntensity: 89.2,
    fuelConsumption: 4900,
    distance: 11800,
    totalEmissions: 4300,
    isBaseline: false,
  },
  {
    routeId: "R005",
    vesselType: "Container",
    fuelType: "LNG",
    year: 2025,
    ghgIntensity: 90.5,
    fuelConsumption: 4950,
    distance: 11900,
    totalEmissions: 4400,
    isBaseline: false,
  },
]

export default function RoutesTab() {
  const [routes, setRoutes] = useState(MOCK_ROUTES)
  const [filterVessel, setFilterVessel] = useState("")
  const [filterFuel, setFilterFuel] = useState("")
  const [filterYear, setFilterYear] = useState("")

  const filteredRoutes = routes.filter(
    (r) =>
      (!filterVessel || r.vesselType === filterVessel) &&
      (!filterFuel || r.fuelType === filterFuel) &&
      (!filterYear || String(r.year) === filterYear),
  )

  // TODO: Call POST /api/routes/:routeId/baseline to set baseline
  const handleSetBaseline = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((r) => ({
        ...r,
        isBaseline: r.routeId === routeId,
      })),
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="w-full">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <label className="block text-xs text-gray-600 mb-1">Vessel Type</label>
            <div className="w-48 relative">
              <select
                value={filterVessel}
                onChange={(e) => setFilterVessel(e.target.value)}
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
                onChange={(e) => setFilterFuel(e.target.value)}
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
                onChange={(e) => setFilterYear(e.target.value)}
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

      <RoutesTable routes={filteredRoutes} onSetBaseline={handleSetBaseline} />
    </div>
  )
}
