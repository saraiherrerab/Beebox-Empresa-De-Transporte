"use client";

import React from "react";
import { Users, BellRing, Package, Truck, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const stats = [
    { label: "Clientes Registrados", value: "1,248", change: "+12% este mes", icon: Users },
    { label: "Prealertas Pendientes", value: "34", change: "Requieren vinculación", icon: BellRing },
    { label: "Paquetes en Almacén MIA", value: "182", change: "En tránsito/Aduana", icon: Package },
    { label: "Pickups Programados", value: "15", change: "Hoy en ruta", icon: Truck },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Panel de Administración Beebox</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Gestión unificada de clientes, casilleros virtuales, prealertas de almacén, rutas y contenidos CMS.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{item.label}</span>
                <Icon className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-3xl font-black font-mono text-white">{item.value}</div>
              <span className="text-[11px] font-bold text-amber-400 block">{item.change}</span>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-400" /> Gestión de Prealertas de Almacén
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Vincula de forma manual o escaneada las prealertas registradas por los usuarios con los trackings recibidos físicamente en la sede de Miami.
          </p>
          <Link href="/admin/prealertas" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 pt-2">
            IR A VINCULAR PREALERTAS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" /> Directorio de Clientes y Casilleros
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consulta códigos de casillero asignados (`CAS-XXXXX-MIAMI`), historial de compras e información de contacto de usuarios registrados.
          </p>
          <Link href="/admin/clientes" className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 pt-2">
            CONSULTAR DIRECTORIO <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
