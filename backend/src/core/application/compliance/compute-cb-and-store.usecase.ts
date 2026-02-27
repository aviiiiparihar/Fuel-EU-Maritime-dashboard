import { ComplianceBalance, Route } from '../../domain/models';
import { ComplianceRepositoryPort, RouteRepositoryPort } from '../../ports/repositories';
import { ComputeComplianceBalanceUseCase } from '../compute-compliance-balance.usecase';

export interface ComputeCbAndStoreInput {
  shipId: string;
  year: number;
}

export class ComputeCbAndStoreUseCase {
  constructor(
    private readonly routeRepo: RouteRepositoryPort,
    private readonly complianceRepo: ComplianceRepositoryPort,
  ) {}

  async execute(input: ComputeCbAndStoreInput): Promise<ComplianceBalance> {
    const baseline = await this.routeRepo.findBaseline();
    if (!baseline) {
      throw new Error('No baseline route is set.');
    }

    if (baseline.year !== input.year) {
      throw new Error(`Baseline route is for year ${baseline.year}. Set a baseline for year ${input.year}.`);
    }

    const route: Route = baseline;
    const compute = new ComputeComplianceBalanceUseCase();
    const balance = compute.execute({ shipId: input.shipId, route });

    await this.complianceRepo.save(balance);
    return balance;
  }
}

