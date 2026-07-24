import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { config } from "@/config";
import { PWARegister } from "@/components/pwa-register";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: `${config.app.name} — ${config.app.tagline}`,
    template: `%s — ${config.app.name}`,
  },
  description:
    "LIFELINK is a futuristic emergency health identity platform powered by Ontomorph Digital Twins. When you cannot speak for yourself, your Digital Twin speaks.",
  keywords: [
    "emergency health",
    "digital twin",
    "medical identity",
    "healthcare",
    "emergency response",
    "Ontomorph",
    "LIFELINK",
  ],
  authors: [{ name: "LIFELINK Team" }],
  creator: "LIFELINK",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: config.app.url,
    siteName: config.app.name,
    title: config.app.name,
    description: config.app.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: config.app.name,
    description: config.app.tagline,
  },
  icons: {
    icon: "/icons/favicon.svg",
    apple: "/icons/icon-192x192.svg",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        {children}
        <PWARegister />
      </body>
    </html>
  );
}
