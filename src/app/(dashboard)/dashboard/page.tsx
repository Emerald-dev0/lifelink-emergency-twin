'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { HeartPulse, QrCode, Activity, Clock, Shield, ChevronRight, AlertTriangle, Pill, Droplets } from 'lucide-react';
import { getStoredUser, getAuthHeaders } from '@/lib/auth';
import type { StoredUser } from '@/lib/auth';
import { PageLoader } from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  identity: { identifier: string; bloodType?: string; allergies: string[]; medications: string[]; isActive: boolean } | null;
  recentEvents: Array<{ _id: string; title: string; type: string; severity: string; timestamp: string }>;
  grants: Array<{ _id: string; status: string; createdAt: string }>;
  stats: { totalAccess: number; activeGrants: number; eventsCount: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored) {
      router.push('/login');
      return;
    }
    if (stored.role === 'responder') {
      router.push('/responder');
      return;
    }
    setUser(stored);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [identityRes, eventsRes, grantsRes] = await Promise.all([
        fetch('/api/identity', { headers: getAuthHeaders() }),
        fetch('/api/events?limit=5', { headers: getAuthHeaders() }),
        fetch('/api/grants', { headers: getAuthHeaders() }),
      ]);

      const [identity, events, grants] = await Promise.all([
        identityRes.json(),
        eventsRes.json(),
        grantsRes.json(),
      ]);

      setData({
        identity: identity.data || null,
        recentEvents: events.data || [],
        grants: grants.data || [],
        stats: {
          totalAccess: grants.data?.length || 0,
          activeGrants: grants.data?.filter((g: any) => g.status === 'active').length || 0,
          eventsCount: events.data?.length || 0,
        },
      });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {data?.identity?.isActive && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-xs text-success font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Identity Active
              </span>
            )}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Emergency ID', value: data?.identity ? 'Active' : 'Not Set', icon: QrCode, accent: true },
            { label: 'Access Events', value: data?.stats.totalAccess || 0, icon: Activity },
            { label: 'Active Grants', value: data?.stats.activeGrants || 0, icon: Shield },
            { label: 'Health Events', value: data?.stats.eventsCount || 0, icon: Clock },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${stat.accent ? 'border-accent/20 bg-accent/5' : 'border-border-subtle bg-surface-subtle'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-4 h-4 ${stat.accent ? 'text-accent' : 'text-muted'}`} />
              </div>
              <p className="text-2xl font-bold">{String(stat.value)}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <motion.a
            href="/identity"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-accent/20 bg-accent/5 p-5 hover:bg-accent/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <QrCode className="w-5 h-5 text-accent" />
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-all" />
            </div>
            <h3 className="font-semibold mb-1">View Emergency Card</h3>
            <p className="text-sm text-muted">Show your emergency identity QR code</p>
          </motion.a>

          <motion.a
            href="/twin"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-xl border border-border-subtle bg-surface-subtle p-5 hover:bg-surface-inset transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <HeartPulse className="w-5 h-5 text-muted group-hover:text-accent transition-all" />
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-all" />
            </div>
            <h3 className="font-semibold mb-1">Digital Twin Health</h3>
            <p className="text-sm text-muted">View your body systems and health events</p>
          </motion.a>

          <motion.a
            href="/timeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border-subtle bg-surface-subtle p-5 hover:bg-surface-inset transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-5 h-5 text-muted group-hover:text-accent transition-all" />
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-all" />
            </div>
            <h3 className="font-semibold mb-1">Health Timeline</h3>
            <p className="text-sm text-muted">Track health events and changes over time</p>
          </motion.a>

          <motion.a
            href="/access"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border-subtle bg-surface-subtle p-5 hover:bg-surface-inset transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <Shield className="w-5 h-5 text-muted group-hover:text-accent transition-all" />
              <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-all" />
            </div>
            <h3 className="font-semibold mb-1">Access History</h3>
            <p className="text-sm text-muted">Review who accessed your emergency data</p>
          </motion.a>
        </div>

        {/* Emergency Info Preview */}
        {data?.identity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border-subtle bg-surface-subtle p-5"
          >
            <h3 className="font-semibold mb-4">Emergency Information</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {data.identity.bloodType && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center">
                    <Droplets className="w-4 h-4 text-danger" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Blood Type</p>
                    <p className="text-sm font-medium">{data.identity.bloodType}</p>
                  </div>
                </div>
              )}
              {data.identity.allergies.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-warning/10 border border-warning/20 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Allergies</p>
                    <p className="text-sm font-medium">{data.identity.allergies.slice(0, 2).join(', ')}{data.identity.allergies.length > 2 ? '...' : ''}</p>
                  </div>
                </div>
              )}
              {data.identity.medications.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Pill className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted">Medications</p>
                    <p className="text-sm font-medium">{data.identity.medications.slice(0, 2).join(', ')}{data.identity.medications.length > 2 ? '...' : ''}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
