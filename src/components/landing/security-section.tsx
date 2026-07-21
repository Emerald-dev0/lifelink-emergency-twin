'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Clock, UserCheck } from 'lucide-react';

export function SecuritySection() {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Patient-Owned Data',
      description: 'You control your Digital Twin. No one accesses your data without your consent.',
    },
    {
      icon: Eye,
      title: 'Complete Access Log',
      description: 'Every access to your emergency identity is recorded and visible to you.',
    },
    {
      icon: Clock,
      title: 'Time-Limited Grants',
      description: 'Emergency access grants expire automatically. No persistent access.',
    },
    {
      icon: UserCheck,
      title: 'Granular Permissions',
      description: 'Choose exactly what information is shared — from basic vitals to full medical history.',
    },
  ];

  return (
    <section id="security" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs text-muted font-medium tracking-widest uppercase mb-4 block">Security & Consent</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your data stays yours
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Every security measure is designed around one principle: you control who knows your medical information.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 rounded-3xl" />
          <div className="relative grid sm:grid-cols-2 gap-4 p-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/[0.02] transition-all"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
