'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { config } from '@/config';

const navLinks = [
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
  { label: 'Security', href: '#security' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
              <span className="text-accent text-sm font-bold">L</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">{config.app.name}</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-3">
              <a
                href="/login"
                className="text-sm text-muted hover:text-foreground transition-colors px-3 py-2"
              >
                Sign In
              </a>
              <a
                href="/onboarding"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-accent px-4 text-sm font-medium text-background hover:bg-accent/90 transition-all"
              >
                Get Started
              </a>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div className="w-5 h-0.5 bg-foreground mb-1" />
            <div className="w-5 h-0.5 bg-foreground mb-1" />
            <div className="w-5 h-0.5 bg-foreground" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-muted hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <a href="/login" className="block text-sm text-muted hover:text-foreground transition-colors py-2">Sign In</a>
                <a href="/onboarding" className="block w-full text-center h-10 leading-10 rounded-xl bg-accent text-sm font-medium text-background">Get Started</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
