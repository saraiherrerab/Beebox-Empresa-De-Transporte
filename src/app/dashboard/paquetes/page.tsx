"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Eye, Loader2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface PackageItem {
  id: string;
  tracking: string;
  providerWarehouseReceipt?: string;
  description: string;
  origin: string;
  destination: string;
  route: string;
  weight: string;
  cubicFeet: string;
  status: string;
  statusLabel: string;
}

import { API_URL } from "@/config/api";

export default function MisPaquetesPage() {
  const { socket } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  const fetchPackages = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const mapped: PackageItem[] = data.map((item: any) => ({
              id: item.trackingCode,
              tracking: item.trackingCode,
              providerWarehouseReceipt: item.providerWarehouseReceipt || item.prealerta?.providerWarehouseReceipt || undefined,
              description: item.prealerta?.description || `Envío de ${item.senderName}`,
              origin: item.senderCity || "Broken Arrow, OK",
              destination: item.recipientCity || "Caracas, Venezuela",
              route: `${item.senderCity || "Broken Arrow, OK"} → ${item.recipientCity || "Caracas, VE"}`,
              weight: `${item.weightKg} kg`,
              cubicFeet: item.dimensions || "25x20x15 cm",
              status: item.currentStatus || "En el origen",
              statusLabel: (item.currentStatus || "En el origen").toUpperCase(),
            }));
            setPackages(mapped);
          }
        })
        .catch(() => {
          setPackages([]);
        })
        .finally(() => setLoading(false));
    } else {
      setPackages([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();

    if (socket) {
      socket.on("shipment:updated", fetchPackages);
      socket.on("prealerta:updated", fetchPackages);
    }

    return () => {
      if (socket) {
        socket.off("shipment:updated", fetchPackages);
        socket.off("prealerta:updated", fetchPackages);
      }
    };
  }, [fetchPackages, socket]);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.tracking.toLowerCase().includes(search.toLowerCase()) ||
      (pkg.providerWarehouseReceipt && pkg.providerWarehouseReceipt.toLowerCase().includes(search.toLowerCase())) ||
      pkg.description.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "todos") return matchesSearch;
    return matchesSearch && pkg.status.toLowerCase().includes(activeTab.toLowerCase());
  });

  const totalPages = Math.ceil(filteredPackages.length / pageSize) || 1;
  const paginatedPackages = filteredPackages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Paquetes Recibidos</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Consulta detallada de envíos asociados a tu casillero virtual con número de guía, ruta, peso y estatus en tiempo real.
        </p>
      </div>

      {/* Main Table Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Tabs Filter */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: "todos", label: "TODOS" },
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
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-600 hover:text-slate-900"
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
              placeholder="Buscar por guía, WR, descripción..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Package Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando tus paquetes en tiempo real...</span>
          </div>
        ) : paginatedPackages.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No se encontraron paquetes registrados en este estatus.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">GUÍA ALMACÉN BEBOX</th>
                  <th className="py-4 px-4">WR PROVEEDOR</th>
                  <th className="py-4 px-4">DESCRIPCIÓN</th>
                  <th className="py-4 px-4">ORIGEN / DESTINO</th>
                  <th className="py-4 px-4">RUTA</th>
                  <th className="py-4 px-4">PESO</th>
                  <th className="py-4 px-4">ESTATUS</th>
                  <th className="py-4 px-4 text-right">DETALLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {paginatedPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{pkg.tracking}</td>
                    <td className="py-4 px-4 font-mono">
                      {pkg.providerWarehouseReceipt ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {pkg.providerWarehouseReceipt}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{pkg.description}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800 block">{pkg.origin}</span>
                      <span className="text-[10px] text-amber-700 font-bold">&rarr; {pkg.destination}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-500">{pkg.route}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-800">{pkg.weight}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          pkg.status === "Llegó a su destino"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : pkg.status === "En camino"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {pkg.statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                        <Eye className="w-4 h-4" />
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
