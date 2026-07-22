import { config } from '@/config';

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md border border-border bg-surface flex items-center justify-center">
              <span className="text-foreground text-xs font-semibold">L</span>
            </div>
            <span className="text-sm font-medium">{config.app.name}</span>
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} {config.app.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
