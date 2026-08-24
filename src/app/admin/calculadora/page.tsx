"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Save, CheckCircle2, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ApiRateConfig {
  id?: string;
  serviceType: string;
  basePrice: number;
  pricePerKg: number;
  insuranceRate: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export default function AdminCalculadoraPage() {
  const [rates, setRates] = useState<ApiRateConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [noticeMsg, setNoticeMsg] = useState<string | null>(null);

  // Form for editing rates
  const [selectedService, setSelectedService] = useState("Aéreo Express");
  const [basePrice, setBasePrice] = useState(25.0);
  const [pricePerKg, setPricePerKg] = useState(8.5);
  const [insuranceRate, setInsuranceRate] = useState(0.02);

  const fetchRates = () => {
    fetch(`${API_URL}/rates`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          setRates(data.rates);
          if (data.rates.length > 0) {
            const first = data.rates[0];
            setSelectedService(first.serviceType);
            setBasePrice(first.basePrice);
            setPricePerKg(first.pricePerKg);
            setInsuranceRate(first.insuranceRate || 0.02);
          }
        }
      })
      .catch(() => {
        setRates([
          { serviceType: "Aéreo Express", basePrice: 25.0, pricePerKg: 8.5, insuranceRate: 0.02 },
          { serviceType: "Aéreo Estándar", basePrice: 15.0, pricePerKg: 5.5, insuranceRate: 0.02 },
          { serviceType: "Marítimo", basePrice: 10.0, pricePerKg: 3.0, insuranceRate: 0.02 },
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    const found = rates.find((r) => r.serviceType === serviceName);
    if (found) {
      setBasePrice(found.basePrice);
      setPricePerKg(found.pricePerKg);
      setInsuranceRate(found.insuranceRate || 0.02);
    }
  };

  const handleSaveRates = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = typeof window !== "undefined" ? localStorage.getItem("beebox_token") : null;

    if (token) {
      try {
        const res = await fetch(`${API_URL}/rates`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceType: selectedService,
            basePrice: Number(basePrice),
            pricePerKg: Number(pricePerKg),
            insuranceRate: Number(insuranceRate),
          }),
        });
        if (res.ok) {
          setNoticeMsg(`Tarifas para '${selectedService}' actualizadas correctamente.`);
          fetchRates();
          setTimeout(() => setNoticeMsg(null), 4000);
        }
      } catch {
        setNoticeMsg("Error al actualizar tarifas.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Configuración de Tarifas Dinámicas</h1>
        <p className="text-xs font-semibold text-slate-500 mt-1">
          Administra las tarifas base, precio por kilogramo y porcentajes de seguro utilizados en las cotizaciones automáticas.
        </p>
      </div>

      {noticeMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {noticeMsg}
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
          <span className="text-xs font-bold">Cargando tarifas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Rate Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase">Modalidades Configuradas</h3>
            {rates.map((r) => (
              <div
                key={r.serviceType}
                onClick={() => handleSelectService(r.serviceType)}
                className={`p-5 rounded-3xl bg-white border-2 shadow-sm space-y-2 cursor-pointer transition-all ${
                  selectedService === r.serviceType ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">{r.serviceType}</h4>
                  <span className="text-xs font-mono font-black text-amber-600">${r.pricePerKg} USD/kg</span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-100">
                  <span>Base Fija: <strong>${r.basePrice} USD</strong></span>
                  <span>Seguro: <strong>{(r.insuranceRate * 100).toFixed(1)}%</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Rate Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-600" /> Editar Tarifa: {selectedService}
            </h3>

            <form onSubmit={handleSaveRates} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tipo de Servicio / Modalidad
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => handleSelectService(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-bold text-slate-900"
                >
                  <option value="Aéreo Express">Aéreo Express</option>
                  <option value="Aéreo Estándar">Aéreo Estándar</option>
                  <option value="Marítimo">Marítimo</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Precio Base Fijo ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Precio por Kilogramo ($ USD/kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    className="w-full rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="amber" className="w-full py-4 justify-center font-bold text-xs uppercase shadow-md">
                <Save className="w-4 h-4 mr-2" /> GUARDAR TARIFAS EN BASE DE DATOS
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
