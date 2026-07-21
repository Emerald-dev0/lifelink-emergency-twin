import { ontomorphClient } from './client';
import type { OntomorphEvent } from '@/types/ontomorph';

export async function emitEvent(
  twinId: string,
  type: string,
  data: Record<string, unknown>
): Promise<OntomorphEvent> {
  return ontomorphClient.post<OntomorphEvent>(`/twins/${twinId}/events`, {
    type,
    data,
  });
}

export async function listEvents(
  twinId: string,
  limit: number = 50
): Promise<OntomorphEvent[]> {
  return ontomorphClient.get<OntomorphEvent[]>(
    `/twins/${twinId}/events?limit=${limit}`
  );
}
