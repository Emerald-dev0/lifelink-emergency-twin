import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { createTwin, getTwin } from '@/lib/ontomorph';
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

export async function POST(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const twin = await createTwin(body.displayName || 'My Digital Twin', {
      age: body.age || 30,
      sex: body.sex || 'other',
      heightCm: body.heightCm || 170,
      weightKg: body.weightKg || 70,
      bmi: body.bmi || 24,
      skinTone: body.skinTone || 'II',
      ancestry: body.ancestry || '',
      hairColor: body.hairColor || '',
    });

    await connectDB();
    await User.findByIdAndUpdate(userId, { twinId: twin.id, twinStatus: 'connected' });

    return NextResponse.json({ success: true, data: twin }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const user = await User.findById(userId);
    if (!user || !user.twinId) {
      return NextResponse.json({ success: false, error: 'No twin found' }, { status: 404 });
    }

    const twin = await getTwin(user.twinId);
    return NextResponse.json({ success: true, data: twin });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}