"use client";

import React from "react";
import { Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AgendarRetiroPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agendar Retiro en Sucursal</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Reserva un horario prioritario en nuestra sucursal para entregar o retirar tus paquetes sin filas.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl space-y-6">
        <h3 className="text-lg font-bold text-slate-900">Selecciona Fecha y Hora de Cita</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Sucursal Beebox
            </label>
            <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-900">
              <option>Santiago Centro - Av. Providencia 1234</option>
              <option>Santiago Norte - Huechuraba CD</option>
              <option>Valparaíso - Puerto Principal</option>
              <option>Concepción - San Pedro de la Paz</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Fecha Preferida
            </label>
            <input
              type="date"
              defaultValue="2026-08-16"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs font-medium text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Horarios Disponibles
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {["09:00 AM", "10:30 AM", "11:45 AM", "02:15 PM", "04:00 PM", "05:30 PM"].map((slot, idx) => (
              <button
                key={slot}
                className={`py-3 rounded-xl text-xs font-bold transition-all border ${
                  idx === 1
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-md"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <Button variant="amber" className="rounded-2xl px-6 py-3 font-bold">
            CONFIRMAR CITA DE RETIRO
          </Button>
        </div>
      </div>
    </div>
  );
}
