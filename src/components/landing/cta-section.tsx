'use client';

import { motion } from 'framer-motion';

export function CTASection() {
  return (
    <section className="py-24 md:py-32 border-t border-border relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--foreground)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-lg border border-border bg-surface p-12 md:p-16"
        >
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight max-w-lg">
            Create your emergency identity
          </h2>
          <p className="text-lg text-muted max-w-lg mb-8 leading-relaxed">
            Set it up once. Carry a QR code. Know that responders can reach your critical facts when you
            cannot speak.
          </p>
          <a
            href="/onboarding"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-foreground px-8 text-base font-medium text-background hover:opacity-90 transition-opacity duration-200"
          >
            Get started
          </a>
        </motion.div>
      </div>
    </section>
  );
}
