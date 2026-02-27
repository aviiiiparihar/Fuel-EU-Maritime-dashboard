import { BankEntry, ComplianceBalance, PoolMember, Route } from '../domain/models';

export interface RouteRepositoryPort {
  findById(routeId: string): Promise<Route | null>;
  findAll(): Promise<Route[]>;
  findBaseline(): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
  save(route: Route): Promise<void>;
}

export interface ComplianceRepositoryPort {
  findByShipAndYear(shipId: string, year: number): Promise<ComplianceBalance | null>;
  save(balance: ComplianceBalance): Promise<void>;
}

export interface BankRepositoryPort {
  findByShipAndYear(shipId: string, year: number): Promise<BankEntry | null>;
  save(entry: BankEntry): Promise<void>;
}

export interface PoolRepositoryPort {
  savePool(year: number, members: PoolMember[]): Promise<void>;
}

