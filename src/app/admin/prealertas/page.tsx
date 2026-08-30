"use client";

import React, { useState, useEffect } from "react";
import { useAuth, PrealertaItem } from "@/context/AuthContext";
import { CheckCircle2, Check, Search, MapPin, PackageCheck, Calendar, ChevronLeft, ChevronRight, RefreshCw, Edit3, X, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

export default function AdminPrealertasPage() {
  const { prealertas, linkPrealerta, updatePrealerta, refreshPrealertas } = useAuth();
  const [searchTracking, setSearchTracking] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([
    "Caracas, Venezuela",
    "Bogotá, Colombia",
  ]);
  const pageSize = 5;

  const [warehouseGuideInput, setWarehouseGuideInput] = useState<{ [key: string]: string }>({});
  const [destinationInput, setDestinationInput] = useState<{ [key: string]: string }>({});
  const [providerWRInput, setProviderWRInput] = useState<{ [key: string]: string }>({});
  const [linkedNotice, setLinkedNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<PrealertaItem | null>(null);
  const [editStore, setEditStore] = useState("");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editProviderWR, setEditProviderWR] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmountPaid, setEditAmountPaid] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editStatus, setEditStatus] = useState<string>("Prealertado");
  const [editSubmitting, setEditSubmitting] = useState(false);

  useEffect(() => {
    refreshPrealertas();

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/destinations/countries`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const list: string[] = [];
            data.forEach((c: any) => {
              if (c.cities && c.cities.length > 0) {
                c.cities.forEach((city: any) => list.push(`${city.name}, ${c.name}`));
              } else {
                list.push(c.name);
              }
            });
            if (list.length > 0) setAvailableDestinations(list);
          }
        })
        .catch(() => {});
    }
  }, [refreshPrealertas]);

  const handleOpenEdit = (item: PrealertaItem) => {
    setEditingItem(item);
    setEditStore(item.store);
    setEditTrackingNumber(item.trackingNumber);
    setEditProviderWR(item.providerWarehouseReceipt || "");
    setEditDescription(item.description);
    setEditAmountPaid(item.amountPaid);
    setEditDestination(item.destination || availableDestinations[0] || "Caracas, Venezuela");
    setEditStatus(item.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setEditSubmitting(true);

    try {
      await updatePrealerta(editingItem.id, {
        store: editStore,
        trackingNumber: editTrackingNumber,
        providerWarehouseReceipt: editProviderWR || undefined,
        description: editDescription,
        amountPaid: editAmountPaid,
        destination: editDestination,
        status: editStatus as any,
      });

      setLinkedNotice(`Prealerta '${editTrackingNumber}' actualizada correctamente.`);
      setEditingItem(null);
      setTimeout(() => setLinkedNotice(null), 4000);
    } catch (err: any) {
      alert(err.message || "Error al actualizar la prealerta.");
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleConfirmPrealerta = async (id: string, trackingNumber: string, defaultDest?: string) => {
    setLoading(true);
    const guide = warehouseGuideInput[id] || `OK-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalDest = destinationInput[id] || defaultDest || availableDestinations[0] || "Caracas, Venezuela";
    const currentItem = prealertas.find((p) => p.id === id);
    const finalProviderWR = providerWRInput[id] !== undefined ? providerWRInput[id] : (currentItem?.providerWarehouseReceipt || "");

    try {
      await linkPrealerta(id, guide, finalDest, finalProviderWR || undefined);
      await refreshPrealertas();
      setLinkedNotice(`Prealerta ${trackingNumber} confirmada exitosamente en el almacén con la Guía ${guide} y destino ${finalDest}.`);
      setTimeout(() => setLinkedNotice(null), 5000);
    } catch (err) {
      console.error("Error confirmando prealerta:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrealertas = prealertas.filter((item) => {
    const searchLower = (searchTracking || "").toLowerCase();
    const matchesSearch =
      item.trackingNumber.toLowerCase().includes(searchLower) ||
      (item.providerWarehouseReceipt || "").toLowerCase().includes(searchLower) ||
      item.store.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      (item.destination || "").toLowerCase().includes(searchLower) ||
      (item.userName || "").toLowerCase().includes(searchLower) ||
      (item.userSuite || "").toLowerCase().includes(searchLower);

    const isConfirmed = item.status === "Confirmado" || item.status === "Vinculado";
    const matchesStatus =
      statusFilter === "TODOS" ||
      (statusFilter === "POR CONFIRMAR" && !isConfirmed) ||
      (statusFilter === "CONFIRMADO" && isConfirmed);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Confirmación de Prealertas</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Corrobora la recepción física de paquetes en el almacén de Oklahoma (EE.UU.), audita datos y asigna la guía de envío internacional.
          </p>
        </div>

        <button
          onClick={() => refreshPrealertas()}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar Prealertas
        </button>
      </div>

      {linkedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {linkedNotice}
        </div>
      )}

      {/* Single Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Controls: Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
          {/* Status Tabs Filter */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
            {["TODOS", "POR CONFIRMAR", "CONFIRMADO"].map((status) => (
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
                {status}
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
              placeholder="Buscar por tracking, cliente, casillero, tienda..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Prealertas ({filteredPrealertas.length})</h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Fecha de Registro</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Cliente / Casillero</th>
                <th className="py-3 px-4">Tienda</th>
                <th className="py-3 px-4">Tracking Origen</th>
                <th className="py-3 px-4">WR Proveedor</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Destino de Envío</th>
                <th className="py-3 px-4">Guía Almacén BeeBox</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {paginatedPrealertas.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
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
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{item.userName || "Cliente BeeBox"}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{item.userSuite || "CAS-OK-HUB"}</span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{item.store}</td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{item.trackingNumber}</td>
                    <td className="py-4 px-4">
                      {item.status === "Confirmado" || item.status === "Vinculado" ? (
                        item.providerWarehouseReceipt ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            {item.providerWarehouseReceipt}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">-</span>
                        )
                      ) : (
                        <input
                          type="text"
                          placeholder="Ej. WR-98765"
                          value={providerWRInput[item.id] !== undefined ? providerWRInput[item.id] : (item.providerWarehouseReceipt || "")}
                          onChange={(e) =>
                            setProviderWRInput({ ...providerWRInput, [item.id]: e.target.value })
                          }
                          className="w-28 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 max-w-[160px] truncate" title={item.description}>
                      {item.description}
                    </td>
                    <td className="py-4 px-4">
                      {item.status === "Confirmado" || item.status === "Vinculado" ? (
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-500" />
                          {item.destination || "Caracas, Venezuela"}
                        </span>
                      ) : (
                        <select
                          value={destinationInput[item.id] || item.destination || availableDestinations[0] || "Caracas, Venezuela"}
                          onChange={(e) =>
                            setDestinationInput({ ...destinationInput, [item.id]: e.target.value })
                          }
                          className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        >
                          {availableDestinations.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
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
                      <div className="flex items-center justify-end gap-2">
                        {item.status !== "Confirmado" && item.status !== "Vinculado" && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Editar Prealerta"
                            className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold transition-all shadow-sm flex items-center gap-1 text-[11px] px-2.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            Editar
                          </button>
                        )}

                        <Button
                          onClick={() => handleConfirmPrealerta(item.id, item.trackingNumber, item.destination)}
                          disabled={item.status === "Confirmado" || item.status === "Vinculado" || loading}
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Controls */}
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

      {/* Edit Prealerta Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditingItem(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold mb-2">
                <Edit3 className="w-3.5 h-3.5" /> Auditoría de Almacén
              </div>
              <h2 className="text-xl font-black text-slate-900">Editar Prealerta</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Corrige los datos del paquete recibido antes de proceder a la confirmación final y despacho.
              </p>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tienda de Origen</label>
                  <input
                    type="text"
                    required
                    value={editStore}
                    onChange={(e) => setEditStore(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Tracking Courier Origen</label>
                  <input
                    type="text"
                    required
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">WR Proveedor / Recibo Almacén</label>
                  <input
                    type="text"
                    placeholder="Ej. WR-98765"
                    value={editProviderWR}
                    onChange={(e) => setEditProviderWR(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Valor Declarado ($USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editAmountPaid}
                    onChange={(e) => setEditAmountPaid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Descripción del Contenido</label>
                <textarea
                  rows={2}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Destino de Envío</label>
                  <select
                    value={editDestination}
                    onChange={(e) => setEditDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    {availableDestinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Estado Operacional</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Prealertado">Prealertado</option>
                    <option value="Recibido en Almacén">Recibido en Almacén</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <Button
                  type="submit"
                  disabled={editSubmitting}
                  variant="amber"
                  className="rounded-xl px-5 py-2.5 font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
