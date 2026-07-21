import { ontomorphClient } from './client';
import type { OntomorphFlag } from '@/types/ontomorph';

export async function setFlag(
  twinId: string,
  flagType: string,
  value: boolean
): Promise<OntomorphFlag> {
  return ontomorphClient.post<OntomorphFlag>(`/twins/${twinId}/flags`, {
    flag_type: flagType,
    value,
  });
}

export async function getFlags(twinId: string): Promise<OntomorphFlag[]> {
  return ontomorphClient.get<OntomorphFlag[]>(`/twins/${twinId}/flags`);
}
