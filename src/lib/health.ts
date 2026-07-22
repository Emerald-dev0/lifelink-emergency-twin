import { connectDB } from '@/lib/db';
import { config } from '@/config';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  services: {
    mongodb: { status: 'ok' | 'down'; latencyMs?: number };
    ontomorph: { status: 'ok' | 'down' | 'unconfigured'; latencyMs?: number };
  };
  version: string;
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const start = Date.now();
  const mongodbStatus: HealthStatus['services']['mongodb'] = { status: 'down' };
  const ontomorphStatus: HealthStatus['services']['ontomorph'] = { status: 'unconfigured' };

  try {
    await connectDB();
    mongodbStatus.status = 'ok';
    mongodbStatus.latencyMs = Date.now() - start;
  } catch {
    mongodbStatus.status = 'down';
  }

  if (config.ontomorph.apiKey) {
    const ontStart = Date.now();
    try {
      const res = await fetch(`${config.ontomorph.baseUrl}/health`, {
        headers: { Authorization: `Bearer ${config.ontomorph.apiKey}` },
      });
      ontomorphStatus.status = res.ok ? 'ok' : 'down';
      ontomorphStatus.latencyMs = Date.now() - ontStart;
    } catch {
      ontomorphStatus.status = 'down';
    }
  }

  const allOk = mongodbStatus.status === 'ok';
  const degraded = !allOk;

  return {
    status: degraded ? 'degraded' : 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: { mongodb: mongodbStatus, ontomorph: ontomorphStatus },
    version: '1.0.0',
  };
}