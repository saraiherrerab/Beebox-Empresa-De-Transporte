"use client";

import React from "react";
import { Plane, Ship, CheckCircle2, Globe, Clock, ShieldCheck } from "lucide-react";

export const MetricsSection: React.FC = () => {
  const metrics = [
    {
      label: "Envíos Aéreos Procesados",
      value: "+120,000",
      desc: "Conexiones diarias Miami, Madrid y Shenzhen",
      icon: Plane,
    },
    {
      label: "Envíos Marítimos FCL / LCL",
      value: "+85,000",
      desc: "Contenedores y consolidado de gran escala",
      icon: Ship,
    },
    {
      label: "Entregas a Tiempo Garantizadas",
      value: "99.4%",
      desc: "Cumplimiento estricto de tiempos de tránsito",
      icon: Clock,
    },
    {
      label: "Clientes Empresariales y Personas",
      value: "+45,000",
      desc: "Casilleros virtuales activos en todo el país",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-12 border-y border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-amber-500/50 transition-all shadow-md"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">{item.value}</div>
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400">{item.label}</h4>
                  <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
