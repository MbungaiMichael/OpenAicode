import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "PatientAssist — International Patient Assistance",
  description: "Hospitals, translators, coordinators, cost estimates, and support for patients traveling to India.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-2 focus:text-blue-700">
          Skip to content
        </a>
        <Nav />
        <div id="main" className="mx-auto max-w-5xl px-4 pb-16">{children}</div>
      </body>
    </html>
  );
}
