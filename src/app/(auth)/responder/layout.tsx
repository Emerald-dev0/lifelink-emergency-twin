export default function ResponderLayout({ children }: { children: React.ReactNode }) {
  return <div className="app-theme min-h-screen bg-background text-foreground">{children}</div>;
}
