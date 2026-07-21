import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { EmergencyGrant, EmergencyIdentity } from '@/models';
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
      return NextResponse.json({ success: true, data: [] });
    }

    const grants = await EmergencyGrant.find({ emergencyId: identity._id })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      success: true,
      data: grants.map((g) => ({
        _id: g._id.toString(),
        status: g.status,
        permissions: g.permissions,
        accessedAt: g.accessedAt,
        expiresAt: g.expiresAt,
        createdAt: g.createdAt,
      })),
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

    const identity = await EmergencyIdentity.findOne({ userId });
    if (!identity) {
      return NextResponse.json({ success: false, error: 'No emergency identity found' }, { status: 404 });
    }

    const grantCode = `GRANT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const grant = await EmergencyGrant.create({
      emergencyId: identity._id,
      grantCode,
      permissions: body.permissions || identity.permissions,
      expiresAt: new Date(Date.now() + (body.expiresInHours || 1) * 60 * 60 * 1000),
      status: 'active',
    });

    return NextResponse.json({ success: true, data: grant }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
