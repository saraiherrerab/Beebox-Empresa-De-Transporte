"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Package, Upload, Plus, CheckCircle2, FileText, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

function PrealertasContent() {
  const { user, prealertas, addPrealerta, updatePrealerta, refreshPrealertas } = useAuth();
  const searchParams = useSearchParams();
  const isNuevaParam = searchParams.get("nueva") === "true";

  const [store, setStore] = useState("Amazon US");
  const [customStore, setCustomStore] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [providerWarehouseReceipt, setProviderWarehouseReceipt] = useState("");
  const [description, setDescription] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [destination, setDestination] = useState("Caracas, Venezuela");
  const [customDestination, setCustomDestination] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([
    "Caracas, Venezuela",
    "Bogotá, Colombia",
  ]);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

  // Edit Modal State
  const [editingPrealerta, setEditingPrealerta] = useState<any | null>(null);
  const [editStore, setEditStore] = useState("Amazon US");
  const [editCustomStore, setEditCustomStore] = useState("");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editProviderWR, setEditProviderWR] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmountPaid, setEditAmountPaid] = useState("");
  const [editDestination, setEditDestination] = useState("Caracas, Venezuela");
  const [editCustomDestination, setEditCustomDestination] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");

  // Pagination & Filter States
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  useEffect(() => {
    if (isNuevaParam) {
      setShowForm(true);
    }
  }, [isNuevaParam]);

  // Fetch dynamic destination routes configured by admin
  useEffect(() => {
    refreshPrealertas();
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    fetch(`${API_URL}/routes`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        let routeList: any[] = [];
        if (Array.isArray(data)) routeList = data;
        else if (data && data.routes && Array.isArray(data.routes)) routeList = data.routes;

        if (routeList.length > 0) {
          const dests = Array.from(
            new Set(routeList.map((r: any) => r.destCity).filter(Boolean))
          ) as string[];
          if (dests.length > 0) {
            setAvailableDestinations(dests);
            setDestination(dests[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storeName = store === "Otra" ? customStore : store;
    const finalDestination = destination === "Otra" ? customDestination : destination;

    addPrealerta({
      store: storeName || "Tienda Online",
      trackingNumber,
      providerWarehouseReceipt: providerWarehouseReceipt || undefined,
      description,
      amountPaid: amountPaid || "0.00",
      destination: finalDestination || "Caracas, Venezuela",
      receiptFileName: receiptFileName || undefined,
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
    setShowForm(false);
    setTrackingNumber("");
    setProviderWarehouseReceipt("");
    setDescription("");
    setAmountPaid("");
    setReceiptFileName(null);
  };

  const openEditModal = (item: any) => {
    setEditErrorMsg("");
    setEditingPrealerta(item);
    if (["Amazon US", "eBay US", "Walmart US", "Apple Store", "AliExpress"].includes(item.store)) {
      setEditStore(item.store);
      setEditCustomStore("");
    } else {
      setEditStore("Otra");
      setEditCustomStore(item.store);
    }
    setEditTrackingNumber(item.trackingNumber || "");
    setEditProviderWR(item.providerWarehouseReceipt || "");
    setEditDescription(item.description || "");
    setEditAmountPaid(item.amountPaid || "0.00");
    if (availableDestinations.includes(item.destination)) {
      setEditDestination(item.destination);
      setEditCustomDestination("");
    } else {
      setEditDestination("Otra");
      setEditCustomDestination(item.destination || "");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrealerta) return;
    const finalStore = editStore === "Otra" ? editCustomStore : editStore;
    const finalDestination = editDestination === "Otra" ? editCustomDestination : editDestination;

    try {
      await updatePrealerta(editingPrealerta.id, {
        store: finalStore,
        trackingNumber: editTrackingNumber,
        providerWarehouseReceipt: editProviderWR || undefined,
        description: editDescription,
        amountPaid: editAmountPaid,
        destination: finalDestination,
      });
      setEditingPrealerta(null);
    } catch (err: any) {
      setEditErrorMsg(err.message || "Error al actualizar la prealerta.");
    }
  };

  const filteredPrealertas = prealertas.filter((item) => {
    const isConfirmed = item.status === "Confirmado" || item.status === "Vinculado";
    if (statusFilter === "TODOS") return true;
    if (statusFilter === "Prealertado") return item.status === "Prealertado";
    if (statusFilter === "Confirmado") return isConfirmed;
    return true;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Prealertas de Compras</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Notifica las compras realizadas en tiendas online (Amazon, eBay, Walmart) antes de que lleguen a tu casillero <span className="font-mono font-bold text-amber-600">{user?.suiteCode}</span>.
          </p>
        </div>

        {user?.active !== false ? (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="amber"
            className="rounded-2xl px-6 py-3 font-bold text-xs uppercase shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
            {showForm ? "CERRAR FORMULARIO" : "NUEVA PREALERTA"}
          </Button>
        ) : (
          <span className="px-4 py-3 rounded-2xl bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider shadow-sm border border-rose-200">
            ⚠️ Cuenta Inhabilitada
          </span>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ¡Prealerta registrada exitosamente! El equipo en el almacén de Oklahoma (EE.UU.) corroborará la llegada de tu paquete y confirmará su despacho al destino seleccionado.
        </div>
      )}

      {/* Prealerta Registration Form Modal/Card */}
      {showForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" /> Formulario de Registro de Prealerta
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tienda de Origen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tienda / Plataforma de Origen
                </label>
                <select
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Amazon US">Amazon US</option>
                  <option value="eBay US">eBay US</option>
                  <option value="Walmart US">Walmart US</option>
                  <option value="Apple Store">Apple Store</option>
                  <option value="AliExpress">AliExpress</option>
                  <option value="Otra">Otra tienda...</option>
                </select>
                {store === "Otra" && (
                  <input
                    type="text"
                    required
                    placeholder="Nombre del comercio"
                    value={customStore}
                    onChange={(e) => setCustomStore(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 mt-2 focus:border-amber-500 focus:outline-none"
                  />
                )}
              </div>

              {/* Destino de Envío Dinámico desde Backend */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> Destino Final del Envío (Configurado en Sistema)
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  {availableDestinations.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                  <option value="Otra">Otro Destino...</option>
                </select>
                {destination === "Otra" && (
                  <input
                    type="text"
                    required
                    placeholder="Ej. Medellín, Colombia / Maracaibo, Venezuela"
                    value={customDestination}
                    onChange={(e) => setCustomDestination(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 mt-2 focus:border-amber-500 focus:outline-none"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tracking Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Número de Rastreo / Tracking
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: TBA1234567890 o 9400111..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Warehouse Proveedor (WR#) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Warehouse Proveedor / Recibo de Almacén (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: WR-987654 / WH-2026-ABC"
                  value={providerWarehouseReceipt}
                  onChange={(e) => setProviderWarehouseReceipt(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Identificador asignado por el almacén del proveedor externo (si lo posees).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Descripción Técnica */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Descripción del Paquete
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Laptop Asus Zenbook + Adaptador"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Monto Pagado */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Valor Declarado (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Adjuntar Comprobante */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Adjuntar Comprobante / Factura (Opcional)
              </label>
              <label className="border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50">
                <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="hidden" />
                <Upload className="w-6 h-6 text-amber-500 mb-2" />
                {receiptFileName ? (
                  <span className="text-xs font-bold text-emerald-600">{receiptFileName}</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">Sube la factura digital en formato PDF o Imagen</span>
                )}
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                CANCELAR
              </button>
              <Button type="submit" variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs">
                REGISTRAR PREALERTA
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Prealerta Modal */}
      {editingPrealerta && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" /> Editar Prealerta
            </h3>

            {editErrorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                ⚠️ {editErrorMsg}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tienda</label>
                  <select
                    value={editStore}
                    onChange={(e) => setEditStore(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Amazon US">Amazon US</option>
                    <option value="eBay US">eBay US</option>
                    <option value="Walmart US">Walmart US</option>
                    <option value="Apple Store">Apple Store</option>
                    <option value="AliExpress">AliExpress</option>
                    <option value="Otra">Otra tienda...</option>
                  </select>
                  {editStore === "Otra" && (
                    <input
                      type="text"
                      required
                      placeholder="Nombre del comercio"
                      value={editCustomStore}
                      onChange={(e) => setEditCustomStore(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 mt-2 focus:border-amber-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Destino Solicitado</label>
                  <select
                    value={editDestination}
                    onChange={(e) => setEditDestination(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    {availableDestinations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="Otra">Otro Destino...</option>
                  </select>
                  {editDestination === "Otra" && (
                    <input
                      type="text"
                      required
                      placeholder="Ej. Medellín, Colombia"
                      value={editCustomDestination}
                      onChange={(e) => setEditCustomDestination(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 mt-2 focus:border-amber-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tracking Tienda</label>
                  <input
                    type="text"
                    required
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Warehouse Proveedor (WR#)</label>
                  <input
                    type="text"
                    placeholder="Ej: WR-987654"
                    value={editProviderWR}
                    onChange={(e) => setEditProviderWR(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Descripción</label>
                  <input
                    type="text"
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Valor Declarado (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editAmountPaid}
                    onChange={(e) => setEditAmountPaid(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingPrealerta(null)}
                  className="px-5 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  CANCELAR
                </button>
                <Button type="submit" variant="amber" className="rounded-2xl px-6 py-3 font-bold text-xs">
                  GUARDAR CAMBIOS
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Unified Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Header & Status Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <h3 className="text-lg font-bold text-slate-900">Prealertas Registradas ({filteredPrealertas.length})</h3>

          {/* Status Tabs Filter */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {["TODOS", "Prealertado", "Confirmado"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all ${
                  statusFilter === status
                    ? "bg-amber-500 text-slate-950 shadow-md font-black"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {status === "TODOS" ? "TODAS" : status.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Tienda</th>
                <th className="py-3 px-4">Rastreo / Tracking</th>
                <th className="py-3 px-4">WR Proveedor</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Destino</th>
                <th className="py-3 px-4">Valor USD</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {paginatedPrealertas.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No tienes prealertas para el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                paginatedPrealertas.map((item) => {
                  const isEditable = item.status === "Prealertado";
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold">
                          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          {formatDate(item.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">{item.store}</td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">{item.trackingNumber}</td>
                      <td className="py-4 px-4">
                        {item.providerWarehouseReceipt ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                            {item.providerWarehouseReceipt}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-700 max-w-xs truncate">{item.description}</td>
                      <td className="py-4 px-4 font-bold text-slate-800">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          {item.destination || "Caracas, Venezuela"}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">${item.amountPaid}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            item.status === "Prealertado"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {item.status === "Vinculado" ? "Confirmado" : item.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isEditable ? (
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-[11px] text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 transition-colors shadow-sm"
                          >
                            EDITAR
                          </button>
                        ) : (
                          <span
                            title="No es posible editar una prealerta en tránsito o confirmada"
                            className="px-3 py-1.5 rounded-xl border border-slate-100 bg-slate-50 font-bold text-[11px] text-slate-400 cursor-not-allowed inline-block"
                          >
                            BLOQUEADO
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
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
    </div>
  );
}

export default function PrealertasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Cargando prealertas...</div>}>
      <PrealertasContent />
    </Suspense>
  );
}
