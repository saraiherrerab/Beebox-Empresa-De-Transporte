"use client";

import React from "react";
import { RateCalculator } from "@/components/home/RateCalculator";

export default function CalculadoraDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculadora de Tarifas</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Estima el costo de tu envío o flete según el tipo de servicio y dimensiones.
        </p>
      </div>

      <RateCalculator />
    </div>
  );
}
