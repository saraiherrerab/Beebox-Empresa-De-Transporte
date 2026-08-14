import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beebox - Empresa de Transporte y Logística",
  description: "Soluciones integrales de transporte terrestre, carga pesada, envíos express y distribución de última milla a nivel nacional.",
  keywords: ["transporte", "logística", "envíos", "fletes", "seguimiento de paquetes", "Beebox", "Chile"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark scroll-smooth">
      <body className="bg-beebox-navy-950 text-slate-100 font-sans antialiased bg-grid-pattern">
        {children}
      </body>
    </html>
  );
}
