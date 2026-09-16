"use client";

import React from "react";
import {
  X,
  Truck,
  Building2,
  Plane,
  CheckCircle2,
  MapPin,
  Package,
  Calendar,
  Clock,
  Ban,
  AlertCircle,
} from "lucide-react";

export interface TrackingEventItem {
  id?: string;
  status: string;
  title: string;
  description: string;
  location: string;
  timestamp?: string;
}

export interface ModalShipment {
  id: string;
  tracking: string;
  providerWarehouseReceipt?: string;
  type: string;
  weight: string;
  dimensions?: string;
  inspectionNotes?: string;
  clientName: string;
  suiteCode: string;
  route: string;
  currentStatus: string;
  lastActivity: string;
  activityDesc: string;
  hasPickup?: boolean;
  senderName?: string;
  senderAddress?: string;
  senderCity?: string;
  recipientName?: string;
  recipientAddress?: string;
  recipientCity?: string;
  pickupDate?: string;
  timeSlot?: string;
  events?: TrackingEventItem[];
}

interface ShipmentDetailModalProps {
  shipment: ModalShipment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (trackingCode: string, newStatus: string) => Promise<void> | void;
}

const ALL_NODES = [
  {
    id: "pickup",
    statusMatch: "Pick up en proceso",
    label: "Pick up en proceso",
    shortTitle: "1. Recolección",
    description: "Retiro en domicilio del remitente",
    icon: Truck,
  },
  {
    id: "origen",
    statusMatch: "En el origen",
    label: "En el origen",
    shortTitle: "2. Recibido en Origen",
    description: "Recibido e ingresado en almacén",
    icon: Building2,
  },
  {
    id: "camino",
    statusMatch: "En camino",
    label: "En camino",
    shortTitle: "3. En Camino",
    description: "Vuelo / Ruta internacional",
    icon: Plane,
  },
  {
    id: "destino",
    statusMatch: "Llegó a su destino",
    label: "Llegó a su destino",
    shortTitle: "4. En Destino",
    description: "Listo para entrega / retirado",
    icon: CheckCircle2,
  },
];

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  shipment,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !shipment) return null;

  const hasPickup = Boolean(
    shipment.hasPickup || shipment.currentStatus === "Pick up en proceso" || shipment.pickupDate
  );

  // Determinar índice del estado actual
  const getStatusIndex = (status: string) => {
    switch (status) {
      case "Pick up en proceso":
        return 0;
      case "En el origen":
        return 1;
      case "En camino":
        return 2;
      case "Llegó a su destino":
        return 3;
      default:
        return 1; // Por defecto origen
    }
  };

  const currentIdx = getStatusIndex(shipment.currentStatus);

  const isEnOrigen = shipment.currentStatus === "En el origen";
  const isPickUpEnProceso = shipment.currentStatus === "Pick up en proceso";
  const isEnCamino = shipment.currentStatus === "En camino";
  const isDestino = shipment.currentStatus === "Llegó a su destino";

  // Determinar si cada nodo está completado (verde), activo/siguiente (amarillo), o pendiente (gris)
  const getNodeState = (nodeId: string, index: number) => {
    if (nodeId === "pickup" && !hasPickup) {
      return { disabled: true, completed: false, active: false, label: "INHABILITADO" };
    }

    if (isDestino) {
      return { disabled: false, completed: true, active: false, label: "COMPLETADO" };
    }

    if (isEnOrigen) {
      if (nodeId === "pickup") {
        return { disabled: false, completed: true, active: false, label: "RECOLECTADO" };
      }
      if (nodeId === "origen") {
        return { disabled: false, completed: true, active: false, label: "RECIBIDO EN ORIGEN" };
      }
      if (nodeId === "camino") {
        return { disabled: false, completed: false, active: true, label: "SIGUIENTE ESTADO" };
      }
      return { disabled: false, completed: false, active: false, label: "PENDIENTE" };
    }

    if (isEnCamino) {
      if (nodeId === "pickup" || nodeId === "origen") {
        return { disabled: false, completed: true, active: false, label: "COMPLETADO" };
      }
      if (nodeId === "camino") {
        return { disabled: false, completed: false, active: true, label: "EN TRÁNSITO" };
      }
      return { disabled: false, completed: false, active: false, label: "PENDIENTE" };
    }

    if (isPickUpEnProceso) {
      if (nodeId === "pickup") {
        return { disabled: false, completed: false, active: true, label: "EN PROCESO" };
      }
      return { disabled: false, completed: false, active: false, label: "PENDIENTE" };
    }

    // Default fallback
    return {
      disabled: false,
      completed: currentIdx > index,
      active: currentIdx === index,
      label: currentIdx > index ? "COMPLETADO" : currentIdx === index ? "ACTIVO" : "PENDIENTE",
    };
  };

  // Cálculo de porcentaje de la barra de progreso
  const calculateProgressPercent = () => {
    if (hasPickup) {
      if (isPickUpEnProceso) return 15;
      if (isEnOrigen) return 72; // Alcanza y conecta con el siguiente estado En camino
      if (isEnCamino) return 75;
      return 100;
    } else {
      if (isEnOrigen) return 55; // Conecta con En camino
      if (isEnCamino) return 60;
      return 100;
    }
  };

  const progressPercent = calculateProgressPercent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center font-black">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black font-mono text-slate-900 tracking-tight">
                  {shipment.tracking}
                </span>
                {shipment.providerWarehouseReceipt && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-mono font-bold">
                    WR: {shipment.providerWarehouseReceipt}
                  </span>
                )}
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {shipment.type} • {shipment.weight} • Casillero: {shipment.suiteCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                shipment.currentStatus === "Pick up en proceso"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : shipment.currentStatus === "En el origen"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : shipment.currentStatus === "En camino"
                  ? "bg-amber-50 text-amber-800 border-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-300"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              {shipment.currentStatus === "En el origen" ? "Recibido en Origen" : shipment.currentStatus}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1">
          {/* SECCIÓN PRINCIPAL: BARRA DE PROGRESO Y NODOS CONECTADOS */}
          <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 shadow-inner relative overflow-hidden border border-slate-800">
            {/* Background Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-400 block">
                  CANALIZACIÓN DE TRANSPORTE
                </span>
                <h3 className="text-base font-black text-white">Línea de Vida y Progreso del Envío</h3>
              </div>

              {hasPickup ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
                  <Truck className="w-3.5 h-3.5" /> Incluye Pickup a Domicilio
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold">
                  <Building2 className="w-3.5 h-3.5" /> Entrega Directa en Oficina
                </span>
              )}
            </div>

            {/* Stepper Pipeline */}
            <div className="relative pt-4 pb-2">
              {/* Barra de Fondo */}
              <div className="absolute top-11 left-8 right-8 h-1.5 bg-slate-800 rounded-full" />

              {/* Barra Activa Conectora */}
              {hasPickup ? (
                <div
                  className="absolute top-11 left-8 h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `calc(${progressPercent}% * 0.85)` }}
                />
              ) : (
                <div
                  className="absolute top-11 left-[37%] h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `calc(${progressPercent}% * 0.58)` }}
                />
              )}

              {/* Grid de 4 Nodos */}
              <div className="grid grid-cols-4 gap-2 relative z-10">
                {ALL_NODES.map((node, index) => {
                  const Icon = node.icon;
                  const state = getNodeState(node.id, index);

                  return (
                    <div
                      key={node.id}
                      className={`flex flex-col items-center text-center transition-all duration-300 ${
                        state.disabled ? "opacity-45" : "opacity-100"
                      }`}
                    >
                      {/* Node Circle */}
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          state.disabled
                            ? "bg-slate-800/80 border-2 border-dashed border-slate-700 text-slate-500"
                            : state.completed
                            ? "bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/30 scale-105"
                            : state.active
                            ? "bg-amber-500 text-slate-950 font-black ring-4 ring-amber-500/30 shadow-xl shadow-amber-500/40 scale-110 animate-pulse"
                            : "bg-slate-800 border-2 border-slate-700 text-slate-400"
                        }`}
                      >
                        {state.disabled ? (
                          <Ban className="w-5 h-5 text-slate-500" />
                        ) : state.completed ? (
                          <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                        ) : (
                          <Icon className="w-6 h-6 stroke-[2.2]" />
                        )}
                      </div>

                      {/* Text details */}
                      <div className="mt-3 space-y-1 w-full px-1">
                        <span
                          className={`text-[11px] font-extrabold uppercase tracking-tight block ${
                            state.disabled
                              ? "text-slate-500 line-through"
                              : state.active
                              ? "text-amber-400 font-black"
                              : state.completed
                              ? "text-emerald-400 font-bold"
                              : "text-slate-400"
                          }`}
                        >
                          {node.shortTitle}
                        </span>

                        <p className="text-[10px] text-slate-400 font-medium hidden sm:block leading-tight">
                          {state.disabled
                            ? "No solicitado / Oficina"
                            : node.description}
                        </p>

                        {/* Badge de Estado del Nodo */}
                        <div className="pt-1">
                          {state.disabled ? (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-slate-500">
                              INHABILITADO
                            </span>
                          ) : state.completed ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-extrabold text-emerald-300">
                              {state.label}
                            </span>
                          ) : state.active ? (
                            <span className="inline-block px-2 py-0.5 rounded bg-amber-500 text-[9px] font-black text-slate-950 shadow-sm">
                              {state.label}
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-slate-800/80 text-[9px] font-semibold text-slate-500">
                              PENDIENTE
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Banner explicativo contextual */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {hasPickup
                    ? "Este paquete fue programado con recolección directa a domicilio antes de su recepción en almacén."
                    : "El cliente entregó el paquete en la oficina/almacén (sin servicio de pickup). El flujo inicia en el origen."}
                </span>
              </div>
              <span className="font-mono text-[11px] font-bold text-amber-400 shrink-0">
                Progreso: {currentIdx === 3 ? "100%" : `${Math.min(Math.round(((currentIdx + (hasPickup ? 1 : 0)) / 4) * 100), 90)}%`}
              </span>
            </div>
          </div>

          {/* TARJETAS DE INFORMACIÓN DEL ENVÍO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tarjeta Origen / Pickup */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> INFORMACIÓN DE ORIGEN
                </span>
                {hasPickup && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-extrabold">
                    RECOLECCIÓN DOMICILIO
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">REMITENTE / TIENDA</span>
                  <span className="font-bold text-slate-900">{shipment.clientName}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">DIRECCIÓN DE RECOGIDA / ORIGEN</span>
                  <span className="font-medium text-slate-700">
                    {shipment.senderAddress || shipment.route.split("→")[0]?.trim() || "Broken Arrow, OK"}
                  </span>
                </div>

                {hasPickup && (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 space-y-1">
                    <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider block">
                      DATOS DEL PICKUP SOLICITADO
                    </span>
                    <div className="text-[11px] text-amber-950 font-bold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Fecha: {shipment.pickupDate || "Programada"}</span>
                      {shipment.timeSlot && (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600 ml-1" />
                          <span>Franja: {shipment.timeSlot}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tarjeta Destino */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> INFORMACIÓN DE DESTINO
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[9px] font-mono font-extrabold">
                  {shipment.suiteCode}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">DESTINATARIO</span>
                  <span className="font-bold text-slate-900">
                    {shipment.recipientName || shipment.clientName}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">CIUDAD / RUTA DE ENTREGA</span>
                  <span className="font-medium text-slate-700">
                    {shipment.recipientAddress || shipment.route.split("→")[1]?.trim() || "Destino Final"}
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">TIPO DE SERVICIO</span>
                    <span className="font-bold text-slate-800">{shipment.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block">PESO AUDITADO</span>
                    <span className="font-bold font-mono text-slate-800">{shipment.weight}</span>
                  </div>
                </div>

                {shipment.dimensions && (
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-[10px] font-bold text-slate-400">MEDIDAS OFICIALES</span>
                    <span className="font-mono font-bold text-slate-800">{shipment.dimensions}</span>
                  </div>
                )}

                {shipment.inspectionNotes && (
                  <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[10px] text-emerald-800 font-medium">
                    <strong>Auditoría operativa:</strong> {shipment.inspectionNotes}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HISTORIAL CRONOLÓGICO DE EVENTOS */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> Historial de Eventos del Envío
            </h4>

            {shipment.events && shipment.events.length > 0 ? (
              <div className="space-y-2.5 border-l-2 border-slate-200 ml-3 pl-4 py-1">
                {shipment.events.map((evt, idx) => (
                  <div key={evt.id || idx} className="relative group">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-500 border-2 border-white shadow-sm" />
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900">{evt.title || evt.status}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {evt.timestamp ? new Date(evt.timestamp).toLocaleString("es-ES") : "Reciente"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">{evt.description}</p>
                      <span className="text-[10px] font-semibold text-slate-400 block mt-1">
                        📍 {evt.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 text-slate-500 text-xs text-center">
                Registro inicial: Envío establecido en estado <strong className="text-slate-800">{shipment.currentStatus}</strong>.
              </div>
            )}
          </div>
        </div>

        {/* Footer con Selector Rápido de Estado */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {onUpdateStatus ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Cambiar estado directo:</span>
              <select
                value={shipment.currentStatus}
                onChange={(e) => onUpdateStatus(shipment.tracking, e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm"
              >
                <option value="Pick up en proceso">Pick up en proceso</option>
                <option value="En el origen">En el origen</option>
                <option value="En camino">En camino</option>
                <option value="Llegó a su destino">Llegó a su destino</option>
              </select>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-sm ml-auto"
          >
            Cerrar Detalle
          </button>
        </div>
      </div>
    </div>
  );
};
