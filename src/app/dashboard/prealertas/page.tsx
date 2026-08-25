"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Package, Upload, Plus, CheckCircle2, FileText, MapPin, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

function PrealertasContent() {
  const { user, prealertas, addPrealerta } = useAuth();
  const searchParams = useSearchParams();
  const isNuevaParam = searchParams.get("nueva") === "true";

  const [store, setStore] = useState("Amazon US");
  const [customStore, setCustomStore] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [description, setDescription] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [destination, setDestination] = useState("Caracas, Venezuela");
  const [customDestination, setCustomDestination] = useState("");
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);

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
      description,
      amountPaid: amountPaid || "0.00",
      destination: finalDestination || "Caracas, Venezuela",
      receiptFileName: receiptFileName || undefined,
    });

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
    setShowForm(false);
    setTrackingNumber("");
    setDescription("");
    setAmountPaid("");
    setReceiptFileName(null);
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

              {/* Destino de Envío */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> Destino Final del Envío
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Caracas, Venezuela">🇻🇪 Caracas, Venezuela</option>
                  <option value="Bogotá, Colombia">🇨🇴 Bogotá, Colombia</option>
                  <option value="Otra">🌎 Otro Destino...</option>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <th className="py-3 px-4">Fecha de Registro</th>
                <th className="py-3 px-4">Tienda</th>
                <th className="py-3 px-4">Número de Rastreo</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Destino Solicitado</th>
                <th className="py-3 px-4">Valor USD</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {paginatedPrealertas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No tienes prealertas para el filtro seleccionado.
                  </td>
                </tr>
              ) : (
                paginatedPrealertas.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-slate-600 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">{item.store}</td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-600">{item.trackingNumber}</td>
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
                      {item.receiptFileName ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <FileText className="w-3.5 h-3.5 text-slate-500" /> PDF
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">N/A</span>
                      )}
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
