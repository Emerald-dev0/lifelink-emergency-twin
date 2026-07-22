import { NextResponse } from 'next/server';

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiCreated<T>(data: T) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function apiUnauthorized(message = 'Unauthorized') {
  return apiError(message, 401);
}

export function apiNotFound(message = 'Resource not found') {
  return apiError(message, 404);
}

export function apiValidationError(message: string) {
  return apiError(message, 422);
}

export function apiServerError(error?: unknown) {
  const message = error instanceof Error ? error.message : 'Internal server error';
  console.error('[API Error]', error);
  return apiError(message, 500);
}