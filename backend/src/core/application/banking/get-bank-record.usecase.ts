import { BankEntry } from '../../domain/models';
import { BankRepositoryPort } from '../../ports/repositories';

export interface GetBankRecordInput {
  shipId: string;
  year: number;
}

export class GetBankRecordUseCase {
  constructor(private readonly bankRepo: BankRepositoryPort) {}

  async execute(input: GetBankRecordInput): Promise<BankEntry | null> {
    return this.bankRepo.findByShipAndYear(input.shipId, input.year);
  }
}

