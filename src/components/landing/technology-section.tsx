'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'Emergency Identity',
    description: 'A unique, scannable emergency identity with QR code and time-limited grant code.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
        <rect x="2" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="3" width="2" height="2" fill="currentColor" />
        <rect x="6" y="3" width="2" height="2" fill="currentColor" />
        <rect x="3" y="6" width="2" height="2" fill="currentColor" />
        <rect x="11" y="2" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="12" y="3" width="2" height="2" fill="currentColor" />
        <rect x="15" y="3" width="2" height="2" fill="currentColor" />
        <rect x="12" y="6" width="2" height="2" fill="currentColor" />
        <rect x="15" y="6" width="2" height="2" fill="currentColor" />
        <rect x="2" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="3" y="12" width="2" height="2" fill="currentColor" />
        <rect x="6" y="12" width="2" height="2" fill="currentColor" />
        <rect x="3" y="15" width="2" height="2" fill="currentColor" />
        <rect x="11" y="11" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="12" y="12" width="2" height="2" fill="currentColor" />
        <rect x="15" y="15" width="2" height="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Patient-Owned Consent',
    description: 'Granular permissions — choose exactly what is shared per emergency.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
        <rect x="3" y="1" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1" />
        <rect x="5" y="4" width="10" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="5" y="8" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="5" y="12" width="6" height="2" rx="1" fill="currentColor" opacity="0.3" />
        <circle cx="14" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M13 16 L14 17 L16 15" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Digital Twin',
    description: 'Each patient has a secure Digital Twin holding their health context.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
        <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1" />
        <circle cx="10" cy="6" r="1.5" fill="currentColor" />
        <path d="M5 17 C5 13 7 11 10 11 C13 11 15 13 15 17" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M14 3 L17 1 L16 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'HOLON Intelligence',
    description: 'AI-powered medical knowledge layer provides context-aware summaries.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1" />
        <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1" />
        <line x1="10" y1="2" x2="10" y2="5" stroke="currentColor" strokeWidth="0.8" />
        <line x1="10" y1="15" x2="10" y2="18" stroke="currentColor" strokeWidth="0.8" />
        <line x1="2" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="0.8" />
        <line x1="15" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="0.8" />
        <path d="M4 4 L6 6" stroke="currentColor" strokeWidth="0.8" />
        <path d="M14 14 L16 16" stroke="currentColor" strokeWidth="0.8" />
        <path d="M4 16 L6 14" stroke="currentColor" strokeWidth="0.8" />
        <path d="M14 6 L16 4" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    title: 'Access Audit',
    description: 'Every access to patient data is logged and visible to the patient.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-foreground">
        <rect x="2" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="1" />
        <rect x="4" y="7" width="12" height="1" fill="currentColor" opacity="0.3" />
        <rect x="4" y="10" width="8" height="1" fill="currentColor" opacity="0.3" />
        <rect x="4" y="13" width="6" height="1" fill="currentColor" opacity="0.3" />
        <path d="M15 12 L16 13 L18 11" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-xs text-muted font-medium tracking-widest uppercase mb-4">Features</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
            Built for emergency access, not marketing
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            Every module helps a patient control their identity or a responder integrate faster.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
          {features.map((feature, index) => (
            <motion.a
              key={feature.title}
              href="/onboarding"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
              className="block rounded-lg border border-border bg-surface p-6 hover:border-foreground/20 hover:bg-card-hover transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-lg border border-border bg-surface-inset flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
