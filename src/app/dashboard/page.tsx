"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Check, FileUp, Package, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WarehouseCard } from "@/components/client/WarehouseCard";
import { Button } from "@/components/ui/Button";

interface ApiShipment {
  trackingCode: string;
  senderName: string;
  senderCity: string;
  recipientName: string;
  recipientCity: string;
  serviceType: string;
  weightKg: number;
  currentStatus: string;
  createdAt: string;
  events?: Array<{
    id: string;
    status: string;
    title: string;
    description: string;
    timestamp: string;
  }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function DashboardOverviewPage() {
  const { user, prealertas } = useAuth();
  const [shipments, setShipments] = useState<ApiShipment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/shipments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data)) {
            setShipments(data);
          } else if (data && data.shipments) {
            setShipments(data.shipments);
          }
        })
        .catch(() => {
          // Si está offline o falla la red, estado limpio
          setShipments([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const totalActivePackages = shipments.length + prealertas.length;
  const activeShipment = shipments[0] || null;

  const getStepIndex = (statusStr: string) => {
    const s = (statusStr || "").toLowerCase();
    if (s.includes("destino") || s.includes("entregado")) return 2;
    if (s.includes("camino") || s.includes("transito") || s.includes("reparto")) return 1;
    return 0; // Default: En el origen
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Bienvenido, {user?.name ? user.name.split(" ")[0] : "Cliente"}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            {totalActivePackages > 0 ? (
              <>
                Tienes <span className="text-amber-600 font-bold">{totalActivePackages} paquete(s)</span> registrados / en camino a tu destino.
              </>
            ) : (
              <span>No tienes paquetes en camino a tu destino.</span>
            )}
          </p>
        </div>

        {user?.active !== false ? (
          <Link href="/dashboard/prealertas?nueva=true">
            <Button variant="amber" className="rounded-2xl px-6 py-3 text-xs font-bold shadow-md">
              + Pre-alertar Paquete
            </Button>
          </Link>
        ) : (
          <span className="px-4 py-2.5 rounded-2xl bg-rose-100 text-rose-800 text-xs font-bold uppercase border border-rose-200">
            ⚠️ Cuenta Inhabilitada
          </span>
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking en Tiempo Real Stepper Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {loading ? (
              <div className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                <span className="text-xs font-bold">Cargando tus paquetes en tiempo real...</span>
              </div>
            ) : activeShipment ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Tracking en Tiempo Real</h3>
                    <span className="text-xs font-mono font-bold text-slate-400">Guía: {activeShipment.trackingCode}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                    {activeShipment.currentStatus}
                  </span>
                </div>

                {/* 3 Stepper Progress (En el origen -> En camino -> Llegó a su destino) */}
                <div className="relative pt-4 pb-2">
                  <div className="flex items-center justify-between relative before:absolute before:left-8 before:right-8 before:top-3.5 before:h-0.5 before:bg-slate-200 before:z-0 px-4">
                    {[
                      { label: "EN EL ORIGEN", index: 0 },
                      { label: "EN CAMINO", index: 1 },
                      { label: "LLEGÓ A SU DESTINO", index: 2 },
                    ].map((step) => {
                      const activeIndex = getStepIndex(activeShipment.currentStatus);
                      const isDone = step.index <= activeIndex;
                      const isCurrent = step.index === activeIndex;

                      return (
                        <div key={step.label} className="relative z-10 flex flex-col items-center gap-1.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all ${
                              isCurrent
                                ? "bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-black shadow-md scale-110"
                                : isDone
                                ? "bg-emerald-500 text-slate-950 font-bold"
                                : "bg-slate-200 text-slate-400"
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.index + 1}
                          </div>
                          <span
                            className={`text-[10px] font-extrabold tracking-wider ${
                              isCurrent ? "text-amber-600 font-black" : isDone ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <FileUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Declaración Aduanal</h4>
                      <p className="text-[11px] text-slate-500">Comprobante de compra o factura adjunta para aduana</p>
                    </div>
                  </div>
                  <Link href="/dashboard/prealertas">
                    <Button size="sm" variant="secondary" className="rounded-xl px-5 text-xs font-bold shrink-0">
                      SUBIR FACTURA
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sin envíos activos en este momento</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Aún no tienes paquetes registrados o en tránsito. Notifica tus compras enviando una prealerta para darles seguimiento inmediato.
                </p>
                {user?.active !== false && (
                  <Link href="/dashboard/prealertas?nueva=true" className="inline-block pt-1">
                    <Button variant="amber" className="rounded-2xl px-5 py-2.5 text-xs font-bold shadow-sm">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Registrar Prealerta
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mis Paquetes Recientes */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Mis Paquetes Recientes</h3>
              <Link href="/dashboard/paquetes" className="text-xs font-bold text-amber-600 hover:underline">
                Ver Todo
              </Link>
            </div>

            {shipments.length === 0 && prealertas.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-600 mb-1">No tienes paquetes o prealertas registradas por el momento.</p>
                <p className="text-[11px] text-slate-400">Tus envíos y compras prealertadas aparecerán organizados en este panel.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">PAQUETE / GUÍA</th>
                      <th className="py-3 px-3">ORIGEN / TIENDA</th>
                      <th className="py-3 px-3">ESTADO</th>
                      <th className="py-3 px-3 text-right">DETALLE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {shipments.map((pkg) => (
                      <tr key={pkg.trackingCode} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-3">
                          <span className="font-bold text-slate-900 block">{pkg.senderName}</span>
                          <span className="text-[10px] font-mono text-amber-700 font-bold">{pkg.trackingCode}</span>
                        </td>
                        <td className="py-4 px-3 text-slate-600">{pkg.senderCity}</td>
                        <td className="py-4 px-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                            ● {pkg.currentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right font-mono text-slate-600">{pkg.weightKg} kg</td>
                      </tr>
                    ))}

                    {prealertas.map((pre) => (
                      <tr key={pre.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-3">
                          <span className="font-bold text-slate-900 block">{pre.store}</span>
                          <span className="text-[10px] font-mono text-slate-400">{pre.trackingNumber}</span>
                        </td>
                        <td className="py-4 px-3 text-slate-600">{pre.store}</td>
                        <td className="py-4 px-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              pre.status === "Vinculado" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            ● {pre.status}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right font-mono text-slate-900 font-bold">${pre.amountPaid} USD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Warehouse Card */}
        <div className="space-y-8">
          <WarehouseCard />
        </div>
      </div>
    </div>
  );
}
