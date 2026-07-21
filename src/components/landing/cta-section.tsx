'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-12 md:p-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your Digital Twin is ready.
          </h2>
          <p className="text-lg text-muted max-w-lg mx-auto mb-8">
            Create your emergency identity in minutes. It could save your life.
          </p>
          <a
            href="/onboarding"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-base font-medium text-background hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]"
          >
            Get Started Now
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
