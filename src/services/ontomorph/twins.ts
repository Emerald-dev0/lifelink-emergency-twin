import { ontomorphClient } from './client';
import type { OntomorphTwin } from '@/types/ontomorph';

export async function createDigitalTwin(userId: string, name: string): Promise<OntomorphTwin> {
  return ontomorphClient.post<OntomorphTwin>('/twins', {
    external_id: userId,
    name,
    metadata: { source: 'lifelink', type: 'emergency_health' },
  });
}

export async function getDigitalTwin(twinId: string): Promise<OntomorphTwin> {
  return ontomorphClient.get<OntomorphTwin>(`/twins/${twinId}`);
}

export async function updateDigitalTwin(
  twinId: string,
  data: Record<string, unknown>
): Promise<OntomorphTwin> {
  return ontomorphClient.put<OntomorphTwin>(`/twins/${twinId}`, data);
}

export async function deleteDigitalTwin(twinId: string): Promise<void> {
  await ontomorphClient.delete(`/twins/${twinId}`);
}
