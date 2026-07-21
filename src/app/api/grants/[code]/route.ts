import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EmergencyGrant, EmergencyIdentity } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    await connectDB();

    const grant = await EmergencyGrant.findOne({ grantCode: code });
    if (!grant) {
      return NextResponse.json({ success: false, error: 'Grant not found' }, { status: 404 });
    }

    if (grant.status !== 'active') {
      return NextResponse.json({ success: false, error: 'Grant is no longer active' }, { status: 403 });
    }

    if (grant.expiresAt < new Date()) {
      grant.status = 'expired';
      await grant.save();
      return NextResponse.json({ success: false, error: 'Grant has expired' }, { status: 410 });
    }

    const identity = await EmergencyIdentity.findById(grant.emergencyId);
    if (!identity) {
      return NextResponse.json({ success: false, error: 'Identity not found' }, { status: 404 });
    }

    grant.accessedAt = new Date();
    await grant.save();

    return NextResponse.json({
      success: true,
      data: {
        grant: {
          code: grant.grantCode,
          status: grant.status,
          permissions: grant.permissions,
          expiresAt: grant.expiresAt,
        },
        patient: {
          identifier: identity.identifier,
          bloodType: grant.permissions.includes('blood_type') ? identity.bloodType : undefined,
          allergies: grant.permissions.includes('allergies') ? identity.allergies : undefined,
          medications: grant.permissions.includes('medications') ? identity.medications : undefined,
          conditions: grant.permissions.includes('conditions') ? identity.conditions : undefined,
          emergencyContacts: grant.permissions.includes('emergency_contacts') ? identity.emergencyContacts : undefined,
        },
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
