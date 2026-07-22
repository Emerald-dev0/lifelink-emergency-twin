import { config } from '@/config';

const BASE = config.ontomorph.baseUrl;
const KEY = config.ontomorph.apiKey;

function headers() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${KEY}`,
  };
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { ...init, headers: { ...headers(), ...init?.headers } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Ontomorph API ${res.status}: ${body}`);
  }
  return res.json();
}

export interface PersonalisationProfile {
  age: number;
  sex: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  bmi: number;
  skinTone: string;
  ancestry: string;
  hairColor: string;
}

export interface OntomorphTwin {
  id: string;
  userId: string;
  did: string;
  displayName: string;
  personalisationProfile: PersonalisationProfile;
  manifestRef: string;
  vcfBlobRef: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyCard {
  id: string;
  twinId: string;
  bloodType?: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
  lastUpdated: string;
}

export async function createTwin(
  displayName: string,
  profile: PersonalisationProfile,
): Promise<OntomorphTwin> {
  const res = await api<{ data: OntomorphTwin }>('/twins', {
    method: 'POST',
    body: JSON.stringify({ displayName, personalisationProfile: profile }),
  });
  return res.data;
}

export async function getTwin(id: string): Promise<OntomorphTwin> {
  const res = await api<{ data: OntomorphTwin }>(`/twins/${id}`);
  return res.data;
}

export async function updateTwin(
  id: string,
  partial: Partial<{ displayName: string; personalisationProfile: Partial<PersonalisationProfile> }>,
): Promise<OntomorphTwin> {
  const res = await api<{ data: OntomorphTwin }>(`/twins/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(partial),
  });
  return res.data;
}

export async function listTwins(): Promise<OntomorphTwin[]> {
  const res = await api<{ data: OntomorphTwin[] }>('/twins');
  return res.data;
}

export async function seedDemoData(displayName: string, bundle?: Record<string, unknown>): Promise<{
  twinId: string;
  twinCreated: boolean;
  eventsCreated: number;
}> {
  const res = await api<{ data: { twinId: string; twinCreated: boolean; eventsCreated: number } }>('/twins/seed-demo', {
    method: 'POST',
    body: JSON.stringify({
      bundle: bundle || {
        resourceType: 'Bundle',
        type: 'collection',
        entry: [],
      },
      displayName,
    }),
  });
  return res.data;
}

export async function createHealthEvent(
  twinId: string,
  event: {
    type: string;
    severity?: 'mild' | 'moderate' | 'severe';
    code?: string;
    notes?: string;
    recordedAt?: string;
  },
) {
  const res = await api<{ data: unknown }>(`/twins/${twinId}/events`, {
    method: 'POST',
    body: JSON.stringify(event),
  });
  return res.data;
}

export async function getEmergencyCard(twinId: string): Promise<EmergencyCard | null> {
  const res = await fetch(`${BASE}/twins/${twinId}/events/emergency-card`, {
    headers: headers(),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as EmergencyCard;
}

export async function getHolonSummary(patientId: string) {
  if (!KEY) return null;
  const res = await fetch(`${config.ontomorph.holonUrl}/twins/${patientId}/summary`, {
    headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) return null;
  return res.json();
}