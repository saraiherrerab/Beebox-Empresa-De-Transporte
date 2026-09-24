"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Plus,
  Search,
  Warehouse,
  Package,
  Layers,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Eye,
  Printer,
  X,
  AlertTriangle,
  Scale,
  Laptop,
  Boxes,
  MapPin,
  Calendar,
  Truck,
  Check,
  PlaneTakeoff,
  Ship,
  RefreshCw,
  ExternalLink,
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

export interface GuiaSalidaItem {
  id: string;
  guiaCode: string;
  description: string;
  destination: string;
  departureDate: string;
  serviceType: "Aéreo" | "Marítimo" | "Terrestre";
  carrier?: string;
  status: "EN_PREPARACION" | "DESPACHADA" | "EN_TRANSITO" | "ARRIBADA" | "COMPLETADA";
  warehousesCount: number; // NRO de Warehouse
  warehouses: WarehouseItem[]; // Listado de ellos
  totalPieces: number;
  totalWeightKg: number;
  totalDeclaredValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const DESTINOS = [
  "Caracas, Venezuela",
  "Valencia, Venezuela",
  "Maracaibo, Venezuela",
  "Barquisimeto, Venezuela",
  "Maracay, Venezuela",
  "Puerto Ordaz, Venezuela",
  "Lechería / Puerto La Cruz, Venezuela",
];

const INITIAL_GUIAS: GuiaSalidaItem[] = [
  {
    id: "gs_101",
    guiaCode: "GS-2026-001",
    description: "Despacho Aéreo Consolidado - Destino Caracas Maiquetía",
    destination: "Caracas, Venezuela",
    departureDate: new Date().toISOString().split("T")[0],
    serviceType: "Aéreo",
    carrier: "Laser Cargo - Vuelo LC-402",
    status: "EN_PREPARACION",
    warehousesCount: 2,
    warehouses: [
      {
        id: "wh_sample_1",
        warehouseCode: "WR-89190",
        clientName: "Carlos Zambrano",
        clientSuite: "BBX-1090",
        recipientName: "Sofía Zambrano",
        recipientPhone: "+58 414 112 3456",
        recipientAddress: "Av. Libertador, Edif. La Línea, PH",
        destination: "Caracas, Venezuela",
        serviceType: "Aéreo Express",
        pieces: 2,
        weightKg: 5.4,
        declaredValue: 320,
        contentDescription: "Calzado deportivo y ropa casual",
        containElectronics: false,
        status: "EN_GUIA_SALIDA",
        assignedGuiaCode: "GS-2026-001",
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: "wh_sample_2",
        warehouseCode: "WR-89191",
        clientName: "Daniela Morales",
        clientSuite: "BBX-2144",
        recipientName: "Alejandro Morales",
        recipientPhone: "+58 412 990 7654",
        recipientAddress: "Altamira Sur, Res. Avila Sol, Apt 4-B",
        destination: "Caracas, Venezuela",
        serviceType: "Aéreo Express",
        pieces: 1,
        weightKg: 3.1,
        declaredValue: 580,
        contentDescription: "Consola PlayStation 5 y mando dual",
        containElectronics: true,
        electronicsDetails: "1 Consola PlayStation 5 Digital",
        status: "EN_GUIA_SALIDA",
        assignedGuiaCode: "GS-2026-001",
        createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
      },
    ],
    totalPieces: 3,
    totalWeightKg: 8.5,
    totalDeclaredValue: 900,
    notes: "Salida coordinada con precintos de seguridad aeroportuaria.",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function GuiasSalidaAdminPage() {
  const [guias, setGuias] = useState<GuiaSalidaItem[]>([]);
  const [allWarehouses, setAllWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODAS");

  // Modal Crear Guía de Salida
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields para la Guía de Salida
  const [formGuiaCode, setFormGuiaCode] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDestination, setFormDestination] = useState(DESTINOS[0]);
  const [formDepartureDate, setFormDepartureDate] = useState(new Date().toISOString().split("T")[0]);
  const [formServiceType, setFormServiceType] = useState<"Aéreo" | "Marítimo" | "Terrestre">("Aéreo");
  const [formCarrier, setFormCarrier] = useState("Laser Cargo / Vuelo Semanal");
  const [formNotes, setFormNotes] = useState("");

  // Warehouses seleccionados para esta nueva Guía de Salida
  const [selectedWarehouseIds, setSelectedWarehouseIds] = useState<string[]>([]);
  const [warehouseSearchInModal, setWarehouseSearchInModal] = useState("");

  // Modal Ver Manifiesto / Detalle de Guía de Salida
  const [selectedGuiaModal, setSelectedGuiaModal] = useState<GuiaSalidaItem | null>(null);

  // Fetch Guías y Warehouses
  const fetchData = useCallback(async () => {
    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const [resGuias, resWh] = await Promise.allSettled([
        fetch(`${API_URL}/guias-salida`, { headers: authHeaders }).then((r) => r.json()),
        fetch(`${API_URL}/warehouses`, { headers: authHeaders }).then((r) => r.json()),
      ]);

      if (resGuias.status === "fulfilled" && Array.isArray(resGuias.value?.guias)) {
        setGuias(resGuias.value.guias);
      } else {
        // Fallback local guías
        if (typeof window !== "undefined") {
          try {
            const localSaved = JSON.parse(localStorage.getItem("beebox_guias_salida") || "null");
            setGuias(Array.isArray(localSaved) && localSaved.length > 0 ? localSaved : INITIAL_GUIAS);
          } catch {
            setGuias(INITIAL_GUIAS);
          }
        }
      }

      if (resWh.status === "fulfilled" && Array.isArray(resWh.value?.warehouses)) {
        setAllWarehouses(resWh.value.warehouses);
      } else {
        // Fallback local warehouses
        if (typeof window !== "undefined") {
          try {
            const localSavedWh = JSON.parse(localStorage.getItem("beebox_warehouses") || "[]");
            setAllWarehouses(Array.isArray(localSavedWh) ? localSavedWh : []);
          } catch {}
        }
      }
    } catch {
      setGuias(INITIAL_GUIAS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveGuiasLocally = (newList: GuiaSalidaItem[]) => {
    setGuias(newList);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("beebox_guias_salida", JSON.stringify(newList));
      } catch {}
    }
  };

  const handleOpenCreateModal = () => {
    const nextCode = `GS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    setFormGuiaCode(nextCode);
    setFormDescription("");
    setFormDestination(DESTINOS[0]);
    setFormDepartureDate(new Date().toISOString().split("T")[0]);
    setFormServiceType("Aéreo");
    setFormCarrier("Laser Cargo / Vuelo Semanal");
    setFormNotes("");
    setSelectedWarehouseIds([]);
    setWarehouseSearchInModal("");
    setIsCreateModalOpen(true);
  };

  const toggleSelectWarehouse = (whId: string) => {
    if (selectedWarehouseIds.includes(whId)) {
      setSelectedWarehouseIds(selectedWarehouseIds.filter((id) => id !== whId));
    } else {
      setSelectedWarehouseIds([...selectedWarehouseIds, whId]);
    }
  };

  // Warehouses seleccionados actualmente en el modal
  const selectedWarehousesList = useMemo(() => {
    return allWarehouses.filter((w) => selectedWarehouseIds.includes(w.id) || selectedWarehouseIds.includes(w.warehouseCode));
  }, [allWarehouses, selectedWarehouseIds]);

  // Warehouses disponibles para agregar (los que no tienen guía o están disponibles)
  const availableWarehousesForModal = useMemo(() => {
    return allWarehouses.filter((w) => {
      const matchSearch =
        warehouseSearchInModal === "" ||
        w.warehouseCode.toLowerCase().includes(warehouseSearchInModal.toLowerCase()) ||
        w.clientName.toLowerCase().includes(warehouseSearchInModal.toLowerCase()) ||
        w.recipientName.toLowerCase().includes(warehouseSearchInModal.toLowerCase()) ||
        w.contentDescription.toLowerCase().includes(warehouseSearchInModal.toLowerCase());

      const isAvailableOrSelected = w.status === "DISPONIBLE" || selectedWarehouseIds.includes(w.id);
      return matchSearch && isAvailableOrSelected;
    });
  }, [allWarehouses, selectedWarehouseIds, warehouseSearchInModal]);

  // Cálculos en vivo para la nueva Guía
  const modalTotalPieces = selectedWarehousesList.reduce((acc, w) => acc + (w.pieces || 1), 0);
  const modalTotalWeight = Number(
    selectedWarehousesList.reduce((acc, w) => acc + (typeof w.weightKg === "number" ? w.weightKg : 0), 0).toFixed(2)
  );
  const modalTotalDeclared = Number(
    selectedWarehousesList.reduce((acc, w) => acc + (typeof w.declaredValue === "number" ? w.declaredValue : 0), 0).toFixed(2)
  );

  const handleCreateGuia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) {
      alert("Por favor ingresa una descripción para la Guía de Salida (ej. Vuelo Aéreo Consolidado).");
      return;
    }

    if (selectedWarehouseIds.length === 0) {
      if (
        !confirm(
          "No has seleccionado ningún Warehouse para esta salida. ¿Deseas crear la Guía de Salida abierta en preparación?"
        )
      ) {
        return;
      }
    }

    setIsSubmitting(true);

    const generatedCode = formGuiaCode.trim() || `GS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    const newGuia: GuiaSalidaItem = {
      id: `gs_${Date.now()}`,
      guiaCode: generatedCode,
      description: formDescription.trim(),
      destination: formDestination,
      departureDate: formDepartureDate,
      serviceType: formServiceType,
      carrier: formCarrier.trim() || undefined,
      status: "EN_PREPARACION",
      warehousesCount: selectedWarehousesList.length,
      warehouses: selectedWarehousesList.map((w) => ({
        ...w,
        status: "EN_GUIA_SALIDA",
        assignedGuiaCode: generatedCode,
      })),
      totalPieces: modalTotalPieces,
      totalWeightKg: modalTotalWeight,
      totalDeclaredValue: modalTotalDeclared,
      notes: formNotes.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      await fetch(`${API_URL}/guias-salida`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...newGuia,
          warehouseIds: selectedWarehouseIds,
        }),
      });
    } catch {}

    // Actualizar localmente los warehouses que se agregaron
    const updatedWarehouses = allWarehouses.map((w) => {
      if (selectedWarehouseIds.includes(w.id) || selectedWarehouseIds.includes(w.warehouseCode)) {
        return {
          ...w,
          status: "EN_GUIA_SALIDA" as const,
          assignedGuiaCode: generatedCode,
        };
      }
      return w;
    });

    setAllWarehouses(updatedWarehouses);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("beebox_warehouses", JSON.stringify(updatedWarehouses));
      } catch {}
    }

