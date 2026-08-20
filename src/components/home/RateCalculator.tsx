"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const RateCalculator: React.FC = () => {
  const [origin, setOrigin] = useState("Santiago");
  const [destination, setDestination] = useState("Valparaíso");
  const [weight, setWeight] = useState(15);
  const [service, setService] = useState("express");
  const [calculated, setCalculated] = useState(false);

  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [deliveryMin, setDeliveryMin] = useState<number>(12);
  const [deliveryMax, setDeliveryMax] = useState<number>(24);

  const calculatePrice = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/quotes/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCity: origin,
          destinationCity: destination,
          weightKg: weight,
          serviceType: service,
        }),
      });
      const data = await res.json();
      if (res.ok && data.estimatedCostCLP) {
        setEstimatedCost(data.estimatedCostCLP);
        setDeliveryMin(data.deliveryHoursMin);
        setDeliveryMax(data.deliveryHoursMax);
        return;
      }
    } catch {
      // Fallback
    }

    const base = 12000;
    const weightCost = weight * 450;
    const isInterregional = origin !== destination;
    const distanceMult = isInterregional ? 1.4 : 1.0;
    const serviceMult = service === "express" ? 1.3 : service === "refrigerado" ? 1.5 : 1.1;

    const total = Math.round((base + weightCost) * distanceMult * serviceMult);
    setEstimatedCost(total);
  };

  React.useEffect(() => {
    calculatePrice();
  }, [origin, destination, weight, service]);

  const estimatedTotal = estimatedCost ?? Math.round((12000 + weight * 450) * (service === "express" ? 1.3 : 1.1));

  return (
    <section id="cotizador" className="py-20 relative bg-beebox-navy-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <Badge variant="amber">Cotizador en Línea</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calcula la Tarifa Estimada de tu Envío
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Obtén una estimación instantánea de costo y tiempo de entrega según la ruta y volumen de tu carga.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="border-beebox-amber-500/30 shadow-2xl">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Origin */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Ciudad de Origen
                  </label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                  >
                    <option value="Santiago">Santiago (Región Metropolitana)</option>
                    <option value="Valparaíso">Valparaíso / Viña del Mar</option>
                    <option value="Concepción">Concepción / Talcahuano</option>
                    <option value="Antofagasta">Antofagasta</option>
                    <option value="Puerto Montt">Puerto Montt</option>
                  </select>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Ciudad de Destino
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                  >
                    <option value="Valparaíso">Valparaíso / Viña del Mar</option>
                    <option value="Santiago">Santiago (Región Metropolitana)</option>
                    <option value="Concepción">Concepción / Talcahuano</option>
                    <option value="Antofagasta">Antofagasta</option>
                    <option value="Puerto Montt">Puerto Montt</option>
                  </select>
                </div>
              </div>

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
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-beebox-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>1 kg</span>
                    <span>250 kg</span>
                    <span>500 kg+</span>
                  </div>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Tipo de Servicio
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-beebox-navy-950 px-4 py-3 text-sm text-white focus:border-beebox-amber-500 focus:outline-none"
                  >
                    <option value="express">Transporte Express 24h</option>
                    <option value="carga-pesada">Carga Pesada & Palletizada</option>
                    <option value="ultima-milla">Distribución Última Milla</option>
                    <option value="refrigerado">Cadena de Frío</option>
                  </select>
                </div>
              </div>

              {/* Estimate Result Box */}
              <div className="rounded-2xl bg-beebox-navy-950 border border-slate-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-xs text-slate-400 font-medium">Estimación Total Aproximada:</span>
                  <div className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-1">
                    <span className="text-beebox-amber-400 font-mono">${estimatedTotal.toLocaleString("es-CL")}</span>
                    <span className="text-xs text-slate-400 font-normal">CLP + IVA</span>
                  </div>
                  <p className="text-xs text-emerald-400 flex items-center justify-center md:justify-start gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tiempo estimado: {service === "express" ? "12 - 24 horas" : "24 - 48 horas"}
                  </p>
                </div>

                <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                  Confirmar Reserva
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
