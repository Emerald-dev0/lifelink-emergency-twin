const REQUIRED_VARS = [
  'ONTOMORPH_API_KEY',
  'JWT_SECRET',
] as const;

const OPTIONAL_VARS = [
  'NEXT_PUBLIC_APP_URL',
  'MONGODB_URI',
  'DATABASE_URL',
  'ENCRYPTION_KEY',
  'ONTOMORPH_BASE_URL',
] as const;

export function validateEnv(): string[] {
  const missing: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  return missing;
}

export function getEnvOrThrow(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}