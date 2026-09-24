"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Calendar,
  Check,
  Loader2,
  Truck,
  MapPin,
  Clock,
  Phone,
  Package,
  User,
  ArrowRight,
  ShieldCheck,
  Ban,
  AlertCircle,
  Scale,
  BatteryCharging,
  Laptop,
  AlertTriangle,
} from "lucide-react";
import { API_URL } from "@/config/api";

interface ApiPickup {
  id: string;
  pickupCode: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  boxCount: number;
  totalWeightKg: number;
  boxes?: {
    id?: string;
    size?: string;
    contentDescription?: string;
    declaredValue?: number | "";
    containElectronics?: boolean;
    electronicsDetails?: string;
    electronicsDeclaredValue?: number | "";
  }[];
  dimensions?: string;
  verifiedDimensions?: string;
  inspectionNotes?: string;
  containElectronics?: boolean;
  electronicsDetails?: string;
  electronicsDeclaredValue?: number | "";
  containLithium?: boolean;
  recipientName?: string;
  recipientPhone?: string;
  recipientPhone2?: string;
  recipientAddress?: string;
  recipientCity?: string;
  pickupDate: string;
  timeSlot: string;
  status: string;
  user?: {
    id?: string;
    name: string;
    suiteCode: string;
  };
  vehicle?: {
    id: string;
    name: string;
    category?: string;
  };
}

interface FleetVehicle {
  id: string;
  name: string;
  category?: string;
}

const DEFAULT_FLEET: FleetVehicle[] = [
  { id: "v_1", name: "Van Express Ford Transit #02", category: "Van Ligera" },
  { id: "v_2", name: "Camioneta Nissan Reparto #01", category: "Pickup Urbana" },
  { id: "v_3", name: "Furgón Mercedes Sprinter #04", category: "Carga Pesada" },
];

const DEFAULT_MOCK_PICKUPS: ApiPickup[] = [
  {
    id: "pk_mock_1",
    pickupCode: "PK-9821-DOM",
    senderName: "Juan Pérez",
    senderPhone: "+1 (918) 555-0199",
    senderAddress: "Av. Insurgentes Sur 1234, Col. Del Valle",
    senderCity: "Broken Arrow, OK",
    boxCount: 2,
    totalWeightKg: 3.5,
    boxes: [
      { id: "b1", size: "Mediano", contentDescription: "Ropa variada y calzado deportivo", declaredValue: 120 },
      { id: "b2", size: "Pequeño", contentDescription: "Cosméticos y accesorios personales", declaredValue: 80 },
    ],
    containElectronics: false,
    containLithium: false,
    pickupDate: "2026-10-18",
    timeSlot: "mañana",
    status: "PENDIENTE",
    user: {
      name: "Juan Pérez",
      suiteCode: "CAS-OK-HUB",
    },
    recipientName: "María López",
    recipientPhone: "+58 412 555 1234",
    recipientPhone2: "+58 414 777 8899",
    recipientAddress: "Calle Reforma 456, Urb Las Mercedes",
    recipientCity: "Caracas, Venezuela",
  },
  {
    id: "pk_mock_2",
    pickupCode: "PK-4412-DOM",
    senderName: "Andrea Salazar",
    senderPhone: "+1 (918) 555-9012",
    senderAddress: "1405 Elm St, Suite 300",
    senderCity: "Tulsa, OK",
    boxCount: 1,
    totalWeightKg: 1.8,
    boxes: [
      { id: "b1", size: "Mediano", contentDescription: "Artículos de papelería y oficina", declaredValue: 90 },
    ],
    containElectronics: true,
    electronicsDetails: "1 Laptop Lenovo ThinkPad T14",
    electronicsDeclaredValue: 750,
    containLithium: true,
    pickupDate: "2026-10-19",
    timeSlot: "tarde",
    status: "EN_PROCESO",
    user: {
      name: "Andrea Salazar",
      suiteCode: "CAS-OK-3982",
    },
    recipientName: "Carlos Salazar",
    recipientPhone: "+58 414 777 8899",
    recipientPhone2: "+58 416 333 4455",
    recipientAddress: "Av 4 Bella Vista con Calle 72",
    recipientCity: "Maracaibo, Venezuela",
    vehicle: {
      id: "v_1",
      name: "Van Express Ford Transit #02",
      category: "Van Ligera",
    },
  },
  {
    id: "pk_mock_3",
    pickupCode: "PK-7730-DOM",
    senderName: "Roberto Gómez",
    senderPhone: "+1 (918) 555-7832",
    senderAddress: "8920 S Memorial Dr",
    senderCity: "Broken Arrow, OK",
    boxCount: 3,
    totalWeightKg: 5.2,
    containElectronics: false,
    containLithium: false,
    pickupDate: "2026-10-17",
    timeSlot: "mañana",
    status: "COMPLETADO",
    user: {
      name: "Roberto Gómez",
      suiteCode: "CAS-OK-5512",
    },
    recipientName: "Elena Gómez",
    recipientPhone: "+58 416 888 2345",
    recipientAddress: "Av Francisco de Miranda, Chacao",
    recipientCity: "Caracas, Venezuela",
    vehicle: {
      id: "v_2",
      name: "Camioneta Nissan Reparto #01",
      category: "Pickup Urbana",
    },
  },
];

