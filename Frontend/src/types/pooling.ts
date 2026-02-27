export interface CreatePoolRequest {
  year: number;
  shipIds: string[];
}

export interface PoolMemberResult {
  shipId: string;
  cb_before: number;
  cb_after: number;
}

export interface CreatePoolResponse {
  year: number;
  members: PoolMemberResult[];
}

