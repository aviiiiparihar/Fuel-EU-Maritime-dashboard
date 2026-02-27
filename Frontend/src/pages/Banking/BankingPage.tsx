import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { BankRecord, ComplianceSnapshot } from '../../types/banking';
import { applyBanked, bankSurplus, fetchBankRecord, fetchComplianceCb } from '../../services/bankingApi';

const YEARS = [2024, 2025] as const;

export function BankingPage() {
  const queryClient = useQueryClient();

  const [shipIdInput, setShipIdInput] = useState('');
  const [yearInput, setYearInput] = useState<(typeof YEARS)[number]>(2024);
  const [submitted, setSubmitted] = useState<{ shipId: string; year: number } | null>(null);
  const [applyAmountInput, setApplyAmountInput] = useState('');

  const shipId = submitted?.shipId ?? '';
  const year = submitted?.year ?? 2024;
  const enabled = submitted !== null;

  const cbQuery = useQuery<ComplianceSnapshot>({
    queryKey: ['compliance', 'cb', shipId, year],
    queryFn: () => fetchComplianceCb(shipId, year),
    enabled,
  });

  const bankQuery = useQuery<BankRecord | null>({
    queryKey: ['banking', 'record', shipId, year],
    queryFn: () => fetchBankRecord(shipId, year),
    enabled,
  });

  const currentCb = cbQuery.data?.cbValue ?? 0;
  const bankedAmount = bankQuery.data?.amount ?? 0;
  const adjustedCb = currentCb + bankedAmount;

  const canBankSurplus = enabled && !cbQuery.isFetching && !cbQuery.isError && currentCb > 0;
  const canApplyBanked = enabled && !bankQuery.isFetching && !bankQuery.isError && bankedAmount > 0;

  const applyAmount = useMemo(() => {
    const n = Number(applyAmountInput);
    return Number.isFinite(n) ? n : NaN;
  }, [applyAmountInput]);

  const bankMutation = useMutation({
    mutationFn: () => bankSurplus({ shipId, year }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['compliance', 'cb', shipId, year] }),
        queryClient.invalidateQueries({ queryKey: ['banking', 'record', shipId, year] }),
      ]);
    },
  });

  const applyMutation = useMutation({
    mutationFn: () => applyBanked({ shipId, year, amount: applyAmount }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['compliance', 'cb', shipId, year] }),
        queryClient.invalidateQueries({ queryKey: ['banking', 'record', shipId, year] }),
      ]);
    },
  });

  const errorText =
    extractAxiosErrorMessage(cbQuery.error) ??
    extractAxiosErrorMessage(bankQuery.error) ??
    extractAxiosErrorMessage(bankMutation.error) ??
    extractAxiosErrorMessage(applyMutation.error);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Banking</h1>
        <p className="mt-1 text-sm text-slate-600">
          Compute compliance balance and manage banked surplus.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col text-xs font-medium text-slate-700">
            <span>Ship ID</span>
            <input
              value={shipIdInput}
              onChange={(e) => setShipIdInput(e.target.value)}
              placeholder="e.g. SHIP-001"
              className="mt-1 w-64 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </label>

          <label className="flex flex-col text-xs font-medium text-slate-700">
            <span>Year</span>
            <select
              value={yearInput}
              onChange={(e) => setYearInput(Number(e.target.value) as (typeof YEARS)[number])}
              className="mt-1 w-40 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              const trimmed = shipIdInput.trim();
              if (trimmed.length === 0) return;
              setSubmitted({ shipId: trimmed, year: yearInput });
              setApplyAmountInput('');
            }}
            className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            Search
          </button>
        </div>

        {errorText && (
          <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            {errorText}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard title="Current CB" value={enabled ? formatNumber(currentCb) : '—'} />
        <KpiCard title="Banked Amount" value={enabled ? formatNumber(bankedAmount) : '—'} />
        <KpiCard title="Adjusted CB" value={enabled ? formatNumber(adjustedCb) : '—'} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Bank Surplus</div>
          <p className="mt-1 text-sm text-slate-600">Only allowed when CB is positive.</p>
          <button
            type="button"
            disabled={!canBankSurplus || bankMutation.isPending}
            onClick={() => bankMutation.mutate()}
            className="mt-4 inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {bankMutation.isPending ? 'Banking…' : 'Bank Surplus'}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-slate-900">Apply Banked</div>
          <p className="mt-1 text-sm text-slate-600">Apply banked amount toward CB.</p>

          <label className="mt-3 flex flex-col text-xs font-medium text-slate-700">
            <span>Amount</span>
            <input
              value={applyAmountInput}
              onChange={(e) => setApplyAmountInput(e.target.value)}
              placeholder="e.g. 1000"
              inputMode="decimal"
              className="mt-1 w-56 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            />
          </label>

          <button
            type="button"
            disabled={
              !canApplyBanked ||
              applyMutation.isPending ||
              !Number.isFinite(applyAmount) ||
              applyAmount <= 0
            }
            onClick={() => applyMutation.mutate()}
            className="mt-4 inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {applyMutation.isPending ? 'Applying…' : 'Apply Banked'}
          </button>

          {canApplyBanked && Number.isFinite(applyAmount) && applyAmount > bankedAmount && (
            <div className="mt-2 text-xs text-rose-700">
              Amount cannot exceed banked amount ({formatNumber(bankedAmount)}).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KpiCard(props: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{props.title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{props.value}</div>
    </div>
  );
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function extractAxiosErrorMessage(err: unknown): string | null {
  const e = err as AxiosError<{ error?: string }>;
  const msg = e?.response?.data?.error;
  if (typeof msg === 'string' && msg.trim().length > 0) return msg;
  if (err instanceof Error) return err.message;
  return null;
}

