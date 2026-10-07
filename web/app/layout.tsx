import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "PatientAssist — International Patient Assistance",
  description: "Hospitals, translators, coordinators, cost estimates, and support for patients traveling to India.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "PatientAssist" },
  icons: { apple: "/icons/apple-touch-icon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1D4ED8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-2 focus:text-blue-700">
          Skip to content
        </a>
        <ServiceWorkerRegister />
        <Nav />
        <div id="main" className="mx-auto max-w-5xl px-4 pb-16">{children}</div>
        <footer className="border-t border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 py-4 text-xs text-slate-600" aria-label="Trust pages">
            <a href="/about">About</a>
            <a href="/privacy">Privacy</a>
            <a href="/disclaimer">Medical Disclaimer</a>
            <a href="/payments">Payments Guidance</a>
            <a href="/support">Support</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
