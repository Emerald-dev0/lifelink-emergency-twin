import type { OntomorphTwin, OntomorphEvent, OntomorphGrant } from '@/types/ontomorph';

const mockTwins = new Map<string, OntomorphTwin>();
const mockEvents = new Map<string, OntomorphEvent[]>();
const mockGrants = new Map<string, OntomorphGrant[]>();

export async function mockCreateTwin(userId: string, name: string): Promise<OntomorphTwin> {
  const twin: OntomorphTwin = {
    id: `twin_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    external_id: userId,
    name,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    metadata: { source: 'lifelink', type: 'emergency_health', emergency_identity: true },
  };

  mockTwins.set(twin.id, twin);
  mockEvents.set(twin.id, [
    {
      id: `evt_${Date.now()}_1`,
      twin_id: twin.id,
      type: 'twin_created',
      data: { message: 'Digital Twin initialized for emergency health identity' },
      timestamp: new Date().toISOString(),
    },
  ]);

  return twin;
}

export async function mockGetTwin(twinId: string): Promise<OntomorphTwin | null> {
  return mockTwins.get(twinId) || null;
}

export async function mockUpdateTwin(twinId: string, data: Record<string, unknown>): Promise<OntomorphTwin | null> {
  const twin = mockTwins.get(twinId);
  if (!twin) return null;

  const updated = { ...twin, ...data, updated_at: new Date().toISOString() };
  mockTwins.set(twinId, updated);

  const events = mockEvents.get(twinId) || [];
  events.push({
    id: `evt_${Date.now()}`,
    twin_id: twinId,
    type: 'twin_updated',
    data: { ...data, timestamp: new Date().toISOString() },
    timestamp: new Date().toISOString(),
  });
  mockEvents.set(twinId, events);

  return updated;
}

export async function mockCreateGrant(
  twinId: string,
  permissions: string[],
  expiresInHours: number = 1
): Promise<OntomorphGrant> {
  const grant: OntomorphGrant = {
    id: `grant_${Date.now()}`,
    twin_id: twinId,
    grantee_id: 'responder_emergency',
    permissions,
    status: 'active',
    expires_at: new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  };

  const grants = mockGrants.get(twinId) || [];
  grants.push(grant);
  mockGrants.set(twinId, grants);

  return grant;
}

export async function mockGetGrants(twinId: string): Promise<OntomorphGrant[]> {
  return mockGrants.get(twinId) || [];
}

export async function mockRevokeGrant(grantId: string): Promise<OntomorphGrant | null> {
  for (const [, grants] of mockGrants) {
    const idx = grants.findIndex((g) => g.id === grantId);
    if (idx !== -1) {
      grants[idx].status = 'revoked';
      return grants[idx];
    }
  }
  return null;
}
