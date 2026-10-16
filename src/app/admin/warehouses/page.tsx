"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  MapPin,
  Loader2,
  Package,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Truck,
  Plane,
  Ship,
  Plus,
  X,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  Box,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";
import { ShipmentDetailModal, ModalShipment } from "@/components/admin/ShipmentDetailModal";

interface WarehouseShipmentItem extends ModalShipment {
  boxCount?: number;
  declaredValue?: number;
  contentDescription?: string;
  containElectronics?: boolean;
  electronicsDetails?: string;
  sourceType?: "pickup" | "direct" | "prealerta";
}

const STANDARDIZED_STATUSES = [
  "Pick up en proceso",
  "En el origen",
  "En camino",
  "Llegó a su destino",
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

const normalizeStatus = (rawStatus: string): string => {
  const s = (rawStatus || "").toLowerCase();
  if (s.includes("origen") || s.includes("recibido") || s.includes("completado")) return "En el origen";
  if (s.includes("camino") || s.includes("tránsito") || s.includes("transito") || s.includes("aduana")) return "En camino";
  if (s.includes("destino") || s.includes("entregado")) return "Llegó a su destino";
  if (s.includes("pick") || s.includes("recoleccion") || s.includes("recolección") || s.includes("domicilio") || s.includes("proceso")) return "Pick up en proceso";
  return "En el origen";
};

const isServiceAereo = (type: string = "") => {
  const s = type.toLowerCase();
  return s.includes("aér") || s.includes("aer") || s.includes("air") || s.includes("express") || s.includes("exprés");
};

function AdminWarehousesContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const { socket, refreshPrealertas } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState(urlSearch);
  const [dbShipments, setDbShipments] = useState<WarehouseShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedShipment, setSelectedShipment] = useState<WarehouseShipmentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 15;

  // Modal para crear Warehouse ("pueden nacer siéndolos" o crear desde Pick up en oficina)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [availableOfficePickups, setAvailableOfficePickups] = useState<any[]>([]);
  const [creationMode, setCreationMode] = useState<"manual" | "pickup">("manual");
  const [selectedPickupToConvert, setSelectedPickupToConvert] = useState<any | null>(null);
  const [createForm, setCreateForm] = useState({
    code: `WR-${Math.floor(10000 + Math.random() * 90000)}`,
    pickupId: null as string | null,
    userId: null as string | null,
    serviceType: "Aéreo Express",
    senderName: "",
    senderCity: "",
    recipientName: "",
    recipientPhone: "",
    recipientCity: "",
    recipientAddress: "",
    contentDescription: "",
    weightKg: "" as any,
    boxCount: 1,
    declaredValue: "" as any,
    dimensions: "",
    containElectronics: false,
    electronicsDetails: "",
    electronicsDeclaredValue: "",
    notes: "",
  });

  useEffect(() => {
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [urlSearch]);

  const fetchWarehouses = useCallback(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.allSettled([
      fetch(`${API_URL}/shipments`, { headers: authHeaders }).then((res) => res.json()),
      fetch(`${API_URL}/pickups`, { headers: authHeaders }).then((res) => res.json()),
    ])
      .then(([shipmentsResult, pickupsResult]) => {
        const shipmentsData =
          shipmentsResult.status === "fulfilled" && Array.isArray(shipmentsResult.value)
            ? shipmentsResult.value
            : [];
        const pickupsData =
          pickupsResult.status === "fulfilled"
            ? Array.isArray(pickupsResult.value)
              ? pickupsResult.value
              : Array.isArray(pickupsResult.value?.pickups)
              ? pickupsResult.value.pickups
              : []
            : [];

        const mapped: WarehouseShipmentItem[] = shipmentsData.map((item: any) => {
          const normalizedStatus = normalizeStatus(item.currentStatus);
          const hasPickup = Boolean(item.hasPickup || normalizedStatus === "Pick up en proceso" || item.pickup);
          const code = item.trackingCode || item.id;

          const matchedPickup = pickupsData.find(
            (p: any) => p.pickupCode === code || p.id === item.pickupId || p.id === code
          );

          let finalDimensions = item.dimensions;
          if (!finalDimensions || finalDimensions.includes("auditadas") || finalDimensions.includes("caja(s)")) {
            if (matchedPickup?.dimensions) finalDimensions = matchedPickup.dimensions;
            else if (matchedPickup?.verifiedDimensions) finalDimensions = matchedPickup.verifiedDimensions;
          }
          if (!finalDimensions) {
            finalDimensions = matchedPickup?.boxCount ? `${matchedPickup.boxCount} caja(s) (30x20x15 cm)` : "30x20x15 cm";
          }

          let finalInspectionNotes = item.inspectionNotes || matchedPickup?.inspectionNotes;
          if (!finalInspectionNotes && item.events && item.events.length > 0) {
            for (const ev of item.events) {
              const desc = ev.description || "";
              if (desc.includes("Inspección:")) {
                finalInspectionNotes = desc.split("Inspección:")[1].trim();
                break;
              }
            }
          }
          if (!finalInspectionNotes) {
            finalInspectionNotes = hasPickup
              ? "Revisión conforme en centro de acopio BeeBox"
              : "Verificado y recibido en almacén central";
          }

          const rawEvents = Array.isArray(item.events) ? item.events : [];
          const sortedEvents = [...rawEvents].sort(
            (a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
          );

          return {
            id: code || `WR-${Math.floor(10000 + Math.random() * 90000)}`,
            tracking: code || `WR-UNTITLED`,
            type: item.serviceType || (hasPickup ? "Aéreo Express" : "Aéreo Express"),
            weight: `${item.weightKg || matchedPickup?.totalWeightKg || 1.5} kg`,
            dimensions: finalDimensions,
            inspectionNotes: finalInspectionNotes,
            clientName: item.user?.name || item.senderName || matchedPickup?.senderName || "Cliente BeeBox",
            suiteCode: item.user?.suiteCode || (hasPickup ? "CAS-OK-HUB" : "CAS-OK-WAREHOUSE"),
            route: `${item.senderCity || matchedPickup?.senderCity || "Broken Arrow, OK"} → ${
              item.recipientCity || matchedPickup?.recipientCity || "Caracas, Venezuela"
            }`,
            currentStatus: normalizedStatus,
            lastActivity: sortedEvents[0]?.timestamp || item.updatedAt || item.createdAt || "Reciente",
            activityDesc: sortedEvents[0]?.title || `Estado actual: ${normalizedStatus}`,
            hasPickup,
            senderName: item.senderName || matchedPickup?.senderName || "Remitente Almacén",
            senderAddress: item.senderAddress || matchedPickup?.senderAddress,
            senderCity: item.senderCity || matchedPickup?.senderCity,
            recipientName: item.recipientName || matchedPickup?.recipientName,
            recipientAddress: item.recipientAddress || matchedPickup?.recipientAddress,
            recipientCity: item.recipientCity || matchedPickup?.recipientCity,
            pickupDate: matchedPickup?.pickupDate,
            timeSlot: matchedPickup?.timeSlot,
            events: sortedEvents,
            sourceType: hasPickup ? "pickup" : "direct",
            boxCount: matchedPickup?.boxCount || 1,
            containElectronics: Boolean(matchedPickup?.containElectronics),
            electronicsDetails: matchedPickup?.electronicsDetails || "",
          };
        });

        // Filtrar pickups que están en oficina y no tienen Warehouse creado aún
        const officePickups = pickupsData.filter((pk: any) => {
          const st = (pk.status || "").toUpperCase();
          const isInOffice =
            st === "COMPLETADO" ||
            st === "EN_ORIGEN" ||
            st === "RECOLECTADO" ||
            st === "RECIBIDO_ALMACEN" ||
            st.includes("ORIGEN") ||
            st.includes("ALMACEN") ||
            st.includes("COMPLETADO");
          const hasLinkedShipment = Boolean(
            pk.shipment ||
            shipmentsData.some(
              (s: any) => s.pickupId === pk.id || s.trackingCode === pk.pickupCode
            )
          );
          return isInOffice && !hasLinkedShipment;
        });

        setAvailableOfficePickups(officePickups);
        setDbShipments(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchWarehouses();
    refreshPrealertas();

    const handleSync = () => {
      fetchWarehouses();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleSync);

    if (socket) {
      socket.on("shipment:updated", fetchWarehouses);
      socket.on("prealerta:updated", () => {
        fetchWarehouses();
        refreshPrealertas();
      });
    }

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleSync);
      if (socket) {
        socket.off("shipment:updated", fetchWarehouses);
        socket.off("prealerta:updated", fetchWarehouses);
      }
    };
  }, [fetchWarehouses, refreshPrealertas, socket]);

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
        setDbShipments((prev) =>
          prev.map((sh) =>
            sh.tracking === trackingCode ? { ...sh, currentStatus: newStatus } : sh
          )
        );
        setSelectedShipment((prev) =>
          prev && prev.tracking === trackingCode ? { ...prev, currentStatus: newStatus } : prev
        );
        setNoticeMsg(`El estado del Warehouse ${trackingCode} se actualizó a "${newStatus}".`);
        setTimeout(() => setNoticeMsg(null), 4000);
      }
    } catch {
      setNoticeMsg("Error al actualizar el estado del Warehouse.");
      setTimeout(() => setNoticeMsg(null), 4000);
    }
  };

  const handleOpenCreateModal = (mode: "manual" | "pickup" = "manual") => {
    setCreationMode(mode);
    setSelectedPickupToConvert(null);
    setCreateForm({
      code: `WR-${Math.floor(10000 + Math.random() * 90000)}`,
      pickupId: null,
      userId: null,
      serviceType: "Aéreo Express",
      senderName: "",
      senderCity: "",
      recipientName: "",
      recipientPhone: "",
      recipientCity: "",
      recipientAddress: "",
      contentDescription: "",
      weightKg: "" as any,
      boxCount: 1,
      declaredValue: "" as any,
      dimensions: "",
      containElectronics: false,
      electronicsDetails: "",
      electronicsDeclaredValue: "",
      notes: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSelectPickup = (pk: any) => {
    setSelectedPickupToConvert(pk);
    const code = pk.pickupCode?.startsWith("WR-")
      ? pk.pickupCode
      : `WR-${Math.floor(10000 + Math.random() * 90000)}`;
    const boxes = pk.boxCount ? Number(pk.boxCount) : 1;
    const weight = pk.totalWeightKg ? Number(pk.totalWeightKg) : 1.0;
    const dims = pk.verifiedDimensions || pk.dimensions || `${boxes} caja(s) (30x20x15 cm)`;
    const notes = pk.inspectionNotes || `Recolección Pick up recibida en oficina (${boxes} caja/s)`;

    setCreateForm({
      code,
      pickupId: pk.id,
      userId: pk.userId || pk.user?.id || null,
      serviceType: "Aéreo Express",
      senderName: pk.senderName || "",
      senderCity: pk.senderCity || "Broken Arrow, OK",
      recipientName: pk.recipientName || "",
      recipientPhone: pk.recipientPhone || "",
      recipientCity: pk.recipientCity || "Caracas, Venezuela",
      recipientAddress: pk.recipientAddress || "",
      contentDescription: notes,
      weightKg: weight,
      boxCount: boxes,
      declaredValue: "" as any,
      dimensions: dims,
      containElectronics: Boolean(pk.containElectronics),
      electronicsDetails: pk.electronicsDetails || (pk.containElectronics ? "Equipos declarados en Pickup" : ""),
      electronicsDeclaredValue: "",
      notes: notes,
    });
  };

  const handleCreateWarehouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.senderCity.trim()) {
      alert("Por favor ingresa la ciudad o almacén de origen.");
      return;
    }
    if (!createForm.recipientCity.trim()) {
      alert("Por favor selecciona la ciudad de destino.");
      return;
    }
    if (!createForm.recipientName.trim()) {
      alert("Por favor ingresa el nombre del destinatario.");
      return;
    }
    if (!createForm.recipientAddress.trim()) {
      alert("Por favor ingresa la dirección de entrega del destinatario.");
      return;
    }
    if (!createForm.contentDescription.trim()) {
      alert("Por favor describe el contenido de la caja/warehouse.");
      return;
    }
    if (!createForm.weightKg || Number(createForm.weightKg) <= 0) {
      alert("Por favor ingresa el peso en kg.");
      return;
    }

    setIsCreating(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    const payload = {
      trackingCode: createForm.code.trim().toUpperCase(),
      senderName: createForm.senderName.trim() || "Cliente BeeBox",
      senderCity: createForm.senderCity.trim(),
      recipientName: createForm.recipientName.trim(),
      recipientCity: createForm.recipientCity.trim(),
      recipientAddress: `${createForm.recipientAddress.trim()}${createForm.recipientPhone ? ` (Tlf: ${createForm.recipientPhone.trim()})` : ""}`,
      serviceType: createForm.serviceType,
      weightKg: Number(createForm.weightKg) || 1.0,
      dimensions: createForm.dimensions.trim() || `${createForm.boxCount} caja(s)`,
      contentDescription: createForm.contentDescription.trim(),
      declaredValue: Number(createForm.declaredValue) || 0,
      boxCount: Number(createForm.boxCount) || 1,
      currentStatus: "En el origen", // Directamente disponible en oficina
      estimatedDelivery: isServiceAereo(createForm.serviceType) ? "3-5 días hábiles" : "15-20 días hábiles",
      hasPickup: Boolean(createForm.pickupId),
      pickupId: createForm.pickupId || undefined,
      userId: createForm.userId || undefined,
    };

    try {
      const res = await fetch(`${API_URL}/shipments`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Error al crear el Warehouse en el sistema.");
      }

      setNoticeMsg(
        createForm.pickupId
          ? `¡Warehouse ${data.trackingCode || payload.trackingCode} creado exitosamente desde el Pick up! Queda disponible en oficina para asignar a Guías de Salida.`
          : `¡Warehouse ${data.trackingCode || payload.trackingCode} creado exitosamente! Queda disponible en oficina para asignar a Guías de Salida.`
      );
      setTimeout(() => setNoticeMsg(null), 6000);
      setIsCreateModalOpen(false);
      setSelectedPickupToConvert(null);
      fetchWarehouses();
    } catch (err: any) {
      alert(err.message || "No se pudo registrar el Warehouse. Intenta de nuevo.");
    } finally {
      setIsCreating(false);
    }
  };

  const filteredShipments = useMemo(() => {
    return dbShipments.filter((item) => {
      const q = search.toLowerCase();
      const matchesSearch =
        item.tracking.toLowerCase().includes(q) ||
        (item.clientName || "").toLowerCase().includes(q) ||
        (item.suiteCode || "").toLowerCase().includes(q) ||
        (item.route || "").toLowerCase().includes(q) ||
        (item.recipientName || "").toLowerCase().includes(q) ||
        (item.inspectionNotes || "").toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (activeTab === "disponibles") return item.currentStatus === "En el origen";
      if (activeTab === "aereo") return isServiceAereo(item.type);
      if (activeTab === "maritimo") return !isServiceAereo(item.type);
      if (activeTab === "camino") return item.currentStatus === "En camino";
      if (activeTab === "destino") return item.currentStatus === "Llegó a su destino";
      if (activeTab === "pickup") return item.currentStatus === "Pick up en proceso";

      return true;
    });
  }, [dbShipments, search, activeTab]);

  const totalPages = Math.ceil(filteredShipments.length / pageSize) || 1;
  const paginatedShipments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredShipments.slice(start, start + pageSize);
  }, [filteredShipments, currentPage]);

  const counts = useMemo(() => {
    return {
      total: dbShipments.length,
      disponibles: dbShipments.filter((s) => s.currentStatus === "En el origen").length,
      aereo: dbShipments.filter((s) => isServiceAereo(s.type)).length,
      maritimo: dbShipments.filter((s) => !isServiceAereo(s.type)).length,
      camino: dbShipments.filter((s) => s.currentStatus === "En camino").length,
      destino: dbShipments.filter((s) => s.currentStatus === "Llegó a su destino").length,
    };
  }, [dbShipments]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-4 sm:p-6 min-h-screen rounded-3xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Warehouse</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 uppercase">
              Control de Almacén y Carga
            </span>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            GESTIÓN DE WAREHOUSES DISPONIBLES EN OFICINA Y COMPOSICIÓN DE GUÍAS DE SALIDA
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            href="/admin/guias-salida"
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-2 shadow-sm transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Guías de Salida</span>
          </Link>

          <button
            onClick={fetchWarehouses}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
            title="Recargar datos desde la base de datos"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => handleOpenCreateModal("manual")}
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Crear Warehouse</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Warehouses</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{counts.total}</span>
          <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">Registrados en PostgreSQL</span>
        </div>

        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">Disponibles en Oficina</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{counts.disponibles}</span>
          <span className="text-[10px] text-emerald-700 font-bold mt-0.5 block">Listos para Guía de Salida</span>
        </div>

        <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-sky-800 uppercase tracking-wider block">Modalidad Aérea</span>
            <Plane className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <span className="text-2xl font-black text-sky-900 mt-1 block">{counts.aereo}</span>
          <span className="text-[10px] text-sky-700 font-semibold mt-0.5 block">Envíos Express</span>
        </div>

        <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider block">Modalidad Marítima</span>
            <Ship className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <span className="text-2xl font-black text-teal-900 mt-1 block">{counts.maritimo}</span>
          <span className="text-[10px] text-teal-700 font-semibold mt-0.5 block">Carga Estándar</span>
        </div>

        <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-200 shadow-sm col-span-2 md:col-span-1">
          <span className="text-[10px] font-black text-indigo-800 uppercase tracking-wider block">En Tránsito</span>
          <span className="text-2xl font-black text-indigo-900 mt-1 block">{counts.camino}</span>
          <span className="text-[10px] text-indigo-700 font-semibold mt-0.5 block">Despachados en camino</span>
        </div>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{noticeMsg}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        {/* Tabs & Search Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: "todos", label: "TODOS" },
              { id: "disponibles", label: `EN OFICINA (${counts.disponibles})` },
              { id: "aereo", label: `AÉREO (${counts.aereo})` },
              { id: "maritimo", label: `MARÍTIMO (${counts.maritimo})` },
              { id: "camino", label: "EN TRÁNSITO" },
              { id: "destino", label: "ENTREGADOS" },
              { id: "pickup", label: "PICKUP EN PROCESO" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase transition-all shrink-0 ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 font-black shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por WR, cliente, destino..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Warehouses Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando Warehouses desde PostgreSQL...</span>
          </div>
        ) : paginatedShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Package className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No se encontraron Warehouses para este filtro.</p>
            <p className="text-xs text-slate-500">
              Puedes crear un Warehouse nuevo con el botón "+ Crear Warehouse" o registrar recolecciones desde el módulo de Pickups.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4">CÓDIGO WAREHOUSE</th>
                  <th className="py-3.5 px-4">MODALIDAD</th>
                  <th className="py-3.5 px-4">REMITENTE / CLIENTE</th>
                  <th className="py-3.5 px-4">ORIGEN & DESTINO</th>
                  <th className="py-3.5 px-4">PESO / MEDIDAS</th>
                  <th className="py-3.5 px-4">ESTADO EN ALMACÉN</th>
                  <th className="py-3.5 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {paginatedShipments.map((sh) => {
                  const isAereo = isServiceAereo(sh.type);
                  const isEnOficina = sh.currentStatus === "En el origen";

                  return (
                    <tr key={sh.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedShipment(sh);
                              setIsModalOpen(true);
                            }}
                            className="font-mono font-black text-slate-900 hover:text-amber-600 transition-colors text-left flex items-center gap-1.5"
                          >
                            <span>{sh.tracking}</span>
                            <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-amber-500" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          {sh.hasPickup ? (
                            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-extrabold inline-flex items-center gap-0.5">
                              <Truck className="w-2.5 h-2.5" /> Pickup
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[9px] font-bold">
                              Ingreso Oficina
                            </span>
                          )}
                          {sh.containElectronics && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-extrabold">
                              Electrónicos
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isAereo ? (
                          <span className="px-2.5 py-1 rounded-xl bg-sky-100 text-sky-800 font-extrabold text-[10px] inline-flex items-center gap-1.5 border border-sky-200">
                            <Plane className="w-3 h-3 text-sky-600" /> Aéreo Express
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-800 font-extrabold text-[10px] inline-flex items-center gap-1.5 border border-teal-200">
                            <Ship className="w-3 h-3 text-teal-600" /> Marítimo Estándar
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block truncate max-w-[170px]">
                          {sh.clientName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 block">
                          {sh.suiteCode}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[190px]">{sh.route}</span>
                        </div>
                        {sh.recipientName && (
                          <span className="text-[10px] text-slate-500 block truncate max-w-[190px] mt-0.5">
                            Para: {sh.recipientName}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800 block">{sh.weight}</span>
                        <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[140px]">
                          {sh.dimensions}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={sh.currentStatus}
                            onChange={(e) => handleUpdateStatus(sh.tracking, e.target.value)}
                            className={`text-[11px] font-extrabold px-3 py-1.5 rounded-xl border appearance-none focus:outline-none transition-colors cursor-pointer ${
                              sh.currentStatus === "En el origen"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                                : sh.currentStatus === "En camino"
                                ? "bg-indigo-50 text-indigo-800 border-indigo-300 hover:bg-indigo-100"
                                : sh.currentStatus === "Llegó a su destino"
                                ? "bg-slate-100 text-slate-700 border-slate-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            {STANDARDIZED_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status === "En el origen" ? "✓ En Oficina (Disponible)" : status}
                              </option>
                            ))}
                          </select>

                          {isEnOficina && (
                            <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800">
                              Listo para Guía
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedShipment(sh);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Detalles</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
          <span>
            Mostrando {filteredShipments.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} a{" "}
            {Math.min(currentPage * pageSize, filteredShipments.length)} de {filteredShipments.length} Warehouses
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: + CREAR WAREHOUSE DIRECTAMENTE ("Pueden nacer siéndolos") */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                  <Box className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Crear Nuevo Warehouse</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ingresa una caja con cosas directamente al almacén de origen (Código WR)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas: Crear Manualmente vs Crear desde Pick up */}
            <div className="px-6 pt-3 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setCreationMode("manual");
                  if (selectedPickupToConvert) {
                    setSelectedPickupToConvert(null);
                    setCreateForm({
                      code: `WR-${Math.floor(10000 + Math.random() * 90000)}`,
                      pickupId: null,
                      userId: null,
                      serviceType: "Aéreo Express",
                      senderName: "",
                      senderCity: "",
                      recipientName: "",
                      recipientPhone: "",
                      recipientCity: "",
                      recipientAddress: "",
                      contentDescription: "",
                      weightKg: "" as any,
                      boxCount: 1,
                      declaredValue: "" as any,
                      dimensions: "",
                      containElectronics: false,
                      electronicsDetails: "",
                      electronicsDeclaredValue: "",
                      notes: "",
                    });
                  }
                }}
                className={`pb-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
                  creationMode === "manual"
                    ? "border-amber-500 text-slate-950"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Box className="w-4 h-4" />
                <span>Crear Manualmente</span>
              </button>

              <button
                type="button"
                onClick={() => setCreationMode("pickup")}
                className={`pb-3 px-3 text-xs font-black border-b-2 transition-all flex items-center gap-2 ${
                  creationMode === "pickup"
                    ? "border-amber-500 text-slate-950"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Crear desde Pick up</span>
                {availableOfficePickups.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                    {availableOfficePickups.length}
                  </span>
                )}
              </button>
            </div>

            {/* VISTA 1: Lista de Pick ups en oficina disponibles para crear WR */}
            {creationMode === "pickup" && !selectedPickupToConvert ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      Pick ups en Oficina pendientes por procesar
                    </h4>
                    <p className="text-xs text-slate-500">
                      Selecciona una recolección recibida en oficina para transferir sus datos automáticamente a un Warehouse (WR).
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {availableOfficePickups.length} disponible(s)
                  </span>
                </div>

                {availableOfficePickups.length === 0 ? (
                  <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-600">
                      No hay pick ups recibidos en oficina pendientes por convertir.
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                      Los pick ups deben ser marcados como completados o recibidos en el almacén de origen para aparecer en esta lista.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCreationMode("manual")}
                      className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      Crear Warehouse Manualmente
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                    {availableOfficePickups.map((pk: any) => (
                      <div
                        key={pk.id}
                        onClick={() => handleSelectPickup(pk)}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/20 transition-all cursor-pointer group shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg group-hover:bg-amber-100 group-hover:text-amber-900 transition-colors">
                              {pk.pickupCode}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              En Oficina
                            </span>
                            {pk.containElectronics && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                Electrónicos
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPickup(pk);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 group-hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-sm transition-all"
                          >
                            <span>Usar datos</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Remitente
                            </span>
                            <p className="font-bold text-slate-800 mt-0.5">{pk.senderName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{pk.senderAddress}, {pk.senderCity || "Broken Arrow, OK"}</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Destinatario
                            </span>
                            <p className="font-bold text-slate-800 mt-0.5">{pk.recipientName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{pk.recipientCity || "Caracas, Venezuela"}</p>
                          </div>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-medium px-1">
                          <span>
                            📦 <strong>{pk.boxCount || 1}</strong> caja(s) • ⚖️ <strong>{pk.totalWeightKg || 1} kg</strong>
                          </span>
                          <span>
                            Fecha recolección: <strong>{pk.pickupDate || "Reciente"}</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleCreateWarehouse} className="p-6 space-y-5">
                {/* Banner de transferencia si viene desde Pick up */}
                {selectedPickupToConvert && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-amber-950">
                            Creando desde Pick up: {selectedPickupToConvert.pickupCode}
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                            {selectedPickupToConvert.senderName}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 font-medium">
                          Datos cargados automáticamente. Revisa la modalidad de envío y los campos antes de confirmar.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPickupToConvert(null)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors shrink-0"
                    >
                      Cambiar Pick up
                    </button>
                  </div>
                )}

                {/* Código WR y Modalidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Código de Warehouse (WR) *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.code}
                      onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
                      placeholder="WR-XXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-black text-slate-900 text-sm focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                      Generado automáticamente con el prefijo obligatorio WR
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Modalidad de Envío *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, serviceType: "Aéreo Express" })}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                          createForm.serviceType === "Aéreo Express"
                            ? "bg-sky-500 text-white border-sky-600 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <Plane className="w-4 h-4" /> Aéreo Express
                      </button>
                      <button
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, serviceType: "Marítimo Estándar" })}
                        className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-black transition-all ${
                          createForm.serviceType === "Marítimo Estándar"
                            ? "bg-teal-600 text-white border-teal-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <Ship className="w-4 h-4" /> Marítimo
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remitente, Origen y Destino */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Remitente / Cliente
                    </label>
                    <input
                      type="text"
                      value={createForm.senderName}
                      onChange={(e) => setCreateForm({ ...createForm, senderName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                      placeholder="Nombre del remitente"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Origen (Almacén) *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.senderCity}
                      onChange={(e) => setCreateForm({ ...createForm, senderCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                      placeholder="Broken Arrow, OK"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1.5">
                      Destino Final *
                    </label>
                    <select
                      value={createForm.recipientCity}
                      onChange={(e) => setCreateForm({ ...createForm, recipientCity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    >
                      <option value="" disabled>-- Selecciona un destino * --</option>
                      {DESTINOS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Información del Destinatario */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">
                    Información del Destinatario
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={createForm.recipientName}
                        onChange={(e) => setCreateForm({ ...createForm, recipientName: e.target.value })}
                        placeholder="Nombre y Apellido del Destinatario *"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={createForm.recipientPhone}
                        onChange={(e) => setCreateForm({ ...createForm, recipientPhone: e.target.value })}
                        placeholder="Teléfono de contacto (+58 412...)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      value={createForm.recipientAddress}
                      onChange={(e) => setCreateForm({ ...createForm, recipientAddress: e.target.value })}
                      placeholder="Dirección exacta de entrega o punto de retiro *"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Características de la Carga (Caja con cosas) */}
                <div className="space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
                    Detalles de la Carga / Bulto (Caja con cosas)
                  </span>

                  <div>
                    <textarea
                      required
                      rows={2}
                      value={createForm.contentDescription}
                      onChange={(e) => setCreateForm({ ...createForm, contentDescription: e.target.value })}
                      placeholder="Descripción detallada del contenido: ej. Ropa, calzado deportivo, repuestos automotrices, etc."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Peso (kg) *</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={createForm.weightKg}
                        onChange={(e) => setCreateForm({ ...createForm, weightKg: e.target.value === "" ? "" : Number(e.target.value) })}
                        placeholder="0.0"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Cant. Cajas *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={createForm.boxCount}
                        onChange={(e) => setCreateForm({ ...createForm, boxCount: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Valor Decl. ($)</label>
                      <input
                        type="number"
                        value={createForm.declaredValue}
                        onChange={(e) => setCreateForm({ ...createForm, declaredValue: e.target.value === "" ? "" : Number(e.target.value) })}
                        placeholder="0.00"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Electrónicos */}
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-950">¿Contiene equipos electrónicos?</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setCreateForm({ ...createForm, containElectronics: false })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            !createForm.containElectronics
                              ? "bg-slate-900 text-white"
                              : "bg-white border text-slate-700"
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => setCreateForm({ ...createForm, containElectronics: true })}
                          className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            createForm.containElectronics
                              ? "bg-amber-500 text-slate-950"
                              : "bg-white border text-slate-700"
                          }`}
                        >
                          Sí
                        </button>
                      </div>
                    </div>

                    {createForm.containElectronics && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in">
                        <input
                          type="text"
                          value={createForm.electronicsDetails}
                          onChange={(e) => setCreateForm({ ...createForm, electronicsDetails: e.target.value })}
                          placeholder="Marca, modelo y serie (ej. Laptop HP 15)"
                          className="px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs font-medium text-slate-900 focus:outline-none"
                        />
                        <input
                          type="number"
                          value={createForm.electronicsDeclaredValue}
                          onChange={(e) => setCreateForm({ ...createForm, electronicsDeclaredValue: e.target.value })}
                          placeholder="Valor del equipo ($)"
                          className="px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs font-medium text-slate-900 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setSelectedPickupToConvert(null);
                    }}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Guardando en BD...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Guardar Warehouse en Oficina
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Shipment / Warehouse Detail Modal */}
      {selectedShipment && (
        <ShipmentDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          shipment={selectedShipment}
        />
      )}
    </div>
  );
}

export default function AdminWarehousesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando Warehouse...</span>
        </div>
      }
    >
      <AdminWarehousesContent />
    </Suspense>
  );
}
