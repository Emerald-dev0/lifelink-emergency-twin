'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, AlertTriangle, Activity, Pill, Shield, HeartPulse } from 'lucide-react';
import { getStoredUser, getAuthHeaders } from '@/lib/auth';
import { timeAgo } from '@/lib/utils';
import { EmptyState } from '@/components/ui/empty-state';
import { PageLoader } from '@/components/ui/loader';

const eventIcons: Record<string, any> = {
  medication_change: Pill,
  lab_result: Activity,
  vital_change: HeartPulse,
  health_alert: AlertTriangle,
  emergency_access: Shield,
  condition_update: Activity,
  twin_sync: Clock,
  grant_issued: Shield,
  grant_revoked: Shield,
};

export default function TimelinePage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) { router.push('/login'); return; }
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', { headers: getAuthHeaders() });
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <button onClick={() => router.push('/dashboard')} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">Health Timeline</h1>
          <p className="text-sm text-muted mb-8">Track health events, changes, and emergency access over time.</p>

          {loading ? (
            <PageLoader />
          ) : events.length === 0 ? (
            <EmptyState
              icon={<Clock className="w-12 h-12" />}
              title="No events yet"
              description="Health events and emergency access will appear here."
            />
          ) : (
            <div className="relative">
              <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border-subtle" />
              <div className="space-y-4">
                {events.map((event, i) => {
                  const Icon = eventIcons[event.type] || Activity;
                  return (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="relative flex items-start gap-4"
                    >
                      <div className="relative z-10 flex-shrink-0 w-9 h-9 rounded-full bg-background border border-border-subtle flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${
                          event.severity === 'critical' ? 'text-danger' :
                          event.severity === 'warning' ? 'text-warning' :
                          'text-accent'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0 pt-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium">{event.title}</p>
                          <span className="text-xs text-muted flex-shrink-0">{timeAgo(event.timestamp)}</span>
                        </div>
                        {event.description && (
                          <p className="text-sm text-muted mt-0.5">{event.description}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
