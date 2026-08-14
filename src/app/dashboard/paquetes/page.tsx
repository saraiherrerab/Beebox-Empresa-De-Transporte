"use client";

import React, { useState } from "react";
import { Search, Filter, Download, ArrowUpDown, ChevronLeft, ChevronRight, Eye, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PackageItem {
  id: string;
  tracking: string;
  description: string;
  origin: string;
  destination: string;
  route: string;
  weightKg: string;
  cubicFeet: string;
  status: "prealertado" | "recibido_almacen" | "en_transito" | "en_aduana" | "listo_entrega" | "entregado";
  statusLabel: string;
  date: string;
}

export default function MisPaquetesPage() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const packages: PackageItem[] = [
    {
      id: "pkg_1",
      tracking: "LT-449201-US",
      description: "Lote Laptops Asus Rog Strix & Accesorios",
      origin: "Miami Hub (USA)",
      destination: "Santiago Centro (CL)",
      route: "MIA -> SCL (Aéreo Directo)",
      weightKg: "12.50 KG",
      cubicFeet: "1.85 CBF",
      status: "en_aduana",
      statusLabel: "En Aduana",
      date: "12 Aug 2026",
    },
    {
      id: "pkg_2",
      tracking: "LT-449190-US",
      description: "Repuestos Industriales & Rodamientos",
      origin: "Miami Hub (USA)",
      destination: "Valparaíso Puerto (CL)",
      route: "MIA -> VAP (Marítimo FCL)",
      weightKg: "45.00 KG",
      cubicFeet: "5.20 CBF",
      status: "en_transito",
      statusLabel: "En Tránsito",
      date: "10 Aug 2026",
    },
    {
      id: "pkg_3",
      tracking: "LT-398200-ES",
      description: "Muestras de Calzado & Cuero Premium",
      origin: "Madrid Hub (ES)",
      destination: "Santiago CDMX (MX)",
      route: "MAD -> MEX (Aéreo)",
      weightKg: "4.20 KG",
      cubicFeet: "0.60 CBF",
      status: "prealertado",
      statusLabel: "Prealertado",
      date: "08 Aug 2026",
    },
    {
      id: "pkg_4",
      tracking: "LT-387410-CN",
      description: "Componentes Electrónicos SMD",
      origin: "Shenzhen Hub (CN)",
      destination: "Guadalajara Hub (MX)",
      route: "SZX -> GDL (Aéreo)",
      weightKg: "8.10 KG",
      cubicFeet: "1.10 CBF",
      status: "recibido_almacen",
      statusLabel: "Recibido en Almacén",
      date: "05 Aug 2026",
    },
    {
      id: "pkg_5",
      tracking: "LT-350119-US",
      description: "Cámara Fotográfica & Trípode Fibra Carbono",
      origin: "Miami Hub (USA)",
      destination: "Santiago Centro (CL)",
      route: "MIA -> SCL (Aéreo)",
      weightKg: "3.50 KG",
      cubicFeet: "0.45 CBF",
      status: "listo_entrega",
      statusLabel: "Listo para Entrega",
      date: "01 Aug 2026",
    },
    {
      id: "pkg_6",
      tracking: "LT-310992-US",
      description: "Ropa Deportiva & Calzado Urbano",
      origin: "Miami Hub (USA)",
      destination: "Concepción Hub (CL)",
      route: "MIA -> CCP (Aéreo)",
      weightKg: "6.80 KG",
      cubicFeet: "0.90 CBF",
      status: "entregado",
      statusLabel: "Entregado",
      date: "28 Jul 2026",
    },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const matchesTab =
      activeTab === "todos"
        ? true
        : activeTab === "transito"
        ? pkg.status === "en_transito"
        : activeTab === "aduana"
        ? pkg.status === "en_aduana"
        : pkg.status === "entregado";

    const matchesSearch =
      pkg.tracking.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.origin.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Paquetes Recibidos</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Historial de envíos asociados a tu casillero internacional.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-xl border-slate-200 text-xs font-bold">
            <Download className="w-4 h-4 mr-1.5" /> EXPORTAR LISTADO
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: "todos", label: "TODOS 12" },
          { id: "transito", label: "EN TRÁNSITO 2" },
          { id: "aduana", label: "EN ADUANA 1" },
          { id: "entregados", label: "ENTREGADOS 9" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all shrink-0 ${
              activeTab === tab.id
                ? "border-amber-500 text-slate-950 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por código de guía, descripción u origen..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Packages Table - Strict Use of "Estatus" Column Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-4">Número de Guía</th>
                <th className="py-4 px-4">Descripción</th>
                <th className="py-4 px-4">Origen</th>
                <th className="py-4 px-4">Destino</th>
                <th className="py-4 px-4">Ruta</th>
                <th className="py-4 px-4">Peso</th>
                <th className="py-4 px-4">Pies Cúbicos</th>
                <th className="py-4 px-4">Estatus</th>
                <th className="py-4 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-amber-600">{pkg.tracking}</td>
                  <td className="py-4 px-4 font-bold text-slate-900 max-w-xs truncate">{pkg.description}</td>
                  <td className="py-4 px-4 text-slate-600">{pkg.origin}</td>
                  <td className="py-4 px-4 text-slate-600">{pkg.destination}</td>
                  <td className="py-4 px-4 text-slate-500 text-[11px] font-mono">{pkg.route}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-800">{pkg.weightKg}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-800">{pkg.cubicFeet}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        pkg.status === "prealertado"
                          ? "bg-slate-100 text-slate-700"
                          : pkg.status === "recibido_almacen"
                          ? "bg-amber-100 text-amber-800"
                          : pkg.status === "en_transito"
                          ? "bg-amber-100 text-amber-700"
                          : pkg.status === "en_aduana"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {pkg.statusLabel}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
                      <Eye className="w-4 h-4" />
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
