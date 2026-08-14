import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Beebox - Empresa de Transporte y Casillero Internacional",
  description: "Rastrea tus envíos, solicita pickups y gestiona tu casillero internacional en Miami, Madrid y Shenzhen.",
  keywords: ["transporte", "logística", "casillero miami", "envíos internacionales", "Beebox"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
