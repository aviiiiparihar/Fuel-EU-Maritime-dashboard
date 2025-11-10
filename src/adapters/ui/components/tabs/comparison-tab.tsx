"use client"

import { useState } from "react"
import { Flag, HandPlatter as HandPointer } from "lucide-react"
import { ComparisonChart } from "@/adapters/ui/components/charts/comparison-chart"
import { ComparisonTable } from "@/adapters/ui/components/tables/comparison-table"
import type { Route } from "@/core/domain/entities/route"

const TARGET_INTENSITY = 89.3368

interface ComparisonTabProps {
  routes: Route[]
}

export function ComparisonTab({ routes }: ComparisonTabProps) {
  const [comparisonRouteId, setComparisonRouteId] = useState("R002")

  const baseline = routes.find((r) => r.isBaseline) || routes[0]
  const comparison = routes.find((r) => r.routeId === comparisonRouteId) || routes[1]

  return (
    <div className="space-y-6">
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

      <ComparisonTable baseline={baseline} comparison={comparison} targetIntensity={TARGET_INTENSITY} />

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
          routes={routes}
          baselineId={baseline.routeId}
          targetIntensity={TARGET_INTENSITY}
          onBarClick={setComparisonRouteId}
        />
      </div>
    </div>
  )
}
