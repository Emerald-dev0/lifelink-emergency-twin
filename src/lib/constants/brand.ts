/** LIFELINK brand tokens — never use hex literals in components; use CSS vars / Tailwind tokens. */
export const BRAND = {
  /** Landing / marketing — strict monochrome */
  landing: {
    background: '#FFFFFF',
    foreground: '#0A0A0A',
    muted: '#5A5A5A',
    mutedForeground: '#9A9A9A',
    border: '#E5E5E5',
    surface: '#FAFAFA',
  },
  /** Authenticated product — dark-first with state accents */
  app: {
    ground: '#050505',
    foreground: '#F5F5F5',
    panel: '#0F0F0F',
    inset: '#161616',
    muted: '#888888',
    accent: '#00E5FF',
    danger: '#FF3333',
    warning: '#FFB800',
    success: '#00FF85',
  },
} as const;
