export const TWIN_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  connected: 'Connected',
  disconnected: 'Disconnected',
  error: 'Error',
} as const;

export const TWIN_STATUS_COLORS: Record<string, string> = {
  pending: 'text-warning',
  connected: 'text-success',
  disconnected: 'text-muted',
  error: 'text-danger',
} as const;

export const TWIN_STATUS_BG: Record<string, string> = {
  pending: 'bg-warning/10 border-warning/20',
  connected: 'bg-success/10 border-success/20',
  disconnected: 'bg-surface-subtle border-border-subtle',
  error: 'bg-danger/10 border-danger/20',
} as const;

export function isTwinOperational(status: string): boolean {
  return status === 'connected';
}

export function getTwinStatusDisplay(status: string): {
  label: string;
  color: string;
  bg: string;
} {
  return {
    label: TWIN_STATUS_LABELS[status] || status,
    color: TWIN_STATUS_COLORS[status] || 'text-muted',
    bg: TWIN_STATUS_BG[status] || 'bg-surface-subtle border-border-subtle',
  };
}