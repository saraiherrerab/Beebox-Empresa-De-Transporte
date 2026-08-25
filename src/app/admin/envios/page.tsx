"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, MapPin, Loader2, Package, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  const { socket } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const fetchShipments = useCallback(() => {
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
  }, []);

  useEffect(() => {
    fetchShipments();

    if (socket) {
      socket.on("shipment:updated", fetchShipments);
      socket.on("prealerta:updated", fetchShipments);
    }

    return () => {
      if (socket) {
        socket.off("shipment:updated", fetchShipments);
        socket.off("prealerta:updated", fetchShipments);
      }
    };
  }, [fetchShipments, socket]);

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

  const totalPages = Math.ceil(filteredShipments.length / pageSize) || 1;
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Tabs & Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: "todos", label: "TODOS LOS ENVÍOS" },
              { id: "origen", label: "EN EL ORIGEN" },
              { id: "camino", label: "EN CAMINO" },
              { id: "destino", label: "LLEGÓ A SU DESTINO" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all shrink-0 ${
                  activeTab === tab.id ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar guía, cliente o casillero..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Global Tracking Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando envíos desde la base de datos...</span>
          </div>
        ) : paginatedShipments.length === 0 ? (
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
                {paginatedShipments.map((sh) => (
                  <tr key={sh.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{sh.tracking}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{sh.type} • {sh.weight}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{sh.clientName}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{sh.suiteCode}</span>
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
                            ? "bg-blue-50 border-blue-300 text-blue-900"
                            : "bg-amber-50 border-amber-300 text-amber-800"
                        }`}
                      >
                        {STANDARDIZED_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
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
          <span className="font-mono font-bold text-slate-700">Página {currentPage} de {totalPages}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 text-[11px]"
            >
              <ChevronLeft className="w-4 h-4" /> ANTERIOR
            </button>
            <span className="font-mono font-bold px-2 text-slate-800">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 text-[11px]"
            >
              SIGUIENTE <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
