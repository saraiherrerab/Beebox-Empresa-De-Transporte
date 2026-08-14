"use client";

import React, { useState } from "react";
import { Calculator, Mail, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminCalculadoraPage() {
  const [clientEmail, setClientEmail] = useState("");
  const [sentNotice, setSentNotice] = useState(false);

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 4000);
    setClientEmail("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculadora Administrativa & Cotizador por Email</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Herramienta interna para cotizar modalidades Aérea y Marítima, guardar presupuestos corporativos y enviarlos directamente por correo al cliente.
        </p>
      </div>

      {sentNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Cotización enviada exitosamente al correo electrónico especificado.
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm max-w-2xl">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-600" /> Generar Presupuesto Personalizado
        </h3>

        <form onSubmit={handleSendQuote} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Correo Electrónico del Cliente
            </label>
            <input
              type="email"
              required
              placeholder="cliente@ejemplo.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Peso Total (KG)
              </label>
              <input
                type="number"
                defaultValue="15.0"
                className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Modalidad
              </label>
              <select className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold text-slate-900">
                <option>Aéreo Express (Miami &rarr; Santiago)</option>
                <option>Marítimo FCL (Miami &rarr; Valparaíso)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Cotización Calculada:</span>
            <span className="text-2xl font-black font-mono text-amber-700">$185.50 USD</span>
          </div>

          <Button type="submit" variant="amber" className="w-full py-4 justify-center font-bold text-xs uppercase">
            <Send className="w-4 h-4 mr-2" /> ENVIAR PRESUPUESTO AL CLIENTE POR EMAIL
          </Button>
        </form>
      </div>
    </div>
  );
}
