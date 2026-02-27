import { BankEntry, ComplianceBalance } from '../domain/models';

export interface ApplyBankedInput {
  balance: ComplianceBalance;
  bankEntry: BankEntry;
  amountToApply: number;
}

export interface ApplyBankedResult {
  updatedBalance: ComplianceBalance;
  remainingBankEntry: BankEntry;
}

export class ApplyBankedUseCase {
  execute(input: ApplyBankedInput): ApplyBankedResult {
    const { balance, bankEntry, amountToApply } = input;

    if (amountToApply <= 0) {
      throw new Error('Amount to apply must be positive.');
    }

    if (amountToApply > bankEntry.amount) {
      throw new Error('Cannot apply more than banked amount.');
    }

    const updatedBalance: ComplianceBalance = {
      ...balance,
      cbValue: balance.cbValue + amountToApply,
    };

    const remainingBankEntry: BankEntry = {
      ...bankEntry,
      amount: bankEntry.amount - amountToApply,
    };

    return {
      updatedBalance,
      remainingBankEntry,
    };
  }
}

