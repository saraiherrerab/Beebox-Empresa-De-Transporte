"use client";

import React from "react";
import Link from "next/link";
import { Bell, Plus, FileText, Eye, Truck, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WarehouseCard } from "@/components/client/WarehouseCard";
import { Button } from "@/components/ui/Button";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Bienvenido, {user?.name.split(" ")[0] || "Juan"}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Tienes <span className="text-amber-600 font-bold">3 paquetes</span> en camino a tu destino.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-amber-600 shadow-sm relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>
          <Link href="/dashboard/pickup">
            <Button variant="amber" className="rounded-2xl px-5 py-3 shadow-lg shadow-amber-500/20">
              <Plus className="w-4 h-4 mr-1 stroke-[3]" /> Pre-alertar Paquete
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Tracking & Recent Packages */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Real-Time Tracking Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tracking en Tiempo Real</h3>
                <span className="text-xs font-mono text-slate-400">Guía: LT-449201-US</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wide">
                EN ADUANA
              </span>
            </div>

            {/* Stepper Timeline (Image 2) */}
            <div className="py-4">
              <div className="relative flex items-center justify-between before:absolute before:left-4 before:right-4 before:top-3 before:h-1 before:bg-slate-200 before:z-0">
                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-900">RECIBIDO</span>
                  <span className="text-[9px] text-slate-400">12 Oct</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-900">EN TRÁNSITO</span>
                  <span className="text-[9px] text-slate-400">14 Oct</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-amber-500 ring-4 ring-amber-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-amber-600 font-bold">EN ADUANA</span>
                  <span className="text-[9px] text-slate-400">16 Oct</span>
                </div>

                <div className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-400" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">PARA RETIRO</span>
                  <span className="text-[9px] text-slate-400">Est. 18 Oct</span>
                </div>
              </div>
            </div>

            {/* Customs Declaration Upload sub-card */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Declaración Aduanal</h4>
                  <p className="text-[11px] text-slate-500">Factura pendiente de subir</p>
                </div>
              </div>
              <Button variant="amber" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2">
                SUBIR FACTURA
              </Button>
            </div>
          </div>

          {/* Recent Packages Table (Image 2) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Mis Paquetes Recientes</h3>
              <Link href="/dashboard/paquetes" className="text-xs font-bold text-amber-600 hover:underline">
                Ver Todo
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-2">PAQUETE / GUÍA</th>
                    <th className="py-3 px-2">ORIGEN</th>
                    <th className="py-3 px-2">ESTADO</th>
                    <th className="py-3 px-2">PESO</th>
                    <th className="py-3 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  <tr>
                    <td className="py-4 px-2">
                      <div className="font-bold text-slate-900">iPhone 15 Pro Max</div>
                      <div className="text-[10px] font-mono text-slate-400">LT-449201-US</div>
                    </td>
                    <td className="py-4 px-2 text-slate-600">Miami, USA</td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> En Aduana
                      </span>
                    </td>
                    <td className="py-4 px-2 text-slate-700 font-mono">0.8 kg</td>
                    <td className="py-4 px-2 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-2">
                      <div className="font-bold text-slate-900">Zapatillas Deportivas</div>
                      <div className="text-[10px] font-mono text-slate-400">LT-110293-ES</div>
                    </td>
                    <td className="py-4 px-2 text-slate-600">Madrid, ES</td>
                    <td className="py-4 px-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Entregado
                      </span>
                    </td>
                    <td className="py-4 px-2 text-slate-700 font-mono">1.2 kg</td>
                    <td className="py-4 px-2 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Warehouses & Pickup Promo Card */}
        <div className="space-y-6">
          <WarehouseCard />

          {/* Orange Pickup Card (Image 2) */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 via-amber-500 to-amber-600 p-8 text-white shadow-xl space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-2">
              <Truck className="w-6 h-6 stroke-[2.5]" />
            </div>

            <h3 className="text-xl font-extrabold tracking-tight">¿Necesitas recolección?</h3>
            <p className="text-xs text-white/90 leading-relaxed font-medium">
              Programa un pickup en tu domicilio u oficina con nuestros choferes certificados.
            </p>

            <div className="pt-2">
              <Link href="/dashboard/pickup">
                <Button variant="amber" className="w-full bg-white hover:bg-slate-100 text-amber-600 font-bold py-3 justify-center shadow-md">
                  SOLICITAR PICKUP
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
