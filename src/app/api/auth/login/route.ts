import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { config } from '@/config';
import { emailSchema } from '@/lib/validate';
import { authLimiter } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 422 },
      );
    }

    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateCheck = authLimiter.check(`login:${clientIp}`);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many attempts. Try again later.' },
        { status: 429 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    logger.info('User logged in', { email, role: user.role });

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          twinStatus: user.twinStatus,
          emergencyId: user.emergencyId,
        },
      },
    });
  } catch (error) {
    logger.error('Login error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
