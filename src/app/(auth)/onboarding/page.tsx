'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, UserPlus, Fingerprint, Shield, QrCode, ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { setToken, setStoredUser, getAuthHeaders } from '@/lib/auth';

const steps = [
  { id: 'welcome', icon: HeartPulse, title: 'Welcome to LIFELINK' },
  { id: 'create', icon: UserPlus, title: 'Create your account' },
  { id: 'twin', icon: Fingerprint, title: 'Connect Digital Twin' },
  { id: 'permissions', icon: Shield, title: 'Set permissions' },
  { id: 'identity', icon: QrCode, title: 'Your Emergency Identity' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [twinConnected, setTwinConnected] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['basic_info', 'blood_type', 'allergies', 'medications']);
  const [identityCreated, setIdentityCreated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const permissionsList = [
    { id: 'basic_info', label: 'Basic Information', desc: 'Name, age, blood type' },
    { id: 'allergies', label: 'Allergies', desc: 'Known allergic reactions' },
    { id: 'medications', label: 'Medications', desc: 'Current prescriptions' },
    { id: 'conditions', label: 'Medical Conditions', desc: 'Pre-existing conditions' },
    { id: 'emergency_contacts', label: 'Emergency Contacts', desc: 'Who to contact' },
    { id: 'full_medical_history', label: 'Full History', desc: 'Complete medical records' },
  ];

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreateAccount = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Registration failed');
        return;
      }

      setToken(data.data.token);
      setStoredUser(data.data.user);
      document.cookie = `lifelink_token=${data.data.token}; path=/; max-age=604800; SameSite=Lax`;
      setUserId(data.data.user.id);
      setCurrentStep(2);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnectTwin = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ontomorph/twin', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          displayName: name || 'My Digital Twin',
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to connect Digital Twin');
        return;
      }
      setTwinConnected(true);
      setCurrentStep(3);
    } catch {
      setError('Failed to connect Digital Twin');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIdentity = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('lifelink_token');
      const res = await fetch('/api/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bloodType: 'O+',
          allergies: [],
          medications: [],
          conditions: [],
          emergencyContacts: [],
          permissions: selectedPermissions,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Failed to create identity');
        return;
      }

      setIdentityCreated(true);
      setCurrentStep(4);
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-8">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted font-medium">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-xs text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-surface-subtle rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step labels */}
        <div className="flex justify-between mb-8 overflow-x-auto gap-2 pb-2">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => i < currentStep && setCurrentStep(i)}
              className={`flex flex-col items-center gap-1 min-w-[60px] transition-all ${
                i === currentStep ? 'opacity-100' : i < currentStep ? 'opacity-60 cursor-pointer' : 'opacity-30'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  i <= currentStep
                    ? 'bg-accent text-background'
                    : 'bg-surface-subtle text-muted border border-border-subtle'
                }`}
              >
                {i < currentStep ? <Check className="w-4 h-4" /> : step.icon && <step.icon className="w-4 h-4" />}
              </div>
              <span className="text-[10px] text-muted text-center leading-tight hidden sm:block">
                {step.title.split(' ').slice(0, 2).join(' ')}
              </span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
                <HeartPulse className="w-10 h-10 text-accent" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight mb-3">Your Emergency Identity</h1>
              <p className="text-muted mb-8 max-w-sm">
                Create your LIFELINK emergency identity and connect your Ontomorph Digital Twin. When you cannot speak, your Digital Twin speaks for you.
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="h-12 px-8 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 1: Create Account */}
          {currentStep === 1 && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <h2 className="text-2xl font-bold mb-1">Create your account</h2>
              <p className="text-sm text-muted mb-6">Your emergency identity starts here.</p>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted font-medium mb-1.5">Full Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface-subtle border border-border-subtle text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface-subtle border border-border-subtle text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted font-medium mb-1.5">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 px-3.5 rounded-xl bg-surface-subtle border border-border-subtle text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    required
                    minLength={6}
                  />
                </div>

                {error && (
                  <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="h-10 px-4 rounded-xl border border-border-subtle text-muted hover:text-foreground hover:bg-surface-subtle transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 h-10 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <>Continue <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 2: Connect Digital Twin */}
          {currentStep === 2 && (
            <motion.div
              key="twin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center mb-6 relative">
                <div className={`absolute inset-0 rounded-full ${twinConnected ? 'bg-accent/20' : ''}`} />
                <Fingerprint className={`w-10 h-10 ${twinConnected ? 'text-accent' : 'text-muted'} transition-all`} />
                {!twinConnected && loading && (
                  <div className="absolute inset-0 rounded-full border-2 border-accent/50 border-t-transparent animate-spin" />
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">Connect Digital Twin</h2>
              <p className="text-muted mb-8 max-w-sm">
                Your Ontomorph Digital Twin will hold your emergency health identity. This is a secure, encrypted connection.
              </p>

              {twinConnected ? (
                <div className="space-y-4 w-full">
                  <div className="rounded-xl bg-success/10 border border-success/20 p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-success flex-shrink-0" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-success">Digital Twin Connected</p>
                      <p className="text-xs text-muted">Your emergency identity layer is active</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full h-10 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectTwin}
                  disabled={loading}
                  className="h-12 px-8 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all disabled:opacity-50"
                >
                  {loading ? 'Connecting...' : 'Connect Digital Twin'}
                </button>
              )}
            </motion.div>
          )}

          {/* Step 3: Permissions */}
          {currentStep === 3 && (
            <motion.div
              key="permissions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <h2 className="text-2xl font-bold mb-1">Set permissions</h2>
              <p className="text-sm text-muted mb-6">
                Choose what information is shared during an emergency.
              </p>

              <div className="space-y-2 mb-6">
                {permissionsList.map((perm) => (
                  <button
                    key={perm.id}
                    onClick={() => togglePermission(perm.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      selectedPermissions.includes(perm.id)
                        ? 'border-accent/30 bg-accent/5'
                        : 'border-border-subtle bg-surface-subtle hover:bg-surface-inset'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        selectedPermissions.includes(perm.id)
                          ? 'border-accent bg-accent'
                          : 'border-border-subtle'
                      }`}
                    >
                      {selectedPermissions.includes(perm.id) && (
                        <Check className="w-3 h-3 text-background" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{perm.label}</p>
                      <p className="text-xs text-muted">{perm.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="h-10 px-4 rounded-xl border border-border-subtle text-muted hover:text-foreground hover:bg-surface-subtle transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handleCreateIdentity}
                  disabled={loading}
                  className="flex-1 h-10 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  ) : (
                    <>Generate Identity <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Identity Created */}
          {currentStep === 4 && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-6">
                <QrCode className="w-10 h-10 text-success" />
              </div>

              <h2 className="text-2xl font-bold mb-2">Emergency Identity Active</h2>
              <p className="text-muted mb-8 max-w-sm">
                Your Digital Twin is connected and your emergency identity is ready. In an emergency, responders scan your identity to access critical information.
              </p>

              <div className="w-full space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-12 rounded-xl bg-accent text-background font-medium hover:bg-accent/90 transition-all"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => router.push('/identity')}
                  className="w-full h-12 rounded-xl border border-border-subtle text-foreground hover:bg-surface-subtle transition-all"
                >
                  View Emergency Card
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
