"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, Loader2 } from "lucide-react";

interface PackageItem {
  id: string;
  tracking: string;
  description: string;
  origin: string;
  destination: string;
  route: string;
  weight: string;
  cubicFeet: string;
  status: string;
  statusLabel: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function MisPaquetesPage() {
  const [activeTab, setActiveTab] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [packages, setPackages] = useState<PackageItem[]>([]);
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
          if (Array.isArray(data)) {
            const mapped: PackageItem[] = data.map((item: any) => ({
              id: item.trackingCode,
              tracking: item.trackingCode,
              description: item.prealerta?.description || `Envío de ${item.senderName}`,
              origin: item.senderCity || "Miami, FL",
              destination: item.recipientCity || "Ciudad de México",
              route: `${item.senderCity || "MIA"} → ${item.recipientCity || "CDMX"} (${item.serviceType || "Aéreo"})`,
              weight: `${item.weightKg} kg`,
              cubicFeet: item.dimensions || "N/A",
              status: item.currentStatus,
              statusLabel: (item.currentStatus || "en_transito").toUpperCase().replace("_", " "),
            }));
            setPackages(mapped);
          }
        })
        .catch(() => {
          setPackages([
            {
              id: "pkg_1",
              tracking: "MIA-449201",
              description: "iPhone 15 Pro Max 256GB - Titanium",
              origin: "Miami, USA",
              destination: "Ciudad de México, MX",
              route: "MIA → CDMX (Aéreo)",
              weight: "0.8 kg",
              cubicFeet: "0.05 FT³",
              status: "aduana",
              statusLabel: "En Aduana",
            },
            {
              id: "pkg_2",
              tracking: "MIA-110293",
              description: "Zapatillas Deportivas Edición Limitada",
              origin: "Miami, USA",
              destination: "Ciudad de México, MX",
              route: "MIA → CDMX (Marítimo)",
              weight: "1.2 kg",
              cubicFeet: "0.12 FT³",
              status: "entregado",
              statusLabel: "Entregado",
            },
          ]);
        })
        .finally(() => setLoading(false));
    } else {
      setPackages([
        {
          id: "pkg_1",
          tracking: "MIA-449201",
          description: "iPhone 15 Pro Max 256GB - Titanium",
          origin: "Miami, USA",
          destination: "Ciudad de México, MX",
          route: "MIA → CDMX (Aéreo)",
          weight: "0.8 kg",
          cubicFeet: "0.05 FT³",
          status: "aduana",
          statusLabel: "En Aduana",
        },
        {
          id: "pkg_2",
          tracking: "MIA-110293",
          description: "Zapatillas Deportivas Edición Limitada",
          origin: "Miami, USA",
          destination: "Ciudad de México, MX",
          route: "MIA → CDMX (Marítimo)",
          weight: "1.2 kg",
          cubicFeet: "0.12 FT³",
          status: "entregado",
          statusLabel: "Entregado",
        },
      ]);
      setLoading(false);
    }
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.tracking.toLowerCase().includes(search.toLowerCase()) ||
      pkg.description.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "todos") return matchesSearch;
    return matchesSearch && pkg.status.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mis Paquetes Recibidos</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Consulta detallada de envíos asociados a tu casillero virtual con número de guía, ruta, peso y estatus en tiempo real.
        </p>
      </div>

      {/* Main Table Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Filters Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-6 text-xs font-black uppercase tracking-wider text-slate-400 overflow-x-auto">
            {["todos", "recoleccion", "transito", "aduana", "entregado"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 border-b-2 transition-all shrink-0 ${
                  activeTab === tab ? "border-amber-500 text-amber-700 font-bold" : "border-transparent hover:text-slate-700"
                }`}
              >
                {tab === "todos" ? "TODOS LOS PAQUETES" : tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar guía o descripción..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Package Table */}
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
            <span className="text-xs font-bold">Cargando tus paquetes en tiempo real...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-4">NÚMERO DE GUÍA</th>
                  <th className="py-4 px-4">DESCRIPCIÓN</th>
                  <th className="py-4 px-4">ORIGEN / DESTINO</th>
                  <th className="py-4 px-4">RUTA</th>
                  <th className="py-4 px-4">PESO</th>
                  <th className="py-4 px-4">DIMENSIONES</th>
                  <th className="py-4 px-4">ESTATUS</th>
                  <th className="py-4 px-4 text-right">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium">
                {filteredPackages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-900">{pkg.tracking}</td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">{pkg.description}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-800 block">{pkg.origin}</span>
                      <span className="text-[10px] text-slate-400">&rarr; {pkg.destination}</span>
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-slate-500">{pkg.route}</td>
                    <td className="py-4 px-4 font-mono text-slate-700">{pkg.weight}</td>
                    <td className="py-4 px-4 font-mono text-slate-700">{pkg.cubicFeet}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          pkg.status === "aduana"
                            ? "bg-amber-100 text-amber-800"
                            : pkg.status === "entregado"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        ● {pkg.statusLabel}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
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
