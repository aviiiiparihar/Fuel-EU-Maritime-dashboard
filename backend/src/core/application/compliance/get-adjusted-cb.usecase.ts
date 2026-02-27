import { BankRepositoryPort, ComplianceRepositoryPort } from '../../ports/repositories';

export interface GetAdjustedCbInput {
  shipId: string;
  year: number;
}

export interface GetAdjustedCbResult {
  shipId: string;
  year: number;
  cbValue: number;
  bankedRemaining: number;
}

export class GetAdjustedCbUseCase {
  constructor(
    private readonly complianceRepo: ComplianceRepositoryPort,
    private readonly bankRepo: BankRepositoryPort,
  ) {}

  async execute(input: GetAdjustedCbInput): Promise<GetAdjustedCbResult> {
    const balance = await this.complianceRepo.findByShipAndYear(input.shipId, input.year);
    if (!balance) {
      throw new Error('Compliance balance not found. Compute CB first.');
    }

    const bank = await this.bankRepo.findByShipAndYear(input.shipId, input.year);
    return {
      shipId: balance.shipId,
      year: balance.year,
      cbValue: balance.cbValue,
      bankedRemaining: bank?.amount ?? 0,
    };
  }
}

