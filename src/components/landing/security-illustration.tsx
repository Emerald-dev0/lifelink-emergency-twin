'use client';

export function SecurityIllustration() {
  return (
    <div className="relative w-full max-w-sm" aria-hidden="true">
      <svg viewBox="0 0 360 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="360" height="280" rx="12" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />

        <path d="M180 40 L260 80 L260 160 C260 200 220 230 180 245 C140 230 100 200 100 160 L100 80 Z" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="1.5" />
        <path d="M180 60 L240 90 L240 155 C240 188 210 215 180 228 C150 215 120 188 120 155 L120 90 Z" fill="none" stroke="var(--border)" strokeWidth="0.5" />

        <line x1="180" y1="85" x2="180" y2="200" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="150" y1="120" x2="210" y2="120" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="155" y1="140" x2="205" y2="140" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="160" y1="160" x2="200" y2="160" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" />

        <circle cx="180" cy="200" r="6" fill="var(--foreground)" />

        <rect x="20" y="50" width="80" height="40" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="28" y="58" width="16" height="6" rx="2" fill="var(--foreground)" opacity="0.1" />
        <rect x="28" y="68" width="40" height="6" rx="2" fill="var(--foreground)" opacity="0.07" />
        <rect x="28" y="78" width="30" height="6" rx="2" fill="var(--foreground)" opacity="0.1" />
        <path d="M 80 70 L 100 90" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" />

        <rect x="260" y="50" width="80" height="40" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="268" y="58" width="16" height="6" rx="2" fill="var(--foreground)" opacity="0.1" />
        <rect x="268" y="68" width="40" height="6" rx="2" fill="var(--foreground)" opacity="0.07" />
        <rect x="268" y="78" width="30" height="6" rx="2" fill="var(--foreground)" opacity="0.1" />
        <path d="M 260 70 L 240 90" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" />

        <rect x="110" y="230" width="60" height="20" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <text x="120" y="243" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">GRANT ACTIVE</text>

        <rect x="190" y="230" width="60" height="20" rx="4" fill="var(--foreground)" opacity="0.08" />
        <text x="200" y="243" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">LOG ALL</text>

        <path d="M 60 130 L 60 170" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="round" />
        <path d="M 55 140 L 60 130 L 65 140" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <path d="M 300 130 L 300 170" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="round" />
        <path d="M 295 160 L 300 170 L 305 160" stroke="var(--foreground)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <rect x="20" y="190" width="100" height="18" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="28" y="195" width="8" height="8" rx="2" fill="var(--success)" />
        <text x="42" y="202" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">ACCESS APPROVED</text>

        <rect x="240" y="190" width="100" height="18" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="248" y="195" width="8" height="8" rx="2" fill="var(--danger)" />
        <text x="262" y="202" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">ACCESS DENIED</text>
      </svg>
    </div>
  );
}
