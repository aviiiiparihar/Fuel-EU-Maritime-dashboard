// HTTP handler for pool endpoints
import type { PoolService } from "../../../core/application/services/pool-service"

export class PoolHandler {
  constructor(private poolService: PoolService) {}

  async createPool(shipIds: string[], year: number) {
    return this.poolService.createPool(shipIds, year)
  }
}
