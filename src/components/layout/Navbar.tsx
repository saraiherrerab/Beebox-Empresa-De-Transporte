"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Search, Menu, X, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: "INICIO", href: "/" },
    { name: "PROMOCIONES", href: "/#promociones" },
    { name: "CALCULAR ENVÍO", href: "/#cotizador" },
    { name: "¿CÓMO FUNCIONA?", href: "/#como-funciona" },
    { name: "NOSOTROS", href: "/#nosotros" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Box className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                BEE<span className="text-amber-500">BOX</span>
              </span>
              <span className="text-[9px] tracking-widest uppercase font-bold text-slate-400 block -mt-1">
                A Swarm of Quality
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-extrabold tracking-wider text-slate-700 hover:text-amber-600 transition-colors uppercase"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-slate-700 hover:text-amber-600 px-3 py-2 rounded-lg bg-slate-100"
                >
                  Mi Portal ({user?.name.split(" ")[0]})
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Salir
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-amber-600 px-3 py-2 transition-colors"
                >
                  INICIAR
                </Link>
                <Link href="/registro">
                  <Button variant="amber" size="sm" className="rounded-full px-5 py-2">
                    REGISTRARSE
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu icon */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 py-1.5 uppercase"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center">
                INICIAR SESIÓN
              </Button>
            </Link>
            <Link href="/registro" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="amber" className="w-full justify-center">
                REGISTRARSE
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
