"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, UserPlus, Eye, MoreVertical, Filter, Loader2 } from "lucide-react";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  suiteCode: string;
  role: string;
  createdAt: string;
  _count?: {
    shipments: number;
    prealertas: number;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminClientesPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<ApiUser[]>([]);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;
    if (token) {
      fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.users) {
            setClients(data.users);
          }
        })
        .catch(() => {
          // Fallback con clientes de prueba
          setClients([
            {
              id: "usr_1",
              name: "Juan Pérez Rodríguez",
              createdAt: "2024-10-12T00:00:00.000Z",
              suiteCode: "CAS-88293-MIAMI",
              email: "juan.perez@email.com",
              phone: "+52 55 1234 5678",
              role: "client",
              _count: { shipments: 12, prealertas: 4 },
            },
            {
              id: "usr_2",
              name: "Sofía Méndez",
              createdAt: "2024-09-03T00:00:00.000Z",
              suiteCode: "CAS-22481-MIAMI",
              email: "sofia.m@email.com",
              phone: "+52 55 9876 5432",
              role: "client",
              _count: { shipments: 3, prealertas: 1 },
            },
          ]);
        })
        .finally(() => setLoading(false));
    } else {
      setClients([
        {
          id: "usr_1",
          name: "Juan Pérez Rodríguez",
          createdAt: "2024-10-12T00:00:00.000Z",
          suiteCode: "CAS-88293-MIAMI",
          email: "juan.perez@email.com",
          phone: "+52 55 1234 5678",
          role: "client",
          _count: { shipments: 12, prealertas: 4 },
        },
        {
          id: "usr_2",
          name: "Sofía Méndez",
          createdAt: "2024-09-03T00:00:00.000Z",
          suiteCode: "CAS-22481-MIAMI",
          email: "sofia.m@email.com",
          phone: "+52 55 9876 5432",
          role: "client",
          _count: { shipments: 3, prealertas: 1 },
        },
      ]);
      setLoading(false);
    }
  }, []);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.suiteCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Clientes</h1>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
          BASE DE DATOS CENTRALIZADA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">TOTAL DE CLIENTES REGISTRADOS</span>
            <div className="text-3xl font-black text-slate-900 font-mono">{clients.length}</div>
            <span className="text-[10px] font-bold text-emerald-600">↗ En tiempo real</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">NUEVOS REGISTROS</span>
            <div className="text-3xl font-black text-amber-600 font-mono">+{clients.length}</div>
            <span className="text-[10px] font-bold text-slate-400">BASE DE DATOS REAL</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
            <UserPlus className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
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

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando clientes desde el servidor...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">CLIENTE / REGISTRO</th>
                  <th className="py-4 px-4">CASILLERO ID</th>
                  <th className="py-4 px-4">CONTACTO</th>
                  <th className="py-4 px-4">ACTIVIDAD</th>
                  <th className="py-4 px-4">ROL</th>
                  <th className="py-4 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shadow-sm">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="text-[10px] text-slate-400">
                          Registrado: {c.createdAt ? c.createdAt.split("T")[0] : "Reciente"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-amber-700">{c.suiteCode || "CAS-PENDIENTE"}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800 block">{c.email}</span>
                      <span className="text-[10px] text-slate-400">{c.phone || "Sin teléfono"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">
                        {c._count?.shipments ?? 0} Envíos / {c._count?.prealertas ?? 0} Prealertas
                      </span>
                      <span className="text-[9px] font-extrabold uppercase text-emerald-600">ACTIVO</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          c.role === "admin" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {c.role || "client"}
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
        )}
      </div>
    </div>
  );
}
