"use client"

import type { Route } from "@/core/domain/entities/route"

interface ComparisonTableProps {
  baseline: Route
  comparison: Route
  targetIntensity: number
}

export function ComparisonTable({ baseline, comparison, targetIntensity }: ComparisonTableProps) {
  const percentFmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const pct = (comparison.ghgIntensity / baseline.ghgIntensity - 1) * 100
  const compliant = comparison.ghgIntensity < targetIntensity

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-700">
            <th className="text-left px-4 py-3 font-semibold">Metric</th>
            <th className="text-left px-4 py-3 font-semibold">Baseline Route</th>
            <th className="text-left px-4 py-3 font-semibold">Comparison Route</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr className="bg-white">
            <td className="px-4 py-3 font-semibold text-gray-800">Route ID</td>
            <td className="px-4 py-3 bg-blue-50 text-blue-900 border-x border-blue-100 font-medium">
              {baseline.routeId}
            </td>
            <td className="px-4 py-3 bg-amber-50 text-amber-900 border-x border-amber-100 font-medium">
              {comparison.routeId}
            </td>
          </tr>
          <tr className="bg-gray-50/60">
            <td className="px-4 py-3 font-semibold text-gray-800">Vessel Type</td>
            <td className="px-4 py-3 bg-blue-50 border-x border-blue-100">{baseline.vesselType}</td>
            <td className="px-4 py-3 bg-amber-50 border-x border-amber-100">{comparison.vesselType}</td>
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-3 font-semibold text-gray-800">Fuel Type</td>
            <td className="px-4 py-3 bg-blue-50 border-x border-blue-100">{baseline.fuelType}</td>
            <td className="px-4 py-3 bg-amber-50 border-x border-amber-100">{comparison.fuelType}</td>
          </tr>
          <tr className="bg-gray-50/60">
            <td className="px-4 py-3 font-semibold text-gray-800">Year</td>
            <td className="px-4 py-3 bg-blue-50 border-x border-blue-100">{baseline.year}</td>
            <td className="px-4 py-3 bg-amber-50 border-x border-amber-100">{comparison.year}</td>
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-3 font-semibold text-gray-800">GHG Intensity (gCO₂e/MJ)</td>
            <td className="px-4 py-3 bg-blue-50 border-x border-blue-100">{baseline.ghgIntensity.toFixed(1)}</td>
            <td className="px-4 py-3 bg-amber-50 border-x border-amber-100">{comparison.ghgIntensity.toFixed(1)}</td>
          </tr>
          <tr className="bg-gray-50/60">
            <td className="px-4 py-3 font-semibold text-gray-800">% Difference</td>
            <td className="px-4 py-3 bg-blue-50 border-x border-blue-100 text-gray-800">—</td>
            <td
              className={`px-4 py-3 bg-amber-50 border-x border-amber-100 ${pct < 0 ? "text-green-700" : "text-red-700"}`}
            >
              {pct > 0 ? "+" : ""}
              {percentFmt.format(pct)}%
            </td>
          </tr>
          <tr className="bg-white">
            <td className="px-4 py-3 font-semibold text-gray-800">Compliance Status</td>
            <td className="px-4 py-3 bg-blue-50 border-x border-blue-100">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${baseline.ghgIntensity < targetIntensity ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {baseline.ghgIntensity < targetIntensity ? "✅ Compliant" : "❌ Not compliant"}
              </span>
            </td>
            <td className="px-4 py-3 bg-amber-50 border-x border-amber-100">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${compliant ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {compliant ? "✅ Compliant" : "❌ Not compliant"}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
