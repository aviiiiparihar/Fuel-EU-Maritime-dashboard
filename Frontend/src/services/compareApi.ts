import { api } from './api';
import type { RouteComparison } from '../types/compare';

export async function fetchRouteComparisons(): Promise<RouteComparison[]> {
  const response = await api.get<RouteComparison[]>('/routes/comparison');
  return response.data;
}

