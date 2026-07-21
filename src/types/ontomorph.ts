export interface OntomorphTwin {
  id: string;
  external_id?: string;
  name: string;
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export interface OntomorphGrant {
  id: string;
  twin_id: string;
  grantee_id: string;
  permissions: string[];
  status: 'active' | 'expired' | 'revoked';
  expires_at: string;
  created_at: string;
}

export interface OntomorphEvent {
  id: string;
  twin_id: string;
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
}

export interface OntomorphFlag {
  id: string;
  twin_id: string;
  flag_type: string;
  value: boolean;
  metadata?: Record<string, unknown>;
}

export interface HolonKnowledge {
  concept: string;
  description: string;
  category: string;
  properties: Record<string, unknown>;
  relationships: Array<{ target: string; type: string }>;
}
