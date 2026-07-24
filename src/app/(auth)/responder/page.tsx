'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Scan, KeyRound, Shield, HeartPulse, Check, AlertTriangle, X, Stethoscope, Phone, Droplets, Pill, Loader2, Camera, Keyboard } from 'lucide-react';
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
  const [llIdInput, setLlIdInput] = useState('');
  const [phase, setPhase] = useState<'idle' | 'loading' | 'connected' | 'error' | 'scanning'>('idle');
  const [patientInfo, setPatientInfo] = useState<PatientData | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef<any>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        try { scannerRef.current.stop(); } catch {}
        try { scannerRef.current.clear(); } catch {}
      }
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setPhase('loading');
    setErrorMsg('');

    try {
      const searchRes = await fetch(`/api/responder/search?q=${encodeURIComponent(searchQuery)}`);
      const searchData = await searchRes.json();

      if (!searchData.success || !searchData.data.length) {
        setPhase('error');
        setErrorMsg('No patient found. Try a different name or LL-ID.');
        return;
      }

      const found = searchData.data[0];
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

  const handleLlIdLookup = async () => {
    if (!llIdInput.trim()) return;
    setPhase('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/emergency/${llIdInput.trim().toUpperCase()}`);
      const data = await res.json();

      if (!data.success) {
        setPhase('error');
        setErrorMsg('No patient found for this LL-ID.');
        return;
      }

      await loadPatient(data.data);
    } catch {
      setPhase('error');
      setErrorMsg('Failed to look up LL-ID.');
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

  const startCameraScanner = async () => {
    setPhase('scanning');
    setErrorMsg('');

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      // Wait for DOM element
      await new Promise(r => setTimeout(r, 100));

      const scannerId = 'qr-reader';
      const el = document.getElementById(scannerId);
      if (!el) {
        setPhase('error');
        setErrorMsg('Camera element not found.');
        return;
      }

      const scanner = new Html5Qrcode(scannerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        async (decodedText) => {
          // Stop scanner on success
          try { await scanner.stop(); } catch {}
          try { scanner.clear(); } catch {}
          scannerRef.current = null;

          // Extract LL-ID from URL or use raw text
          let llId = decodedText;
          const urlMatch = decodedText.match(/\/emergency\/([A-Z0-9-]+)/i);
          if (urlMatch) llId = urlMatch[1];

          // Validate LL-ID format
          if (!llId.match(/^LL-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
            setPhase('error');
            setErrorMsg(`Scanned code is not a valid LIFELINK ID: ${decodedText}`);
            return;
          }

          setPhase('loading');
          try {
            const res = await fetch(`/api/emergency/${llId}`);
            const data = await res.json();
            if (!data.success) {
              setPhase('error');
              setErrorMsg('No patient found for this QR code.');
              return;
            }
            await loadPatient(data.data);
          } catch {
            setPhase('error');
            setErrorMsg('Failed to load patient from QR code.');
          }
        },
        () => {} // Ignore scan failures
      );
    } catch (err: any) {
      console.error('Camera error:', err);
      setPhase('idle');
      setErrorMsg(
        err?.message?.includes('Permission')
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Could not start camera. Try entering the LL-ID manually below.'
      );
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      try { scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setPhase('idle');
  };

  const loadPatient = async (pData: PatientData) => {
    setPatientInfo(pData);

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
    if (scannerRef.current) {
      try { scannerRef.current.stop(); } catch {}
      try { scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
    }
    setPhase('idle');
    setSearchQuery('');
    setGrantCode('');
    setLlIdInput('');
    setPatientInfo(null);
    setSummary(null);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground/5 border border-border mb-4">
            <Stethoscope className="w-6 h-6 text-foreground" />
          </div>
          <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-foreground/5 border border-border mb-3">
            Emergency Personnel Only
          </div>
          <h1 className="text-2xl font-bold">Responder Portal</h1>
          <p className="text-sm text-muted mt-1">For EMTs, paramedics, nurses, and first responders</p>
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
              <div className="flex gap-2 p-1 rounded-xl bg-surface border border-border">
                {[
                  { id: 'search' as const, icon: Search, label: 'Search' },
                  { id: 'qr' as const, icon: Camera, label: 'Scan QR' },
                  { id: 'code' as const, icon: KeyRound, label: 'Grant Code' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMethod(m.id); setErrorMsg(''); }}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      method === m.id
                        ? 'bg-foreground text-background'
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
                    placeholder="e.g. Sarah Johnson"
                    className="w-full h-12 px-4 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                    className="w-full h-12 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                    Scan the QR code on the patient&apos;s phone, wallet card, or car sticker
                  </p>
                  <button
                    onClick={startCameraScanner}
                    className="w-full h-14 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera to Scan
                  </button>
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted">or enter manually</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={llIdInput}
                      onChange={(e) => setLlIdInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLlIdLookup()}
                      placeholder="LL-XXXX-XXXX"
                      className="flex-1 h-12 px-4 rounded-xl bg-surface border border-border text-foreground font-mono text-center tracking-wider placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                    />
                    <button
                      onClick={handleLlIdLookup}
                      disabled={!llIdInput.trim()}
                      className="h-12 px-4 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Keyboard className="w-4 h-4" />
                      Look Up
                    </button>
                  </div>
                </div>
              )}

              {/* Grant Code Method */}
              {method === 'code' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted">
                    Enter the emergency grant code provided by the patient
                  </p>
                  <input
                    value={grantCode}
                    onChange={(e) => setGrantCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGrantCode()}
                    placeholder="GC-XXXX-XXXX"
                    className="w-full h-12 px-4 rounded-xl bg-surface border border-border text-foreground text-center text-lg tracking-widest uppercase placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <button
                    onClick={handleGrantCode}
                    disabled={!grantCode.trim()}
                    className="w-full h-12 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    Validate Grant Code
                  </button>
                </div>
              )}

              {/* Error */}
              {errorMsg && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-6 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-600">{errorMsg}</p>
                </div>
              )}

              <div className="pt-4 text-center">
                <a href="/" className="text-xs text-muted hover:text-foreground transition-colors">← Not a responder?</a>
              </div>
            </motion.div>
          )}

          {/* ── SCANNING: Camera QR Scanner ───────────────────────── */}
          {phase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-4">
                <button
                  onClick={stopScanner}
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  ← Cancel scan
                </button>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div id="qr-reader" ref={scannerContainerRef} className="w-full rounded-xl overflow-hidden" />
                <p className="text-sm text-muted mt-4 text-center">Point camera at QR code on phone, wallet card, or car sticker</p>
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
              <Loader2 className="w-8 h-8 text-foreground animate-spin mb-6" />
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
              <div className="rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-600">Emergency Identity Accessed</p>
                  <p className="text-xs text-muted">{patientInfo.identifier} — Access logged</p>
                </div>
              </div>

              {/* Blood Type */}
              <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center">
                <Droplets className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-muted uppercase tracking-wider">Blood Type</p>
                <p className="text-3xl font-black text-red-600">{patientInfo.bloodType}</p>
              </div>

              {/* Allergies */}
              {patientInfo.allergies.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-amber-600">Allergies</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.allergies.map((a) => (
                      <span key={a} className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-xs font-bold text-amber-700">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Medications */}
              {patientInfo.medications.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold">Active Medications</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.medications.map((m) => (
                      <span key={m} className="px-2 py-0.5 rounded-full bg-surface border border-border text-xs">{m}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Conditions */}
              {patientInfo.conditions.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HeartPulse className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold">Medical Conditions</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {patientInfo.conditions.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-surface border border-border text-xs">{c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Emergency Contacts */}
              {patientInfo.emergencyContacts.length > 0 && (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-foreground" />
                    <h3 className="text-sm font-semibold">Emergency Contacts</h3>
                  </div>
                  <div className="space-y-2">
                    {patientInfo.emergencyContacts.map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                        <div>
                          <p className="text-sm font-medium">{c.name}</p>
                          <p className="text-xs text-muted">{c.relationship}</p>
                        </div>
                        <a href={`tel:${c.phone}`} className="text-xs text-foreground font-medium underline">{c.phone}</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HOLON Summary */}
              {summary && (
                <div className="rounded-xl border border-border bg-surface p-4">
                  <h3 className="text-sm font-semibold mb-3">Clinical Summary</h3>
                  <p className="text-sm text-muted mb-3">{summary.summary}</p>
                  {summary.alerts?.length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      <p className="text-xs text-muted font-medium uppercase tracking-wider">Critical Alerts</p>
                      {summary.alerts.map((a: string) => (
                        <div key={a} className="flex items-start gap-2 p-2 rounded-lg bg-red-50 border border-red-100">
                          <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-red-600">{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {summary.recommendations?.length > 0 && (
                    <div>
                      <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1.5">Recommendations</p>
                      {summary.recommendations.map((r: string) => (
                        <div key={r} className="flex items-start gap-2 p-2 rounded-lg bg-surface border border-border">
                          <Shield className="w-3 h-3 text-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-xs">{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={reset}
                className="w-full h-10 rounded-xl border border-border text-foreground hover:bg-surface transition-all text-sm font-medium"
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
              <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Access Failed</h2>
              <p className="text-sm text-muted text-center mb-6">{errorMsg || 'Could not retrieve patient data.'}</p>
              <button onClick={reset} className="h-10 px-6 rounded-xl bg-foreground text-background font-medium text-sm">Try Again</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
