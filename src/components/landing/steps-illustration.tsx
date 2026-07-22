'use client';

export function StepsIllustration() {
  return (
    <div className="relative w-full max-w-xs" aria-hidden="true">
      <svg viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        <rect width="280" height="320" rx="12" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />

        <circle cx="50" cy="45" r="16" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="1" />
        <text x="45" y="50" fontSize="11" fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-mono)">01</text>
        <text x="80" y="42" fontSize="9" fill="var(--foreground)" fontWeight="500">Create Identity</text>
        <text x="80" y="56" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">Patient sets up profile</text>

        <line x1="50" y1="61" x2="50" y2="85" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
        <polygon points="46,83 50,90 54,83" fill="var(--muted)" />

        <circle cx="50" cy="105" r="16" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="1" />
        <text x="45" y="110" fontSize="11" fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-mono)">02</text>
        <text x="80" y="102" fontSize="9" fill="var(--foreground)" fontWeight="500">Set Permissions</text>
        <text x="80" y="116" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">Choose what to share</text>

        <line x1="50" y1="121" x2="50" y2="145" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
        <polygon points="46,143 50,150 54,143" fill="var(--muted)" />

        <circle cx="50" cy="165" r="16" fill="var(--surface)" stroke="var(--foreground)" strokeWidth="1" />
        <text x="45" y="170" fontSize="11" fontWeight="600" fill="var(--foreground)" fontFamily="var(--font-mono)">03</text>
        <text x="80" y="162" fontSize="9" fill="var(--foreground)" fontWeight="500">Responder Scans</text>
        <text x="80" y="176" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">QR code or grant code</text>

        <line x1="50" y1="181" x2="50" y2="205" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" />
        <polygon points="46,203 50,210 54,203" fill="var(--muted)" />

        <circle cx="50" cy="225" r="16" fill="var(--foreground)" />
        <text x="45" y="230" fontSize="11" fontWeight="600" fill="var(--background)" fontFamily="var(--font-mono)">04</text>
        <text x="80" y="222" fontSize="9" fill="var(--foreground)" fontWeight="500">Twin Speaks</text>
        <text x="80" y="236" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">Critical data delivered</text>

        <rect x="180" y="30" width="80" height="24" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="188" y="37" width="8" height="10" rx="1" fill="var(--foreground)" />
        <text x="202" y="44" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">PATIENT</text>

        <rect x="180" y="80" width="80" height="24" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="188" y="37" width="8" height="10" rx="1" fill="var(--foreground)" />
        <text x="202" y="44" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">PATIENT</text>

        <rect x="180" y="155" width="80" height="24" rx="4" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <text x="202" y="170" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">RESPONDER</text>

        <rect x="180" y="215" width="80" height="24" rx="4" fill="var(--foreground)" />
        <text x="192" y="231" fontSize="7" fill="var(--background)" fontFamily="var(--font-mono)" fontWeight="600">DIGITAL TWIN</text>

        <path d="M 160 42 L 175 42" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" />
        <path d="M 160 92 L 175 92" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" />
        <path d="M 160 167 L 175 167" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" />
        <path d="M 160 227 L 175 227" stroke="var(--border)" strokeWidth="0.8" strokeDasharray="3 2" />

        <rect x="20" y="265" width="240" height="35" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="0.5" />
        <rect x="30" y="273" width="60" height="19" rx="4" fill="var(--foreground)" opacity="0.08" />
        <rect x="98" y="273" width="60" height="19" rx="4" fill="var(--foreground)" opacity="0.05" />
        <rect x="166" y="273" width="84" height="19" rx="4" fill="var(--foreground)" opacity="0.08" />
        <text x="40" y="286" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">SECURE</text>
        <text x="105" y="286" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">LOGGED</text>
        <text x="173" y="286" fontSize="7" fill="var(--muted)" fontFamily="var(--font-mono)">TIME-LIMITED</text>
      </svg>
    </div>
  );
}
