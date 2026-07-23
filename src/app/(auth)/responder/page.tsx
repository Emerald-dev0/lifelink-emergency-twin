'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Scan, KeyRound, Shield, HeartPulse, Check, AlertTriangle, X, Stethoscope, Phone, Droplets, Pill, Loader2 } from 'lucide-react';
import { getHolonSummary } from '@/lib/ontomorph';

type AccessMethod = 'search' | 'qr' | 'code';

interface PatientData {
  identifier: string;
  bloodType: string;
  allergies: string[];
  medications: string[];
  conditions: string[];
  emergencyContacts: Array<{ name: string; relationship: string; phone: string; email?: string }>;
}

export default function ResponderPage() {
  const [method, setMethod] = useState<AccessMethod>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [grantCode, setGrantCode] = useState('');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [patientInfo, setPatientInfo] = useState<PatientData | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setPhase('loading');
    setErrorMsg('');

    try {
      // Step 1: Search for patient
      const searchRes = await fetch(`/api/responder/search?q=${encodeURIComponent(searchQuery)}`);
      const searchData = await searchRes.json();

      if (!searchData.success || !searchData.data.length) {
        setPhase('error');
        setErrorMsg('No patient found. Try a different name or LL-ID.');
        return;
      }

      const found = searchData.data[0];

      // Step 2: Fetch full identity via public emergency endpoint
      const idRes = await fetch(`/api/emergency/${found.identifier}`);
      const idData = await idRes.json();

      if (!idData.success) {
        setPhase('error');
        setErrorMsg('Patient identity exists but could not be retrieved.');
        return;
      }

      await loadPatient(idData.data);
    } catch {
      setPhase('error');
      setErrorMsg('Search failed. Please try again.');
    }
  };

  const handleGrantCode = async () => {
    if (!grantCode.trim()) return;
    setPhase('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/responder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grantCode: grantCode.toUpperCase() }),
      });

      const data = await res.json();

      if (!data.success) {
        setPhase('error');
        setErrorMsg(data.error || 'Invalid or expired grant code.');
        return;
      }

      const p = data.data.patient;
      await loadPatient({
        identifier: p.identifier,
        bloodType: p.bloodType,
        allergies: p.allergies || [],
        medications: p.medications || [],
        conditions: p.conditions || [],
        emergencyContacts: p.emergencyContacts || [],
      });
    } catch {
      setPhase('error');
      setErrorMsg('Failed to validate grant code.');
    }
  };

  const handleQRScan = async (identifier: string) => {
    setPhase('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/emergency/${identifier}`);
      const data = await res.json();

      if (!data.success) {
        setPhase('error');
        setErrorMsg('No patient found for this QR code.');
        return;
      }

      await loadPatient(data.data);
    } catch {
      setPhase('error');
      setErrorMsg('Failed to load patient data from QR.');
    }
  };

  const handleQRFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For demo: extract LL-ID from filename or prompt user
    // In production, this would decode the QR image
    const LLId = prompt('Enter the LL-ID from the QR code (e.g., LL-XXXX-XXXX):');
    if (LLId) {
      await handleQRScan(LLId);
    }
  };

  const loadPatient = async (pData: PatientData) => {
    setPatientInfo(pData);

    // Fetch HOLON summary
    try {
      const holon = await getHolonSummary(pData.identifier);
      setSummary(holon ?? {
        summary: pData.medications?.length
          ? `Patient is currently taking ${pData.medications.join(', ')}.`
          : 'No active medications on record.',
        alerts: pData.allergies?.length
          ? [`Known allergic reactions to ${pData.allergies.join(', ')} — avoid exposure`]
          : [],
        recommendations: pData.medications?.length
          ? [`Review ${pData.medications.join(', ')} for potential interactions before treatment`]
          : ['Standard emergency protocols apply'],
      });
    } catch {
      setSummary({
        summary: 'Unable to retrieve clinical summary.',
        alerts: pData.allergies?.length ? [`Allergies: ${pData.allergies.join(', ')}`] : [],
        recommendations: ['Standard emergency protocols apply'],
      });
    }

    setPhase('connected');
  };

  const reset = () => {
    setPhase('idle');
    setSearchQuery('');
    setGrantCode('');
    setPatientInfo(null);
    setSummary(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col app-theme">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <Stethoscope className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold">Emergency Responder</h1>
          <p className="text-sm text-muted mt-1">Access patient emergency identity</p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── IDLE: Choose Access Method ─────────────────────────── */}
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 space-y-4"
            >
              {/* Method Tabs */}
              <div className="flex gap-2 p-1 rounded-xl bg-surface-subtle border border-border-subtle">
                {[
                  { id: 'search' as const, icon: Search, label: 'Search' },
                  { id: 'qr' as const, icon: Scan, label: 'Scan QR' },
                  { id: 'code' as const, icon: KeyRound, label: 'Grant Code' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMethod(m.id); setErrorMsg(''); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      method === m.id
                        ? 'bg-accent text-background'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    <m.icon className="w-4 h-4" />
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Search Method */}
              {method === 'search' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    Search by patient name or emergency ID (LL-XXXX-XXXX)
                  </p>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g. Sarah Johnson or LL-A1B2-C3D4"
                    className="w-full h-12 px-4 rounded-xl bg-surface-subtle border border-border-subtle text-foreground placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="w-full h-12 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    Search Patient
                  </button>
                </div>
              )}

              {/* QR Method */}
              {method === 'qr' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    Scan the QR code on the patient&apos;s phone, lock screen, wallet card, or medical bracelet
                  </p>
                  <div className="w-full h-48 rounded-2xl border-2 border-dashed border-accent/30 flex flex-col items-center justify-center gap-3">
                    <Scan className="w-12 h-12 text-accent/50" />
                    <p className="text-sm text-muted">Camera QR scanner</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // In production: open camera for QR scan
                        const llId = prompt('Simulate QR scan — enter LL-ID:');
                        if (llId) handleQRScan(llId);
                      }}
                      className="flex-1 h-12 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Scan className="w-4 h-4" />
                      Scan Camera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 h-12 rounded-xl border border-border-subtle text-foreground font-medium hover:bg-surface-subtle transition-all flex items-center justify-center gap-2"
                    >
                      Upload Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleQRFile}
                    />
                  </div>
                </div>
              )}

              {/* Grant Code Method */}
              {method === 'code' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    Enter the emergency grant code provided by the patient or found on their documentation
                  </p>
                  <input
                    value={grantCode}
                    onChange={(e) => setGrantCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGrantCode()}
                    placeholder="Enter emergency code..."
                    className="w-full h-12 px-4 rounded-xl bg-surface-subtle border border-border-subtle text-foreground text-center text-lg tracking-widest uppercase placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button
                    onClick={handleGrantCode}
                    disabled={!grantCode.trim()}
                    className="w-full h-12 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    Validate Grant Code
                  </button>
                </div>
              )}

              {/* Error */}
              {errorMsg && (
                <div className="rounded-xl bg-danger/5 border border-danger/10 p-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
                  <p className="text-sm text-danger">{errorMsg}</p>
                </div>
              )}

              <div className="pt-4 text-center">
                <a href="/" className="text-xs text-muted hover:text-foreground transition-colors">← Not a responder?</a>
              </div>
            </motion.div>
          )}

          {/* ── LOADING ──────────────────────────────────────────── */}
          {phase === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <Loader2 className="w-8 h-8 text-accent animate-spin mb-6" />
              <h2 className="text-lg font-semibold mb-2">Accessing Emergency Identity</h2>
              <p className="text-sm text-muted text-center">Validating credentials and retrieving patient data...</p>
            </motion.div>
          )}

          {/* ── CONNECTED: Patient Data ──────────────────────────── */}
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
                  <p className="text-sm font-medium text-success">Emergency Identity Accessed</p>
                  <p className="text-xs text-muted">{patientInfo.identifier} — Access logged</p>
                </div>
              </div>

              {/* Blood Type */}
              <div className="rounded-xl border-2 border-danger/20 bg-danger/5 p-4 text-center">
                <Droplets className="w-6 h-6 text-danger mx-auto mb-1" />
                <p className="text-xs text-muted uppercase tracking-wider">Blood Type</p>
                <p className="text-3xl font-black text-danger">{patientInfo.bloodType}</p>
              </div>

              {/* Allergies */}
              {patientInfo.allergies.length > 0 && (
                <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <h3 className="text-sm font-semibold text-warning">Allergies</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.allergies.map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-xs font-bold text-warning">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {patientInfo.medications.length > 0 && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold">Active Medications</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.medications.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions */}
              {patientInfo.conditions.length > 0 && (
                <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold">Medical Conditions</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.conditions.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-xs">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Contacts */}
              {patientInfo.emergencyContacts.length > 0 && (
                <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold">Emergency Contacts</h3>
                  </div>
                  <div className="space-y-2">
                    {patientInfo.emergencyContacts.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border-subtle">
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted">{c.relationship}</p>
                        </div>
                        <a href={`tel:${c.phone}`} className="text-xs text-accent font-medium">{c.phone}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HOLON Summary */}
              {summary && (
                <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
                  <h3 className="text-sm font-semibold mb-3">HOLON Emergency Summary</h3>
                  <p className="text-sm text-muted mb-3">{summary.summary}</p>
                  {summary.alerts?.length > 0 && (
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
                  {summary.recommendations?.length > 0 && (
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
                className="w-full h-10 rounded-xl border border-border-subtle text-foreground hover:bg-surface-subtle transition-all text-sm"
              >
                New Lookup
              </button>
            </motion.div>
          )}

          {/* ── ERROR ────────────────────────────────────────────── */}
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
              <h2 className="text-lg font-semibold mb-2">Access Failed</h2>
              <p className="text-sm text-muted text-center mb-6">{errorMsg || 'Could not retrieve patient data.'}</p>
              <button onClick={reset} className="h-10 px-6 rounded-xl bg-accent text-background font-medium text-sm">Try Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
