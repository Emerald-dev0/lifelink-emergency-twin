'use client';

/** B&W QR-scan-to-data schematic — no accent color on landing. */
export function HeroSchematic() {
  return (
    <div className="mt-16 w-full max-w-3xl" aria-hidden="true">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-4">
        {/* QR / grant code */}
        <div className="w-36 h-36 shrink-0 rounded-lg border border-border bg-surface p-3 grid grid-cols-5 grid-rows-5 gap-0.5">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[1px]"
              style={{
                background:
                  [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 24].includes(i)
                    ? 'var(--foreground)'
                    : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Connection line */}
        <div className="hidden sm:flex flex-1 items-center px-4">
          <div className="h-px w-full bg-border relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-b-[4px] border-l-[6px] border-t-transparent border-b-transparent border-l-foreground" />
          </div>
        </div>
        <div className="sm:hidden w-px h-8 bg-border" />

        {/* Data card */}
        <div className="w-full sm:w-56 rounded-lg border border-border bg-surface p-4 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            Illustrative data
          </p>
          <div>
            <p className="text-xs text-muted mb-0.5">Blood type</p>
            <p className="font-mono text-lg font-medium text-foreground">O+</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Allergy</p>
            <p className="font-mono text-sm text-foreground">Penicillin</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-0.5">Medication</p>
            <p className="font-mono text-sm text-foreground">Warfarin 5mg</p>
          </div>
        </div>
      </div>
    </div>
  );
}
