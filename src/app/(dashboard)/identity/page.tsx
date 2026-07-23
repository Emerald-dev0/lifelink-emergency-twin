'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { HeartPulse, Download, Share2, Shield, AlertTriangle, Droplets, Pill, Clock, Smartphone, Lock, ExternalLink } from 'lucide-react';
import { getStoredUser, getAuthHeaders } from '@/lib/auth';
import { PageLoader } from '@/components/ui/loader';

export default function IdentityPage() {
  const router = useRouter();
  const qrRef = useRef<HTMLDivElement>(null);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.push('/login'); return; }
    fetchIdentity();

    // PWA install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const fetchIdentity = async () => {
    try {
      const res = await fetch('/api/identity', { headers: getAuthHeaders() });
      const data = await res.json();
      setIdentity(data.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstall(false);
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([xml], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lifelink-emergency-id.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({
        title: 'LIFELINK Emergency Identity',
        text: `Emergency Identity: ${identity?.identifier || 'Unknown'}`,
        url: window.location.href,
      });
    } catch {
      /* user cancelled */
    }
  };

  const emergencyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/emergency/${identity?.identifier || ''}`
    : '';

  if (loading) {
    return <PageLoader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold mb-2">Emergency Identity</h1>
      <p className="text-sm text-muted mb-6">
        Your emergency ID. Responders scan the QR to access your critical medical information — even when your phone is locked.
      </p>

      {/* Emergency Card */}
      <div className="rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/5 to-transparent p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold">LIFELINK</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-success/10 border border-success/20">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success font-medium uppercase tracking-wider">Active</span>
          </div>
        </div>

        {/* QR Code — Large */}
        <div className="flex justify-center mb-4" ref={qrRef}>
          <div className="p-4 bg-surface rounded-2xl">
            {identity?.identifier ? (
              <QRCodeSVG
                value={emergencyUrl}
                size={240}
                level="H"
                fgColor="#050505"
                imageSettings={{
                  src: '/icons/lifelink-logo.svg',
                  height: 36,
                  width: 36,
                  excavate: true,
                }}
              />
            ) : (
              <div className="w-[240px] h-[240px] bg-surface-subtle rounded-xl flex items-center justify-center">
                <p className="text-xs text-muted">No ID</p>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-muted mb-2">
          Scan to access emergency medical information
        </p>
        <p className="text-center text-[10px] text-accent font-mono mb-4">
          {identity?.identifier}
        </p>

        {/* Medical Info */}
        <div className="space-y-2">
          {identity?.bloodType && (
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-subtle">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-danger" />
                <span className="text-sm text-muted">Blood Type</span>
              </div>
              <span className="text-sm font-semibold">{identity.bloodType}</span>
            </div>
          )}

          {identity?.allergies?.length > 0 && (
            <div className="p-2.5 rounded-lg bg-surface-subtle">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm text-muted">Allergies</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {identity.allergies.map((a: string) => (
                  <span key={a} className="px-2 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-xs text-warning">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {identity?.medications?.length > 0 && (
            <div className="p-2.5 rounded-lg bg-surface-subtle">
              <div className="flex items-center gap-2 mb-1.5">
                <Pill className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted">Medications</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {identity.medications.map((m: string) => (
                  <span key={m} className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {identity?.conditions?.length > 0 && (
            <div className="p-2.5 rounded-lg bg-surface-subtle">
              <div className="flex items-center gap-2 mb-1.5">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted">Conditions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {identity.conditions.map((c: string) => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-xs text-muted">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {identity?.lastSynced && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <Clock className="w-3 h-3 text-muted" />
            <span className="text-xs text-muted">Last synced {new Date(identity.lastSynced).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 mb-6">
        {/* Add to Home Screen */}
        {canInstall && (
          <button
            onClick={handleInstall}
            className="w-full h-12 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Add Emergency Card to Home Screen
          </button>
        )}

        {/* Open Emergency Card (direct link) */}
        <a
          href={`/emergency-card/${identity?.identifier}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-xl border border-accent/30 text-accent font-medium hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Open Emergency Card (Lock Screen View)
        </a>

        {/* Download + Share */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 h-10 rounded-xl border border-border-subtle text-foreground hover:bg-surface-subtle transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" /> Download QR
          </button>
          <button
            onClick={handleShare}
            className="flex-1 h-10 rounded-xl border border-border-subtle text-foreground hover:bg-surface-subtle transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-xl border border-border-subtle bg-surface-subtle p-4">
        <h3 className="text-sm font-semibold mb-3">How to Use</h3>
        <div className="space-y-3 text-sm text-muted">
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            <p><strong className="text-foreground">Set as lock screen:</strong> Download the QR image → set as phone wallpaper. EMS can scan without unlocking.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            <p><strong className="text-foreground">Print wallet card:</strong> Download QR → print on card stock → keep in wallet.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            <p><strong className="text-foreground">Install PWA:</strong> Add to home screen for one-tap access to your emergency card.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
