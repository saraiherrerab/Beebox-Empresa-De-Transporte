"use client";

import React, { useState } from "react";
import { Search, Bell, CheckCircle2, XCircle, Calendar, MapPin, UserCheck, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminPickupsPage() {
  const [activeTab, setActiveTab] = useState<"validar" | "recolectar" | "ruta">("validar");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [validated, setValidated] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-slate-900 bg-slate-50 p-6 min-h-screen rounded-3xl">
      {/* Top Header Bar (Matching Mockup 1) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Pickups</h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            VALIDACIÓN DE PAGOS Y LOGÍSTICA
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por referencia, cliente o casillero..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-900 shadow-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider border border-amber-200">
            • 5 PENDIENTES
          </span>

          <button className="p-2.5 rounded-full bg-slate-900 text-white shadow-md">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar (Matching Mockup 1) */}
      <div className="flex items-center gap-6 border-b border-slate-200 pb-1 text-xs font-black uppercase tracking-wider text-slate-400">
        <button
          onClick={() => setActiveTab("validar")}
          className={`pb-2 border-b-2 transition-all ${
            activeTab === "validar" ? "border-amber-500 text-amber-600 font-bold" : "border-transparent hover:text-slate-700"
          }`}
        >
          POR VALIDAR PAGO
        </button>
        <button
          onClick={() => setActiveTab("recolectar")}
          className={`pb-2 border-b-2 transition-all ${
            activeTab === "recolectar" ? "border-amber-500 text-amber-600 font-bold" : "border-transparent hover:text-slate-700"
          }`}
        >
          POR RECOLECTAR
        </button>
        <button
          onClick={() => setActiveTab("ruta")}
          className={`pb-2 border-b-2 transition-all ${
            activeTab === "ruta" ? "border-amber-500 text-amber-600 font-bold" : "border-transparent hover:text-slate-700"
          }`}
        >
          EN RUTA
        </button>
      </div>

      {/* Main Content Grid (Matching Mockup 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Request Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border-2 border-amber-400 shadow-md space-y-3 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-800 font-black flex items-center justify-center text-xs">
                  JP
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">Juan Pérez Rodríguez</h4>
                  <span className="text-[10px] font-mono font-bold text-amber-600">CAS-88293-MX</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-black text-slate-900 font-mono">$50.00</span>
                <span className="text-[9px] font-mono text-slate-400 block uppercase">USD</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold">
              <span className="text-slate-400">Ref: <strong className="text-slate-800">PICKUP-9901</strong></span>
              <span className="text-amber-600 font-extrabold uppercase">● COMPROBANTE SUBIDO</span>
            </div>
          </div>
        </div>

        {/* Right Column: Request Detail Panel (7 Cols - Matching Mockup 1) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900">Detalle de Solicitud</h3>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">PICKUP-9901</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Comprobante de Pago Image Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                COMPROBANTE DE PAGO
              </span>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 p-2 text-center">
                <div className="bg-white p-4 rounded-xl space-y-2 border border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 block">Bank Transfer Receipt</span>
                  <span className="text-[9px] font-mono text-slate-400 block">$50.00 USD</span>
                </div>
              </div>
            </div>

            {/* Request Info Details */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  HORARIO SOLICITADO
                </span>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" /> 18 Oct 2026
                </div>

                <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block pt-2">
                  DIRECCIÓN
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  Av. Insurgentes Sur 1234, Ciudad de México.
                </p>
              </div>

              {/* Asignación de Chofer Dropdown */}
              <div className="space-y-1">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  ASIGNACIÓN DE CHOFER
                </label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full rounded-2xl border border-dashed border-slate-300 bg-white p-3 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Seleccionar Chofer Disponible...</option>
                  <option value="Roberto Gómez (Ruta Poniente)">Roberto Gómez (Ruta Poniente)</option>
                  <option value="Luis Miguel (Ruta Centro)">Luis Miguel (Ruta Centro)</option>
                  <option value="Carlos Mendoza (Ruta Norte)">Carlos Mendoza (Ruta Norte)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons (Matching Mockup 1: Pink Rechazar & Emerald Validar) */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
            <button className="flex-1 py-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs uppercase tracking-wider transition-colors">
              RECHAZAR PAGO
            </button>

            <button
              onClick={() => setValidated(true)}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              {validated ? "¡VALIDADO Y ASIGNADO! ✓" : "VALIDAR Y ASIGNAR"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
