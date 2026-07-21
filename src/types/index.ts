export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type EmergencyPermission = 'basic_info' | 'blood_type' | 'allergies' | 'medications' | 'conditions' | 'emergency_contacts' | 'advanced_directives' | 'full_medical_history';

export type GrantStatus = 'active' | 'expired' | 'revoked';
export type TwinConnectionStatus = 'pending' | 'connected' | 'disconnected' | 'error';
export type EventType = 'medication_change' | 'lab_result' | 'vital_change' | 'health_alert' | 'emergency_access' | 'condition_update' | 'twin_sync' | 'grant_issued' | 'grant_revoked';

export interface User {
  _id: string;
  email: string;
  name: string;
  passwordHash: string;
  twinId?: string;
  twinStatus: TwinConnectionStatus;
  emergencyId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DigitalTwin {
  id: string;
  userId: string;
  ontomorphTwinId: string;
  status: TwinConnectionStatus;
  bodySystems: BodySystem[];
  lastSync: string;
  createdAt: string;
}

export interface BodySystem {
  id: string;
  name: string;
  icon: string;
  status: 'normal' | 'attention' | 'critical';
  events: HealthEvent[];
}

export interface EmergencyIdentity {
  _id: string;
  userId: string;
  identifier: string;
  qrCode: string;
  bloodType?: BloodType;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: EmergencyContact[];
  permissions: EmergencyPermission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface EmergencyGrant {
  _id: string;
  emergencyId: string;
  responderId?: string;
  status: GrantStatus;
  permissions: EmergencyPermission[];
  accessedAt?: string;
  expiresAt: string;
  createdAt: string;
}

export interface HealthEvent {
  _id: string;
  userId: string;
  type: EventType;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface AccessLog {
  _id: string;
  grantId: string;
  responderId?: string;
  action: 'viewed' | 'consented' | 'expired' | 'revoked';
  fieldsAccessed: EmergencyPermission[];
  timestamp: string;
}

export interface HolonResponse {
  summary: string;
  medications: HolonMedication[];
  conditions: string[];
  alerts: string[];
  recommendations: string[];
}

export interface HolonMedication {
  name: string;
  purpose: string;
  category: string;
  emergencyConsiderations: string[];
  interactions: string[];
}
