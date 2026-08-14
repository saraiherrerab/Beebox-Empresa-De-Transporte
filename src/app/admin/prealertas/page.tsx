"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BellRing, CheckCircle2, ScanLine, Link as LinkIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPrealertasPage() {
  const { prealertas } = useAuth();
  const [scannedTracking, setScannedTracking] = useState("");
  const [linkedNotice, setLinkedNotice] = useState<string | null>(null);

  const handleLinkPrealerta = (id: string, tracking: string) => {
    setLinkedNotice(`Prealerta ${tracking} vinculada exitosamente con la guía de almacén MIA-${Math.floor(100000 + Math.random() * 900000)}.`);
    setTimeout(() => setLinkedNotice(null), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Gestión y Vinculación de Prealertas</h1>
        <p className="text-xs font-semibold text-slate-400 mt-1">
          Vincula las compras prealertadas por los clientes con las guías físicas mediante escáner o vinculación manual al ingresar al almacén de Miami.
        </p>
      </div>

      {linkedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          {linkedNotice}
        </div>
      )}

      {/* Simulator Barcode Scanner Box */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-amber-400" /> Escáner de Código de Barras de Almacén (Simulador)
        </h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={scannedTracking}
            onChange={(e) => setScannedTracking(e.target.value)}
            placeholder="Escanear o ingresar número de rastreo (ej. TBA987654321098)..."
            className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 p-4 text-xs font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-400"
          />
          <Button
            onClick={() => scannedTracking && handleLinkPrealerta("1", scannedTracking)}
            variant="amber"
            className="rounded-2xl px-6 py-4 font-bold text-xs"
          >
            VINCULAR CON ALMACÉN
          </Button>
        </div>
      </div>

      {/* Pre-alerts Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl space-y-4 p-6">
        <h3 className="text-base font-bold text-white">Prealertas Pendientes por Procesar</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">Casillero Cliente</th>
                <th className="py-3 px-4">Tienda</th>
                <th className="py-3 px-4">Número de Rastreo</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Valor USD</th>
                <th className="py-3 px-4">Estatus</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
              {prealertas.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4 font-mono font-bold text-white">CAS-88293-MIAMI</td>
                  <td className="py-4 px-4 font-bold text-slate-200">{item.store}</td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">{item.trackingNumber}</td>
                  <td className="py-4 px-4 text-slate-300 max-w-xs truncate">{item.description}</td>
                  <td className="py-4 px-4 font-mono font-bold text-white">${item.amountPaid}</td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => handleLinkPrealerta(item.id, item.trackingNumber)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md"
                    >
                      <LinkIcon className="w-3.5 h-3.5" /> Vincular Guía
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
