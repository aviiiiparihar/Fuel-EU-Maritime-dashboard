import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Route } from '../../types/routes';
import { fetchRoutes, setBaselineRoute } from '../../services/routesApi';

type FilterValue = string | 'all';

export function RoutesPage() {
  const queryClient = useQueryClient();

  const { data: routes = [], isLoading, isError } = useQuery<Route[]>({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
  });

  const [vesselFilter, setVesselFilter] = useState<FilterValue>('all');
  const [fuelFilter, setFuelFilter] = useState<FilterValue>('all');
  const [yearFilter, setYearFilter] = useState<FilterValue>('all');

  const setBaselineMutation = useMutation({
    mutationFn: (routeId: string) => setBaselineRoute(routeId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['routes'] });
    },
  });

  const vesselOptions = useMemo(
    () => Array.from(new Set(routes.map((r) => r.vesselType))).sort(),
    [routes],
  );

  const fuelOptions = useMemo(
    () => Array.from(new Set(routes.map((r) => r.fuelType))).sort(),
    [routes],
  );

  const yearOptions = useMemo(
    () =>
      Array.from(new Set(routes.map((r) => r.year)))
        .sort((a, b) => a - b)
        .map((y) => y.toString()),
    [routes],
  );

  const filteredRoutes = routes.filter((route) => {
    if (vesselFilter !== 'all' && route.vesselType !== vesselFilter) return false;
    if (fuelFilter !== 'all' && route.fuelType !== fuelFilter) return false;
    if (yearFilter !== 'all' && route.year.toString() !== yearFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Routes</h1>
        <p className="mt-1 text-sm text-slate-600">
          Browse available routes and select a baseline for comparison.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <FilterSelect
          label="Vessel Type"
          value={vesselFilter}
          onChange={setVesselFilter}
          options={vesselOptions}
        />
        <FilterSelect
          label="Fuel Type"
          value={fuelFilter}
          onChange={setFuelFilter}
          options={fuelOptions}
        />
        <FilterSelect
          label="Year"
          value={yearFilter}
          onChange={setYearFilter}
          options={yearOptions}
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <Th>Route ID</Th>
                <Th>Vessel Type</Th>
                <Th>Fuel Type</Th>
                <Th>Year</Th>
                <Th>GHG Intensity</Th>
                <Th>Fuel Consumption</Th>
                <Th>Distance</Th>
                <Th>Total Emissions</Th>
                <Th className="text-right">Baseline</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                    Loading routes...
                  </td>
                </tr>
              )}
              {isError && !isLoading && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-red-500">
                    Failed to load routes.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filteredRoutes.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-6 text-center text-slate-500">
                    No routes found for the selected filters.
                  </td>
                </tr>
              )}
              {!isLoading &&
                !isError &&
                filteredRoutes.map((route) => {
                  const isBaseline = route.isBaseline;
                  return (
                    <tr
                      key={route.routeId}
                      className={isBaseline ? 'bg-emerald-50/60' : undefined}
                    >
                      <Td>{route.routeId}</Td>
                      <Td>{route.vesselType}</Td>
                      <Td>{route.fuelType}</Td>
                      <Td>{route.year}</Td>
                      <Td>{route.ghgIntensity.toFixed(2)}</Td>
                      <Td>{route.fuelConsumption.toLocaleString()}</Td>
                      <Td>{route.distance.toLocaleString()}</Td>
                      <Td>{route.totalEmissions.toLocaleString()}</Td>
                      <Td className="text-right">
                        {isBaseline ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                            Baseline
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setBaselineMutation.mutate(route.routeId)}
                            disabled={setBaselineMutation.isPending}
                            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            {setBaselineMutation.isPending ? 'Setting...' : 'Set Baseline'}
                          </button>
                        )}
                      </Td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface FilterSelectProps {
  label: string;
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  options: string[];
}

function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label className="flex flex-col text-xs font-medium text-slate-700">
      <span>{label}</span>
      <select
        className="mt-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
        value={value}
        onChange={(e) => onChange(e.target.value === 'all' ? 'all' : e.target.value)}
      >
        <option value="all">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

interface CellProps {
  children: React.ReactNode;
  className?: string;
}

function Th({ children, className }: CellProps) {
  return (
    <th
      scope="col"
      className={`px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 ${className ?? ''}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className }: CellProps) {
  return (
    <td className={`whitespace-nowrap px-4 py-2 text-sm text-slate-800 ${className ?? ''}`}>
      {children}
    </td>
  );
}

