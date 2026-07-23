import { DashboardNav } from '@/components/layout/dashboard-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="landing-theme min-h-screen bg-background text-foreground">
      <DashboardNav />
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
