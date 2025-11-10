// Application service: Compliance pooling
import type { PoolMember } from "../../domain/entities/pool"

export class PoolingService {
  static calculatePoolAllocation(members: PoolMember[]): PoolMember[] {
    const totalDeficit = members.filter((m) => m.cbBefore < 0).reduce((sum, m) => sum + Math.abs(m.cbBefore), 0)

    const totalSurplus = members.filter((m) => m.cbBefore > 0).reduce((sum, m) => sum + m.cbBefore, 0)

    const redistributionRatio = totalDeficit / totalSurplus

    return members.map((member) => {
      if (member.cbBefore > 0) {
        // Surplus ship contributes
        const contribution = member.cbBefore * redistributionRatio
        return {
          ...member,
          contribution,
          cbAfter: member.cbBefore - contribution,
        }
      } else {
        // Deficit ship receives
        const share = Math.abs(member.cbBefore) / totalDeficit
        const received = totalSurplus * share
        return {
          ...member,
          contribution: -received,
          cbAfter: member.cbBefore + received,
        }
      }
    })
  }

  static calculatePoolBalance(members: PoolMember[]): number {
    return members.reduce((sum, m) => sum + m.cbBefore, 0)
  }

  static isPoolViable(totalBalance: number): boolean {
    return totalBalance >= 0
  }
}
