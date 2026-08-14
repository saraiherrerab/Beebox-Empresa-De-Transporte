"use client";

import React, { useState } from "react";
import { Search, Filter, Users, UserPlus, Eye, MoreVertical } from "lucide-react";

export default function AdminClientesPage() {
  const [search, setSearch] = useState("");

  const clients = [
    {
      id: "usr_1",
      name: "Juan Pérez Rodríguez",
      registeredDate: "12 Oct 2024",
      suiteCode: "CAS-88293-MX",
      email: "juan.perez@email.com",
      phone: "+52 55 1234 5678",
      activityCount: "12 Paquetes",
      activityStatus: "ACTIVO",
      status: "VERIFICADO",
    },
    {
      id: "usr_2",
      name: "Sofía Méndez",
      registeredDate: "03 Sep 2024",
      suiteCode: "CAS-22481-MX",
      email: "sofia.m@email.com",
      phone: "+52 55 9876 5432",
      activityCount: "3 Paquetes",
      activityStatus: "INACTIVO",
      status: "PENDIENTE",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Clientes</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          BASE DE DATOS CENTRALIZADA
        </span>
      </div>

      {/* Top Metrics Cards (Matching Mockup 5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TOTAL DE CLIENTES</span>
            <div className="text-3xl font-black text-slate-900 font-mono">12,481</div>
            <span className="text-[10px] font-bold text-emerald-600">↗ +2.4% este mes</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">NUEVOS REGISTROS</span>
            <div className="text-3xl font-black text-amber-600 font-mono">+456</div>
            <span className="text-[10px] font-bold text-slate-400">ÚLTIMOS 30 DÍAS</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-200">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Lista Maestra Table Container (Matching Mockup 5) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-slate-900">Lista Maestra</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              MOSTRANDO REGISTROS VERIFICADOS
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre, email o casillero..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>
            <button className="px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 uppercase">
              <Filter className="w-3.5 h-3.5" /> FILTRAR
            </button>
          </div>
        </div>

        {/* Master Table (Matching Mockup 5) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">CLIENTE / REGISTRO</th>
                <th className="py-4 px-4">CASILLERO ID</th>
                <th className="py-4 px-4">CONTACTO</th>
                <th className="py-4 px-4">ACTIVIDAD</th>
                <th className="py-4 px-4">ESTADO</th>
                <th className="py-4 px-4 text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{c.name}</span>
                      <span className="text-[10px] text-slate-400">Registrado: {c.registeredDate}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-600">{c.suiteCode}</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 block">{c.email}</span>
                    <span className="text-[10px] text-slate-400">{c.phone}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900 block">{c.activityCount}</span>
                    <span
                      className={`text-[9px] font-extrabold uppercase ${
                        c.activityStatus === "ACTIVO" ? "text-emerald-600" : "text-slate-400"
                      }`}
                    >
                      {c.activityStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        c.status === "VERIFICADO" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <span>MOSTRANDO 1–10 DE 12,481 CLIENTES REGISTRADOS</span>
          <div className="flex items-center gap-2">
            <span className="text-[11px]">Página <strong>1</strong> de 1,248</span>
          </div>
        </div>
      </div>
    </div>
  );
}
