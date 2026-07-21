import { ontomorphClient } from './client';
import type { OntomorphGrant } from '@/types/ontomorph';

export async function createGrant(
  twinId: string,
  granteeId: string,
  permissions: string[],
  expiresInHours: number = 24
): Promise<OntomorphGrant> {
  return ontomorphClient.post<OntomorphGrant>('/grants', {
    twin_id: twinId,
    grantee_id: granteeId,
    permissions,
    expires_at: new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString(),
  });
}

export async function getGrant(grantId: string): Promise<OntomorphGrant> {
  return ontomorphClient.get<OntomorphGrant>(`/grants/${grantId}`);
}

export async function revokeGrant(grantId: string): Promise<OntomorphGrant> {
  return ontomorphClient.post<OntomorphGrant>(`/grants/${grantId}/revoke`, {});
}

export async function listGrants(twinId: string): Promise<OntomorphGrant[]> {
  return ontomorphClient.get<OntomorphGrant[]>(`/twins/${twinId}/grants`);
}
