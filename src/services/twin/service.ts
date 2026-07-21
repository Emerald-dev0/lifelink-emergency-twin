import { createDigitalTwin, getDigitalTwin, updateDigitalTwin } from '@/services/ontomorph/twins';
import { emitEvent, listEvents } from '@/services/ontomorph/events';
import { setFlag, getFlags } from '@/services/ontomorph/flags';
import type { TwinConnectionStatus } from '@/types';
import type { OntomorphTwin } from '@/types/ontomorph';
import { User } from '@/models';

export interface TwinServiceResponse {
  success: boolean;
  twin?: OntomorphTwin;
  error?: string;
}

export async function connectPatientTwin(userId: string, name: string): Promise<TwinServiceResponse> {
  try {
    const twin = await createDigitalTwin(userId, name);

    await User.findByIdAndUpdate(userId, {
      twinId: twin.id,
      twinStatus: 'connected',
    });

    await emitEvent(twin.id, 'twin_connected', {
      userId,
      timestamp: new Date().toISOString(),
    });

    await setFlag(twin.id, 'emergency_identity_active', true);

    return { success: true, twin };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to connect twin';
    return { success: false, error: message };
  }
}

export async function getTwinStatus(twinId: string): Promise<TwinServiceResponse> {
  try {
    const twin = await getDigitalTwin(twinId);
    return { success: true, twin };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get twin status';
    return { success: false, error: message };
  }
}

export async function syncTwinData(twinId: string, data: Record<string, unknown>): Promise<TwinServiceResponse> {
  try {
    const twin = await updateDigitalTwin(twinId, data);

    await emitEvent(twinId, 'twin_sync', {
      ...data,
      timestamp: new Date().toISOString(),
    });

    return { success: true, twin };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync twin data';
    return { success: false, error: message };
  }
}

export async function getTwinEvents(twinId: string, limit: number = 50) {
  try {
    const events = await listEvents(twinId, limit);
    return { success: true, events };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get twin events';
    return { success: false, error: message };
  }
}

export async function getTwinFlags(twinId: string) {
  try {
    const flags = await getFlags(twinId);
    return { success: true, flags };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get twin flags';
    return { success: false, error: message };
  }
}
