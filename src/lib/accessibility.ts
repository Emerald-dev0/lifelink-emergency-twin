export function ariaLabel(label: string, details?: string): string {
  return details ? `${label} — ${details}` : label;
}

export function ariaStatus(active: boolean): { 'aria-live': 'polite'; 'aria-atomic': 'true'; children: string } {
  return {
    'aria-live': 'polite',
    'aria-atomic': 'true' as const,
    children: active ? 'Active' : 'Inactive',
  };
}

export const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg';

export const screenReaderOnly = 'sr-only';

export function joinLabels(labels: string[]): string {
  return labels.filter(Boolean).join(', ');
}