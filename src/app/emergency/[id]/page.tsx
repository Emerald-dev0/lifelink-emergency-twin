'use client';

import { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, AlertTriangle, Phone, Shield, Pill, Droplets, Activity, Loader2 } from 'lucide-react';

interface PatientData {
  identifier: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{ name: string; relationship: string; phone: string }>;
  conditionsList: string[];
}

export default function EmergencyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/emergency/${id}`);
        const data = await res.json();
        if (data.success) {
          setPatient(data.data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted">Loading emergency identity...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          <h1 className="text-xl font-bold mb-2">Identity Not Found</h1>
          <p className="text-sm text-muted">No emergency identity matches this code. The patient may not have a LIFELINK account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Critical Banner */}
      <div className="bg-danger text-white px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm font-bold uppercase tracking-wider">Emergency Medical Information</span>
          <AlertTriangle className="w-4 h-4" />
        </div>
        <p className="text-xs mt-1 opacity-80">Presented by LIFELINK Digital Twin — Verify with patient&apos;s ID</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Blood Type - PROMINENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border-2 border-danger/30 bg-danger/5 p-6 text-center"
        >
          <Droplets className="w-8 h-8 text-danger mx-auto mb-2" />
          <p className="text-xs text-muted uppercase tracking-wider mb-1">Blood Type</p>
          <p className="text-4xl font-black text-danger">{patient.bloodType}</p>
        </motion.div>

        {/* Allergies - CRITICAL WARNING */}
        {patient.allergies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border-2 border-warning/30 bg-warning/5 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h2 className="text-sm font-bold text-warning uppercase tracking-wider">Allergies — DO NOT ADMINISTER</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((a) => (
                <span key={a} className="px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-sm font-bold text-warning">
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Medications */}
        {patient.medications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border-subtle bg-surface-subtle p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-semibold">Active Medications</h2>
            </div>
            <div className="space-y-2">
              {patient.medications.map((m) => (
                <div key={m} className="flex items-start gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10">
                  <Activity className="w-3 h-3 text-accent mt-1 flex-shrink-0" />
                  <span className="text-sm">{m}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Conditions */}
        {patient.conditions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-border-subtle bg-surface-subtle p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <HeartPulse className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-semibold">Medical Conditions</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.conditions.map((c) => (
                <span key={c} className="px-3 py-1 rounded-full bg-surface-subtle border border-border-subtle text-sm">
                  {c}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Emergency Contacts */}
        {patient.emergencyContacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-border-subtle bg-surface-subtle p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-semibold">Emergency Contacts</h2>
            </div>
            <div className="space-y-3">
              {patient.emergencyContacts.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border-subtle">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted">{c.relationship}</p>
                  </div>
                  <a
                    href={`tel:${c.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium"
                  >
                    <Phone className="w-3 h-3" />
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-1.5 text-muted">
            <Shield className="w-3 h-3" />
            <span className="text-xs">LIFELINK Emergency Identity — All access logged</span>
          </div>
          <p className="text-xs text-muted/50 mt-1">{patient.identifier}</p>
        </div>
      </div>
    </div>
  );
}
