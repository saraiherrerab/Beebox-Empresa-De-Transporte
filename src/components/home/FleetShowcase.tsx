"use client";

import React, { useState } from "react";
import { Truck, ShieldCheck, CheckCircle, Gauge, Package } from "lucide-react";
import { FLEET_LIST } from "@/constants";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { API_URL } from "@/config/api";

export const FleetShowcase: React.FC = () => {
  const [fleetItems, setFleetItems] = useState(FLEET_LIST);
  const [selectedFleetId, setSelectedFleetId] = useState(FLEET_LIST[0].id);

  React.useEffect(() => {
    fetch(`${API_URL}/fleet`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFleetItems(data);
          setSelectedFleetId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const activeVehicle = fleetItems.find((v) => v.id === selectedFleetId) || fleetItems[0];

  return (
    <section id="flota" className="py-20 bg-beebox-navy-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <Badge variant="amber">Infraestructura & Flota</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nuestra Flota de Transporte
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Equipada con tecnología telemática avanzada, control de estabilidad y telemetría de motor para garantizar la máxima seguridad en ruta.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FLEET_LIST.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => setSelectedFleetId(vehicle.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                selectedFleetId === vehicle.id
                  ? "bg-beebox-amber-500 text-beebox-navy-950 shadow-lg shadow-beebox-amber-500/20 font-bold scale-105"
                  : "bg-beebox-navy-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {vehicle.category}
            </button>
          ))}
        </div>

        {/* Detailed Vehicle Panel */}
        <Card className="max-w-4xl mx-auto border-beebox-amber-500/20 bg-gradient-to-br from-beebox-navy-900 via-beebox-navy-950 to-beebox-navy-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-2">
            {/* Visual Icon Illustration */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-beebox-navy-950/80 border border-slate-800 text-center space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-beebox-amber-500/5 rounded-2xl pointer-events-none" />
              <div className="w-24 h-24 rounded-full bg-beebox-amber-500/10 border border-beebox-amber-500/30 flex items-center justify-center text-beebox-amber-400">
                <Truck className="w-12 h-12 stroke-[1.75]" />
              </div>
              <div>
                <Badge variant="cyan">{activeVehicle.category}</Badge>
                <h3 className="text-2xl font-bold text-white mt-2">{activeVehicle.name}</h3>
              </div>
            </div>

            {/* Spec Metrics */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Gauge className="w-4 h-4 text-beebox-amber-400" /> Capacidad de Carga
                  </div>
                  <span className="text-xl font-extrabold text-white">{activeVehicle.capacity}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Package className="w-4 h-4 text-beebox-cyan-400" /> Volumen Útil
                  </div>
                  <span className="text-xl font-extrabold text-white">{activeVehicle.volume}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Características Clave:</h4>
                {activeVehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-beebox-amber-400" />
                Mantenimiento preventivo computarizado al día y certificación de seguridad vial.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
