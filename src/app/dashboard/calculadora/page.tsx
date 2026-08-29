"use client";

import React, { useState, useEffect } from "react";
import { Plane, Ship, Calculator, Info, Bookmark, Sparkles, Globe, MapPin, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiCity {
  id: string;
  name: string;
}

interface ApiCountry {
  id: string;
  name: string;
  flagEmoji?: string;
  cities: ApiCity[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function CalculadoraDashboardPage() {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [serviceType, setServiceType] = useState<"Aéreo Express" | "Aéreo Estándar" | "Marítimo">("Aéreo Express");

  const [weight, setWeight] = useState("5.0");
  const [declaredValue, setDeclaredValue] = useState("100.0");
  const [length, setLength] = useState("30");
  const [width, setWidth] = useState("20");
  const [height, setHeight] = useState("20");

  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/destinations/countries`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountries(data);
          if (data.length > 0) {
            setSelectedCountryId(data[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const activeCountry = countries.find((c) => c.id === selectedCountryId);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/quotes/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destCountryId: selectedCountryId || undefined,
          destCityId: selectedCityId || undefined,
          serviceType,
          weightKg: parseFloat(weight) || 1,
          lengthCm: parseFloat(length) || 0,
          widthCm: parseFloat(width) || 0,
          heightCm: parseFloat(height) || 0,
          declaredValue: parseFloat(declaredValue) || 0,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCalculationResult(data);
      }
    } catch (err) {
      console.error("Error calculando cotización:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Calculadora de Envíos Dinámica</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Estima el costo exacto de tu envío seleccionando el país y ciudad de destino, tipo de transporte y dimensiones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Form Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Country and City Cascade Selection */}
            <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-500" /> Selecciona Destino del Envío
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">País de Destino</label>
                  <select
                    value={selectedCountryId}
                    onChange={(e) => {
                      setSelectedCountryId(e.target.value);
                      setSelectedCityId("");
                    }}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                    required
                  >
                    <option value="">-- Seleccionar País --</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ciudad / Agencia</label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    disabled={!selectedCountryId || !activeCountry?.cities?.length}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  >
                    <option value="">Todas las ciudades de {activeCountry?.name || "este país"}</option>
                    {activeCountry?.cities?.map((city) => (
                      <option key={city.id} value={city.id}>
                        📍 {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Transport Type Toggle */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tipo de Transporte
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setServiceType("Aéreo Express")}
                  className={`py-3.5 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    serviceType === "Aéreo Express"
                      ? "border-amber-500 bg-amber-50/50 text-amber-900 shadow-md ring-2 ring-amber-500/20 font-black"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Plane className="w-4 h-4 text-amber-500" /> Aéreo Express
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType("Aéreo Estándar")}
                  className={`py-3.5 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    serviceType === "Aéreo Estándar"
                      ? "border-amber-500 bg-amber-50/50 text-amber-900 shadow-md ring-2 ring-amber-500/20 font-black"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Plane className="w-4 h-4 text-slate-500" /> Aéreo Estándar
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType("Marítimo")}
                  className={`py-3.5 px-3 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    serviceType === "Marítimo"
                      ? "border-amber-500 bg-amber-50/50 text-amber-900 shadow-md ring-2 ring-amber-500/20 font-black"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <Ship className="w-4 h-4 text-blue-500" /> Marítimo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Peso */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Peso Real (KG)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono font-bold text-slate-900 focus:border-amber-500 focus:outline-none"
                    required
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
                    required
                  />
                </div>
              </div>
            </div>

            {/* Dimensiones (CM) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dimensiones de la Caja (CM)
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

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                El sistema aplicará automáticamente la tarifa sobre el mayor entre el <strong>Peso Real</strong> y el <strong>Peso Volumétrico</strong> según la norma internacional.
              </span>
            </div>

            <Button
              type="submit"
              variant="amber"
              disabled={loading}
              className="w-full py-4 justify-center text-sm font-bold shadow-lg shadow-amber-500/20 uppercase"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Calculator className="w-4 h-4 mr-2" />
              )}
              CALCULAR TARIFA DE ENVÍO
            </Button>
          </form>
        </div>

        {/* Right Col: Calculation Summary Card */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl space-y-6 border border-slate-800">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <div className="w-1.5 h-5 rounded-full bg-amber-500" />
              <h3 className="text-base font-extrabold tracking-tight">Resumen del Cálculo</h3>
            </div>

            {calculationResult ? (
              <div className="space-y-4 text-xs font-medium text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-bold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Destino Aplicado:
                  </span>
                  <span className="text-amber-400 font-bold">
                    {countries.find((c) => c.id === selectedCountryId)?.name || "Global"}
                    {selectedCityId ? ` ➔ ${activeCountry?.cities?.find((ct: any) => ct.id === selectedCityId)?.name}` : ""}
                  </span>
                </div>

                {calculationResult.isVolumetric && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    Se aplica Peso Volumétrico ({calculationResult.volumetricWeightKg} kg)
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">PESO COBRABLE</span>
                  <span className="font-mono font-bold text-white">{calculationResult.chargeableWeight} KG</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">TARIFA BASE</span>
                  <span className="font-mono font-bold text-white">${calculationResult.basePrice?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">FLETE PESO/VOL.</span>
                  <span className="font-mono font-bold text-white">${calculationResult.freightCost?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-wider text-[11px] font-bold text-slate-400">SEGURO</span>
                  <span className="font-mono font-bold text-white">${calculationResult.insuranceCost?.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-slate-400">
                  <span className="uppercase tracking-wider text-[10px] font-bold">TIEMPO TRÁNSITO</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(calculationResult.deliveryHoursMin / 24)}-{Math.round(calculationResult.deliveryHoursMax / 24)} días hábiles
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                    TOTAL ESTIMADO
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-black text-white font-mono">${calculationResult.totalUSD?.toFixed(2)}</span>
                    <span className="text-[10px] font-mono text-slate-400">USD</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs font-bold space-y-2">
                <Calculator className="w-8 h-8 mx-auto text-slate-700" />
                <p>Ingresa los detalles de tu carga y presiona "Calcular Tarifa" para obtener el presupuesto desglosado.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
