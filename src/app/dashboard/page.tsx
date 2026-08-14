"use client";

import React from "react";
import Link from "next/link";
import { Truck, ArrowUpRight, Copy, Check, FileUp, PackageCheck, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { WarehouseCard } from "@/components/client/WarehouseCard";
import { Button } from "@/components/ui/Button";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const recentPackages = [
    {
      id: "pkg_1",
      name: "iPhone 15 Pro Max",
      tracking: "LT-449201-US",
      origin: "Miami, USA",
      status: "En Aduana",
      weight: "0.8 kg",
    },
    {
      id: "pkg_2",
      name: "Zapatillas Deportivas",
      tracking: "LT-110293-ES",
      origin: "Madrid, ES",
      status: "Entregado",
      weight: "1.2 kg",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Bienvenido, {user?.name.split(" ")[0] || "Juan"}
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Tienes <span className="text-amber-600 font-bold">3 paquetes</span> en camino a tu destino.
          </p>
        </div>

        <Link href="/dashboard/prealertas">
          <Button variant="amber" className="rounded-2xl px-6 py-3 text-xs font-bold shadow-md">
            + Pre-alertar Paquete
          </Button>
        </Link>
      </div>

      {/* Grid Layout (Matching Image 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking en Tiempo Real Stepper Card (Image 2) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tracking en Tiempo Real</h3>
                <span className="text-xs font-mono font-bold text-slate-400">Guía: LT-449201-US</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                EN ADUANA
              </span>
            </div>

            {/* Stepper Progress */}
            <div className="relative pt-4 pb-2">
              <div className="flex items-center justify-between relative before:absolute before:left-6 before:right-6 before:top-3.5 before:h-0.5 before:bg-slate-200 before:z-0">
                {[
                  { label: "RECIBIDO", date: "12 Oct", done: true },
                  { label: "EN TRÁNSITO", date: "14 Oct", done: true },
                  { label: "EN ADUANA", date: "16 Oct", done: true, active: true },
                  { label: "PARA RETIRO", date: "Est. 18 Oct", done: false },
                ].map((step, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-1.5">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                        step.active
                          ? "bg-amber-500 text-slate-950 ring-4 ring-amber-100 font-black shadow-md"
                          : step.done
                          ? "bg-amber-500 text-slate-950"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {step.done ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                    </div>
                    <span className="text-[10px] font-extrabold text-slate-800 tracking-wider">
                      {step.label}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subir Factura Action */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Declaración Aduanal</h4>
                  <p className="text-[11px] text-slate-500">Factura pendiente de subir para despacho aduanero</p>
                </div>
              </div>
              <Button size="sm" variant="secondary" className="rounded-xl px-5 text-xs font-bold shrink-0">
                SUBIR FACTURA
              </Button>
            </div>
          </div>

          {/* Mis Paquetes Recientes */}
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
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">PAQUETE / GUÍA</th>
                    <th className="py-3 px-3">ORIGEN</th>
                    <th className="py-3 px-3">ESTADO</th>
                    <th className="py-3 px-3">PESO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium">
                  {recentPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-3">
                        <span className="font-bold text-slate-900 block">{pkg.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{pkg.tracking}</span>
                      </td>
                      <td className="py-4 px-3 text-slate-600">{pkg.origin}</td>
                      <td className="py-4 px-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            pkg.status === "En Aduana"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          ● {pkg.status}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-mono text-slate-600">{pkg.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Warehouse Card & High-Contrast Yellow Pickup Banner (Image 2) */}
        <div className="space-y-8">
          <WarehouseCard />

          {/* Yellow Pickup Banner with High Contrast Dark Slate Text (#0F172A) */}
          <div className="rounded-3xl bg-amber-500 p-6 sm:p-8 text-slate-950 shadow-xl space-y-4 relative overflow-hidden border border-amber-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center border border-slate-950 shadow-md">
              <Truck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-950 tracking-tight">¿Necesitas recolección?</h3>
              <p className="text-xs font-bold text-slate-900 leading-relaxed">
                Programa un pickup en tu domicilio u oficina con nuestros choferes certificados.
              </p>
            </div>

            <Link href="/dashboard/pickup" className="block pt-2">
              <button className="w-full bg-slate-950 hover:bg-slate-900 text-amber-400 font-black py-3.5 px-6 rounded-2xl text-xs uppercase tracking-wider shadow-xl transition-all">
                SOLICITAR PICKUP
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
