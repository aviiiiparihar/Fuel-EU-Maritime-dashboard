import { Route } from '../../domain/models';
import { RouteRepositoryPort } from '../../ports/repositories';

export class ListRoutesUseCase {
  constructor(private readonly routeRepo: RouteRepositoryPort) {}

  async execute(): Promise<Route[]> {
    return this.routeRepo.findAll();
  }
}

