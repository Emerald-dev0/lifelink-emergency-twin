'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Ambulance } from 'lucide-react';
import { setToken, setStoredUser } from '@/lib/auth';

export default function ResponderLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || 'Login failed');
        return;
      }

      if (data.data.user.role !== 'responder') {
        setError('This login is for emergency responders only');
        return;
      }

      setToken(data.data.token);
      setStoredUser(data.data.user);
      document.cookie = `lifelink_token=${data.data.token}; path=/; max-age=604800; SameSite=Lax`;
      router.push('/responder');
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative w-full max-w-sm"
      >
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg border-2 border-red-500 bg-red-500/10 mb-4">
            <Ambulance className="w-6 h-6 text-red-600" />
          </div>
          <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-600 border border-red-500/20 mb-3">
            Emergency Personnel Only
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Responder Sign In</h1>
          <p className="text-sm text-muted mt-1">For EMTs, paramedics, nurses, and first responders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-foreground font-medium mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-foreground font-medium mb-1.5">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3.5 pr-10 rounded-lg bg-surface border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-foreground bg-surface border border-border rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                Sign in <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Not a responder?{' '}
          <a href="/login" className="text-foreground underline underline-offset-2 hover:opacity-80">
            Patient sign in
          </a>
        </p>

        <div className="mt-8 space-y-3">
          <a href="/responder-register" className="block text-center text-xs text-red-600 hover:text-red-700 font-medium transition-colors duration-200">
            Register as a responder →
          </a>
          <a href="/" className="block text-center text-xs text-muted hover:text-foreground transition-colors duration-200">
            ← Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}