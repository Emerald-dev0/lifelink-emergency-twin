import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EmergencyIdentity, EmergencyGrant } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    const { identifier } = await params;
    await connectDB();

    const identity = await EmergencyIdentity.findOne({ identifier, isActive: true });
    if (!identity) {
      return NextResponse.json({ success: false, error: 'Identity not found' }, { status: 404 });
    }

    const activeGrant = await EmergencyGrant.findOne({
      emergencyId: identity._id,
      status: 'active',
      expiresAt: { $gt: new Date() },
    });

    if (!activeGrant) {
      return NextResponse.json({
        success: true,
        data: {
          verified: true,
          identifier: identity.identifier,
          requiresGrant: true,
          message: 'Valid identity found. Emergency grant required for access.',
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        verified: true,
        identifier: identity.identifier,
        bloodType: identity.bloodType,
        allergies: identity.allergies,
        medications: identity.medications,
        conditions: identity.conditions,
        emergencyContacts: identity.emergencyContacts,
        permissions: activeGrant.permissions,
        grantStatus: activeGrant.status,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
