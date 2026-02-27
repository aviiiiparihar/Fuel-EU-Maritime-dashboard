import { PoolMember } from '../domain/models';

export interface CreatePoolMemberInput {
  shipId: string;
  cbBefore: number;
}

export class CreatePoolUseCase {
  private static readonly EPSILON = 1e-9;

  execute(membersInput: CreatePoolMemberInput[]): PoolMember[] {
    if (membersInput.length === 0) {
      return [];
    }

    const members: PoolMember[] = membersInput.map((member) => ({
      shipId: member.shipId,
      cbBefore: member.cbBefore,
      cbAfter: member.cbBefore,
    }));

    const totalBefore = members.reduce((sum, m) => sum + m.cbBefore, 0);

    if (totalBefore < -CreatePoolUseCase.EPSILON) {
      throw new Error('Total compliance balance for pool must be non-negative.');
    }

    const surplusMembers = members
      .filter((m) => m.cbBefore > 0)
      .sort((a, b) => b.cbBefore - a.cbBefore);

    const deficitMembers = members
      .filter((m) => m.cbBefore < 0)
      .sort((a, b) => a.cbBefore - b.cbBefore);

    for (const deficit of deficitMembers) {
      let needed = -deficit.cbAfter;

      if (needed <= CreatePoolUseCase.EPSILON) {
        continue;
      }

      for (const surplus of surplusMembers) {
        if (needed <= CreatePoolUseCase.EPSILON) {
          break;
        }

        const available = surplus.cbAfter;

        if (available <= CreatePoolUseCase.EPSILON) {
          continue;
        }

        const transfer = Math.min(available, needed);

        surplus.cbAfter -= transfer;
        deficit.cbAfter += transfer;
        needed -= transfer;
      }
    }

    const totalAfter = members.reduce((sum, m) => sum + m.cbAfter, 0);

    if (totalAfter < -CreatePoolUseCase.EPSILON) {
      throw new Error('Adjusted pool compliance balance must be non-negative.');
    }

    for (const member of members) {
      if (member.cbBefore < 0 && member.cbAfter < member.cbBefore - CreatePoolUseCase.EPSILON) {
        throw new Error('Deficit ship cannot have worse compliance after pooling.');
      }

      if (member.cbBefore > 0 && member.cbAfter < -CreatePoolUseCase.EPSILON) {
        throw new Error('Surplus ship cannot become negative after pooling.');
      }
    }

    return members;
  }
}

