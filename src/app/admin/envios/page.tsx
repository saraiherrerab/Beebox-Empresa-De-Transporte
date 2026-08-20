"use client";

import React, { useState } from "react";
import { Search, MapPin, Edit3, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ShipmentItem {
  id: string;
  tracking: string;
  type: string;
  weight: string;
  clientName: string;
  suiteCode: string;
  route: string;
  status: "aduana" | "vuelo" | "disponible" | "recibido";
  statusLabel: string;
  lastActivity: string;
  activityDesc: string;
}

export default function AdminEnviosPage() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<ShipmentItem[]>([
    {
      id: "sh_1",
      tracking: "BBX-89421",
      type: "Vía Aéreo Express",
      weight: "45.5 kg",
      clientName: "Importadora Del Pacífico",
      suiteCode: "CAS-88293-MIAMI",
      route: "Valparaíso → Santiago",
      status: "vuelo",
      statusLabel: "EN TRÁNSITO",
      lastActivity: "Hoy, 18:30 hrs",
      activityDesc: "Vehículo en tránsito hacia el hub Santiago",
    },
    {
      id: "sh_2",
      tracking: "LT-449201-US",
      type: "Vía Aéreo",
      weight: "0.8 kg",
      clientName: "Juan Pérez Rodríguez",
      suiteCode: "CAS-88293-MX",
      route: "MIA → MEX",
      status: "aduana",
      statusLabel: "EN ADUANA",
      lastActivity: "Hoy, 09:12 AM",
      activityDesc: "Procesado en Almacén",
    },
    {
      id: "sh_3",
      tracking: "LT-110293-ES",
      type: "Vía Marítimo",
      weight: "12.4 kg",
      clientName: "Sofía Méndez",
      suiteCode: "CAS-22481-MX",
      route: "MAD → MEX",
      status: "vuelo",
      statusLabel: "EN VUELO",
      lastActivity: "Ayer, 16:30 PM",
      activityDesc: "Salida de Origen",
    },
    {
      id: "sh_4",
      tracking: "LT-992281-US",
      type: "Vía Aéreo",
      weight: "1.3 kg",
      clientName: "Carlos Ruiz",
      suiteCode: "CAS-10394-MX",
      route: "MIA → MEX",
      status: "disponible",
      statusLabel: "DISPONIBLE",
      lastActivity: "14 Oct, 11:20 AM",
      activityDesc: "Listo para Retiro",
    },
  ]);

  React.useEffect(() => {
    fetch("http://localhost:4000/api/shipments")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ShipmentItem[] = data.map((item: any) => ({
            id: item.trackingCode || item.id,
            tracking: item.trackingCode,
            type: item.serviceType || "Express",
            weight: `${item.weightKg} kg`,
            clientName: item.recipientName || item.senderName,
            suiteCode: "CAS-88293-MIAMI",
            route: `${item.senderCity} → ${item.recipientCity}`,
            status: item.currentStatus === "en_transito" ? "vuelo" : "disponible",
            statusLabel: (item.currentStatus || "EN RUTA").toUpperCase(),
            lastActivity: item.estimatedDelivery || "Hoy",
            activityDesc: `Estado actual: ${item.currentStatus}`,
          }));
          setShipments(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Control de Envíos</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          SEGUIMIENTO GLOBAL DE PAQUETES
        </span>
      </div>

      {/* Main Container Card (Matching Mockup 2) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        {/* Tabs & Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-wider text-slate-400 overflow-x-auto">
            {["todos", "recibidos", "vuelo", "aduana", "disponibles"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 transition-all shrink-0 ${
                  activeTab === tab ? "border-amber-500 text-amber-600 font-bold" : "border-transparent hover:text-slate-700"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar guía, cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Global Tracking Table (Matching Mockup 2) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">NÚMERO DE GUÍA</th>
                <th className="py-4 px-4">CLIENTE / CASILLERO</th>
                <th className="py-4 px-4">RUTA</th>
                <th className="py-4 px-4">ESTATUS ACTUAL</th>
                <th className="py-4 px-4">ÚLTIMA ACTIVIDAD</th>
                <th className="py-4 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {shipments.map((sh) => (
                <tr key={sh.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-slate-900 block">{sh.tracking}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{sh.type} • {sh.weight}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">{sh.clientName}</span>
                    <span className="text-[10px] font-mono font-bold text-amber-600">{sh.suiteCode}</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-500">{sh.route}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        sh.status === "aduana"
                          ? "bg-amber-100 text-amber-800"
                          : sh.status === "vuelo"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {sh.statusLabel}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 block">{sh.lastActivity}</span>
                    <span className="text-[10px] text-slate-400">{sh.activityDesc}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors">
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination (Matching Mockup 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>Mostrando 1–10 de 2,481 envíos</span>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 uppercase text-[11px]">
              ANTERIOR
            </button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 uppercase text-[11px]">
              SIGUIENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
