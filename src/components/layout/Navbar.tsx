"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Box, Phone, Search, Menu, X, Clock, ShieldCheck, MapPin } from "lucide-react";
import { COMPANY_INFO, NAV_LINKS } from "@/constants";
import { Button } from "@/components/ui/Button";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-beebox-navy-950/90 backdrop-blur-xl">
      {/* Top Announcement Bar */}
      <div className="hidden md:block bg-beebox-navy-900/90 border-b border-slate-800/50 py-1.5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-beebox-amber-500" />
              <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-white transition-colors">
                {COMPANY_INFO.phone}
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-beebox-amber-500" />
              {COMPANY_INFO.hours}
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cobertura 100% Nacional Certificada
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-beebox-cyan-400" /> Santiago, Chile
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-beebox-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-beebox-amber-500/20 group-hover:scale-105 transition-transform">
              <Box className="w-6 h-6 text-beebox-navy-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-1">
                BEE<span className="text-beebox-amber-500">BOX</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400 block -mt-1">
                Logística & Transporte
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-beebox-amber-400 transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-beebox-amber-500 after:absolute after:bottom-0 after:left-0 after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/#rastreo">
              <Button variant="outline" size="sm" icon={<Search className="w-4 h-4 text-beebox-amber-400" />}>
                Rastrear Envío
              </Button>
            </Link>
            <Link href="/#cotizador">
              <Button variant="primary" size="sm">
                Cotizar Flete
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-beebox-navy-900/95 backdrop-blur-2xl px-4 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-beebox-amber-400 py-2 border-b border-slate-800/50"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/#rastreo" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full justify-center" icon={<Search className="w-4 h-4 text-beebox-amber-400" />}>
                Rastrear Envío
              </Button>
            </Link>
            <Link href="/#cotizador" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                Cotizar Flete
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
