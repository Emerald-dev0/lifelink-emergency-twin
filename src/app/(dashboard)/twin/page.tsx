'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeartPulse, Brain, Activity, Pill, Droplets, AlertTriangle, Info, Fingerprint, User } from 'lucide-react';
import { getStoredUser, getAuthHeaders } from '@/lib/auth';
import type { OntomorphTwin } from '@/lib/ontomorph';
import { PageLoader } from '@/components/ui/loader';
import { EmptyState } from '@/components/ui/empty-state';

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
  const [twin, setTwin] = useState<OntomorphTwin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.push('/login'); return; }
    fetchTwin();
  }, []);

  const fetchTwin = async () => {
    try {
      const res = await fetch('/api/ontomorph/twin', { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) setTwin(data.data);
      else setError(data.error || 'Failed to load twin');
    } catch {
      setError('Failed to load twin data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-2">Digital Twin</h1>
        <EmptyState
          icon={<Fingerprint className="w-12 h-12" />}
          title="No twin connected"
          description={error}
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="text-2xl font-bold mb-2">Digital Twin Health</h1>
      <p className="text-sm text-muted mb-8">Your Ontomorph Digital Twin body systems overview.</p>

      {twin && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 mb-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-accent" />
          </div>
          <div className="text-sm">
            <p className="font-medium">{twin.displayName}</p>
            <p className="text-muted text-xs">DID: {twin.did?.slice(0, 20)}&hellip;</p>
          </div>
        </div>
      )}

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
                : 'border-border-subtle bg-surface-subtle hover:bg-surface-inset'
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-center mb-2">
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
          className="rounded-xl border border-border-subtle bg-surface-subtle p-5"
        >
          <h3 className="font-semibold mb-4">{systemDetails[selectedSystem]?.title}</h3>
          <div className="space-y-2">
            {systemDetails[selectedSystem]?.events.map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-subtle">
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
  );
}
