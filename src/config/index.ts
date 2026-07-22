export const config = {
  app: {
    name: 'LIFELINK',
    tagline: 'When you cannot speak for yourself, your Digital Twin speaks.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  ontomorph: {
    apiKey: process.env.ONTOMORPH_API_KEY || '',
    baseUrl: process.env.ONTOMORPH_BASE_URL || 'https://api.ontomorph.com/v1',
    holonUrl: process.env.ONTOMORPH_BASE_URL
      ? `${process.env.ONTOMORPH_BASE_URL.replace(/\/v1.*$/, '')}/holon/v1`
      : 'https://holon-api.ontomorph.com',
    holonApiKey: process.env.HOLON_API_KEY || process.env.ONTOMORPH_API_KEY || '',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || process.env.DATABASE_URL || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'lifelink-dev-secret-change-in-production',
    expiresIn: '7d',
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY || '',
  },
} as const;

export type Config = typeof config;
