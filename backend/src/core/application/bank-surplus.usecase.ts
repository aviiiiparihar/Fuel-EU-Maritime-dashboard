import { BankEntry, ComplianceBalance } from '../domain/models';

export interface BankSurplusInput {
  balance: ComplianceBalance;
}

export class BankSurplusUseCase {
  execute(input: BankSurplusInput): BankEntry {
    const { balance } = input;

    if (balance.cbValue <= 0) {
      throw new Error('Only positive compliance balances can be banked.');
    }

    return {
      shipId: balance.shipId,
      year: balance.year,
      amount: balance.cbValue,
    };
  }
}

