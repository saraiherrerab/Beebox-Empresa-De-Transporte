"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Truck,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Package,
  Laptop,
  BatteryCharging,
  Eye,
  X,
  AlertCircle,
  Loader2,
  Search,
  Plus,
} from "lucide-react";
import { PickupWizardStep1 } from "@/components/client/PickupWizardStep1";
import { PickupWizardStep2, BoxItem } from "@/components/client/PickupWizardStep2";
import { PickupWizardStep3 } from "@/components/client/PickupWizardStep3";
import { PickupWizardStep4 } from "@/components/client/PickupWizardStep4";
import { Button } from "@/components/ui/Button";
import { API_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";

interface ClientPickup {
  id: string;
  pickupCode: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  boxCount: number;
  totalWeightKg: number;
  boxes?: BoxItem[];
  containElectronics?: boolean;
  electronicsDetails?: string;
  electronicsDeclaredValue?: number | "";
  containLithium?: boolean;
  notes?: string;
  recipientName: string;
  recipientPhone: string;
  recipientPhone2?: string;
  recipientAddress: string;
  recipientCity: string;
  pickupDate: string;
  timeSlot: string;
  status: string;
  createdAt?: string;
  vehicle?: {
    name: string;
  };
}

export default function SolicitarPickupPage() {
  const { user } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState<"solicitar" | "historial">("solicitar");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("PK-9821-DOM");
  const [loading, setLoading] = useState(false);

  // Client pickup history
  const [myPickups, setMyPickups] = useState<ClientPickup[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPickupModal, setSelectedPickupModal] = useState<ClientPickup | null>(null);

  // Form state - Real user editable values
  const [senderName, setSenderName] = useState(user?.name || "");
  const [senderPhone, setSenderPhone] = useState(user?.phone || "");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderCity, setSenderCity] = useState("");
  const [boxCount, setBoxCount] = useState(1);
  const [boxes, setBoxes] = useState<BoxItem[]>([
    {
      id: "box_1",
      size: "Mediano",
      contentDescription: "",
      declaredValue: "",
      containElectronics: false,
      electronicsDetails: "",
      electronicsDeclaredValue: "",
    },
  ]);
  const [totalWeightKg, setTotalWeightKg] = useState(1.5);
  const [containElectronics, setContainElectronics] = useState(false);
  const [electronicsDetails, setElectronicsDetails] = useState("");
  const [electronicsDeclaredValue, setElectronicsDeclaredValue] = useState<number | "">("");
  const [containLithium, setContainLithium] = useState(false);
  const [notes, setNotes] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientPhone2, setRecipientPhone2] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientCity, setRecipientCity] = useState("");
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState("mañana");

  // Fetch client pickups
  const fetchMyPickups = useCallback(() => {
    setHistoryLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    fetch(`${API_URL}/pickups`, { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => {
        let list: ClientPickup[] = [];
        if (data && Array.isArray(data.pickups)) {
          list = data.pickups;
        } else if (Array.isArray(data)) {
          list = data;
        }

        // Combinar con solicitudes locales
        if (typeof window !== "undefined") {
          try {
            const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
            if (Array.isArray(localSaved) && localSaved.length > 0) {
              for (const loc of localSaved) {
                if (!list.some((p) => p.id === loc.id || p.pickupCode === loc.pickupCode)) {
                  list.unshift(loc);
                }
              }
            }
          } catch {}
        }

        setMyPickups(list);
      })
      .catch(() => {
        // Fallback local
        if (typeof window !== "undefined") {
          try {
            const localSaved = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
            setMyPickups(Array.isArray(localSaved) ? localSaved : []);
          } catch {}
        }
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  useEffect(() => {
    fetchMyPickups();
  }, [fetchMyPickups]);

  // Actualizar datos del usuario si cambia auth y no hay datos escritos
  useEffect(() => {
    if (user?.name && !senderName) setSenderName(user.name);
    if (user?.phone && !senderPhone) setSenderPhone(user.phone);
  }, [user]);

  const steps = [
    { num: 1, label: "REMITENTE" },
    { num: 2, label: "PAQUETES" },
    { num: 3, label: "DESTINATARIO" },
    { num: 4, label: "HORARIO & CONFIRMACIÓN" },
  ];

  const handleFinalSubmit = async () => {
    // Validaciones de cajas individuales
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (!b.contentDescription.trim()) {
        alert(`Por favor describe el contenido de la Caja #${i + 1} (Paso 2).`);
        setCurrentStep(2);
        return;
      }
      if (b.declaredValue === "" || Number(b.declaredValue) <= 0) {
        alert(`Por favor indica el monto declarado de la Caja #${i + 1} (Paso 2).`);
        setCurrentStep(2);
        return;
      }
      if (b.containElectronics) {
        if (!b.electronicsDetails || !b.electronicsDetails.trim()) {
          alert(`Por favor indica la marca, modelo y cantidad de los equipos electrónicos en la Caja #${i + 1} (Paso 2).`);
          setCurrentStep(2);
          return;
        }
        if (b.electronicsDeclaredValue === "" || Number(b.electronicsDeclaredValue) <= 0) {
          alert(`Por favor indica el monto declarado de los equipos electrónicos en la Caja #${i + 1} (Paso 2).`);
          setCurrentStep(2);
          return;
        }
      }
    }

    // Validaciones de destinatario
    if (
      !recipientName.trim() ||
      !recipientAddress.trim() ||
      !recipientPhone.trim() ||
      !recipientPhone2.trim()
    ) {
      alert("Por favor completa los 2 teléfonos, nombre y dirección del destinatario (Paso 3).");
      setCurrentStep(3);
      return;
    }

    setLoading(true);
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    let code = `PK-${Math.floor(1000 + Math.random() * 9000)}-DOM`;

    const combinedRecipientPhone = recipientPhone2.trim()
      ? `${recipientPhone.trim()} / ${recipientPhone2.trim()}`
      : recipientPhone.trim();

    const payload = {
      senderName: senderName.trim(),
      senderPhone: senderPhone.trim(),
      senderAddress: senderAddress.trim(),
      senderCity: senderCity.trim() || "Broken Arrow, OK",
      boxCount: Number(boxCount) || boxes.length || 1,
      boxes: boxes,
      totalWeightKg: Number(totalWeightKg) || 1.5,
      containElectronics: Boolean(containElectronics),
      electronicsDetails: containElectronics ? electronicsDetails.trim() : "",
      electronicsDeclaredValue: containElectronics ? electronicsDeclaredValue : "",
      containLithium: Boolean(containLithium),
      notes: notes.trim(),
      recipientName: recipientName.trim(),
      recipientPhone: combinedRecipientPhone,
      recipientPhone2: recipientPhone2.trim(),
      recipientAddress: recipientAddress.trim(),
      recipientCity: recipientCity.trim() || "Caracas, Venezuela",
      pickupDate: pickupDate || new Date().toISOString().split("T")[0],
      timeSlot: timeSlot || "mañana",
    };

    try {
      if (token) {
        const res = await fetch(`${API_URL}/pickups`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.pickup) {
          code = data.pickup.pickupCode;
        }
      }
    } catch {
      // Fallback local
    }

    setGeneratedCode(code);

    // Guardar copia local reactiva
    const newLocalItem: ClientPickup = {
      id: `pk_${Date.now()}`,
      pickupCode: code,
      ...payload,
      status: "PENDIENTE",
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        const existing = JSON.parse(localStorage.getItem("beebox_local_pickups") || "[]");
        localStorage.setItem("beebox_local_pickups", JSON.stringify([newLocalItem, ...existing]));
      } catch {}
    }

    setMyPickups((prev) => [newLocalItem, ...prev]);
    setLoading(false);
    setIsSubmitted(true);
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setActiveMainTab("solicitar");
  };

  // Filtrado de solicitudes en historial
  const filteredPickups = myPickups.filter((p) => {
    const sTerm = searchTerm.toLowerCase();
    const matches =
      p.pickupCode.toLowerCase().includes(sTerm) ||
      p.recipientName.toLowerCase().includes(sTerm) ||
      p.senderAddress.toLowerCase().includes(sTerm) ||
      p.recipientCity.toLowerCase().includes(sTerm);

    const isPending = p.status === "PENDIENTE" || p.status === "pendiente";
    const isConfirmed = p.status === "CONFIRMADO" || p.status === "EN RUTA";
    const isCollected = p.status === "RECOLECTADO";

    if (statusFilter === "PENDIENTES") return matches && isPending;
    if (statusFilter === "CONFIRMADOS") return matches && isConfirmed;
    if (statusFilter === "RECOLECTADOS") return matches && isCollected;
    return matches;
  });

  const pendingCount = myPickups.filter((p) => p.status === "PENDIENTE" || p.status === "pendiente").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Bar with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Servicio de Pickup a Domicilio</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            RECOLECCIÓN EN TU DIRECCIÓN • REVISIÓN OPERATIVA Y ENVÍO INTERNACIONAL
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveMainTab("solicitar")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
              activeMainTab === "solicitar"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Solicitud
          </button>

          <button
            onClick={() => {
              setActiveMainTab("historial");
              fetchMyPickups();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${
              activeMainTab === "historial"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Mis Solicitudes ({myPickups.length})
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: HISTORIAL DE SOLICITUDES DEL CLIENTE */}
      {activeMainTab === "historial" ? (
        <div className="space-y-6 animate-in fade-in">
          {/* Subheader & Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto">
              {[
                { id: "TODOS", label: `TODAS (${myPickups.length})` },
                { id: "PENDIENTES", label: `POR CONFIRMAR (${pendingCount})` },
                { id: "CONFIRMADOS", label: "EN PROCESO" },
                { id: "RECOLECTADOS", label: "RECOLECTADOS" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
                    statusFilter === f.id
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código, destinatario..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          {historyLoading ? (
            <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2 bg-white rounded-3xl border border-slate-200">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span className="text-xs font-bold">Cargando tus solicitudes de pickup...</span>
            </div>
          ) : filteredPickups.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Truck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No tienes solicitudes de pickup en este filtro</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Cuando solicitas una recolección a domicilio, se registra en estado pendiente hasta que el equipo operativo asigna la unidad móvil y genera el envío.
              </p>
              <Button
                onClick={() => setActiveMainTab("solicitar")}
                variant="amber"
                className="rounded-2xl px-6 py-2.5 font-black text-xs uppercase"
              >
                <Plus className="w-4 h-4 mr-1" /> Solicitar Nuevo Pickup
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPickups.map((p) => {
                const isPending = p.status === "PENDIENTE" || p.status === "pendiente";
                const isConfirmed = p.status === "CONFIRMADO" || p.status === "EN RUTA";
                const isCollected = p.status === "RECOLECTADO";

                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {p.pickupCode}
                        </span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            isPending
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : isConfirmed
                              ? "bg-blue-100 text-blue-900 border border-blue-300"
                              : isCollected
                              ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          ● {isPending ? "POR CONFIRMAR" : p.status}
                        </span>
                      </div>

                      {/* Schedule info */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-700 font-bold">
                          <span className="flex items-center gap-1.5 text-slate-900">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            {p.pickupDate}
                          </span>
                          <span className="flex items-center gap-1 uppercase text-amber-800 text-[10px] font-extrabold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            {p.timeSlot}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200/60">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{p.senderAddress}</span>
                        </div>
                      </div>

                      {/* Recipient & Cargo summary */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">DESTINATARIO:</span>
                          <span className="font-bold text-slate-800">{p.recipientName}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">DESTINO:</span>
                          <span className="text-slate-600 font-medium">{p.recipientCity}</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">BULTOS:</span>
                          <span className="font-bold text-slate-800">{p.boxCount} {p.boxCount === 1 ? "Caja" : "Cajas"}</span>
                        </div>
                      </div>

                      {/* Badges for electronics / lithium */}
                      {(p.containElectronics || p.containLithium) && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {p.containElectronics && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-extrabold text-[9px] border border-blue-200">
                              <Laptop className="w-3 h-3 text-blue-600" /> ELECTRÓNICOS
                            </span>
                          )}
                          {p.containLithium && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-extrabold text-[9px] border border-amber-300">
                              <BatteryCharging className="w-3 h-3 text-amber-600" /> BATERÍA LITIO (IATA)
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPickupModal(p)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver Detalle
                      </button>

                      {isConfirmed && (
                        <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                          Envío Generado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: STEPPER DE NUEVA SOLICITUD */
        <div className="space-y-8 animate-in fade-in">
          {!isSubmitted ? (
            <>
              {/* Stepper Header Bar */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-4xl mx-auto">
                <div className="flex items-center justify-between relative before:absolute before:left-8 before:right-8 before:top-4 before:h-0.5 before:bg-slate-200 before:z-0">
                  {steps.map((s) => {
                    const isCompleted = s.num < currentStep;
                    const isCurrent = s.num === currentStep;

                    return (
                      <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all ${
                            isCompleted
                              ? "bg-amber-500 text-slate-950 shadow-md ring-4 ring-amber-500/20 cursor-pointer"
                              : isCurrent
                              ? "bg-slate-900 text-white shadow-md ring-4 ring-slate-900/20"
                              : "bg-white border-2 border-slate-200 text-slate-400"
                          }`}
                        >
                          {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                        </button>
                        <span
                          className={`text-[10px] font-extrabold tracking-wider uppercase ${
                            isCurrent ? "text-amber-600 font-bold" : isCompleted ? "text-slate-800" : "text-slate-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step Content with real bidirectional state wiring */}
              {currentStep === 1 && (
                <PickupWizardStep1
                  onNext={() => setCurrentStep(2)}
                  senderName={senderName}
                  senderPhone={senderPhone}
                  senderAddress={senderAddress}
                  senderCity={senderCity}
                  onUpdateData={(data) => {
                    setSenderName(data.senderName);
                    setSenderPhone(data.senderPhone);
                    setSenderAddress(data.senderAddress);
                    setSenderCity(data.senderCity);
                  }}
                />
              )}

              {currentStep === 2 && (
                <PickupWizardStep2
                  onNext={() => setCurrentStep(3)}
                  onBack={() => setCurrentStep(1)}
                  initialBoxCount={boxCount}
                  initialBoxes={boxes}
                  initialContainElectronics={containElectronics}
                  initialElectronicsDetails={electronicsDetails}
                  initialElectronicsDeclaredValue={electronicsDeclaredValue}
                  initialContainLithium={containLithium}
                  initialNotes={notes}
                  onUpdateData={(data) => {
                    setBoxCount(data.boxCount);
                    setBoxes(data.boxes);
                    setContainElectronics(data.containElectronics);
                    setElectronicsDetails(data.electronicsDetails);
                    setElectronicsDeclaredValue(data.electronicsDeclaredValue);
                    setContainLithium(data.containLithium);
                    setNotes(data.notes);
                  }}
                />
              )}

              {currentStep === 3 && (
                <PickupWizardStep3
                  onNext={() => setCurrentStep(4)}
                  onBack={() => setCurrentStep(2)}
                  recipientName={recipientName}
                  recipientPhone={recipientPhone}
                  recipientPhone2={recipientPhone2}
                  recipientAddress={recipientAddress}
                  recipientCity={recipientCity}
                  onUpdateData={(data) => {
                    setRecipientName(data.recipientName);
                    setRecipientPhone(data.recipientPhone);
                    setRecipientPhone2(data.recipientPhone2);
                    setRecipientAddress(data.recipientAddress);
                    setRecipientCity(data.recipientCity);
                  }}
                />
              )}

              {currentStep === 4 && (
                <PickupWizardStep4
                  onNext={handleFinalSubmit}
                  onBack={() => setCurrentStep(3)}
                  pickupDate={pickupDate}
                  timeSlot={timeSlot}
                  onUpdateData={(data) => {
                    setPickupDate(data.pickupDate);
                    setTimeSlot(data.timeSlot);
                  }}
                />
              )}

              {/* Bottom Actions Bar */}
              <div className="max-w-4xl mx-auto flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1 || loading}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>

                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (currentStep === 1 && (!senderName.trim() || !senderAddress.trim())) {
                        alert("Por favor completa el nombre de remitente y la dirección de recogida.");
                        return;
                      }
                      if (currentStep === 2) {
                        for (let i = 0; i < boxes.length; i++) {
                          const b = boxes[i];
                          if (!b.contentDescription.trim()) {
                            alert(`Por favor describe el contenido de la Caja #${i + 1}.`);
                            return;
                          }
                          if (b.declaredValue === "" || Number(b.declaredValue) <= 0) {
                            alert(`Por favor ingresa un monto declarado válido para la Caja #${i + 1}.`);
                            return;
                          }
                        }
                        if (containElectronics) {
                          if (!electronicsDetails.trim()) {
                            alert("Por favor indica la marca, modelo y cantidad de los equipos electrónicos.");
                            return;
                          }
                          if (electronicsDeclaredValue === "" || Number(electronicsDeclaredValue) <= 0) {
                            alert("Por favor indica el monto declarado de los equipos electrónicos.");
                            return;
                          }
                        }
                      }
                      if (currentStep === 3 && (!recipientName.trim() || !recipientAddress.trim() || !recipientPhone.trim() || !recipientPhone2.trim())) {
                        alert("Por favor completa el nombre, ambos teléfonos y la dirección del destinatario.");
                        return;
                      }
                      setCurrentStep(currentStep + 1);
                    }}
                    variant="amber"
                    className="rounded-2xl px-6 py-3 font-bold"
                  >
                    SIGUIENTE <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    variant="amber"
                    className="rounded-2xl px-8 py-3 font-bold shadow-lg shadow-amber-500/20"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Registrando Solicitud...
                      </span>
                    ) : (
                      "CONFIRMAR Y SOLICITAR RECOLECCIÓN"
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Success confirmation screen */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl max-w-2xl mx-auto text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  SOLICITUD REGISTRADA EXITOSAMENTE
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-3">¡Tu Solicitud de Pickup está en Marcha!</h2>
                <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
                  Tu solicitud ha sido enviada al equipo operativo. Un chofer de flota será asignado para la fecha programada.
                </p>
              </div>

              {/* Card with summary */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">CÓDIGO DE PICKUP:</span>
                  <span className="font-mono text-xs font-black text-slate-900">{generatedCode}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">FECHA PROGRAMADA:</span>
                    <span className="font-bold text-slate-800">{pickupDate} ({timeSlot})</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">ESTADO:</span>
                    <span className="font-bold text-amber-700">● PENDIENTE DE REVISIÓN</span>
                  </div>
                </div>

                <div className="pt-1 text-xs space-y-1">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">DESTINATARIO:</span>
                    <span className="font-bold text-slate-800">{recipientName} ({recipientCity})</span>
                    <span className="text-[11px] text-slate-500 block">
                      Tel: {recipientPhone} {recipientPhone2 ? `• ${recipientPhone2}` : ""}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      BULTOS REGISTRADOS ({boxes.length}):
                    </span>
                    <div className="space-y-1 mt-1">
                      {boxes.map((b, idx) => (
                        <div key={b.id || idx} className="text-[11px] text-slate-700 flex justify-between bg-white px-2 py-1 rounded border border-slate-200">
                          <span><strong>Caja #{idx + 1}</strong> ({b.size}): {b.contentDescription || "General"}</span>
                          <span className="font-mono font-bold text-amber-800">${b.declaredValue || 0} USD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {containElectronics && (
                    <div className="p-2 rounded bg-blue-50 border border-blue-200 text-blue-900 text-[11px] mt-1">
                      <strong>Equipos:</strong> {electronicsDetails} (Declarado: ${electronicsDeclaredValue || 0} USD)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  onClick={() => {
                    setActiveMainTab("historial");
                    setIsSubmitted(false);
                    setCurrentStep(1);
                    fetchMyPickups();
                  }}
                  variant="amber"
                  className="w-full sm:w-auto rounded-2xl px-6 py-3 font-bold"
                >
                  <Truck className="w-4 h-4 mr-2" /> Ver Mis Solicitudes de Pickup
                </Button>

                <Button
                  onClick={handleResetForm}
                  variant="outline"
                  className="w-full sm:w-auto rounded-2xl px-6 py-3 font-bold text-slate-700"
                >
                  Solicitar Otro Pickup
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL DETALLES DE SOLICITUD DE PICKUP */}
      {selectedPickupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Detalle de Solicitud de Pickup</h3>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    {selectedPickupModal.pickupCode}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPickupModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* Status banner */}
              <div className={`p-3 rounded-xl border font-bold flex items-center gap-2 ${
                selectedPickupModal.status === "PENDIENTE" || selectedPickupModal.status === "pendiente"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : selectedPickupModal.status === "CONFIRMADO"
                  ? "bg-blue-50 border-blue-200 text-blue-900"
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}>
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  {selectedPickupModal.status === "PENDIENTE" || selectedPickupModal.status === "pendiente"
                    ? "En espera de confirmación por el personal operativo para asignar chofer y ruta."
                    : selectedPickupModal.status === "CONFIRMADO"
                    ? "Pickup confirmado. Unidad de flota en proceso de recolección hacia tu domicilio."
                    : "Paquete recolectado con éxito e ingresado en el almacén de despacho."}
                </span>
              </div>

              {/* Data Grid */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-[10px] font-black uppercase text-slate-500 block border-b pb-1">
                  PUNTO DE RECOGIDA
                </span>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">REMITENTE:</span>
                  <span className="font-bold text-slate-900">{selectedPickupModal.senderName} ({selectedPickupModal.senderPhone})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">DIRECCIÓN:</span>
                  <span className="font-medium text-slate-700">{selectedPickupModal.senderAddress}, {selectedPickupModal.senderCity}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="text-slate-500">Fecha: <strong>{selectedPickupModal.pickupDate}</strong></span>
                  <span className="text-amber-800 uppercase font-bold">Franja: <strong>{selectedPickupModal.timeSlot}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="text-[10px] font-black uppercase text-slate-500 block border-b pb-1">
                  DESTINO FINAL
                </span>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">DESTINATARIO:</span>
                  <span className="font-bold text-slate-900">{selectedPickupModal.recipientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">TELÉFONOS DE CONTACTO:</span>
                  <span className="font-medium text-slate-800 font-mono">
                    {selectedPickupModal.recipientPhone}
                    {selectedPickupModal.recipientPhone2 && !selectedPickupModal.recipientPhone.includes(selectedPickupModal.recipientPhone2)
                      ? ` / ${selectedPickupModal.recipientPhone2}`
                      : ""}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">DIRECCIÓN DE ENTREGA:</span>
                  <span className="font-medium text-slate-700">{selectedPickupModal.recipientAddress} ({selectedPickupModal.recipientCity})</span>
                </div>
              </div>

              {/* Detalle Individual de Cajas / Bultos */}
              {selectedPickupModal.boxes && selectedPickupModal.boxes.length > 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-slate-500 block border-b pb-1 flex items-center justify-between">
                    <span>DETALLE POR CAJA ({selectedPickupModal.boxes.length} BULTOS)</span>
                    <span className="font-mono text-amber-800 font-bold">
                      Total: ${selectedPickupModal.boxes.reduce((acc, b) => acc + (typeof b.declaredValue === "number" ? b.declaredValue : 0), 0)} USD
                    </span>
                  </span>
                  <div className="space-y-2">
                    {selectedPickupModal.boxes.map((b, idx) => (
                      <div key={b.id || idx} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-slate-900 font-black">
                          <span className="flex items-center gap-1.5">
                            Caja #{idx + 1} ({b.size || "Mediano"})
                            {b.containElectronics && (
                              <span className="text-[9px] font-extrabold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full border border-blue-200 inline-flex items-center gap-1">
                                <Laptop className="w-2.5 h-2.5 text-blue-600" /> Con Electrónicos
                              </span>
                            )}
                          </span>
                          <span className="text-amber-800 font-mono text-xs">${b.declaredValue || 0} USD</span>
                        </div>
                        <p className="text-slate-600 text-[11px] font-medium leading-tight">
                          {b.contentDescription || "Sin descripción"}
                        </p>
                        {b.containElectronics && (
                          <div className="mt-1 p-2 rounded-lg bg-blue-50/80 border border-blue-200 text-blue-950 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="font-semibold flex items-center gap-1">
                              <Laptop className="w-3 h-3 text-blue-600 shrink-0" />
                              {b.electronicsDetails || "Equipos electrónicos"}
                            </span>
                            {b.electronicsDeclaredValue && (
                              <span className="font-mono font-bold text-blue-800 shrink-0">
                                Valor Eq.: ${b.electronicsDeclaredValue} USD
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-800">
                  <span>Carga: {selectedPickupModal.boxCount} Bultos ({selectedPickupModal.totalWeightKg} kg est.)</span>
                </div>
              )}

              {/* Equipos Electrónicos */}
              {selectedPickupModal.containElectronics && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[11px] text-blue-900">
                    <Laptop className="w-3.5 h-3.5 text-blue-600" />
                    <span>Equipos Electrónicos Declarados</span>
                  </div>
                  <p className="text-xs font-semibold">
                    {selectedPickupModal.electronicsDetails || "Equipos electrónicos"}
                  </p>
                  {selectedPickupModal.electronicsDeclaredValue && (
                    <span className="text-[10px] font-mono font-bold text-blue-800 block">
                      Valor Declarado: ${selectedPickupModal.electronicsDeclaredValue} USD
                    </span>
                  )}
                </div>
              )}

              {/* Batería Litio */}
              {selectedPickupModal.containLithium && (
                <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-[11px] font-bold flex items-center gap-2">
                  <BatteryCharging className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Contiene Baterías de Litio (Norma IATA UN3481/UN3480)</span>
                </div>
              )}

              {/* Observaciones chofer */}
              {selectedPickupModal.notes && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Instrucciones para el Chofer:
                  </span>
                  <p className="text-slate-700 italic">{selectedPickupModal.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right sticky bottom-0 z-10 bg-slate-50">
              <Button
                onClick={() => setSelectedPickupModal(null)}
                variant="outline"
                className="rounded-xl px-5 py-2 text-xs font-bold cursor-pointer"
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
