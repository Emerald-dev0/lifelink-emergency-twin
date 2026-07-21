import { config } from '@/config';

interface HolonQuery {
  concept: string;
  context?: string;
}

export async function queryHolon<T = Record<string, unknown>>(
  query: HolonQuery
): Promise<T> {
  const url = `${config.holon.baseUrl}/query`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.holon.apiKey}`,
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`HOLON API error: ${response.status}`);
  }

  return response.json();
}

export async function getMedicalContext(
  medications: string[],
  conditions: string[]
): Promise<{ summary: string; alerts: string[]; recommendations: string[] }> {
  const response = await queryHolon<{
    summary: string;
    alerts: string[];
    recommendations: string[];
  }>({
    concept: 'emergency_medical_context',
    context: JSON.stringify({ medications, conditions }),
  });

  return response;
}
