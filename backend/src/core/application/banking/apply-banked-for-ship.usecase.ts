import { ApplyBankedUseCase } from '../apply-banked.usecase';
import { BankEntry, ComplianceBalance } from '../../domain/models';
import { BankRepositoryPort, ComplianceRepositoryPort } from '../../ports/repositories';

export interface ApplyBankedForShipInput {
  shipId: string;
  year: number;
  amount: number;
}

export interface ApplyBankedForShipResult {
  updatedBalance: ComplianceBalance;
  remainingBankEntry: BankEntry;
}

export class ApplyBankedForShipUseCase {
  constructor(
    private readonly complianceRepo: ComplianceRepositoryPort,
    private readonly bankRepo: BankRepositoryPort,
  ) {}

  async execute(input: ApplyBankedForShipInput): Promise<ApplyBankedForShipResult> {
    const balance = await this.complianceRepo.findByShipAndYear(input.shipId, input.year);
    if (!balance) {
      throw new Error('Compliance balance not found. Compute CB first.');
    }

    const bankEntry = await this.bankRepo.findByShipAndYear(input.shipId, input.year);
    if (!bankEntry) {
      throw new Error('No bank record found for ship/year.');
    }

    const apply = new ApplyBankedUseCase();
    const result = apply.execute({ balance, bankEntry, amountToApply: input.amount });

    await this.complianceRepo.save(result.updatedBalance);
    await this.bankRepo.save(result.remainingBankEntry);

    return result;
  }
}

