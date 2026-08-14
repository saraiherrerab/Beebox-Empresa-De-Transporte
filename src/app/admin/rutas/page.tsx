"use client";

import React from "react";
import { Route, Plane, Ship, Clock, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminRutasPage() {
  const routes = [
    {
      id: "rt_1",
      name: "Ruta Miami Express (MIA -> SCL)",
      type: "Aéreo",
      origin: "Miami Hub (USA)",
      destination: "Santiago (Chile)",
      transitTime: "3 a 5 días hábiles",
      baseRate: "$9.50 USD / KG",
      status: "Activa",
    },
    {
      id: "rt_2",
      name: "Ruta Madrid Conexión (MAD -> MEX)",
      type: "Aéreo",
      origin: "Madrid Hub (España)",
      destination: "Ciudad de México (MX)",
      transitTime: "4 a 6 días hábiles",
      baseRate: "$11.00 USD / KG",
      status: "Activa",
    },
    {
      id: "rt_3",
      name: "Ruta FCL Marítimo (MIA -> VAP)",
      type: "Marítimo",
      origin: "Miami Port (USA)",
      destination: "Valparaíso (Chile)",
      transitTime: "15 a 20 días hábiles",
      baseRate: "$4.20 USD / KG",
      status: "Activa",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Catálogo de Rutas Standard y Tarifas</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Configuración de puntos de origen, destino, tiempo estimado de tránsito y tarifas base por ruta.
          </p>
        </div>

        <Button variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs uppercase shrink-0">
          <Plus className="w-4 h-4 mr-1.5 stroke-[3]" /> NUEVA RUTA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((r) => (
          <div key={r.id} className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {r.type}
              </span>
              <span className="text-xs font-bold text-emerald-400">{r.status}</span>
            </div>

            <h3 className="text-base font-extrabold text-white">{r.name}</h3>

            <div className="space-y-2 text-xs text-slate-400 border-t border-b border-slate-800/80 py-3">
              <div className="flex justify-between">
                <span>Origen:</span> <span className="font-bold text-slate-200">{r.origin}</span>
              </div>
              <div className="flex justify-between">
                <span>Destino:</span> <span className="font-bold text-slate-200">{r.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Tránsito:</span> <span className="font-bold text-slate-200">{r.transitTime}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">Tarifa Base:</span>
              <span className="text-base font-black font-mono text-amber-400">{r.baseRate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
