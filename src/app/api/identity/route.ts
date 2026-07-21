import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { EmergencyIdentity, User } from '@/models';
import { config } from '@/config';
import type { AuthPayload } from '@/types/api';

function getUserId(request: NextRequest): string | null {
  try {
    const auth = request.headers.get('authorization');
    if (!auth?.startsWith('Bearer ')) return null;
    const decoded = jwt.verify(auth.slice(7), config.jwt.secret) as AuthPayload;
    return decoded.userId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const identity = await EmergencyIdentity.findOne({ userId });
    if (!identity) {
      return NextResponse.json({ success: false, error: 'No emergency identity found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: identity._id.toString(),
        identifier: identity.identifier,
        bloodType: identity.bloodType,
        allergies: identity.allergies,
        medications: identity.medications,
        conditions: identity.conditions,
        emergencyContacts: identity.emergencyContacts,
        permissions: identity.permissions,
        isActive: identity.isActive,
        lastSynced: identity.lastSynced,
        createdAt: identity.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const existing = await EmergencyIdentity.findOne({ userId });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Identity already exists' }, { status: 409 });
    }

    const identifier = `LL-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const identity = await EmergencyIdentity.create({
      userId,
      identifier,
      bloodType: body.bloodType,
      allergies: body.allergies || [],
      medications: body.medications || [],
      conditions: body.conditions || [],
      emergencyContacts: body.emergencyContacts || [],
      permissions: body.permissions || ['basic_info', 'blood_type', 'allergies', 'medications'],
      isActive: true,
      lastSynced: new Date(),
    });

    await User.findByIdAndUpdate(userId, { emergencyId: identity._id.toString() });

    return NextResponse.json({ success: true, data: identity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const identity = await EmergencyIdentity.findOneAndUpdate(
      { userId },
      {
        ...body,
        lastSynced: new Date(),
      },
      { new: true }
    );

    if (!identity) {
      return NextResponse.json({ success: false, error: 'No identity found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: identity });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
