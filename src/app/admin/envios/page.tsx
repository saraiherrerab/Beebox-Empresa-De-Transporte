"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Edit3, Trash2, Loader2, Package } from "lucide-react";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminEnviosPage() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    fetch(`${API_URL}/shipments`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped: ShipmentItem[] = data.map((item: any) => ({
            id: item.trackingCode || item.id,
            tracking: item.trackingCode,
            type: item.serviceType || "Aéreo Express",
            weight: `${item.weightKg} kg`,
            clientName: item.user?.name || item.recipientName || item.senderName,
            suiteCode: item.user?.suiteCode || "CAS-TULSA",
            route: `${item.senderCity} → ${item.recipientCity}`,
            status: item.currentStatus === "En camino" ? "vuelo" : item.currentStatus === "Llegó a su destino" ? "disponible" : "recibido",
            statusLabel: (item.currentStatus || "En el origen").toUpperCase(),
            lastActivity: item.estimatedDelivery || "Reciente",
            activityDesc: `Estado: ${item.currentStatus}`,
          }));
          setShipments(mapped);
        }
      })
      .catch(() => {
        setShipments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredShipments = shipments.filter(
    (sh) =>
      sh.tracking.toLowerCase().includes(search.toLowerCase()) ||
      sh.clientName.toLowerCase().includes(search.toLowerCase()) ||
      sh.suiteCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Control de Envíos</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          SEGUIMIENTO GLOBAL DE PAQUETES DE CLIENTES
        </span>
      </div>

      {/* Main Container Card */}
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

        {/* Global Tracking Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando envíos desde la base de datos...</span>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No hay envíos registrados en el sistema.</p>
          </div>
        ) : (
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
                {filteredShipments.map((sh) => (
                  <tr key={sh.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{sh.tracking}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{sh.type} • {sh.weight}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{sh.clientName}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-900">{sh.suiteCode}</span>
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>Mostrando 1–{filteredShipments.length} de {filteredShipments.length} envíos</span>
        </div>
      </div>
    </div>
  );
}
