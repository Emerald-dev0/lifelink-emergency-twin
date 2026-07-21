'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Shield, HeartPulse, Check, AlertTriangle, X, Stethoscope } from 'lucide-react';

export default function ResponderPage() {
  const [scanning, setScanning] = useState(false);
  const [grantCode, setGrantCode] = useState('');
  const [phase, setPhase] = useState<'scan' | 'connecting' | 'connected' | 'error'>('scan');
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  const handleScan = async () => {
    if (!grantCode.trim()) return;
    setPhase('connecting');
    setScanning(true);

    await new Promise((r) => setTimeout(r, 2000));

    setPatientInfo({
      name: 'Emergency Identity Found',
      identifier: grantCode,
      bloodType: 'O+',
      allergies: ['Penicillin', 'Peanuts'],
      medications: ['Warfarin', 'Metformin'],
      conditions: ['Atrial Fibrillation', 'Type 2 Diabetes'],
      emergencyContacts: [{ name: 'Jane Doe', relationship: 'Spouse', phone: '+234 800 000 0000' }],
    });

    setSummary({
      summary: 'Patient has Atrial Fibrillation managed with Warfarin and Type 2 Diabetes managed with Metformin. Known allergies to Penicillin and Peanuts.',
      alerts: ['Warfarin use — monitor INR before any surgical procedure', 'Risk of hypoglycemia — check blood glucose'],
      recommendations: ['Avoid Penicillin-class antibiotics', 'Monitor cardiac rhythm'],
    });

    setPhase('connected');
    setScanning(false);
  };

  const reset = () => {
    setPhase('scan');
    setGrantCode('');
    setPatientInfo(null);
    setSummary(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <Stethoscope className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Emergency Responder</h1>
          <p className="text-sm text-muted mt-1">Access patient emergency identity</p>
        </div>

        <AnimatePresence mode="wait">
          {phase === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center mb-6">
                <div className="w-32 h-32 rounded-3xl border-2 border-dashed border-accent/30 flex items-center justify-center mb-6">
                  <Scan className="w-12 h-12 text-accent/50" />
                </div>
                <p className="text-sm text-muted text-center mb-4">
                  Enter the patient&apos;s emergency grant code
                </p>
              </div>

              <div className="space-y-3">
                <input
                  value={grantCode}
                  onChange={(e) => setGrantCode(e.target.value)}
                  placeholder="Enter emergency code..."
                  className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-foreground text-center text-lg tracking-widest uppercase placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  onClick={handleScan}
                  disabled={!grantCode.trim() || scanning}
                  className="w-full h-12 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {scanning ? (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <>Access Emergency Identity</>
                  )}
                </button>
              </div>

              <div className="mt-6 text-center">
                <a href="/" className="text-xs text-muted hover:text-foreground transition-colors">← Not a responder?</a>
              </div>
            </motion.div>
          )}

          {phase === 'connecting' && (
            <motion.div
              key="connecting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full border-2 border-accent/30 border-t-accent animate-spin mb-6" />
              <h2 className="text-lg font-semibold mb-2">Connecting to Digital Twin</h2>
              <p className="text-sm text-muted">Validating emergency grant and retrieving patient information...</p>
            </motion.div>
          )}

          {phase === 'connected' && patientInfo && (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 space-y-4"
            >
              <div className="rounded-xl bg-success/10 border border-success/20 p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-success flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-success">Emergency Grant Validated</p>
                  <p className="text-xs text-muted">Access authorized by patient consent</p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <h3 className="text-sm font-semibold mb-3">Patient Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-sm text-muted">Blood Type</span><span className="text-sm font-medium">{patientInfo.bloodType}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted">Emergency Contact</span><span className="text-sm font-medium">{patientInfo.emergencyContacts[0].name}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-muted">Contact Phone</span><span className="text-sm font-medium">{patientInfo.emergencyContacts[0].phone}</span></div>
                </div>
              </div>

              {/* Allergies */}
              {patientInfo.allergies.length > 0 && (
                <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold text-warning">Allergies</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.allergies.map((a: string) => (
                      <span key={a} className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-xs text-warning">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HeartPulse className="w-4 h-4 text-accent" />
                  <h3 className="text-sm font-semibold">Active Medications</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {patientInfo.medications.map((m: string) => (
                    <span key={m} className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">{m}</span>
                  ))}
                </div>
              </div>

              {/* HOLON Intelligence Summary */}
              {summary && (
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <h3 className="text-sm font-semibold mb-3">HOLON Emergency Summary</h3>
                  <p className="text-sm text-muted mb-3">{summary.summary}</p>
                  {summary.alerts.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      <p className="text-xs text-muted font-medium uppercase tracking-wider">Critical Alerts</p>
                      {summary.alerts.map((a: string) => (
                        <div key={a} className="flex items-start gap-2 p-2 rounded-lg bg-danger/5 border border-danger/10">
                          <AlertTriangle className="w-3 h-3 text-danger mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-danger">{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {summary.recommendations.length > 0 && (
                    <div>
                      <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1.5">Recommendations</p>
                      {summary.recommendations.map((r: string) => (
                        <div key={r} className="flex items-start gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10">
                          <Shield className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-accent">{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={reset}
                className="w-full h-10 rounded-xl border border-white/10 text-foreground hover:bg-white/5 transition-all text-sm"
              >
                New Scan
              </button>
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-danger" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
              <p className="text-sm text-muted text-center mb-6">Invalid or expired emergency grant code.</p>
              <button onClick={reset} className="h-10 px-6 rounded-xl bg-accent text-background font-medium text-sm">Try Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
