import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { EmergencyIdentity, AccessLog } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const identity = await EmergencyIdentity.findOne({ identifier: id.toUpperCase() });
    if (!identity) {
      return NextResponse.json({ success: false, error: 'Identity not found' }, { status: 404 });
    }

    // Log the access
    await AccessLog.create({
      emergencyId: identity._id,
      action: 'emergency_view',
      fieldsAccessed: ['bloodType', 'allergies', 'medications', 'conditions', 'emergencyContacts'],
      timestamp: new Date(),
      metadata: {
        source: 'public_emergency_page',
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        identifier: identity.identifier,
        bloodType: identity.bloodType,
        allergies: identity.allergies,
        medications: identity.medications,
        conditions: identity.conditions,
        emergencyContacts: identity.emergencyContacts,
      },
    });
  } catch (error) {
    console.error('Emergency lookup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
