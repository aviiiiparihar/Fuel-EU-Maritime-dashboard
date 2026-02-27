import { BankEntry } from '../../domain/models';
import { BankRepositoryPort, ComplianceRepositoryPort } from '../../ports/repositories';
import { BankSurplusUseCase } from '../bank-surplus.usecase';

export interface BankSurplusForShipInput {
  shipId: string;
  year: number;
}

export class BankSurplusForShipUseCase {
  constructor(
    private readonly complianceRepo: ComplianceRepositoryPort,
    private readonly bankRepo: BankRepositoryPort,
  ) {}

  async execute(input: BankSurplusForShipInput): Promise<BankEntry> {
    const balance = await this.complianceRepo.findByShipAndYear(input.shipId, input.year);
    if (!balance) {
      throw new Error('Compliance balance not found. Compute CB first.');
    }

    const bankSurplus = new BankSurplusUseCase();
    const entry = bankSurplus.execute({ balance });

    await this.bankRepo.save(entry);
    return entry;
  }
}

