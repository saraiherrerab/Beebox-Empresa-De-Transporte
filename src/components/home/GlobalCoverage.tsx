import React from "react";
import { MapPin, Globe2 } from "lucide-react";

export const GlobalCoverage: React.FC = () => {
  const hubs = [
    { city: "Miami, US", label: "Hub Principal EE.UU." },
    { city: "Madrid, ES", label: "Hub Europa" },
    { city: "Shenzhen, CN", label: "Hub Asia" },
    { city: "Santiago, CL", label: "Hub Latinoamérica" },
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {/* Subtle world map background decoration */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-4 mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">
              <Globe2 className="w-3.5 h-3.5" /> Red Internacional
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">COBERTURA MUNDIAL</h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Contamos con almacenes propios y alianzas estratégicas aéreas y marítimas en los principales centros de comercio global.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {hubs.map((h) => (
              <div
                key={h.city}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 text-center space-y-1 hover:border-amber-500/50 transition-colors"
              >
                <MapPin className="w-5 h-5 text-amber-400 mx-auto" />
                <h4 className="text-base font-bold text-white">{h.city}</h4>
                <p className="text-[11px] text-slate-400">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
