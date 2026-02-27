import { api } from './api';
import type { Route } from '../types/routes';

export async function fetchRoutes(): Promise<Route[]> {
  const response = await api.get<Route[]>('/routes');
  return response.data;
}

export async function setBaselineRoute(routeId: string): Promise<void> {
  await api.post(`/routes/${encodeURIComponent(routeId)}/baseline`);
}

