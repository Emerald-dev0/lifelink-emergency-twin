import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, EmergencyIdentity, AccessLog } from '@/models';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Search by LL-ID (exact match) or name (partial match)
    const isLLId = /^LL-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(query);

    let identity;
    if (isLLId) {
      identity = await EmergencyIdentity.findOne({ identifier: query.toUpperCase() });
    } else {
      // Search by patient name
      const users = await User.find({
        name: { $regex: query, $options: 'i' },
        role: 'patient',
      }).limit(10);

      if (users.length === 0) {
        return NextResponse.json({ success: true, data: [] });
      }

      const userIds = users.map((u) => u._id);
      identity = await EmergencyIdentity.findOne({ userId: { $in: userIds } });
    }

    if (!identity) {
      return NextResponse.json({ success: true, data: [] });
    }

    // Log the search
    await AccessLog.create({
      emergencyId: identity._id,
      action: 'search',
      fieldsAccessed: ['identifier'],
      timestamp: new Date(),
      metadata: {
        query,
        source: 'responder_search',
        ip: request.headers.get('x-forwarded-for') || 'unknown',
      },
    });

    // Return minimal info — just enough for responder to confirm they found the right patient
    return NextResponse.json({
      success: true,
      data: [
        {
          identifier: identity.identifier,
          bloodType: identity.bloodType,
          isActive: identity.isActive,
          lastSynced: identity.lastSynced,
        },
      ],
    });
  } catch (error) {
    console.error('Responder search error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
