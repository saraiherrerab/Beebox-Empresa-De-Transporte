import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { ServiceCards } from "@/components/home/ServiceCards";
import { RateCalculator } from "@/components/home/RateCalculator";
import { FleetShowcase } from "@/components/home/FleetShowcase";
import { ShieldCheck, Truck, Clock, Headphones } from "lucide-react";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-beebox-navy-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero & Tracking Input */}
        <HeroSection />

        {/* Value Proposition Highlights */}
        <section className="py-12 border-y border-slate-800/80 bg-beebox-navy-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-2xl bg-beebox-navy-900/60 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-beebox-amber-500/10 text-beebox-amber-400 mx-auto flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Garantía de Tiempo</h3>
                <p className="text-xs text-slate-400">Compromiso contractual de entrega a tiempo o reembolso de flete.</p>
              </div>

              <div className="p-6 rounded-2xl bg-beebox-navy-900/60 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-beebox-cyan-500/10 text-beebox-cyan-400 mx-auto flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Carga 100% Asegurada</h3>
                <p className="text-xs text-slate-400">Protección contra todo riesgo durante todo el trayecto terrestre.</p>
              </div>

              <div className="p-6 rounded-2xl bg-beebox-navy-900/60 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Flota Moderna</h3>
                <p className="text-xs text-slate-400">Vehículos Euro 6 de bajas emisiones y telemetría de ruta en vivo.</p>
              </div>

              <div className="p-6 rounded-2xl bg-beebox-navy-900/60 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 mx-auto flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Soporte 24/7</h3>
                <p className="text-xs text-slate-400">Ejecutivo asignado para seguimiento corporativo continuo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Showcase */}
        <ServiceCards />

        {/* Instant Rate Calculator */}
        <RateCalculator />

        {/* Fleet Showcase */}
        <FleetShowcase />
      </main>

      <Footer />
    </div>
  );
}
