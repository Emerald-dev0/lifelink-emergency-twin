'use client';

import { useRouter, usePathname } from 'next/navigation';
import { removeToken, getStoredUser } from '@/lib/auth';
import { LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo, LogoIcon } from '@/components/ui/logo';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Identity', href: '/identity' },
  { label: 'Digital Twin', href: '/twin' },
  { label: 'Timeline', href: '/timeline' },
  { label: 'Access', href: '/access' },
];

export function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();

  const user = getStoredUser();

  const handleLogout = () => {
    removeToken();
    document.cookie = 'lifelink_token=; path=/; max-age=0';
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <a href="/dashboard" className="flex items-center gap-2 shrink-0">
              <LogoIcon />
              <span className="text-sm font-semibold tracking-tight hidden sm:inline">LIFELINK</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:text-foreground hover:bg-surface-subtle'
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <span className="text-xs text-muted hidden sm:block">{user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-muted hover:text-foreground hover:bg-surface-subtle transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
