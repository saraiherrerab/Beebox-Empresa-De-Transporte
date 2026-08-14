import React from "react";
import { Truck, ShieldCheck, Clock, Award, ChevronRight } from "lucide-react";
import { TrackingWidget } from "./TrackingWidget";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-beebox-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-beebox-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6 mb-12">
          <div className="inline-flex items-center gap-2">
            <Badge variant="amber" className="py-1 px-3">
              <Truck className="w-3.5 h-3.5 mr-1" /> Empresa Nacional de Transportes
            </Badge>
            <span className="hidden sm:inline-block text-xs text-slate-400">
              Red Logística Integrada 2026
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Transporte de Carga & Logística <span className="bg-gradient-to-r from-beebox-amber-400 via-amber-300 to-beebox-amber-500 bg-clip-text text-transparent">Sin Limites</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Conectamos ciudades, industrias y e-commerce con máxima puntualidad, flota inteligente y rastreo satelital garantizado en cada kilómetro.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-beebox-navy-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-4 h-4 text-beebox-amber-400" /> +99.4% Puntualidad
            </span>
            <span className="flex items-center gap-1.5 bg-beebox-navy-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-beebox-cyan-400" /> Cobertura 100% Asegurada
            </span>
            <span className="flex items-center gap-1.5 bg-beebox-navy-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Award className="w-4 h-4 text-emerald-400" /> +50k Envíos Mensuales
            </span>
          </div>
        </div>

        {/* Interactive Tracking Input */}
        <TrackingWidget />

        {/* Quick CTA banner */}
        <div className="mt-12 text-center">
          <Link
            href="#cotizador"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-beebox-amber-400 transition-colors group"
          >
            ¿Necesitas cotizar un flete industrial o envío masivo?
            <span className="text-beebox-amber-500 group-hover:translate-x-1 transition-transform flex items-center">
              Ir al Cotizador <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
