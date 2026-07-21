import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { HealthEvent } from '@/models';
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

const defaultEvents = [
  { type: 'twin_sync', title: 'Digital Twin Connected', description: 'Your emergency identity was activated and synced with your Ontomorph Digital Twin.', severity: 'info' as const },
  { type: 'grant_issued', title: 'Emergency Grant Created', description: 'A time-limited grant was created for emergency access.', severity: 'info' as const },
  { type: 'health_alert', title: 'Emergency Identity Ready', description: 'Your LIFELINK emergency identity is active and ready to protect you.', severity: 'info' as const },
];

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const events = await HealthEvent.find({ userId })
      .sort({ timestamp: -1 })
      .limit(50);

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        data: defaultEvents.map((e, i) => ({
          _id: `default_${i}`,
          type: e.type,
          title: e.title,
          description: e.description,
          severity: e.severity,
          timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        })),
      });
    }

    return NextResponse.json({
      success: true,
      data: events.map((e) => ({
        _id: e._id.toString(),
        type: e.type,
        title: e.title,
        description: e.description,
        severity: e.severity,
        timestamp: e.timestamp,
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

    const event = await HealthEvent.create({
      userId,
      type: body.type,
      title: body.title,
      description: body.description,
      severity: body.severity || 'info',
      metadata: body.metadata,
      timestamp: new Date(),
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
