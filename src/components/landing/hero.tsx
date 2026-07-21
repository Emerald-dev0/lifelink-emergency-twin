'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
        ctx.fill();

        particles.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 229, 255, ${0.05 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ParticleField />

      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-background" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-medium tracking-wider uppercase">
              Emergency Health Identity Platform
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
            <span className="text-foreground">When you cannot</span>
            <br />
            <span className="text-foreground">speak for yourself,</span>
            <br />
            <span className="text-accent">your Digital Twin speaks.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted leading-relaxed mb-10">
            LIFELINK creates a secure emergency identity layer powered by your Ontomorph Digital Twin.
            First responders access critical medical information the moment you need it most.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/onboarding"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-8 text-base font-medium text-background hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_rgba(0,229,255,0.3)]"
            >
              Create Your Emergency Identity
            </a>
            <a
              href="/responder"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 text-base font-medium text-foreground hover:bg-white/10 transition-all"
            >
              Emergency Responder Access
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-8 text-xs text-muted"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-success" />
            HIPAA Compliant
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-success" />
            Ontomorph Powered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-success" />
            Patient Controlled
          </span>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border border-white/10 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-muted" />
        </motion.div>
      </div>
    </section>
  );
}
