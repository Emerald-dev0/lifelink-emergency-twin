import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function Loader({ size = 'md', className, label }: LoaderProps) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-2 border-accent/20 border-t-accent animate-spin',
          sizeMap[size],
        )}
      />
      {label && <p className="text-xs text-muted">{label}</p>}
    </div>
  );
}

export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Loader size="lg" label={label} />
    </div>
  );
}