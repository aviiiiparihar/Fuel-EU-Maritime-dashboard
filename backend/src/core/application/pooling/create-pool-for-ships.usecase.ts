import { PoolMember } from '../../domain/models';
import {
  ComplianceRepositoryPort,
  PoolRepositoryPort,
} from '../../ports/repositories';
import { CreatePoolMemberInput, CreatePoolUseCase } from '../create-pool.usecase';

export interface CreatePoolForShipsInput {
  year: number;
  shipIds: string[];
}

export interface CreatePoolForShipsResult {
  year: number;
  members: PoolMember[];
}

export class CreatePoolForShipsUseCase {
  constructor(
    private readonly complianceRepo: ComplianceRepositoryPort,
    private readonly poolRepo: PoolRepositoryPort,
  ) {}

  async execute(input: CreatePoolForShipsInput): Promise<CreatePoolForShipsResult> {
    const balances = await Promise.all(
      input.shipIds.map(async (shipId) => {
        const balance = await this.complianceRepo.findByShipAndYear(shipId, input.year);
        if (!balance) {
          throw new Error(`Compliance balance not found for shipId=${shipId}.`);
        }
        return balance;
      }),
    );

    const membersInput: CreatePoolMemberInput[] = balances.map((b) => ({
      shipId: b.shipId,
      cbBefore: b.cbValue,
    }));

    const poolUseCase = new CreatePoolUseCase();
    const members = poolUseCase.execute(membersInput);

    await this.poolRepo.savePool(input.year, members);

    return { year: input.year, members };
  }
}

