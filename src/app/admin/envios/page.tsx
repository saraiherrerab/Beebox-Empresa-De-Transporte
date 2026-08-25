"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Loader2, Package, CheckCircle2, RefreshCw } from "lucide-react";

interface ShipmentItem {
  id: string;
  tracking: string;
  type: string;
  weight: string;
  clientName: string;
  suiteCode: string;
  route: string;
  currentStatus: string;
  lastActivity: string;
  activityDesc: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const STANDARDIZED_STATUSES = [
  "En el origen",
  "En camino",
  "Llegó a su destino",
];

export default function AdminEnviosPage() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  const fetchShipments = () => {
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
            currentStatus: item.currentStatus || "En el origen",
            lastActivity: item.estimatedDelivery || "Reciente",
            activityDesc: `Estado actual: ${item.currentStatus || "En el origen"}`,
          }));
          setShipments(mapped);
        }
      })
      .catch(() => {
        setShipments([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const handleUpdateStatus = async (trackingCode: string, newStatus: string) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/shipments/${trackingCode}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setShipments((prev) =>
          prev.map((sh) =>
            sh.tracking === trackingCode ? { ...sh, currentStatus: newStatus } : sh
          )
        );
        setNoticeMsg(`El estado del paquete ${trackingCode} se actualizó a "${newStatus}".`);
        setTimeout(() => setNoticeMsg(null), 4000);
      }
    } catch {
      setNoticeMsg("Error al actualizar el estado del envío.");
      setTimeout(() => setNoticeMsg(null), 4000);
    }
  };

  const filteredShipments = shipments.filter((sh) => {
    const matchesSearch =
      sh.tracking.toLowerCase().includes(search.toLowerCase()) ||
      sh.clientName.toLowerCase().includes(search.toLowerCase()) ||
      sh.suiteCode.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "todos") return matchesSearch;
    return matchesSearch && sh.currentStatus.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Control de Envíos</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            SEGUIMIENTO Y CAMBIO DE ESTADO DE PAQUETES (3 ESTADOS ESTÁNDAR)
          </span>
        </div>

        <button
          onClick={fetchShipments}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar Datos
        </button>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        {/* Tabs & Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 overflow-x-auto">
            {["todos", "en el origen", "en camino", "llegó a su destino"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                  activeTab === tab ? "bg-amber-500 text-slate-950 font-black shadow-md" : "hover:text-slate-700 bg-slate-100"
                }`}
              >
                {tab === "todos" ? "TODOS LOS ENVÍOS" : tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar guía, cliente o casillero..."
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
            <p className="text-xs font-bold text-slate-600">No hay envíos registrados para el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">NÚMERO DE GUÍA</th>
                  <th className="py-4 px-4">CLIENTE / CASILLERO</th>
                  <th className="py-4 px-4">RUTA</th>
                  <th className="py-4 px-4">CAMBIAR ESTATUS DEL PAQUETE</th>
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
                    <td className="py-4 px-4 font-mono font-bold text-slate-600">{sh.route}</td>
                    <td className="py-4 px-4">
                      <select
                        value={sh.currentStatus}
                        onChange={(e) => handleUpdateStatus(sh.tracking, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all ${
                          sh.currentStatus === "Llegó a su destino"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : sh.currentStatus === "En camino"
                            ? "bg-amber-50 border-amber-300 text-amber-900"
                            : "bg-slate-100 border-slate-300 text-slate-800"
                        }`}
                      >
                        {STANDARDIZED_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st === "En el origen" ? "📦 En el origen" : st === "En camino" ? "🚚 En camino" : "✅ Llegó a su destino"}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-2 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-600 font-bold text-[11px] transition-colors inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Ver Detalle
                      </button>
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
