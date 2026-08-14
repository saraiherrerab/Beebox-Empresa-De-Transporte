"use client";

import React, { useState } from "react";
import { Search, UserCheck, Mail, Phone, Package, Eye } from "lucide-react";

export default function AdminClientesPage() {
  const [search, setSearch] = useState("");

  const clients = [
    {
      id: "usr_1",
      name: "Juan Pérez",
      email: "juan.perez@beebox.com",
      phone: "+52 55 9876 5432",
      suiteCode: "CAS-88293-MIAMI",
      totalPackages: 12,
      activePrealerts: 2,
    },
    {
      id: "usr_2",
      name: "María González",
      email: "maria.g@empresa.com",
      phone: "+56 9 8765 4321",
      suiteCode: "CAS-74120-MIAMI",
      totalPackages: 28,
      activePrealerts: 5,
    },
    {
      id: "usr_3",
      name: "Carlos Rodríguez",
      email: "carlos.r@logistica.cl",
      phone: "+56 9 1122 3344",
      suiteCode: "CAS-90145-MIAMI",
      totalPackages: 8,
      activePrealerts: 0,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Directorio de Clientes y Casilleros</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Lista de usuarios registrados, códigos de casillero virtual asignados e historial de paquetes asociados.
        </p>
      </div>

      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cliente por nombre, email o código de casillero (CAS-XXXXX)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Cliente</th>
                <th className="py-4 px-6">Código de Casillero</th>
                <th className="py-4 px-6">Contacto</th>
                <th className="py-4 px-6">Paquetes</th>
                <th className="py-4 px-6">Prealertas</th>
                <th className="py-4 px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-black flex items-center justify-center border border-amber-500/30">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <span className="block">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{c.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-amber-400">{c.suiteCode}</td>
                  <td className="py-4 px-6 text-slate-400">{c.phone}</td>
                  <td className="py-4 px-6 font-mono font-bold text-white">{c.totalPackages} ítems</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {c.activePrealerts} activas
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors">
                      Ver Ficha
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
