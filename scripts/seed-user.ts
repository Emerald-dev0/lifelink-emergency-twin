/**
 * Seed data for a specific user account.
 * Run: npx tsx scripts/seed-user.ts
 */

import mongoose from 'mongoose';
import dns from 'dns';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const EmergencyIdentitySchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const HealthEventSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const EmergencyGrantSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const EmergencyIdentity = mongoose.models.EmergencyIdentity || mongoose.model('EmergencyIdentity', EmergencyIdentitySchema);
const HealthEvent = mongoose.models.HealthEvent || mongoose.model('HealthEvent', HealthEventSchema);
const EmergencyGrant = mongoose.models.EmergencyGrant || mongoose.model('EmergencyGrant', EmergencyGrantSchema);

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

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) { console.error('❌ Missing MONGODB_URI'); process.exit(1); }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected\n');

  const user = await User.findOne({ email: 'oluwadare458@gmail.com' });
  if (!user) { console.error('❌ User not found'); process.exit(1); }
  console.log(`👤 Found user: ${user.name} (${user._id})`);

  // Clean old data
  await EmergencyIdentity.deleteMany({ userId: user._id });
  await HealthEvent.deleteMany({ userId: user._id });
  console.log('🧹 Cleaned old data\n');

  const llId = generateLLId();
  console.log(`🪪 Creating emergency identity (${llId})...`);
  const identity = await EmergencyIdentity.create({
    userId: user._id,
    identifier: llId,
    bloodType: 'O+',
    allergies: ['Penicillin', 'Sulfa drugs', 'Peanuts'],
    medications: ['Lisinopril 10mg (daily, blood pressure)', 'Metformin 500mg (twice daily, Type 2 Diabetes)', 'Aspirin 81mg (daily, heart health)'],
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Asthma (mild)'],
    emergencyContacts: [
      { name: 'Michael Johnson', relationship: 'Spouse', phone: '+1-555-0101', email: 'michael.johnson@email.com' },
      { name: 'Emily Johnson', relationship: 'Daughter', phone: '+1-555-0102', email: 'emily.j@email.com' },
      { name: 'Dr. Rebecca Torres', relationship: 'Primary Care Physician', phone: '+1-555-0103', email: 'dr.torres@cityclinic.com' },
    ],
    permissions: ['view_identity', 'view_medications', 'view_allergies', 'view_contacts', 'view_conditions'],
    isActive: true,
    lastSynced: new Date(),
  });

  await User.findByIdAndUpdate(user._id, { emergencyId: llId, twinStatus: 'connected' });
  console.log('   ✅ Identity created + linked');

  const now = Date.now();
  const events = [
    { userId: user._id, type: 'checkup', title: 'Annual Physical Exam', description: 'Routine physical with Dr. Torres. BP 128/82. Fasting glucose 112 mg/dL. Weight stable.', severity: 'info', metadata: { doctor: 'Dr. Rebecca Torres', bloodPressure: '128/82', glucose: '112 mg/dL' }, timestamp: new Date(now - 90*24*60*60*1000) },
    { userId: user._id, type: 'medication', title: 'Medication Adjustment', description: 'Lisinopril increased from 10mg to 15mg daily due to elevated BP.', severity: 'warning', metadata: { change: 'Lisinopril 10mg → 15mg' }, timestamp: new Date(now - 60*24*60*60*1000) },
    { userId: user._id, type: 'allergy', title: 'Allergic Reaction to Amoxicillin', description: 'Hives and mild throat swelling after Amoxicillin. Administered antihistamines. Resolved in 2 hours.', severity: 'critical', metadata: { reaction: 'Hives, mild angioedema', treatment: 'Diphenhydramine 25mg' }, timestamp: new Date(now - 45*24*60*60*1000) },
    { userId: user._id, type: 'vitals', title: 'Home Blood Pressure Monitoring', description: 'Average BP 126/80 over 7 days. Heart rate 68-74 bpm. Within target range.', severity: 'info', metadata: { averageBP: '126/80', averageHR: 71 }, timestamp: new Date(now - 1*24*60*60*1000) },
    { userId: user._id, type: 'emergency', title: 'Asthma Episode', description: 'Acute asthma triggered by pollen. Treated with nebulizer. O2 sat improved from 94% to 98%.', severity: 'critical', metadata: { trigger: 'pollen', treatment: 'Albuterol nebulizer' }, timestamp: new Date(now - 30*24*60*60*1000) },
    { userId: user._id, type: 'lab', title: 'Comprehensive Metabolic Panel', description: 'Glucose 108 mg/dL (improved). HbA1c 6.2%. Creatinine 0.9 mg/dL. LDL 118, HDL 48.', severity: 'info', metadata: { glucose: '108 mg/dL', hba1c: '6.2%' }, timestamp: new Date(now - 14*24*60*60*1000) },
  ];

  for (const e of events) await HealthEvent.create(e);
  console.log(`   ✅ Created ${events.length} health events`);

  const grantCode = generateGrantCode();
  await EmergencyGrant.create({
    emergencyId: identity._id,
    grantCode,
    status: 'active',
    permissions: ['view_identity', 'view_medications', 'view_allergies', 'view_contacts'],
    expiresAt: new Date(now + 24*60*60*1000),
  });
  console.log(`   ✅ Grant created: ${grantCode}`);

  console.log(`\n══════════════════════════════════════════════════`);
  console.log(`  SEED COMPLETE for ${user.name}`);
  console.log(`══════════════════════════════════════════════════`);
  console.log(`  LL-ID:   ${llId}`);
  console.log(`  Blood:   O+`);
  console.log(`  Grant:   ${grantCode}`);
  console.log(`  Events:  ${events.length}`);
  console.log(`══════════════════════════════════════════════════\n`);

  await mongoose.disconnect();
}

seed().catch((err) => { console.error('❌ Seed failed:', err); process.exit(1); });
