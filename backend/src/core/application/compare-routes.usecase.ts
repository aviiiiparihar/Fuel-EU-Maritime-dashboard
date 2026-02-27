import { Route } from '../domain/models';
import { TARGET_INTENSITY } from '../domain/constants';

export interface CompareRoutesResult {
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  isCompliant: boolean;
}

export class CompareRoutesUseCase {
  execute(baseline: Route, comparison: Route): CompareRoutesResult {
    const baselineIntensity = baseline.ghgIntensity;
    const comparisonIntensity = comparison.ghgIntensity;

    if (baselineIntensity === 0) {
      throw new Error('Baseline route GHG intensity must be non-zero.');
    }

    const percentDiff = ((comparisonIntensity / baselineIntensity) - 1) * 100;
    const isCompliant = comparisonIntensity <= TARGET_INTENSITY;

    return {
      baselineIntensity,
      comparisonIntensity,
      percentDiff,
      isCompliant,
    };
  }
}

