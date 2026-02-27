import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { fetchRouteComparisons } from '../../services/compareApi';
import { fetchRoutes } from '../../services/routesApi';
import type { RouteComparison } from '../../types/compare';

const TARGET_INTENSITY = 89.3368;

export function ComparePage() {
  const {
    data: comparisons = [],
    isLoading: isLoadingComparison,
    isError: isErrorComparison,
  } = useQuery<RouteComparison[]>({
    queryKey: ['routes', 'comparison'],
    queryFn: fetchRouteComparisons,
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
  });

  const baselineRouteId = useMemo(() => {
    const baseline = routes.find((r) => r.isBaseline)?.routeId;
    if (baseline) return baseline;
    return comparisons.find((c) => c.percentDiff === 0)?.routeId;
  }, [routes, comparisons]);

  const chartData = useMemo(
    () =>
      [...comparisons].sort((a, b) => a.routeId.localeCompare(b.routeId)).map((c) => ({
        ...c,
        isBaseline: c.routeId === baselineRouteId,
      })),
    [comparisons, baselineRouteId],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Compare</h1>
        <p className="mt-1 text-sm text-slate-600">
          Compare baseline vs all routes. Target Intensity: {TARGET_INTENSITY} gCO2e/MJ.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-800">GHG Intensity by Route</div>
          {baselineRouteId ? (
            <div className="text-xs text-slate-600">
              Baseline: <span className="font-semibold text-slate-900">{baselineRouteId}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">Baseline: not set</div>
          )}
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="routeId" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'ghgIntensity' && typeof value === 'number') {
                    return [`${value.toFixed(2)}`, 'GHG Intensity'];
                  }
                  return [String(value), String(name)];
                }}
              />
              <ReferenceLine
                y={TARGET_INTENSITY}
                stroke="#0f172a"
                strokeDasharray="6 6"
                label={{
                  value: `Target ${TARGET_INTENSITY}`,
                  position: 'insideTopRight',
                  fill: '#0f172a',
                  fontSize: 12,
                }}
              />
              <Bar dataKey="ghgIntensity" radius={[4, 4, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.routeId}
                    fill={
                      entry.isBaseline
                        ? '#0f172a'
                        : entry.compliant
                          ? '#16a34a'
                          : '#dc2626'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 text-xs text-slate-500">
          Colors: baseline (dark), compliant (green), non-compliant (red).
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <Th>Route ID</Th>
              <Th>GHG Intensity</Th>
              <Th>% Difference</Th>
              <Th>Compliance Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoadingComparison && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  Loading comparison...
                </td>
              </tr>
            )}
            {isErrorComparison && !isLoadingComparison && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-red-500">
                  Failed to load comparison data.
                </td>
              </tr>
            )}
            {!isLoadingComparison && !isErrorComparison && comparisons.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  No comparison data. Set a baseline route first.
                </td>
              </tr>
            )}
            {!isLoadingComparison &&
              !isErrorComparison &&
              chartData.map((row) => {
                const isBaseline = row.routeId === baselineRouteId;
                const statusBg = row.compliant ? 'bg-emerald-50/70' : 'bg-rose-50/70';
                return (
                  <tr key={row.routeId} className={statusBg}>
                    <Td>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{row.routeId}</span>
                        {isBaseline && (
                          <span className="inline-flex items-center rounded-full bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                            Baseline
                          </span>
                        )}
                      </div>
                    </Td>
                    <Td>{row.ghgIntensity.toFixed(2)}</Td>
                    <Td>{formatPercent(row.percentDiff)}</Td>
                    <Td>
                      <span
                        className={[
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                          row.compliant ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
                        ].join(' ')}
                        title={row.compliant ? 'Compliant' : 'Non-compliant'}
                      >
                        {row.compliant ? '✔ Compliant' : '❌ Non-compliant'}
                      </span>
                    </Td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatPercent(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
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

