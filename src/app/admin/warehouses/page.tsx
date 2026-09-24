"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Warehouse,
  Plus,
  Search,
  Filter,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Eye,
  Printer,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Scale,
  Laptop,
  Boxes,
  MapPin,
  User,
  Phone,
  RefreshCw,
} from "lucide-react";
import { API_URL } from "@/config/api";
import { Button } from "@/components/ui/Button";

export interface WarehouseItem {
  id: string;
  warehouseCode: string;
  clientName: string;
  clientSuite?: string;
  clientPhone?: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  destination: string;
  serviceType: "Aéreo Express" | "Marítimo Estándar";
  pieces: number;
  weightKg: number;
  dimensions?: string;
  declaredValue: number;
  contentDescription: string;
  containElectronics: boolean;
  electronicsDetails?: string;
  status: "DISPONIBLE" | "EN_GUIA_SALIDA" | "DESPACHADO" | "ENTREGADO";
  assignedGuiaCode?: string | null;
  trackingOrigin?: string;
  notes?: string;
  createdAt: string;
}

const INITIAL_WAREHOUSES: WarehouseItem[] = [
  {
    id: "wh_1001",
    warehouseCode: "WR-89210",
    clientName: "Roberto Mendoza",
    clientSuite: "BBX-1042",
    clientPhone: "+1 918 555 0192",
    recipientName: "Mariana Mendoza",
    recipientPhone: "+58 412 889 1234",
    recipientAddress: "Av. Francisco de Miranda, Edif. Parque Cristal, Piso 8, Chacao",
    destination: "Caracas, Venezuela",
    serviceType: "Aéreo Express",
    pieces: 2,
    weightKg: 4.8,
    dimensions: "35x25x20 cm",
    declaredValue: 240,
    contentDescription: "Prendas de vestir deportivas y calzado Nike",
    containElectronics: false,
    status: "DISPONIBLE",
    assignedGuiaCode: null,
    trackingOrigin: "1Z99999999281726",
    notes: "Revisado y pesado en almacén de Broken Arrow, OK",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "wh_1002",
    warehouseCode: "WR-89211",
    clientName: "Elena Villarreal",
    clientSuite: "BBX-2089",
    clientPhone: "+1 918 555 0831",
    recipientName: "Carlos Villarreal",
    recipientPhone: "+58 424 771 9043",
    recipientAddress: "Urb. Las Mercedes, Calle París, Qta. Los Robles",
    destination: "Caracas, Venezuela",
    serviceType: "Aéreo Express",
    pieces: 1,
    weightKg: 2.2,
    dimensions: "30x20x15 cm",
    declaredValue: 750,
    contentDescription: "Laptop HP Pavilion 15 pulg y accesorios",
    containElectronics: true,
    electronicsDetails: "1 Laptop HP Pavilion 15 pulg Core i7",
    status: "DISPONIBLE",
    assignedGuiaCode: null,
    trackingOrigin: "TBA309182391000",
    notes: "Caja con precinto de seguridad e inspección técnica",
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "wh_1003",
    warehouseCode: "WR-89212",
    clientName: "Andrés Gil",
    clientSuite: "BBX-3150",
    clientPhone: "+1 918 555 0411",
    recipientName: "Beatriz Gil",
    recipientPhone: "+58 414 332 5590",
    recipientAddress: "Av. Bolívar Norte, Sector La Alegría, Res. Araguaney",
    destination: "Valencia, Venezuela",
    serviceType: "Marítimo Estándar",
    pieces: 3,
    weightKg: 18.5,
    dimensions: "50x40x40 cm",
    declaredValue: 410,
    contentDescription: "Repuestos automotrices, herramientas mecánicas y filtros",
    containElectronics: false,
    status: "DISPONIBLE",
    assignedGuiaCode: null,
    trackingOrigin: "FEDEX-901829102",
    notes: "Bultos agrupados sobre palet estándar",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

const DESTINOS = [
  "Caracas, Venezuela",
  "Valencia, Venezuela",
  "Maracaibo, Venezuela",
  "Barquisimeto, Venezuela",
  "Maracay, Venezuela",
  "Puerto Ordaz, Venezuela",
  "Lechería / Puerto La Cruz, Venezuela",
];

export default function WarehousesAdminPage() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [destinationFilter, setDestinationFilter] = useState<string>("TODOS");

  // Modal Crear Warehouse
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal Ver Detalle / Recibo de Almacén
  const [selectedWarehouseModal, setSelectedWarehouseModal] = useState<WarehouseItem | null>(null);

  // Form Fields
  const [formCode, setFormCode] = useState("");
  const [formClientName, setFormClientName] = useState("");
  const [formClientSuite, setFormClientSuite] = useState("");
  const [formClientPhone, setFormClientPhone] = useState("");
  const [formRecipientName, setFormRecipientName] = useState("");
  const [formRecipientPhone, setFormRecipientPhone] = useState("");
  const [formRecipientAddress, setFormRecipientAddress] = useState("");
  const [formDestination, setFormDestination] = useState(DESTINOS[0]);
  const [formServiceType, setFormServiceType] = useState<"Aéreo Express" | "Marítimo Estándar">("Aéreo Express");
  const [formPieces, setFormPieces] = useState<number>(1);
  const [formWeightKg, setFormWeightKg] = useState<number | "">(2.5);
  const [formDimensions, setFormDimensions] = useState("35x25x20 cm");
  const [formDeclaredValue, setFormDeclaredValue] = useState<number | "">(150);
  const [formContentDescription, setFormContentDescription] = useState("");
  const [formContainElectronics, setFormContainElectronics] = useState(false);
  const [formElectronicsDetails, setFormElectronicsDetails] = useState("");
  const [formTrackingOrigin, setFormTrackingOrigin] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const fetchWarehouses = useCallback(async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(`${API_URL}/warehouses`, { headers: authHeaders });
      const data = await res.json();
      if (data && Array.isArray(data.warehouses) && data.warehouses.length > 0) {
        // Merge with local storage
        let list = [...data.warehouses];
        if (typeof window !== "undefined") {
          try {
            const localSaved = JSON.parse(localStorage.getItem("beebox_warehouses") || "[]");
            if (Array.isArray(localSaved)) {
              for (const loc of localSaved) {
                if (!list.some((w) => w.id === loc.id || w.warehouseCode === loc.warehouseCode)) {
                  list.unshift(loc);
                }
              }
            }
          } catch {}
        }
        setWarehouses(list);
        return;
      }
    } catch {}

    // Fallback local
    if (typeof window !== "undefined") {
      try {
        const localSaved = JSON.parse(localStorage.getItem("beebox_warehouses") || "null");
        if (Array.isArray(localSaved) && localSaved.length > 0) {
          setWarehouses(localSaved);
          setLoading(false);
          return;
        }
      } catch {}
    }

    setWarehouses(INITIAL_WAREHOUSES);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWarehouses();
  }, [fetchWarehouses]);

  const saveWarehousesLocally = (newList: WarehouseItem[]) => {
    setWarehouses(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("beebox_warehouses", JSON.stringify(newList));
      } catch {}
    }
  };

  const handleOpenCreateModal = () => {
    const randomCode = `WR-${Math.floor(10000 + Math.random() * 90000)}`;
    setFormCode(randomCode);
    setFormClientName("");
    setFormClientSuite("");
    setFormClientPhone("");
    setFormRecipientName("");
    setFormRecipientPhone("");
    setFormRecipientAddress("");
    setFormDestination(DESTINOS[0]);
    setFormServiceType("Aéreo Express");
    setFormPieces(1);
    setFormWeightKg(2.5);
    setFormDimensions("35x25x20 cm");
    setFormDeclaredValue(150);
    setFormContentDescription("");
    setFormContainElectronics(false);
    setFormElectronicsDetails("");
    setFormTrackingOrigin("");
    setFormNotes("");
    setIsCreateModalOpen(true);
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim() || !formRecipientName.trim() || !formContentDescription.trim()) {
      alert("Por favor completa los campos obligatorios (Cliente, Destinatario y Descripción).");
      return;
    }

    setIsSubmitting(true);

    const newWh: WarehouseItem = {
      id: `wh_${Date.now()}`,
      warehouseCode: formCode.trim() || `WR-${Math.floor(10000 + Math.random() * 90000)}`,
      clientName: formClientName.trim(),
      clientSuite: formClientSuite.trim() || undefined,
      clientPhone: formClientPhone.trim() || undefined,
      recipientName: formRecipientName.trim(),
      recipientPhone: formRecipientPhone.trim(),
      recipientAddress: formRecipientAddress.trim(),
      destination: formDestination,
      serviceType: formServiceType,
      pieces: Number(formPieces) > 0 ? Number(formPieces) : 1,
      weightKg: Number(formWeightKg) > 0 ? Number(formWeightKg) : 1.0,
      dimensions: formDimensions.trim() || "Estándar",
      declaredValue: Number(formDeclaredValue) >= 0 ? Number(formDeclaredValue) : 0,
      contentDescription: formContentDescription.trim(),
      containElectronics: Boolean(formContainElectronics),
      electronicsDetails: formContainElectronics ? formElectronicsDetails.trim() : undefined,
      status: "DISPONIBLE",
      assignedGuiaCode: null,
      trackingOrigin: formTrackingOrigin.trim() || undefined,
      notes: formNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      await fetch(`${API_URL}/warehouses`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(newWh),
      });
    } catch {}

    const updated = [newWh, ...warehouses];
    saveWarehousesLocally(updated);

    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    alert(`Warehouse ${newWh.warehouseCode} creado exitosamente y disponible en almacén.`);
  };

  const handleDeleteWarehouse = async (id: string, code: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el Warehouse ${code}?`)) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await fetch(`${API_URL}/warehouses/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    } catch {}

    const updated = warehouses.filter((w) => w.id !== id && w.warehouseCode !== code);
    saveWarehousesLocally(updated);
  };

  // Filtered Warehouses
  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((w) => {
      const matchSearch =
        searchTerm === "" ||
        w.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.contentDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (w.trackingOrigin && w.trackingOrigin.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === "TODOS" ||
        (statusFilter === "DISPONIBLE" && w.status === "DISPONIBLE") ||
        (statusFilter === "EN_GUIA_SALIDA" && w.status === "EN_GUIA_SALIDA") ||
        (statusFilter === "DESPACHADO" && (w.status === "DESPACHADO" || w.status === "ENTREGADO"));

      const matchDestination =
        destinationFilter === "TODOS" || w.destination.toLowerCase().includes(destinationFilter.toLowerCase());

      return matchSearch && matchStatus && matchDestination;
    });
  }, [warehouses, searchTerm, statusFilter, destinationFilter]);

  // Metrics
  const totalCount = warehouses.length;
  const availableCount = warehouses.filter((w) => w.status === "DISPONIBLE").length;
  const inGuiaCount = warehouses.filter((w) => w.status === "EN_GUIA_SALIDA").length;
  const dispatchedCount = warehouses.filter((w) => w.status === "DESPACHADO" || w.status === "ENTREGADO").length;
  const totalWeightInWarehouse = warehouses
    .filter((w) => w.status === "DISPONIBLE")
    .reduce((acc, w) => acc + (typeof w.weightKg === "number" ? w.weightKg : 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Warehouse className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Gestión de Warehouses (Almacén de Origen)
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Recepción, pesaje y registro de recibos de almacén (WR) listos para consolidar en Guías de Salida.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/guias-salida">
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 text-xs font-extrabold flex items-center gap-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-blue-600" />
              Ver Guías de Salida
            </Button>
          </Link>

          <Button
            onClick={handleOpenCreateModal}
            className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Crear Warehouse
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Warehouses</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Recibos de almacén registrados</div>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <span>Disponibles en Almacén</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950">{availableCount}</div>
          <div className="text-[11px] text-emerald-700 font-medium">Listos para asignar a Guía de Salida</div>
        </div>

        <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span>En Guía de Salida</span>
            <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-950">{inGuiaCount}</div>
          <div className="text-[11px] text-blue-700 font-medium">Consolidados en despacho activo</div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
            <span>Carga en Almacén</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950">{totalWeightInWarehouse.toFixed(1)} kg</div>
          <div className="text-[11px] text-amber-800 font-medium">Peso físico disponible para salida</div>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs de Estado */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
            {[
              { id: "TODOS", label: "Todos", count: totalCount },
              { id: "DISPONIBLE", label: "Disponibles", count: availableCount },
              { id: "EN_GUIA_SALIDA", label: "En Guía de Salida", count: inGuiaCount },
              { id: "DESPACHADO", label: "Despachados", count: dispatchedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-200 text-slate-700">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Destino Filter & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:border-amber-500 focus:outline-none"
            >
              <option value="TODOS">Todos los Destinos</option>
              {DESTINOS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar WR, cliente, destinatario..."
                className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:border-amber-500 focus:outline-none w-full sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Warehouses */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            Cargando inventario de almacén...
          </div>
        ) : filteredWarehouses.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Warehouse className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No se encontraron Warehouses</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No hay recibos de almacén que coincidan con los filtros seleccionados o aún no has creado ninguno.
            </p>
            <Button
              onClick={handleOpenCreateModal}
              className="rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Crear Nuevo Warehouse
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Código WR</th>
                  <th className="py-3.5 px-4">Cliente / Remitente</th>
                  <th className="py-3.5 px-4">Destinatario & Destino</th>
                  <th className="py-3.5 px-4">Carga & Medidas</th>
                  <th className="py-3.5 px-4">Contenido</th>
                  <th className="py-3.5 px-4">Guía de Salida</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredWarehouses.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Código WR */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-mono font-black text-slate-900 text-xs flex items-center gap-1">
                          {w.warehouseCode}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(w.createdAt).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="text-[9px] font-bold text-amber-700 uppercase">{w.serviceType}</span>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block leading-tight">{w.clientName}</span>
                        {w.clientSuite && (
                          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 inline-block">
                            {w.clientSuite}
                          </span>
                        )}
                        {w.clientPhone && <span className="text-[10px] text-slate-400 block">{w.clientPhone}</span>}
                      </div>
                    </td>

                    {/* Destinatario & Destino */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block leading-tight">{w.recipientName}</span>
                        <span className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                          {w.destination}
                        </span>
                      </div>
                    </td>

                    {/* Carga & Medidas */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 font-mono text-[11px]">
                        <span className="font-bold text-slate-900 block">
                          {w.pieces} {w.pieces === 1 ? "Bulto" : "Bultos"} · {w.weightKg} kg
                        </span>
                        <span className="text-slate-500 text-[10px] block">
                          Valor: <strong className="text-slate-900">${w.declaredValue} USD</strong>
                        </span>
                      </div>
                    </td>

                    {/* Contenido */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="space-y-1">
                        <p className="line-clamp-1 text-slate-700 font-medium text-[11px]">{w.contentDescription}</p>
                        {w.containElectronics && (
                          <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-md inline-flex items-center gap-0.5">
                            <Laptop className="w-2.5 h-2.5 text-blue-600" /> Electrónicos
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Guía de Salida Asignada */}
                    <td className="py-3.5 px-4">
                      {w.assignedGuiaCode ? (
                        <Link href={`/admin/guias-salida?search=${w.assignedGuiaCode}`}>
                          <span className="font-mono text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors inline-flex items-center gap-1">
                            <FileSpreadsheet className="w-3 h-3 text-blue-600" />
                            {w.assignedGuiaCode}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Sin salida asignada</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      {w.status === "DISPONIBLE" && (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> DISPONIBLE
                        </span>
                      )}
                      {w.status === "EN_GUIA_SALIDA" && (
                        <span className="text-[10px] font-black text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" /> EN SALIDA
                        </span>
                      )}
                      {(w.status === "DESPACHADO" || w.status === "ENTREGADO") && (
                        <span className="text-[10px] font-black text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200 inline-flex items-center gap-1">
                          <Send className="w-3 h-3 text-purple-600" /> DESPACHADO
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedWarehouseModal(w)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          title="Ver Recibo de Almacén"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteWarehouse(w.id, w.warehouseCode)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 text-red-500 cursor-pointer"
                          title="Eliminar Warehouse"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL CREAR WAREHOUSE */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Crear Nuevo Warehouse (WR)</h3>
                  <p className="text-xs text-slate-400">
                    Ingresa los datos del cliente, destinatario y carga física recibida en almacén.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateWarehouse} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Código WR */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Código de Warehouse (WR) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50 text-slate-900"
                  />
                </div>

                {/* Modalidad */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                    Modalidad de Envío *
                  </label>
                  <select
                    value={formServiceType}
                    onChange={(e) => setFormServiceType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                  >
                    <option value="Aéreo Express">Aéreo Express</option>
                    <option value="Marítimo Estándar">Marítimo Estándar</option>
                  </select>
                </div>
              </div>

              {/* Sección Remitente / Cliente */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  1. Datos del Cliente / Remitente
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      placeholder="Ej. Roberto Mendoza"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Casillero / Suite</label>
                    <input
                      type="text"
                      value={formClientSuite}
                      onChange={(e) => setFormClientSuite(e.target.value)}
                      placeholder="Ej. BBX-1042"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Teléfono Cliente (Opcional)</label>
                  <input
                    type="text"
                    value={formClientPhone}
                    onChange={(e) => setFormClientPhone(e.target.value)}
                    placeholder="Ej. +1 918 555 0192"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Sección Destinatario */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  2. Datos del Destinatario y Entrega
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Nombre Destinatario *</label>
                    <input
                      type="text"
                      required
                      value={formRecipientName}
                      onChange={(e) => setFormRecipientName(e.target.value)}
                      placeholder="Ej. Mariana Mendoza"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Teléfono Destinatario</label>
                    <input
                      type="text"
                      value={formRecipientPhone}
                      onChange={(e) => setFormRecipientPhone(e.target.value)}
                      placeholder="Ej. +58 412 889 1234"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Ciudad Destino *</label>
                    <select
                      value={formDestination}
                      onChange={(e) => setFormDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                    >
                      {DESTINOS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Dirección de Entrega</label>
                    <input
                      type="text"
                      value={formRecipientAddress}
                      onChange={(e) => setFormRecipientAddress(e.target.value)}
                      placeholder="Ej. Av. Francisco de Miranda, Edif. Parque Cristal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Carga y Medidas */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                  3. Medición y Valor Declarado en Almacén
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-amber-950 mb-1">Bultos / Cajas *</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formPieces}
                      onChange={(e) => setFormPieces(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-950 mb-1">Peso (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      required
                      value={formWeightKg}
                      onChange={(e) => setFormWeightKg(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white font-mono font-bold text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-950 mb-1">Medidas (cm)</label>
                    <input
                      type="text"
                      value={formDimensions}
                      onChange={(e) => setFormDimensions(e.target.value)}
                      placeholder="35x25x20 cm"
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-amber-950 mb-1">Valor Decl. ($ USD) *</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      required
                      value={formDeclaredValue}
                      onChange={(e) => setFormDeclaredValue(e.target.value === "" ? "" : parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white font-mono font-bold text-xs text-amber-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-amber-950 mb-1">Descripción del Contenido *</label>
                  <input
                    type="text"
                    required
                    value={formContentDescription}
                    onChange={(e) => setFormContentDescription(e.target.value)}
                    placeholder="Ej. Ropa deportiva, calzado, accesorios..."
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Electrónicos */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    ¿Contiene equipos o dispositivos electrónicos?
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="wh_elect"
                        checked={formContainElectronics === true}
                        onChange={() => setFormContainElectronics(true)}
                        className="text-blue-600"
                      />
                      Sí
                    </label>
                    <label className="text-xs font-bold flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="wh_elect"
                        checked={formContainElectronics === false}
                        onChange={() => setFormContainElectronics(false)}
                        className="text-blue-600"
                      />
                      No
                    </label>
                  </div>
                </div>

                {formContainElectronics && (
                  <div className="pt-2 animate-in fade-in">
                    <input
                      type="text"
                      value={formElectronicsDetails}
                      onChange={(e) => setFormElectronicsDetails(e.target.value)}
                      placeholder="Detallar marca, modelo y cantidad (ej. 1 Tablet iPad 10ma Gen)"
                      className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs text-slate-900"
                    />
                  </div>
                )}
              </div>

              {/* Tracking Origen y Notas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">
                    Tracking Origen / Proveedor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formTrackingOrigin}
                    onChange={(e) => setFormTrackingOrigin(e.target.value)}
                    placeholder="Ej. UPS 1Z999... o Amazon TBA..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Notas Internas</label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Ej. Caja frágil, inspeccionada en almacén"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-xl px-5 text-xs font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-6 shadow-sm"
                >
                  {isSubmitting ? "Guardando..." : "Guardar en Almacén"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER DETALLE / RECIBO DE ALMACÉN */}
      {selectedWarehouseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header Comprobante */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <Warehouse className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    RECIBO DE ALMACÉN (WAREHOUSE RECEIPT)
                  </span>
                  <h3 className="font-mono text-base font-black">{selectedWarehouseModal.warehouseCode}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedWarehouseModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido Recibo */}
            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">ESTADO ACTUAL:</span>
                  <span className="font-black text-sm">{selectedWarehouseModal.status}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">MODALIDAD:</span>
                  <span className="font-bold text-xs">{selectedWarehouseModal.serviceType}</span>
                </div>
              </div>

              {/* Guía de Salida si está asignado */}
              {selectedWarehouseModal.assignedGuiaCode && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    Asignado a Guía de Salida:
                  </span>
                  <span className="font-mono font-black text-blue-800 text-xs">
                    {selectedWarehouseModal.assignedGuiaCode}
                  </span>
                </div>
              )}

              {/* Datos Remitente & Destinatario */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">CLIENTE:</span>
                  <span className="font-bold text-slate-900 block">{selectedWarehouseModal.clientName}</span>
                  {selectedWarehouseModal.clientSuite && (
                    <span className="font-mono text-[10px] text-amber-800 font-bold block">
                      Suite: {selectedWarehouseModal.clientSuite}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DESTINATARIO:</span>
                  <span className="font-bold text-slate-900 block">{selectedWarehouseModal.recipientName}</span>
                  <span className="text-[11px] text-slate-600 font-semibold block">
                    {selectedWarehouseModal.destination}
                  </span>
                </div>
              </div>

              {/* Medición */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-100/70 border border-slate-200 font-mono">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">BULTOS</span>
                  <span className="font-black text-sm text-slate-900">{selectedWarehouseModal.pieces}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">PESO</span>
                  <span className="font-black text-sm text-slate-900">{selectedWarehouseModal.weightKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">VALOR DECL.</span>
                  <span className="font-black text-sm text-amber-800">${selectedWarehouseModal.declaredValue} USD</span>
                </div>
              </div>

              {/* Contenido */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">DESCRIPCIÓN DEL CONTENIDO:</span>
                <p className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                  {selectedWarehouseModal.contentDescription}
                </p>
              </div>

              {selectedWarehouseModal.containElectronics && (
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-0.5">
                  <span className="font-bold text-[10px] uppercase text-blue-900 flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" /> Dispositivos Electrónicos:
                  </span>
                  <p className="text-xs font-semibold">{selectedWarehouseModal.electronicsDetails}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  window.print();
                }}
                className="rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir WR
              </Button>

              <Button
                onClick={() => setSelectedWarehouseModal(null)}
                className="rounded-xl bg-slate-900 text-white font-bold text-xs px-5 cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
