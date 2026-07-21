'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeartPulse, Brain, Activity, Pill, Droplets, ChevronLeft, AlertTriangle, Info } from 'lucide-react';
import { getStoredUser } from '@/lib/auth';

const bodySystems = [
  { id: 'cardiovascular', name: 'Cardiovascular', icon: HeartPulse, status: 'normal' as const, color: 'text-danger' },
  { id: 'nervous', name: 'Nervous System', icon: Brain, status: 'normal' as const, color: 'text-accent' },
  { id: 'respiratory', name: 'Respiratory', icon: Activity, status: 'normal' as const, color: 'text-success' },
  { id: 'blood', name: 'Blood & Immunity', icon: Droplets, status: 'normal' as const, color: 'text-danger' },
  { id: 'medication', name: 'Medication', icon: Pill, status: 'normal' as const, color: 'text-accent' },
];

const systemDetails: Record<string, { title: string; events: string[] }> = {
  cardiovascular: {
    title: 'Cardiovascular Health',
    events: ['Blood pressure: 120/80 (Last check: 2 months ago)', 'Heart rate: 72 bpm', 'No known heart conditions'],
  },
  nervous: {
    title: 'Nervous System',
    events: ['No neurological conditions reported', 'Reflexes: Normal', 'No known disorders'],
  },
  respiratory: {
    title: 'Respiratory Health',
    events: ['Lung function: Normal', 'No chronic respiratory conditions', 'No known asthma'],
  },
  blood: {
    title: 'Blood & Immunity',
    events: ['Blood type on file', 'No known immune disorders', 'Vaccinations: Up to date'],
  },
  medication: {
    title: 'Active Medications',
    events: ['No active prescriptions reported', 'No known drug allergies on file'],
  },
};

export default function TwinPage() {
  const router = useRouter();
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) router.push('/login');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Digital Twin Health</h1>
          <p className="text-sm text-muted mb-8">Your Ontomorph Digital Twin body systems overview.</p>

          {/* Body Systems Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {bodySystems.map((system) => (
              <motion.button
                key={system.id}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedSystem(system.id === selectedSystem ? null : system.id)}
                className={`rounded-xl border p-4 text-center transition-all ${
                  selectedSystem === system.id
                    ? 'border-accent/30 bg-accent/5'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-2">
                  <system.icon className={`w-5 h-5 ${system.color}`} />
                </div>
                <p className="text-xs font-medium">{system.name}</p>
                <span className="text-[10px] text-success">Normal</span>
              </motion.button>
            ))}
          </div>

          {/* Selected System Detail */}
          {selectedSystem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-5"
            >
              <h3 className="font-semibold mb-4">{systemDetails[selectedSystem]?.title}</h3>
              <div className="space-y-2">
                {systemDetails[selectedSystem]?.events.map((event, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02]">
                    <Info className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted">{event}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Emergency Context */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 rounded-xl border border-accent/20 bg-accent/5 p-5"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Emergency Summary Ready</h3>
                <p className="text-sm text-muted">
                  In an emergency, responders will see a HOLON-powered AI summary of your health status, medications, and critical considerations.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
