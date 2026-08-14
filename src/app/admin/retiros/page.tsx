"use client";

import React from "react";
import { CalendarCheck, Truck, Clock, MapPin, CheckCircle2 } from "lucide-react";

export default function AdminRetirosPage() {
  const pickups = [
    {
      id: "pk_1",
      code: "PK-9821-DOM",
      client: "Juan Pérez (CAS-88293)",
      address: "Av. Providencia 1234, Santiago Centro",
      date: "14 Aug 2026 (Tarde 14:00-18:00)",
      boxes: 2,
      electronics: "Sí (Apple MacBook Pro)",
      status: "Asignado a Chofer",
    },
    {
      id: "pk_2",
      code: "PK-7740-DOM",
      client: "María González (CAS-74120)",
      address: "San Pedro de la Paz #450, Concepción",
      date: "15 Aug 2026 (Mañana 09:00-12:00)",
      boxes: 1,
      electronics: "No",
      status: "Pendiente de Recolección",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Gestión Unificada de Recolecciones (Pickups)</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Calendario administrativo para coordinar y asignar unidades de transporte a las solicitudes de recolección a domicilio.
        </p>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Truck className="w-5 h-5 text-amber-400" /> Solicitudes de Pickup Programadas
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Código Orden</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Dirección de Recogida</th>
                <th className="py-3 px-4">Fecha y Horario</th>
                <th className="py-3 px-4">Cajas</th>
                <th className="py-3 px-4">Electrónicos</th>
                <th className="py-3 px-4">Estatus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
              {pickups.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">{p.code}</td>
                  <td className="py-4 px-4 font-bold text-white">{p.client}</td>
                  <td className="py-4 px-4 text-slate-400 max-w-xs truncate">{p.address}</td>
                  <td className="py-4 px-4 font-mono text-slate-300">{p.date}</td>
                  <td className="py-4 px-4 font-mono font-bold text-white">{p.boxes} bultos</td>
                  <td className="py-4 px-4 text-slate-300">{p.electronics}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
