"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, PackageCheck, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const TrackingWidget: React.FC = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError("Por favor ingresa un código de seguimiento.");
      return;
    }
    setError("");
    router.push(`/rastreo?codigo=${encodeURIComponent(trackingCode.trim().toUpperCase())}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-3xl p-1 bg-gradient-to-r from-beebox-amber-500/40 via-beebox-cyan-500/20 to-amber-500/40 shadow-2xl shadow-beebox-amber-500/10">
      <div className="rounded-[22px] bg-beebox-navy-900/95 p-6 md:p-8 backdrop-blur-xl border border-slate-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-beebox-amber-500 border border-amber-500/20">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Rastreo de Envíos en Tiempo Real</h3>
            <p className="text-xs text-slate-400">Ingresa tu número de guía o código Beebox</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => {
                  setTrackingCode(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Ejemplo: BEE-98234-CL"
                className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-4 pl-12 text-base text-white placeholder-slate-500 uppercase tracking-wider font-mono focus:border-beebox-amber-500 focus:outline-none focus:ring-2 focus:ring-beebox-amber-500/20 transition-all"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              className="sm:w-auto w-full shrink-0"
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Consultar Estado
            </Button>
          </div>

          {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Monitoreo satelital activo
            </span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Ejemplo de código demo:</span>
              <button
                type="button"
                onClick={() => {
                  setTrackingCode("BEE-98234-CL");
                  setError("");
                }}
                className="font-mono text-beebox-amber-400 underline hover:text-amber-300"
              >
                BEE-98234-CL
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
