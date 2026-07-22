'use client';

import { motion } from 'framer-motion';
import { HeroIllustration } from './hero-illustration';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          <div className="max-w-xl">
            <p className="text-xs text-muted font-medium tracking-widest uppercase mb-6">
              Emergency health identity platform
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6">
              When you cannot speak for yourself, your Digital Twin speaks.
            </h1>

            <p className="max-w-xl text-lg text-muted leading-relaxed mb-10">
              A patient-owned emergency identity. Responders scan a grant code and receive
              only the information you have authorized — instantly, time-limited, and logged.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="/onboarding"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-foreground px-8 text-base font-medium text-background hover:opacity-90 transition-opacity duration-200"
              >
                Create your emergency identity
              </a>
              <a
                href="/responder"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-foreground bg-transparent px-8 text-base font-medium text-foreground hover:bg-surface transition-colors duration-200"
              >
                I&apos;m a responder — scan a code
              </a>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
