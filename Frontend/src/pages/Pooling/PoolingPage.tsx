import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createPool } from '../../services/poolApi';
import type { CreatePoolResponse } from '../../types/pooling';

const YEARS = [2024, 2025] as const;

export function PoolingPage() {
  const [year, setYear] = useState<(typeof YEARS)[number]>(2024);

  const [shipIdDraft, setShipIdDraft] = useState('');
  const [shipIds, setShipIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const [result, setResult] = useState<CreatePoolResponse | null>(null);

  const selectedShipIds = useMemo(
    () => shipIds.filter((id) => selected[id]),
    [shipIds, selected],
  );

  const mutation = useMutation({
    mutationFn: () => createPool({ year, shipIds: selectedShipIds }),
    onSuccess: (data) => {
      setResult(data);
    },
  });

  const sumCbAfter = useMemo(() => {
    if (!result) return 0;
    return result.members.reduce((sum, m) => sum + m.cb_after, 0);
  }, [result]);

  const poolCompliant = result ? sumCbAfter >= 0 : null;

  const canSubmit = selectedShipIds.length >= 2 && !mutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Pooling</h1>
        <p className="mt-1 text-sm text-slate-600">
          Select at least 2 ships to create a compliance pool.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col text-xs font-medium text-slate-700">
            <span>Year</span>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value) as (typeof YEARS)[number])}
              className="mt-1 w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-xs font-medium text-slate-700">
            <span>Add Ship ID</span>
            <div className="mt-1 flex gap-2">
              <input
                value={shipIdDraft}
                onChange={(e) => setShipIdDraft(e.target.value)}
                placeholder="e.g. SHIP-001"
                className="w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = shipIdDraft.trim();
                  if (!trimmed) return;
                  if (shipIds.includes(trimmed)) {
                    setShipIdDraft('');
                    return;
                  }
                  setShipIds((prev) => [...prev, trimmed]);
                  setSelected((prev) => ({ ...prev, [trimmed]: true }));
                  setShipIdDraft('');
                }}
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                Add
              </button>
            </div>
          </label>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => mutation.mutate()}
            className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {mutation.isPending ? 'Creating…' : 'Create Pool'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ship IDs (multi-select)
            </div>
            <div className="mt-2 max-h-56 overflow-auto">
              {shipIds.length === 0 ? (
                <div className="text-sm text-slate-500">Add ship IDs to select them.</div>
              ) : (
                <ul className="space-y-2">
                  {shipIds.map((id) => (
                    <li key={id} className="flex items-center justify-between gap-3">
                      <label className="flex items-center gap-2 text-sm text-slate-800">
                        <input
                          type="checkbox"
                          checked={Boolean(selected[id])}
                          onChange={(e) =>
                            setSelected((prev) => ({ ...prev, [id]: e.target.checked }))
                          }
                        />
                        <span className="font-medium">{id}</span>
                      </label>
                      <button
                        type="button"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                        onClick={() => {
                          setShipIds((prev) => prev.filter((x) => x !== id));
                          setSelected((prev) => {
                            const next = { ...prev };
                            delete next[id];
                            return next;
                          });
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Selected: {selectedShipIds.length} (need at least 2)
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Pool Summary
            </div>
            <div className="mt-2">
              {poolCompliant === null ? (
                <div className="text-sm text-slate-500">Create a pool to see results.</div>
              ) : poolCompliant ? (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  Pool Compliant
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
                  Invalid Pool
                </span>
              )}

              {result && (
                <div className="mt-2 text-sm text-slate-700">
                  Sum(cbAfter): <span className="font-semibold">{formatNumber(sumCbAfter)}</span>
                </div>
              )}
            </div>

            {mutation.error && (
              <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {extractAxiosErrorMessage(mutation.error)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <Th>Ship ID</Th>
              <Th>CB Before</Th>
              <Th>CB After</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!result && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                  No pool created yet.
                </td>
              </tr>
            )}
            {result &&
              result.members.map((m) => (
                <tr key={m.shipId}>
                  <Td className="font-medium text-slate-900">{m.shipId}</Td>
                  <Td>{formatNumber(m.cb_before)}</Td>
                  <Td>{formatNumber(m.cb_after)}</Td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function extractAxiosErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ error?: string }>;
  const msg = e?.response?.data?.error;
  if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  if (err instanceof Error) return err.message;
  return 'Request failed';
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

