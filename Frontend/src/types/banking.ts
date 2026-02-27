export interface ComplianceSnapshot {
  shipId: string;
  year: number;
  cbValue: number;
}

export interface BankRecord {
  shipId: string;
  year: number;
  amount: number;
}

export interface BankSurplusRequest {
  shipId: string;
  year: number;
}

export interface ApplyBankedRequest {
  shipId: string;
  year: number;
  amount: number;
}

