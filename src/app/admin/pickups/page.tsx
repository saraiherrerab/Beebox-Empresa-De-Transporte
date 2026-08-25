"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, CheckCircle2, Calendar, Check, Loader2, Truck } from "lucide-react";

interface ApiPickup {
  id: string;
  pickupCode: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  boxCount: number;
  totalWeightKg: number;
  pickupDate: string;
  timeSlot: string;
  status: string;
  user?: {
    name: string;
    suiteCode: string;
  };
  vehicle?: {
    id: string;
    name: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminPickupsPage() {
  const [search, setSearch] = useState("");
  const [pickups, setPickups] = useState<ApiPickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState<ApiPickup | null>(null);
  const [validatedNotice, setValidatedNotice] = useState<string | null>(null);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/pickups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            setPickups(data);
            if (data.length > 0) setSelectedPickup(data[0]);
          } else if (data && data.pickups && Array.isArray(data.pickups)) {
            setPickups(data.pickups);
            if (data.pickups.length > 0) setSelectedPickup(data.pickups[0]);
          } else {
            setPickups([]);
          }
        })
        .catch(() => {
          setPickups([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (status: string) => {
    if (!selectedPickup) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    if (token) {
      try {
        const res = await fetch(`${API_URL}/pickups/${selectedPickup.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
        if (res.ok) {
          setPickups((prev) =>
            prev.map((p) => (p.id === selectedPickup.id ? { ...p, status } : p))
          );
          setSelectedPickup({ ...selectedPickup, status });
          setValidatedNotice(`Solicitud ${selectedPickup.pickupCode} actualizada a ${status}.`);
          setTimeout(() => setValidatedNotice(null), 4000);
        }
      } catch {
        // Error handling
      }
    }
  };

  const filteredPickups = pickups.filter(
    (p) =>
      p.pickupCode.toLowerCase().includes(search.toLowerCase()) ||
      p.senderName.toLowerCase().includes(search.toLowerCase()) ||
      (p.user?.suiteCode || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Pickups</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            VALIDACIÓN DE PAGOS Y LOGÍSTICA DE RECOLECCIÓN
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por referencia, cliente o casillero..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-900 shadow-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            • {pickups.filter((p) => p.status === "PENDIENTE").length} PENDIENTES
          </span>
        </div>
      </div>

      {validatedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {validatedNotice}
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
          <h3 className="text-base font-bold text-slate-800">No hay solicitudes de recolección en este momento</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Las solicitudes de pickup programadas por los clientes a través del portal aparecerán reflejadas aquí en tiempo real.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Request Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {filteredPickups.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPickup(p)}
                className={`p-5 rounded-3xl bg-white border-2 shadow-md space-y-3 cursor-pointer transition-all ${
                  selectedPickup?.id === p.id ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs">
                      {p.senderName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">{p.senderName}</h4>
                      <span className="text-[10px] font-mono font-bold text-amber-600">
                        {p.user?.suiteCode || "CAS-TULSA"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 font-mono">{p.pickupCode}</span>
                    <span className="text-[9px] font-mono text-slate-400 block uppercase">{p.boxCount} CAJAS</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold">
                  <span className="text-slate-400">Fecha: <strong className="text-slate-800">{p.pickupDate}</strong></span>
                  <span
                    className={`px-2 py-0.5 rounded-full uppercase ${
                      p.status === "PENDIENTE" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    ● {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Request Detail Panel (7 Cols) */}
          {selectedPickup && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-slate-900">Detalle de Solicitud de Pickup</h3>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase">{selectedPickup.pickupCode}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      HORARIO Y FRANJA
                    </span>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-500" /> {selectedPickup.pickupDate} ({selectedPickup.timeSlot})
                    </div>

                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block pt-2">
                      DIRECCIÓN DE RECOLECCIÓN
                    </span>
                    <p className="text-xs text-slate-700 font-medium">{selectedPickup.senderAddress}</p>
                    <span className="text-[10px] text-slate-400">{selectedPickup.senderCity}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      DETALLES DE LA CARGA
                    </span>
                    <span className="text-xs font-bold text-slate-900 block">
                      {selectedPickup.boxCount} Cajas ({selectedPickup.totalWeightKg} kg est.)
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Teléfono remitente: {selectedPickup.senderPhone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <button
                  onClick={() => handleUpdateStatus("CANCELADO")}
                  className="flex-1 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  CANCELAR PICKUP
                </button>

                <button
                  onClick={() => handleUpdateStatus("RECOLECTADO")}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  MARCAR RECOLECTADO <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
