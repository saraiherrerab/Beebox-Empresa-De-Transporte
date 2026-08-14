"use client";

import React, { useState } from "react";
import { Plane, Ship, Calculator, Info, Bookmark, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function CalculadoraDashboardPage() {
  const [transportType, setTransportType] = useState<"aereo" | "maritimo">("aereo");
  const [weight, setWeight] = useState("");
  const [declaredValue, setDeclaredValue] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [baseFreight, setBaseFreight] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [handling, setHandling] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCalculated, setIsCalculated] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight) || 5;
    const v = parseFloat(declaredValue) || 100;
    const mult = transportType === "aereo" ? 9.5 : 4.2;

    const base = w * mult;
    const ins = v * 0.02;
    const tax = v * 0.06;
    const hand = 15;
    const tot = base + ins + tax + hand;

    setBaseFreight(base);
    setInsurance(ins);
    setTaxes(tax);
    setHandling(hand);
    setTotal(tot);
    setIsCalculated(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculadora de Envíos</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Estima el costo de tu envío ingresando los detalles de tu carga.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Form Card (Image 5) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Transport Type Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tipo de Transporte
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTransportType("aereo")}
                  className={`py-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    transportType === "aereo"
                      ? "border-amber-500 bg-amber-50/50 text-amber-700 shadow-md ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Plane className="w-4 h-4 text-amber-500" /> Aéreo
                </button>

                <button
                  type="button"
                  onClick={() => setTransportType("maritimo")}
                  className={`py-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    transportType === "maritimo"
                      ? "border-amber-500 bg-amber-50/50 text-amber-700 shadow-md ring-2 ring-amber-500/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Ship className="w-4 h-4 text-slate-500" /> Marítimo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Peso */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Peso (LB/KG)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    KG
                  </span>
                </div>
              </div>

              {/* Valor Declarado */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Valor Declarado (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    value={declaredValue}
                    onChange={(e) => setDeclaredValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 pl-8 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Dimensiones (CM) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dimensiones (CM)
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">LARGO</span>
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">ANCHO</span>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">ALTO</span>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-center text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Yellow info note */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Los resultados son estimaciones basadas en tarifas vigentes. El costo final puede variar tras la inspección física.
              </span>
            </div>

            <Button
              type="submit"
              variant="amber"
              className="w-full py-4 justify-center text-sm font-bold shadow-lg shadow-amber-500/20 uppercase"
            >
              <Calculator className="w-4 h-4 mr-2" /> CALCULAR TARIFA ESTIMADA
            </Button>
          </form>
        </div>

        {/* Right Col: Dark Calculation Summary Card & Did You Know Box (Image 5) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <div className="w-1.5 h-5 rounded-full bg-amber-500" />
              <h3 className="text-base font-extrabold tracking-tight">Resumen del Cálculo</h3>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-300">
              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">FLETE BASE</span>
                <span className="font-mono font-bold text-white">${baseFreight.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">SEGURO (OPCIONAL)</span>
                <span className="font-mono font-bold text-white">${insurance.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">IMPUESTOS EST.</span>
                <span className="font-mono font-bold text-white">${taxes.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">MANEJO Y ADUANA</span>
                <span className="font-mono font-bold text-white">${handling.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                TOTAL ESTIMADO
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white font-mono">${total.toFixed(2)}</span>
                <span className="text-[10px] font-mono text-slate-400">MONEDA USD</span>
              </div>
            </div>

            <Button variant="outline" className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3.5 justify-center shadow-md border-none text-xs uppercase">
              <Bookmark className="w-4 h-4 mr-2 text-slate-900" /> GUARDAR COTIZACIÓN
            </Button>
          </div>

          {/* Bottom Right Callout Box (Image 5) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-2">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> ¿SABÍAS QUE?
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Si consolidas varios paquetes en un solo envío, puedes ahorrar hasta un <span className="font-bold text-amber-600">35% en costos de flete</span> internacional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