    const updatedGuias = [newGuia, ...guias];
    saveGuiasLocally(updatedGuias);

    setIsSubmitting(false);
    setIsCreateModalOpen(false);
    alert(
      `Guía de Salida ${newGuia.guiaCode} creada exitosamente con ${newGuia.warehousesCount} Warehouse(s) asociados.`
    );
  };

  const handleUpdateStatus = async (
    guiaId: string,
    newStatus: "EN_PREPARACION" | "DESPACHADA" | "EN_TRANSITO" | "ARRIBADA" | "COMPLETADA"
  ) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      await fetch(`${API_URL}/guias-salida/${guiaId}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}

    const updatedGuias = guias.map((g) => {
      if (g.id === guiaId) {
        return {
          ...g,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return g;
    });

    saveGuiasLocally(updatedGuias);

    if (selectedGuiaModal && selectedGuiaModal.id === guiaId) {
      setSelectedGuiaModal({
        ...selectedGuiaModal,
        status: newStatus,
      });
    }
  };

  const handleDeleteGuia = async (id: string, code: string) => {
    if (!confirm(`¿Eliminar la Guía de Salida ${code}? Los Warehouses asociados volverán a quedar disponibles.`))
      return;

    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await fetch(`${API_URL}/guias-salida/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
    } catch {}

    const updated = guias.filter((g) => g.id !== id && g.guiaCode !== code);
    saveGuiasLocally(updated);

    // Liberar Warehouses
    const targetGuia = guias.find((g) => g.id === id || g.guiaCode === code);
    if (targetGuia) {
      const freed = allWarehouses.map((w) => {
        if (targetGuia.warehouses.some((tw) => tw.id === w.id || tw.warehouseCode === w.warehouseCode)) {
          return {
            ...w,
            status: "DISPONIBLE" as const,
            assignedGuiaCode: null,
          };
        }
        return w;
      });
      setAllWarehouses(freed);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("beebox_warehouses", JSON.stringify(freed));
        } catch {}
      }
    }
  };

  // Filtered Guías
  const filteredGuias = useMemo(() => {
    return guias.filter((g) => {
      const matchSearch =
        searchTerm === "" ||
        g.guiaCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.carrier && g.carrier.toLowerCase().includes(searchTerm.toLowerCase())) ||
        g.warehouses.some((w) => w.warehouseCode.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchStatus =
        statusFilter === "TODAS" ||
        (statusFilter === "EN_PREPARACION" && g.status === "EN_PREPARACION") ||
        (statusFilter === "DESPACHADA" && (g.status === "DESPACHADA" || g.status === "EN_TRANSITO")) ||
        (statusFilter === "ARRIBADA" && (g.status === "ARRIBADA" || g.status === "COMPLETADA"));

      return matchSearch && matchStatus;
    });
  }, [guias, searchTerm, statusFilter]);

  // Metrics
  const totalGuiasCount = guias.length;
  const inPrepCount = guias.filter((g) => g.status === "EN_PREPARACION").length;
  const inTransitCount = guias.filter((g) => g.status === "DESPACHADA" || g.status === "EN_TRANSITO").length;
  const totalWarehousesConsolidated = guias.reduce((acc, g) => acc + (g.warehousesCount || 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Control de Guías de Salida y Despachos
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Genera códigos de salida, consolida múltiples Warehouses (WR) y genera el manifiesto oficial de despacho.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/warehouses">
            <Button
              variant="outline"
              className="rounded-2xl border-slate-200 text-xs font-extrabold flex items-center gap-2 text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Warehouse className="w-4 h-4 text-amber-600" />
              Ver Inventario Warehouses
            </Button>
          </Link>

          <Button
            onClick={handleOpenCreateModal}
            className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Crear Guía de Salida
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Guías de Salida</span>
            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalGuiasCount}</div>
          <div className="text-[11px] text-slate-400 font-medium">Códigos de salida registrados</div>
        </div>

        <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-blue-700 text-xs font-bold uppercase tracking-wider">
            <span>En Preparación</span>
            <div className="w-7 h-7 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-950">{inPrepCount}</div>
          <div className="text-[11px] text-blue-700 font-medium">Abiertas incorporando Warehouses</div>
        </div>

        <div className="p-5 rounded-3xl bg-purple-50/60 border border-purple-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-purple-700 text-xs font-bold uppercase tracking-wider">
            <span>Despachadas / En Tránsito</span>
            <div className="w-7 h-7 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-950">{inTransitCount}</div>
          <div className="text-[11px] text-purple-700 font-medium">En vuelo o ruta hacia destino</div>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
            <span>NRO de Warehouses</span>
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900">
              <Boxes className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950">{totalWarehousesConsolidated}</div>
          <div className="text-[11px] text-amber-800 font-medium">Bultos/WR agrupados en salidas</div>
        </div>
      </div>

      {/* Filtros y Buscador */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-fit">
            {[
              { id: "TODAS", label: "Todas las Guías", count: totalGuiasCount },
              { id: "EN_PREPARACION", label: "En Preparación", count: inPrepCount },
              { id: "DESPACHADA", label: "Despachadas", count: inTransitCount },
              {
                id: "ARRIBADA",
                label: "Arribadas",
                count: guias.filter((g) => g.status === "ARRIBADA" || g.status === "COMPLETADA").length,
              },
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

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código GS, descripción, destino..."
              className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-white focus:border-amber-500 focus:outline-none w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      {/* Lista de Guías de Salida */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs font-medium flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            Cargando Guías de Salida...
          </div>
        ) : filteredGuias.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No se encontraron Guías de Salida</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No hay salidas registradas con los filtros actuales. Crea una nueva guía de salida para consolidar tus
              Warehouses.
            </p>
            <Button
              onClick={handleOpenCreateModal}
              className="rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
            >
              Crear Guía de Salida
            </Button>
          </div>
        ) : (
          filteredGuias.map((guia) => (
            <div
              key={guia.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header de la Guía */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                    {guia.serviceType === "Marítimo" ? (
                      <Ship className="w-5 h-5 text-blue-600" />
                    ) : (
                      <PlaneTakeoff className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-black text-slate-900 tracking-tight">
                        {guia.guiaCode}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {guia.serviceType}
                      </span>
                      {guia.carrier && (
                        <span className="text-[10px] font-semibold text-slate-500">· {guia.carrier}</span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 mt-0.5">{guia.description}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Badge de Estado */}
                  {guia.status === "EN_PREPARACION" && (
                    <span className="text-[10px] font-black text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200 inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" /> EN PREPARACIÓN
                    </span>
                  )}
                  {guia.status === "DESPACHADA" && (
                    <span className="text-[10px] font-black text-purple-800 bg-purple-100/80 px-2.5 py-1 rounded-full border border-purple-200 inline-flex items-center gap-1">
                      <Send className="w-3 h-3 text-purple-600" /> DESPACHADA
                    </span>
                  )}
                  {guia.status === "ARRIBADA" && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ARRIBADA
                    </span>
                  )}

                  {/* Acciones de cambio de estado rápido */}
                  {guia.status === "EN_PREPARACION" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(guia.id, "DESPACHADA")}
                      className="text-[11px] font-bold text-purple-700 hover:text-purple-800 bg-purple-50 px-2.5 py-1 rounded-xl border border-purple-200 cursor-pointer"
                    >
                      Marcar Despachada
                    </button>
                  )}
                  {guia.status === "DESPACHADA" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(guia.id, "ARRIBADA")}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 cursor-pointer"
                    >
                      Marcar Arribada
                    </button>
                  )}
                </div>
              </div>

              {/* Métricas clave de la salida */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    DESTINO DE SALIDA
                  </span>
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {guia.destination}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    FECHA DE SALIDA
                  </span>
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {guia.departureDate}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    NRO DE WAREHOUSE
                  </span>
                  <span className="font-black text-amber-900 text-xs font-mono bg-amber-100/80 px-2 py-0.5 rounded-lg border border-amber-200 inline-block">
                    {guia.warehousesCount} {guia.warehousesCount === 1 ? "Warehouse" : "Warehouses"}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    TOTAL BULTOS & PESO
                  </span>
                  <span className="font-bold text-slate-900 text-xs font-mono">
                    {guia.totalPieces} Bultos · {guia.totalWeightKg} kg
                  </span>
                </div>
              </div>

              {/* Listado de Warehouses incluidos en esta Salida */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black uppercase tracking-wider text-slate-500 text-[10px] flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5 text-amber-600" />
                    Listado de Warehouses en esta Salida ({guia.warehouses.length})
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-500">
                    Valor Consolidado: <strong className="text-slate-900">${guia.totalDeclaredValue} USD</strong>
                  </span>
                </div>

                {guia.warehouses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {guia.warehouses.map((wh, idx) => (
                      <div
                        key={wh.id || idx}
                        className="p-3 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-3 shadow-2xs hover:border-slate-300 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-900 text-xs">{wh.warehouseCode}</span>
                            <span className="text-[10px] text-slate-500 font-bold">({wh.pieces} bulto/s)</span>
                            {wh.containElectronics && (
                              <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                💻 Electrónicos
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-slate-700 line-clamp-1">
                            {wh.contentDescription || "Sin descripción"}
                          </p>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2">
                            <span>Dest: <strong className="text-slate-800">{wh.recipientName}</strong></span>
                            <span>·</span>
                            <span className="font-mono">{wh.weightKg} kg</span>
                            <span>·</span>
                            <span className="font-mono font-bold text-amber-800">${wh.declaredValue} USD</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold shrink-0">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-100/60 text-slate-500 text-[11px] font-medium text-center">
                    No se han asignado Warehouses a esta guía de salida todavía.
                  </div>
                )}
              </div>

              {/* Footer Acciones */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] text-slate-400">
                  Creada: {new Date(guia.createdAt).toLocaleDateString("es-ES")}
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedGuiaModal(guia)}
                    className="rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Manifiesto Completo
                  </Button>

                  <button
                    type="button"
                    onClick={() => handleDeleteGuia(guia.id, guia.guiaCode)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Eliminar Guía de Salida"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL CREAR GUÍA DE SALIDA */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">Crear Guía de Salida (Despacho)</h3>
                  <p className="text-xs text-slate-400">
                    Define los datos del vuelo/salida y selecciona todos los Warehouse que formarán parte de este envío.
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
            <form onSubmit={handleCreateGuia} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Bloque 1: Datos de la Salida */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  1. Parámetros del Despacho / Vuelo
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Código de Salida *
                    </label>
                    <input
                      type="text"
                      required
                      value={formGuiaCode}
                      onChange={(e) => setFormGuiaCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Modalidad *
                    </label>
                    <select
                      value={formServiceType}
                      onChange={(e) => setFormServiceType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                    >
                      <option value="Aéreo">Aéreo</option>
                      <option value="Marítimo">Marítimo</option>
                      <option value="Terrestre">Terrestre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-600 mb-1">
                      Fecha de Salida *
                    </label>
                    <input
                      type="date"
                      required
                      value={formDepartureDate}
                      onChange={(e) => setFormDepartureDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">
                      Descripción del Despacho / Salida *
                    </label>
                    <input
                      type="text"
                      required
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Ej. Despacho Aéreo Consolidado Miércoles - Caracas"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-1">Destino Principal *</label>
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
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">
                    Transportista / Aerolínea / Contenedor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formCarrier}
                    onChange={(e) => setFormCarrier(e.target.value)}
                    placeholder="Ej. Laser Cargo LC-402 / Swift Air"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Bloque 2: Selección y Asociación de Warehouses */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 block">
                      2. Selección de Warehouses a Añadir a esta Salida
                    </span>
                    <span className="text-[11px] text-amber-900/80">
                      Marca las casillas de los Warehouses en almacén que deseas incluir en este envío.
                    </span>
                  </div>

                  {/* Resumen en vivo */}
                  <div className="flex items-center gap-3 text-xs bg-white px-3 py-1.5 rounded-xl border border-amber-300 shrink-0">
                    <span className="font-bold text-slate-700">
                      NRO de Warehouse: <strong className="text-amber-800 font-mono text-sm">{selectedWarehouseIds.length}</strong>
                    </span>
                    <span>·</span>
                    <span className="font-mono font-bold text-slate-900">{modalTotalWeight} kg</span>
                  </div>
                </div>

                {/* Buscador de Warehouses en el modal */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={warehouseSearchInModal}
                    onChange={(e) => setWarehouseSearchInModal(e.target.value)}
                    placeholder="Filtrar por código WR, cliente, destinatario..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-amber-200 bg-white text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Lista de Warehouses Seleccionables */}
                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {availableWarehousesForModal.length === 0 ? (
                    <div className="p-4 rounded-xl bg-white text-center text-xs text-slate-400 font-medium">
                      No hay Warehouses disponibles en almacén o no coinciden con la búsqueda. Puedes crear nuevos
                      Warehouses en la sección de Recepción.
                    </div>
                  ) : (
                    availableWarehousesForModal.map((w) => {
                      const isSelected = selectedWarehouseIds.includes(w.id) || selectedWarehouseIds.includes(w.warehouseCode);
                      return (
                        <div
                          key={w.id}
                          onClick={() => toggleSelectWarehouse(w.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-amber-100/70 border-amber-400 shadow-xs"
                              : "bg-white border-slate-200 hover:border-amber-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                                isSelected
                                  ? "bg-amber-500 border-amber-600 text-slate-950 font-black"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-xs text-slate-900">{w.warehouseCode}</span>
                                <span className="text-[10px] text-slate-500">· {w.destination}</span>
                                {w.containElectronics && (
                                  <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 rounded border border-blue-200">
                                    💻 Electrónicos
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 line-clamp-1">{w.contentDescription}</p>
                              <div className="text-[10px] text-slate-400">
                                Cliente: <strong className="text-slate-700">{w.clientName}</strong> · Dest:{" "}
                                <strong className="text-slate-700">{w.recipientName}</strong>
                              </div>
                            </div>
                          </div>

                          <div className="text-right font-mono text-xs shrink-0">
                            <span className="font-bold text-slate-900 block">{w.weightKg} kg</span>
                            <span className="text-amber-800 text-[10px] font-bold">${w.declaredValue} USD</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bloque 3: Listado de Warehouses Añadidos */}
              {selectedWarehousesList.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    3. Listado de Warehouses Añadidos a esta Salida ({selectedWarehousesList.length})
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 max-h-40 overflow-y-auto">
                    {selectedWarehousesList.map((wh, idx) => (
                      <div
                        key={wh.id}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-white border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-mono font-black text-blue-900">{wh.warehouseCode}</span>
                          <span className="text-slate-600 truncate max-w-xs">{wh.contentDescription}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-slate-500 text-[11px]">{wh.weightKg} kg</span>
                          <button
                            type="button"
                            onClick={() => toggleSelectWarehouse(wh.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-[10px] cursor-pointer"
                          >
                            Quitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
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
                  {isSubmitting ? "Generando..." : "Generar Guía de Salida"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL VER MANIFIESTO COMPLETO (DETALLE DE GUÍA DE SALIDA) */}
      {selectedGuiaModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
            {/* Header Manifiesto */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                    MANIFIESTO OFICIAL DE DESPACHO / GUÍA DE SALIDA
                  </span>
                  <h3 className="font-mono text-lg font-black">{selectedGuiaModal.guiaCode}</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuiaModal(null)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Contenido Manifiesto */}
            <div className="p-6 space-y-5 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DESCRIPCIÓN:</span>
                  <span className="font-bold text-xs block">{selectedGuiaModal.description}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">DESTINO:</span>
                  <span className="font-bold text-xs block">{selectedGuiaModal.destination}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">FECHA DE SALIDA:</span>
                  <span className="font-bold text-xs block">{selectedGuiaModal.departureDate}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">TRANSPORTISTA:</span>
                  <span className="font-bold text-xs block">{selectedGuiaModal.carrier || "General"}</span>
                </div>
              </div>

              {/* Resumen de totales */}
              <div className="grid grid-cols-4 gap-3 text-center p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-mono">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">NRO WAREHOUSE</span>
                  <span className="font-black text-base">{selectedGuiaModal.warehousesCount}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">TOTAL BULTOS</span>
                  <span className="font-black text-base">{selectedGuiaModal.totalPieces}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">PESO TOTAL</span>
                  <span className="font-black text-base">{selectedGuiaModal.totalWeightKg} kg</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 block">VALOR TOTAL</span>
                  <span className="font-black text-base text-amber-900">${selectedGuiaModal.totalDeclaredValue} USD</span>
                </div>
              </div>

              {/* Listado de Warehouses incluidos */}
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                  DETALLE DE WAREHOUSES CONSOLIDADOS ({selectedGuiaModal.warehouses.length})
                </span>

                <div className="rounded-2xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400">
                      <tr>
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Código WR</th>
                        <th className="py-2.5 px-3">Cliente / Suite</th>
                        <th className="py-2.5 px-3">Destinatario</th>
                        <th className="py-2.5 px-3">Contenido</th>
                        <th className="py-2.5 px-3 text-right">Peso</th>
                        <th className="py-2.5 px-3 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {selectedGuiaModal.warehouses.map((wh, idx) => (
                        <tr key={wh.id || idx} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-black text-blue-900">{wh.warehouseCode}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{wh.clientName}</span>
                            {wh.clientSuite && (
                              <span className="font-mono text-[10px] text-amber-800">{wh.clientSuite}</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-800 block">{wh.recipientName}</span>
                            <span className="text-[10px] text-slate-400">{wh.destination}</span>
                          </td>
                          <td className="py-2.5 px-3 max-w-xs">
                            <span className="truncate block">{wh.contentDescription}</span>
                            {wh.containElectronics && (
                              <span className="text-[9px] font-bold text-blue-700">💻 Contiene Electrónicos</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {wh.weightKg} kg
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-800">
                            ${wh.declaredValue} USD
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  window.print();
                }}
                className="rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Imprimir Manifiesto
              </Button>

              <Button
                onClick={() => setSelectedGuiaModal(null)}
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
