import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FactureReady — Préparez votre entreprise à la facturation électronique",
  description: "Diagnostic gratuit et plan d'action pour préparer votre entreprise à la facturation électronique.",
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="fr"><body>{children}</body></html>;
}
