'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, ChevronLeft, Eye, Check, X, Clock } from 'lucide-react';
import { getStoredUser, getAuthHeaders } from '@/lib/auth';
import { timeAgo } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoader } from '@/components/ui/loader';

export default function AccessPage() {
  const router = useRouter();
  const [grants, setGrants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.push('/login'); return; }
    fetchGrants();
  }, []);

  const fetchGrants = async () => {
    try {
      const res = await fetch('/api/grants', { headers: getAuthHeaders() });
      const data = await res.json();
      setGrants(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-4 h-4 text-success" />;
      case 'expired': return <Clock className="w-4 h-4 text-muted" />;
      case 'revoked': return <X className="w-4 h-4 text-danger" />;
      default: return <Eye className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Access History</h1>
          <p className="text-sm text-muted mb-8">Review who has accessed your emergency identity and when.</p>

          {loading ? (
            <PageLoader />
          ) : grants.length === 0 ? (
            <EmptyState
              icon={<Shield className="w-12 h-12" />}
              title="No access records"
              description="Emergency access grants will appear here."
            />
          ) : (
            <div className="space-y-2">
              {grants.map((grant, i) => (
                <motion.div
                  key={grant._id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-border-subtle bg-surface-subtle"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
                      grant.status === 'active' ? 'border-success/20 bg-success/10' :
                      grant.status === 'revoked' ? 'border-danger/20 bg-danger/10' :
                      'border-border-subtle bg-surface-subtle'
                    }`}>
                      {statusIcon(grant.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">{grant.status} Grant</p>
                      <p className="text-xs text-muted">{new Date(grant.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium capitalize ${
                    grant.status === 'active' ? 'text-success' :
                    grant.status === 'revoked' ? 'text-danger' :
                    'text-muted'
                  }`}>
                    {grant.status}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
