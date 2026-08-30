"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calculator, ArrowRight, CheckCircle2, RefreshCw, Globe, MapPin, Loader2, Plane, Ship } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { API_URL } from "@/config/api";

interface ApiCity {
  id: string;
  name: string;
}

interface ApiCountry {
  id: string;
  name: string;
  cities: ApiCity[];
}

export const RateCalculator: React.FC = () => {
  const [countries, setCountries] = useState<ApiCountry[]>([]);
  const [origin, setOrigin] = useState("Broken Arrow, OK (EE.UU.)");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [destinationName, setDestinationName] = useState("Caracas, Venezuela");
  const [weight, setWeight] = useState(15);
  const [service, setService] = useState("Aéreo Express");
  const [declaredValue, setDeclaredValue] = useState(100);

  const [calculation, setCalculation] = useState<{
    totalUSD: number;
    basePrice: number;
    freightCost: number;
    insuranceCost: number;
    deliveryHoursMin: number;
    deliveryHoursMax: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/destinations/countries`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCountries(data);
          setSelectedCountryId(data[0].id);
          if (data[0].cities && data[0].cities.length > 0) {
            setDestinationName(`${data[0].cities[0].name}, ${data[0].name}`);
          } else {
            setDestinationName(data[0].name);
          }
        }
      })
      .catch(() => {});
  }, []);

  const calculatePrice = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/quotes/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCity: origin,
          destinationCity: destinationName,
          destCountryId: selectedCountryId || undefined,
          destCityId: selectedCityId || undefined,
          weightKg: weight,
          serviceType: service,
          declaredValue: declaredValue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.totalUSD !== undefined) {
        setCalculation({
          totalUSD: data.totalUSD,
          basePrice: data.basePrice || 15,
          freightCost: data.freightCost || weight * 8.5,
          insuranceCost: data.insuranceCost || 2.0,
          deliveryHoursMin: data.deliveryHoursMin || 24,
          deliveryHoursMax: data.deliveryHoursMax || 96,
        });
        return;
      }
    } catch {
      // Fallback local calculation based on SuperAdmin rates
    } finally {
      setLoading(false);
    }

    // Local fallback in USD
    const base = service === "Aéreo Express" ? 25 : service === "Marítimo" ? 10 : 15;
    const ratePerKg = service === "Aéreo Express" ? 8.5 : service === "Marítimo" ? 3.0 : 5.5;
    const freight = Number((weight * ratePerKg).toFixed(2));
    const insurance = Number((declaredValue * 0.02).toFixed(2));
    const total = Number((base + freight + insurance).toFixed(2));

    setCalculation({
      totalUSD: total,
      basePrice: base,
      freightCost: freight,
      insuranceCost: insurance,
      deliveryHoursMin: service === "Aéreo Express" ? 24 : service === "Marítimo" ? 120 : 72,
      deliveryHoursMax: service === "Aéreo Express" ? 96 : service === "Marítimo" ? 240 : 144,
    });
  }, [origin, destinationName, selectedCountryId, selectedCityId, weight, service, declaredValue]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const activeCountry = countries.find((c) => c.id === selectedCountryId);

  return (
    <section id="cotizador" className="py-20 relative bg-beebox-navy-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <Badge variant="amber">Cotizador en Línea</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calcula la Tarifa Estimada de tu Envío
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Obtén una estimación instantánea de costo y tiempo de entrega según la ruta y volumen de tu carga configurados por nuestro panel ejecutivo.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-beebox-amber-500/30 shadow-2xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Origin */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Origen (Almacén BeeBox)
                  </label>
                  <div className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950/90 px-4 py-3 text-sm text-amber-400 font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-beebox-amber-400 shrink-0" />
                      Broken Arrow, OK (EE.UU.)
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      HUB PRINCIPAL
                    </span>
                  </div>
                </div>

                {/* Destination Country/City */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    País de Destino
                  </label>
                  {countries.length > 0 ? (
                    <select
                      value={selectedCountryId}
                      onChange={(e) => {
                        const cid = e.target.value;
                        setSelectedCountryId(cid);
                        setSelectedCityId("");
                        const found = countries.find((c) => c.id === cid);
                        if (found) {
                          setDestinationName(found.name);
                        }
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      value={destinationName}
                      onChange={(e) => setDestinationName(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                    >
                      <option value="Caracas, Venezuela">Venezuela (Caracas, Maracaibo, Valencia)</option>
                      <option value="Bogotá, Colombia">Colombia (Bogotá, Medellín, Cali)</option>
                    </select>
                  )}
                </div>
              </div>

              {/* City Filter if available */}
              {activeCountry && activeCountry.cities && activeCountry.cities.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Ciudad de Destino
                  </label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => {
                      const cityId = e.target.value;
                      setSelectedCityId(cityId);
                      const city = activeCountry.cities.find((ct) => ct.id === cityId);
                      if (city) {
                        setDestinationName(`${city.name}, ${activeCountry.name}`);
                      } else {
                        setDestinationName(activeCountry.name);
                      }
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                  >
                    <option value="">Todas las ciudades ({activeCountry.name})</option>
                    {activeCountry.cities.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        📍 {ct.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Weight slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Peso Total (kg)
                    </label>
                    <span className="text-sm font-extrabold text-beebox-amber-400 font-mono">{weight} kg</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-beebox-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1 kg</span>
                    <span>50 kg</span>
                    <span>100 kg+</span>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Modalidad de Servicio
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                  >
                    <option value="Aéreo Express">Aéreo Express (Prioritario 24-96h)</option>
                    <option value="Aéreo Estándar">Aéreo Estándar (Consolidado 3-6 días)</option>
                    <option value="Marítimo">Marítimo Consolidado (5-10 días)</option>
                  </select>
                </div>
              </div>

              {/* Estimate Result Box */}
              <div className="rounded-2xl bg-beebox-navy-950 border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-xs text-slate-400 font-medium">Estimación Total Configurada:</span>
                  <div className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-1">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-beebox-amber-400" />
                    ) : (
                      <>
                        <span className="text-beebox-amber-400 font-mono">
                          ${calculation?.totalUSD ? calculation.totalUSD.toFixed(2) : "0.00"}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">USD</span>
                      </>
                    )}
                  </div>
                  {calculation && (
                    <p className="text-xs text-emerald-400 flex items-center justify-center md:justify-start gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tiempo estimado: {Math.round(calculation.deliveryHoursMin / 24)} - {Math.round(calculation.deliveryHoursMax / 24)} días hábiles
                    </p>
                  )}
                </div>

                <a href="/login" className="w-full md:w-auto">
                  <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                    Cotizar & Prealertar
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
