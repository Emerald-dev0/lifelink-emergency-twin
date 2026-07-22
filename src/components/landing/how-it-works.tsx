'use client';

import { motion } from 'framer-motion';
import { StepsIllustration } from './steps-illustration';

const steps = [
  {
    title: 'Create your emergency identity',
    description:
      'Connect your Digital Twin and set permissions for what emergency information can be shared.',
  },
  {
    title: 'Patient-controlled consent',
    description:
      'You decide exactly what information is accessible. Your data, your rules — always.',
  },
  {
    title: 'Responder scans your identity',
    description: 'An emergency responder scans your unique QR code or enters your grant code.',
  },
  {
    title: 'Digital Twin speaks for you',
    description:
      'Your Ontomorph Digital Twin delivers critical medical context instantly to those who need it.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mb-16 max-w-2xl"
        >
          <p className="text-xs text-muted font-medium tracking-widest uppercase mb-4">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 leading-tight">
            Your voice when you need it most
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            Four steps connecting you to the care you need in an emergency.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-12 max-w-lg">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.3, ease: 'easeOut' }}
                className="flex items-start gap-6"
              >
                <span className="font-mono text-sm text-muted-foreground shrink-0 pt-0.5 w-6">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center lg:justify-end">
            <StepsIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
