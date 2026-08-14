"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Servicios", href: "#servicios" },
    { name: "Calculadora", href: "#calculadora" },
    { name: "Promociones", href: "#promociones" },
    { name: "Nosotros", href: "#nosotros" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/beebox-logo.jpg"
              alt="Beebox Enterprise Logo"
              className="h-12 sm:h-14 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-black uppercase tracking-wider text-slate-600 hover:text-slate-950 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Explicit Header Auth CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <button className="px-5 py-2.5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 text-slate-800 hover:text-slate-950 text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" /> INICIAR SESIÓN
              </button>
            </Link>

            <Link href="/registro">
              <Button variant="amber" className="rounded-2xl px-6 py-2.5 text-xs font-black tracking-wider uppercase shadow-md shadow-amber-500/20">
                ABRIR CASILLERO <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-slate-100 text-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-slate-950 py-2 border-b border-slate-100"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-3">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-3 rounded-2xl border border-slate-300 text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                <User className="w-4 h-4 text-amber-600" /> INICIAR SESIÓN
              </button>
            </Link>

            <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="amber" className="w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider justify-center">
                ABRIR CASILLERO GRATIS
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
