'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { HeartPulse, Download, Share2, Shield, AlertTriangle, Droplets, Pill, Clock, ChevronLeft } from 'lucide-react';
import { getStoredUser, getAuthHeaders } from '@/lib/auth';

export default function IdentityPage() {
  const router = useRouter();
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.push('/login'); return; }
    fetchIdentity();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-2">Emergency Identity</h1>
          <p className="text-sm text-muted mb-6">
            Your emergency ID card. Responders can scan the QR code to access your critical medical information.
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

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white rounded-2xl">
                {identity?.identifier ? (
                  <QRCodeSVG
                    value={JSON.stringify({ id: identity.identifier, type: 'lifelink_emergency' })}
                    size={180}
                    level="H"
                    fgColor="#050505"
                  />
                ) : (
                  <div className="w-[180px] h-[180px] bg-white/5 rounded-xl flex items-center justify-center">
                    <p className="text-xs text-muted">No ID</p>
                  </div>
                )}
              </div>
            </div>

            <p className="text-center text-xs text-muted mb-4">
              Scan to access emergency medical information
            </p>

            {/* Medical Info */}
            <div className="space-y-2">
              {identity?.bloodType && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03]">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-danger" />
                    <span className="text-sm text-muted">Blood Type</span>
                  </div>
                  <span className="text-sm font-semibold">{identity.bloodType}</span>
                </div>
              )}

              {identity?.allergies?.length > 0 && (
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
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
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
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
                <div className="p-2.5 rounded-lg bg-white/[0.03]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="text-sm text-muted">Conditions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {identity.conditions.map((c: string) => (
                      <span key={c} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted">
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

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 h-10 rounded-xl border border-white/10 text-foreground hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm">
              <Download className="w-4 h-4" /> Download
            </button>
            <button className="flex-1 h-10 rounded-xl border border-white/10 text-foreground hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
