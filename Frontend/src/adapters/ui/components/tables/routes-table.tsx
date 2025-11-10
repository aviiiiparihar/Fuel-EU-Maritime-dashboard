"use client"

import type { Route } from "@/core/domain/entities/route"

interface RoutesTableProps {
  routes: Route[]
  onSetBaseline: (routeId: string) => void
}

export function RoutesTable({ routes, onSetBaseline }: RoutesTableProps) {
  const fmt = new Intl.NumberFormat("en-US")

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-gray-700">
              <th className="text-left font-semibold px-4 py-3">Route ID</th>
              <th className="text-left font-semibold px-4 py-3">Vessel Type</th>
              <th className="text-left font-semibold px-4 py-3">Fuel Type</th>
              <th className="text-left font-semibold px-4 py-3">Year</th>
              <th className="text-left font-semibold px-4 py-3">GHG Intensity (gCO₂e/MJ)</th>
              <th className="text-left font-semibold px-4 py-3">Fuel Consumption (t)</th>
              <th className="text-left font-semibold px-4 py-3">Distance (km)</th>
              <th className="text-left font-semibold px-4 py-3">Total Emissions (t)</th>
              <th className="text-left font-semibold px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {routes.map((route) => (
              <tr
                key={route.routeId}
                className={`hover:bg-gray-50 ${route.isBaseline ? "bg-green-50 border-l-4 border-green-500" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{route.routeId}</td>
                <td className="px-4 py-3">{route.vesselType}</td>
                <td className="px-4 py-3">{route.fuelType}</td>
                <td className="px-4 py-3">{route.year}</td>
                <td className="px-4 py-3">{route.ghgIntensity.toFixed(1)}</td>
                <td className="px-4 py-3">{fmt.format(route.fuelConsumption)}</td>
                <td className="px-4 py-3">{fmt.format(route.distance)}</td>
                <td className="px-4 py-3">{fmt.format(route.totalEmissions)}</td>
                <td className="px-4 py-3">
                  {route.isBaseline ? (
                    <button className="px-3 py-1.5 rounded-md bg-green-600 text-white text-xs cursor-default flex items-center gap-1.5">
                      <span>✓</span> Baseline
                    </button>
                  ) : (
                    <button
                      onClick={() => onSetBaseline(route.routeId)}
                      className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 outline outline-1 outline-transparent focus:outline-blue-300"
                    >
                      Set Baseline
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden divide-y divide-gray-200">
        {routes.map((route) => (
          <div
            key={route.routeId}
            className={`p-4 ${route.isBaseline ? "bg-green-50 border-l-4 border-green-500" : "bg-white"}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-base font-medium text-gray-900">{route.routeId}</div>
                <div className="text-xs text-gray-600">
                  {route.vesselType} • {route.fuelType} • {route.year}
                </div>
              </div>
              {route.isBaseline ? (
                <button className="px-2.5 py-1 rounded-md bg-green-600 text-white text-xs cursor-default flex items-center gap-1.5">
                  <span>✓</span> Baseline
                </button>
              ) : (
                <button
                  onClick={() => onSetBaseline(route.routeId)}
                  className="px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs hover:bg-blue-700 outline outline-1 outline-transparent focus:outline-blue-300"
                >
                  Set Baseline
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">GHG Intensity</div>
              <div className="text-gray-900 font-medium">{route.ghgIntensity.toFixed(1)} gCO₂e/MJ</div>
              <div className="text-gray-500">Fuel (t)</div>
              <div className="text-gray-900">{fmt.format(route.fuelConsumption)}</div>
              <div className="text-gray-500">Distance (km)</div>
              <div className="text-gray-900">{fmt.format(route.distance)}</div>
              <div className="text-gray-500">Emissions (t)</div>
              <div className="text-gray-900">{fmt.format(route.totalEmissions)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
