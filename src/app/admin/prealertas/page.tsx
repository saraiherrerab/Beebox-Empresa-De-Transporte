"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Check, Search, MapPin, PackageCheck, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPrealertasPage() {
  const { prealertas, linkPrealerta } = useAuth();
  const [searchTracking, setSearchTracking] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const [warehouseGuideInput, setWarehouseGuideInput] = useState<{ [key: string]: string }>({});
  const [destinationInput, setDestinationInput] = useState<{ [key: string]: string }>({});
  const [linkedNotice, setLinkedNotice] = useState<string | null>(null);

  const handleConfirmPrealerta = async (id: string, trackingNumber: string, defaultDest?: string) => {
    const guide = warehouseGuideInput[id] || `OK-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalDest = destinationInput[id] || defaultDest || "Caracas, Venezuela";

    await linkPrealerta(id, guide, finalDest);
    setLinkedNotice(`Prealerta ${trackingNumber} confirmada exitosamente en el almacén con la Guía ${guide} y destino ${finalDest}.`);
    setTimeout(() => setLinkedNotice(null), 5000);
  };

  const filteredPrealertas = prealertas.filter((item) => {
    const matchesSearch =
      item.trackingNumber.toLowerCase().includes(searchTracking.toLowerCase()) ||
      item.store.toLowerCase().includes(searchTracking.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTracking.toLowerCase()) ||
      (item.destination || "").toLowerCase().includes(searchTracking.toLowerCase());

    const isConfirmed = item.status === "Confirmado" || item.status === "Vinculado";
    const matchesStatus =
      statusFilter === "TODOS" ||
      (statusFilter === "Prealertado" && item.status === "Prealertado") ||
      (statusFilter === "Confirmado" && isConfirmed);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPrealertas.length / pageSize) || 1;
  const paginatedPrealertas = filteredPrealertas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Confirmación de Prealertas</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Corrobora la recepción física de paquetes en el almacén de Oklahoma (EE.UU.), confirma la fecha de registro del cliente y asigna el despacho.
        </p>
      </div>

      {linkedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {linkedNotice}
        </div>
      )}

      {/* Unified Single Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Controls: Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Tabs Filter */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
            {["TODOS", "Prealertado", "Confirmado"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all flex-1 md:flex-none ${
                  statusFilter === status
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status === "TODOS" ? "TODAS" : status.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTracking}
              onChange={(e) => {
                setSearchTracking(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por tracking, tienda o cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Prealertas ({filteredPrealertas.length})</h3>
          <span className="text-xs text-slate-400 font-mono">Página {currentPage} de {totalPages}</span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Fecha de Registro</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Tienda</th>
                <th className="py-3 px-4">Tracking Origen</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Destino de Envío</th>
                <th className="py-3 px-4">Guía Almacén BeeBox</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {paginatedPrealertas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No se encontraron prealertas para el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                paginatedPrealertas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          item.status === "Confirmado" || item.status === "Vinculado" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status === "Vinculado" ? "Confirmado" : item.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{item.store}</td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-700">{item.trackingNumber}</td>
                    <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{item.description}</td>
                    <td className="py-4 px-4">
                      {item.status === "Confirmado" || item.status === "Vinculado" ? (
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {item.destination || "Caracas, Venezuela"}
                        </span>
                      ) : (
                        <select
                          value={destinationInput[item.id] || item.destination || "Caracas, Venezuela"}
                          onChange={(e) =>
                            setDestinationInput({ ...destinationInput, [item.id]: e.target.value })
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        >
                          <option value="Caracas, Venezuela">🇻🇪 Caracas, Venezuela</option>
                          <option value="Bogotá, Colombia">🇨🇴 Bogotá, Colombia</option>
                          <option value="Medellín, Colombia">🇨🇴 Medellín, Colombia</option>
                          <option value="Valencia, Venezuela">🇻🇪 Valencia, Venezuela</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {item.warehouseGuide ? (
                        <span className="font-mono font-bold text-emerald-700">{item.warehouseGuide}</span>
                      ) : (
                        <input
                          type="text"
                          placeholder="Ej. OK-440192"
                          value={warehouseGuideInput[item.id] || ""}
                          onChange={(e) =>
                            setWarehouseGuideInput({ ...warehouseGuideInput, [item.id]: e.target.value })
                          }
                          className="w-32 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        onClick={() => handleConfirmPrealerta(item.id, item.trackingNumber, item.destination)}
                        disabled={item.status === "Confirmado" || item.status === "Vinculado"}
                        variant={item.status === "Confirmado" || item.status === "Vinculado" ? "outline" : "amber"}
                        size="sm"
                        className="rounded-xl px-3.5 py-1.5 font-bold text-xs"
                      >
                        {item.status === "Confirmado" || item.status === "Vinculado" ? (
                          <>
                            <Check className="w-3.5 h-3.5 mr-1 text-emerald-600 stroke-[3]" /> Confirmado
                          </>
                        ) : (
                          <>
                            <PackageCheck className="w-3.5 h-3.5 mr-1" /> Confirmar Llegada
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>Mostrando {paginatedPrealertas.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}–{Math.min(currentPage * pageSize, filteredPrealertas.length)} de {filteredPrealertas.length} prealertas</span>

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
