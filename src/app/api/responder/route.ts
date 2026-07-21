import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EmergencyGrant, EmergencyIdentity, AccessLog } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const { grantCode } = await request.json();

    if (!grantCode) {
      return NextResponse.json({ success: false, error: 'Grant code is required' }, { status: 400 });
    }

    await connectDB();

    const grant = await EmergencyGrant.findOne({ grantCode: grantCode.toUpperCase() });
    if (!grant) {
      return NextResponse.json({ success: false, error: 'Invalid grant code' }, { status: 404 });
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
      return NextResponse.json({ success: false, error: 'Patient identity not found' }, { status: 404 });
    }

    grant.accessedAt = new Date();
    await grant.save();

    await AccessLog.create({
      grantId: grant._id,
      action: 'viewed',
      fieldsAccessed: grant.permissions,
      timestamp: new Date(),
    });

    const responseData: Record<string, any> = {
      identifier: identity.identifier,
    };

    if (grant.permissions.includes('blood_type')) responseData.bloodType = identity.bloodType;
    if (grant.permissions.includes('allergies')) responseData.allergies = identity.allergies;
    if (grant.permissions.includes('medications')) responseData.medications = identity.medications;
    if (grant.permissions.includes('conditions')) responseData.conditions = identity.conditions;
    if (grant.permissions.includes('emergency_contacts')) responseData.emergencyContacts = identity.emergencyContacts;

    return NextResponse.json({
      success: true,
      data: {
        patient: responseData,
        grant: {
          code: grant.grantCode,
          permissions: grant.permissions,
          expiresAt: grant.expiresAt,
        },
      },
    });
  } catch (error) {
    console.error('Responder error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
