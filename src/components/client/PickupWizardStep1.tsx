"use client";

import React, { useState } from "react";
import { Home, Building2, Plus, Info, MessageSquareCode } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const PickupWizardStep1: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { user } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState("addr-1");
  const [driverNotes, setDriverNotes] = useState("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Left 2 Cols: Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Selecciona la Dirección de Recogida</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address Card 1 */}
            <div
              onClick={() => setSelectedAddressId("addr-1")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedAddressId === "addr-1"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-amber-500" /> CASA (PREDETERMINADA)
                </span>
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === "addr-1"}
                  onChange={() => setSelectedAddressId("addr-1")}
                  className="text-amber-500 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-slate-500">Av. Insurgentes Sur 1234, CDMX, 03210</p>
            </div>

            {/* Address Card 2 */}
            <div
              onClick={() => setSelectedAddressId("addr-2")}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedAddressId === "addr-2"
                  ? "border-amber-500 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-500" /> OFICINA NORTE
                </span>
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === "addr-2"}
                  onChange={() => setSelectedAddressId("addr-2")}
                  className="text-amber-500 focus:ring-amber-500"
                />
              </div>
              <p className="text-xs text-slate-500">Reforma 500, Piso 12, CDMX, 06600</p>
            </div>
          </div>

          {/* Dotted button */}
          <button className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl text-xs font-bold text-slate-600 hover:text-amber-600 flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> Usar una dirección nueva
          </button>

          {/* Driver Notes Textarea */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Notas para el Conductor
            </label>
            <textarea
              rows={3}
              value={driverNotes}
              onChange={(e) => setDriverNotes(e.target.value)}
              placeholder="Ej: Portón café, llamar al llegar..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
        </div>
      </div>

      {/* Right Col: Helper Guide & Support */}
      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase">
            <Info className="w-4 h-4 text-amber-500" /> Guía de Envío
          </div>
          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <h4 className="font-bold text-slate-800">Embalaje Seguro</h4>
              <p className="text-[11px] text-slate-500">Usa cajas de doble corrugado para mercancía pesada o frágil.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Documentación</h4>
              <p className="text-[11px] text-slate-500">Recuerda subir tu factura para agilizar el proceso de aduana.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Prohibidos</h4>
              <p className="text-[11px] text-slate-500">No enviamos inflamables, baterías sueltas ni perecederos sin frío.</p>
            </div>
          </div>
        </div>

        {/* 24/7 Dark Help Card (Image 4) */}
        <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-xl space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">AYUDA 24/7</span>
          <h4 className="text-sm font-bold leading-snug">¿Tienes dudas sobre las dimensiones o el tipo de carga?</h4>
          <button className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors uppercase">
            CHATEA CON NOSOTROS
          </button>
        </div>
      </div>
    </div>
  );
};
