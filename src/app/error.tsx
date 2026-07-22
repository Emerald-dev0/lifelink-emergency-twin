'use client';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-danger">!</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted mb-8 text-center max-w-sm text-sm">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="h-10 px-6 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all"
      >
        Try again
      </button>
    </div>
  );
}