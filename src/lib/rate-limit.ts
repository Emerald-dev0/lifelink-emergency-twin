const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(options: { maxRequests: number; windowMs: number }) {
  return {
    check: (key: string): { allowed: boolean; remaining: number; resetIn: number } => {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + options.windowMs });
        return { allowed: true, remaining: options.maxRequests - 1, resetIn: options.windowMs };
      }

      if (entry.count >= options.maxRequests) {
        return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
      }

      entry.count++;
      return { allowed: true, remaining: options.maxRequests - entry.count, resetIn: entry.resetAt - now };
    },
    reset: (key: string) => store.delete(key),
  };
}

export const apiLimiter = rateLimit({ maxRequests: 100, windowMs: 60_000 });
export const authLimiter = rateLimit({ maxRequests: 10, windowMs: 60_000 });