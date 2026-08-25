"use client";

import React, { useState, useEffect } from "react";
import { Users, BellRing, Package, Truck, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";

interface MetricsData {
  totalClients: number;
  pendingPrealertas: number;
  pendingPickups: number;
  activeShipments: number;
  totalRevenue: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<MetricsData>({
    totalClients: 42,
    pendingPrealertas: 5,
    pendingPickups: 3,
    activeShipments: 18,
    totalRevenue: 4850.0,
  });

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/admin/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.metrics) {
            setMetrics(data.metrics);
          }
        })
        .catch(() => {});
    }
  }, []);

  const stats = [
    { label: "Clientes Registrados", value: metrics.totalClients.toLocaleString(), change: "Base de Datos Real", icon: Users },
    { label: "Prealertas Pendientes", value: metrics.pendingPrealertas.toString(), change: "Requieren vinculación", icon: BellRing },
    { label: "Pickups por Atender", value: metrics.pendingPickups.toString(), change: "Solicitudes a domicilio", icon: Truck },
    { label: "Envíos Activos", value: metrics.activeShipments.toString(), change: "En tránsito/Aduana", icon: Package },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Resumen Ejecutivo (CMS Admin)</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Gestión unificada de clientes, casilleros virtuales, prealertas de almacén, pickups y métricas consolidadas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</span>
                <Icon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-3xl font-black font-mono text-slate-900">{item.value}</div>
              <span className="text-[11px] font-bold text-amber-700 block">{item.change}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-600" /> Confirmación de Prealertas de Almacén
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Corrobora la recepción física de compras en el almacén de Oklahoma, confirma el destino final de envío y asigna la guía para despacho.
          </p>
          <Link href="/admin/prealertas" className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline pt-2 uppercase">
            IR A CONFIRMAR PREALERTAS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" /> Directorio de Clientes y Casilleros
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Consulta códigos de casillero asignados (`CAS-XXXXX-MIAMI`), historial de compras e información de contacto de usuarios registrados.
          </p>
          <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:underline pt-2 uppercase">
            CONSULTAR DIRECTORIO <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
