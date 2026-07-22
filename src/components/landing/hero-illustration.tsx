'use client';

export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-lg" aria-hidden="true">
      <svg viewBox="0 0 500 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--border)" strokeWidth="0.5" />
          </pattern>
        </defs>

        <rect width="500" height="420" fill="url(#grid)" rx="16" />

        <g opacity="0.07">
          <circle cx="420" cy="60" r="80" fill="var(--foreground)" />
          <circle cx="80" cy="350" r="60" fill="var(--foreground)" />
          <circle cx="400" cy="320" r="40" fill="var(--foreground)" />
        </g>

        <path d="M 80 160 L 100 160 L 110 130 L 120 190 L 130 120 L 140 180 L 150 150 L 170 150" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        <circle cx="80" cy="150" r="4" fill="var(--foreground)" />
        <circle cx="170" cy="150" r="4" fill="var(--foreground)" />

        <rect x="210" y="100" width="80" height="80" rx="12" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />
        <rect x="214" y="104" width="72" height="72" rx="10" fill="var(--surface)" />
        <rect x="224" y="114" width="12" height="12" fill="var(--foreground)" />
        <rect x="240" y="114" width="12" height="12" fill="var(--foreground)" />
        <rect x="256" y="114" width="12" height="12" fill="var(--foreground)" />
        <rect x="224" y="130" width="12" height="12" fill="var(--foreground)" />
        <rect x="240" y="130" width="12" height="12" fill="var(--muted)" />
        <rect x="256" y="130" width="12" height="12" fill="var(--foreground)" />
        <rect x="224" y="146" width="12" height="12" fill="var(--foreground)" />
        <rect x="240" y="146" width="12" height="12" fill="var(--foreground)" />
        <rect x="256" y="146" width="12" height="12" fill="var(--muted)" />
        <rect x="240" y="162" width="12" height="12" fill="var(--foreground)" />

        <line x1="294" y1="140" x2="340" y2="140" stroke="var(--border)" strokeWidth="1.5" strokeDasharray="4 3" />
        <polygon points="338,134 350,140 338,146" fill="var(--foreground)" />

        <rect x="350" y="100" width="100" height="80" rx="10" stroke="var(--border)" strokeWidth="1" fill="var(--surface)" />
        <text x="360" y="120" fontSize="7" fill="var(--muted-foreground)" fontFamily="var(--font-mono)" style={{textTransform: 'uppercase'}}>Blood type</text>
        <text x="360" y="136" fontSize="13" fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-mono)">O+</text>
        <text x="360" y="152" fontSize="7" fill="var(--muted-foreground)" fontFamily="var(--font-mono)" style={{textTransform: 'uppercase'}}>Allergy</text>
        <text x="360" y="168" fontSize="10" fill="var(--foreground)" fontFamily="var(--font-mono)">Penicillin</text>

        <path d="M 60 280 C 100 260, 140 300, 180 280 C 220 260, 260 300, 300 280 C 340 260, 380 300, 420 280 L 420 350 L 60 350 Z" fill="var(--surface)" stroke="var(--border)" strokeWidth="1" />

        <circle cx="120" cy="300" r="18" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />
        <circle cx="120" cy="300" r="8" fill="var(--foreground)" opacity="0.3" />
        <circle cx="120" cy="300" r="3" fill="var(--foreground)" />

        <circle cx="200" cy="290" r="14" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />
        <circle cx="200" cy="290" r="6" fill="var(--foreground)" opacity="0.3" />
        <circle cx="200" cy="290" r="2" fill="var(--foreground)" />

        <circle cx="280" cy="305" r="16" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />
        <circle cx="280" cy="305" r="7" fill="var(--foreground)" opacity="0.3" />
        <circle cx="280" cy="305" r="2.5" fill="var(--foreground)" />

        <circle cx="360" cy="295" r="20" stroke="var(--foreground)" strokeWidth="1.5" fill="none" />
        <circle cx="360" cy="295" r="9" fill="var(--foreground)" opacity="0.3" />
        <circle cx="360" cy="295" r="3" fill="var(--foreground)" />

        <line x1="138" y1="300" x2="182" y2="290" stroke="var(--border)" strokeWidth="0.8" />
        <line x1="214" y1="290" x2="264" y2="305" stroke="var(--border)" strokeWidth="0.8" />
        <line x1="296" y1="305" x2="340" y2="295" stroke="var(--border)" strokeWidth="0.8" />

        <rect x="60" y="365" width="380" height="30" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="70" y="373" width="80" height="14" rx="4" fill="var(--foreground)" opacity="0.08" />
        <rect x="160" y="373" width="60" height="14" rx="4" fill="var(--foreground)" opacity="0.05" />
        <rect x="230" y="373" width="100" height="14" rx="4" fill="var(--foreground)" opacity="0.08" />
        <rect x="340" y="373" width="40" height="14" rx="4" fill="var(--foreground)" opacity="0.05" />

        <rect x="60" y="20" width="100" height="22" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <text x="74" y="34" fontSize="8" fill="var(--muted)" fontFamily="var(--font-mono)">EMERGENCY ID</text>
        <rect x="170" y="20" width="60" height="22" rx="6" fill="var(--foreground)" />
        <text x="178" y="34" fontSize="8" fill="var(--background)" fontFamily="var(--font-mono)" fontWeight="600">ACTIVE</text>

        <rect x="370" y="365" width="70" height="30" rx="6" fill="var(--foreground)" opacity="0.05" />
        <text x="382" y="383" fontSize="8" fill="var(--muted)" fontFamily="var(--font-mono)">SCAN</text>
      </svg>
    </div>
  );
}
