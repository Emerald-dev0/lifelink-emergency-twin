import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { config } from '@/config';
import { registerSchema } from '@/lib/validate';
import { authLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues.map((i) => i.message).join('. ') },
        { status: 422 },
      );
    }

    const { email, name, password, role } = parsed.data;

    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = authLimiter.check(`register:${clientIp}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Try again later.' },
        { status: 429 },
      );
    }

    const validRole = role === 'responder' ? 'responder' : 'patient';

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: validRole,
    });

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    );

    logger.info('User registered', { email, role: validRole });

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            twinStatus: user.twinStatus,
          },
        },
      },
      { status: 201 },
    );
  } catch (error) {
    logger.error('Registration error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
