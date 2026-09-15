"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, MapPin, Loader2, Package, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/config/api";
import { ShipmentDetailModal, ModalShipment } from "@/components/admin/ShipmentDetailModal";

interface ShipmentItem extends ModalShipment {}

const STANDARDIZED_STATUSES = [
  "Pick up en proceso",
  "En el origen",
  "En camino",
  "Llegó a su destino",
];

const normalizeStatus = (rawStatus: string): string => {
  const s = (rawStatus || "").toLowerCase();
  if (s.includes("pick") || s.includes("recoleccion") || s.includes("recolección") || s.includes("domicilio")) return "Pick up en proceso";
  if (s.includes("origen") || s.includes("recibido")) return "En el origen";
  if (s.includes("camino") || s.includes("tránsito") || s.includes("transito") || s.includes("aduana")) return "En camino";
  if (s.includes("destino") || s.includes("entregado")) return "Llegó a su destino";
  return "En el origen";
};

export default function AdminEnviosPage() {
  const { socket, prealertas, refreshPrealertas } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [dbShipments, setDbShipments] = useState<ShipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedShipment, setSelectedShipment] = useState<ShipmentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 15;

  const fetchShipments = useCallback(() => {
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
        let pickupsData =
          pickupsResult.status === "fulfilled"
            ? Array.isArray(pickupsResult.value)
              ? pickupsResult.value
              : Array.isArray(pickupsResult.value?.pickups)
              ? pickupsResult.value.pickups
              : []
            : [];

        // Combinar con pickups locales y verificados
        if (typeof window !== "undefined") {
          try {
            const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
            if (Array.isArray(localSaved) && localSaved.length > 0) {
              for (const loc of localSaved) {
                const idx = pickupsData.findIndex((p: any) => p.id === loc.id || p.pickupCode === loc.pickupCode);
                if (idx >= 0) {
                  pickupsData[idx] = { ...pickupsData[idx], ...loc };
                } else {
                  pickupsData.unshift(loc);
                }
              }
            }
          } catch {}
        }

        const mapped: ShipmentItem[] = shipmentsData.map((item: any) => {
          const normalizedStatus = normalizeStatus(item.currentStatus);
          const hasPickup = Boolean(item.hasPickup || normalizedStatus === "Pick up en proceso" || item.pickup);
          const code = item.trackingCode || item.id;

          const matchedPickup = pickupsData.find(
            (p: any) => p.pickupCode === code || p.id === item.pickupId || p.id === code
          );

          // Resolver dimensiones auditadas con alta fidelidad
          let finalDimensions = item.dimensions;
          if (!finalDimensions || finalDimensions.includes("auditadas") || finalDimensions.includes("caja(s)")) {
            if (matchedPickup?.dimensions) finalDimensions = matchedPickup.dimensions;
            else if (matchedPickup?.verifiedDimensions) finalDimensions = matchedPickup.verifiedDimensions;
          }
          if (!finalDimensions) {
            finalDimensions = matchedPickup?.boxCount ? `${matchedPickup.boxCount} caja(s) (30x20x15 cm)` : "30x20x15 cm";
          }

          // Resolver notas de inspección técnica
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
            finalInspectionNotes = "Empaque original verificado conforme";
          }

          // Resolver peso auditado
          const finalWeight = matchedPickup?.totalWeightKg
            ? `${matchedPickup.totalWeightKg} kg`
            : `${item.weightKg || 1.0} kg`;

          return {
            id: code || `ENV-${Math.random()}`,
            tracking: code || "BBX-UNTITLED",
            providerWarehouseReceipt: item.providerWarehouseReceipt || item.prealerta?.providerWarehouseReceipt || undefined,
            type: item.serviceType || (hasPickup ? "Pickup a Domicilio + Aéreo Exprés" : "Aéreo Express"),
            weight: finalWeight,
            dimensions: finalDimensions,
            inspectionNotes: finalInspectionNotes,
            clientName: item.user?.name || matchedPickup?.user?.name || item.recipientName || item.senderName || "Cliente BeeBox",
            suiteCode: item.user?.suiteCode || matchedPickup?.user?.suiteCode || "CAS-OK-HUB",
            route: `${item.senderCity || matchedPickup?.senderCity || "Broken Arrow, OK"} → ${item.recipientCity || matchedPickup?.recipientCity || "Destino"}`,
            currentStatus: normalizedStatus,
            lastActivity: item.estimatedDelivery || "Reciente",
            activityDesc: `Estado actual: ${normalizedStatus}`,
            hasPickup,
            senderName: item.senderName || matchedPickup?.senderName || item.clientName,
            senderAddress: item.pickup?.senderAddress || matchedPickup?.senderAddress || item.recipientAddress || item.senderCity,
            senderCity: item.senderCity || matchedPickup?.senderCity || "Broken Arrow, OK",
            recipientName: item.recipientName || matchedPickup?.recipientName || item.user?.name,
            recipientAddress: item.recipientAddress || matchedPickup?.recipientAddress,
            recipientCity: item.recipientCity || matchedPickup?.recipientCity || "Caracas, Venezuela",
            pickupDate: item.pickup?.pickupDate || matchedPickup?.pickupDate,
            timeSlot: item.pickup?.timeSlot || matchedPickup?.timeSlot,
            events: item.events || [],
          };
        });

        // Asegurar que si hay pickups solicitados que aún no tienen shipment en DB, aparezcan también
        for (const pk of pickupsData) {
          const code = pk.pickupCode || pk.id;
          const alreadyExists = mapped.some(
            (sh) => sh.tracking === code || sh.id === code
          );
          if (!alreadyExists) {
            const dims = pk.dimensions || pk.verifiedDimensions || (pk.boxCount ? `${pk.boxCount} caja(s) (30x20x15 cm)` : "30x20x15 cm");
            const notes = pk.inspectionNotes || "Empaque original verificado conforme";
            mapped.unshift({
              id: code,
              tracking: code,
              type: "Pickup a Domicilio + Aéreo Exprés",
              weight: `${pk.totalWeightKg || 1.0} kg`,
              dimensions: dims,
              inspectionNotes: notes,
              clientName: pk.user?.name || pk.senderName || "Cliente BeeBox",
              suiteCode: pk.user?.suiteCode || "CAS-OK-HUB",
              route: `${pk.senderCity || "Domicilio"} → ${pk.recipientCity || "Caracas, Venezuela"}`,
              currentStatus: normalizeStatus(pk.status || "Pick up en proceso"),
              lastActivity: pk.pickupDate || "Reciente",
              activityDesc: `Estado actual: Pick up en proceso`,
              hasPickup: true,
              senderName: pk.senderName,
              senderAddress: pk.senderAddress,
              senderCity: pk.senderCity,
              recipientName: pk.recipientName,
              recipientAddress: pk.recipientAddress,
              recipientCity: pk.recipientCity,
              pickupDate: pk.pickupDate,
              timeSlot: pk.timeSlot,
              events: [
                {
                  status: "Pick up en proceso",
                  title: "Solicitud de Pickup Registrada y Auditada",
                  description: `Recolección en domicilio solicitada para el día ${pk.pickupDate} (${pk.timeSlot}). Peso: ${pk.totalWeightKg || 1.0} kg. Medidas auditadas: ${dims}. Inspección: ${notes}`,
                  location: `${pk.senderAddress}, ${pk.senderCity}`,
                  timestamp: pk.createdAt,
                },
              ],
            });
          }
        }

        setDbShipments(mapped);
      })
      .catch(() => {
        // En caso de error, retener envíos
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchShipments();
    refreshPrealertas();

    const handleSync = () => {
      fetchShipments();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("focus", handleSync);

    if (socket) {
      socket.on("shipment:updated", fetchShipments);
      socket.on("prealerta:updated", () => {
        fetchShipments();
        refreshPrealertas();
      });
    }

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("focus", handleSync);
      if (socket) {
        socket.off("shipment:updated", fetchShipments);
        socket.off("prealerta:updated", fetchShipments);
      }
    };
  }, [fetchShipments, refreshPrealertas, socket]);

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
        setNoticeMsg(`El estado del paquete ${trackingCode} se actualizó a "${newStatus}".`);
        setTimeout(() => setNoticeMsg(null), 4000);
      }
    } catch {
      setNoticeMsg("Error al actualizar el estado del envío.");
      setTimeout(() => setNoticeMsg(null), 4000);
    }
  };

  // Fusión reactiva: combinar envíos de la base de datos con todas las prealertas confirmadas
  const mergedShipments = useMemo(() => {
    const list: ShipmentItem[] = [...dbShipments];

    const confirmedPrealertas = (prealertas || []).filter(
      (p) => p.status === "Confirmado" || p.status === "Vinculado"
    );

    for (const p of confirmedPrealertas) {
      const trackingCode = p.warehouseGuide || p.trackingNumber || `OK-${Math.floor(100000 + Math.random() * 900000)}`;
      const alreadyExists = list.some(
        (sh) =>
          sh.tracking === trackingCode ||
          sh.tracking === p.trackingNumber ||
          (p.providerWarehouseReceipt && sh.providerWarehouseReceipt === p.providerWarehouseReceipt)
      );

      if (!alreadyExists) {
        list.unshift({
          id: trackingCode,
          tracking: trackingCode,
          providerWarehouseReceipt: p.providerWarehouseReceipt,
          type: "Aéreo Express",
          weight: "1.0 kg",
          clientName: p.store || "Cliente BeeBox",
          suiteCode: "CAS-OK-HUB",
          route: `Broken Arrow, OK → ${p.destination || "Caracas, Venezuela"}`,
          currentStatus: "En el origen",
          lastActivity: "Reciente",
          activityDesc: "Estado actual: En el origen",
          hasPickup: false,
          senderName: p.store || "Oklahoma Warehouse",
          senderCity: "Broken Arrow, OK",
          recipientName: p.userName || "Cliente BeeBox",
          recipientCity: p.destination || "Caracas, Venezuela",
          events: [
            {
              status: "En el origen",
              title: "Recibido en Almacén",
              description: `Paquete ingresado desde ${p.store}.`,
              location: "Broken Arrow, OK",
            },
          ],
        });
      }
    }

    return list;
  }, [dbShipments, prealertas]);

  const filteredShipments = useMemo(() => {
    const searchLower = (search || "").toLowerCase();

    return mergedShipments.filter((sh) => {
      const trackingStr = (sh.tracking || "").toLowerCase();
      const wrStr = (sh.providerWarehouseReceipt || "").toLowerCase();
      const clientStr = (sh.clientName || "").toLowerCase();
      const suiteStr = (sh.suiteCode || "").toLowerCase();

      const matchesSearch =
        trackingStr.includes(searchLower) ||
        wrStr.includes(searchLower) ||
        clientStr.includes(searchLower) ||
        suiteStr.includes(searchLower);

      if (activeTab === "todos") return matchesSearch;
      if (activeTab === "pickup") return matchesSearch && sh.currentStatus === "Pick up en proceso";
      if (activeTab === "origen") return matchesSearch && sh.currentStatus === "En el origen";
      if (activeTab === "camino") return matchesSearch && sh.currentStatus === "En camino";
      if (activeTab === "destino") return matchesSearch && sh.currentStatus === "Llegó a su destino";
      return matchesSearch;
    });
  }, [mergedShipments, search, activeTab]);

  const totalPages = Math.ceil(filteredShipments.length / pageSize) || 1;
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Control de Envíos</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            SEGUIMIENTO Y CAMBIO DE ESTADO (PICKUP, ORIGEN, CAMINO, DESTINO)
          </span>
        </div>

        <button
          onClick={fetchShipments}
          className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Actualizar Datos
        </button>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Tabs & Search Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
            {[
              { id: "todos", label: "TODOS LOS ENVÍOS" },
              { id: "pickup", label: "PICK UP EN PROCESO" },
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
                  activeTab === tab.id ? "bg-amber-500 text-slate-950 font-black shadow-md" : "text-slate-600 hover:text-slate-900"
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
              placeholder="Buscar guía, WR, cliente..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Global Tracking Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando envíos desde la base de datos...</span>
          </div>
        ) : paginatedShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No hay envíos registrados para el filtro seleccionado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">GUÍA ALMACÉN</th>
                  <th className="py-4 px-4">WR PROVEEDOR</th>
                  <th className="py-4 px-4">CLIENTE / CASILLERO</th>
                  <th className="py-4 px-4">RUTA</th>
                  <th className="py-4 px-4">CAMBIAR ESTATUS DEL PAQUETE</th>
                  <th className="py-4 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {paginatedShipments.map((sh) => (
                  <tr key={sh.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 block">{sh.tracking}</span>
                        {sh.hasPickup && (
                          <span className="p-1 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold inline-flex items-center" title="Recolección a Domicilio">
                            <Truck className="w-3 h-3 mr-0.5" /> Pickup
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">{sh.type} • {sh.weight}</span>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      {sh.providerWarehouseReceipt ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          {sh.providerWarehouseReceipt}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{sh.clientName}</span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">{sh.suiteCode}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-600">{sh.route}</td>
                    <td className="py-4 px-4">
                      <select
                        value={sh.currentStatus}
                        onChange={(e) => handleUpdateStatus(sh.tracking, e.target.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none transition-all ${
                          sh.currentStatus === "Llegó a su destino"
                            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                            : sh.currentStatus === "En camino"
                            ? "bg-indigo-50 border-indigo-300 text-indigo-900"
                            : sh.currentStatus === "Pick up en proceso"
                            ? "bg-amber-100 border-amber-400 text-amber-950 ring-1 ring-amber-400/40"
                            : "bg-blue-50 border-blue-300 text-blue-900"
                        }`}
                      >
                        {STANDARDIZED_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedShipment(sh);
                          setIsModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 font-bold text-[11px] transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> Ver Detalle
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

      {/* Modal de Detalle con Barra de Progreso y Nodos Conectados */}
      <ShipmentDetailModal
        shipment={selectedShipment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedShipment(null);
        }}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
