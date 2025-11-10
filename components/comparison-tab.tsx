"use client"

import { useState } from "react"
import { Flag, HandPlatter as HandPointer } from "lucide-react"
import ComparisonChart from "@/components/comparison-chart"
import ComparisonTable from "@/components/comparison-table"

const TARGET_INTENSITY = 89.3368

// TODO: Replace with GET /api/routes/comparison to fetch comparison data
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

export default function ComparisonTab() {
  const [comparisonRouteId, setComparisonRouteId] = useState("R002")

  const baseline = MOCK_ROUTES.find((r) => r.isBaseline) || MOCK_ROUTES[0]
  const comparison = MOCK_ROUTES.find((r) => r.routeId === comparisonRouteId) || MOCK_ROUTES[1]

  return (
    <div className="space-y-6">
      {/* Target Banner */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-r-md flex items-center justify-between">
        <div className="flex items-center gap-3 text-blue-900">
          <Flag className="w-5 h-5" />
          <div className="text-sm">
            <span className="font-medium">Target:</span>
            <span> {TARGET_INTENSITY} gCO₂e/MJ</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-200 text-blue-900 border border-blue-300">
              2% reduction
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-blue-900">
          <HandPointer className="w-4 h-4" />
          <span>Tip: Click a bar to set comparison route</span>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable baseline={baseline} comparison={comparison} targetIntensity={TARGET_INTENSITY} />

      {/* Chart */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-medium tracking-tight">GHG Intensity Comparison</div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 text-blue-700">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-sm border border-blue-600"></span> Baseline
            </div>
            <div className="flex items-center gap-1 text-green-700">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-sm border border-green-600"></span> Compliant
            </div>
            <div className="flex items-center gap-1 text-red-700">
              <span className="inline-block w-3 h-3 bg-red-500 rounded-sm border border-red-600"></span> Non-compliant
            </div>
          </div>
        </div>
        <ComparisonChart
          routes={MOCK_ROUTES}
          baselineId={baseline.routeId}
          targetIntensity={TARGET_INTENSITY}
          onBarClick={setComparisonRouteId}
        />
      </div>
    </div>
  )
}