const isPorConfirmar = (status: string) => {
  const s = (status || "").toUpperCase();
  return s === "PENDIENTE" || s === "POR_CONFIRMAR" || s === "POR CONFIRMAR";
};

const isEnProceso = (status: string) => {
  const s = (status || "").toUpperCase();
  return s === "EN_PROCESO" || s === "EN PROCESO" || s === "CONFIRMADO" || s === "EN RUTA";
};

const isEnOrigen = (status: string) => {
  const s = (status || "").toUpperCase();
  return s === "EN_ORIGEN" || s === "EN ORIGEN" || s === "COMPLETADO" || s === "RECOLECTADO" || s === "RECIBIDO_ALMACEN";
};

export default function AdminPickupsPage() {
  const [search, setSearch] = useState("");
  const [pickups, setPickups] = useState<ApiPickup[]>([]);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(DEFAULT_FLEET);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState<ApiPickup | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [customGuide, setCustomGuide] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("POR_CONFIRMAR");
  const [validatedNotice, setValidatedNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Campos de auditoría técnica por parte del personal operativo
  const [verifiedWeight, setVerifiedWeight] = useState<number>(1.0);
  const [verifiedBoxes, setVerifiedBoxes] = useState<number>(1);
  const [verifiedLength, setVerifiedLength] = useState<string>("30");
  const [verifiedWidth, setVerifiedWidth] = useState<string>("20");
  const [verifiedHeight, setVerifiedHeight] = useState<string>("15");
  const [verifiedElectronics, setVerifiedElectronics] = useState<boolean>(false);
  const [verifiedLithium, setVerifiedLithium] = useState<boolean>(false);
  const [inspectionNotes, setInspectionNotes] = useState<string>("Empaque original en buen estado, verificado en almacén");

  const fetchPickups = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    Promise.allSettled([
      fetch(`${API_URL}/pickups`, { headers: authHeaders }).then((res) => res.json()),
      fetch(`${API_URL}/fleet`, { headers: authHeaders }).then((res) => res.json()),
    ])
      .then(([pickupsResult, fleetResult]) => {
        let list: ApiPickup[] = [];
        if (pickupsResult.status === "fulfilled") {
          const data = pickupsResult.value;
          list = Array.isArray(data)
            ? data
            : Array.isArray(data?.pickups)
            ? data.pickups
            : [];
        }

        // Combinar con solicitudes locales y priorizar pendientes
        if (typeof window !== "undefined") {
          try {
            const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
            if (Array.isArray(localSaved) && localSaved.length > 0) {
              for (const loc of localSaved) {
                const existingIdx = list.findIndex((p) => p.id === loc.id || p.pickupCode === loc.pickupCode);
                if (existingIdx >= 0) {
                  list[existingIdx] = { ...list[existingIdx], ...loc };
                } else {
                  list.unshift(loc);
                }
              }
            }
          } catch {}
        }

        // Si la lista está vacía, usar mocks para demostración operativa
        if (list.length === 0) {
          list = DEFAULT_MOCK_PICKUPS;
        }

        setPickups(list);
        if (list.length > 0) {
          setSelectedPickup(list[0]);
        }

        if (fleetResult.status === "fulfilled" && Array.isArray(fleetResult.value) && fleetResult.value.length > 0) {
          setFleetVehicles(fleetResult.value);
        } else {
          setFleetVehicles(DEFAULT_FLEET);
        }
      })
      .catch(() => {
        setPickups(DEFAULT_MOCK_PICKUPS);
        if (DEFAULT_MOCK_PICKUPS.length > 0) setSelectedPickup(DEFAULT_MOCK_PICKUPS[0]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  useEffect(() => {
    if (selectedPickup) {
      setSelectedVehicleId(selectedPickup.vehicle?.id || "");
      setCustomGuide(selectedPickup.pickupCode || "");
      setVerifiedWeight(selectedPickup.totalWeightKg || 1.0);
      setVerifiedBoxes(selectedPickup.boxCount || 1);
      setVerifiedElectronics(Boolean(selectedPickup.containElectronics));
      setVerifiedLithium(Boolean(selectedPickup.containLithium));

      const rawDims = selectedPickup.dimensions || selectedPickup.verifiedDimensions;
      if (rawDims) {
        const parts = rawDims.replace(/cm/gi, "").trim().split(/[xX*]/);
        if (parts.length === 3) {
          setVerifiedLength(parts[0].trim());
          setVerifiedWidth(parts[1].trim());
          setVerifiedHeight(parts[2].trim());
        }
      }

      if (selectedPickup.inspectionNotes) {
        setInspectionNotes(selectedPickup.inspectionNotes);
      }
    }
  }, [selectedPickup]);

  // Guardar / Actualizar Auditoría Técnica (dimensiones, peso, notas) en cualquier momento
  const handleSaveAuditSpecs = async () => {
    if (!selectedPickup) return;
    setSubmitting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    const finalDimensions = `${verifiedLength}x${verifiedWidth}x${verifiedHeight} cm`;
    const fullNotes = inspectionNotes.trim() || "Empaque original verificado conforme";

    const updatedPickup: ApiPickup = {
      ...selectedPickup,
      totalWeightKg: verifiedWeight,
      boxCount: verifiedBoxes,
      dimensions: finalDimensions,
      verifiedDimensions: finalDimensions,
      inspectionNotes: fullNotes,
      containElectronics: verifiedElectronics,
      containLithium: verifiedLithium,
    };

    try {
      await fetch(`${API_URL}/pickups/${selectedPickup.id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          verifiedWeight,
          verifiedBoxes,
          verifiedDimensions: finalDimensions,
          inspectionNotes: fullNotes,
        }),
      });
    } catch {
      // Graceful offline fallback
    }

    setPickups((prev) =>
      prev.map((p) => (p.id === selectedPickup.id ? updatedPickup : p))
    );
    setSelectedPickup(updatedPickup);

    // Actualizar almacenamiento local beebox_local_pickups
    if (typeof window !== "undefined") {
      try {
        const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
        const updatedLocal = localSaved.map((p: any) =>
          p.id === selectedPickup.id || p.pickupCode === selectedPickup.pickupCode
            ? { ...p, ...updatedPickup }
            : p
        );
        localStorage.setItem("beebox_local_pickups", JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }

    setValidatedNotice(
      `¡Medidas y auditoría técnica de ${updatedPickup.pickupCode} actualizadas exitosamente! Peso: ${verifiedWeight} kg (${finalDimensions}).`
    );
    setTimeout(() => setValidatedNotice(null), 5000);
    setSubmitting(false);
  };

  // Asignar vehículo a pickup por confirmar y mover a "En proceso"
  const handleConfirmPickup = async () => {
    if (!selectedPickup) return;
    setSubmitting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    const assignedVehicle = fleetVehicles.find((v) => v.id === selectedVehicleId) || fleetVehicles[0];
    const finalDimensions = `${verifiedLength}x${verifiedWidth}x${verifiedHeight} cm`;
    const fullNotes = `${inspectionNotes} ${verifiedLithium ? "[BATERÍAS LITIO IATA UN3481]" : ""} ${verifiedElectronics ? "[EQUIPO ELECTRÓNICO]" : ""}`.trim();

    const updatedPickup: ApiPickup = {
      ...selectedPickup,
      status: "EN_PROCESO",
      pickupCode: customGuide || selectedPickup.pickupCode,
      totalWeightKg: verifiedWeight,
      boxCount: verifiedBoxes,
      dimensions: finalDimensions,
      verifiedDimensions: finalDimensions,
      inspectionNotes: fullNotes,
      containElectronics: verifiedElectronics,
      containLithium: verifiedLithium,
      vehicle: assignedVehicle ? { id: assignedVehicle.id, name: assignedVehicle.name } : selectedPickup.vehicle,
    };

    try {
      await fetch(`${API_URL}/pickups/${selectedPickup.id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          status: "EN_PROCESO",
          vehicleId: selectedVehicleId || assignedVehicle?.id || undefined,
          warehouseGuide: customGuide || selectedPickup.pickupCode,
          verifiedWeight,
          verifiedBoxes,
          verifiedDimensions: finalDimensions,
          inspectionNotes: fullNotes,
        }),
      });
    } catch {
      // Graceful offline fallback
    }

    setPickups((prev) =>
      prev.map((p) => (p.id === selectedPickup.id ? updatedPickup : p))
    );
    setSelectedPickup(updatedPickup);
    setStatusFilter("EN_PROCESO");

    // Actualizar almacenamiento local
    if (typeof window !== "undefined") {
      try {
        const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
        const updatedLocal = localSaved.map((p: any) =>
          p.id === selectedPickup.id || p.pickupCode === selectedPickup.pickupCode ? updatedPickup : p
        );
        localStorage.setItem("beebox_local_pickups", JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }

    setValidatedNotice(
      `¡Vehículo ${assignedVehicle?.name || "asignado"} vinculado a la solicitud ${updatedPickup.pickupCode}! Se movió a "En proceso" para su búsqueda en calle.`
    );
    setTimeout(() => setValidatedNotice(null), 6000);
    setSubmitting(false);
  };

  // Marcar como recibido en origen, completar pickup y formalizar envío
  const handleMarkCollected = async () => {
    if (!selectedPickup) return;
    setSubmitting(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    const finalDimensions = `${verifiedLength}x${verifiedWidth}x${verifiedHeight} cm`;
    const fullNotes = inspectionNotes.trim() || "Empaque original verificado conforme en almacén";

    const updatedPickup: ApiPickup = {
      ...selectedPickup,
      status: "COMPLETADO",
      totalWeightKg: verifiedWeight,
      boxCount: verifiedBoxes,
      dimensions: finalDimensions,
      verifiedDimensions: finalDimensions,
      inspectionNotes: fullNotes,
      containElectronics: verifiedElectronics,
      containLithium: verifiedLithium,
    };

    try {
      await fetch(`${API_URL}/pickups/${selectedPickup.id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({
          status: "COMPLETADO",
          verifiedWeight,
          verifiedBoxes,
          verifiedDimensions: finalDimensions,
          inspectionNotes: fullNotes,
        }),
      });
    } catch {
      // Graceful offline fallback
    }

    setPickups((prev) =>
      prev.map((p) => (p.id === selectedPickup.id ? updatedPickup : p))
    );
    setSelectedPickup(updatedPickup);
    setStatusFilter("EN_ORIGEN");

    if (typeof window !== "undefined") {
      try {
        const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
        const updatedLocal = localSaved.map((p: any) =>
          p.id === selectedPickup.id || p.pickupCode === selectedPickup.pickupCode ? updatedPickup : p
        );
        localStorage.setItem("beebox_local_pickups", JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event("storage"));
      } catch {}
    }

    setValidatedNotice(
      `¡Paquete ${selectedPickup.pickupCode} recibido en el almacén de origen! El pickup ha sido completado y ahora es un envío oficial.`
    );
    setTimeout(() => setValidatedNotice(null), 8000);
    setSubmitting(false);
  };

  const handleCancelPickup = async () => {
    if (!selectedPickup) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token
      ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
      : { "Content-Type": "application/json" };

    try {
      const res = await fetch(`${API_URL}/pickups/${selectedPickup.id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status: "CANCELADO" }),
      });

      if (res.ok) {
        const updated = { ...selectedPickup, status: "CANCELADO" };
        setPickups((prev) => prev.map((p) => (p.id === selectedPickup.id ? updated : p)));
        setSelectedPickup(updated);
        setValidatedNotice(`Solicitud ${selectedPickup.pickupCode} cancelada.`);
        setTimeout(() => setValidatedNotice(null), 4000);
      }
    } catch {
      // ignore
    }
  };

  const filteredPickups = pickups.filter((p) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      p.pickupCode.toLowerCase().includes(searchLower) ||
      p.senderName.toLowerCase().includes(searchLower) ||
      p.senderAddress.toLowerCase().includes(searchLower) ||
      (p.user?.suiteCode || "").toLowerCase().includes(searchLower);

    if (statusFilter === "POR_CONFIRMAR") return matchesSearch && isPorConfirmar(p.status);
    if (statusFilter === "EN_PROCESO") return matchesSearch && isEnProceso(p.status);
    if (statusFilter === "EN_ORIGEN") return matchesSearch && isEnOrigen(p.status);
    return matchesSearch && isPorConfirmar(p.status);
  });

  const porConfirmarCount = pickups.filter((p) => isPorConfirmar(p.status)).length;
  const enProcesoCount = pickups.filter((p) => isEnProceso(p.status)).length;
  const enOrigenCount = pickups.filter((p) => isEnOrigen(p.status)).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-4 sm:p-6 min-h-screen rounded-3xl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión Operativa de Pickups</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            RECOLECCIONES A DOMICILIO • ASIGNACIÓN DE FLOTA Y RECEPCIÓN EN ORIGEN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, cliente, dirección..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-900 shadow-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <span className="px-3.5 py-2 rounded-2xl bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" /> {porConfirmarCount} POR CONFIRMAR
          </span>
        </div>
      </div>

      {/* Tabs Filter Bar: EXACTLY 3 TABS, NO 'TODOS' */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl overflow-x-auto w-fit">
        {[
          { id: "POR_CONFIRMAR", label: "POR CONFIRMAR", count: porConfirmarCount },
          { id: "EN_PROCESO", label: "EN PROCESO", count: enProcesoCount },
          { id: "EN_ORIGEN", label: "EN ORIGEN (COMPLETADOS)", count: enOrigenCount },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setStatusFilter(tab.id);
              const firstInTab = pickups.find((p) => {
                if (tab.id === "POR_CONFIRMAR") return isPorConfirmar(p.status);
                if (tab.id === "EN_PROCESO") return isEnProceso(p.status);
                if (tab.id === "EN_ORIGEN") return isEnOrigen(p.status);
                return true;
              });
              if (firstInTab) setSelectedPickup(firstInTab);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all shrink-0 flex items-center gap-2 ${
              statusFilter === tab.id
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                statusFilter === tab.id
                  ? "bg-slate-950/15 text-slate-950"
                  : "bg-slate-300 text-slate-700"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {validatedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{validatedNotice}</span>
          </div>
          {selectedPickup && isEnOrigen(selectedPickup.status) && (
            <Link
              href={`/admin/envios?search=${selectedPickup.pickupCode}`}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <ArrowRight className="w-3.5 h-3.5" /> Ir a Control de Envíos
            </Link>
          )}
        </div>
      )}

      {/* Main Content Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando solicitudes de pickup desde el servidor...</span>
        </div>
      ) : filteredPickups.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
          <Truck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {statusFilter === "POR_CONFIRMAR"
              ? "No hay solicitudes pendientes por confirmar"
              : statusFilter === "EN_PROCESO"
              ? "No hay pickups actualmente en proceso de búsqueda"
              : "No hay pickups completados en origen"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {statusFilter === "POR_CONFIRMAR"
              ? "Las nuevas solicitudes creadas por clientes aparecerán aquí para asignar vehículo e iniciar la recolección."
              : statusFilter === "EN_PROCESO"
              ? "Los pickups asignados a choferes que aún no han sido entregados al almacén se gestionan aquí."
              : "Los paquetes que ya fueron retirados en domicilio y recibidos en el almacén de origen se formalizan como envíos."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Request Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {filteredPickups.map((p) => {
              const isPending = isPorConfirmar(p.status);
              const isConfirmed = isEnProceso(p.status);
              const isCollected = isEnOrigen(p.status);
              const isSelected = selectedPickup?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPickup(p)}
                  className={`p-5 rounded-3xl bg-white border-2 shadow-sm space-y-3 cursor-pointer transition-all ${
                    isSelected
                      ? "border-amber-500 ring-4 ring-amber-500/10 shadow-md scale-[1.01]"
                      : "border-slate-200 hover:border-slate-300 hover:shadow"
                  }`}
                >
                  {/* Card Header with Distinctive Domicilio Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                      <Truck className="w-3.5 h-3.5 text-amber-600" /> PICKUP A DOMICILIO
                    </span>

                    <span className="text-xs font-black text-slate-900 font-mono">
                      {p.pickupCode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs">
                        {p.senderName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{p.senderName}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {p.user?.suiteCode || "CAS-CLIENTE"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-700 block">
                        {p.boxCount} {p.boxCount === 1 ? "Caja" : "Cajas"} ({p.totalWeightKg} kg)
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">{p.senderCity}</span>
                    </div>
                  </div>

                  {/* Address Snippet */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="truncate font-medium">{p.senderAddress}</span>
                  </div>

                  {/* Etiquetas Separadas: Electrónicos y Baterías de Litio */}
                  {(p.containElectronics || p.containLithium) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {p.containElectronics && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[9px] font-extrabold">
                          <Laptop className="w-3 h-3 text-blue-600" /> ELECTRÓNICOS
                        </span>
                      )}
                      {p.containLithium && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-300 text-amber-900 text-[9px] font-extrabold">
                          <BatteryCharging className="w-3 h-3 text-amber-600" /> BATERÍA LITIO (IATA)
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" /> {p.pickupDate} ({p.timeSlot})
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full uppercase font-extrabold ${
                        isPending
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : isConfirmed
                          ? "bg-blue-100 text-blue-900 border border-blue-300"
                          : isCollected
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      ● {isPending ? "POR CONFIRMAR" : isConfirmed ? "EN PROCESO" : isCollected ? "EN ORIGEN" : p.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Operative Confirmation & Detail Panel (7 Cols) */}
          {selectedPickup && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
              {/* Detail Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-bold">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Validación y Asignación de Pickup</h3>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      OPERACIÓN DE RECOLECCIÓN FÍSICA
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                  {selectedPickup.pickupCode}
                </span>
              </div>

              {/* Status Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                  isPorConfirmar(selectedPickup.status)
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : isEnProceso(selectedPickup.status)
                    ? "bg-blue-50 border-blue-200 text-blue-900"
                    : "bg-emerald-50 border-emerald-200 text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-current shrink-0" />
                  <span>
                    {isPorConfirmar(selectedPickup.status)
                      ? "Solicitud generada por el cliente. Asigna un vehículo de la flota e inicia la recolección."
                      : isEnProceso(selectedPickup.status)
                      ? `Pickup en proceso. ${selectedPickup.vehicle?.name ? `Unidad asignada: ${selectedPickup.vehicle.name}.` : "Vehículo asignado en ruta."} Cuando la unidad entregue el paquete en almacén, marca 'Recibido en Origen'.`
                      : "¡Paquete recibido en almacén de origen! El pickup finalizó exitosamente y ahora es un envío oficial."}
                  </span>
                </div>

                {isEnOrigen(selectedPickup.status) && (
                  <Link
                    href={`/admin/envios?search=${selectedPickup.pickupCode}`}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                  >
                    <ArrowRight className="w-3.5 h-3.5" /> Ir a Control de Envíos
                  </Link>
                )}
              </div>

              {/* Two Column Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Remitente y Recolección */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block border-b border-slate-200/80 pb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" /> LUGAR Y HORARIO DE RECOLECCIÓN
                  </span>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">REMITENTE</span>
                      <span className="font-bold text-slate-900">{selectedPickup.senderName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">DIRECCIÓN DE RECOGIDA</span>
                      <p className="font-medium text-slate-700 leading-tight">{selectedPickup.senderAddress}</p>
                      <span className="text-[10px] text-slate-400">{selectedPickup.senderCity}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">TELÉFONO</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" /> {selectedPickup.senderPhone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block">FRANJA</span>
                        <span className="font-bold text-amber-700 uppercase">{selectedPickup.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Destinatario y Carga */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block border-b border-slate-200/80 pb-1.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-600" /> DETALLES DEL PAQUETE Y DESTINO
                  </span>

                  <div className="space-y-2.5 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">DESTINATARIO FINAL</span>
                      <span className="font-bold text-slate-900">{selectedPickup.recipientName || selectedPickup.senderName}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">TELÉFONOS DE CONTACTO (DESTINATARIO)</span>
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        <span className="font-bold text-slate-800 flex items-center gap-1 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          <Phone className="w-3 h-3 text-amber-600" /> {selectedPickup.recipientPhone || "No especificado"}
                        </span>
                        {selectedPickup.recipientPhone2 && !selectedPickup.recipientPhone?.includes(selectedPickup.recipientPhone2) && (
                          <span className="font-bold text-slate-800 flex items-center gap-1 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                            <Phone className="w-3 h-3 text-slate-500" /> {selectedPickup.recipientPhone2}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">DIRECCIÓN DE ENTREGA EN DESTINO</span>
                      <p className="font-medium text-slate-700 leading-tight">
                        {selectedPickup.recipientAddress || "Dirección registrada"} ({selectedPickup.recipientCity || "Caracas, Venezuela"})
                      </p>
                    </div>

                    {/* Desglose Individual de Cajas / Bultos */}
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          DESGLOSE DE CARGA ({selectedPickup.boxes?.length || selectedPickup.boxCount} BULTOS)
                        </span>
                        {selectedPickup.boxes && selectedPickup.boxes.length > 0 && (
                          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Total: ${selectedPickup.boxes.reduce((acc, b) => acc + (typeof b.declaredValue === "number" ? b.declaredValue : 0), 0)} USD
                          </span>
                        )}
                      </div>

                      {selectedPickup.boxes && selectedPickup.boxes.length > 0 ? (
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {selectedPickup.boxes.map((b, idx) => (
                            <div key={b.id || idx} className="p-2 rounded-xl bg-white border border-slate-200 space-y-1">
                              <div className="flex items-center justify-between font-bold text-[11px] text-slate-900">
                                <span className="flex items-center gap-1.5">
                                  Caja #{idx + 1} ({b.size || "Mediano"})
                                  {b.containElectronics && (
                                    <span className="text-[9px] font-extrabold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded border border-blue-200 inline-flex items-center gap-0.5">
                                      <Laptop className="w-2.5 h-2.5 text-blue-600" /> Electrónicos
                                    </span>
                                  )}
                                </span>
                                <span className="font-mono text-amber-800">${b.declaredValue || 0} USD</span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-tight">
                                {b.contentDescription || "Sin descripción"}
                              </p>
                              {b.containElectronics && (
                                <div className="p-1 rounded bg-blue-50/80 border border-blue-200 text-blue-950 text-[10px] flex items-center justify-between">
                                  <span className="truncate pr-1">{b.electronicsDetails || "Equipos"}</span>
                                  {b.electronicsDeclaredValue && (
                                    <span className="font-mono font-bold text-blue-800 shrink-0">
                                      ${b.electronicsDeclaredValue} USD
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-slate-700">
                          <span>Volumen: {selectedPickup.boxCount} Cajas</span>
                          <span className="font-mono">{selectedPickup.totalWeightKg} kg estimado</span>
                        </div>
                      )}
                    </div>

                    {/* Declaración Separada de Carga Peligrosa / Especial */}
                    <div className="pt-2 border-t border-slate-200/80 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">1. Dispositivos Electrónicos</span>
                        {selectedPickup.containElectronics ? (
                          <div className="mt-1 p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-0.5 text-[11px]">
                            <div className="flex items-center justify-between font-bold text-blue-900">
                              <span className="flex items-center gap-1">
                                <Laptop className="w-3.5 h-3.5 text-blue-600" /> SÍ contiene equipos
                              </span>
                              {selectedPickup.electronicsDeclaredValue && (
                                <span className="font-mono">${selectedPickup.electronicsDeclaredValue} USD</span>
                              )}
                            </div>
                            {selectedPickup.electronicsDetails && (
                              <p className="text-[10px] font-medium text-blue-900">
                                {selectedPickup.electronicsDetails}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="font-medium text-slate-500 text-[10px]">NO contiene</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">2. Baterías de Litio</span>
                        {selectedPickup.containLithium ? (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md text-[10px] mt-1">
                            <BatteryCharging className="w-3 h-3 text-amber-600" /> SÍ (Norma IATA UN3481)
                          </span>
                        ) : (
                          <span className="font-medium text-slate-500 text-[10px]">NO contiene</span>
                        )}
                      </div>
                    </div>

                    {selectedPickup.inspectionNotes && (
                      <div className="p-2 rounded bg-amber-50 text-[10px] text-amber-900">
                        <strong>Notas del Chofer:</strong> {selectedPickup.inspectionNotes}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AUDITORÍA TÉCNICA DEL PAQUETE (PESAJE Y MEDICIÓN OFICIAL POR OPERACIONES) */}
              <div className="p-5 rounded-2xl bg-white border-2 border-amber-500/30 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-amber-600" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                      Auditoría Técnica del Paquete (Pesaje y Cubicaje en Almacén)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Operativo Obligatorio
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Control de Seguridad:</strong> El cliente no ingresa medidas técnicas para evitar discrepancias. Como operador de almacén, ingresa las medidas reales registradas con báscula calibrada y cinta métrica.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Peso Báscula */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Peso Real en Báscula (kg)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={verifiedWeight}
                        onChange={(e) => setVerifiedWeight(parseFloat(e.target.value) || 0)}
                        className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        kg
                      </span>
                    </div>
                  </div>

                  {/* Bultos Auditados */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Bultos / Cajas Físicas
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={verifiedBoxes}
                      onChange={(e) => setVerifiedBoxes(parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Dimensiones L x W x H */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Dimensiones (Largo × Ancho × Alto cm)
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                      <input
                        type="number"
                        placeholder="L"
                        value={verifiedLength}
                        onChange={(e) => setVerifiedLength(e.target.value)}
                        className="w-full px-1.5 py-2 text-center rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        title="Largo en cm"
                      />
                      <input
                        type="number"
                        placeholder="An"
                        value={verifiedWidth}
                        onChange={(e) => setVerifiedWidth(e.target.value)}
                        className="w-full px-1.5 py-2 text-center rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        title="Ancho en cm"
                      />
                      <input
                        type="number"
                        placeholder="Al"
                        value={verifiedHeight}
                        onChange={(e) => setVerifiedHeight(e.target.value)}
                        className="w-full px-1.5 py-2 text-center rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                        title="Alto en cm"
                      />
                    </div>
                  </div>
                </div>

                {/* Resumen de Cubicaje Automático */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">PESO REAL</span>
                      <span className="font-mono font-bold text-slate-800">{verifiedWeight} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">PESO VOLUMÉTRICO</span>
                      <span className="font-mono font-bold text-slate-800">
                        {((Number(verifiedLength || 0) * Number(verifiedWidth || 0) * Number(verifiedHeight || 0)) / 5000).toFixed(2)} kg
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">PESO FACTURABLE (OFICIAL)</span>
                    <span className="font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                      {Math.max(
                        verifiedWeight,
                        Number(((Number(verifiedLength || 0) * Number(verifiedWidth || 0) * Number(verifiedHeight || 0)) / 5000).toFixed(2))
                      )}{" "}
                      kg
                    </span>
                  </div>
                </div>

                {/* Verificación Operativa Separada: Electrónicos vs Baterías de Litio */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                      Inspección FÍSICA de Carga Regulada (Checklist Operativo)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Revisión en Báscula</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      verifiedElectronics
                        ? "bg-blue-50/70 border-blue-300 text-blue-900"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}>
                      <input
                        type="checkbox"
                        checked={verifiedElectronics}
                        onChange={(e) => setVerifiedElectronics(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <Laptop className="w-4 h-4 text-blue-600 shrink-0" />
                      <div className="leading-tight">
                        <span className="block">Equipos Electrónicos Verificados</span>
                        <span className="text-[9px] font-normal text-slate-500 block">Inspección física de pantallas y circuitos</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                      verifiedLithium
                        ? "bg-amber-50/70 border-amber-300 text-amber-950"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}>
                      <input
                        type="checkbox"
                        checked={verifiedLithium}
                        onChange={(e) => setVerifiedLithium(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                      />
                      <BatteryCharging className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="leading-tight">
                        <span className="block">Baterías de Litio (IATA UN3481)</span>
                        <span className="text-[9px] font-normal text-slate-500 block">Etiquetado de mercancía peligrosa aplicado</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Notas de Inspección de Almacén */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                    Dictamen / Notas de Inspección Operativa
                  </label>
                  <input
                    type="text"
                    value={inspectionNotes}
                    onChange={(e) => setInspectionNotes(e.target.value)}
                    placeholder="Ej. Empaque sellado conforme, verificado en estación de pesaje"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {[
                      "Empaque original verificado conforme",
                      "Caja reforzada con cinta de seguridad",
                      "Reembalaje con plástico burbuja",
                      "Inspeccionado sin artículos prohibidos",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setInspectionNotes(chip)}
                        className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900 font-medium px-2 py-0.5 rounded-md transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ASIGNACIÓN OPERATIVA: VEHÍCULO Y GUÍA */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> CONFIGURACIÓN OPERATIVA DE RECOLECCIÓN
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selector de Vehículo de la Flota */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Asignar Vehículo / Chofer de Flota
                    </label>
                    <select
                      value={selectedVehicleId}
                      onChange={(e) => setSelectedVehicleId(e.target.value)}
                      disabled={isEnOrigen(selectedPickup.status)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      <option value="">Seleccionar unidad de transporte...</option>
                      {fleetVehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.category || "Flota"})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guía Oficial del Envío */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Código de Guía de Envío
                    </label>
                    <input
                      type="text"
                      value={customGuide}
                      onChange={(e) => setCustomGuide(e.target.value)}
                      disabled={!isPorConfirmar(selectedPickup.status)}
                      placeholder="PK-XXXXX-DOM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500 shadow-sm uppercase disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleCancelPickup}
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancelar Solicitud
                </button>

                {/* Botón Guardar Medidas y Auditoría */}
                <button
                  type="button"
                  onClick={handleSaveAuditSpecs}
                  disabled={submitting}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm border border-amber-300/60"
                  title="Guarda las dimensiones oficiales, peso y notas de inspección física en el sistema"
                >
                  <Scale className="w-4 h-4 text-amber-700" />
                  Guardar Auditoría
                </button>

                {/* Botón según estado */}
                {isPorConfirmar(selectedPickup.status) ? (
                  <button
                    onClick={handleConfirmPickup}
                    disabled={submitting}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 ml-auto"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Truck className="w-4 h-4 stroke-[2.5]" />
                        Asignar Vehículo e Iniciar Recolección
                      </>
                    )}
                  </button>
                ) : isEnProceso(selectedPickup.status) ? (
                  <button
                    onClick={handleMarkCollected}
                    disabled={submitting}
                    className="w-full sm:flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 ml-auto"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Package className="w-4 h-4 stroke-[2.5]" />
                        Marcar Recibido en Origen (Completar Pickup)
                      </>
                    )}
                  </button>
                ) : (
                  <div className="ml-auto flex items-center gap-3">
                    <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Recolección completada en bodega.
                    </div>
                    <Link
                      href={`/admin/envios?search=${selectedPickup.pickupCode}`}
                      className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" /> Ver en Control de Envíos
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
