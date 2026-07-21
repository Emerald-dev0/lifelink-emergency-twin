'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Heart, Activity, Pill } from 'lucide-react';

const problems = [
  {
    icon: AlertTriangle,
    title: 'Unconscious & Unreachable',
    description: 'In emergencies, patients often cannot communicate allergies, medications, or critical conditions to responders.',
  },
  {
    icon: Heart,
    title: 'Unknown Medical History',
    description: 'Heart conditions, diabetes, and other pre-existing conditions remain hidden when they matter most.',
  },
  {
    icon: Activity,
    title: 'Delayed Critical Care',
    description: 'Every minute spent searching for medical information reduces survival chances in time-sensitive emergencies.',
  },
  {
    icon: Pill,
    title: 'Medication Conflicts',
    description: 'Without knowledge of current medications, responders risk administering drugs that cause dangerous interactions.',
  },
];

export function ProblemSection() {
  return (
    <section className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs text-muted font-medium tracking-widest uppercase mb-4 block">The Problem</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your medical information is not accessible
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            When an emergency strikes, every second counts. But critical health data is locked away in systems you cannot access.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
                <problem.icon className="w-5 h-5 text-danger" />
              </div>
              <h3 className="text-base font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{problem.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
