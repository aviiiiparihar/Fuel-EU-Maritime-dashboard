import { api } from './api';
import type { CreatePoolRequest, CreatePoolResponse } from '../types/pooling';

export async function createPool(request: CreatePoolRequest): Promise<CreatePoolResponse> {
  const response = await api.post<CreatePoolResponse>('/pools', request);
  return response.data;
}

