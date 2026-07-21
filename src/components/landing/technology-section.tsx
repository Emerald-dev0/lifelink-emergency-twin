'use client';

import { motion } from 'framer-motion';
import { Cpu, Network, Brain, Lock } from 'lucide-react';

const techFeatures = [
  {
    icon: Cpu,
    title: 'Ontomorph Digital Twins',
    description: 'Your body has a secure digital replica that understands your health context and can communicate it in emergencies.',
  },
  {
    icon: Network,
    title: 'Real-time Twin Synchronization',
    description: 'Health events, medications, and conditions are continuously synchronized with your Digital Twin.',
  },
  {
    icon: Brain,
    title: 'HOLON Intelligence',
    description: 'AI-powered medical knowledge layer that provides context-aware emergency summaries to responders.',
  },
  {
    icon: Lock,
    title: 'End-to-End Consent Control',
    description: 'Granular permissions determine exactly what information is shared and for how long during an emergency.',
  },
];

export function TechnologySection() {
  return (
    <section id="technology" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs text-muted font-medium tracking-widest uppercase mb-4 block">Technology</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Powered by Digital Twin Intelligence
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Built on Ontomorph and HOLON — the future of patient-owned emergency health data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {techFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-accent/20 hover:bg-white/[0.04] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-all">
                <feature.icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
