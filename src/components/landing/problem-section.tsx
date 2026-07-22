'use client';

import { motion } from 'framer-motion';

const problems = [
  {
    title: 'Allergies',
    description:
      'Penicillin, latex, iodine — unknown triggers can turn standard treatment into a critical reaction.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1" />
        <line x1="8" y1="4" x2="8" y2="9" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Medications',
    description:
      'Blood thinners, insulin, beta-blockers change emergency protocols when responders cannot see them.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <rect x="5" y="1" width="6" height="14" rx="2" stroke="currentColor" strokeWidth="1" />
        <line x1="6" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="0.8" />
        <line x1="6" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    title: 'Blood type',
    description:
      'Unknown until tested. Every minute searching costs time that matters in trauma and hemorrhage.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <path d="M8 2 C8 2 3 8 3 11 C3 13.5 5 15 8 15 C11 15 13 13.5 13 11 C13 8 8 2 8 2Z" stroke="currentColor" strokeWidth="1" fill="none" />
        <line x1="8" y1="8" x2="8" y2="12" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="6" y1="10" x2="10" y2="10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Pre-existing conditions',
    description:
      'Heart disease, diabetes, epilepsy — conditions that change how care must be delivered, hidden by default.',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <path d="M2 9 L5 9 L6 6 L7 12 L8 5 L9 10 L10 8 L14 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="2" cy="9" r="0.5" fill="currentColor" />
        <circle cx="14" cy="8" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'Emergency contacts',
    description:
      "Family who know the patient's history are unreachable when records are siloed across systems.",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-foreground shrink-0">
        <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1" />
        <path d="M3 14 C3 10.5 5 9 8 9 C11 9 13 10.5 13 14" stroke="currentColor" strokeWidth="1" fill="none" />
      </svg>
    ),
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-xs text-muted font-medium tracking-widest uppercase mb-4">The problem</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
            Your medical information is not accessible when it matters
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            When an emergency strikes, critical health data is locked in hospital databases, paper cards,
            or nowhere at all.
          </p>
        </motion.div>

        <ul className="space-y-0 divide-y divide-border max-w-3xl">
          {problems.map((problem, index) => (
            <motion.li
              key={problem.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: 'easeOut' }}
              className="py-8 first:pt-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg border border-border bg-surface flex items-center justify-center shrink-0 mt-0.5">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{problem.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{problem.description}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
