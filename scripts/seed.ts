/**
 * LIFELINK Seed Script
 * 
 * Creates test accounts and sample data for hackathon judges.
 * Run: npx tsx scripts/seed.ts
 * 
 * Test Accounts:
 *   Patient:   patient@lifelink.demo / Patient123!
 *   Responder: responder@lifelink.demo / Responder123!
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');
import { fileURLToPath } from 'url';

// Load env vars from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Mongoose models (inline to avoid Next.js imports)
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },
    twinId: { type: String },
    twinStatus: { type: String, enum: ['pending', 'connected', 'disconnected', 'error'], default: 'pending' },
    emergencyId: { type: String },
    role: { type: String, enum: ['patient', 'responder', 'admin'], default: 'patient' },
  },
  { timestamps: true }
);

const EmergencyIdentitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    identifier: { type: String, required: true, unique: true },
    bloodType: { type: String },
    allergies: [{ type: String }],
    medications: [{ type: String }],
    conditions: [{ type: String }],
    emergencyContacts: [{
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
    }],
    permissions: [{ type: String }],
    isActive: { type: Boolean, default: true },
    lastSynced: { type: Date },
  },
  { timestamps: true }
);

const HealthEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
    metadata: { type: mongoose.Schema.Types.Mixed },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

const EmergencyGrantSchema = new mongoose.Schema(
  {
    emergencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyIdentity', required: true },
    responderId: { type: String },
    grantCode: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active' },
    permissions: [{ type: String }],
    accessedAt: { type: Date },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const EmergencyIdentity = mongoose.models.EmergencyIdentity || mongoose.model('EmergencyIdentity', EmergencyIdentitySchema);
const HealthEvent = mongoose.models.HealthEvent || mongoose.model('HealthEvent', HealthEventSchema);
const EmergencyGrant = mongoose.models.EmergencyGrant || mongoose.model('EmergencyGrant', EmergencyGrantSchema);

// --- Helper: generate LL-XXXX-XXXX identifier ---
function generateLLId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `LL-${segment(4)}-${segment(4)}`;
}

function generateGrantCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `GC-${segment(4)}-${segment(4)}`;
}

// --- Main seed ---
async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ Missing MONGODB_URI in environment');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  // Clean existing seed data
  console.log('🧹 Cleaning existing seed data...');
  await User.deleteMany({ email: { $in: ['patient@lifelink.demo', 'responder@lifelink.demo'] } });
  console.log('   Removed old patient & responder accounts\n');

  const passwordHash = await bcrypt.hash('Patient123!', 12);
  const responderPasswordHash = await bcrypt.hash('Responder123!', 12);

  // ── Patient Account ──────────────────────────────────────────────
  console.log('👤 Creating patient account...');
  const patient = await User.create({
    email: 'patient@lifelink.demo',
    name: 'Sarah Johnson',
    passwordHash,
    role: 'patient',
    twinStatus: 'connected',
  });
  console.log(`   ✅ Patient created: ${patient.email} (id: ${patient._id})`);

  // ── Patient Emergency Identity ───────────────────────────────────
  const patientLLId = generateLLId();
  console.log(`🪪 Creating emergency identity (${patientLLId})...`);
  const emergencyIdentity = await EmergencyIdentity.create({
    userId: patient._id,
    identifier: patientLLId,
    bloodType: 'O+',
    allergies: [
      'Penicillin',
      'Sulfa drugs',
      'Peanuts',
    ],
    medications: [
      'Lisinopril 10mg (daily, blood pressure)',
      'Metformin 500mg (twice daily, Type 2 Diabetes)',
      'Aspirin 81mg (daily, heart health)',
    ],
    conditions: [
      'Type 2 Diabetes',
      'Hypertension',
      'Asthma (mild)',
    ],
    emergencyContacts: [
      {
        name: 'Michael Johnson',
        relationship: 'Spouse',
        phone: '+1-555-0101',
        email: 'michael.johnson@email.com',
      },
      {
        name: 'Emily Johnson',
        relationship: 'Daughter',
        phone: '+1-555-0102',
        email: 'emily.j@email.com',
      },
      {
        name: 'Dr. Rebecca Torres',
        relationship: 'Primary Care Physician',
        phone: '+1-555-0103',
        email: 'dr.torres@cityclinic.com',
      },
    ],
    permissions: [
      'view_identity',
      'view_medications',
      'view_allergies',
      'view_contacts',
      'view_conditions',
    ],
    isActive: true,
    lastSynced: new Date(),
  });
  console.log(`   ✅ Emergency identity created`);

  // Update patient with emergencyId
  await User.findByIdAndUpdate(patient._id, { emergencyId: patientLLId });

  // ── Patient Health Events ────────────────────────────────────────
  console.log('📋 Creating health events...');
  const now = new Date();

  const healthEvents = [
    {
      userId: patient._id,
      type: 'checkup',
      title: 'Annual Physical Exam',
      description: 'Routine annual physical with Dr. Torres. Blood pressure 128/82. Fasting glucose 112 mg/dL (pre-diabetic range). Weight stable. Recommended continued Metformin and lifestyle modifications.',
      severity: 'info' as const,
      metadata: {
        doctor: 'Dr. Rebecca Torres',
        location: 'City Clinic',
        bloodPressure: '128/82',
        heartRate: 72,
        temperature: '98.6F',
        weight: '168 lbs',
        glucose: '112 mg/dL',
      },
      timestamp: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
    },
    {
      userId: patient._id,
      type: 'medication',
      title: 'Medication Adjustment - Lisinopril Increased',
      description: 'Blood pressure slightly elevated. Lisinopril increased from 10mg to 15mg daily. Follow-up in 4 weeks to reassess.',
      severity: 'warning' as const,
      metadata: {
        doctor: 'Dr. Rebecca Torres',
        change: 'Lisinopril 10mg → 15mg',
        reason: 'BP 132/88 at last visit',
      },
      timestamp: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
    },
    {
      userId: patient._id,
      type: 'allergy',
      title: 'Allergic Reaction to Amoxicillin',
      description: 'Patient experienced hives and mild throat swelling after taking Amoxicillin for sinus infection. Administered antihistamines. Reaction resolved within 2 hours. Added Amoxicillin to allergy list.',
      severity: 'critical' as const,
      metadata: {
        reaction: 'Hives, mild angioedema',
        treatment: 'Diphenhydramine 25mg',
        resolvedIn: '2 hours',
      },
      timestamp: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
    },
    {
      userId: patient._id,
      type: 'vitals',
      title: 'Home Blood Pressure Monitoring',
      description: 'Self-reported blood pressure readings from home monitor. Average of 126/80 over 7 days. Heart rate consistently 68-74 bpm. Within target range.',
      severity: 'info' as const,
      metadata: {
        readings: [
          { date: '2026-07-16', bp: '124/78', hr: 70 },
          { date: '2026-07-17', bp: '128/82', hr: 72 },
          { date: '2026-07-18', bp: '126/80', hr: 68 },
          { date: '2026-07-19', bp: '122/76', hr: 71 },
          { date: '2026-07-20', bp: '130/84', hr: 74 },
          { date: '2026-07-21', bp: '124/78', hr: 69 },
          { date: '2026-07-22', bp: '128/80', hr: 72 },
        ],
        device: 'Omron BP Monitor',
        averageBP: '126/80',
        averageHR: 71,
      },
      timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      userId: patient._id,
      type: 'emergency',
      title: 'Asthma Episode - Urgent Care Visit',
      description: 'Patient experienced acute asthma episode triggered by pollen exposure. Presented with wheezing, shortness of breath, and chest tightness. Treated with nebulizer (albuterol) and discharged after 2 hours with improved O2 saturation.',
      severity: 'critical' as const,
      metadata: {
        location: 'City Urgent Care',
        trigger: 'Environmental - pollen',
        treatment: 'Albuterol nebulizer',
        oxygenSaturation: { initial: '94%', discharge: '98%' },
        duration: '2 hours',
      },
      timestamp: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    },
    {
      userId: patient._id,
      type: 'lab',
      title: 'Comprehensive Metabolic Panel Results',
      description: 'Routine blood work results. Fasting glucose 108 mg/dL (improved from 112). HbA1c 6.2% (stable). Creatinine 0.9 mg/dL (normal). Lipid panel: LDL 118, HDL 48, Triglycerides 142.',
      severity: 'info' as const,
      metadata: {
        lab: 'Quest Diagnostics',
        glucose: '108 mg/dL',
        hba1c: '6.2%',
        creatinine: '0.9 mg/dL',
        ldl: '118 mg/dL',
        hdl: '48 mg/dL',
        triglycerides: '142 mg/dL',
      },
      timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
  ];

  for (const event of healthEvents) {
    await HealthEvent.create(event);
  }
  console.log(`   ✅ Created ${healthEvents.length} health events`);

  // ── Patient Emergency Grant ──────────────────────────────────────
  console.log('🔑 Creating sample emergency grant...');
  const grant = await EmergencyGrant.create({
    emergencyId: emergencyIdentity._id,
    responderId: 'RESP-2026-001',
    grantCode: generateGrantCode(),
    status: 'active',
    permissions: ['view_identity', 'view_medications', 'view_allergies', 'view_contacts'],
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
  });
  console.log(`   ✅ Grant created: ${grant.grantCode} (active, expires 24h)`);

  // ── Responder Account ────────────────────────────────────────────
  console.log('🚑 Creating responder account...');
  const responder = await User.create({
    email: 'responder@lifelink.demo',
    name: 'Dr. James Carter',
    passwordHash: responderPasswordHash,
    role: 'responder',
    twinStatus: 'pending',
  });
  console.log(`   ✅ Responder created: ${responder.email} (id: ${responder._id})`);

  // ── Summary ──────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log('  SEED COMPLETE');
  console.log('═'.repeat(50));
  console.log(`
  👤 PATIENT ACCOUNT
     Email:    patient@lifelink.demo
     Password: Patient123!
     Name:     Sarah Johnson
     LL-ID:    ${patientLLId}
     Blood:    O+
     Role:     patient

  🚑 RESPONDER ACCOUNT
     Email:    responder@lifelink.demo
     Password: Responder123!
     Name:     Dr. James Carter
     Role:     responder

  📊 SAMPLE DATA
     • ${healthEvents.length} health events (checkup, medication, allergy, vitals, emergency, lab)
     • 1 active emergency grant (${grant.grantCode})
     • 3 emergency contacts
     • 3 medications, 3 conditions, 3 allergies
  `);
  console.log('═'.repeat(50));

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
