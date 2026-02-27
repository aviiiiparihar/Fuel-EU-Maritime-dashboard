import { RouteRepositoryPort } from '../../ports/repositories';

export interface SetBaselineRouteInput {
  routeId: string;
}

export class SetBaselineRouteUseCase {
  constructor(private readonly routeRepo: RouteRepositoryPort) {}

  async execute(input: SetBaselineRouteInput): Promise<void> {
    await this.routeRepo.setBaseline(input.routeId);
  }
}

