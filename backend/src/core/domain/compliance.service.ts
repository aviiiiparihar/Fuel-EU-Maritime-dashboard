import { ComplianceBalance, Route } from './models';
import { ENERGY_PER_UNIT_FUEL, TARGET_INTENSITY } from './constants';

export function calculateEnergyInScope(fuelConsumption: number): number {
  return fuelConsumption * ENERGY_PER_UNIT_FUEL;
}

export function calculateComplianceBalanceValue(
  actualGhgIntensity: number,
  fuelConsumption: number,
): number {
  const energyInScope = calculateEnergyInScope(fuelConsumption);
  return (TARGET_INTENSITY - actualGhgIntensity) * energyInScope;
}

export function calculateRouteComplianceBalance(route: Route): number {
  return calculateComplianceBalanceValue(route.ghgIntensity, route.fuelConsumption);
}

export function createComplianceBalance(
  shipId: string,
  year: number,
  actualGhgIntensity: number,
  fuelConsumption: number,
): ComplianceBalance {
  const cbValue = calculateComplianceBalanceValue(actualGhgIntensity, fuelConsumption);
  return { shipId, year, cbValue };
}

export function createComplianceBalanceFromRoute(
  shipId: string,
  route: Route,
): ComplianceBalance {
  return {
    shipId,
    year: route.year,
    cbValue: calculateRouteComplianceBalance(route),
  };
}

export function isCompliantIntensity(actualGhgIntensity: number): boolean {
  return actualGhgIntensity <= TARGET_INTENSITY;
}

