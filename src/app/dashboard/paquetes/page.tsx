"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";

export default function PackagesPage() {
  const [activeTab, setActiveTab] = useState("todos");
  const [search, setSearch] = useState("");

  const packagesList = [
    {
      id: "pkg-1",
      title: 'MacBook Pro 14"',
      code: "LT-552210-CN",
      origin: "Shenzhen, CN",
      status: "en_transito",
      statusText: "EN TRÁNSITO",
      lastUpdate: "Hace 4 horas",
    },
    {
      id: "pkg-2",
      title: "Zapatillas Nike Air",
      code: "LT-110293-ES",
      origin: "Madrid, ES",
      status: "entregado",
      statusText: "ENTREGADO",
      lastUpdate: "10 Oct 2026",
    },
    {
      id: "pkg-3",
      title: "iPhone 15 Pro Max",
      code: "LT-449201-US",
      origin: "Miami, USA",
      status: "en_aduana",
      statusText: "EN ADUANA",
      lastUpdate: "Hace 1 día",
    },
    {
      id: "pkg-4",
      title: "Cámara Sony Alpha",
      code: "LT-881204-US",
      origin: "Miami, USA",
      status: "entregado",
      statusText: "ENTREGADO",
      lastUpdate: "05 Oct 2026",
    },
  ];

  const filteredPackages = packagesList.filter((pkg) => {
    const matchesTab =
      activeTab === "todos"
        ? true
        : activeTab === "transito"
        ? pkg.status === "en_transito"
        : activeTab === "aduana"
        ? pkg.status === "en_aduana"
        : pkg.status === "entregado";

    const matchesSearch =
      pkg.title.toLowerCase().includes(search.toLowerCase()) ||
      pkg.code.toLowerCase().includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Paquetes</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Gestiona y rastrea todos tus envíos internacionales.
        </p>
      </div>

      {/* Filter Tabs (Matching Image 3) */}
      <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("todos")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
            activeTab === "todos"
              ? "text-amber-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          TODOS (12)
        </button>

        <button
          onClick={() => setActiveTab("transito")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
            activeTab === "transito"
              ? "text-amber-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          EN TRÁNSITO (2)
        </button>

        <button
          onClick={() => setActiveTab("aduana")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
            activeTab === "aduana"
              ? "text-amber-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          EN ADUANA (1)
        </button>

        <button
          onClick={() => setActiveTab("entregados")}
          className={`pb-3 text-xs font-extrabold uppercase tracking-wider transition-colors relative ${
            activeTab === "entregados"
              ? "text-amber-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-500"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          ENTREGADOS (9)
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900">Historial de Envíos</h3>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número de guía..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 pl-9 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-2">PAQUETE</th>
                <th className="py-3 px-2">ORIGEN</th>
                <th className="py-3 px-2">ESTADO</th>
                <th className="py-3 px-2">ÚLTIMA ACTU.</th>
                <th className="py-3 px-2 text-right">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id}>
                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-900">{pkg.title}</div>
                    <div className="text-[10px] font-mono text-slate-400">{pkg.code}</div>
                  </td>
                  <td className="py-4 px-2 text-slate-600">{pkg.origin}</td>
                  <td className="py-4 px-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        pkg.status === "en_transito"
                          ? "bg-amber-100 text-amber-700"
                          : pkg.status === "en_aduana"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {pkg.statusText}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-slate-500">{pkg.lastUpdate}</td>
                  <td className="py-4 px-2 text-right">
                    <Link href={`/rastreo?codigo=${pkg.code}`} className="font-bold text-amber-600 hover:underline">
                      Detalles
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>MOSTRANDO 1–10 DE 12 PAQUETES</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20">
              1
            </button>
            <button className="w-8 h-8 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold">
              2
            </button>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
