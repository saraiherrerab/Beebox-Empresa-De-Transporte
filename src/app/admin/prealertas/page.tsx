"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Link as LinkIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPrealertasPage() {
  const { prealertas, linkPrealerta } = useAuth();
  const [searchTracking, setSearchTracking] = useState("");
  const [warehouseGuideInput, setWarehouseGuideInput] = useState<{ [key: string]: string }>({});
  const [linkedNotice, setLinkedNotice] = useState<string | null>(null);

  const handleLinkPrealerta = async (id: string, trackingNumber: string) => {
    const guide = warehouseGuideInput[id] || `MIA-${Math.floor(100000 + Math.random() * 900000)}`;
    await linkPrealerta(id, guide);
    setLinkedNotice(`Prealerta ${trackingNumber} vinculada manualmente con la Guía de Almacén ${guide}.`);
    setTimeout(() => setLinkedNotice(null), 5000);
  };

  const filteredPrealertas = prealertas.filter(
    (item) =>
      item.trackingNumber.toLowerCase().includes(searchTracking.toLowerCase()) ||
      item.store.toLowerCase().includes(searchTracking.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTracking.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión y Vinculación Manual de Prealertas</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Registro y vinculación manual de prealertas ingresadas por los clientes con el número de guía asignado en la recepción de almacén.
        </p>
      </div>

      {linkedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {linkedNotice}
        </div>
      )}

      {/* Manual Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTracking}
            onChange={(e) => setSearchTracking(e.target.value)}
            placeholder="Buscar prealerta por número de rastreo, tienda o descripción..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Manual Pre-alerts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm space-y-4 p-6 sm:p-8">
        <h3 className="text-base font-bold text-slate-900">Prealertas Pendientes por Vinculación Manual</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Tienda</th>
                <th className="py-3 px-4">Tracking Origen</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Valor USD</th>
                <th className="py-3 px-4">Nº Guía Almacén</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
              {filteredPrealertas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        item.status === "Vinculado" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">{item.store}</td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-700">{item.trackingNumber}</td>
                  <td className="py-4 px-4 text-slate-600 max-w-xs truncate">{item.description}</td>
                  <td className="py-4 px-4 font-mono font-bold text-slate-900">${item.amountPaid}</td>
                  <td className="py-4 px-4">
                    {item.warehouseGuide ? (
                      <span className="font-mono font-bold text-emerald-700">{item.warehouseGuide}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Ej. MIA-440192"
                        value={warehouseGuideInput[item.id] || ""}
                        onChange={(e) =>
                          setWarehouseGuideInput({ ...warehouseGuideInput, [item.id]: e.target.value })
                        }
                        className="w-32 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                      />
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Button
                      onClick={() => handleLinkPrealerta(item.id, item.trackingNumber)}
                      disabled={item.status === "Vinculado"}
                      variant={item.status === "Vinculado" ? "outline" : "amber"}
                      size="sm"
                      className="rounded-xl px-3.5 py-1.5 font-bold text-xs"
                    >
                      <LinkIcon className="w-3.5 h-3.5 mr-1" />
                      {item.status === "Vinculado" ? "Vinculado" : "Vincular Manualmente"}
                    </Button>
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
