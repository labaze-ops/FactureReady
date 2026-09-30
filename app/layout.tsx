import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "FactureReady — Préparez la facturation électronique", description: "Diagnostic gratuit et plan d'action pour la réforme française de la facturation électronique." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body>{children}</body></html>;
}
