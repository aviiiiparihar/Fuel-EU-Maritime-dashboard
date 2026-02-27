import { ComplianceBalance, Route } from '../domain/models';
import { calculateRouteComplianceBalance } from '../domain/compliance.service';

export interface ComputeComplianceBalanceInput {
  shipId: string;
  route: Route;
}

export class ComputeComplianceBalanceUseCase {
  execute(input: ComputeComplianceBalanceInput): ComplianceBalance {
    const { shipId, route } = input;
    const cbValue = calculateRouteComplianceBalance(route);

    return {
      shipId,
      year: route.year,
      cbValue,
    };
  }
}

