import { cn } from '@/lib/utils';
import { config } from '@/config';

interface LogoProps {
  variant?: 'full' | 'icon' | 'wordmark';
  className?: string;
  iconClassName?: string;
}

export function Logo({ variant = 'full', className, iconClassName }: LogoProps) {
  if (variant === 'wordmark') {
    return (
      <span className={cn('text-lg font-bold tracking-tight', className)}>
        {config.app.name}
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={cn('w-8 h-8 rounded-lg border border-border bg-black flex items-center justify-center', className)}>
        <svg viewBox="0 0 32 32" className={cn('w-5 h-5', iconClassName)} fill="none">
          <path d="M16 6 L26 16 L26 26 C26 30 22 32 16 33 C10 32 6 30 6 26 L6 16 Z" stroke="#00E5FF" strokeWidth="2.5" strokeLinejoin="round" />
          <line x1="16" y1="14" x2="16" y2="24" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="18.5" x2="20" y2="18.5" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <a href="/" className={cn('flex items-center gap-2', className)}>
      <LogoIcon className={iconClassName} />
      <span className="text-lg font-bold tracking-tight">{config.app.name}</span>
    </a>
  );
}

export function LogoIcon({ className }: { className?: string }) {
  return (
    <div className={cn('w-8 h-8 rounded-lg border border-border bg-black flex items-center justify-center shrink-0', className)}>
      <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
        <path d="M16 6 L26 16 L26 26 C26 30 22 32 16 33 C10 32 6 30 6 26 L6 16 Z" stroke="#00E5FF" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="16" y1="14" x2="16" y2="24" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="12" y1="18.5" x2="20" y2="18.5" stroke="#00E5FF" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}