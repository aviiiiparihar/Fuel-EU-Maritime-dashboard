import { api } from './api';
import type {
  ApplyBankedRequest,
  BankRecord,
  BankSurplusRequest,
  ComplianceSnapshot,
} from '../types/banking';

export async function fetchComplianceCb(shipId: string, year: number): Promise<ComplianceSnapshot> {
  const response = await api.get<ComplianceSnapshot>('/compliance/cb', {
    params: { shipId, year },
  });
  return response.data;
}

export async function fetchBankRecord(shipId: string, year: number): Promise<BankRecord | null> {
  const response = await api.get<BankRecord | null>('/banking/records', {
    params: { shipId, year },
  });
  return response.data;
}

export async function bankSurplus(request: BankSurplusRequest): Promise<BankRecord> {
  const response = await api.post<BankRecord>('/banking/bank', request);
  return response.data;
}

export async function applyBanked(request: ApplyBankedRequest): Promise<unknown> {
  const response = await api.post('/banking/apply', request);
  return response.data;
}

