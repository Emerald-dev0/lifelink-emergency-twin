'use client';

import { motion } from 'framer-motion';
import { SecurityIllustration } from './security-illustration';

const constraints = [
  {
    title: 'No persistent access',
    description: 'Emergency grants expire automatically. Responders hold a token, never the data.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <path d="M8 2 L13 5 L13 9 C13 11.5 10.5 13.5 8 14 C5.5 13.5 3 11.5 3 9 L3 5 Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Every access is logged',
    description: 'Who accessed what, when, and under which grant — visible to the patient at all times.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1" />
        <line x1="4" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="0.8" />
        <line x1="4" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="0.8" />
        <line x1="4" y1="12" x2="7" y2="12" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    title: 'You control the grant',
    description: 'The patient owns the grant. Revoke it at any time. No one accesses data without consent.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <path d="M4 7 L4 5 C4 2.5 6 1 8 1 C10 1 12 2.5 12 5 L12 7" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
        <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1" />
        <circle cx="8" cy="11" r="1.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="8" y1="12.5" x2="8" y2="13.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Granular permissions',
    description:
      'Choose exactly what is shared — from blood type and allergies to full medical history.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
        <line x1="7" y1="4.5" x2="9" y2="4.5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="4.5" y1="7" x2="4.5" y2="9" stroke="currentColor" strokeWidth="0.8" />
        <line x1="11.5" y1="7" x2="11.5" y2="9" stroke="currentColor" strokeWidth="0.8" />
        <line x1="7" y1="11.5" x2="9" y2="11.5" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-xs text-muted font-medium tracking-widest uppercase mb-4">Trust</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
            What LIFELINK will not let anyone do
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            Trust is built through constraints, not slogans. These are the rules the system enforces.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="max-w-lg space-y-0 divide-y divide-border order-2 lg:order-1">
            {constraints.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
                className="py-8 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center lg:justify-start order-1 lg:order-2">
            <SecurityIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
