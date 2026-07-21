import { config } from '@/config';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center">
              <span className="text-accent text-xs font-bold">L</span>
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
