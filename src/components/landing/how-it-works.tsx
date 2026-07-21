'use client';

import { motion } from 'framer-motion';
import { UserPlus, Scan, Shield, HeartPulse } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Your Emergency Identity',
    description: 'Connect your Digital Twin and set permissions for what emergency information can be shared.',
    gradient: 'from-accent/20 to-transparent',
  },
  {
    icon: Shield,
    title: 'Patient-Controlled Consent',
    description: 'You decide exactly what information is accessible. Your data, your rules. Always.',
    gradient: 'from-accent/20 to-transparent',
  },
  {
    icon: Scan,
    title: 'Responder Scans Your Identity',
    description: 'An emergency responder scans your unique emergency QR code to request access.',
    gradient: 'from-accent/20 to-transparent',
  },
  {
    icon: HeartPulse,
    title: 'Digital Twin Speaks for You',
    description: 'Your Ontomorph Digital Twin delivers critical medical context instantly to those who need it.',
    gradient: 'from-accent/20 to-transparent',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs text-muted font-medium tracking-widest uppercase mb-4 block">How It Works</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Your voice when you need it most
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Four simple steps connecting you to the care you need in an emergency.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/40 via-accent/10 to-transparent hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex items-start gap-6 md:gap-8"
              >
                <div className="relative z-10 flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center">
                  <step.icon className="w-7 h-7 text-accent" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-accent/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                </div>
                <div className="pt-3">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted max-w-lg">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
