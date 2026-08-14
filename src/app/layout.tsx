import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

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
    <html lang="es" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <body className="bg-slate-50 text-slate-900 font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
