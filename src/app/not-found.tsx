import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-accent">?</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted mb-8 text-center max-w-sm">This page could not be found.</p>
      <Link
        href="/"
        className="h-10 px-6 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2"
      >
        Go Home
      </Link>
    </div>
  );
}