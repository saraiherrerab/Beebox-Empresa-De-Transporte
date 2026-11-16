"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  Upload,
  Plus,
  CheckCircle2,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";

// Normaliza texto para búsqueda insensible a mayúsculas y tildes (OBS-03)
const normalizeSearchText = (text?: string) =>
  (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const formatCurrencyUSD = (val?: string | number) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

function PrealertasContent() {
  const { user, prealertas, addPrealerta, updatePrealerta, refreshPrealertas } = useAuth();
  const searchParams = useSearchParams();
  const isNuevaParam = searchParams.get("nueva") === "true";

  // Create Modal Form States
  const [store, setStore] = useState("");
  const [customStore, setCustomStore] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [providerWarehouseReceipt, setProviderWarehouseReceipt] = useState("");
  const [description, setDescription] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [destination, setDestination] = useState("");
  const [customDestination, setCustomDestination] = useState("");
  const [availableDestinations, setAvailableDestinations] = useState<string[]>([
    "Caracas, Venezuela",
    "Bogotá, Colombia",
  ]);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [createErrorMsg, setCreateErrorMsg] = useState("");
  const [duplicatePrealertaItem, setDuplicatePrealertaItem] = useState<any | null>(null);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Edit Modal State
  const [editingPrealerta, setEditingPrealerta] = useState<any | null>(null);
  const [editStore, setEditStore] = useState("");
  const [editCustomStore, setEditCustomStore] = useState("");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editProviderWR, setEditProviderWR] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAmountPaid, setEditAmountPaid] = useState("");
  const [editDestination, setEditDestination] = useState("");
  const [editCustomDestination, setEditCustomDestination] = useState("");
  const [editErrorMsg, setEditErrorMsg] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Pagination, Search & Filter States
  const [showForm, setShowForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [searchInput, setSearchInput] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  useEffect(() => {
    if (isNuevaParam) {
      setShowForm(true);
    }
  }, [isNuevaParam]);

  // Retardo de 300 ms para el buscador (OBS-03)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Cierre de modales con tecla Escape (OBS-01)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showForm) setShowForm(false);
        if (editingPrealerta) setEditingPrealerta(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showForm, editingPrealerta]);

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
          }
        }
      })
      .catch(() => {});
  }, [refreshPrealertas]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateErrorMsg("");
    setDuplicatePrealertaItem(null);

    const storeName = store === "Otra" ? customStore : store;
    const finalDestination = destination === "Otra" ? customDestination : destination;
    const cleanTracking = trackingNumber.trim();
    const numericAmount = Number(amountPaid);

    if (!storeName.trim()) {
      setCreateErrorMsg("Por favor selecciona o ingresa la tienda de origen.");
      return;
    }
    if (!finalDestination.trim()) {
      setCreateErrorMsg("Por favor selecciona o ingresa el destino.");
      return;
    }
    if (!cleanTracking) {
      setCreateErrorMsg("Por favor ingresa el número de rastreo / tracking.");
      return;
    }
    if (!description.trim()) {
      setCreateErrorMsg("Por favor ingresa la descripción del paquete.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setCreateErrorMsg("El valor declarado (USD) debe ser un número positivo mayor a $0.00.");
      return;
    }
    if (numericAmount > 100000) {
      setCreateErrorMsg("El valor declarado supera el máximo permitido ($100,000.00 USD).");
      return;
    }

    // Validación previa de rastreo duplicado en listado del cliente (OBS-04)
    const existingLocal = prealertas.find(
      (p) => p.trackingNumber.trim().toLowerCase() === cleanTracking.toLowerCase()
    );
    if (existingLocal) {
      setDuplicatePrealertaItem(existingLocal);
      setCreateErrorMsg(
        `El número de rastreo "${cleanTracking}" ya está registrado en tu prealerta de ${existingLocal.store} (${existingLocal.description}).`
      );
      return;
    }

    setSubmittingCreate(true);
    try {
      await addPrealerta({
        store: storeName.trim(),
        trackingNumber: cleanTracking,
        providerWarehouseReceipt: providerWarehouseReceipt.trim() || undefined,
        description: description.trim(),
        amountPaid: numericAmount.toFixed(2),
        destination: finalDestination.trim(),
        receiptFileName: receiptFileName || undefined,
      });

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 4000);
      setShowForm(false);
      setStore("");
      setCustomStore("");
      setDestination("");
      setCustomDestination("");
      setTrackingNumber("");
      setProviderWarehouseReceipt("");
      setDescription("");
      setAmountPaid("");
      setReceiptFileName(null);
      setCreateErrorMsg("");
      setDuplicatePrealertaItem(null);
    } catch (err: any) {
      setCreateErrorMsg(err?.message || "No se pudo registrar la prealerta. Verifica los datos.");
    } finally {
      setSubmittingCreate(false);
    }
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
    setEditErrorMsg("");

    const finalStore = editStore === "Otra" ? editCustomStore : editStore;
    const finalDestination = editDestination === "Otra" ? editCustomDestination : editDestination;
    const cleanTracking = editTrackingNumber.trim();
    const numericAmount = Number(editAmountPaid);

    if (!cleanTracking) {
      setEditErrorMsg("El número de rastreo es obligatorio.");
      return;
    }
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setEditErrorMsg("El valor declarado (USD) debe ser un monto positivo mayor a $0.00.");
      return;
    }
    if (numericAmount > 100000) {
      setEditErrorMsg("El valor declarado supera el máximo permitido ($100,000.00 USD).");
      return;
    }

    const duplicateLocal = prealertas.find(
      (p) =>
        p.id !== editingPrealerta.id &&
        p.trackingNumber.trim().toLowerCase() === cleanTracking.toLowerCase()
    );
    if (duplicateLocal) {
      setEditErrorMsg(
        `El número de rastreo "${cleanTracking}" ya pertenece a otra prealerta (${duplicateLocal.store} — ${duplicateLocal.description}).`
      );
      return;
    }

    setSubmittingEdit(true);
    try {
      await updatePrealerta(editingPrealerta.id, {
        store: finalStore.trim(),
        trackingNumber: cleanTracking,
        providerWarehouseReceipt: editProviderWR.trim() || undefined,
        description: editDescription.trim(),
        amountPaid: numericAmount.toFixed(2),
        destination: finalDestination.trim(),
      });
      setEditingPrealerta(null);
    } catch (err: any) {
      setEditErrorMsg(err.message || "Error al actualizar la prealerta.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const filteredPrealertas = prealertas.filter((item) => {
    const isConfirmed = item.status === "Confirmado" || item.status === "Vinculado";
    if (statusFilter === "Prealertado" && item.status !== "Prealertado") return false;
    if (statusFilter === "Confirmado" && !isConfirmed) return false;

    if (debouncedSearch.trim()) {
      const q = normalizeSearchText(debouncedSearch.trim());
      const matches =
        normalizeSearchText(item.trackingNumber).includes(q) ||
        normalizeSearchText(item.store).includes(q) ||
        normalizeSearchText(item.description).includes(q) ||
        normalizeSearchText(item.destination).includes(q) ||
        normalizeSearchText(item.providerWarehouseReceipt).includes(q) ||
        normalizeSearchText(item.warehouseGuide).includes(q);
      if (!matches) return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredPrealertas.length / pageSize) || 1;
  const paginatedPrealertas = filteredPrealertas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Formateo en hora local del cliente sin cortar la hora UTC (OBS-02)
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Reciente";
    try {
      // Si por algún registro legado solo viene YYYY-MM-DD, interpretarlo en zona local para no restar horas
      const normalized = /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? `${dateStr}T12:00:00` : dateStr;
      const d = new Date(normalized);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("es-VE", {
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
            Notifica las compras realizadas en tiendas online (Amazon, eBay, Walmart) antes de que lleguen a tu casillero{" "}
            <span className="font-mono font-bold text-amber-600">{user?.suiteCode}</span>.
          </p>
        </div>

        {user?.active !== false ? (
          <Button
            onClick={() => {
              setCreateErrorMsg("");
              setDuplicatePrealertaItem(null);
              setShowForm(true);
            }}
            variant="amber"
            className="rounded-2xl px-6 py-3 font-bold text-xs uppercase shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
            NUEVA PREALERTA
          </Button>
        ) : (
          <span className="px-4 py-3 rounded-2xl bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider shadow-sm border border-rose-200">
            ⚠️ Cuenta Inhabilitada
          </span>
        )}
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ¡Prealerta registrada exitosamente! El equipo en el almacén de Oklahoma (EE.UU.) corroborará la llegada de tu paquete y confirmará su despacho al destino seleccionado.
        </div>
      )}

      {/* Modal de Alta de Prealerta (OBS-01) */}
      {showForm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="nueva-prealerta-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowForm(false);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 id="nueva-prealerta-title" className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" /> Registrar Nueva Prealerta
              </h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Cerrar ventana modal"
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createErrorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{createErrorMsg}</span>
                </div>
                {duplicatePrealertaItem && (
                  <div className="pt-1 pl-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const target = duplicatePrealertaItem;
                        setShowForm(false);
                        setSearchInput(target.trackingNumber);
                        if (target.status === "Prealertado") {
                          openEditModal(target);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-[11px] font-black transition-colors"
                    >
                      {duplicatePrealertaItem.status === "Prealertado"
                        ? "Abrir prealerta existente para editarla →"
                        : "Ver prealerta existente en el listado →"}
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tienda de Origen */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tienda / Plataforma de Origen *
                  </label>
                  <select
                    required
                    autoFocus
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Selecciona una tienda o plataforma * --
                    </option>
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
                    <MapPin className="w-3.5 h-3.5 text-amber-500" /> Destino Final del Envío *
                  </label>
                  <select
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Selecciona el destino final * --
                    </option>
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
                    Número de Rastreo / Tracking *
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
                    Warehouse Proveedor / Recibo (Opcional)
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
                    Descripción del Paquete *
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

                {/* Monto Pagado (OBS-05) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Valor Declarado (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100000"
                    required
                    placeholder="Ej. 120.00"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:outline-none ${
                      amountPaid !== "" && Number(amountPaid) <= 0
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/40"
                        : "border-slate-200 focus:border-amber-500"
                    }`}
                  />
                  {amountPaid !== "" && Number(amountPaid) <= 0 && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1">
                      El monto declarado debe ser un valor positivo mayor a $0.00.
                    </p>
                  )}
                </div>
              </div>

              {/* Adjuntar Comprobante */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Adjuntar Comprobante / Factura (Opcional)
                </label>
                <label className="border-2 border-dashed border-slate-200 hover:border-amber-500 rounded-2xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50">
                  <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} className="hidden" />
                  <Upload className="w-6 h-6 text-amber-500 mb-1.5" />
                  {receiptFileName ? (
                    <span className="text-xs font-bold text-emerald-600">{receiptFileName}</span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500">
                      Sube la factura digital en formato PDF o Imagen
                    </span>
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
                <Button
                  type="submit"
                  variant="amber"
                  disabled={submittingCreate || (amountPaid !== "" && Number(amountPaid) <= 0)}
                  className="rounded-2xl px-6 py-3 font-bold text-xs disabled:opacity-50"
                >
                  {submittingCreate ? "GUARDANDO..." : "REGISTRAR PREALERTA"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Prealerta Modal */}
      {editingPrealerta && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingPrealerta(null);
          }}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-500" /> Editar Prealerta
              </h3>
              <button
                type="button"
                onClick={() => setEditingPrealerta(null)}
                aria-label="Cerrar modal de edición"
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editErrorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{editErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tienda</label>
                  <select
                    required
                    value={editStore}
                    onChange={(e) => setEditStore(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Selecciona una tienda * --
                    </option>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Destino Solicitado *
                  </label>
                  <select
                    required
                    value={editDestination}
                    onChange={(e) => setEditDestination(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="" disabled>
                      -- Selecciona el destino * --
                    </option>
                    {availableDestinations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Tracking Tienda *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Warehouse Proveedor (WR#)
                  </label>
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
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Valor Declarado (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="100000"
                    required
                    value={editAmountPaid}
                    onChange={(e) => setEditAmountPaid(e.target.value)}
                    className={`w-full rounded-2xl border bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:outline-none ${
                      editAmountPaid !== "" && Number(editAmountPaid) <= 0
                        ? "border-rose-400 focus:border-rose-500 bg-rose-50/40"
                        : "border-slate-200 focus:border-amber-500"
                    }`}
                  />
                  {editAmountPaid !== "" && Number(editAmountPaid) <= 0 && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1">
                      El monto declarado debe ser mayor a $0.00.
                    </p>
                  )}
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
                <Button
                  type="submit"
                  variant="amber"
                  disabled={submittingEdit || (editAmountPaid !== "" && Number(editAmountPaid) <= 0)}
                  className="rounded-2xl px-6 py-3 font-bold text-xs disabled:opacity-50"
                >
                  {submittingEdit ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Unified Card Container */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        {/* Top Header, Search Bar (OBS-03) & Status Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <h3 className="text-lg font-bold text-slate-900 shrink-0">
            Prealertas Registradas ({filteredPrealertas.length})
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto justify-end">
            {/* Buscador de Prealertas (OBS-03) */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar rastreo, tienda, descripción..."
                aria-label="Buscar prealertas por número de rastreo, descripción, tienda o destino"
                className="w-full pl-10 pr-8 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setDebouncedSearch("");
                    setCurrentPage(1);
                  }}
                  title="Limpiar búsqueda"
                  aria-label="Limpiar búsqueda"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Tabs Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl shrink-0 self-start sm:self-auto">
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
                  <td colSpan={9} className="py-10 text-center text-slate-400 space-y-2">
                    <p className="font-semibold text-slate-500">
                      {debouncedSearch.trim()
                        ? `No se encontraron prealertas para "${debouncedSearch}".`
                        : "No tienes prealertas para el filtro seleccionado."}
                    </p>
                    {(debouncedSearch.trim() || statusFilter !== "TODOS") && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchInput("");
                          setDebouncedSearch("");
                          setStatusFilter("TODOS");
                          setCurrentPage(1);
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" /> Limpiar filtros y volver al listado completo
                      </button>
                    )}
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
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        {formatCurrencyUSD(item.amountPaid)}
                      </td>
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
          <span className="font-mono font-bold text-slate-700">
            Página {currentPage} de {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 flex items-center gap-1 text-[11px]"
            >
              <ChevronLeft className="w-4 h-4" /> ANTERIOR
            </button>
            <span className="font-mono font-bold px-2 text-slate-800">
              {currentPage} / {totalPages}
            </span>
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
